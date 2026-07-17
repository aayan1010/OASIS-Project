export const inventoryItems = [
  { id: "INV-001", name: "Sucker Rods (1-1/4\")", category: "Downhole Equipment", quantity: 240, unit: "units", reorderPoint: 100, location: "Warehouse A", status: "Adequate", lastOrdered: "2026-06-15" },
  { id: "INV-002", name: "Tubing Hangers", category: "Wellhead Parts", quantity: 85, unit: "units", reorderPoint: 50, location: "Warehouse A", status: "Adequate", lastOrdered: "2026-06-10" },
  { id: "INV-003", name: "Gearbox Oil (Synthetic 320)", category: "Lubricants", quantity: 18, unit: "drums", reorderPoint: 20, location: "Warehouse B", status: "Low Stock", lastOrdered: "2026-05-28" },
  { id: "INV-004", name: "Hydraulic Fluid (ISO 46)", category: "Lubricants", quantity: 32, unit: "drums", reorderPoint: 25, location: "Warehouse A", status: "Adequate", lastOrdered: "2026-06-01" },
  { id: "INV-005", name: "API Flange Gaskets (6\" Class 600)", category: "Sealing", quantity: 210, unit: "units", reorderPoint: 100, location: "Warehouse A", status: "Adequate", lastOrdered: "2026-06-18" },
  { id: "INV-006", name: "Compressor Valve Plates", category: "Compressor Parts", quantity: 6, unit: "sets", reorderPoint: 8, location: "Warehouse B", status: "Low Stock", lastOrdered: "2026-04-22" },
  { id: "INV-007", name: "Pump Packing Sets", category: "Pump Parts", quantity: 45, unit: "units", reorderPoint: 30, location: "Warehouse A", status: "Adequate", lastOrdered: "2026-06-08" },
  { id: "INV-008", name: "Separator Demister Pads", category: "Process Equipment", quantity: 3, unit: "units", reorderPoint: 4, location: "Warehouse B", status: "Low Stock", lastOrdered: "2026-05-15" },
  { id: "INV-009", name: "Safety Harnesses (Full Body)", category: "PPE", quantity: 55, unit: "units", reorderPoint: 40, location: "Warehouse A", status: "Adequate", lastOrdered: "2026-06-20" },
  { id: "INV-010", name: "H2S Detector Tubes", category: "Safety Equipment", quantity: 200, unit: "boxes", reorderPoint: 150, location: "Warehouse A", status: "Adequate", lastOrdered: "2026-06-12" },
  { id: "INV-011", name: "Chemical Corrosion Inhibitor", category: "Chemicals", quantity: 8, unit: "totes", reorderPoint: 10, location: "Warehouse A", status: "Low Stock", lastOrdered: "2026-06-05" },
  { id: "INV-012", name: "Gasket Kits (API Ring Type)", category: "Sealing", quantity: 160, unit: "units", reorderPoint: 80, location: "Warehouse A", status: "Adequate", lastOrdered: "2026-06-14" },
];

