export type Location = {
  name: string;
  lat: number;
  lng: number;
};

export type Shipment = {
  id: string;
  origin: Location;
  destination: Location;
  carrier: string;
  risk: "Low" | "Medium" | "High";
};

export type Disruption = {
  id: string;
  name: string;
  lat: number;
  lng: number;
  radius: number;
};
