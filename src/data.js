const rawFacilities = [
  { owner: "AWS", name: "AWS Northern Virginia Cluster", city: "Ashburn, VA", lat: 39.0438, lng: -77.4874, mw: 420, source: "Company disclosures / industry estimates" },
  { owner: "Microsoft", name: "Azure Boydton Campus", city: "Boydton, VA", lat: 36.6676, lng: -78.3875, mw: 300, source: "Company disclosures / industry estimates" },
  { owner: "Google", name: "Google Council Bluffs Data Center", city: "Council Bluffs, IA", lat: 41.2619, lng: -95.8608, mw: 250, source: "Company disclosures / industry estimates" },
  { owner: "Meta", name: "Meta Altoona Data Center", city: "Altoona, IA", lat: 41.6505, lng: -93.4647, mw: 220, source: "Company disclosures / industry estimates" },
  { owner: "Google", name: "Google The Dalles Data Center", city: "The Dalles, OR", lat: 45.5946, lng: -121.1787, mw: 230, source: "Company disclosures / industry estimates" },
  { owner: "Meta", name: "Meta Prineville Data Center", city: "Prineville, OR", lat: 44.2998, lng: -120.8345, mw: 200, source: "Company disclosures / industry estimates" },
  { owner: "Apple", name: "Apple Maiden Data Center", city: "Maiden, NC", lat: 35.5757, lng: -81.2112, mw: 120, source: "Company disclosures / industry estimates" },
  { owner: "Google", name: "Google Mayes County Data Center", city: "Pryor, OK", lat: 36.3084, lng: -95.3169, mw: 210, source: "Company disclosures / industry estimates" },
  { owner: "Microsoft", name: "Azure West Des Moines Campus", city: "West Des Moines, IA", lat: 41.5772, lng: -93.7113, mw: 220, source: "Company disclosures / industry estimates" },
  { owner: "Meta", name: "Meta Fort Worth Data Center", city: "Fort Worth, TX", lat: 32.7555, lng: -97.3308, mw: 190, source: "Company disclosures / industry estimates" },
  { owner: "Google", name: "Google Midlothian Data Center", city: "Midlothian, TX", lat: 32.4824, lng: -96.9944, mw: 180, source: "Company disclosures / industry estimates" },
  { owner: "Microsoft", name: "Azure San Antonio Data Center", city: "San Antonio, TX", lat: 29.4241, lng: -98.4936, mw: 140, source: "Company disclosures / industry estimates" },
  { owner: "Oracle", name: "Oracle Austin Cloud Region", city: "Austin, TX", lat: 30.2672, lng: -97.7431, mw: 90, source: "Company disclosures / industry estimates" },
  { owner: "Digital Realty", name: "Digital Realty Dallas Campus", city: "Dallas, TX", lat: 32.7767, lng: -96.797, mw: 100, source: "Company disclosures / industry estimates" },
  { owner: "Equinix", name: "Equinix Dallas IBX Campus", city: "Dallas, TX", lat: 32.7767, lng: -96.797, mw: 80, source: "Company disclosures / industry estimates" },
  { owner: "CoreWeave", name: "CoreWeave Plano / North Texas AI Cluster", city: "Plano, TX", lat: 33.0198, lng: -96.6989, mw: 120, source: "Company disclosures / industry estimates" },
  { owner: "xAI", name: "xAI Colossus", city: "Memphis, TN", lat: 35.1495, lng: -90.049, mw: 150, source: "Company disclosures / industry estimates" },
  { owner: "Oracle", name: "OCI Abilene AI Campus", city: "Abilene, TX", lat: 32.4487, lng: -99.7331, mw: 250, source: "Company disclosures / industry estimates" },
  { owner: "Crusoe", name: "Crusoe AI Data Center", city: "Abilene, TX", lat: 32.4487, lng: -99.7331, mw: 200, source: "Company disclosures / industry estimates" },
  { owner: "AWS", name: "AWS Ohio Region", city: "Columbus, OH", lat: 39.9612, lng: -82.9988, mw: 280, source: "Company disclosures / industry estimates" },
  { owner: "Google", name: "Google New Albany Data Center", city: "New Albany, OH", lat: 40.0812, lng: -82.8088, mw: 180, source: "Company disclosures / industry estimates" },
  { owner: "Meta", name: "Meta New Albany Data Center", city: "New Albany, OH", lat: 40.0812, lng: -82.8088, mw: 160, source: "Company disclosures / industry estimates" },
  { owner: "AWS", name: "AWS Oregon Region", city: "Boardman, OR", lat: 45.8399, lng: -119.7006, mw: 320, source: "Company disclosures / industry estimates" },
  { owner: "AWS", name: "AWS Umatilla Campus", city: "Umatilla, OR", lat: 45.9174, lng: -119.3425, mw: 220, source: "Company disclosures / industry estimates" },
  { owner: "Microsoft", name: "Azure Quincy Campus", city: "Quincy, WA", lat: 47.2343, lng: -119.8526, mw: 200, source: "Company disclosures / industry estimates" },
  { owner: "Yahoo", name: "Yahoo Quincy Data Center", city: "Quincy, WA", lat: 47.2343, lng: -119.8526, mw: 70, source: "Company disclosures / industry estimates" },
  { owner: "Sabey", name: "Sabey Intergate Columbia", city: "Quincy, WA", lat: 47.2343, lng: -119.8526, mw: 90, source: "Company disclosures / industry estimates" },
  { owner: "Vantage", name: "Vantage Quincy Campus", city: "Quincy, WA", lat: 47.2343, lng: -119.8526, mw: 120, source: "Company disclosures / industry estimates" },
  { owner: "Switch", name: "Switch Citadel Campus", city: "Tahoe Reno, NV", lat: 39.5296, lng: -119.8138, mw: 180, source: "Company disclosures / industry estimates" },
  { owner: "Google", name: "Google Henderson Data Center", city: "Henderson, NV", lat: 36.0395, lng: -114.9817, mw: 130, source: "Company disclosures / industry estimates" },
  { owner: "Meta", name: "Meta Los Lunas Data Center", city: "Los Lunas, NM", lat: 34.8062, lng: -106.7334, mw: 180, source: "Company disclosures / industry estimates" },
  { owner: "Apple", name: "Apple Mesa Data Center", city: "Mesa, AZ", lat: 33.4152, lng: -111.8315, mw: 90, source: "Company disclosures / industry estimates" },
  { owner: "Meta", name: "Meta Mesa Data Center", city: "Mesa, AZ", lat: 33.4152, lng: -111.8315, mw: 150, source: "Company disclosures / industry estimates" },
  { owner: "Google", name: "Google Phoenix Cloud Region", city: "Phoenix, AZ", lat: 33.4484, lng: -112.074, mw: 120, source: "Company disclosures / industry estimates" },
  { owner: "Digital Realty", name: "Digital Realty Phoenix Campus", city: "Phoenix, AZ", lat: 33.4484, lng: -112.074, mw: 75, source: "Company disclosures / industry estimates" },
  { owner: "QTS", name: "QTS Phoenix Data Center", city: "Phoenix, AZ", lat: 33.4484, lng: -112.074, mw: 85, source: "Company disclosures / industry estimates" },
  { owner: "AWS", name: "AWS California Region", city: "San Jose, CA", lat: 37.3382, lng: -121.8863, mw: 160, source: "Company disclosures / industry estimates" },
  { owner: "Equinix", name: "Equinix Silicon Valley IBX", city: "San Jose, CA", lat: 37.3382, lng: -121.8863, mw: 110, source: "Company disclosures / industry estimates" },
  { owner: "Digital Realty", name: "Digital Realty Santa Clara", city: "Santa Clara, CA", lat: 37.3541, lng: -121.9552, mw: 120, source: "Company disclosures / industry estimates" },
  { owner: "CoreSite", name: "CoreSite Santa Clara", city: "Santa Clara, CA", lat: 37.3541, lng: -121.9552, mw: 85, source: "Company disclosures / industry estimates" },
  { owner: "Microsoft", name: "Azure Cheyenne Campus", city: "Cheyenne, WY", lat: 41.14, lng: -104.8202, mw: 150, source: "Company disclosures / industry estimates" },
  { owner: "Meta", name: "Meta Eagle Mountain Data Center", city: "Eagle Mountain, UT", lat: 40.3141, lng: -112.0069, mw: 160, source: "Company disclosures / industry estimates" },
  { owner: "Google", name: "Google Atlanta Cloud Region", city: "Atlanta, GA", lat: 33.749, lng: -84.388, mw: 120, source: "Company disclosures / industry estimates" },
  { owner: "QTS", name: "QTS Atlanta-Metro", city: "Atlanta, GA", lat: 33.749, lng: -84.388, mw: 100, source: "Company disclosures / industry estimates" },
  { owner: "Flexential", name: "Flexential Atlanta", city: "Atlanta, GA", lat: 33.749, lng: -84.388, mw: 60, source: "Company disclosures / industry estimates" },
  { owner: "Microsoft", name: "Azure Atlanta Region", city: "Atlanta, GA", lat: 33.749, lng: -84.388, mw: 130, source: "Company disclosures / industry estimates" },
  { owner: "Google", name: "Google Berkeley County Data Center", city: "Moncks Corner, SC", lat: 33.196, lng: -80.0131, mw: 170, source: "Company disclosures / industry estimates" },
  { owner: "Meta", name: "Meta Forest City Data Center", city: "Forest City, NC", lat: 35.334, lng: -81.8651, mw: 140, source: "Company disclosures / industry estimates" },
  { owner: "Microsoft", name: "Azure Chicago Region", city: "Chicago, IL", lat: 41.8781, lng: -87.6298, mw: 150, source: "Company disclosures / industry estimates" },
  { owner: "Digital Realty", name: "Digital Realty Chicago", city: "Chicago, IL", lat: 41.8781, lng: -87.6298, mw: 100, source: "Company disclosures / industry estimates" },
  { owner: "Equinix", name: "Equinix Chicago IBX", city: "Chicago, IL", lat: 41.8781, lng: -87.6298, mw: 95, source: "Company disclosures / industry estimates" },
  { owner: "Meta", name: "Meta DeKalb Data Center", city: "DeKalb, IL", lat: 41.9295, lng: -88.7504, mw: 160, source: "Company disclosures / industry estimates" },
  { owner: "Google", name: "Google Clarksville Data Center", city: "Clarksville, TN", lat: 36.5298, lng: -87.3595, mw: 170, source: "Company disclosures / industry estimates" },
  { owner: "Meta", name: "Meta Gallatin Data Center", city: "Gallatin, TN", lat: 36.3884, lng: -86.4467, mw: 150, source: "Company disclosures / industry estimates" },
  { owner: "Microsoft", name: "Azure Southern Virginia Campus", city: "Mecklenburg County, VA", lat: 36.6418, lng: -78.5569, mw: 240, source: "Company disclosures / industry estimates" },
  { owner: "QTS", name: "QTS Richmond Data Center", city: "Richmond, VA", lat: 37.5407, lng: -77.436, mw: 120, source: "Company disclosures / industry estimates" },
  { owner: "Digital Realty", name: "Digital Realty Ashburn", city: "Ashburn, VA", lat: 39.0438, lng: -77.4874, mw: 150, source: "Company disclosures / industry estimates" },
  { owner: "Equinix", name: "Equinix Ashburn DC Campus", city: "Ashburn, VA", lat: 39.0438, lng: -77.4874, mw: 160, source: "Company disclosures / industry estimates" },
  { owner: "CoreSite", name: "CoreSite Reston", city: "Reston, VA", lat: 38.9586, lng: -77.357, mw: 75, source: "Company disclosures / industry estimates" },
  { owner: "RagingWire / NTT", name: "NTT Ashburn Campus", city: "Ashburn, VA", lat: 39.0438, lng: -77.4874, mw: 120, source: "Company disclosures / industry estimates" },
  { owner: "Vantage", name: "Vantage Northern Virginia", city: "Ashburn, VA", lat: 39.0438, lng: -77.4874, mw: 140, source: "Company disclosures / industry estimates" },
  { owner: "Compass", name: "Compass Northern Virginia", city: "Leesburg, VA", lat: 39.1157, lng: -77.5636, mw: 90, source: "Company disclosures / industry estimates" },
  { owner: "CyrusOne", name: "CyrusOne Northern Virginia", city: "Sterling, VA", lat: 39.0062, lng: -77.4286, mw: 100, source: "Company disclosures / industry estimates" },
  { owner: "AWS", name: "AWS GovCloud East", city: "Northern Virginia", lat: 38.9696, lng: -77.3861, mw: 180, source: "Company disclosures / industry estimates" },
  { owner: "AWS", name: "AWS GovCloud West", city: "Oregon", lat: 45.8399, lng: -119.7006, mw: 150, source: "Company disclosures / industry estimates" },
  { owner: "Google", name: "Google Lenoir Data Center", city: "Lenoir, NC", lat: 35.914, lng: -81.539, mw: 160, source: "Company disclosures / industry estimates" },
  { owner: "Google", name: "Google Papillion Data Center", city: "Papillion, NE", lat: 41.1544, lng: -96.0422, mw: 180, source: "Company disclosures / industry estimates" },
  { owner: "Meta", name: "Meta Springfield Data Center", city: "Springfield, NE", lat: 41.0825, lng: -96.1345, mw: 150, source: "Company disclosures / industry estimates" },
  { owner: "Meta", name: "Meta Henrico Data Center", city: "Henrico, VA", lat: 37.5059, lng: -77.3324, mw: 150, source: "Company disclosures / industry estimates" },
  { owner: "Meta", name: "Meta Huntsville Data Center", city: "Huntsville, AL", lat: 34.7304, lng: -86.5861, mw: 140, source: "Company disclosures / industry estimates" },
  { owner: "Google", name: "Google Jackson County Data Center", city: "Bridgeport, AL", lat: 34.947, lng: -85.7144, mw: 150, source: "Company disclosures / industry estimates" },
  { owner: "Microsoft", name: "Azure Wisconsin Data Center", city: "Mount Pleasant, WI", lat: 42.6978, lng: -87.8556, mw: 200, source: "Company disclosures / industry estimates" },
  { owner: "Meta", name: "Meta Newton Data Center", city: "Newton County, GA", lat: 33.5544, lng: -83.8473, mw: 160, source: "Company disclosures / industry estimates" },
  { owner: "AWS", name: "AWS Georgia Data Center", city: "Atlanta Metro, GA", lat: 33.749, lng: -84.388, mw: 150, source: "Company disclosures / industry estimates" },
  { owner: "Oracle", name: "Oracle Phoenix Cloud Region", city: "Phoenix, AZ", lat: 33.4484, lng: -112.074, mw: 80, source: "Company disclosures / industry estimates" },
  { owner: "Oracle", name: "Oracle Chicago Cloud Region", city: "Chicago, IL", lat: 41.8781, lng: -87.6298, mw: 80, source: "Company disclosures / industry estimates" },
  { owner: "Oracle", name: "Oracle Ashburn Cloud Region", city: "Ashburn, VA", lat: 39.0438, lng: -77.4874, mw: 100, source: "Company disclosures / industry estimates" },
  { owner: "Lambda", name: "Lambda AI Cloud Cluster", city: "Dallas, TX", lat: 32.7767, lng: -96.797, mw: 60, source: "Company disclosures / industry estimates" },
  { owner: "Applied Digital", name: "Applied Digital Ellendale Campus", city: "Ellendale, ND", lat: 46.0027, lng: -98.5273, mw: 180, source: "Company disclosures / industry estimates" },
  { owner: "Applied Digital", name: "Applied Digital Jamestown Campus", city: "Jamestown, ND", lat: 46.9105, lng: -98.7084, mw: 100, source: "Company disclosures / industry estimates" },
  { owner: "Crusoe", name: "Crusoe Colorado AI Campus", city: "Denver, CO", lat: 39.7392, lng: -104.9903, mw: 80, source: "Company disclosures / industry estimates" },
  { owner: "CoreWeave", name: "CoreWeave Roseland AI Data Center", city: "Roseland, NJ", lat: 40.8207, lng: -74.2938, mw: 60, source: "Company disclosures / industry estimates" },
  { owner: "CoreWeave", name: "CoreWeave Las Vegas AI Cluster", city: "Las Vegas, NV", lat: 36.1716, lng: -115.1391, mw: 70, source: "Company disclosures / industry estimates" },
  { owner: "CoreWeave", name: "CoreWeave Chicago AI Cluster", city: "Chicago, IL", lat: 41.8781, lng: -87.6298, mw: 80, source: "Company disclosures / industry estimates" },
  { owner: "CyrusOne", name: "CyrusOne Dallas Campus", city: "Allen, TX", lat: 33.1032, lng: -96.6706, mw: 120, source: "Company disclosures / industry estimates" },
  { owner: "CyrusOne", name: "CyrusOne Phoenix Campus", city: "Chandler, AZ", lat: 33.3062, lng: -111.8413, mw: 100, source: "Company disclosures / industry estimates" },
  { owner: "CyrusOne", name: "CyrusOne Houston West", city: "Houston, TX", lat: 29.7604, lng: -95.3698, mw: 70, source: "Company disclosures / industry estimates" },
  { owner: "Vantage", name: "Vantage Goodyear Campus", city: "Goodyear, AZ", lat: 33.4353, lng: -112.3582, mw: 160, source: "Company disclosures / industry estimates" },
  { owner: "Vantage", name: "Vantage Santa Clara Campus", city: "Santa Clara, CA", lat: 37.3541, lng: -121.9552, mw: 120, source: "Company disclosures / industry estimates" },
  { owner: "Switch", name: "Switch Grand Rapids Pyramid", city: "Grand Rapids, MI", lat: 42.9634, lng: -85.6681, mw: 100, source: "Company disclosures / industry estimates" },
  { owner: "Switch", name: "Switch Atlanta Campus", city: "Atlanta, GA", lat: 33.749, lng: -84.388, mw: 100, source: "Company disclosures / industry estimates" },
  { owner: "NTT", name: "NTT Hillsboro Campus", city: "Hillsboro, OR", lat: 45.5229, lng: -122.9898, mw: 110, source: "Company disclosures / industry estimates" },
  { owner: "NTT", name: "NTT Garland Campus", city: "Garland, TX", lat: 32.9126, lng: -96.6389, mw: 100, source: "Company disclosures / industry estimates" },
  { owner: "Flexential", name: "Flexential Portland-Hillsboro", city: "Hillsboro, OR", lat: 45.5229, lng: -122.9898, mw: 60, source: "Company disclosures / industry estimates" },
  { owner: "CoreSite", name: "CoreSite Denver Campus", city: "Denver, CO", lat: 39.7392, lng: -104.9903, mw: 65, source: "Company disclosures / industry estimates" },
  { owner: "DataBank", name: "DataBank Dallas DFW Campus", city: "Dallas, TX", lat: 32.7767, lng: -96.797, mw: 70, source: "Company disclosures / industry estimates" },
  { owner: "DataBank", name: "DataBank Salt Lake City Campus", city: "Salt Lake City, UT", lat: 40.7608, lng: -111.891, mw: 70, source: "Company disclosures / industry estimates" },
  { owner: "Aligned", name: "Aligned Phoenix Campus", city: "Phoenix, AZ", lat: 33.4484, lng: -112.074, mw: 80, source: "Company disclosures / industry estimates" },
  { owner: "Aligned", name: "Aligned Ashburn Campus", city: "Ashburn, VA", lat: 39.0438, lng: -77.4874, mw: 90, source: "Company disclosures / industry estimates" }
];

