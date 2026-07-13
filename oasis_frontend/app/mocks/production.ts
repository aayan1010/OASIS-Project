export const hourlyProduction = [
  { hour: "00:00", oil: 352, gas: 485 },
  { hour: "02:00", oil: 348, gas: 478 },
  { hour: "04:00", oil: 355, gas: 482 },
  { hour: "06:00", oil: 358, gas: 490 },
  { hour: "08:00", oil: 362, gas: 495 },
  { hour: "10:00", oil: 359, gas: 488 },
  { hour: "12:00", oil: 356, gas: 480 },
  { hour: "14:00", oil: 354, gas: 476 },
  { hour: "16:00", oil: 351, gas: 472 },
  { hour: "18:00", oil: 349, gas: 468 },
  { hour: "20:00", oil: 347, gas: 470 },
  { hour: "22:00", oil: 350, gas: 475 },
];

export const dailyYieldComparison = [
  { date: "Jun 20", actual: 12450, target: 12800 },
  { date: "Jun 21", actual: 12100, target: 12800 },
  { date: "Jun 22", actual: 13020, target: 12800 },
  { date: "Jun 23", actual: 12580, target: 12800 },
  { date: "Jun 24", actual: 12710, target: 12800 },
  { date: "Jun 25", actual: 11980, target: 12800 },
  { date: "Jun 26", actual: 12450, target: 12800 },
];

export const throughputByAsset = [
  { asset: "Pump Station 1", type: "Oil", throughput: 2850, unit: "bbl/day", efficiency: 94, status: "Normal" },
  { asset: "Pump Station 2", type: "Oil", throughput: 2340, unit: "bbl/day", efficiency: 88, status: "Degraded" },
  { asset: "Pump Station 3", type: "Oil", throughput: 3120, unit: "bbl/day", efficiency: 97, status: "Normal" },
  { asset: "Wellhead WH-22", type: "Oil", throughput: 1245, unit: "bbl/day", efficiency: 91, status: "Normal" },
  { asset: "Wellhead WH-45", type: "Oil", throughput: 980, unit: "bbl/day", efficiency: 85, status: "Normal" },
  { asset: "Compressor Stn 1", type: "Gas", throughput: 1850, unit: "MCF/day", efficiency: 92, status: "Normal" },
  { asset: "Compressor Stn 2", type: "Gas", throughput: 1620, unit: "MCF/day", efficiency: 86, status: "Normal" },
  { asset: "Gas Plant GP-01", type: "Gas", throughput: 485, unit: "MMcf/day", efficiency: 95, status: "Normal" },
  { asset: "Separator SP-05", type: "Oil", throughput: 1580, unit: "bbl/day", efficiency: 89, status: "Normal" },
  { asset: "Pump Jack PJ-12A", type: "Oil", throughput: 720, unit: "bbl/day", efficiency: 93, status: "Normal" },
];

export const downtimeEvents = [
  { id: "DT-001", asset: "Pump Station 2", sector: "Upstream", startTime: "2026-06-26 08:15", duration: "2.5 hrs", reason: "Bearing Replacement", impact: "$4,200", status: "Resolved" },
  { id: "DT-002", asset: "Wellhead WH-45", sector: "Upstream", startTime: "2026-06-25 14:30", duration: "4.0 hrs", reason: "Casing Repair", impact: "$3,100", status: "Resolved" },
  { id: "DT-003", asset: "Separator SP-05", sector: "Midstream", startTime: "2026-06-24 10:00", duration: "3.2 hrs", reason: "Control Valve Failure", impact: "$5,800", status: "Resolved" },
  { id: "DT-004", asset: "Compressor Stn 2", sector: "Midstream", startTime: "2026-06-26 06:45", duration: "1.8 hrs", reason: "Valve Stuck", impact: "$2,100", status: "In Progress" },
  { id: "DT-005", asset: "Pump Station 1", sector: "Upstream", startTime: "2026-06-23 22:00", duration: "1.2 hrs", reason: "Sensor Calibration", impact: "$950", status: "Resolved" },
];

export const scheduleAdherence = [
  { shift: "Day (06-14)", planned: 4250, actual: 4180, adherence: 98.4 },
  { shift: "Afternoon (14-22)", planned: 4100, actual: 3850, adherence: 93.9 },
  { shift: "Night (22-06)", planned: 3950, actual: 3780, adherence: 95.7 },
];