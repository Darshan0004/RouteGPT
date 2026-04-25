import { Shipment } from "@/types";

export const shipments: Shipment[] = [
    {
        id: "SHP-001",
        origin: { name: "Shanghai", lat: 31.2304, lng: 121.4737 },
        destination: { name: "Rotterdam", lat: 51.9244, lng: 4.4777 },
        carrier: "COSCO",
        risk: "Low",
    },
    {
        id: "SHP-002",
        origin: { name: "Mumbai", lat: 19.076, lng: 72.8777 },
        destination: { name: "Dubai", lat: 25.2048, lng: 55.2708 },
        carrier: "Maersk",
        risk: "Medium",
    },
    {
        id: "SHP-003",
        origin: { name: "Singapore", lat: 1.3521, lng: 103.8198 },
        destination: { name: "Los Angeles", lat: 34.0522, lng: -118.2437 },
        carrier: "MSC",
        risk: "High",
    },
    {
        id: "SHP-004",
        origin: { name: "Chennai", lat: 13.0827, lng: 80.2707 },
        destination: { name: "Hamburg", lat: 53.5511, lng: 9.9937 },
        carrier: "Hapag-Lloyd",
        risk: "Medium",
    },
    {
        id: "SHP-005",
        origin: { name: "Tokyo", lat: 35.6762, lng: 139.6503 },
        destination: { name: "Sydney", lat: -33.8688, lng: 151.2093 },
        carrier: "NYK Line",
        risk: "Low",
    },
];