const providerColors = {
  AWS: "#f59e0b",
  Microsoft: "#2563eb",
  Google: "#16a34a",
  Meta: "#0ea5e9",
  Oracle: "#dc2626",
  Apple: "#6b7280",
  CoreWeave: "#7c3aed",
  xAI: "#f97316",
  Crusoe: "#0f766e",
  Default: "#334155"
};

const yearOverrides = {
  "xAI Colossus": 2026,
  "OCI Abilene AI Campus": 2026,
  "Crusoe AI Data Center": 2025,
  "Applied Digital Ellendale Campus": 2025,
  "Applied Digital Jamestown Campus": 2024,
  "CoreWeave Plano / North Texas AI Cluster": 2025,
  "CoreWeave Roseland AI Data Center": 2024,
  "CoreWeave Las Vegas AI Cluster": 2025,
  "CoreWeave Chicago AI Cluster": 2024,
  "Lambda AI Cloud Cluster": 2024,
  "Oracle Phoenix Cloud Region": 2023,
  "Oracle Ashburn Cloud Region": 2022
};

const climateProfiles = {
  hot: "Direct evaporative and chilled water loop",
  arid: "Indirect evaporative cooling with economization",
  temperate: "Airside economization with chilled water assist",
  cool: "Free cooling with closed-loop chilled water"
};

