
import React, { useMemo, useState } from "react";
import { MapContainer, TileLayer, CircleMarker, Popup, ZoomControl } from "react-leaflet";

const namedFacilities = [
  { owner: "AWS", name: "AWS Northern Virginia Cluster", city: "Ashburn, VA", lat: 39.0438, lng: -77.4874, mw: 420, type: "Named Facility", source: "Company disclosures / industry estimates" },
  { owner: "Microsoft", name: "Azure Boydton Campus", city: "Boydton, VA", lat: 36.6676, lng: -78.3875, mw: 300, type: "Named Facility", source: "Company disclosures / industry estimates" },
  { owner: "Google", name: "Google Council Bluffs Data Center", city: "Council Bluffs, IA", lat: 41.2619, lng: -95.8608, mw: 250, type: "Named Facility", source: "Company disclosures / industry estimates" },
  { owner: "Meta", name: "Meta Altoona Data Center", city: "Altoona, IA", lat: 41.6505, lng: -93.4647, mw: 220, type: "Named Facility", source: "Company disclosures / industry estimates" },
  { owner: "Google", name: "Google The Dalles Data Center", city: "The Dalles, OR", lat: 45.5946, lng: -121.1787, mw: 230, type: "Named Facility", source: "Company disclosures / industry estimates" },
  { owner: "Meta", name: "Meta Prineville Data Center", city: "Prineville, OR", lat: 44.2998, lng: -120.8345, mw: 200, type: "Named Facility", source: "Company disclosures / industry estimates" },
  { owner: "Apple", name: "Apple Maiden Data Center", city: "Maiden, NC", lat: 35.5757, lng: -81.2112, mw: 120, type: "Named Facility", source: "Company disclosures / industry estimates" },
  { owner: "Google", name: "Google Mayes County Data Center", city: "Pryor, OK", lat: 36.3084, lng: -95.3169, mw: 210, type: "Named Facility", source: "Company disclosures / industry estimates" },
  { owner: "Microsoft", name: "Azure West Des Moines Campus", city: "West Des Moines, IA", lat: 41.5772, lng: -93.7113, mw: 220, type: "Named Facility", source: "Company disclosures / industry estimates" },
  { owner: "Meta", name: "Meta Fort Worth Data Center", city: "Fort Worth, TX", lat: 32.7555, lng: -97.3308, mw: 190, type: "Named Facility", source: "Company disclosures / industry estimates" },
  { owner: "Google", name: "Google Midlothian Data Center", city: "Midlothian, TX", lat: 32.4824, lng: -96.9944, mw: 180, type: "Named Facility", source: "Company disclosures / industry estimates" },
  { owner: "Microsoft", name: "Azure San Antonio Data Center", city: "San Antonio, TX", lat: 29.4241, lng: -98.4936, mw: 140, type: "Named Facility", source: "Company disclosures / industry estimates" },
  { owner: "Oracle", name: "Oracle Austin Cloud Region", city: "Austin, TX", lat: 30.2672, lng: -97.7431, mw: 90, type: "Named Facility", source: "Company disclosures / industry estimates" },
  { owner: "Digital Realty", name: "Digital Realty Dallas Campus", city: "Dallas, TX", lat: 32.7767, lng: -96.7970, mw: 100, type: "Named Facility", source: "Company disclosures / industry estimates" },
  { owner: "Equinix", name: "Equinix Dallas IBX Campus", city: "Dallas, TX", lat: 32.7767, lng: -96.7970, mw: 80, type: "Named Facility", source: "Company disclosures / industry estimates" },
  { owner: "CoreWeave", name: "CoreWeave Plano / North Texas AI Cluster", city: "Plano, TX", lat: 33.0198, lng: -96.6989, mw: 120, type: "Named Facility", source: "Company disclosures / industry estimates" },
  { owner: "xAI", name: "xAI Colossus", city: "Memphis, TN", lat: 35.1495, lng: -90.0490, mw: 150, type: "Named Facility", source: "Company disclosures / industry estimates" },
  { owner: "Oracle", name: "OCI Abilene AI Campus", city: "Abilene, TX", lat: 32.4487, lng: -99.7331, mw: 250, type: "Named Facility", source: "Company disclosures / industry estimates" },
  { owner: "Crusoe", name: "Crusoe AI Data Center", city: "Abilene, TX", lat: 32.4487, lng: -99.7331, mw: 200, type: "Named Facility", source: "Company disclosures / industry estimates" },
  { owner: "AWS", name: "AWS Ohio Region", city: "Columbus, OH", lat: 39.9612, lng: -82.9988, mw: 280, type: "Named Facility", source: "Company disclosures / industry estimates" },
  { owner: "Google", name: "Google New Albany Data Center", city: "New Albany, OH", lat: 40.0812, lng: -82.8088, mw: 180, type: "Named Facility", source: "Company disclosures / industry estimates" },
  { owner: "Meta", name: "Meta New Albany Data Center", city: "New Albany, OH", lat: 40.0812, lng: -82.8088, mw: 160, type: "Named Facility", source: "Company disclosures / industry estimates" },
  { owner: "AWS", name: "AWS Oregon Region", city: "Boardman, OR", lat: 45.8399, lng: -119.7006, mw: 320, type: "Named Facility", source: "Company disclosures / industry estimates" },
  { owner: "AWS", name: "AWS Umatilla Campus", city: "Umatilla, OR", lat: 45.9174, lng: -119.3425, mw: 220, type: "Named Facility", source: "Company disclosures / industry estimates" },
  { owner: "Microsoft", name: "Azure Quincy Campus", city: "Quincy, WA", lat: 47.2343, lng: -119.8526, mw: 200, type: "Named Facility", source: "Company disclosures / industry estimates" },
  { owner: "Yahoo", name: "Yahoo Quincy Data Center", city: "Quincy, WA", lat: 47.2343, lng: -119.8526, mw: 70, type: "Named Facility", source: "Company disclosures / industry estimates" },
  { owner: "Sabey", name: "Sabey Intergate Columbia", city: "Quincy, WA", lat: 47.2343, lng: -119.8526, mw: 90, type: "Named Facility", source: "Company disclosures / industry estimates" },
  { owner: "Vantage", name: "Vantage Quincy Campus", city: "Quincy, WA", lat: 47.2343, lng: -119.8526, mw: 120, type: "Named Facility", source: "Company disclosures / industry estimates" },
  { owner: "Switch", name: "Switch Citadel Campus", city: "Tahoe Reno, NV", lat: 39.5296, lng: -119.8138, mw: 180, type: "Named Facility", source: "Company disclosures / industry estimates" },
  { owner: "Google", name: "Google Henderson Data Center", city: "Henderson, NV", lat: 36.0395, lng: -114.9817, mw: 130, type: "Named Facility", source: "Company disclosures / industry estimates" },
  { owner: "Meta", name: "Meta Los Lunas Data Center", city: "Los Lunas, NM", lat: 34.8062, lng: -106.7334, mw: 180, type: "Named Facility", source: "Company disclosures / industry estimates" },
  { owner: "Apple", name: "Apple Mesa Data Center", city: "Mesa, AZ", lat: 33.4152, lng: -111.8315, mw: 90, type: "Named Facility", source: "Company disclosures / industry estimates" },
  { owner: "Meta", name: "Meta Mesa Data Center", city: "Mesa, AZ", lat: 33.4152, lng: -111.8315, mw: 150, type: "Named Facility", source: "Company disclosures / industry estimates" },
  { owner: "Google", name: "Google Phoenix Cloud Region", city: "Phoenix, AZ", lat: 33.4484, lng: -112.0740, mw: 120, type: "Named Facility", source: "Company disclosures / industry estimates" },
  { owner: "Digital Realty", name: "Digital Realty Phoenix Campus", city: "Phoenix, AZ", lat: 33.4484, lng: -112.0740, mw: 75, type: "Named Facility", source: "Company disclosures / industry estimates" },
  { owner: "QTS", name: "QTS Phoenix Data Center", city: "Phoenix, AZ", lat: 33.4484, lng: -112.0740, mw: 85, type: "Named Facility", source: "Company disclosures / industry estimates" },
  { owner: "AWS", name: "AWS California Region", city: "San Jose, CA", lat: 37.3382, lng: -121.8863, mw: 160, type: "Named Facility", source: "Company disclosures / industry estimates" },
  { owner: "Equinix", name: "Equinix Silicon Valley IBX", city: "San Jose, CA", lat: 37.3382, lng: -121.8863, mw: 110, type: "Named Facility", source: "Company disclosures / industry estimates" },
  { owner: "Digital Realty", name: "Digital Realty Santa Clara", city: "Santa Clara, CA", lat: 37.3541, lng: -121.9552, mw: 120, type: "Named Facility", source: "Company disclosures / industry estimates" },
  { owner: "CoreSite", name: "CoreSite Santa Clara", city: "Santa Clara, CA", lat: 37.3541, lng: -121.9552, mw: 85, type: "Named Facility", source: "Company disclosures / industry estimates" },
  { owner: "Microsoft", name: "Azure Cheyenne Campus", city: "Cheyenne, WY", lat: 41.1400, lng: -104.8202, mw: 150, type: "Named Facility", source: "Company disclosures / industry estimates" },
  { owner: "Meta", name: "Meta Eagle Mountain Data Center", city: "Eagle Mountain, UT", lat: 40.3141, lng: -112.0069, mw: 160, type: "Named Facility", source: "Company disclosures / industry estimates" },
  { owner: "Google", name: "Google Atlanta Cloud Region", city: "Atlanta, GA", lat: 33.7490, lng: -84.3880, mw: 120, type: "Named Facility", source: "Company disclosures / industry estimates" },
  { owner: "QTS", name: "QTS Atlanta-Metro", city: "Atlanta, GA", lat: 33.7490, lng: -84.3880, mw: 100, type: "Named Facility", source: "Company disclosures / industry estimates" },
  { owner: "Flexential", name: "Flexential Atlanta", city: "Atlanta, GA", lat: 33.7490, lng: -84.3880, mw: 60, type: "Named Facility", source: "Company disclosures / industry estimates" },
  { owner: "Microsoft", name: "Azure Atlanta Region", city: "Atlanta, GA", lat: 33.7490, lng: -84.3880, mw: 130, type: "Named Facility", source: "Company disclosures / industry estimates" },
  { owner: "Google", name: "Google Berkeley County Data Center", city: "Moncks Corner, SC", lat: 33.1960, lng: -80.0131, mw: 170, type: "Named Facility", source: "Company disclosures / industry estimates" },
  { owner: "Meta", name: "Meta Forest City Data Center", city: "Forest City, NC", lat: 35.3340, lng: -81.8651, mw: 140, type: "Named Facility", source: "Company disclosures / industry estimates" },
  { owner: "Microsoft", name: "Azure Chicago Region", city: "Chicago, IL", lat: 41.8781, lng: -87.6298, mw: 150, type: "Named Facility", source: "Company disclosures / industry estimates" },
  { owner: "Digital Realty", name: "Digital Realty Chicago", city: "Chicago, IL", lat: 41.8781, lng: -87.6298, mw: 100, type: "Named Facility", source: "Company disclosures / industry estimates" },
  { owner: "Equinix", name: "Equinix Chicago IBX", city: "Chicago, IL", lat: 41.8781, lng: -87.6298, mw: 95, type: "Named Facility", source: "Company disclosures / industry estimates" },
  { owner: "Meta", name: "Meta DeKalb Data Center", city: "DeKalb, IL", lat: 41.9295, lng: -88.7504, mw: 160, type: "Named Facility", source: "Company disclosures / industry estimates" },
  { owner: "Google", name: "Google Clarksville Data Center", city: "Clarksville, TN", lat: 36.5298, lng: -87.3595, mw: 170, type: "Named Facility", source: "Company disclosures / industry estimates" },
  { owner: "Meta", name: "Meta Gallatin Data Center", city: "Gallatin, TN", lat: 36.3884, lng: -86.4467, mw: 150, type: "Named Facility", source: "Company disclosures / industry estimates" },
  { owner: "Microsoft", name: "Azure Southern Virginia Campus", city: "Mecklenburg County, VA", lat: 36.6418, lng: -78.5569, mw: 240, type: "Named Facility", source: "Company disclosures / industry estimates" },
  { owner: "QTS", name: "QTS Richmond Data Center", city: "Richmond, VA", lat: 37.5407, lng: -77.4360, mw: 120, type: "Named Facility", source: "Company disclosures / industry estimates" },
  { owner: "Digital Realty", name: "Digital Realty Ashburn", city: "Ashburn, VA", lat: 39.0438, lng: -77.4874, mw: 150, type: "Named Facility", source: "Company disclosures / industry estimates" },
  { owner: "Equinix", name: "Equinix Ashburn DC Campus", city: "Ashburn, VA", lat: 39.0438, lng: -77.4874, mw: 160, type: "Named Facility", source: "Company disclosures / industry estimates" },
  { owner: "CoreSite", name: "CoreSite Reston", city: "Reston, VA", lat: 38.9586, lng: -77.3570, mw: 75, type: "Named Facility", source: "Company disclosures / industry estimates" },
  { owner: "RagingWire / NTT", name: "NTT Ashburn Campus", city: "Ashburn, VA", lat: 39.0438, lng: -77.4874, mw: 120, type: "Named Facility", source: "Company disclosures / industry estimates" },
  { owner: "Vantage", name: "Vantage Northern Virginia", city: "Ashburn, VA", lat: 39.0438, lng: -77.4874, mw: 140, type: "Named Facility", source: "Company disclosures / industry estimates" },
  { owner: "Compass", name: "Compass Northern Virginia", city: "Leesburg, VA", lat: 39.1157, lng: -77.5636, mw: 90, type: "Named Facility", source: "Company disclosures / industry estimates" },
  { owner: "CyrusOne", name: "CyrusOne Northern Virginia", city: "Sterling, VA", lat: 39.0062, lng: -77.4286, mw: 100, type: "Named Facility", source: "Company disclosures / industry estimates" },
  { owner: "AWS", name: "AWS GovCloud East", city: "Northern Virginia", lat: 38.9696, lng: -77.3861, mw: 180, type: "Named Facility", source: "Company disclosures / industry estimates" },
  { owner: "AWS", name: "AWS GovCloud West", city: "Oregon", lat: 45.8399, lng: -119.7006, mw: 150, type: "Named Facility", source: "Company disclosures / industry estimates" },
  { owner: "Google", name: "Google Lenoir Data Center", city: "Lenoir, NC", lat: 35.9140, lng: -81.5390, mw: 160, type: "Named Facility", source: "Company disclosures / industry estimates" },
  { owner: "Google", name: "Google Papillion Data Center", city: "Papillion, NE", lat: 41.1544, lng: -96.0422, mw: 180, type: "Named Facility", source: "Company disclosures / industry estimates" },
  { owner: "Meta", name: "Meta Springfield Data Center", city: "Springfield, NE", lat: 41.0825, lng: -96.1345, mw: 150, type: "Named Facility", source: "Company disclosures / industry estimates" },
  { owner: "Meta", name: "Meta Henrico Data Center", city: "Henrico, VA", lat: 37.5059, lng: -77.3324, mw: 150, type: "Named Facility", source: "Company disclosures / industry estimates" },
  { owner: "Meta", name: "Meta Huntsville Data Center", city: "Huntsville, AL", lat: 34.7304, lng: -86.5861, mw: 140, type: "Named Facility", source: "Company disclosures / industry estimates" },
  { owner: "Google", name: "Google Jackson County Data Center", city: "Bridgeport, AL", lat: 34.9470, lng: -85.7144, mw: 150, type: "Named Facility", source: "Company disclosures / industry estimates" },
  { owner: "Microsoft", name: "Azure Wisconsin Data Center", city: "Mount Pleasant, WI", lat: 42.6978, lng: -87.8556, mw: 200, type: "Named Facility", source: "Company disclosures / industry estimates" },
  { owner: "Meta", name: "Meta Newton Data Center", city: "Newton County, GA", lat: 33.5544, lng: -83.8473, mw: 160, type: "Named Facility", source: "Company disclosures / industry estimates" },
  { owner: "AWS", name: "AWS Georgia Data Center", city: "Atlanta Metro, GA", lat: 33.7490, lng: -84.3880, mw: 150, type: "Named Facility", source: "Company disclosures / industry estimates" },
  { owner: "Oracle", name: "Oracle Phoenix Cloud Region", city: "Phoenix, AZ", lat: 33.4484, lng: -112.0740, mw: 80, type: "Named Facility", source: "Company disclosures / industry estimates" },
  { owner: "Oracle", name: "Oracle Chicago Cloud Region", city: "Chicago, IL", lat: 41.8781, lng: -87.6298, mw: 80, type: "Named Facility", source: "Company disclosures / industry estimates" },
  { owner: "Oracle", name: "Oracle Ashburn Cloud Region", city: "Ashburn, VA", lat: 39.0438, lng: -77.4874, mw: 100, type: "Named Facility", source: "Company disclosures / industry estimates" },
  { owner: "Lambda", name: "Lambda AI Cloud Cluster", city: "Dallas, TX", lat: 32.7767, lng: -96.7970, mw: 60, type: "Named Facility", source: "Company disclosures / industry estimates" },
  { owner: "Applied Digital", name: "Applied Digital Ellendale Campus", city: "Ellendale, ND", lat: 46.0027, lng: -98.5273, mw: 180, type: "Named Facility", source: "Company disclosures / industry estimates" },
  { owner: "Applied Digital", name: "Applied Digital Jamestown Campus", city: "Jamestown, ND", lat: 46.9105, lng: -98.7084, mw: 100, type: "Named Facility", source: "Company disclosures / industry estimates" },
  { owner: "Crusoe", name: "Crusoe Colorado AI Campus", city: "Denver, CO", lat: 39.7392, lng: -104.9903, mw: 80, type: "Named Facility", source: "Company disclosures / industry estimates" },
  { owner: "CoreWeave", name: "CoreWeave Roseland AI Data Center", city: "Roseland, NJ", lat: 40.8207, lng: -74.2938, mw: 60, type: "Named Facility", source: "Company disclosures / industry estimates" },
  { owner: "CoreWeave", name: "CoreWeave Las Vegas AI Cluster", city: "Las Vegas, NV", lat: 36.1716, lng: -115.1391, mw: 70, type: "Named Facility", source: "Company disclosures / industry estimates" },
  { owner: "CoreWeave", name: "CoreWeave Chicago AI Cluster", city: "Chicago, IL", lat: 41.8781, lng: -87.6298, mw: 80, type: "Named Facility", source: "Company disclosures / industry estimates" },
  { owner: "CyrusOne", name: "CyrusOne Dallas Campus", city: "Allen, TX", lat: 33.1032, lng: -96.6706, mw: 120, type: "Named Facility", source: "Company disclosures / industry estimates" },
  { owner: "CyrusOne", name: "CyrusOne Phoenix Campus", city: "Chandler, AZ", lat: 33.3062, lng: -111.8413, mw: 100, type: "Named Facility", source: "Company disclosures / industry estimates" },
  { owner: "CyrusOne", name: "CyrusOne Houston West", city: "Houston, TX", lat: 29.7604, lng: -95.3698, mw: 70, type: "Named Facility", source: "Company disclosures / industry estimates" },
  { owner: "Vantage", name: "Vantage Goodyear Campus", city: "Goodyear, AZ", lat: 33.4353, lng: -112.3582, mw: 160, type: "Named Facility", source: "Company disclosures / industry estimates" },
  { owner: "Vantage", name: "Vantage Santa Clara Campus", city: "Santa Clara, CA", lat: 37.3541, lng: -121.9552, mw: 120, type: "Named Facility", source: "Company disclosures / industry estimates" },
  { owner: "Switch", name: "Switch Grand Rapids Pyramid", city: "Grand Rapids, MI", lat: 42.9634, lng: -85.6681, mw: 100, type: "Named Facility", source: "Company disclosures / industry estimates" },
  { owner: "Switch", name: "Switch Atlanta Campus", city: "Atlanta, GA", lat: 33.7490, lng: -84.3880, mw: 100, type: "Named Facility", source: "Company disclosures / industry estimates" },
  { owner: "NTT", name: "NTT Hillsboro Campus", city: "Hillsboro, OR", lat: 45.5229, lng: -122.9898, mw: 110, type: "Named Facility", source: "Company disclosures / industry estimates" },
  { owner: "NTT", name: "NTT Garland Campus", city: "Garland, TX", lat: 32.9126, lng: -96.6389, mw: 100, type: "Named Facility", source: "Company disclosures / industry estimates" },
  { owner: "Flexential", name: "Flexential Portland-Hillsboro", city: "Hillsboro, OR", lat: 45.5229, lng: -122.9898, mw: 60, type: "Named Facility", source: "Company disclosures / industry estimates" },
  { owner: "CoreSite", name: "CoreSite Denver Campus", city: "Denver, CO", lat: 39.7392, lng: -104.9903, mw: 65, type: "Named Facility", source: "Company disclosures / industry estimates" },
  { owner: "DataBank", name: "DataBank Dallas DFW Campus", city: "Dallas, TX", lat: 32.7767, lng: -96.7970, mw: 70, type: "Named Facility", source: "Company disclosures / industry estimates" },
  { owner: "DataBank", name: "DataBank Salt Lake City Campus", city: "Salt Lake City, UT", lat: 40.7608, lng: -111.8910, mw: 70, type: "Named Facility", source: "Company disclosures / industry estimates" },
  { owner: "Aligned", name: "Aligned Phoenix Campus", city: "Phoenix, AZ", lat: 33.4484, lng: -112.0740, mw: 80, type: "Named Facility", source: "Company disclosures / industry estimates" },
  { owner: "Aligned", name: "Aligned Ashburn Campus", city: "Ashburn, VA", lat: 39.0438, lng: -77.4874, mw: 90, type: "Named Facility", source: "Company disclosures / industry estimates" }
];

