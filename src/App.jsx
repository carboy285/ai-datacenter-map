import React, { useEffect, useMemo, useState } from "react";
import { CircleMarker, MapContainer, Marker, TileLayer, ZoomControl, useMap, useMapEvents } from "react-leaflet";
import { divIcon, point } from "leaflet";
import Supercluster from "supercluster";
import { facilities, providers, regions, timelineYears } from "./data.js";

const LIGHT_TILES = {
  url: "https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png",
  attribution: '&copy; OpenStreetMap contributors &copy; CARTO'
};

const DARK_TILES = {
  url: "https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png",
  attribution: '&copy; OpenStreetMap contributors &copy; CARTO'
};

const DEFAULT_BOUNDS = [-125, 24, -66, 50];
const THEME_KEY = "ai-datacenter-map-theme";
const ALERT_KEY = "ai-datacenter-map-last-seen-year";

function readLocalStorage(key, fallback) {
  if (typeof window === "undefined") return fallback;
  try {
    const stored = window.localStorage.getItem(key);
    return stored ?? fallback;
  } catch {
    return fallback;
  }
}

function writeLocalStorage(key, value) {
  if (typeof window === "undefined") return;
  try {
    window.localStorage.setItem(key, value);
  } catch {
    // Ignore storage failures so the map keeps working in restricted contexts.
  }
}

function clampZoom(value) {
  return Math.max(3, Math.min(12, Math.round(value || 4)));
}

function markerRadius(item) {
  return Math.min(18, 6 + item.capacityMw / 45);
}

function toGeoJson(item) {
  return {
    type: "Feature",
    properties: {
      cluster: false,
      facilityId: item.id,
      facility: item
    },
    geometry: {
      type: "Point",
      coordinates: [item.lng, item.lat]
    }
  };
}

function averageRange(items, key, precision = 0) {
  if (!items.length) return null;
  const avg =
    items.reduce((sum, item) => sum + item[key].avg, 0) / items.length;
  return Number(avg.toFixed(precision));
}

function summarizeFacilities(items) {
  const count = items.length;
  const capacityMw = items.reduce((sum, item) => sum + item.capacityMw, 0);
  const annualEnergyGwh = items.reduce((sum, item) => sum + item.annualEnergyGwh, 0);

  return {
    count,
    capacityMw,
    annualEnergyGwh,
    avgUtilization: averageRange(items, "utilizationPct", 0),
    avgPue: averageRange(items, "pue", 2),
    avgLatency: averageRange(items, "latencyMs", 0)
  };
}

function formatMetricRange(metric, suffix = "") {
  if (!metric) return "Unavailable";
  const min = typeof metric.min === "number" ? metric.min : metric.avg;
  const max = typeof metric.max === "number" ? metric.max : metric.avg;
  return `${min}${suffix} - ${max}${suffix}`;
}

function formatEstimate(metric, suffix = "") {
  if (!metric) return "Unavailable";
  return `${formatMetricRange(metric, suffix)} (est.)`;
}

function formatNumber(value, digits = 0) {
  return Number(value || 0).toLocaleString(undefined, {
    maximumFractionDigits: digits,
    minimumFractionDigits: digits
  });
}

function downloadFile(filename, content, mimeType) {
  const blob = new Blob([content], { type: mimeType });
  const url = URL.createObjectURL(blob);
  const anchor = document.createElement("a");
  anchor.href = url;
  anchor.download = filename;
  document.body.appendChild(anchor);
  anchor.click();
  document.body.removeChild(anchor);
  URL.revokeObjectURL(url);
}

function toExportRows(items) {
  return items.map((item) => ({
    id: item.id,
    provider: item.provider,
    name: item.name,
    region: item.region,
    city: item.city,
    state: item.state,
    facilityType: item.facilityType,
    capacityMw: item.capacityMw,
    annualEnergyGwh: item.annualEnergyGwh,
    commissionedYear: item.commissionedYear,
    cooling: item.cooling.value,
    coolingEstimated: item.cooling.estimated,
    utilizationRangePct: formatMetricRange(item.utilizationPct, "%"),
    utilizationMidpointPct: item.utilizationPct.avg,
    utilizationEstimated: item.utilizationPct.estimated,
    pueRange: formatMetricRange(item.pue),
    pueMidpoint: item.pue.avg,
    pueEstimated: item.pue.estimated,
    latencyRangeMs: formatMetricRange(item.latencyMs, " ms"),
    latencyMidpointMs: item.latencyMs.avg,
    latencyEstimated: item.latencyMs.estimated,
    lat: item.lat,
    lng: item.lng,
    source: item.source
  }));
}