const regionMatchers = [
  { test: /Ashburn|Boydton|Sterling|Leesburg|Reston|Northern Virginia|Henrico|Richmond|Mecklenburg/i, region: "Northern Virginia" },
  { test: /Dallas|Fort Worth|Plano|Allen|Garland|Midlothian|Abilene/i, region: "North Texas" },
  { test: /Austin|San Antonio|Houston/i, region: "Texas Central" },
  { test: /Phoenix|Mesa|Goodyear|Chandler/i, region: "Phoenix Metro" },
  { test: /San Jose|Santa Clara/i, region: "Silicon Valley" },
  { test: /Quincy|Boardman|Umatilla|Hillsboro|The Dalles|Prineville|Oregon/i, region: "Pacific Northwest" },
  { test: /Chicago|DeKalb/i, region: "Chicago Metro" },
  { test: /Atlanta|Newton County/i, region: "Atlanta Metro" },
  { test: /Columbus|New Albany/i, region: "Ohio Corridor" },
  { test: /Las Vegas|Tahoe Reno|Henderson/i, region: "Nevada Desert" },
  { test: /Denver/i, region: "Denver Front Range" },
  { test: /Council Bluffs|Altoona|West Des Moines/i, region: "Iowa Hyperscale" },
  { test: /Moncks Corner|Forest City|Lenoir|Maiden/i, region: "Carolinas" }
];

