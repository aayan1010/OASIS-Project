import { ast0001TimeSeries } from "./sensorData";

export interface AssetLocation {
  id: string;
  name: string;
  type: "pump-jack" | "compressor" | "pipeline" | "storage-tank" | "wellhead" | "separator" | "flare-stack" | "gas-plant";
  sector: "oil";
  status: "online" | "degraded" | "offline" | "maintenance";
  lat: number;
  lng: number;
  mapX: number;
  mapY: number;
  criticality: "critical" | "high" | "medium" | "low";
  lastReading: string;
  siteId?: string;
  healthScore?: number;
  operationalHours?: number;
  remainingLifeDays?: number;
  installationDate?: string;
  lastMaintenance?: string;
  nextMaintenance?: string;
}

const siteCoords: Record<string, { lat: number; lng: number }> = {
  "SITE-001": { lat: 31.9973, lng: -102.0779 },
  "SITE-002": { lat: 28.885, lng: -97.9011 },
  "SITE-003": { lat: 48.147, lng: -103.618 },
  "SITE-004": { lat: 30.0802, lng: -94.1266 },
  "SITE-005": { lat: 35.9856, lng: -96.7664 },
  "SITE-006": { lat: 31.423, lng: -103.4932 },
  "SITE-007": { lat: 40.174, lng: -80.2463 },
  "SITE-008": { lat: 27.8006, lng: -97.3964 },
};

function assetCoord(siteId: string, idx: number) {
  const base = siteCoords[siteId];
  const lat = base.lat + ((idx * 7) % 11) * 0.006 - 0.03;
  const lng = base.lng + ((idx * 13) % 11) * 0.006 - 0.03;
  return { lat: parseFloat(lat.toFixed(4)), lng: parseFloat(lng.toFixed(4)) };
}

function mapXY(lat: number, lng: number) {
  return {
    mapX: Math.max(5, Math.min(95, Math.round((lng + 105) * 4))),
    mapY: Math.max(5, Math.min(95, Math.round((lat - 27) * 4.5))),
  };
}

function mapType(csvType: string): AssetLocation["type"] {
  switch (csvType) {
    case "Generator": return "compressor";
    case "Valve": return "wellhead";
    case "Compressor": return "compressor";
    case "Pipeline": return "pipeline";
    case "Separator": return "separator";
    case "Storage Tank": return "storage-tank";
    case "Pump": return "pump-jack";
    default: return "compressor";
  }
}

function mapStatus(csvStatus: string): AssetLocation["status"] {
  switch (csvStatus) {
    case "Operational": return "online";
    case "Under Maintenance": return "maintenance";
    case "Offline": return "offline";
    case "Warning": return "degraded";
    default: return "online";
  }
}

function mapCriticality(health: number): AssetLocation["criticality"] {
  if (health >= 90) return "low";
  if (health >= 75) return "medium";
  if (health >= 60) return "high";
  return "critical";
}

function lastReadingText(idx: number): string {
  const texts = ["Just now", "1 min ago", "2 min ago", "5 min ago", "10 min ago"];
  return texts[idx % texts.length];
}

