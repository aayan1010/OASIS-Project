export interface Site {
  id: string;
  name: string;
  type: string;
  location: string;
  status: string;
  assetCount: number;
  manager: string;
  lat: number;
  lng: number;
}

export const sites: Site[] = [
  {
    id: "SITE-001",
    name: "Permian Basin Field Station",
    type: "Oil Field",
    location: "Midland, TX",
    status: "Active",
    assetCount: 22,
    manager: "Rachel Ortiz",
    lat: 31.9973,
    lng: -102.0779,
  },
  {
    id: "SITE-002",
    name: "Eagle Ford Processing Facility",
    type: "Processing Facility",
    location: "Karnes City, TX",
    status: "Active",
    assetCount: 28,
    manager: "Daniel Fischer",
    lat: 28.885,
    lng: -97.9011,
  },
  {
    id: "SITE-003",
    name: "Bakken Ridge Field Station",
    type: "Oil Field",
    location: "Williston, ND",
    status: "Active",
    assetCount: 21,
    manager: "Priya Nair",
    lat: 48.147,
    lng: -103.618,
  },
  {
    id: "SITE-004",
    name: "Gulfstream Pipeline Station",
    type: "Pipeline Station",
    location: "Beaumont, TX",
    status: "Active",
    assetCount: 15,
    manager: "Marcus Webb",
    lat: 30.0802,
    lng: -94.1266,
  },
  {
    id: "SITE-005",
    name: "Cushing Refinery Complex",
    type: "Refinery",
    location: "Cushing, OK",
    status: "Active",
    assetCount: 17,
    manager: "Lauren Sato",
    lat: 35.9856,
    lng: -96.7664,
  },
  {
    id: "SITE-006",
    name: "Delaware Basin Field Station",
    type: "Oil Field",
    location: "Pecos, TX",
    status: "Maintenance",
    assetCount: 11,
    manager: "Tom Reilly",
    lat: 31.423,
    lng: -103.4932,
  },
  {
    id: "SITE-007",
    name: "Marcellus Processing Facility",
    type: "Processing Facility",
    location: "Washington, PA",
    status: "Active",
    assetCount: 24,
    manager: "Angela Brooks",
    lat: 40.174,
    lng: -80.2463,
  },
  {
    id: "SITE-008",
    name: "Gulf Coast Pipeline Junction",
    type: "Pipeline Station",
    location: "Corpus Christi, TX",
    status: "Active",
    assetCount: 12,
    manager: "Ken Okafor",
    lat: 27.8006,
    lng: -97.3964,
  },
];