export const shipments = [
  { id: "SHP-2026-042", trackingNumber: "FEDX-8842-1092", origin: "Houston, TX", destination: "Warehouse A - Midland, TX", carrier: "FedEx Freight", items: 12, weight: "2,400 lbs", status: "In Transit", eta: "2026-06-27", progress: 78 },
  { id: "SHP-2026-043", trackingNumber: "UPSF-6721-3345", origin: "Dallas, TX", destination: "Warehouse B - Sweetwater, TX", carrier: "UPS Freight", items: 8, weight: "1,150 lbs", status: "Out for Delivery", eta: "2026-06-26", progress: 95 },
  { id: "SHP-2026-044", trackingNumber: "XDLE-2291-8873", origin: "Denver, CO", destination: "Warehouse A - Midland, TX", carrier: "XPO Logistics", items: 4, weight: "3,800 lbs", status: "In Transit", eta: "2026-06-28", progress: 45 },
  { id: "SHP-2026-045", trackingNumber: "FEDX-9103-4471", origin: "Houston, TX", destination: "Pump Station 3", carrier: "FedEx Express", items: 3, weight: "85 lbs", status: "Delivered", eta: "2026-06-25", progress: 100 },
  { id: "SHP-2026-046", trackingNumber: "UPSF-5518-2290", origin: "Chicago, IL", destination: "Compressor Station 1", carrier: "UPS Freight", items: 1, weight: "4,200 lbs", status: "In Transit", eta: "2026-06-29", progress: 32 },
  { id: "SHP-2026-047", trackingNumber: "SAIA-4472-6631", origin: "Phoenix, AZ", destination: "Gas Plant GP-01", carrier: "Saia LTL", items: 6, weight: "920 lbs", status: "Processing", eta: "2026-06-30", progress: 10 },
  { id: "SHP-2026-048", trackingNumber: "FEDX-7621-5089", origin: "Houston, TX", destination: "Compressor Station 2", carrier: "FedEx Freight", items: 15, weight: "5,600 lbs", status: "In Transit", eta: "2026-06-27", progress: 60 },
  { id: "SHP-2026-049", trackingNumber: "ESTE-3384-1152", origin: "Los Angeles, CA", destination: "Warehouse A - Midland, TX", carrier: "Estes Express", items: 20, weight: "8,100 lbs", status: "In Transit", eta: "2026-07-01", progress: 22 },
];

export const warehouses = [
  { id: "WH-A", name: "Warehouse A - Midland", capacity: "25,000 sq ft", utilization: 78, items: 1240, value: "$2.8M", status: "Operational" },
  { id: "WH-B", name: "Warehouse B - Sweetwater", capacity: "15,000 sq ft", utilization: 62, items: 680, value: "$1.4M", status: "Operational" },
  { id: "WH-C", name: "Warehouse C - Pecos", capacity: "12,000 sq ft", utilization: 91, items: 890, value: "$1.9M", status: "Near Capacity" },
  { id: "WH-D", name: "Warehouse D - San Angelo", capacity: "18,000 sq ft", utilization: 45, items: 520, value: "$980K", status: "Operational" },
];

export const deliveryPerformance = [
  { carrier: "FedEx Freight", onTime: 94, delayed: 4, lost: 2, total: 48 },
  { carrier: "UPS Freight", onTime: 91, delayed: 6, lost: 3, total: 35 },
  { carrier: "XPO Logistics", onTime: 88, delayed: 8, lost: 4, total: 29 },
  { carrier: "Saia LTL", onTime: 92, delayed: 5, lost: 3, total: 22 },
  { carrier: "Estes Express", onTime: 86, delayed: 9, lost: 5, total: 18 },
];

export const supplyChainAlerts = [
  { id: "SCA-001", item: "Gearbox Oil (Synthetic 320)", supplier: "Mobil Industrial", risk: "High", leadTime: "14 days", currentStatus: "Backordered", recommendation: "Source alternative supplier" },
  { id: "SCA-002", item: "Compressor Valve Plates", supplier: "Dresser-Rand", risk: "Medium", leadTime: "21 days", currentStatus: "Limited Stock", recommendation: "Place expedited order" },
  { id: "SCA-003", item: "Separator Demister Pads", supplier: "Koch-Glitsch", risk: "High", leadTime: "28 days", currentStatus: "Production Delay", recommendation: "Contact supplier for ETA update" },
  { id: "SCA-004", item: "Chemical Corrosion Inhibitor", supplier: "Nalco Champion", risk: "Medium", leadTime: "10 days", currentStatus: "In Transit", recommendation: "Monitor delivery status" },
  { id: "SCA-005", item: "Pump Packing Sets", supplier: "John Crane", risk: "Low", leadTime: "7 days", currentStatus: "In Stock", recommendation: "No action needed" },
];