// Raw CSV data: [Asset_ID, Site_ID, Asset_Name, Asset_Type, Installation_Date, Operational_Hours, Current_Status, Health_Score, Remaining_Useful_Life_Days, Last_Maintenance_Date, Next_Maintenance_Date]
const rawAssets: [string, string, string, string, string, number, string, number, number, string, string][] = [
  // SITE-001 (22 assets)
  ["AST-0001", "SITE-001", "Generator-001", "Generator", "2023-01-13", 21204, "Operational", 96.7, 448, "2026-06-12", "2026-10-20"],
  ["AST-0002", "SITE-001", "Generator-002", "Generator", "2013-04-20", 78638, "Operational", 75.5, 290, "2026-05-10", "2026-09-17"],
  ["AST-0003", "SITE-001", "Valve-003", "Valve", "2012-01-12", 109359, "Operational", 99.2, 548, "2026-03-23", "2026-08-26"],
  ["AST-0004", "SITE-001", "Compressor-004", "Compressor", "2015-06-17", 67735, "Operational", 79.5, 472, "2026-03-22", "2026-06-27"],
  ["AST-0005", "SITE-001", "Pipeline-005", "Pipeline", "2019-04-20", 48423, "Operational", 79.6, 309, "2026-04-08", "2026-11-28"],
  ["AST-0006", "SITE-001", "Separator-006", "Separator", "2017-10-26", 61924, "Operational", 85.8, 440, "2026-04-03", "2026-08-24"],
  ["AST-0007", "SITE-001", "Pump-007", "Pump", "2013-02-24", 88961, "Under Maintenance", 82.3, 481, "2026-05-20", "2026-09-14"],
  ["AST-0008", "SITE-001", "Generator-008", "Generator", "2023-12-22", 21195, "Operational", 82.3, 486, "2026-05-10", "2026-09-17"],
  ["AST-0009", "SITE-001", "Separator-009", "Separator", "2023-04-08", 21726, "Operational", 84.2, 491, "2026-04-05", "2026-08-26"],
  ["AST-0010", "SITE-001", "Pipeline-010", "Pipeline", "2020-10-31", 35027, "Operational", 80.0, 420, "2026-05-07", "2026-12-27"],
  ["AST-0011", "SITE-001", "Compressor-011", "Compressor", "2015-03-02", 74447, "Operational", 87.9, 351, "2026-06-24", "2026-09-29"],
  ["AST-0012", "SITE-001", "Compressor-012", "Compressor", "2024-10-24", 10733, "Under Maintenance", 63.2, 274, "2026-04-12", "2026-06-26"],
  ["AST-0013", "SITE-001", "Generator-013", "Generator", "2018-06-23", 65267, "Operational", 79.3, 356, "2026-03-13", "2026-07-21"],
  ["AST-0014", "SITE-001", "Compressor-014", "Compressor", "2019-08-05", 53159, "Operational", 92.1, 463, "2026-03-21", "2026-06-26"],
  ["AST-0015", "SITE-001", "Valve-015", "Valve", "2016-07-29", 59101, "Operational", 86.0, 432, "2026-06-26", "2026-11-29"],
  ["AST-0016", "SITE-001", "Separator-016", "Separator", "2023-01-27", 23541, "Operational", 75.9, 419, "2026-06-22", "2026-11-12"],
  ["AST-0017", "SITE-001", "Storage Tank-017", "Storage Tank", "2016-12-21", 78867, "Operational", 97.7, 517, "2026-07-06", "2027-01-17"],
  ["AST-0018", "SITE-001", "Generator-018", "Generator", "2022-12-18", 27537, "Operational", 82.8, 445, "2026-04-12", "2026-08-20"],
  ["AST-0019", "SITE-001", "Pump-019", "Pump", "2018-12-13", 57592, "Operational", 88.0, 275, "2026-05-02", "2026-08-27"],
  ["AST-0020", "SITE-001", "Valve-020", "Valve", "2021-07-11", 32444, "Operational", 99.2, 611, "2026-01-26", "2026-07-01"],
  ["AST-0021", "SITE-001", "Valve-021", "Valve", "2011-11-16", 104295, "Operational", 94.4, 564, "2026-02-23", "2026-07-29"],
  ["AST-0022", "SITE-001", "Pump-022", "Pump", "2012-02-06", 96003, "Operational", 77.2, 300, "2026-04-21", "2026-08-16"],
  // SITE-002 (28 assets)
  ["AST-0023", "SITE-002", "Compressor-023", "Compressor", "2024-03-26", 13605, "Under Maintenance", 79.9, 503, "2026-03-06", "2026-06-11"],
  ["AST-0024", "SITE-002", "Separator-024", "Separator", "2023-12-25", 15384, "Offline", 23.6, 129, "2026-06-12", "2026-08-06"],
  ["AST-0025", "SITE-002", "Valve-025", "Valve", "2021-10-30", 29403, "Under Maintenance", 81.8, 378, "2026-02-20", "2026-07-26"],
  ["AST-0026", "SITE-002", "Separator-026", "Separator", "2021-01-08", 40801, "Operational", 82.0, 558, "2026-03-18", "2026-08-08"],
  ["AST-0027", "SITE-002", "Valve-027", "Valve", "2015-05-29", 63998, "Operational", 88.6, 335, "2026-02-17", "2026-07-23"],
  ["AST-0028", "SITE-002", "Compressor-028", "Compressor", "2012-05-02", 83083, "Operational", 76.9, 422, "2026-06-21", "2026-09-26"],
  ["AST-0029", "SITE-002", "Pump-029", "Pump", "2018-02-14", 58640, "Operational", 99.7, 415, "2026-02-20", "2026-06-17"],
  ["AST-0030", "SITE-002", "Compressor-030", "Compressor", "2012-09-22", 107969, "Operational", 75.1, 454, "2026-05-21", "2026-08-26"],
  ["AST-0031", "SITE-002", "Pump-031", "Pump", "2023-05-11", 21977, "Operational", 95.4, 480, "2026-06-25", "2026-10-20"],
  ["AST-0032", "SITE-002", "Generator-032", "Generator", "2023-04-29", 19188, "Operational", 94.3, 579, "2026-05-20", "2026-09-27"],
  ["AST-0033", "SITE-002", "Compressor-033", "Compressor", "2013-07-03", 90073, "Operational", 76.9, 290, "2026-06-19", "2026-09-24"],
  ["AST-0034", "SITE-002", "Storage Tank-034", "Storage Tank", "2013-03-10", 110016, "Operational", 96.6, 572, "2026-05-09", "2026-11-20"],
  ["AST-0035", "SITE-002", "Compressor-035", "Compressor", "2016-06-01", 81628, "Operational", 90.6, 540, "2026-05-27", "2026-09-01"],
  ["AST-0036", "SITE-002", "Storage Tank-036", "Storage Tank", "2025-06-26", 8118, "Under Maintenance", 20.9, 126, "2026-06-24", "2026-09-07"],
  ["AST-0037", "SITE-002", "Storage Tank-037", "Storage Tank", "2013-01-25", 87209, "Operational", 83.1, 349, "2026-06-24", "2027-01-05"],
  ["AST-0038", "SITE-002", "Valve-038", "Valve", "2013-05-16", 95188, "Operational", 97.2, 390, "2026-03-02", "2026-08-05"],
  ["AST-0039", "SITE-002", "Separator-039", "Separator", "2013-08-15", 79862, "Operational", 86.8, 333, "2026-02-06", "2026-06-29"],
  ["AST-0040", "SITE-002", "Pump-040", "Pump", "2020-04-04", 45546, "Under Maintenance", 94.0, 382, "2026-01-31", "2026-05-28"],
  ["AST-0041", "SITE-002", "Pump-041", "Pump", "2016-02-17", 84831, "Under Maintenance", 89.0, 450, "2026-05-17", "2026-09-11"],
  ["AST-0042", "SITE-002", "Generator-042", "Generator", "2018-06-27", 59487, "Operational", 88.1, 382, "2026-03-13", "2026-07-21"],
  ["AST-0043", "SITE-002", "Pipeline-043", "Pipeline", "2023-11-27", 21838, "Under Maintenance", 85.7, 558, "2026-06-20", "2027-02-09"],
  ["AST-0044", "SITE-002", "Valve-044", "Valve", "2020-10-01", 46320, "Operational", 82.9, 514, "2026-05-07", "2026-10-10"],
  ["AST-0045", "SITE-002", "Pipeline-045", "Pipeline", "2019-02-21", 53991, "Operational", 87.7, 486, "2026-01-22", "2026-09-13"],
  ["AST-0046", "SITE-002", "Valve-046", "Valve", "2025-05-10", 8741, "Operational", 85.3, 384, "2026-06-04", "2026-11-07"],
  ["AST-0047", "SITE-002", "Pipeline-047", "Pipeline", "2022-12-11", 23093, "Under Maintenance", 67.7, 248, "2026-05-28", "2026-11-24"],
  ["AST-0048", "SITE-002", "Generator-048", "Generator", "2017-11-04", 55235, "Operational", 98.2, 480, "2026-06-25", "2026-11-02"],
  ["AST-0049", "SITE-002", "Pump-049", "Pump", "2016-01-13", 81096, "Operational", 69.2, 265, "2026-04-03", "2026-07-02"],
  ["AST-0050", "SITE-002", "Pipeline-050", "Pipeline", "2021-11-28", 33149, "Under Maintenance", 69.1, 396, "2026-06-09", "2026-12-06"],
  // SITE-003 (21 assets)
  ["AST-0051", "SITE-003", "Pump-051", "Pump", "2022-03-10", 26432, "Operational", 79.7, 420, "2026-06-06", "2026-10-01"],
  ["AST-0052", "SITE-003", "Pump-052", "Pump", "2018-08-14", 49455, "Operational", 95.2, 614, "2026-05-06", "2026-08-31"],
  ["AST-0053", "SITE-003", "Generator-053", "Generator", "2023-03-24", 22360, "Operational", 97.4, 581, "2026-01-31", "2026-06-10"],
  ["AST-0054", "SITE-003", "Generator-054", "Generator", "2022-01-24", 36907, "Warning", 18.0, 101, "2026-07-01", "2026-08-20"],
  ["AST-0055", "SITE-003", "Storage Tank-055", "Storage Tank", "2024-12-22", 10544, "Operational", 85.7, 508, "2026-01-18", "2026-08-01"],
  ["AST-0056", "SITE-003", "Separator-056", "Separator", "2019-12-20", 38061, "Operational", 75.2, 356, "2026-03-10", "2026-07-31"],
  ["AST-0057", "SITE-003", "Compressor-057", "Compressor", "2021-01-21", 42994, "Under Maintenance", 60.3, 238, "2026-05-25", "2026-08-08"],
  ["AST-0058", "SITE-003", "Compressor-058", "Compressor", "2025-01-01", 12177, "Operational", 78.0, 339, "2026-04-28", "2026-08-03"],
  ["AST-0059", "SITE-003", "Pipeline-059", "Pipeline", "2014-02-08", 71694, "Operational", 83.4, 370, "2026-05-03", "2026-12-23"],
  ["AST-0060", "SITE-003", "Compressor-060", "Compressor", "2012-07-05", 101883, "Under Maintenance", 28.2, 112, "2026-06-20", "2026-07-27"],
  ["AST-0061", "SITE-003", "Generator-061", "Generator", "2018-07-01", 64772, "Operational", 92.6, 362, "2026-05-21", "2026-09-28"],
  ["AST-0062", "SITE-003", "Pipeline-062", "Pipeline", "2024-07-15", 15584, "Operational", 99.1, 499, "2026-01-14", "2026-09-05"],
  ["AST-0063", "SITE-003", "Generator-063", "Generator", "2021-02-10", 43992, "Operational", 81.3, 468, "2026-01-30", "2026-06-09"],
  ["AST-0064", "SITE-003", "Pipeline-064", "Pipeline", "2022-09-27", 28256, "Operational", 82.1, 411, "2026-04-16", "2026-12-06"],
  ["AST-0065", "SITE-003", "Storage Tank-065", "Storage Tank", "2018-11-25", 62346, "Operational", 75.9, 362, "2026-01-16", "2026-07-30"],
  ["AST-0066", "SITE-003", "Generator-066", "Generator", "2021-08-18", 38669, "Operational", 76.3, 421, "2026-04-22", "2026-08-30"],
  ["AST-0067", "SITE-003", "Pipeline-067", "Pipeline", "2020-10-26", 37381, "Under Maintenance", 82.0, 431, "2026-03-17", "2026-11-06"],
  ["AST-0068", "SITE-003", "Storage Tank-068", "Storage Tank", "2020-09-27", 37315, "Operational", 78.6, 437, "2026-01-20", "2026-08-03"],
  ["AST-0069", "SITE-003", "Generator-069", "Generator", "2011-08-24", 93611, "Operational", 87.2, 509, "2026-05-19", "2026-09-26"],
  ["AST-0070", "SITE-003", "Compressor-070", "Compressor", "2024-12-25", 11940, "Operational", 80.9, 450, "2026-03-14", "2026-06-19"],
  ["AST-0071", "SITE-003", "Storage Tank-071", "Storage Tank", "2012-08-15", 88171, "Operational", 93.2, 499, "2026-01-22", "2026-08-05"],
  // SITE-004 (15 assets)
  ["AST-0072", "SITE-004", "Generator-072", "Generator", "2025-05-29", 7042, "Operational", 64.0, 338, "2026-03-26", "2026-07-04"],
  ["AST-0073", "SITE-004", "Valve-073", "Valve", "2015-02-11", 68695, "Operational", 88.4, 527, "2026-06-04", "2026-11-07"],
  ["AST-0074", "SITE-004", "Separator-074", "Separator", "2015-02-10", 93598, "Operational", 76.0, 387, "2026-03-17", "2026-08-07"],
  ["AST-0075", "SITE-004", "Valve-075", "Valve", "2014-03-18", 75356, "Operational", 89.8, 395, "2026-03-09", "2026-08-12"],
  ["AST-0076", "SITE-004", "Storage Tank-076", "Storage Tank", "2019-09-20", 48151, "Operational", 64.4, 375, "2026-04-04", "2026-09-01"],
  ["AST-0077", "SITE-004", "Compressor-077", "Compressor", "2019-05-17", 47099, "Operational", 79.4, 310, "2026-02-20", "2026-05-28"],
  ["AST-0078", "SITE-004", "Pump-078", "Pump", "2022-06-06", 30987, "Operational", 98.4, 588, "2026-06-22", "2026-10-17"],
  ["AST-0079", "SITE-004", "Storage Tank-079", "Storage Tank", "2016-05-22", 63298, "Operational", 78.4, 352, "2026-03-23", "2026-10-04"],
  ["AST-0080", "SITE-004", "Storage Tank-080", "Storage Tank", "2012-06-07", 108707, "Warning", 42.4, 249, "2026-06-18", "2026-09-01"],
  ["AST-0081", "SITE-004", "Storage Tank-081", "Storage Tank", "2025-05-26", 8980, "Under Maintenance", 40.7, 254, "2026-06-16", "2026-08-30"],
  ["AST-0082", "SITE-004", "Valve-082", "Valve", "2013-04-14", 84980, "Operational", 69.5, 314, "2026-04-22", "2026-08-20"],
  ["AST-0083", "SITE-004", "Pump-083", "Pump", "2016-10-23", 76863, "Operational", 88.9, 464, "2026-06-06", "2026-10-01"],
  ["AST-0084", "SITE-004", "Valve-084", "Valve", "2013-07-21", 96570, "Operational", 77.3, 412, "2026-06-17", "2026-11-20"],
  ["AST-0085", "SITE-004", "Generator-085", "Generator", "2015-12-02", 67725, "Operational", 97.4, 400, "2026-04-16", "2026-08-24"],
  ["AST-0086", "SITE-004", "Compressor-086", "Compressor", "2015-05-03", 91792, "Operational", 83.5, 381, "2026-03-23", "2026-06-28"],
  // SITE-005 (17 assets)
  ["AST-0087", "SITE-005", "Pipeline-087", "Pipeline", "2023-09-12", 23239, "Operational", 83.7, 319, "2026-05-12", "2027-01-01"],
  ["AST-0088", "SITE-005", "Generator-088", "Generator", "2023-12-29", 20799, "Operational", 71.6, 420, "2026-05-29", "2026-09-06"],
  ["AST-0089", "SITE-005", "Separator-089", "Separator", "2025-01-28", 10843, "Operational", 94.5, 349, "2026-02-14", "2026-07-07"],
  ["AST-0090", "SITE-005", "Compressor-090", "Compressor", "2015-02-07", 83363, "Operational", 79.0, 322, "2026-06-09", "2026-09-14"],
  ["AST-0091", "SITE-005", "Separator-091", "Separator", "2021-11-10", 38023, "Warning", 41.4, 224, "2026-06-06", "2026-07-31"],
  ["AST-0092", "SITE-005", "Generator-092", "Generator", "2017-02-11", 70748, "Operational", 75.1, 262, "2026-01-29", "2026-06-08"],
  ["AST-0093", "SITE-005", "Compressor-093", "Compressor", "2023-04-01", 23887, "Operational", 79.0, 524, "2026-06-08", "2026-09-13"],
  ["AST-0094", "SITE-005", "Separator-094", "Separator", "2012-11-02", 101835, "Operational", 64.6, 341, "2026-06-15", "2026-10-03"],
  ["AST-0095", "SITE-005", "Valve-095", "Valve", "2017-11-17", 51697, "Operational", 80.6, 456, "2026-04-07", "2026-09-10"],
  ["AST-0096", "SITE-005", "Generator-096", "Generator", "2015-03-22", 79962, "Operational", 83.1, 354, "2026-01-23", "2026-06-02"],
  ["AST-0097", "SITE-005", "Pipeline-097", "Pipeline", "2011-09-20", 102503, "Under Maintenance", 67.4, 416, "2026-03-22", "2026-09-18"],
  ["AST-0098", "SITE-005", "Valve-098", "Valve", "2019-07-07", 41582, "Operational", 91.4, 558, "2026-03-15", "2026-08-18"],
  ["AST-0099", "SITE-005", "Compressor-099", "Compressor", "2015-02-10", 79912, "Operational", 89.2, 396, "2026-04-16", "2026-07-22"],
  ["AST-0100", "SITE-005", "Compressor-100", "Compressor", "2014-08-06", 95629, "Operational", 81.6, 350, "2026-04-29", "2026-08-04"],
  ["AST-0101", "SITE-005", "Valve-101", "Valve", "2025-04-21", 9311, "Operational", 81.1, 302, "2026-03-05", "2026-08-08"],
  ["AST-0102", "SITE-005", "Valve-102", "Valve", "2020-02-22", 36684, "Operational", 97.3, 479, "2026-04-24", "2026-09-27"],
  ["AST-0103", "SITE-005", "Compressor-103", "Compressor", "2016-06-18", 67130, "Operational", 90.8, 498, "2026-02-17", "2026-05-25"],
  // SITE-006 (11 assets)
  ["AST-0104", "SITE-006", "Valve-104", "Valve", "2017-10-27", 65721, "Operational", 89.4, 437, "2026-04-30", "2026-10-03"],
  ["AST-0105", "SITE-006", "Pipeline-105", "Pipeline", "2019-11-23", 50779, "Operational", 87.3, 403, "2026-05-22", "2027-01-11"],
  ["AST-0106", "SITE-006", "Compressor-106", "Compressor", "2020-09-05", 48363, "Operational", 53.4, 281, "2026-04-17", "2026-07-01"],
  ["AST-0107", "SITE-006", "Valve-107", "Valve", "2019-03-09", 48826, "Warning", 10.9, 21, "2026-06-23", "2026-08-22"],
  ["AST-0108", "SITE-006", "Pump-108", "Pump", "2013-07-21", 92829, "Operational", 98.5, 644, "2026-06-06", "2026-10-01"],
  ["AST-0109", "SITE-006", "Generator-109", "Generator", "2014-07-10", 83244, "Operational", 98.8, 510, "2026-03-18", "2026-07-26"],
  ["AST-0110", "SITE-006", "Pipeline-110", "Pipeline", "2021-05-25", 35699, "Under Maintenance", 10.5, 84, "2026-07-08", "2026-10-06"],
  ["AST-0111", "SITE-006", "Storage Tank-111", "Storage Tank", "2014-07-03", 94186, "Operational", 98.2, 400, "2026-04-22", "2026-11-03"],
  ["AST-0112", "SITE-006", "Pump-112", "Pump", "2019-12-19", 51061, "Operational", 99.1, 525, "2026-05-12", "2026-09-06"],
  ["AST-0113", "SITE-006", "Separator-113", "Separator", "2013-10-24", 92144, "Operational", 96.3, 401, "2026-03-21", "2026-08-11"],
  ["AST-0114", "SITE-006", "Pipeline-114", "Pipeline", "2012-10-11", 81947, "Under Maintenance", 96.3, 576, "2026-05-16", "2027-01-05"],
  // SITE-007 (24 assets)
  ["AST-0115", "SITE-007", "Generator-115", "Generator", "2020-10-19", 35270, "Operational", 82.9, 334, "2026-06-19", "2026-10-27"],
  ["AST-0116", "SITE-007", "Compressor-116", "Compressor", "2025-06-22", 6112, "Under Maintenance", 98.4, 451, "2026-04-26", "2026-08-01"],
  ["AST-0117", "SITE-007", "Generator-117", "Generator", "2019-03-11", 46329, "Operational", 92.4, 321, "2026-05-02", "2026-09-09"],
  ["AST-0118", "SITE-007", "Separator-118", "Separator", "2012-04-21", 101430, "Operational", 90.4, 435, "2026-01-24", "2026-06-16"],
  ["AST-0119", "SITE-007", "Compressor-119", "Compressor", "2019-07-29", 54140, "Operational", 74.7, 276, "2026-04-08", "2026-06-22"],
  ["AST-0120", "SITE-007", "Generator-120", "Generator", "2012-10-07", 103347, "Offline", 40.7, 129, "2026-05-29", "2026-07-18"],
  ["AST-0121", "SITE-007", "Storage Tank-121", "Storage Tank", "2019-06-05", 51655, "Operational", 93.5, 477, "2026-03-20", "2026-10-01"],
  ["AST-0122", "SITE-007", "Generator-122", "Generator", "2018-04-21", 67689, "Operational", 84.0, 343, "2026-02-11", "2026-06-21"],
  ["AST-0123", "SITE-007", "Valve-123", "Valve", "2025-01-25", 11264, "Under Maintenance", 20.3, 119, "2026-07-01", "2026-08-30"],
  ["AST-0124", "SITE-007", "Storage Tank-124", "Storage Tank", "2013-11-22", 91463, "Operational", 96.7, 403, "2026-01-27", "2026-08-10"],
  ["AST-0125", "SITE-007", "Separator-125", "Separator", "2014-07-03", 79073, "Offline", 42.0, 203, "2026-05-31", "2026-07-25"],
  ["AST-0126", "SITE-007", "Pump-126", "Pump", "2021-12-04", 37685, "Operational", 95.0, 510, "2026-02-18", "2026-06-15"],
  ["AST-0127", "SITE-007", "Pump-127", "Pump", "2015-05-02", 92373, "Operational", 91.2, 431, "2026-03-27", "2026-07-22"],
  ["AST-0128", "SITE-007", "Separator-128", "Separator", "2013-12-28", 89340, "Operational", 71.7, 408, "2026-05-02", "2026-08-20"],
  ["AST-0129", "SITE-007", "Pump-129", "Pump", "2021-04-29", 38215, "Under Maintenance", 83.4, 461, "2026-06-25", "2026-10-20"],
  ["AST-0130", "SITE-007", "Compressor-130", "Compressor", "2019-07-18", 52641, "Operational", 89.5, 424, "2026-06-07", "2026-09-12"],
  ["AST-0131", "SITE-007", "Pump-131", "Pump", "2011-11-17", 84018, "Operational", 46.1, 262, "2026-05-02", "2026-07-31"],
  ["AST-0132", "SITE-007", "Pump-132", "Pump", "2020-06-29", 36262, "Warning", 20.0, 51, "2026-07-03", "2026-08-17"],
  ["AST-0133", "SITE-007", "Storage Tank-133", "Storage Tank", "2018-12-27", 52548, "Operational", 89.8, 414, "2026-03-10", "2026-09-21"],
  ["AST-0134", "SITE-007", "Compressor-134", "Compressor", "2015-04-16", 81773, "Operational", 78.2, 345, "2026-06-04", "2026-09-09"],
  ["AST-0135", "SITE-007", "Separator-135", "Separator", "2023-12-20", 19910, "Operational", 88.1, 380, "2026-05-01", "2026-09-21"],
  ["AST-0136", "SITE-007", "Separator-136", "Separator", "2025-06-22", 7633, "Operational", 90.6, 561, "2026-01-21", "2026-06-13"],
  ["AST-0137", "SITE-007", "Storage Tank-137", "Storage Tank", "2022-03-14", 30965, "Operational", 77.1, 350, "2026-02-19", "2026-09-02"],
  ["AST-0138", "SITE-007", "Storage Tank-138", "Storage Tank", "2015-04-27", 70922, "Warning", 28.9, 169, "2026-06-18", "2026-09-01"],
  // SITE-008 (12 assets)
  ["AST-0139", "SITE-008", "Compressor-139", "Compressor", "2016-04-26", 79979, "Operational", 90.9, 459, "2026-04-01", "2026-07-07"],
  ["AST-0140", "SITE-008", "Generator-140", "Generator", "2022-02-13", 36328, "Operational", 94.9, 372, "2026-04-15", "2026-08-23"],
  ["AST-0141", "SITE-008", "Separator-141", "Separator", "2023-04-13", 26298, "Under Maintenance", 53.1, 181, "2026-06-22", "2026-10-10"],
  ["AST-0142", "SITE-008", "Generator-142", "Generator", "2022-04-20", 32795, "Operational", 75.6, 278, "2026-05-02", "2026-09-09"],
  ["AST-0143", "SITE-008", "Pipeline-143", "Pipeline", "2011-07-22", 118900, "Operational", 99.1, 612, "2026-02-22", "2026-10-14"],
  ["AST-0144", "SITE-008", "Storage Tank-144", "Storage Tank", "2018-06-06", 46925, "Operational", 85.2, 542, "2026-06-21", "2027-01-02"],
  ["AST-0145", "SITE-008", "Compressor-145", "Compressor", "2019-02-01", 44343, "Warning", 16.1, 65, "2026-06-02", "2026-07-09"],
  ["AST-0146", "SITE-008", "Generator-146", "Generator", "2023-04-12", 18926, "Operational", 88.7, 534, "2026-06-24", "2026-11-01"],
  ["AST-0147", "SITE-008", "Pipeline-147", "Pipeline", "2017-06-29", 61288, "Operational", 92.9, 361, "2026-01-15", "2026-09-06"],
  ["AST-0148", "SITE-008", "Separator-148", "Separator", "2021-06-29", 33771, "Operational", 98.9, 549, "2026-01-15", "2026-06-07"],
  ["AST-0149", "SITE-008", "Compressor-149", "Compressor", "2014-05-16", 89676, "Operational", 67.1, 334, "2026-04-26", "2026-07-10"],
  ["AST-0150", "SITE-008", "Pipeline-150", "Pipeline", "2025-04-28", 9031, "Under Maintenance", 57.6, 383, "2026-06-03", "2026-11-30"],
];

