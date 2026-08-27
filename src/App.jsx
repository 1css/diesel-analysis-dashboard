import { useMemo, useState } from "react";

import * as XLSX from "xlsx";

import {
  LayoutDashboard,
  Droplets,
  XCircle,
  Users,
  Fuel,
  GitCompare,
  Copy,
  Database,
  Menu,
  Upload,
  X,
  BarChart3,
} from "lucide-react";

import VehicleReports from "./pages/VehicleReports";

import CancellationReports from "./pages/CancellationReports";

import IssuedByReports from "./pages/IssuedByReports";

import FuelStationReports from "./pages/FuelStationReports";

import RelationshipReports from "./pages/RelationshipReports";

import DuplicateReports from "./pages/DuplicateReports";

import DataExplorer from "./pages/DataExplorer";

import ScatterChart from "./components/ScatterChart";

import ChartCard from "./components/ChartCard";

import LoadingScreen from "./components/LoadingScreen";

import { dieselVsMoney } from "./utils/analytics";

import "./App.css";

// ============================================================
// NAVIGATION
// ============================================================

const navigation = [
  {
    id: "overview",
    title: "Overview",
    shortTitle: "Overview",
    icon: LayoutDashboard,
  },

  {
    id: "vehicle-share",
    title: "2. Share of Total Diesel (Liters) by Vehicle Type",
    shortTitle: "2. Diesel Share by Vehicle",
    icon: Droplets,
  },

  {
    id: "cancel-issued-by",
    title: "3. Canceled Indents Issued By",
    shortTitle: "3. Canceled Indents Issued By",
    icon: XCircle,
  },

  {
    id: "issued-by",
    title: "4. Top 10 Indent Issued By by Diesel",
    shortTitle: "4. Top 10 Issued By by Diesel",
    icon: Users,
  },

  {
    id: "stations",
    title: "5. Top 10 Fuel Stations: Indents vs Money Spent with Location",
    shortTitle: "5. Fuel Stations + Location",
    icon: Fuel,
  },

  {
    id: "vehicle-average",
    title: "6. Average Diesel Liters per Vehicle Type",
    shortTitle: "6. Average Diesel by Vehicle",
    icon: Droplets,
  },

  {
    id: "cancel-monthly",
    title: "7. Monthly Cancellation Rate (%)",
    shortTitle: "7. Monthly Cancellation Rate",
    icon: XCircle,
  },

  {
    id: "diesel-money",
    title: "8. Diesel Liters vs Money Spend",
    shortTitle: "8. Diesel Liters vs Money",
    icon: GitCompare,
  },

  {
    id: "driver-vehicles",
    title: "9. Single Driver, Multiple Vehicles",
    shortTitle: "9. Driver → Vehicles",
    icon: Users,
  },

  {
    id: "vehicle-drivers",
    title: "10. Single Vehicle, Multiple Drivers",
    shortTitle: "10. Vehicle → Drivers",
    icon: Users,
  },

  {
    id: "duplicates",
    title: "11. Double Entries: Same Vehicle & Same Driver on Same Date",
    shortTitle: "11. Double Entries",
    icon: Copy,
  },

  {
    id: "data",
    title: "Data Explorer",
    shortTitle: "Data Explorer",
    icon: Database,
  },
];

// ============================================================
// APP
// ============================================================