function csvEscape(value) {
  const stringValue = String(value ?? "");
  return `"${stringValue.replace(/"/g, '""')}"`;
}

function toCsv(items) {
  const rows = toExportRows(items);
  if (!rows.length) return "";

  const headers = Object.keys(rows[0]);
  const lines = rows.map((row) => headers.map((key) => csvEscape(row[key])).join(","));
  return [headers.join(","), ...lines].join("\n");
}

function clusterIcon(count, theme) {
  return divIcon({
    className: "cluster-icon-shell",
    html: `<div class="cluster-icon ${theme}"><strong>${count}</strong><span>sites</span></div>`,
    iconSize: point(64, 64, true)
  });
}

function MapViewportTracker({ onChange }) {
  const map = useMapEvents({
    moveend: emit,
    zoomend: emit
  });

  function emit() {
    const bounds = map.getBounds();
    onChange({
      zoom: clampZoom(map.getZoom()),
      bounds: [
        bounds.getWest(),
        bounds.getSouth(),
        bounds.getEast(),
        bounds.getNorth()
      ]
    });
  }

  useEffect(() => {
    emit();
  }, []);

  return null;
}

function ClusterMarkers({ clusterPoints, supercluster, onSelect, selectedId, theme }) {
  const map = useMap();

  return clusterPoints.map((cluster) => {
    const [lng, lat] = cluster.geometry.coordinates;
    const isCluster = Boolean(cluster.properties.cluster);

    if (isCluster) {
      return (
        <Marker
          key={`cluster-${cluster.id}`}
          position={[lat, lng]}
          icon={clusterIcon(cluster.properties.point_count, theme)}
          eventHandlers={{
            click: () => {
              const expansionZoom = Math.min(
                supercluster.getClusterExpansionZoom(cluster.id),
                12
              );
              map.flyTo([lat, lng], expansionZoom, { duration: 0.6 });
            }
          }}
        >
        </Marker>
      );
    }

    const facility = cluster.properties.facility;
    const isSelected = selectedId === facility.id;

    return (
      <CircleMarker
        key={facility.id}
        center={[facility.lat, facility.lng]}
        radius={markerRadius(facility)}
        pathOptions={{
          color: isSelected ? "#ffffff" : facility.markerColor,
          fillColor: facility.markerColor,
          fillOpacity: isSelected ? 0.95 : 0.72,
          weight: isSelected ? 3 : 2
        }}
        eventHandlers={{
          click: () => onSelect(facility)
        }}
      />
    );
  });
}

function compareRegionSummary(items, region) {
  const regionItems = items.filter((item) => item.region === region);
  return {
    region,
    ...summarizeFacilities(regionItems)
  };
}

