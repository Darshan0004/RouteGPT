import { Shipment, Disruption } from "@/types";

const calculateDistance = (
  lat1: number,
  lng1: number,
  lat2: number,
  lng2: number
) => {
  const R = 6371;

  const dLat = ((lat2 - lat1) * Math.PI) / 180;
  const dLng = ((lng2 - lng1) * Math.PI) / 180;

  const a =
    Math.sin(dLat / 2) ** 2 +
    Math.cos((lat1 * Math.PI) / 180) *
    Math.cos((lat2 * Math.PI) / 180) *
    Math.sin(dLng / 2) ** 2;

  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

  return R * c;
};

const isRouteAffected = (shipment: Shipment, disruption: Disruption): "Low" | "Medium" | "High" => {
  const points = [
    { lat: shipment.origin.lat, lng: shipment.origin.lng },
    { lat: shipment.destination.lat, lng: shipment.destination.lng },
    // Midpoint
    { 
      lat: (shipment.origin.lat + shipment.destination.lat) / 2, 
      lng: (shipment.origin.lng + shipment.destination.lng) / 2 
    },
    // Quarter 1
    { 
      lat: (shipment.origin.lat * 0.75 + shipment.destination.lat * 0.25), 
      lng: (shipment.origin.lng * 0.75 + shipment.destination.lng * 0.25) 
    },
    // Quarter 3
    { 
      lat: (shipment.origin.lat * 0.25 + shipment.destination.lat * 0.75), 
      lng: (shipment.origin.lng * 0.25 + shipment.destination.lng * 0.75) 
    }
  ];

  let minDistance = Infinity;
  points.forEach(p => {
    const d = calculateDistance(p.lat, p.lng, disruption.lat, disruption.lng);
    if (d < minDistance) minDistance = d;
  });

  if (minDistance < 800) {
    return "High";
  }
  
  if (minDistance < 1500) {
    return "Medium";
  }

  return "Low";
};

export const getShipmentRisk = (shipment: Shipment, activeDisruptions: Disruption[]): "Low" | "Medium" | "High" => {
  if (!activeDisruptions || activeDisruptions.length === 0) {
    return "Low"; 
  }

  let finalRisk: "Low" | "Medium" | "High" = "Low";

  activeDisruptions.forEach((d) => {
    const risk = isRouteAffected(shipment, d);

    if (risk === "High") {
      finalRisk = "High";
    } else if (risk === "Medium" && finalRisk !== "High") {
      finalRisk = "Medium";
    }
  });

  return finalRisk;
};