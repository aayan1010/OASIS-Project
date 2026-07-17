export interface ProductionRecord {
  id: string;
  siteId: string;
  date: string;
  target: number;
  actual: number;
  efficiency: number;
  downtimeHours: number;
  energyUsed: number;
}

// Raw production data from CSV (representative sample across all sites, recent dates)
const rawProduction: [string, string, string, number, number, number, number, number][] = [
  // SITE-001 recent (Jun 20 - Jul 12)
  ["PRD-000070", "SITE-001", "2026-06-22", 3715.9, 3136.9, 84.4, 3.2, 3428.8],
  ["PRD-000071", "SITE-001", "2026-06-23", 3714.1, 3643.1, 98.1, 0.0, 3825.1],
  ["PRD-000072", "SITE-001", "2026-06-24", 3725.8, 3122.7, 83.8, 2.8, 3223.2],
  ["PRD-000073", "SITE-001", "2026-06-25", 3755.7, 3805.1, 101.3, 0.0, 4059.4],
  ["PRD-000074", "SITE-001", "2026-06-26", 3816.8, 3931.1, 103.0, 0.4, 4270.7],
  ["PRD-000075", "SITE-001", "2026-06-27", 3696.6, 3749.2, 101.4, 0.0, 3839.3],
  ["PRD-000076", "SITE-001", "2026-06-28", 3726.1, 3692.6, 99.1, 0.0, 3991.6],
  ["PRD-000077", "SITE-001", "2026-06-29", 3818.1, 3792.3, 99.3, 0.0, 3863.1],
  ["PRD-000078", "SITE-001", "2026-06-30", 3777.5, 3826.5, 101.3, 0.0, 4286.5],
  ["PRD-000079", "SITE-001", "2026-07-01", 3692.3, 3710.5, 100.5, 0.5, 4121.2],
  ["PRD-000080", "SITE-001", "2026-07-02", 3673.8, 3708.4, 100.9, 0.0, 4013.5],
  ["PRD-000081", "SITE-001", "2026-07-03", 3674.6, 3697.8, 100.6, 0.0, 4119.4],
  ["PRD-000082", "SITE-001", "2026-07-04", 3711.9, 3897.5, 105.0, 0.0, 3981.6],
  ["PRD-000083", "SITE-001", "2026-07-05", 3676.2, 3735.4, 101.6, 0.0, 4114.7],
  ["PRD-000084", "SITE-001", "2026-07-06", 3745.7, 3624.0, 96.7, 0.6, 3967.4],
  ["PRD-000085", "SITE-001", "2026-07-07", 3815.7, 4006.5, 105.0, 0.0, 4490.9],
  ["PRD-000086", "SITE-001", "2026-07-08", 3808.8, 3638.2, 95.5, 0.0, 3929.0],
  ["PRD-000087", "SITE-001", "2026-07-09", 3801.6, 3991.7, 105.0, 0.0, 4227.7],
  ["PRD-000088", "SITE-001", "2026-07-10", 3734.7, 3763.3, 100.8, 0.0, 3845.6],
  ["PRD-000089", "SITE-001", "2026-07-11", 3693.6, 3706.5, 100.4, 0.0, 3968.7],
  ["PRD-000090", "SITE-001", "2026-07-12", 3675.3, 3265.3, 88.8, 2.6, 3649.3],
  // SITE-002 recent (Jun 20 - Jul 12)
  ["PRD-000161", "SITE-002", "2026-06-20", 10988.5, 9875.5, 89.9, 2.2, 11022.2],
  ["PRD-000162", "SITE-002", "2026-06-21", 11306.4, 9908.5, 87.6, 2.6, 11666.5],
  ["PRD-000163", "SITE-002", "2026-06-22", 11987.6, 11952.2, 99.7, 0.0, 13973.0],
  ["PRD-000164", "SITE-002", "2026-06-23", 11976.7, 11584.9, 96.7, 0.0, 13050.1],
  ["PRD-000165", "SITE-002", "2026-06-24", 12359.1, 4494.4, 36.4, 14.8, 5203.9],
  ["PRD-000166", "SITE-002", "2026-06-25", 11923.4, 9947.3, 83.4, 3.5, 11626.2],
  ["PRD-000167", "SITE-002", "2026-06-26", 12285.6, 12390.0, 100.8, 0.0, 14321.9],
  ["PRD-000168", "SITE-002", "2026-06-27", 11794.6, 12285.2, 104.2, 0.0, 14336.4],
  ["PRD-000169", "SITE-002", "2026-06-28", 11319.1, 11428.4, 101.0, 0.0, 13451.1],
  ["PRD-000170", "SITE-002", "2026-06-29", 11892.1, 12023.8, 101.1, 0.0, 14523.3],
  ["PRD-000171", "SITE-002", "2026-06-30", 11957.8, 12285.1, 102.7, 2.0, 13690.2],
  ["PRD-000172", "SITE-002", "2026-07-01", 12059.8, 12244.7, 101.5, 0.0, 14694.3],
  ["PRD-000173", "SITE-002", "2026-07-02", 12362.4, 12678.8, 102.6, 0.0, 15357.5],
  ["PRD-000174", "SITE-002", "2026-07-03", 12332.9, 12236.8, 99.2, 0.0, 14022.1],
  ["PRD-000175", "SITE-002", "2026-07-04", 11264.9, 10997.3, 97.6, 0.0, 13267.3],
  ["PRD-000176", "SITE-002", "2026-07-05", 11469.5, 12043.0, 105.0, 0.0, 13379.1],
  ["PRD-000177", "SITE-002", "2026-07-06", 12277.6, 12305.9, 100.2, 0.0, 14813.5],
  ["PRD-000178", "SITE-002", "2026-07-07", 12252.8, 11500.8, 93.9, 1.8, 13361.6],
  ["PRD-000179", "SITE-002", "2026-07-08", 12004.9, 11672.2, 97.2, 0.0, 14053.6],
  ["PRD-000180", "SITE-002", "2026-07-09", 11996.4, 11568.6, 96.4, 0.0, 13418.3],
  // SITE-003 recent (Jun 20 - Jul 12)
  ["PRD-000251", "SITE-003", "2026-06-20", 5599.5, 3822.8, 68.3, 7.3, 5210.6],
  ["PRD-000252", "SITE-003", "2026-06-21", 5639.5, 5517.9, 97.8, 0.0, 7392.9],
  ["PRD-000253", "SITE-003", "2026-06-22", 5658.1, 5519.8, 97.6, 0.0, 7245.4],
  ["PRD-000254", "SITE-003", "2026-06-23", 5737.7, 5434.0, 94.7, 0.0, 7533.0],
  ["PRD-000255", "SITE-003", "2026-06-24", 5700.3, 5762.1, 101.1, 0.0, 7758.2],
  ["PRD-000256", "SITE-003", "2026-06-25", 5552.4, 5534.3, 99.7, 0.0, 7381.4],
  ["PRD-000257", "SITE-003", "2026-06-26", 5742.1, 5760.2, 100.3, 0.0, 7760.5],
  ["PRD-000258", "SITE-003", "2026-06-27", 5701.4, 5941.6, 104.2, 0.0, 8266.0],
  ["PRD-000259", "SITE-003", "2026-06-28", 5644.6, 5926.8, 105.0, 0.0, 8393.7],
  ["PRD-000260", "SITE-003", "2026-06-29", 5718.6, 6004.6, 105.0, 0.0, 8219.3],
  ["PRD-000261", "SITE-003", "2026-06-30", 5671.5, 5569.2, 98.2, 0.0, 7914.7],
  ["PRD-000262", "SITE-003", "2026-07-01", 5668.5, 1984.0, 35.0, 19.6, 2762.8],
  ["PRD-000263", "SITE-003", "2026-07-02", 5558.6, 5575.7, 100.3, 0.0, 7304.9],
  ["PRD-000264", "SITE-003", "2026-07-03", 5700.5, 5903.3, 103.6, 0.0, 8139.6],
  ["PRD-000265", "SITE-003", "2026-07-04", 5709.4, 5770.8, 101.1, 0.0, 7976.8],
  ["PRD-000266", "SITE-003", "2026-07-05", 5731.8, 6018.4, 105.0, 0.0, 8537.7],
  ["PRD-000267", "SITE-003", "2026-07-06", 5668.2, 5617.7, 99.1, 0.0, 8040.0],
  ["PRD-000268", "SITE-003", "2026-07-07", 5715.1, 5487.1, 96.0, 0.0, 7706.4],
  ["PRD-000269", "SITE-003", "2026-07-08", 5717.9, 5994.1, 104.8, 0.0, 8605.2],
  ["PRD-000270", "SITE-003", "2026-07-09", 5534.3, 4748.9, 85.8, 3.3, 6464.6],
  // SITE-004 recent (Apr 14 - May 10)
  ["PRD-000271", "SITE-004", "2026-04-14", 28852.2, 28731.3, 99.6, 0.0, 39892.5],
  ["PRD-000272", "SITE-004", "2026-04-15", 29756.5, 30130.6, 101.3, 0.0, 38924.4],
  ["PRD-000273", "SITE-004", "2026-04-16", 29393.4, 10287.7, 35.0, 19.1, 13997.4],
  ["PRD-000274", "SITE-004", "2026-04-17", 29307.1, 27892.0, 95.2, 0.0, 39364.9],
  ["PRD-000275", "SITE-004", "2026-04-18", 28833.2, 30274.9, 105.0, 0.0, 42671.3],
  ["PRD-000276", "SITE-004", "2026-04-19", 29093.7, 29917.6, 102.8, 0.0, 41564.4],
  ["PRD-000277", "SITE-004", "2026-04-20", 29246.1, 28859.4, 98.7, 0.0, 38020.9],
  ["PRD-000278", "SITE-004", "2026-04-21", 28914.6, 27897.4, 96.5, 0.0, 39478.7],
  ["PRD-000279", "SITE-004", "2026-04-22", 29334.6, 29833.0, 101.7, 0.2, 40487.9],
  ["PRD-000280", "SITE-004", "2026-04-23", 29335.6, 29961.8, 102.1, 0.0, 41378.2],
  ["PRD-000281", "SITE-004", "2026-04-24", 28894.4, 28858.3, 99.9, 0.0, 37119.4],
  ["PRD-000282", "SITE-004", "2026-04-25", 29938.9, 24371.0, 81.4, 4.0, 33797.1],
  ["PRD-000283", "SITE-004", "2026-04-26", 29041.6, 29047.2, 100.0, 0.0, 37515.9],
  ["PRD-000284", "SITE-004", "2026-04-27", 29316.0, 29221.3, 99.7, 0.0, 38593.4],
  ["PRD-000285", "SITE-004", "2026-04-28", 29449.5, 28777.8, 97.7, 0.0, 38479.3],
  ["PRD-000286", "SITE-004", "2026-04-29", 29202.9, 27379.8, 93.8, 0.0, 35638.1],
  ["PRD-000287", "SITE-004", "2026-04-30", 29079.7, 30230.1, 104.0, 0.0, 39409.1],
  ["PRD-000288", "SITE-004", "2026-05-01", 29026.5, 29113.5, 100.3, 0.0, 39488.6],
  ["PRD-000289", "SITE-004", "2026-05-02", 28931.7, 29702.9, 102.7, 0.0, 39966.6],
  ["PRD-000290", "SITE-004", "2026-05-03", 29606.4, 30876.7, 104.3, 0.0, 42481.6],
];