const clusters = [
  { owner: "Regional Cluster", name: "Northern Virginia / DC Metro", city: "Ashburn, Sterling, Manassas, VA", lat: 39.0438, lng: -77.4874, count: 550, mw: 5200, type: "Regional Cluster", source: "Aggregated market estimate" },
  { owner: "Regional Cluster", name: "Dallas-Fort Worth", city: "Dallas, Fort Worth, Plano, Allen, TX", lat: 32.7767, lng: -96.7970, count: 260, mw: 1900, type: "Regional Cluster", source: "Aggregated market estimate" },
  { owner: "Regional Cluster", name: "Phoenix Metro", city: "Phoenix, Mesa, Chandler, Goodyear, AZ", lat: 33.4484, lng: -112.0740, count: 230, mw: 1700, type: "Regional Cluster", source: "Aggregated market estimate" },
  { owner: "Regional Cluster", name: "Chicago Metro", city: "Chicago, Elk Grove, Aurora, IL", lat: 41.8781, lng: -87.6298, count: 210, mw: 1300, type: "Regional Cluster", source: "Aggregated market estimate" },
  { owner: "Regional Cluster", name: "Silicon Valley / Bay Area", city: "San Jose, Santa Clara, CA", lat: 37.3382, lng: -121.8863, count: 240, mw: 1400, type: "Regional Cluster", source: "Aggregated market estimate" },
  { owner: "Regional Cluster", name: "Atlanta Metro", city: "Atlanta, Lithia Springs, GA", lat: 33.7490, lng: -84.3880, count: 180, mw: 1000, type: "Regional Cluster", source: "Aggregated market estimate" },
  { owner: "Regional Cluster", name: "Pacific Northwest", city: "Quincy, Boardman, Hillsboro, OR/WA", lat: 45.8399, lng: -119.7006, count: 220, mw: 1800, type: "Regional Cluster", source: "Aggregated market estimate" },
  { owner: "Regional Cluster", name: "New York / New Jersey", city: "NYC, Secaucus, Piscataway, NJ", lat: 40.7128, lng: -74.0060, count: 280, mw: 1300, type: "Regional Cluster", source: "Aggregated market estimate" },
  { owner: "Regional Cluster", name: "Los Angeles / Southern California", city: "Los Angeles, Irvine, CA", lat: 34.0522, lng: -118.2437, count: 200, mw: 950, type: "Regional Cluster", source: "Aggregated market estimate" },
  { owner: "Regional Cluster", name: "Denver / Mountain West", city: "Denver, Aurora, CO", lat: 39.7392, lng: -104.9903, count: 120, mw: 650, type: "Regional Cluster", source: "Aggregated market estimate" },
  { owner: "Regional Cluster", name: "Ohio Hyperscale Corridor", city: "Columbus, New Albany, OH", lat: 39.9612, lng: -82.9988, count: 150, mw: 1200, type: "Regional Cluster", source: "Aggregated market estimate" },
  { owner: "Regional Cluster", name: "Texas Central / San Antonio / Austin", city: "Austin, San Antonio, TX", lat: 30.2672, lng: -97.7431, count: 160, mw: 900, type: "Regional Cluster", source: "Aggregated market estimate" },
  { owner: "Regional Cluster", name: "Charlotte / Carolinas", city: "Charlotte, Raleigh, Lenoir, NC/SC", lat: 35.2271, lng: -80.8431, count: 170, mw: 950, type: "Regional Cluster", source: "Aggregated market estimate" },
  { owner: "Regional Cluster", name: "Las Vegas / Reno", city: "Las Vegas, Reno, NV", lat: 36.1716, lng: -115.1391, count: 120, mw: 850, type: "Regional Cluster", source: "Aggregated market estimate" },
  { owner: "Regional Cluster", name: "Remaining US Markets", city: "Other U.S. metros", lat: 39.8283, lng: -98.5795, count: 1760, mw: 7600, type: "Regional Cluster", source: "Aggregated market estimate" }
];

