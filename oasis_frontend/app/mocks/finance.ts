export const monthlyBudget = [
  { month: "Jan", budget: 1250000, actual: 1210000 },
  { month: "Feb", budget: 1280000, actual: 1310000 },
  { month: "Mar", budget: 1300000, actual: 1275000 },
  { month: "Apr", budget: 1320000, actual: 1290000 },
  { month: "May", budget: 1350000, actual: 1335000 },
  { month: "Jun", budget: 1380000, actual: 1240000 },
];

export const opexBreakdown = [
  { category: "Maintenance & Repairs", amount: 385000, percentage: 31, color: "#0d9488" },
  { category: "Labor & Crews", amount: 292000, percentage: 24, color: "#f59e0b" },
  { category: "Equipment Rental", amount: 156000, percentage: 13, color: "#64748b" },
  { category: "Chemicals & Consumables", amount: 118000, percentage: 10, color: "#14b8a6" },
  { category: "Logistics & Transport", amount: 95000, percentage: 8, color: "#d97706" },
  { category: "Safety & Compliance", amount: 65000, percentage: 5, color: "#475569" },
  { category: "Utilities", amount: 58000, percentage: 5, color: "#0f766e" },
  { category: "Other", amount: 51000, percentage: 4, color: "#94a3b8" },
];

export const revenueStreams = [
  { stream: "Crude Oil Sales", amount: 2100000, percentage: 42, growth: "+4.2%" },
  { stream: "Natural Gas Sales", amount: 1250000, percentage: 25, growth: "+2.8%" },
  { stream: "NGL Sales", amount: 620000, percentage: 12, growth: "+3.5%" },
  { stream: "Condensate Sales", amount: 480000, percentage: 10, growth: "+1.8%" },
  { stream: "Pipeline Tariffs", amount: 320000, percentage: 6, growth: "+5.1%" },
  { stream: "Carbon Credits", amount: 230000, percentage: 5, growth: "+18.7%" },
];

export const monthlyRevenueData = [
  { month: "Jan", oil: 2050000, gas: 1180000, ngl: 580000, condensate: 450000 },
  { month: "Feb", oil: 1980000, gas: 1150000, ngl: 590000, condensate: 440000 },
  { month: "Mar", oil: 2120000, gas: 1220000, ngl: 610000, condensate: 470000 },
  { month: "Apr", oil: 2080000, gas: 1200000, ngl: 600000, condensate: 460000 },
  { month: "May", oil: 2150000, gas: 1270000, ngl: 625000, condensate: 480000 },
  { month: "Jun", oil: 2100000, gas: 1250000, ngl: 618000, condensate: 475000 },
];

export const capexProjects = [
  { id: "CPX-001", name: "Pump Station 4 Expansion", category: "Infrastructure", budget: 850000, spent: 620000, progress: 73, status: "On Track", expectedCompletion: "2026-09" },
  { id: "CPX-002", name: "Gas Compression Upgrade Phase 2", category: "Infrastructure", budget: 1200000, spent: 650000, progress: 54, status: "On Track", expectedCompletion: "2026-12" },
  { id: "CPX-003", name: "SCADA System Upgrade", category: "Digital", budget: 450000, spent: 380000, progress: 84, status: "On Track", expectedCompletion: "2026-08" },
  { id: "CPX-004", name: "Pipeline Integrity Program", category: "Infrastructure", budget: 680000, spent: 710000, progress: 92, status: "Over Budget", expectedCompletion: "2026-07" },
  { id: "CPX-005", name: "Well Stimulation Campaign", category: "Production", budget: 950000, spent: 320000, progress: 34, status: "On Track", expectedCompletion: "2027-01" },
];

export const costPerUnit = [
  { asset: "Pump Station 1", liftingCost: 12.8, target: 13.5, unit: "$/bbl" },
  { asset: "Pump Station 2", liftingCost: 14.2, target: 13.5, unit: "$/bbl" },
  { asset: "Pump Station 3", liftingCost: 11.5, target: 13.5, unit: "$/bbl" },
  { asset: "Wellhead WH-22", liftingCost: 9.8, target: 10.5, unit: "$/bbl" },
  { asset: "Wellhead WH-45", liftingCost: 11.2, target: 10.5, unit: "$/bbl" },
  { asset: "Compressor Stn 1", opsCost: 4.8, target: 5.2, unit: "$/MCF" },
  { asset: "Compressor Stn 2", opsCost: 5.6, target: 5.2, unit: "$/MCF" },
  { asset: "Gas Plant GP-01", opsCost: 0.42, target: 0.45, unit: "$/MCF" },
  { asset: "Separator SP-05", opsCost: 3.2, target: 3.5, unit: "$/bbl" },
];