const stateClimate = {
  TX: "hot",
  AZ: "arid",
  NV: "arid",
  NM: "arid",
  CA: "temperate",
  OR: "cool",
  WA: "cool",
  VA: "temperate",
  NC: "temperate",
  SC: "temperate",
  GA: "hot",
  AL: "hot",
  TN: "temperate",
  IA: "temperate",
  OH: "temperate",
  NE: "temperate",
  ND: "cool",
  CO: "cool",
  UT: "arid",
  WY: "cool",
  IL: "temperate",
  WI: "cool",
  NJ: "temperate",
  MI: "cool",
  OK: "hot"
};

function getState(city) {
  if (!city.includes(",")) {
    if (/Northern Virginia/i.test(city)) return "VA";
    if (/Oregon/i.test(city)) return "OR";
    return "US";
  }

  const parts = city.split(",");
  return parts[parts.length - 1].trim().slice(0, 2).toUpperCase();
}

function deriveRegion(city) {
  const matched = regionMatchers.find((item) => item.test.test(city));
  if (matched) return matched.region;

  const state = getState(city);
  const stateRegions = {
    VA: "Virginia",
    TX: "Texas",
    AZ: "Arizona",
    CA: "California",
    OR: "Oregon",
    WA: "Washington",
    OH: "Ohio",
    NC: "North Carolina",
    GA: "Georgia",
    IL: "Illinois",
    NV: "Nevada",
    CO: "Colorado",
    UT: "Utah",
    IA: "Iowa",
    TN: "Tennessee",
    AL: "Alabama",
    WI: "Wisconsin",
    ND: "North Dakota",
    NJ: "New Jersey",
    MI: "Michigan",
    SC: "South Carolina",
    NE: "Nebraska",
    NM: "New Mexico",
    OK: "Oklahoma",
    WY: "Wyoming"
  };

  return stateRegions[state] || city;
}

