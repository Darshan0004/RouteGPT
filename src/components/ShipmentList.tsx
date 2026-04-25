"use client";

import { Shipment, Disruption } from "@/types";
import { shipments } from "../app/data/shipments";
import { getShipmentRisk } from "@/utils/risk";

export default function ShipmentList({
  activeDisruptions = [],
  onSelect,
  selectedShipment,
}: {
  activeDisruptions: Disruption[];
  onSelect?: (shipment: Shipment) => void;
  selectedShipment?: Shipment | null;
}) {
  return (
    <>
      {shipments.map((shipment) => {
        const risk = getShipmentRisk(shipment, activeDisruptions);

        const displayRisk =
          activeDisruptions.length === 0 ? "Low" : risk;

        const badgeStyle =
          displayRisk === "High"
            ? "bg-red-500 text-white"
            : displayRisk === "Medium"
              ? "bg-yellow-400 text-black"
              : "bg-green-500 text-white";

        // 🔥 NEW: selected check
        const isSelected = selectedShipment?.id === shipment.id;

        return (
          <li
            key={`${shipment.id}-${displayRisk}`}
            onClick={() => onSelect?.(shipment)} // 🔥 CLICK HANDLER
            className={`
              bg-white dark:bg-zinc-800 
              border rounded-xl p-3 shadow-sm
              cursor-pointer transition-all duration-200
              ${isSelected
                ? "border-blue-400 scale-[1.03] ring-2 ring-blue-300 dark:ring-blue-600"
                : "border-gray-200 dark:border-zinc-700 hover:scale-[1.02]"
              }
            `}
          >
            <div className="flex justify-between items-center mb-1">
              <span className="font-semibold text-sm">{shipment.id}</span>

              <span
                className={`px-2 py-0.5 rounded-full text-xs font-semibold ${badgeStyle}`}
              >
                {displayRisk.toUpperCase()}
              </span>
            </div>

            <div className="text-sm">
              {shipment.origin.name} → {shipment.destination.name}
            </div>

            <div className="text-xs text-gray-400 dark:text-zinc-500">
              {shipment.carrier}
            </div>
          </li>
        );
      })}
    </>
  );
}