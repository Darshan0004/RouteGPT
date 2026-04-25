"use client";

import { useEffect, useState } from "react";
import { MapContainer, TileLayer, Polyline, Circle, useMap } from "react-leaflet";
import { shipments } from "../app/data/shipments";
import { getShipmentRisk } from "@/utils/risk";

// 🔥 NEW COMPONENT: AUTO ZOOM
function FlyToSelected({ selectedShipment }: any) {
  const map = useMap();

  useEffect(() => {
    if (!selectedShipment) return;

    map.flyTo(
      [
        selectedShipment.origin.lat,
        selectedShipment.origin.lng
      ],
      4,
      { duration: 1.5 }
    );
  }, [selectedShipment, map]);

  return null;
}

export default function Map({
  activeDisruptions = [],
  rerouted = false,
  selectedShipment = null,
}: {
  activeDisruptions: any[];
  rerouted?: boolean;
  selectedShipment?: any;
}) {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return null;

  return (
    <MapContainer
      center={[20, 45]}
      zoom={2}
      className="w-full h-full z-0 bg-[#aad3df]"
      zoomControl={false}
      minZoom={2}
    >
      <TileLayer
        attribution="&copy; OpenStreetMap contributors"
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />

      {/* 🔥 AUTO ZOOM */}
      <FlyToSelected selectedShipment={selectedShipment} />

      {/* Routes */}
      {shipments.map((shipment) => {
        const risk =
          activeDisruptions.length === 0
            ? "Low"
            : getShipmentRisk(shipment, activeDisruptions);

        const isSelected = selectedShipment?.id === shipment.id;

        let color = "blue";
        if (risk === "High") {
          color = rerouted ? "green" : "red";
        } else if (risk === "Medium") {
          color = "orange";
        }

        // 🔥 highlight override
        if (isSelected && !rerouted) {
          color = "yellow";
        } else if (isSelected && rerouted) {
          color = "#32cd32"; // brighter green
        }

        let positions = [
          [shipment.origin.lat, shipment.origin.lng],
          [shipment.destination.lat, shipment.destination.lng],
        ];

        if (rerouted && risk === "High") {
          let lngDist = shipment.destination.lng - shipment.origin.lng;
          const isPacific = shipment.origin.lng > 70 && shipment.destination.lng < -100;
          if (isPacific) {
            lngDist = (shipment.destination.lng + 360) - shipment.origin.lng;
          }
          const midLat = (shipment.origin.lat + shipment.destination.lat) / 2 + 15; // detour north
          let midLng = shipment.origin.lng + lngDist / 2;
          if (midLng > 180) midLng -= 360;

          positions = [
            [shipment.origin.lat, shipment.origin.lng],
            [midLat, midLng],
            [shipment.destination.lat, shipment.destination.lng],
          ];
        }

        return (
          <Polyline
            key={`${shipment.id}-${risk}-${rerouted}-${isSelected}`}
            positions={positions as [number, number][]}
            pathOptions={{ color }}
            weight={isSelected ? 7 : 4}
            opacity={isSelected ? 1 : 0.8}
          />
        );
      })}

      {/* Disruptions */}
      {activeDisruptions.map((d) => (
        <Circle
          key={d.id}
          center={[d.lat, d.lng]}
          radius={d.radius}
          pathOptions={{
            color: "red",
            fillColor: "red",
            fillOpacity: 0.3,
          }}
        />
      ))}
    </MapContainer>
  );
}