export const assetLocations: AssetLocation[] = rawAssets.map((raw, idx) => {
  const [id, siteId, name, csvType, installationDate, operationalHours, csvStatus, healthScore, remainingLifeDays, lastMaintenance, nextMaintenance] = raw;
  const { lat, lng } = assetCoord(siteId, idx);
  const { mapX, mapY } = mapXY(lat, lng);
  return {
    id,
    siteId,
    name,
    type: mapType(csvType),
    sector: "oil",
    status: mapStatus(csvStatus),
    lat,
    lng,
    mapX,
    mapY,
    criticality: mapCriticality(healthScore),
    lastReading: lastReadingText(idx),
    healthScore,
    operationalHours,
    remainingLifeDays,
    installationDate,
    lastMaintenance,
    nextMaintenance,
  };
});

export interface TelemetrySensor {
  id: string;
  assetId: string;
  assetName: string;
  sensorName: string;
  sensorType: string;
  value: string;
  unit: string;
  trend: "up" | "down" | "stable";
  trendPct: string;
  sector: "oil";
  status: "normal" | "warning" | "critical";
  lastUpdate: string;
}

// Helper functions for AST-0001 time-series data
export function getLatestReading() {
  const last = ast0001TimeSeries[ast0001TimeSeries.length - 1];
  return {
    timestamp: last[0],
    temperature: last[1],
    pressure: last[2],
    vibration: last[3],
    flowRate: last[4],
    power: last[5],
    oilLevel: last[6],
  };
}

