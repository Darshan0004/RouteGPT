"use client";

import { Shipment, Disruption } from "@/types";
import { useState, useEffect, useMemo } from "react";
import ShipmentList from "../../components/ShipmentList";
import dynamic from "next/dynamic";
import { shipments } from "../data/shipments";
import { getShipmentRisk } from "@/utils/risk";

const MapComponent = dynamic(() => import("../../components/Map"), { ssr: false });

function calculateOptimizationMetrics(shipments: Shipment[], disruptions: Disruption[]) {
  let highRisk = 0;
  let mediumRisk = 0;

  shipments.forEach((s) => {
    const risk = getShipmentRisk(s, disruptions);
    if (risk === "High") highRisk++;
    if (risk === "Medium") mediumRisk++;
  });

  // Calculate reductions
  const delayReduction = (highRisk * 12 + mediumRisk * 6);
  const costReduction = Math.min(25, highRisk * 5 + mediumRisk * 2);
  const riskReduction = Math.round((highRisk / (shipments.length || 1)) * 100);

  return { 
    delay: delayReduction, 
    cost: costReduction, 
    risk: riskReduction,
    activeCount: highRisk + mediumRisk 
  };
}

export default function Page() {
  // =========================
  // 🔥 STATE
  // =========================
  const [activeDisruptions, setActiveDisruptions] = useState<Disruption[]>([]);
  const [selectedTypes, setSelectedTypes] = useState<string[]>([]);
  const [rerouted, setRerouted] = useState(false);
  const [selectedShipment, setSelectedShipment] = useState<Shipment | null>(null);

  const [messages, setMessages] = useState<string[]>([
    "Hello! I can help you manage your shipments on the map.",
  ]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);

  const optimizationMetrics = useMemo(() => {
    return calculateOptimizationMetrics(shipments, activeDisruptions);
  }, [activeDisruptions]);

  // =========================
  // 🔥 CHECK HIGH RISK
  // =========================
  const hasHighRisk =
    activeDisruptions.length > 0 &&
    shipments.some((s) => getShipmentRisk(s, activeDisruptions) === "High");

  // =========================
  // ✅ AI SHIPMENT EXPLAIN
  // =========================
  useEffect(() => {
    if (!selectedShipment) return;

    const explainShipment = async () => {
      setMessages((prev) => [
        ...prev,
        `📍 ${selectedShipment.id} selected. Analyzing route...`,
      ]);

      const risk = getShipmentRisk(selectedShipment, activeDisruptions);

      if (activeDisruptions.length === 0) {
        setMessages((prev) => [
          ...prev,
          `✅ ${selectedShipment.id} operating normally. No disruptions.`,
        ]);
        return;
      }

      const disruptionText = activeDisruptions
        .map((d) => d.name)
        .join(", ");

      const explainPrompt = [
        "You are RouteGPT AI.",
        "",
        "ACTIVE DISRUPTIONS:",
        disruptionText,
        "",
        "SHIPMENT:",
        `${selectedShipment.id} (${selectedShipment.origin.name} -> ${selectedShipment.destination.name})`,
        "",
        "Risk: " + risk,
        "",
        "Rules:",
        "- LOW → say NOT affected",
        "- MEDIUM/HIGH → explain why",
        "- Mention ONLY active disruptions",
        "- One short action",
        "",
        "Max 25 words.",
      ].join("\n");

      try {
        const res = await fetch("/api/chat", {
          method: "POST",
          body: JSON.stringify({
            message: explainPrompt,
            disruptions: disruptionText,
          }),
        });

        const data = await res.json();
        setMessages((prev) => [...prev, data.reply]);
      } catch {
        setMessages((prev) => [
          ...prev,
          `⚠️ ${selectedShipment.id} risk: ${risk}.`,
        ]);
      }
    };

    explainShipment();
  }, [selectedShipment, activeDisruptions]);

  // =========================
  // 🔥 TOGGLE DISRUPTION
  // =========================
  const toggleType = (type: string) => {
    setSelectedTypes((prev) =>
      prev.includes(type)
        ? prev.filter((t) => t !== type)
        : [...prev, type]
    );
  };

  // =========================
  // 🔥 APPLY DISRUPTIONS
  // =========================
  const handleApply = async () => {
    const disruptions: Disruption[] = [];

    if (selectedTypes.includes("cyclone")) {
      disruptions.push({
        id: "D1",
        name: "Cyclone",
        lat: 15,
        lng: 85,
        radius: 800000,
      });
    }

    if (selectedTypes.includes("gulf")) {
      disruptions.push({
        id: "D2",
        name: "Gulf Conflict",
        lat: 25,
        lng: 55,
        radius: 1200000,
      });
    }

    if (selectedTypes.includes("suez")) {
      disruptions.push({
        id: "D3",
        name: "Suez Blockage",
        lat: 30,
        lng: 32.5,
        radius: 500000,
      });
    }

    setActiveDisruptions(disruptions);
    setRerouted(false);
    setSelectedShipment(null);

    if (disruptions.length === 0) {
      setMessages((prev) => {
        if (prev[prev.length - 1] === "All shipments operating normally.") return prev;
        return [...prev, "All shipments operating normally."];
      });
      return;
    }

    const activeNames = disruptions.map((d) => d.name).join(" & ");

    setMessages((prev) => {
      const newMsg = `⚠️ Evaluating: ${activeNames}...`;
      if (prev[prev.length - 1] === newMsg) return prev;
      return [...prev, newMsg];
    });

    setLoading(true);

    try {
      const prompt = [
        "You are RouteGPT.",
        "",
        "ACTIVE DISRUPTIONS:",
        activeNames,
        "",
        "RULES:",
        "- ONLY use these disruptions",
        "- If Gulf → DO NOT mention Cyclone",
        "- If Cyclone → DO NOT mention Gulf",
        "- If both → mention both",
        "- If none → say all safe",
        "",
        "OUTPUT:",
        "",
        "⚠️ Risk:",
        "- affected IDs",
        "",
        "🚀 Action:",
        "- 2 steps",
        "",
        "📊 Impact:",
        "- 1 short line",
        "",
        "Max 40 words.",
      ].join("\n");

      const res = await fetch("/api/chat", {
        method: "POST",
        body: JSON.stringify({
          message: prompt,
          disruptions: activeNames,
        }),
      });
      const data = await res.json();
      setMessages((prev) => {
        if (prev[prev.length - 1] === data.reply) return prev;
        return [...prev, data.reply];
      });
    } catch {
      setMessages((prev) => [...prev, "❌ Error getting AI response"]);
    }
    setLoading(false);
  };

  // =========================
  // 🔥 REROUTE
  // =========================
  const handleReroute = () => {
    setRerouted(true);

    setMessages((prev) => [
      ...prev,
      "🚀 Reroute applied: High-risk shipments diverted.",
      "🧠 Routes adjusted to avoid disruption zones.",
    ]);
  };

  // =========================
  // 🔥 CLEAR
  // =========================
  const handleClear = () => {
    setActiveDisruptions([]);
    setSelectedTypes([]);
    setRerouted(false);
    setSelectedShipment(null);

    setMessages((prev) => [...prev, "✅ System reset."]);
  };

  // =========================
  // ✅ SEND MESSAGE
  // =========================
  const sendMessage = async () => {
    if (!input.trim()) return;

    const userMessage = input;

    setMessages((prev) => {
      if (prev[prev.length - 1] === userMessage) return prev;
      return [...prev, userMessage];
    });
    setInput("");
    setLoading(true);

    try {
      const activeNames =
        activeDisruptions.map((d) => d.name).join(" & ") || "None";

      const prompt = [
        "Context - Active Disruptions:",
        activeNames,
        "User says:",
        userMessage,
      ].join("\n");

      const res = await fetch("/api/chat", {
        method: "POST",
        body: JSON.stringify({
          message: prompt,
          disruptions: activeNames,
        }),
      });

      const data = await res.json();
      setMessages((prev) => {
        if (prev[prev.length - 1] === data.reply) return prev;
        return [...prev, data.reply];
      });
    } catch {
      setMessages((prev) => {
        const errMsg = "❌ Error getting AI response";
        if (prev[prev.length - 1] === errMsg) return prev;
        return [...prev, errMsg];
      });
    }

    setLoading(false);
  };

  // =========================
  // UI
  // =========================
  return (
    <main className="flex flex-col xl:flex-row h-screen w-full bg-white dark:bg-zinc-950 text-zinc-900 dark:text-zinc-100">

      {/* LEFT PANEL */}
      <aside className="w-full xl:w-[280px] bg-gray-50 dark:bg-zinc-900 border-r p-4 flex flex-col">
        <h2 className="text-lg font-bold mb-4">Shipments</h2>

        <ul className="space-y-3 overflow-y-auto flex-1">
          <ShipmentList
            activeDisruptions={activeDisruptions}
            onSelect={setSelectedShipment}
            selectedShipment={selectedShipment}
          />
        </ul>
      </aside>

      {/* CENTER */}
      <section className="flex-1 flex flex-col p-4">

        {/* BUTTONS */}
        <div className="flex gap-3 mb-4 flex-wrap">

          <button
            onClick={() => toggleType("cyclone")}
            className={`px-4 py-2 rounded-xl font-semibold transition-all duration-200 ${selectedTypes.includes("cyclone")
                ? "bg-red-500 text-white scale-105 ring-4 ring-red-300 dark:ring-red-900"
                : "bg-gray-200 text-gray-700 hover:bg-gray-300 dark:bg-zinc-800 dark:text-zinc-300 dark:hover:bg-zinc-700"
              }`}
          >
            Cyclone
          </button>

          <button
            onClick={() => toggleType("gulf")}
            className={`px-4 py-2 rounded-xl font-semibold transition-all duration-200 ${selectedTypes.includes("gulf")
                ? "bg-yellow-500 text-white scale-105 ring-4 ring-yellow-300 dark:ring-yellow-900"
                : "bg-gray-200 text-gray-700 hover:bg-gray-300 dark:bg-zinc-800 dark:text-zinc-300 dark:hover:bg-zinc-700"
              }`}
          >
            Gulf Conflict
          </button>

          <button
            onClick={() => toggleType("suez")}
            className={`px-4 py-2 rounded-xl font-semibold transition-all duration-200 ${selectedTypes.includes("suez")
                ? "bg-orange-500 text-white scale-105 ring-4 ring-orange-300 dark:ring-orange-900"
                : "bg-gray-200 text-gray-700 hover:bg-gray-300 dark:bg-zinc-800 dark:text-zinc-300 dark:hover:bg-zinc-700"
              }`}
          >
            Suez Blockage
          </button>

          <button
            onClick={handleApply}
            className="px-4 py-2 bg-blue-500 text-white rounded-xl"
          >
            Apply
          </button>

          {hasHighRisk && !rerouted && (
            <button
              onClick={handleReroute}
              className="px-4 py-2 bg-green-600 text-white rounded-xl"
            >
              Reroute
            </button>
          )}

          <button
            onClick={handleClear}
            className="px-4 py-2 bg-gray-200 rounded-xl"
          >
            Clear
          </button>
        </div>

        {/* MAP */}
        <div className="flex-1 rounded-2xl overflow-hidden border">
          <MapComponent
            activeDisruptions={activeDisruptions}
            rerouted={rerouted}
            selectedShipment={selectedShipment}
          />
        </div>
      </section>

      {/* RIGHT PANEL */}
      <aside className="w-full xl:w-[360px] bg-gray-50 dark:bg-zinc-900 border-l p-4 flex flex-col">

        <h2 className="text-lg font-bold mb-4">RouteGPT Chat</h2>

        <div className="flex-1 flex flex-col space-y-3 overflow-y-auto mb-3">
          {messages.map((msg, i) => (
            <div
              key={i}
              className="bg-gray-100 dark:bg-zinc-700 rounded-xl p-3 text-sm whitespace-pre-line"
            >
              {msg}
            </div>
          ))}

          {loading && (
            <div className="text-sm text-gray-400">
              AI is typing...
            </div>
          )}
        </div>

        {/* OPTIMIZATION PANEL */}
        {rerouted && optimizationMetrics.activeCount > 0 && (
          <div className="mb-3 p-4 rounded-2xl bg-emerald-500/10 dark:bg-emerald-900/20 border border-emerald-500/20 shadow-[0_0_15px_rgba(16,185,129,0.1)]">
            <div className="text-xs font-bold text-emerald-500 uppercase tracking-widest mb-3 flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
              Live Optimization
            </div>

            <div className="grid grid-cols-1 gap-3">
              <div className="flex justify-between items-center bg-white/5 p-2 rounded-xl border border-white/5">
                <span className="text-xs text-zinc-400">Delay reduction</span>
                <span className="text-sm font-black text-emerald-400">↓ {optimizationMetrics.delay} hrs</span>
              </div>
              <div className="flex justify-between items-center bg-white/5 p-2 rounded-xl border border-white/5">
                <span className="text-xs text-zinc-400">Cost efficiency</span>
                <span className="text-sm font-black text-emerald-400">↓ {optimizationMetrics.cost}%</span>
              </div>
              <div className="flex justify-between items-center bg-white/5 p-2 rounded-xl border border-white/5">
                <span className="text-xs text-zinc-400">Risk mitigation</span>
                <span className="text-sm font-black text-emerald-400">↓ {optimizationMetrics.risk}%</span>
              </div>
            </div>
          </div>
        )}

        <div className="flex gap-2 mt-auto">
          <input
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) =>
              e.key === "Enter" && sendMessage()
            }
            placeholder="Ask..."
            className="flex-1 p-2 rounded-lg border dark:bg-zinc-900"
          />

          <button
            onClick={sendMessage}
            className="px-4 py-2 bg-blue-500 text-white rounded-lg"
          >
            Send
          </button>
        </div>
      </aside>
    </main>
  );
}