function annualGwh(mw) {
  return Math.round(mw * 8760 / 1000);
}

function markerRadius(item) {
  if (item.type === "Regional Cluster") return Math.min(34, 12 + item.mw / 300);
  return Math.min(18, 7 + item.mw / 55);
}

function markerClass(item) {
  return item.type === "Regional Cluster" ? "cluster-marker" : "facility-marker";
}

export default function App() {
  const [viewMode, setViewMode] = useState("both");
  const [query, setQuery] = useState("");

  const rows = useMemo(() => {
    let data = [];
    if (viewMode === "named" || viewMode === "both") data = data.concat(namedFacilities);
    if (viewMode === "clusters" || viewMode === "both") data = data.concat(clusters);

    const q = query.trim().toLowerCase();
    if (!q) return data;

    return data.filter((item) =>
      [item.owner, item.name, item.city, item.type].join(" ").toLowerCase().includes(q)
    );
  }, [viewMode, query]);

  const totals = useMemo(() => {
    const mw = rows.reduce((sum, item) => sum + item.mw, 0);
    const count = rows.reduce((sum, item) => sum + (item.count || 1), 0);
    return { mw, count, gwh: annualGwh(mw) };
  }, [rows]);

  return (
    <div className="app">
      <aside className="panel">
        <div className="brand">
          <div className="logo">AI</div>
          <div>
            <h1>AI Data Center Atlas</h1>
            <p>U.S. AI and hyperscale data center map</p>
          </div>
        </div>

        <div className="stats">
          <div>
            <strong>{totals.count.toLocaleString()}</strong>
            <span>Facilities shown</span>
          </div>
          <div>
            <strong>{totals.mw.toLocaleString()} MW</strong>
            <span>Avg. power estimate</span>
          </div>
          <div>
            <strong>{totals.gwh.toLocaleString()} GWh</strong>
            <span>Annual energy estimate</span>
          </div>
        </div>

        <label className="label">Search</label>
        <input
          className="search"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search owner, city, region..."
        />

        <label className="label">View mode</label>
        <div className="toggles">
          <button className={viewMode === "both" ? "active" : ""} onClick={() => setViewMode("both")}>Both</button>
          <button className={viewMode === "named" ? "active" : ""} onClick={() => setViewMode("named")}>Named</button>
          <button className={viewMode === "clusters" ? "active" : ""} onClick={() => setViewMode("clusters")}>Clusters</button>
        </div>

        <div className="legend">
          <div><span className="dot named"></span> Named facility</div>
          <div><span className="dot cluster"></span> Regional cluster</div>
        </div>

        <div className="note">
          Wattage values are annual-average estimates in MW. Cluster dots aggregate smaller facilities by metro/region.
        </div>
      </aside>

      <main className="map-wrap">
        <MapContainer
          center={[39.2, -96.5]}
          zoom={4}
          minZoom={3}
          maxZoom={12}
          zoomControl={false}
          className="map"
        >
          <ZoomControl position="bottomright" />
          <TileLayer
            attribution='&copy; OpenStreetMap contributors'
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          />

          {rows.map((item, index) => (
            <CircleMarker
              key={`${item.name}-${index}`}
              center={[item.lat, item.lng]}
              radius={markerRadius(item)}
              className={markerClass(item)}
              pathOptions={{
                color: item.type === "Regional Cluster" ? "#7c3aed" : "#0f172a",
                fillColor: item.type === "Regional Cluster" ? "#8b5cf6" : "#2563eb",
                fillOpacity: item.type === "Regional Cluster" ? 0.35 : 0.65,
                weight: 2
              }}
            >
              <Popup>
                <div className="popup">
                  <h3>{item.name}</h3>
                  <p><b>Owner:</b> {item.owner}</p>
                  <p><b>Location:</b> {item.city}</p>
                  <p><b>Type:</b> {item.type}</p>
                  {item.count && <p><b>Estimated facilities:</b> {item.count.toLocaleString()}</p>}
                  <p><b>Annual avg. wattage:</b> {item.mw.toLocaleString()} MW</p>
                  <p><b>Annual energy:</b> {annualGwh(item.mw).toLocaleString()} GWh/year</p>
                  <p className="source"><b>Source:</b> {item.source}</p>
                </div>
              </Popup>
            </CircleMarker>
          ))}
        </MapContainer>
      </main>
    </div>
  );
}