export function getTrend(sensorIndex: number) {
  if (ast0001TimeSeries.length < 2) return { direction: "stable" as const, pct: "0.0%" };
  const prev = ast0001TimeSeries[ast0001TimeSeries.length - 2];
  const curr = ast0001TimeSeries[ast0001TimeSeries.length - 1];
  const prevVal = Number(prev[sensorIndex] ?? 0);
  const currVal = Number(curr[sensorIndex] ?? 0);
  const diff = currVal - prevVal;
  const pct = prevVal === 0 ? 0 : (diff / prevVal) * 100;
  const direction = Math.abs(pct) < 0.5 ? "stable" : pct > 0 ? "up" : "down";
  return {
    direction: direction as "up" | "down" | "stable",
    pct: `${pct >= 0 ? "+" : ""}${pct.toFixed(1)}%`,
  };
}

export function getRecentSeries(sensorIndex: number, count = 24): number[] {
  return ast0001TimeSeries.slice(-count).map((r) => Number(r[sensorIndex] ?? 0));
}

function generateTelemetry(): TelemetrySensor[] {
  const result: TelemetrySensor[] = [];
  const now = new Date();

  // Real sensor data for AST-0001 from time-series
  const latest = getLatestReading();
  const sensors = [
    { name: "Temperature", type: "Temperature", value: latest.temperature.toFixed(1), unit: "°C", idx: 1, warnIf: (v: number) => v > 55 },
    { name: "Pressure", type: "Pressure", value: latest.pressure.toFixed(1), unit: "PSI", idx: 2, warnIf: () => false },
    { name: "Vibration", type: "Vibration", value: latest.vibration.toFixed(2), unit: "mm/s", idx: 3, warnIf: (v: number) => v > 1.0 },
    { name: "Flow Rate", type: "Flow Rate", value: latest.flowRate.toFixed(1), unit: "bbl/h", idx: 4, warnIf: () => false },
    { name: "Power", type: "Power", value: latest.power.toFixed(0), unit: "kW", idx: 5, warnIf: () => false },
    { name: "Oil Level", type: "Oil Level", value: latest.oilLevel.toFixed(1), unit: "%", idx: 6, warnIf: (v: number) => v < 90 },
  ];

  sensors.forEach((s, i) => {
    const trend = getTrend(s.idx);
    const vals = [latest.temperature, latest.pressure, latest.vibration, latest.flowRate, latest.power, latest.oilLevel];
    result.push({
      id: `tel-AST0001-${i}`,
      assetId: "AST-0001",
      assetName: "Generator-001",
      sensorName: s.name,
      sensorType: s.type,
      value: s.value,
      unit: s.unit,
      trend: trend.direction,
      trendPct: trend.pct,
      sector: "oil",
      status: s.warnIf(vals[i]) ? "warning" : "normal",
      lastUpdate: "Just now",
    });
  });

  // Generate telemetry for critical / degraded assets based on health score
  const criticalAssets = assetLocations.filter(a => (a.healthScore ?? 100) < 70 || a.status === "offline" || a.status === "degraded");
  criticalAssets.slice(0, 20).forEach((asset, idx) => {
    const health = asset.healthScore ?? 50;
    const isOffline = asset.status === "offline";
    const isDegraded = asset.status === "degraded";
    const isCritical = health < 50;

    // Temperature sensor
    const tempVal = isCritical ? (55 + Math.random() * 10).toFixed(1) : isDegraded ? (50 + Math.random() * 5).toFixed(1) : (45 + Math.random() * 8).toFixed(1);
    result.push({
      id: `tel-${asset.id}-temp`,
      assetId: asset.id,
      assetName: asset.name,
      sensorName: "Discharge Temperature",
      sensorType: "Temperature",
      value: tempVal,
      unit: "°C",
      trend: isCritical ? "up" : "stable",
      trendPct: isCritical ? "+4.2%" : "+0.3%",
      sector: "oil",
      status: parseFloat(tempVal) > 55 ? "critical" : parseFloat(tempVal) > 50 ? "warning" : "normal",
      lastUpdate: `${(idx % 5 + 1) * 3}s ago`,
    });

    // Vibration sensor
    const vibVal = isCritical ? (1.2 + Math.random() * 0.8).toFixed(2) : isDegraded ? (0.8 + Math.random() * 0.4).toFixed(2) : (0.4 + Math.random() * 0.5).toFixed(2);
    result.push({
      id: `tel-${asset.id}-vib`,
      assetId: asset.id,
      assetName: asset.name,
      sensorName: "Vibration Level",
      sensorType: "Accelerometer",
      value: vibVal,
      unit: "mm/s",
      trend: isCritical ? "up" : "stable",
      trendPct: isCritical ? "+8.1%" : "+0.2%",
      sector: "oil",
      status: parseFloat(vibVal) > 1.0 ? "critical" : parseFloat(vibVal) > 0.8 ? "warning" : "normal",
      lastUpdate: `${(idx % 5 + 1) * 4}s ago`,
    });

    // Pressure sensor
    const pressVal = isOffline ? "0" : (40 + Math.random() * 12).toFixed(1);
    result.push({
      id: `tel-${asset.id}-press`,
      assetId: asset.id,
      assetName: asset.name,
      sensorName: "Operating Pressure",
      sensorType: "Pressure",
      value: pressVal,
      unit: "PSI",
      trend: isOffline ? "down" : "stable",
      trendPct: isOffline ? "-100%" : "+0.5%",
      sector: "oil",
      status: isOffline ? "critical" : "normal",
      lastUpdate: `${(idx % 5 + 1) * 5}s ago`,
    });
  });

  // Add a few healthy assets for balance
  const healthyAssets = assetLocations.filter(a => (a.healthScore ?? 0) >= 90 && a.status === "online");
  healthyAssets.slice(0, 10).forEach((asset, idx) => {
    result.push({
      id: `tel-${asset.id}-hlth`,
      assetId: asset.id,
      assetName: asset.name,
      sensorName: "Motor RPM",
      sensorType: "Rotational Speed",
      value: String(1700 + idx * 15),
      unit: "RPM",
      trend: "stable",
      trendPct: "+0.1%",
      sector: "oil",
      status: "normal",
      lastUpdate: `${(idx % 3 + 1)}s ago`,
    });
  });

  return result;
}

export const telemetryStreams = generateTelemetry();

export const assetTypeIcons: Record<string, string> = {
  "pump-jack": "ri-oil-line",
  compressor: "ri-shut-down-line",
  pipeline: "ri-router-line",
  "storage-tank": "ri-archive-line",
  wellhead: "ri-drop-line",
  separator: "ri-filter-3-line",
  "flare-stack": "ri-fire-line",
  "gas-plant": "ri-building-line",
};

export const sectorColors: Record<string, { bg: string; text: string; border: string; dot: string }> = {
  oil: { bg: "bg-secondary-100", text: "text-secondary-700", border: "border-secondary-300", dot: "bg-secondary-500" },
};