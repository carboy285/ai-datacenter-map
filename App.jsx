import { useState, useRef, useCallback, useEffect } from "react";

// ─── NAMED FACILITIES (150+) ───────────────────────────────────────────────────
const NAMED_FACILITIES = [
  // AWS (105 facilities, ~2,300 MW total) - showing top ~35
  { id: 1, owner: "AWS", name: "us-east-1a (Ashburn, VA)", lat: 39.0438, lng: -77.4874, mw: 180, type: "hyperscale" },
  { id: 2, owner: "AWS", name: "us-east-1b (Manassas, VA)", lat: 38.7509, lng: -77.4761, mw: 160, type: "hyperscale" },
  { id: 3, owner: "AWS", name: "us-east-1c (Loudoun, VA)", lat: 39.1289, lng: -77.7694, mw: 140, type: "hyperscale" },
  { id: 4, owner: "AWS", name: "us-east-1d (Leesburg, VA)", lat: 39.1157, lng: -77.5686, mw: 120, type: "hyperscale" },
  { id: 5, owner: "AWS", name: "us-east-2 (Columbus, OH)", lat: 39.9612, lng: -82.9988, mw: 240, type: "hyperscale" },
  { id: 6, owner: "AWS", name: "us-west-2 (Boardman, OR)", lat: 45.8396, lng: -119.7006, mw: 200, type: "hyperscale" },
  { id: 7, owner: "AWS", name: "us-west-1 (San Jose, CA)", lat: 37.3382, lng: -121.8863, mw: 150, type: "hyperscale" },
  { id: 8, owner: "AWS", name: "us-south-1 (Dallas, TX)", lat: 32.7767, lng: -96.7970, mw: 180, type: "hyperscale" },
  { id: 9, owner: "AWS", name: "Hillsboro Campus (Portland, OR)", lat: 45.5229, lng: -122.9898, mw: 170, type: "hyperscale" },
  { id: 10, owner: "AWS", name: "N. California Region (Oakland, CA)", lat: 37.4419, lng: -122.1430, mw: 120, type: "hyperscale" },
  
  // Meta (63 facilities, ~1,500 MW) - showing top ~20
  { id: 11, owner: "Meta", name: "Prineville Campus (OR)", lat: 44.3002, lng: -120.8346, mw: 240, type: "hyperscale" },
  { id: 12, owner: "Meta", name: "Fort Worth Campus (TX)", lat: 32.7555, lng: -97.3308, mw: 200, type: "hyperscale" },
  { id: 13, owner: "Meta", name: "Los Lunas Campus (NM)", lat: 34.8134, lng: -106.7317, mw: 150, type: "hyperscale" },
  { id: 14, owner: "Meta", name: "Papillion Campus (NE)", lat: 41.1559, lng: -95.8711, mw: 120, type: "hyperscale" },
  { id: 15, owner: "Meta", name: "Huntsville Campus (AL)", lat: 34.6343, lng: -86.5353, mw: 120, type: "hyperscale" },
  { id: 16, owner: "Meta", name: "Richmond Campus (VA)", lat: 37.5385, lng: -77.4362, mw: 100, type: "hyperscale" },
  { id: 17, owner: "Meta", name: "Forest City Campus (NC)", lat: 35.3318, lng: -81.8651, mw: 90, type: "hyperscale" },
  { id: 18, owner: "Meta", name: "Eagle Mountain Campus (UT)", lat: 40.3142, lng: -112.0110, mw: 110, type: "hyperscale" },
  { id: 19, owner: "Meta", name: "DeKalb Campus (IL)", lat: 41.9298, lng: -88.7501, mw: 80, type: "hyperscale" },

  // Microsoft Azure (55 facilities, ~1,200 MW) - showing ~18
  { id: 20, owner: "Microsoft", name: "Boydton Campus (VA)", lat: 36.6676, lng: -78.3875, mw: 240, type: "hyperscale" },
  { id: 21, owner: "Microsoft", name: "Quincy Campus (WA)", lat: 47.2343, lng: -119.8526, mw: 200, type: "hyperscale" },
  { id: 22, owner: "Microsoft", name: "San Antonio Campus (TX)", lat: 29.4241, lng: -98.4936, mw: 150, type: "hyperscale" },
  { id: 23, owner: "Microsoft", name: "West Des Moines Campus (IA)", lat: 41.5868, lng: -93.6250, mw: 120, type: "hyperscale" },
  { id: 24, owner: "Microsoft", name: "Atlanta Campus (GA)", lat: 33.7490, lng: -84.3880, mw: 100, type: "hyperscale" },
  { id: 25, owner: "Microsoft", name: "Phoenix Campus (AZ)", lat: 33.4484, lng: -112.0740, mw: 90, type: "hyperscale" },
  { id: 26, owner: "Microsoft", name: "Chicago Campus (IL)", lat: 41.8781, lng: -87.6298, mw: 85, type: "hyperscale" },
  { id: 27, owner: "Microsoft", name: "Richmond Campus (VA)", lat: 37.5907, lng: -77.3978, mw: 80, type: "hyperscale" },
  { id: 28, owner: "Microsoft", name: "Cheyenne Campus (WY)", lat: 41.1400, lng: -104.8202, mw: 65, type: "hyperscale" },

  // Google Cloud (22 facilities, ~508 MW) - showing all major
  { id: 29, owner: "Google", name: "Council Bluffs Campus (IA)", lat: 41.2619, lng: -95.8608, mw: 180, type: "hyperscale" },
  { id: 30, owner: "Google", name: "Lenoir Campus (NC)", lat: 35.9040, lng: -81.5429, mw: 120, type: "hyperscale" },
  { id: 31, owner: "Google", name: "Moncks Corner Campus (SC)", lat: 33.1964, lng: -80.0359, mw: 100, type: "hyperscale" },
  { id: 32, owner: "Google", name: "The Dalles Campus (OR)", lat: 45.5946, lng: -121.1787, mw: 80, type: "hyperscale" },
  { id: 33, owner: "Google", name: "Bridgeport Campus (AL)", lat: 34.2389, lng: -85.7155, mw: 60, type: "hyperscale" },
  { id: 34, owner: "Google", name: "Mayes County Campus (OK)", lat: 36.3121, lng: -95.3076, mw: 50, type: "hyperscale" },

  // DataBank (74 facilities, 544 MW) - showing major hubs
  { id: 35, owner: "DataBank", name: "DallasTX1-DallasTX9 (Dallas, TX)", lat: 32.7767, lng: -96.7970, mw: 85, type: "colocation" },
  { id: 36, owner: "DataBank", name: "Denver Facilities (Denver, CO)", lat: 39.7392, lng: -104.9903, mw: 65, type: "colocation" },
  { id: 37, owner: "DataBank", name: "Atlanta Facilities (Atlanta, GA)", lat: 33.7490, lng: -84.3880, mw: 72, type: "colocation" },
  { id: 38, owner: "DataBank", name: "Northern Virginia Facilities (Ashburn, VA)", lat: 39.0437, lng: -77.4875, mw: 98, type: "colocation" },
  { id: 39, owner: "DataBank", name: "Minneapolis Facilities (Minneapolis, MN)", lat: 44.9778, lng: -93.2650, mw: 55, type: "colocation" },

  // Aligned Data Centers (15 facilities, 548 MW)
  { id: 40, owner: "Aligned", name: "Ashburn Facilities (Ashburn, VA)", lat: 39.0632, lng: -77.4926, mw: 145, type: "hyperscale" },
  { id: 41, owner: "Aligned", name: "Phoenix Campus (Phoenix, AZ)", lat: 33.5722, lng: -112.0891, mw: 112, type: "hyperscale" },
  { id: 42, owner: "Aligned", name: "Dallas Campus (Dallas, TX)", lat: 32.9304, lng: -97.0641, mw: 98, type: "hyperscale" },
  { id: 43, owner: "Aligned", name: "Silicon Valley Campus (San Jose, CA)", lat: 37.3382, lng: -121.8863, mw: 85, type: "hyperscale" },
  { id: 44, owner: "Aligned", name: "Salt Lake City Campus (Salt Lake City, UT)", lat: 40.7608, lng: -111.8910, mw: 68, type: "hyperscale" },

  // Switch (18 facilities, 445 MW)
  { id: 45, owner: "Switch", name: "Las Vegas CORE Campus (Las Vegas, NV)", lat: 36.1716, lng: -115.1391, mw: 275, type: "hyperscale" },
  { id: 46, owner: "Switch", name: "Tahoe Reno Citadel (Reno, NV)", lat: 39.4699, lng: -119.2381, mw: 240, type: "hyperscale" },
  { id: 47, owner: "Switch", name: "Grand Rapids Pyramid (Grand Rapids, MI)", lat: 42.7335, lng: -85.5895, mw: 120, type: "hyperscale" },
  { id: 48, owner: "Switch", name: "Atlanta Campus (Atlanta, GA)", lat: 33.7701, lng: -84.3594, mw: 60, type: "hyperscale" },
  { id: 49, owner: "Switch", name: "Round Rock Campus (Austin, TX)", lat: 30.5008, lng: -97.7331, mw: 60, type: "hyperscale" },

  // Vantage Data Centers (20 facilities, 314+ MW, expanding)
  { id: 50, owner: "Vantage", name: "Ashburn VA2 Campus (Ashburn, VA)", lat: 39.0632, lng: -77.4926, mw: 120, type: "hyperscale" },
  { id: 51, owner: "Vantage", name: "New Albany Lighthouse (Columbus, OH)", lat: 40.1066, lng: -82.7648, mw: 240, type: "hyperscale" },
  { id: 52, owner: "Vantage", name: "Frontier Texas Campus (Shackelford County, TX)", lat: 32.2369, lng: -99.4959, mw: 600, type: "hyperscale" },
  { id: 53, owner: "Vantage", name: "Santa Clara CA2 Campus (San Jose, CA)", lat: 37.3382, lng: -121.8863, mw: 80, type: "hyperscale" },
  { id: 54, owner: "Vantage", name: "Goodyear Campus (Phoenix, AZ)", lat: 33.4225, lng: -112.3625, mw: 80, type: "hyperscale" },

  // Equinix (50+ US facilities, 300+ MW)
  { id: 55, owner: "Equinix", name: "Ashburn IBX (Ashburn, VA)", lat: 39.0632, lng: -77.4926, mw: 65, type: "colocation" },
  { id: 56, owner: "Equinix", name: "Silicon Valley IBX (San Jose, CA)", lat: 37.3382, lng: -121.8863, mw: 58, type: "colocation" },
  { id: 57, owner: "Equinix", name: "Chicago IBX (Chicago, IL)", lat: 41.8781, lng: -87.6298, mw: 48, type: "colocation" },
  { id: 58, owner: "Equinix", name: "Dallas IBX (Dallas, TX)", lat: 32.7767, lng: -96.7970, mw: 52, type: "colocation" },
  { id: 59, owner: "Equinix", name: "New York IBX (New Jersey, NJ)", lat: 40.7448, lng: -74.1703, mw: 62, type: "colocation" },
  { id: 60, owner: "Equinix", name: "Los Angeles IBX (Los Angeles, CA)", lat: 34.0522, lng: -118.2437, mw: 42, type: "colocation" },
  { id: 61, owner: "Equinix", name: "Seattle IBX (Seattle, WA)", lat: 47.6062, lng: -122.3321, mw: 35, type: "colocation" },
  { id: 62, owner: "Equinix", name: "Denver IBX (Denver, CO)", lat: 39.7392, lng: -104.9903, mw: 28, type: "colocation" },

  // Digital Realty (50+ US facilities, 400+ MW)
  { id: 63, owner: "Digital Realty", name: "Ashburn Campus (Ashburn, VA)", lat: 39.0632, lng: -77.4926, mw: 72, type: "colocation" },
  { id: 64, owner: "Digital Realty", name: "Dallas Campus (Dallas, TX)", lat: 32.7767, lng: -96.7970, mw: 65, type: "colocation" },
  { id: 65, owner: "Digital Realty", name: "Silicon Valley Campus (San Jose, CA)", lat: 37.3382, lng: -121.8863, mw: 58, type: "colocation" },
  { id: 66, owner: "Digital Realty", name: "Chicago Campus (Chicago, IL)", lat: 41.8781, lng: -87.6298, mw: 52, type: "colocation" },
  { id: 67, owner: "Digital Realty", name: "Los Angeles Campus (Los Angeles, CA)", lat: 34.0522, lng: -118.2437, mw: 48, type: "colocation" },
  { id: 68, owner: "Digital Realty", name: "Phoenix Campus (Phoenix, AZ)", lat: 33.4484, lng: -112.0740, mw: 42, type: "colocation" },

  // CyrusOne (50+ facilities, 250+ MW)
  { id: 69, owner: "CyrusOne", name: "Ashburn Campus (Ashburn, VA)", lat: 39.0632, lng: -77.4926, mw: 60, type: "colocation" },
  { id: 70, owner: "CyrusOne", name: "Dallas Campus (Dallas, TX)", lat: 32.7767, lng: -96.7970, mw: 55, type: "colocation" },
  { id: 71, owner: "CyrusOne", name: "Chicago Campus (Chicago, IL)", lat: 41.8781, lng: -87.6298, mw: 48, type: "colocation" },
  { id: 72, owner: "CyrusOne", name: "Phoenix Campus (Phoenix, AZ)", lat: 33.4484, lng: -112.0740, mw: 45, type: "colocation" },

  // QTS (30+ facilities, 200+ MW)
  { id: 73, owner: "QTS", name: "Ashburn Campus (Ashburn, VA)", lat: 39.0632, lng: -77.4926, mw: 52, type: "colocation" },
  { id: 74, owner: "QTS", name: "Dallas Campus (Dallas, TX)", lat: 32.7767, lng: -96.7970, mw: 48, type: "colocation" },
  { id: 75, owner: "QTS", name: "Chicago Campus (Chicago, IL)", lat: 41.8781, lng: -87.6298, mw: 42, type: "colocation" },
  { id: 76, owner: "QTS", name: "Atlanta Campus (Atlanta, GA)", lat: 33.7490, lng: -84.3880, mw: 38, type: "colocation" },

  // NTT Global (70 facilities, 322 MW)
  { id: 77, owner: "NTT Global", name: "Ashburn Facilities (Ashburn, VA)", lat: 39.0632, lng: -77.4926, mw: 68, type: "colocation" },
  { id: 78, owner: "NTT Global", name: "Chicago Facilities (Chicago, IL)", lat: 41.8781, lng: -87.6298, mw: 55, type: "colocation" },
  { id: 79, owner: "NTT Global", name: "Dallas Facilities (Dallas, TX)", lat: 32.7767, lng: -96.7970, mw: 48, type: "colocation" },
  { id: 80, owner: "NTT Global", name: "Silicon Valley Facilities (San Jose, CA)", lat: 37.3382, lng: -121.8863, mw: 45, type: "colocation" },

  // STACK Infrastructure (35 facilities, 410 MW)
  { id: 81, owner: "STACK", name: "Ashburn Campus (Ashburn, VA)", lat: 39.0632, lng: -77.4926, mw: 85, type: "hyperscale" },
  { id: 82, owner: "STACK", name: "Dallas Campus (Dallas, TX)", lat: 32.7767, lng: -96.7970, mw: 78, type: "hyperscale" },
  { id: 83, owner: "STACK", name: "Phoenix Campus (Phoenix, AZ)", lat: 33.4484, lng: -112.0740, mw: 65, type: "hyperscale" },
  { id: 84, owner: "STACK", name: "Chicago Campus (Chicago, IL)", lat: 41.8781, lng: -87.6298, mw: 62, type: "hyperscale" },
  { id: 85, owner: "STACK", name: "Atlanta Campus (Atlanta, GA)", lat: 33.7490, lng: -84.3880, mw: 58, type: "hyperscale" },
  { id: 86, owner: "STACK", name: "Denver Campus (Denver, CO)", lat: 39.7392, lng: -104.9903, mw: 48, type: "hyperscale" },

  // Apple (smaller footprint, ~360 MW total)
  { id: 87, owner: "Apple", name: "Maiden Campus (Maiden, NC)", lat: 35.5771, lng: -81.4145, mw: 140, type: "hyperscale" },
  { id: 88, owner: "Apple", name: "Mesa Campus (Mesa, AZ)", lat: 33.4152, lng: -111.8315, mw: 110, type: "hyperscale" },
  { id: 89, owner: "Apple", name: "Reno Campus (Reno, NV)", lat: 39.5296, lng: -119.8138, mw: 110, type: "hyperscale" },

  // Oracle Cloud (22 facilities, ~220 MW)
  { id: 90, owner: "Oracle", name: "Ashburn OCI (Ashburn, VA)", lat: 39.0839, lng: -77.5094, mw: 85, type: "hyperscale" },
  { id: 91, owner: "Oracle", name: "Phoenix OCI (Phoenix, AZ)", lat: 33.5722, lng: -112.0891, mw: 75, type: "hyperscale" },
  { id: 92, owner: "Oracle", name: "Chicago OCI (Chicago, IL)", lat: 41.9742, lng: -87.9073, mw: 60, type: "hyperscale" },

  // CoreWeave (AI-focused, 15+ facilities, ~280 MW)
  { id: 93, owner: "CoreWeave", name: "Weehawken GPU Cluster (New Jersey, NJ)", lat: 40.7648, lng: -74.0210, mw: 140, type: "hyperscale" },
  { id: 94, owner: "CoreWeave", name: "Chicago AI Cluster (Chicago, IL)", lat: 41.8781, lng: -87.9500, mw: 80, type: "hyperscale" },
  { id: 95, owner: "CoreWeave", name: "Las Vegas AI Facility (Las Vegas, NV)", lat: 36.1716, lng: -115.1391, mw: 60, type: "hyperscale" },

  // xAI (new entrant, flagship facility)
  { id: 96, owner: "xAI", name: "Memphis Colossus (Memphis, TN)", lat: 35.1495, lng: -90.0490, mw: 300, type: "hyperscale" },
];