export default function App() {
  const maxYear = timelineYears[timelineYears.length - 1];
  const minCapacity = Math.min(...facilities.map((item) => item.capacityMw));
  const maxCapacity = Math.max(...facilities.map((item) => item.capacityMw));

  const [theme, setTheme] = useState(() => readLocalStorage(THEME_KEY, "light"));
  const [search, setSearch] = useState("");
  const [providerFilter, setProviderFilter] = useState("all");
  const [regionFilter, setRegionFilter] = useState("all");
  const [capacityMin, setCapacityMin] = useState(String(minCapacity));
  const [capacityMax, setCapacityMax] = useState(String(maxCapacity));
  const [selectedYear, setSelectedYear] = useState(maxYear);
  const [selectedFacility, setSelectedFacility] = useState(null);
  const [viewport, setViewport] = useState({ bounds: DEFAULT_BOUNDS, zoom: 4 });
  const [controlsOpen, setControlsOpen] = useState(true);
  const [legendOpen, setLegendOpen] = useState(false);
  const [compareMode, setCompareMode] = useState(false);
  const [compareA, setCompareA] = useState(regions[0]);
  const [compareB, setCompareB] = useState(regions[1] || regions[0]);
  const [lastSeenAlertYear, setLastSeenAlertYear] = useState(() => Number(readLocalStorage(ALERT_KEY, maxYear - 1)));

  useEffect(() => {
    document.documentElement.dataset.theme = theme;
    document.title = "AI Data Center Map";
    writeLocalStorage(THEME_KEY, theme);
  }, [theme]);

  const filteredFacilities = useMemo(() => {
    const min = Number(capacityMin) || minCapacity;
    const max = Number(capacityMax) || maxCapacity;
    const query = search.trim().toLowerCase();

    return facilities.filter((item) => {
      const matchesQuery = !query || [item.provider, item.name, item.city, item.region, item.facilityType]
        .join(" ")
        .toLowerCase()
        .includes(query);
      const matchesProvider = providerFilter === "all" || item.provider === providerFilter;
      const matchesRegion = regionFilter === "all" || item.region === regionFilter;
      const matchesCapacity = item.capacityMw >= min && item.capacityMw <= max;
      const matchesTimeline = item.commissionedYear <= selectedYear;
      return matchesQuery && matchesProvider && matchesRegion && matchesCapacity && matchesTimeline;
    });
  }, [capacityMax, capacityMin, maxCapacity, minCapacity, providerFilter, regionFilter, search, selectedYear]);

  useEffect(() => {
    if (selectedFacility && !filteredFacilities.some((item) => item.id === selectedFacility.id)) {
      setSelectedFacility(null);
    }
  }, [filteredFacilities, selectedFacility]);

  const totals = useMemo(() => summarizeFacilities(filteredFacilities), [filteredFacilities]);

  const recentFacilities = useMemo(
    () =>
      [...facilities]
        .sort((a, b) => b.commissionedYear - a.commissionedYear || b.capacityMw - a.capacityMw)
        .slice(0, 5),
    []
  );

  const unseenAlerts = useMemo(
    () => recentFacilities.filter((item) => item.commissionedYear > lastSeenAlertYear),
    [lastSeenAlertYear, recentFacilities]
  );

  const geoPoints = useMemo(() => filteredFacilities.map(toGeoJson), [filteredFacilities]);

  const clusterIndex = useMemo(() => {
    const instance = new Supercluster({
      radius: 56,
      maxZoom: 9
    });
    instance.load(geoPoints);
    return instance;
  }, [geoPoints]);

  const clusterPoints = useMemo(
    () => clusterIndex.getClusters(viewport.bounds || DEFAULT_BOUNDS, viewport.zoom),
    [clusterIndex, viewport.bounds, viewport.zoom]
  );

  const clusterSummary = useMemo(() => {
    const clusterCount = clusterPoints.filter((item) => item.properties.cluster).length;
    const renderedFacilityCount = clusterPoints.filter((item) => !item.properties.cluster).length;
    return { clusterCount, renderedFacilityCount };
  }, [clusterPoints]);

  const compareSummaries = useMemo(() => {
    if (!compareMode) return [];
    return [compareRegionSummary(filteredFacilities, compareA), compareRegionSummary(filteredFacilities, compareB)];
  }, [compareA, compareB, compareMode, filteredFacilities]);

  const activeTiles = theme === "dark" ? DARK_TILES : LIGHT_TILES;

  function handleExportJson() {
    downloadFile("ai-data-center-map-filtered.json", JSON.stringify(toExportRows(filteredFacilities), null, 2), "application/json");
  }

  function handleExportCsv() {
    downloadFile("ai-data-center-map-filtered.csv", toCsv(filteredFacilities), "text/csv;charset=utf-8;");
  }

  function markAlertsSeen() {
    writeLocalStorage(ALERT_KEY, String(maxYear));
    setLastSeenAlertYear(maxYear);
  }

  const selectedFacilityDetails = selectedFacility;

  return (
    <div className="app">
      <aside className={`panel ${controlsOpen ? "open" : "collapsed"}`}>
        <div className="panel-top">
          <div className="brand">
            <div className="logo">AI</div>
            <div>
              <h1>AI Data Center Map</h1>
              <p>U.S. AI and hyperscale infrastructure explorer</p>
            </div>
          </div>

          <div className="header-actions">
            <button className="ghost-button" onClick={() => setTheme(theme === "dark" ? "light" : "dark")}>
              {theme === "dark" ? "Light mode" : "Dark mode"}
            </button>
            <button className="ghost-button mobile-only" onClick={() => setControlsOpen((value) => !value)}>
              {controlsOpen ? "Hide controls" : "Show controls"}
            </button>
          </div>
        </div>

        <div className="stats">
          <div>
            <strong>{totals.count.toLocaleString()}</strong>
            <span>Facilities shown</span>
          </div>
          <div>
            <strong>{formatNumber(totals.capacityMw)} MW</strong>
            <span>Power capacity</span>
          </div>
          <div>
            <strong>{formatNumber(totals.annualEnergyGwh)} GWh</strong>
            <span>Estimated annual energy</span>
          </div>
        </div>

        <div className="section">
          <div className="section-title-row">
            <label className="label">Filters</label>
            <button className="text-button" onClick={() => {
              setSearch("");
              setProviderFilter("all");
              setRegionFilter("all");
              setCapacityMin(String(minCapacity));
              setCapacityMax(String(maxCapacity));
              setSelectedYear(maxYear);
            }}>
              Reset
            </button>
          </div>

          <input
            className="search"
            value={search}
            onChange={(event) => setSearch(event.target.value)}
            placeholder="Search provider, region, city, site..."
          />

          <div className="field-grid">
            <div>
              <label className="label">Provider</label>
              <select className="control" value={providerFilter} onChange={(event) => setProviderFilter(event.target.value)}>
                <option value="all">All providers</option>
                {providers.map((provider) => (
                  <option key={provider} value={provider}>{provider}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="label">Region</label>
              <select className="control" value={regionFilter} onChange={(event) => setRegionFilter(event.target.value)}>
                <option value="all">All regions</option>
                {regions.map((region) => (
                  <option key={region} value={region}>{region}</option>
                ))}
              </select>
            </div>
          </div>

          <div className="field-grid capacity-grid">
            <div>
              <label className="label">Min capacity (MW)</label>
              <input
                className="control"
                type="number"
                min={minCapacity}
                max={maxCapacity}
                value={capacityMin}
                onChange={(event) => setCapacityMin(event.target.value)}
              />
            </div>

            <div>
              <label className="label">Max capacity (MW)</label>
              <input
                className="control"
                type="number"
                min={minCapacity}
                max={maxCapacity}
                value={capacityMax}
                onChange={(event) => setCapacityMax(event.target.value)}
              />
            </div>
          </div>
        </div>

        <div className="section">
          <div className="section-title-row">
            <label className="label">Timeline</label>
            <span className="pill">{selectedYear}</span>
          </div>

          <input
            className="timeline-slider"
            type="range"
            min={timelineYears[0]}
            max={maxYear}
            step="1"
            value={selectedYear}
            onChange={(event) => setSelectedYear(Number(event.target.value))}
          />
          <p className="microcopy">Showing facilities commissioned through {selectedYear}. Metric overlays include estimated ranges where site-level reporting is limited.</p>
        </div>

        <div className="section export-row">
          <button className="primary-button" onClick={handleExportCsv}>Export CSV</button>
          <button className="secondary-button" onClick={handleExportJson}>Export JSON</button>
        </div>

        <div className="section">
          <div className="section-title-row">
            <label className="label">Alerts</label>
            {unseenAlerts.length > 0 && <span className="alert-badge">{unseenAlerts.length} new</span>}
          </div>

          <div className="alert-card">
            <p className="alert-copy">
              {unseenAlerts.length > 0
                ? `${unseenAlerts.length} recently added facilities are newer than your last visit.`
                : "You are caught up on the latest facility additions in this dataset."}
            </p>
            <button className="text-button" onClick={markAlertsSeen}>Mark alerts seen</button>
          </div>

          <div className="alert-list">
            {recentFacilities.map((item) => (
              <button
                key={item.id}
                className="alert-item"
                onClick={() => {
                  setSelectedYear((value) => Math.max(value, item.commissionedYear));
                  setSelectedFacility(item);
                }}
              >
                <span>{item.name}</span>
                <small>{item.region} • {item.commissionedYear}</small>
              </button>
            ))}
          </div>
        </div>

        <div className="section">
          <div className="section-title-row">
            <label className="label">Comparison</label>
            <button className="text-button" onClick={() => setCompareMode((value) => !value)}>
              {compareMode ? "Hide" : "Show"}
            </button>
          </div>

          {compareMode && (
            <div className="comparison">
              <div className="field-grid">
                <select className="control" value={compareA} onChange={(event) => setCompareA(event.target.value)}>
                  {regions.map((region) => (
                    <option key={`compare-a-${region}`} value={region}>{region}</option>
                  ))}
                </select>
                <select className="control" value={compareB} onChange={(event) => setCompareB(event.target.value)}>
                  {regions.map((region) => (
                    <option key={`compare-b-${region}`} value={region}>{region}</option>
                  ))}
                </select>
              </div>

              <div className="compare-grid">
                {compareSummaries.map((summary) => (
                  <div key={summary.region} className="compare-card">
                    <h3>{summary.region}</h3>
                    <p>{summary.count} sites</p>
                    <p>{formatNumber(summary.capacityMw)} MW capacity</p>
                    <p>{summary.avgUtilization ? `${summary.avgUtilization}% util.` : "No util. data"}</p>
                    <p>{summary.avgPue ? `${formatNumber(summary.avgPue, 2)} avg PUE` : "No PUE data"}</p>
                    <p>{summary.avgLatency ? `${summary.avgLatency} ms latency` : "No latency data"}</p>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        <div className="section">
          <div className="section-title-row">
            <label className="label">Legend</label>
            <button className="text-button" onClick={() => setLegendOpen((value) => !value)}>
              {legendOpen ? "Hide" : "Show"}
            </button>
          </div>

          {legendOpen && (
            <div className="legend">
              <div><span className="dot facility"></span> Facility marker</div>
              <div><span className="dot cluster"></span> Zoomed-out cluster</div>
              <div><span className="dot selected"></span> Selected facility</div>
              <p className="microcopy">Facility performance values use estimated ranges derived from capacity, geography, and operator profile.</p>
            </div>
          )}
        </div>
      </aside>

      <main className="map-wrap">
        <div className="map-hud">
          <div className="overlay-card">
            <span className="overlay-label">Live performance overlay</span>
            <strong>{totals.avgUtilization ? `${totals.avgUtilization}%` : "--"}</strong>
            <small>Avg. utilization</small>
            <div className="overlay-metrics">
              <span>PUE {totals.avgPue ? formatNumber(totals.avgPue, 2) : "--"}</span>
              <span>Latency {totals.avgLatency ? `${totals.avgLatency} ms` : "--"}</span>
            </div>
          </div>

          <div className="overlay-card compact">
            <span className="overlay-label">Map state</span>
            <strong>{clusterSummary.clusterCount}</strong>
            <small>clusters at zoom {viewport.zoom}</small>
            <div className="overlay-metrics">
              <span>{clusterSummary.renderedFacilityCount} direct markers</span>
            </div>
          </div>
        </div>

        <MapContainer
          center={[39.2, -96.5]}
          zoom={4}
          minZoom={3}
          maxZoom={12}
          zoomControl={false}
          className="map"
        >
          <ZoomControl position="bottomright" />
          <TileLayer key={theme} attribution={activeTiles.attribution} url={activeTiles.url} />
          <MapViewportTracker onChange={setViewport} />
          <ClusterMarkers
            clusterPoints={clusterPoints}
            supercluster={clusterIndex}
            onSelect={setSelectedFacility}
            selectedId={selectedFacility?.id}
            theme={theme}
          />
        </MapContainer>

        <section className={`details-panel ${selectedFacilityDetails ? "open" : ""}`}>
          <div className="section-title-row">
            <div>
              <span className="details-kicker">Facility details</span>
              <h2>{selectedFacilityDetails ? selectedFacilityDetails.name : "Select a facility"}</h2>
            </div>
            {selectedFacilityDetails && (
              <button className="text-button" onClick={() => setSelectedFacility(null)}>
                Clear
              </button>
            )}
          </div>

          {selectedFacilityDetails ? (
            <>
              <p className="details-subtitle">
                {selectedFacilityDetails.provider} • {selectedFacilityDetails.region} • {selectedFacilityDetails.city}
              </p>

              <div className="details-grid">
                <div>
                  <span>Power</span>
                  <strong>{formatNumber(selectedFacilityDetails.capacityMw)} MW</strong>
                </div>
                <div>
                  <span>Cooling</span>
                  <strong>{selectedFacilityDetails.cooling.value}</strong>
                </div>
                <div>
                  <span>Utilization</span>
                  <strong>{formatEstimate(selectedFacilityDetails.utilizationPct, "%")}</strong>
                </div>
                <div>
                  <span>PUE</span>
                  <strong>{formatEstimate(selectedFacilityDetails.pue)}</strong>
                </div>
                <div>
                  <span>Latency</span>
                  <strong>{formatEstimate(selectedFacilityDetails.latencyMs, " ms")}</strong>
                </div>
                <div>
                  <span>Annual energy</span>
                  <strong>{formatNumber(selectedFacilityDetails.annualEnergyGwh)} GWh</strong>
                </div>
              </div>

              <div className="details-meta">
                <span>{selectedFacilityDetails.facilityType}</span>
                <span>Commissioned {selectedFacilityDetails.commissionedYear}</span>
                {selectedFacilityDetails.isNew && <span className="alert-badge">New facility</span>}
              </div>

              <p className="microcopy">Source: {selectedFacilityDetails.source}</p>
            </>
          ) : (
            <p className="microcopy">Tap or click a marker to inspect site-level power, cooling, utilization, PUE, and latency estimates.</p>
          )}
        </section>
      </main>
    </div>
  );
}