function estimateRange(midpoint, spread, precision = 0) {
  const min = Number((midpoint - spread).toFixed(precision));
  const max = Number((midpoint + spread).toFixed(precision));
  return { min, max, avg: Number(midpoint.toFixed(precision)), estimated: true };
}

function estimateCommissionedYear(item, index) {
  if (yearOverrides[item.name]) return yearOverrides[item.name];

  const deterministicOffset = (index * 7 + Math.round(item.mw / 10)) % 15;
  return 2010 + deterministicOffset;
}

function estimateUtilization(item, index) {
  const midpoint = Math.min(86, 56 + item.mw / 8 + (index % 6));
  return estimateRange(midpoint, 6, 0);
}

function estimatePue(item, state) {
  const climate = stateClimate[state] || "temperate";
  const midpoint =
    climate === "cool" ? 1.19 :
    climate === "arid" ? 1.23 :
    climate === "hot" ? 1.31 :
    1.26;

  return estimateRange(midpoint + Math.min(0.08, item.mw / 5000), 0.05, 2);
}

function estimateLatency(item) {
  const region = deriveRegion(item.city);
  const midpoint =
    /Northern Virginia|Chicago Metro|North Texas|Silicon Valley/.test(region) ? 17 :
    /Phoenix Metro|Pacific Northwest|Atlanta Metro|Ohio Corridor/.test(region) ? 22 :
    28;

  return estimateRange(midpoint, 5, 0);
}