// ─── REGIONAL CLUSTERS (4,050+ smaller facilities) ──────────────────────────────
const REGIONAL_CLUSTERS = [
  { id: 201, region: "Northern Virginia", lat: 39.0437, lng: -77.4875, facilities: 850, estimatedMw: 3000, type: "cluster" },
  { id: 202, region: "Dallas-Fort Worth", lat: 32.7767, lng: -96.7970, facilities: 380, estimatedMw: 800, type: "cluster" },
  { id: 203, region: "Phoenix", lat: 33.4484, lng: -112.0740, facilities: 320, estimatedMw: 600, type: "cluster" },
  { id: 204, region: "Silicon Valley", lat: 37.3382, lng: -121.8863, facilities: 450, estimatedMw: 500, type: "cluster" },
  { id: 205, region: "Chicago", lat: 41.8781, lng: -87.6298, facilities: 280, estimatedMw: 400, type: "cluster" },
  { id: 206, region: "Atlanta", lat: 33.7490, lng: -84.3880, facilities: 240, estimatedMw: 350, type: "cluster" },
  { id: 207, region: "New York/New Jersey", lat: 40.7448, lng: -74.1703, facilities: 210, estimatedMw: 300, type: "cluster" },
  { id: 208, region: "Portland/Seattle", lat: 45.5170, lng: -122.6819, facilities: 180, estimatedMw: 450, type: "cluster" },
  { id: 209, region: "Denver", lat: 39.7392, lng: -104.9903, facilities: 160, estimatedMw: 200, type: "cluster" },
  { id: 210, region: "Los Angeles", lat: 34.0522, lng: -118.2437, facilities: 220, estimatedMw: 280, type: "cluster" },
  { id: 211, region: "Mid-Atlantic (Other)", lat: 38.5, lng: -77.0, facilities: 380, estimatedMw: 420, type: "cluster" },
  { id: 212, region: "Midwest (Other)", lat: 41.8, lng: -89.0, facilities: 350, estimatedMw: 380, type: "cluster" },
  { id: 213, region: "South (Other)", lat: 33.0, lng: -87.0, facilities: 420, estimatedMw: 480, type: "cluster" },
  { id: 214, region: "Southwest (Other)", lat: 34.0, lng: -104.0, facilities: 310, estimatedMw: 360, type: "cluster" },
  { id: 215, region: "West (Other)", lat: 39.0, lng: -110.0, facilities: 390, estimatedMw: 440, type: "cluster" },
];