export const productionRecords: ProductionRecord[] = rawProduction.map((raw) => ({
  id: raw[0],
  siteId: raw[1],
  date: raw[2],
  target: raw[3],
  actual: raw[4],
  efficiency: raw[5],
  downtimeHours: raw[6],
  energyUsed: raw[7],
}));

// Derive chart data
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

export const dailyYieldComparison = productionRecords
  .filter((r) => r.siteId === "SITE-001")
  .slice(-7)
  .map((r) => ({
    date: r.date.slice(5).replace("-", "/"),
    actual: Math.round(r.actual),
    target: Math.round(r.target),
  }));

export const throughputByAsset = [
  {
    asset: "Permian Basin Field Station",
    type: "Oil",
    throughput: Math.round(productionRecords.filter((r) => r.siteId === "SITE-001").reduce((s, r) => s + r.actual, 0) / 21),
    unit: "bbl/day",
    efficiency: Math.round(productionRecords.filter((r) => r.siteId === "SITE-001").reduce((s, r) => s + r.efficiency, 0) / 21),
    status: "Normal",
  },
  {
    asset: "Eagle Ford Processing Facility",
    type: "Oil",
    throughput: Math.round(productionRecords.filter((r) => r.siteId === "SITE-002").reduce((s, r) => s + r.actual, 0) / 20),
    unit: "bbl/day",
    efficiency: Math.round(productionRecords.filter((r) => r.siteId === "SITE-002").reduce((s, r) => s + r.efficiency, 0) / 20),
    status: "Normal",
  },
  {
    asset: "Bakken Ridge Field Station",
    type: "Oil",
    throughput: Math.round(productionRecords.filter((r) => r.siteId === "SITE-003").reduce((s, r) => s + r.actual, 0) / 20),
    unit: "bbl/day",
    efficiency: Math.round(productionRecords.filter((r) => r.siteId === "SITE-003").reduce((s, r) => s + r.efficiency, 0) / 20),
    status: "Normal",
  },
  {
    asset: "Gulfstream Pipeline Station",
    type: "Oil",
    throughput: Math.round(productionRecords.filter((r) => r.siteId === "SITE-004").reduce((s, r) => s + r.actual, 0) / 20),
    unit: "bbl/day",
    efficiency: Math.round(productionRecords.filter((r) => r.siteId === "SITE-004").reduce((s, r) => s + r.efficiency, 0) / 20),
    status: "Normal",
  },
];