export default function App() {
  const [rows, setRows] = useState([]);

  const [activePage, setActivePage] = useState("overview");

  const [loading, setLoading] = useState(false);

  const [sidebarOpen, setSidebarOpen] = useState(false);

  const [search, setSearch] = useState("");

  // ==========================================================
  // EXCEL
  // ==========================================================

  async function loadExcel(file) {
    if (!file) return;

    setLoading(true);

    try {
      const buffer = await file.arrayBuffer();

      const workbook = XLSX.read(buffer, {
        type: "array",
        cellDates: true,
      });

      const sheetName = workbook.SheetNames.includes("DieselDetail")
        ? "DieselDetail"
        : workbook.SheetNames[0];

      const worksheet = workbook.Sheets[sheetName];

      const data = XLSX.utils.sheet_to_json(worksheet, {
        defval: null,
      });

      console.log("Loaded rows:", data.length);

      console.log("Columns:", Object.keys(data[0] || {}));

      setRows(data);

      setActivePage("overview");
    } catch (error) {
      console.error(error);

      alert("Unable to read Excel file.");
    } finally {
      setTimeout(() => setLoading(false), 600);
    }
  }

  // ==========================================================
  // SEARCH
  // ==========================================================

  const filteredRows = useMemo(() => {
    if (!search.trim()) {
      return rows;
    }

    const query = search.toLowerCase();

    return rows.filter((row) =>
      Object.values(row).some((value) =>
        String(value ?? "")
          .toLowerCase()
          .includes(query),
      ),
    );
  }, [rows, search]);

  // ==========================================================
  // PAGE
  // ==========================================================

  function renderPage() {
    switch (activePage) {
      case "vehicle-share":
        return <VehicleReports rows={filteredRows} view="share" />;

      case "vehicle-average":
        return <VehicleReports rows={filteredRows} view="average" />;

      case "cancel-issued-by":
        return <CancellationReports rows={filteredRows} view="issued-by" />;

      case "cancel-monthly":
        return <CancellationReports rows={filteredRows} view="monthly" />;

      case "issued-by":
        return <IssuedByReports rows={filteredRows} />;

      case "stations":
        return <FuelStationReports rows={filteredRows} />;

      case "driver-vehicles":
        return (
          <RelationshipReports rows={filteredRows} view="driver-vehicles" />
        );

      case "vehicle-drivers":
        return (
          <RelationshipReports rows={filteredRows} view="vehicle-drivers" />
        );

      case "duplicates":
        return <DuplicateReports rows={filteredRows} />;

      case "diesel-money":
        return <DieselMoneyPage rows={filteredRows} />;

      case "data":
        return <DataExplorer rows={filteredRows} />;

      default:
        return <Overview rows={filteredRows} />;
    }
  }

  return (
    <div className="app-shell">
      {loading && <LoadingScreen />}

      {/* ======================================================
          SIDEBAR
      ====================================================== */}

      <aside className={`sidebar ${sidebarOpen ? "sidebar-open" : ""}`}>
        <div className="brand">
          <div className="brand-icon">
            <Fuel size={22} />
          </div>

          <div>
            <strong>Diesel Intelligence</strong>

            <small>Fleet Analytics Dashboard</small>
          </div>

          <button
            className="close-mobile"
            onClick={() => setSidebarOpen(false)}
          >
            <X size={18} />
          </button>
        </div>

        <nav>
          <span className="nav-section-title">DIESEL REPORTS</span>

          {navigation.map((item, index) => {
            const Icon = item.icon;

            return (
              <button
                key={`${item.id}-${index}`}
                title={item.title}
                className={`nav-link ${activePage === item.id ? "active" : ""}`}
                onClick={() => {
                  setActivePage(item.id);

                  setSidebarOpen(false);
                }}
              >
                <Icon size={16} />

                <span>{item.shortTitle}</span>
              </button>
            );
          })}
        </nav>

        <div className="sidebar-footer">
          <span className="online-dot" />

          <div>
            <strong>Excel Data</strong>

            <small>{rows.length.toLocaleString("en-IN")} rows loaded</small>
          </div>
        </div>
      </aside>

      {/* ======================================================
          MAIN
      ====================================================== */}

      <main className="main-content">
        <header className="top-header">
          <button className="mobile-menu" onClick={() => setSidebarOpen(true)}>
            <Menu size={20} />
          </button>

          <div className="header-title">
            <h1>Diesel Intelligence</h1>

            <span>Diesel • Vehicle • Driver • Fuel Station Analytics</span>
          </div>

          <div className="header-actions">
            {/*  <div className="search-box">
              <input
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search diesel data..."
              />

              {search && (
                <button onClick={() => setSearch("")}>
                  <X size={14} />
                </button>
              )}
            </div> */}

            <label className="upload-button">
              <Upload size={15} />

              <span>Upload Excel</span>

              <input
                type="file"
                accept=".xlsx,.xls"
                hidden
                onChange={(e) => loadExcel(e.target.files?.[0])}
              />
            </label>
          </div>
        </header>

        <div className="content">{renderPage()}</div>
      </main>
    </div>
  );
}

// ============================================================
// OVERVIEW
// ============================================================

function Overview({ rows }) {
  const totalDiesel = rows.reduce((sum, row) => sum + Number(row.HSD || 0), 0);

  const totalMoney = rows.reduce(
    (sum, row) => sum + Number(row.HSDAmount || 0),
    0,
  );

  const vehicleCount = new Set(rows.map((row) => row.VehicleNo).filter(Boolean))
    .size;

  const cancelled = rows.filter(
    (row) =>
      row.Cancel !== null &&
      row.Cancel !== undefined &&
      String(row.Cancel).trim() !== "",
  ).length;

  return (
    <div>
      <div className="page-title">
        <span>DIESEL OPERATIONS</span>

        <h2>Diesel Intelligence Dashboard</h2>

        <p>Complete analysis of your uploaded diesel Excel data.</p>
      </div>

      <div className="kpi-grid">
        <Kpi
          title="Total Diesel"
          value={`${totalDiesel.toLocaleString("en-IN", {
            maximumFractionDigits: 2,
          })} L`}
        />

        <Kpi
          title="Diesel Amount"
          value={`₹${totalMoney.toLocaleString("en-IN", {
            maximumFractionDigits: 0,
          })}`}
        />

        <Kpi title="Vehicles" 
        value={vehicleCount.toLocaleString("en-IN")} />

        <Kpi
          title="Cancelled Indents"
          value={cancelled.toLocaleString("en-IN")}
          danger
        />
      </div>

      <div className="overview-message">
        <BarChart3 size={28} />

        <div>
          <h3>Upload your diesel Excel file</h3>

          <p>
            Use the <strong>Upload Excel</strong> button above. After loading
            the data, select any report from the left sidebar.
          </p>
        </div>
      </div>
    </div>
  );
}

function Kpi({ title, value, danger }) {
  return (
    <div className={`kpi ${danger ? "kpi-danger" : ""}`}>
      <span>{title}</span>

      <strong>{value}</strong>
    </div>
  );
}

// ============================================================
// REPORT 8
// ============================================================

function DieselMoneyPage({ rows }) {
  const data = useMemo(() => dieselVsMoney(rows), [rows]);

  return (
    <div>
      <div className="page-title">
        <span>COST ANALYTICS</span>

        <h2>8. Diesel Liters vs Money Spend</h2>

        <p>Relationship between diesel quantity and money spent.</p>
      </div>

      <ChartCard
        title="8. Diesel Liters vs Money Spend"
        description="Every point represents one diesel transaction."
      >
        <ScatterChart data={data} height={600} />
      </ChartCard>
    </div>
  );
}