function estimateCooling(state) {
  const climate = stateClimate[state] || "temperate";
  return climateProfiles[climate];
}

function markerTone(owner) {
  return providerColors[owner] || providerColors.Default;
}

function facilityType(name) {
  if (/Cloud Region|Region/i.test(name)) return "Cloud Region";
  if (/Campus|Cluster/i.test(name)) return "Campus";
  return "Named Facility";
}

function slugify(value) {
  return value.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");
}

function buildFacility(item, index) {
  const state = getState(item.city);
  const region = deriveRegion(item.city);
  const utilizationPct = estimateUtilization(item, index);
  const pue = estimatePue(item, state);
  const latencyMs = estimateLatency(item);
  const commissionedYear = estimateCommissionedYear(item, index);

  return {
    id: `${slugify(item.owner)}-${slugify(item.name)}`,
    provider: item.owner,
    owner: item.owner,
    name: item.name,
    city: item.city,
    state,
    region,
    lat: item.lat,
    lng: item.lng,
    capacityMw: item.mw,
    facilityType: facilityType(item.name),
    source: item.source,
    cooling: {
      value: estimateCooling(state),
      estimated: true
    },
    utilizationPct,
    pue,
    latencyMs,
    commissionedYear,
    isNew: commissionedYear >= 2025,
    annualEnergyGwh: Math.round((item.mw * 8760) / 1000),
    markerColor: markerTone(item.owner)
  };
}

export const facilities = rawFacilities.map(buildFacility);

export const providers = [...new Set(facilities.map((item) => item.provider))].sort();
export const regions = [...new Set(facilities.map((item) => item.region))].sort();
export const timelineYears = [...new Set(facilities.map((item) => item.commissionedYear))].sort((a, b) => a - b);