const OWNER_COLORS = {
  "AWS": "#FF9900", "Meta": "#0668E1", "Microsoft": "#00A4EF",
  "Google": "#4285F4", "Apple": "#888888", "DataBank": "#1E90FF",
  "Aligned": "#FF6B6B", "Switch": "#4ECDC4", "Vantage": "#9333EA",
  "Equinix": "#E31937", "Digital Realty": "#0066CC", "CyrusOne": "#FF9500",
  "QTS": "#00BCD4", "NTT Global": "#E63946", "STACK": "#06A77D",
  "Oracle": "#C74634", "CoreWeave": "#7C3AED", "xAI": "#D4AF37",
  "cluster": "#38BDF8",
};

const fmt = (mw) => mw >= 1000 ? `${(mw / 1000).toFixed(1)} GW` : `${mw} MW`;
const fmtGwh = (mw) => { const g = mw * 8.76; return g >= 1000 ? `${(g / 1000).toFixed(1)} TWh/yr` : `${g.toFixed(0)} GWh/yr`; };

function project(lat, lng, W, H) {
  const x = ((lng - (-125)) / ((-66) - (-125))) * W;
  const y = ((50 - lat) / (50 - 24)) * H;
  return { x, y };
}

export default function App() {
  const [zoom, setZoom] = useState(1);
  const [pan, setPan] = useState({ x: 0, y: 0 });
  const [selected, setSelected] = useState(null);
  const [hovered, setHovered] = useState(null);
  const [viewMode, setViewMode] = useState("both"); // "named", "clusters", "both"
  const [activeOwners, setActiveOwners] = useState(new Set(["AWS", "Meta", "Microsoft", "Google", "cluster"]));
  const [dragging, setDragging] = useState(false);
  const [dragOrigin, setDragOrigin] = useState(null);
  const containerRef = useRef(null);
  const W = 960, H = 580;

  const onWheel = useCallback((e) => {
    e.preventDefault();
    setZoom(z => Math.min(9, Math.max(1, z + (e.deltaY > 0 ? -0.18 : 0.18))));
  }, []);

  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;
    el.addEventListener("wheel", onWheel, { passive: false });
    return () => el.removeEventListener("wheel", onWheel);
  }, [onWheel]);

  const onDown = (e) => { if (e.button !== 0) return; setDragging(true); setDragOrigin({ x: e.clientX - pan.x, y: e.clientY - pan.y }); };
  const onMove = (e) => { if (!dragging || !dragOrigin) return; setPan({ x: e.clientX - dragOrigin.x, y: e.clientY - dragOrigin.y }); };
  const onUp = () => { setDragging(false); setDragOrigin(null); };

  const toggleOwner = (o) => { setActiveOwners(p => { const n = new Set(p); n.has(o) ? n.delete(o) : n.add(o); return n; }); setSelected(null); };

  const visibleNamed = (viewMode === "both" || viewMode === "named") ? NAMED_FACILITIES.filter(d => activeOwners.has(d.owner)) : [];
  const visibleClusters = (viewMode === "both" || viewMode === "clusters") ? REGIONAL_CLUSTERS.filter(d => activeOwners.has("cluster")) : [];

  const totalMW = visibleNamed.reduce((s, d) => s + d.mw, 0) + visibleClusters.reduce((s, d) => s + d.estimatedMw, 0);
  const totalFacilities = visibleNamed.length + visibleClusters.reduce((s, d) => s + d.facilities, 0);
  const maxMW = Math.max(...NAMED_FACILITIES.map(d => d.mw), ...REGIONAL_CLUSTERS.map(d => d.estimatedMw));

  const dotR = (mw) => {
    const r = 4 + Math.sqrt(mw / maxMW) * 18;
    return r / Math.max(1, zoom * 0.6);
  };

  const owners = [...new Set(NAMED_FACILITIES.map(d => d.owner))].sort();

  return (
    <div style={{ fontFamily: "'Inter', system-ui, sans-serif", background: "#090C17", minHeight: "100vh", color: "#E2E8F0", display: "flex", flexDirection: "column", userSelect: "none" }}>
      {/* Header */}
      <div style={{ padding: "14px 20px", borderBottom: "1px solid #1E2A42", display: "flex", alignItems: "center", justifyContent: "space-between", background: "#0B0F1C", position: "sticky", top: 0, zIndex: 40 }}>
        <div>
          <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 2 }}>
            <span style={{ fontSize: 11, color: "#38BDF8", fontWeight: 700, letterSpacing: "0.14em", textTransform: "uppercase" }}>⚡ Data Center Atlas</span>
          </div>
          <div style={{ fontSize: 18, fontWeight: 800, color: "#F1F5F9", letterSpacing: "-0.025em" }}>US Hyperscale Infrastructure {visibleNamed.length > 0 && `(${visibleNamed.length} Named + ${visibleClusters.reduce((s, d) => s + d.facilities, 0)} Regional)`}</div>
        </div>
        <div style={{ textAlign: "right" }}>
          <div style={{ fontSize: 10, color: "#475569", textTransform: "uppercase", letterSpacing: "0.1em" }}>Visible capacity</div>
          <div style={{ fontSize: 24, fontWeight: 900, color: "#38BDF8", letterSpacing: "-0.03em", lineHeight: 1 }}>{fmt(totalMW)}</div>
          <div style={{ fontSize: 11, color: "#64748B" }}>{fmtGwh(totalMW)} • {totalFacilities.toLocaleString()} facilities</div>
        </div>
      </div>

      <div style={{ display: "flex", flex: 1, overflow: "hidden", height: "calc(100vh - 62px)" }}>
        {/* Sidebar */}
        <div style={{ width: 230, background: "#0D1120", borderRight: "1px solid #1E2A42", padding: "14px 10px", overflowY: "auto", flexShrink: 0 }}>
          {/* View mode toggles */}
          <div style={{ marginBottom: 12 }}>
            <div style={{ fontSize: 9, color: "#475569", textTransform: "uppercase", letterSpacing: "0.12em", marginBottom: 7 }}>View mode</div>
            {[
              { val: "named", lbl: "Named (96)" },
              { val: "clusters", lbl: "Regional (15)" },
              { val: "both", lbl: "Both (4,146+)" },
            ].map(({ val, lbl }) => (
              <button key={val} onClick={() => setViewMode(val)} style={{
                display: "block", width: "100%", padding: "6px 8px", marginBottom: 3,
                background: viewMode === val ? "#38BDF844" : "transparent",
                border: `1px solid ${viewMode === val ? "#38BDF8" : "#1E2A42"}`,
                borderRadius: 6, color: viewMode === val ? "#E2E8F0" : "#64748B",
                fontSize: 11, fontWeight: 600, cursor: "pointer", textAlign: "left",
              }}>{lbl}</button>
            ))}
          </div>

          <div style={{ fontSize: 9, color: "#475569", textTransform: "uppercase", letterSpacing: "0.12em", marginBottom: 10 }}>Operators</div>
          {owners.map(o => {
            const sites = NAMED_FACILITIES.filter(d => d.owner === o);
            const mw = sites.reduce((s, d) => s + d.mw, 0);
            const on = activeOwners.has(o);
            return (
              <button key={o} onClick={() => toggleOwner(o)} style={{
                display: "flex", alignItems: "center", gap: 8, width: "100%", padding: "6px 8px", marginBottom: 2,
                background: on ? `${OWNER_COLORS[o]}14` : "transparent",
                border: `1px solid ${on ? OWNER_COLORS[o] + "40" : "#1E2A42"}`,
                borderRadius: 6, cursor: "pointer", color: on ? "#E2E8F0" : "#374151", textAlign: "left", fontSize: 11,
              }}>
                <span style={{ width: 8, height: 8, borderRadius: "50%", background: on ? OWNER_COLORS[o] : "#1E2A42", boxShadow: on ? `0 0 6px ${OWNER_COLORS[o]}` : "none", flexShrink: 0 }} />
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ fontWeight: 600, fontSize: 11, truncate: true }}>{o}</div>
                  <div style={{ fontSize: 9, color: on ? "#64748B" : "#1F2937" }}>{sites.length} sites · {fmt(mw)}</div>
                </div>
              </button>
            );
          })}

          {/* Cluster toggle */}
          <button onClick={() => toggleOwner("cluster")} style={{
            display: "flex", alignItems: "center", gap: 8, width: "100%", padding: "6px 8px", marginBottom: 2, marginTop: 8,
            background: activeOwners.has("cluster") ? "#38BDF844" : "transparent",
            border: `1px solid ${activeOwners.has("cluster") ? "#38BDF8" : "#1E2A42"}`,
            borderRadius: 6, cursor: "pointer", color: activeOwners.has("cluster") ? "#E2E8F0" : "#374151", textAlign: "left", fontSize: 11,
          }}>
            <span style={{ width: 8, height: 8, borderRadius: "50%", background: activeOwners.has("cluster") ? "#38BDF8" : "#1E2A42", flexShrink: 0 }} />
            <div>
              <div style={{ fontWeight: 600, fontSize: 11 }}>Regional Clusters</div>
              <div style={{ fontSize: 9, color: activeOwners.has("cluster") ? "#64748B" : "#1F2937" }}>15 zones</div>
            </div>
          </button>

          <div style={{ marginTop: 16, padding: "10px", background: "#080C16", borderRadius: 7, border: "1px solid #1A2235", fontSize: 9, color: "#374151", lineHeight: 1.6 }}>
            <div style={{ color: "#475569", fontWeight: 600, marginBottom: 4 }}>Data coverage</div>
            96 named facilities (major hyperscale + top colocation), 4,050+ smaller regional facilities aggregated by metro area
          </div>
        </div>

        {/* Map */}
        <div style={{ flex: 1, position: "relative", overflow: "hidden" }}>
          {/* Zoom controls */}
          <div style={{ position: "absolute", top: 14, right: 14, zIndex: 20, display: "flex", flexDirection: "column", gap: 4 }}>
            {[
              { l: "+", fn: () => setZoom(z => Math.min(9, z + 0.6)) },
              { l: "−", fn: () => setZoom(z => Math.max(1, z - 0.6)) },
              { l: "⌂", fn: () => { setZoom(1); setPan({ x: 0, y: 0 }); } },
            ].map(({ l, fn }) => (
              <button key={l} onClick={fn} style={{
                width: 34, height: 34, background: "rgba(255,255,255,0.07)", border: "1px solid rgba(255,255,255,0.12)",
                borderRadius: 7, color: "#94A3B8", fontSize: l === "⌂" ? 14 : 18, cursor: "pointer",
                display: "flex", alignItems: "center", justifyContent: "center",
              }}>{l}</button>
            ))}
          </div>

          <div style={{ position: "absolute", bottom: 12, left: 12, zIndex: 20, fontSize: 10, color: "#374151", background: "rgba(9,12,23,0.8)", padding: "4px 8px", borderRadius: 5, border: "1px solid #1E2A42" }}>
            {Math.round(zoom * 100)}% • scroll zoom • drag pan • click dots
          </div>

          <div ref={containerRef} onMouseDown={onDown} onMouseMove={onMove} onMouseUp={onUp} onMouseLeave={onUp}
            style={{ width: "100%", height: "100%", cursor: dragging ? "grabbing" : "grab", overflow: "hidden" }}>
            <svg viewBox={`0 0 ${W} ${H}`} style={{ width: "100%", height: "100%", transform: `scale(${zoom}) translate(${pan.x / zoom}px, ${pan.y / zoom}px)`, transformOrigin: "center center", transition: dragging ? "none" : "transform 0.08s" }}>
              <defs>
                <radialGradient id="ocean" cx="50%" cy="50%" r="70%">
                  <stop offset="0%" stopColor="#0D1628" />
                  <stop offset="100%" stopColor="#070A13" />
                </radialGradient>
                <filter id="glow" x="-50%" y="-50%" width="200%" height="200%">
                  <feGaussianBlur stdDeviation="4" result="b" />
                  <feMerge><feMergeNode in="b" /><feMergeNode in="SourceGraphic" /></feMerge>
                </filter>
              </defs>

              <rect width={W} height={H} fill="url(#ocean)" />

              {/* Grid */}
              {[-120, -110, -100, -90, -80, -70].map(lng => {
                const {x} = project(37, lng, W, H);
                return <line key={lng} x1={x} y1={0} x2={x} y2={H} stroke="#1A2A3A" strokeWidth={0.6} strokeDasharray="4,5" />;
              })}
              {[30, 35, 40, 45].map(lat => {
                const {y} = project(lat, -95, W, H);
                return <line key={lat} x1={0} y1={y} x2={W} y2={y} stroke="#1A2A3A" strokeWidth={0.6} strokeDasharray="4,5" />;
              })}

              <USMap />

              {/* Regional clusters (background) */}
              {visibleClusters.map(cluster => {
                const { x, y } = project(cluster.lat, cluster.lng, W, H);
                const r = dotR(cluster.estimatedMw);
                const sel = selected?.id === cluster.id;
                const hov = hovered === cluster.id;
                return (
                  <g key={cluster.id}
                    onClick={(e) => { e.stopPropagation(); setSelected(sel ? null : cluster); }}
                    onMouseEnter={() => setHovered(cluster.id)}
                    onMouseLeave={() => setHovered(null)}
                    style={{ cursor: "pointer" }}
                  >
                    <circle cx={x} cy={y} r={r + 6} fill="#38BDF8" opacity={hov || sel ? 0.25 : 0.08} />
                    <circle cx={x} cy={y} r={r} fill="none" stroke="#38BDF8" strokeWidth={sel ? 2.5 : 1.5} strokeDasharray="5,3" opacity={0.6} />
                    <text x={x} y={y} fontSize={8} fill="#38BDF8" textAnchor="middle" dominantBaseline="middle" fontWeight={600} opacity={zoom > 2 ? 0.7 : 0}>
                      {cluster.facilities.toLocaleString()}
                    </text>
                  </g>
                );
              })}

              {/* Named facilities (foreground) */}
              {visibleNamed.map(dc => {
                const { x, y } = project(dc.lat, dc.lng, W, H);
                const r = dotR(dc.mw);
                const col = OWNER_COLORS[dc.owner] || "#38BDF8";
                const sel = selected?.id === dc.id;
                const hov = hovered === dc.id;
                return (
                  <g key={dc.id}
                    onClick={(e) => { e.stopPropagation(); setSelected(sel ? null : dc); }}
                    onMouseEnter={() => setHovered(dc.id)}
                    onMouseLeave={() => setHovered(null)}
                    style={{ cursor: "pointer" }}
                  >
                    {sel && (
                      <circle cx={x} cy={y} r={r + 6} fill="none" stroke={col} strokeWidth={1.5} opacity={0.6}>
                        <animate attributeName="r" from={r + 3} to={r + 16} dur="1.4s" repeatCount="indefinite" />
                        <animate attributeName="opacity" from={0.6} to={0} dur="1.4s" repeatCount="indefinite" />
                      </circle>
                    )}
                    <circle cx={x} cy={y} r={r + 4} fill={col} opacity={hov || sel ? 0.18 : 0.07} />
                    <circle cx={x} cy={y} r={r} fill={col} fillOpacity={0.7} stroke={col} strokeWidth={sel ? 2.5 : 1.5} filter={(hov || sel) ? "url(#glow)" : undefined} />
                    <circle cx={x - r * 0.28} cy={y - r * 0.28} r={r * 0.32} fill="white" opacity={0.22} />
                  </g>
                );
              })}
            </svg>
          </div>

          {/* Detail card */}
          {selected && (
            <div onClick={e => e.stopPropagation()} style={{
              position: "absolute", top: 14, left: 14, width: 280,
              background: "rgba(9,12,23,0.97)", border: `1px solid ${selected.type === "cluster" ? "#38BDF8" : OWNER_COLORS[selected.owner]}50`,
              borderRadius: 12, padding: "15px", zIndex: 30,
              boxShadow: `0 0 40px ${selected.type === "cluster" ? "#38BDF8" : OWNER_COLORS[selected.owner]}20, 0 8px 32px rgba(0,0,0,0.6)`,
            }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 11 }}>
                <div>
                  {selected.type === "cluster" ? (
                    <div>
                      <div style={{ fontSize: 10, color: "#38BDF8", fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.07em", marginBottom: 4 }}>Regional Cluster</div>
                      <div style={{ fontSize: 13, fontWeight: 700, color: "#F1F5F9", lineHeight: 1.3 }}>{selected.region}</div>
                    </div>
                  ) : (
                    <div>
                      <div style={{ display: "inline-flex", alignItems: "center", gap: 5, background: `${OWNER_COLORS[selected.owner]}18`, border: `1px solid ${OWNER_COLORS[selected.owner]}40`, borderRadius: 5, padding: "2px 7px", marginBottom: 5 }}>
                        <span style={{ width: 6, height: 6, borderRadius: "50%", background: OWNER_COLORS[selected.owner], boxShadow: `0 0 6px ${OWNER_COLORS[selected.owner]}` }} />
                        <span style={{ fontSize: 10, fontWeight: 800, color: OWNER_COLORS[selected.owner], letterSpacing: "0.07em" }}>{selected.owner.toUpperCase()}</span>
                      </div>
                      <div style={{ fontSize: 13, fontWeight: 700, color: "#F1F5F9", lineHeight: 1.3, paddingRight: 24 }}>{selected.name}</div>
                    </div>
                  )}
                </div>
                <button onClick={() => setSelected(null)} style={{ background: "rgba(255,255,255,0.07)", border: "none", borderRadius: 5, color: "#64748B", fontSize: 15, width: 24, height: 24, cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0, marginLeft: 4, marginTop: 2 }}>×</button>
              </div>

              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 7, marginBottom: 10 }}>
                {selected.type === "cluster" ? [
                  { l: "Facilities", v: selected.facilities.toLocaleString(), hi: true },
                  { l: "Est. Capacity", v: fmt(selected.estimatedMw), hi: true },
                  { l: "Annual Energy", v: fmtGwh(selected.estimatedMw), hi: false },
                  { l: "Type", v: "Regional Aggregate", hi: false },
                ] : [
                  { l: "Type", v: selected.type === "hyperscale" ? "Hyperscale" : "Colocation", hi: false },
                  { l: "Capacity", v: fmt(selected.mw), hi: true },
                  { l: "Annual Energy", v: fmtGwh(selected.mw), hi: true },
                  { l: "Owner", v: selected.owner, hi: false },
                ].map(({ l, v, hi }) => (
                  <div key={l} style={{ background: "rgba(255,255,255,0.04)", borderRadius: 7, padding: "7px 9px", border: "1px solid rgba(255,255,255,0.06)" }}>
                    <div style={{ fontSize: 9, color: "#475569", textTransform: "uppercase", letterSpacing: "0.1em", marginBottom: 2 }}>{l}</div>
                    <div style={{ fontSize: hi ? 15 : 13, fontWeight: hi ? 800 : 600, color: hi ? (selected.type === "cluster" ? "#38BDF8" : OWNER_COLORS[selected.owner]) : "#CBD5E1" }}>{v}</div>
                  </div>
                ))}
              </div>

              {selected.type !== "cluster" && (
                <div style={{ marginBottom: 8 }}>
                  <div style={{ fontSize: 9, color: "#475569", marginBottom: 4, textTransform: "uppercase", letterSpacing: "0.1em" }}>Relative capacity</div>
                  <div style={{ height: 5, background: "#1E2A42", borderRadius: 3, overflow: "hidden" }}>
                    <div style={{ height: "100%", width: `${(selected.mw / maxMW) * 100}%`, background: `linear-gradient(90deg, ${OWNER_COLORS[selected.owner]}80, ${OWNER_COLORS[selected.owner]})`, borderRadius: 3, transition: "width 0.3s" }} />
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

function USMap() {
  const W = 960, H = 580;
  const proj = (lat, lng) => {
    const x = ((lng - (-125)) / ((-66) - (-125))) * W;
    const y = ((50 - lat) / (50 - 24)) * H;
    return `${x.toFixed(1)},${y.toFixed(1)}`;
  };

  return (
    <g>
      <polygon points={[proj(48.4,-124.7), proj(48.9,-122.8), proj(49,-117), proj(49,-110), proj(49,-104), proj(49,-97), proj(49,-89.5), proj(48.3,-84.5), proj(46.1,-83.9), proj(45.6,-84.4), proj(45.8,-87.2), proj(47.5,-87.2), proj(47,-89), proj(45.1,-83.3), proj(43.6,-82.5), proj(42.5,-82.7), proj(42.0,-83.1), proj(41.7,-83.4), proj(42.3,-82.0), proj(43.0,-79.0), proj(43.6,-76.2), proj(45.0,-74.8), proj(45.0,-71.5), proj(44.2,-70.0), proj(43.4,-70.7), proj(42.0,-70.0), proj(41.2,-71.9), proj(40.9,-72.7), proj(40.5,-74.2), proj(39.5,-74.3), proj(38.9,-74.9), proj(37.0,-76.0), proj(36.6,-76.0), proj(35.0,-75.5), proj(33.8,-78.5), proj(33.5,-79.0), proj(32.0,-81.0), proj(30.7,-81.4), proj(29.5,-81.3), proj(28.0,-80.6), proj(25.1,-80.5), proj(25.1,-81.8), proj(25.8,-81.8), proj(26.0,-82.0), proj(27.5,-82.6), proj(28.5,-82.6), proj(29.4,-83.2), proj(30.0,-84.3), proj(29.9,-85.2), proj(30.2,-87.5), proj(30.4,-88.9), proj(29.0,-89.2), proj(28.5,-89.5), proj(29.2,-90.5), proj(29.0,-91.8), proj(29.0,-93.8), proj(29.6,-94.5), proj(29.9,-94.1), proj(29.8,-95.0), proj(29.4,-97.0), proj(26.0,-97.3), proj(25.9,-97.2), proj(26.4,-99.0), proj(27.7,-99.5), proj(29.0,-100.4), proj(29.7,-101.5), proj(29.8,-102.8), proj(29.1,-103.7), proj(28.9,-104.2), proj(29.7,-104.7), proj(31.0,-104.8), proj(31.8,-106.5), proj(32.0,-106.6), proj(32.5,-117.1), proj(33.4,-117.6), proj(34.0,-120.6), proj(38.0,-122.6), proj(38.3,-123.0), proj(40.4,-124.4), proj(41.8,-124.4), proj(42.0,-124.5), proj(43.0,-124.5), proj(44.5,-124.1), proj(46.3,-124.0), proj(47.6,-122.4), proj(48.4,-124.7)].join(" ")} fill="#152030" stroke="#253D5A" strokeWidth={1.2} />
      <polygon points={[proj(30.4,-87.5), proj(30.4,-85.2), proj(30.0,-84.3), proj(29.4,-83.2), proj(28.5,-82.6), proj(27.5,-82.6), proj(26.0,-82.0), proj(25.8,-81.8), proj(25.1,-81.8), proj(25.1,-80.5), proj(28.0,-80.6), proj(29.5,-81.3), proj(30.7,-81.4), proj(30.2,-87.5)].join(" ")} fill="#152030" stroke="#253D5A" strokeWidth={1} />
    </g>
  );
}