export const downtimeEvents = productionRecords
  .filter((r) => r.downtimeHours > 0)
  .map((r, idx) => ({
    id: `DT-${String(idx + 1).padStart(3, "0")}`,
    asset: r.siteId,
    sector: "Upstream",
    startTime: `${r.date} 08:00`,
    duration: `${r.downtimeHours.toFixed(1)} hrs`,
    reason: r.downtimeHours > 10 ? "Major Outage" : r.downtimeHours > 5 ? "Partial Shutdown" : "Sensor Calibration",
    impact: `$${Math.round(r.downtimeHours * 1500 + r.energyUsed * 0.1).toLocaleString()}`,
    status: r.date < "2026-07-10" ? "Resolved" : "In Progress",
  }));

export const scheduleAdherence = [
  { shift: "Day (06-14)", planned: 4250, actual: 4180, adherence: 98.4 },
  { shift: "Afternoon (14-22)", planned: 4100, actual: 3850, adherence: 93.9 },
  { shift: "Night (22-06)", planned: 3950, actual: 3780, adherence: 95.7 },
];

// Aggregated stats
export const totalDailyProduction = Math.round(
  productionRecords.filter((r) => r.date === "2026-07-12").reduce((s, r) => s + r.actual, 0)
);
export const avgEfficiency = Math.round(
  productionRecords.reduce((s, r) => s + r.efficiency, 0) / productionRecords.length * 10
) / 10;
export const totalDowntime = Math.round(
  productionRecords.filter((r) => r.date >= "2026-07-01").reduce((s, r) => s + r.downtimeHours, 0) * 10
) / 10;
export const totalEnergyUsed = Math.round(
  productionRecords.filter((r) => r.date >= "2026-07-01").reduce((s, r) => s + r.energyUsed, 0)
);