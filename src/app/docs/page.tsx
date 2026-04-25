"use client";

import { motion } from "framer-motion";
import Link from "next/link";

export default function DocsPage() {
  const fadeUp = {
    hidden: { opacity: 0, y: 20 },
    show: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.5, ease: "easeOut" }
    }
  };

  return (
    <div className="min-h-screen bg-black text-white p-10 flex flex-col items-center">
      <motion.div 
        initial="hidden"
        animate="show"
        variants={fadeUp}
        className="max-w-3xl w-full"
      >
        <div className="mb-12">
          <Link href="/" className="text-emerald-500 hover:text-emerald-400 transition-colors font-bold text-sm mb-8 inline-block">
            ← Back to Home
          </Link>
          <h1 className="text-5xl font-black mb-4 tracking-tighter bg-gradient-to-r from-white to-zinc-500 bg-clip-text text-transparent">
            RouteGPT Documentation
          </h1>
          <p className="text-xl text-zinc-400 font-medium">
            Learn how to use RouteGPT for logistics risk detection and rerouting.
          </p>
        </div>

        <div className="space-y-12">
          <div className="bg-zinc-900/50 p-8 rounded-3xl border border-zinc-800">
            <h2 className="text-2xl font-bold mb-4 text-emerald-400">1. Select Disruptions</h2>
            <p className="text-zinc-300 leading-relaxed">
              Open the dashboard and use the control panel to toggle active disruptions such as **Cyclones**, **Gulf Conflict**, or **Suez Blockage**. These events are simulated with real-world coordinates and impact radii.
            </p>
          </div>

          <div className="bg-zinc-900/50 p-8 rounded-3xl border border-zinc-800">
            <h2 className="text-2xl font-bold mb-4 text-emerald-400">2. Apply Analysis</h2>
            <p className="text-zinc-300 leading-relaxed">
              Click the **Apply** button to trigger the risk assessment engine. RouteGPT will evaluate every shipment in your fleet, calculating proximity to disruptions and determining risk levels (Low, Medium, or High).
            </p>
          </div>

          <div className="bg-zinc-900/50 p-8 rounded-3xl border border-zinc-800">
            <h2 className="text-2xl font-bold mb-4 text-emerald-400">3. Reroute & Optimize</h2>
            <p className="text-zinc-300 leading-relaxed">
              For high-risk shipments, use the **Reroute** feature to find alternative paths. The Optimization panel will dynamically show improvements in **Delay**, **Cost**, and **Risk reduction**.
            </p>
          </div>
        </div>

        <div className="mt-20 pt-12 border-t border-zinc-900 text-center">
          <Link href="/dashboard">
            <motion.button 
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="px-8 py-4 bg-emerald-500 text-white font-bold rounded-2xl shadow-[0_0_30px_rgba(16,185,129,0.3)]"
            >
              Start Optimizing Now
            </motion.button>
          </Link>
        </div>
      </motion.div>
    </div>
  );
}
