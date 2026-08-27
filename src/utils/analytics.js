// ============================================================
// DIESEL DASHBOARD ANALYTICS
// ============================================================

export function num(value) {
  if (value === null || value === undefined || value === "") {
    return 0;
  }

  const number = Number(String(value).replace(/,/g, ""));

  return Number.isFinite(number) ? number : 0;
}

export function text(value) {
  if (value === null || value === undefined || String(value).trim() === "") {
    return "Unknown";
  }

  return String(value).trim();
}

export function isCancelled(row) {
  return (
    row.Cancel !== null &&
    row.Cancel !== undefined &&
    String(row.Cancel).trim() !== ""
  );
}

// ============================================================
// DATE
// ============================================================

export function parseDate(value) {
  if (!value) return null;

  if (value instanceof Date) {
    return value;
  }

  // Excel serial date
  if (typeof value === "number") {
    const date = new Date(Math.round((value - 25569) * 86400 * 1000));

    return Number.isNaN(date.getTime()) ? null : date;
  }

  const date = new Date(value);

  return Number.isNaN(date.getTime()) ? null : date;
}

export function getMonth(value) {
  const date = parseDate(value);

  if (!date) {
    return "Unknown";
  }

  return date.toLocaleString("en-IN", {
    month: "short",
    year: "numeric",
  });
}

// ============================================================
// GROUP SUM
// ============================================================

export function groupSum(rows, groupField, valueField) {
  const map = new Map();

  rows.forEach((row) => {
    const name = text(row[groupField]);

    const value = num(row[valueField]);

    map.set(name, (map.get(name) || 0) + value);
  });

  return [...map.entries()]
    .map(([name, value]) => ({
      name,
      value,
    }))
    .sort((a, b) => b.value - a.value);
}

// ============================================================
// GROUP COUNT
// ============================================================

export function groupCount(rows, groupField) {
  const map = new Map();

  rows.forEach((row) => {
    const name = text(row[groupField]);

    map.set(name, (map.get(name) || 0) + 1);
  });

  return [...map.entries()]
    .map(([name, value]) => ({
      name,
      value,
    }))
    .sort((a, b) => b.value - a.value);
}

// ============================================================
// 2. SHARE OF TOTAL DIESEL BY VEHICLE TYPE
// ============================================================

export function dieselShareByVehicleType(rows) {
  
  const data = groupSum(rows, "VehicleType", "HSD");
 
  const total = data.reduce((sum, item) => sum + item.value, 0);
  
  return data.map((item) => ({
    ...item,

    percentage: total > 0 ? (item.value / total) * 100 : 0,
  }));
}

// ============================================================
// 3. CANCELED INDENTS ISSUED BY
//
// IMPORTANT:
// We deliberately use IssuedBy here.
//
// We DO NOT use CancelBy.
//
// Logic:
// 1. Find rows where Cancel is filled.
// 2. Group those cancelled rows by IssuedBy.
// 3. Count cancelled indents.
// ============================================================

export function cancelledIndentsIssuedBy(rows) {
  const cancelledRows = rows.filter(isCancelled);

  return groupCount(cancelledRows, "IssuedBy");
}

// ============================================================
// 4. TOP 10 INDENT ISSUED BY BY DIESEL
//
// Uses IssuedBy + HSD liters.
// ============================================================

export function topIndentIssuedByDiesel(rows) {
  return groupSum(rows, "IssuedBy", "HSD").slice(0, 10);
}

// ============================================================
// 5. TOP 10 FUEL STATIONS
// Indents vs Money Spent + Location
// ============================================================

export function topFuelStations(rows) {
  const map = new Map();

  rows.forEach((row) => {
    const station = text(row.Bunk);

    const location = text(row.Location);

    const key = `${station}|||${location}`;

    if (!map.has(key)) {
      map.set(key, {
        name: station,
        location,
        indents: 0,
        money: 0,
        liters: 0,
      });
    }

    const item = map.get(key);

    item.indents += 1;

    item.money += num(row.HSDAmount);

    item.liters += num(row.HSD);
  });

  return [...map.values()].sort((a, b) => b.money - a.money).slice(0, 10);
}

// ============================================================
// 6. AVERAGE DIESEL LITERS BY VEHICLE TYPE
// ============================================================

export function averageDieselByVehicleType(rows) {
  const map = new Map();

  rows.forEach((row) => {
    const type = text(row.VehicleType);

    if (!map.has(type)) {
      map.set(type, {
        total: 0,
        count: 0,
      });
    }

    const item = map.get(type);

    item.total += num(row.HSD);

    item.count += 1;
  });

  return [...map.entries()]
    .map(([name, item]) => ({
      name,

      value: item.count > 0 ? item.total / item.count : 0,
    }))
    .sort((a, b) => b.value - a.value);
}

// ============================================================
// 7. MONTHLY CANCELLATION RATE
// ============================================================

export function monthlyCancellationRate(rows) {
  const map = new Map();

  rows.forEach((row) => {
    const month = getMonth(row.Date);

    if (month === "Unknown") {
      return;
    }

    if (!map.has(month)) {
      map.set(month, {
        total: 0,
        cancelled: 0,
      });
    }

    const item = map.get(month);

    item.total += 1;

    if (isCancelled(row)) {
      item.cancelled += 1;
    }
  });

  return [...map.entries()].map(([name, item]) => ({
    name,

    value: item.total > 0 ? (item.cancelled / item.total) * 100 : 0,

    total: item.total,

    cancelled: item.cancelled,
  }));
}

// ============================================================
// 8. DIESEL LITERS VS MONEY
// ============================================================

export function dieselVsMoney(rows) {
  return rows
    .map((row, index) => ({
      id: index,

      vehicle: text(row.VehicleNo),

      driver: text(row.Driver),

      liters: num(row.HSD),

      money: num(row.HSDAmount),
    }))
    .filter((item) => item.liters > 0 || item.money > 0);
}

// ============================================================
// 9. CANCELLATION SUMMARY
// ============================================================

export function cancellationSummary(rows) {
  const total = rows.length;

  const cancelled = rows.filter(isCancelled).length;

  const active = total - cancelled;

  return {
    total,

    cancelled,

    active,

    cancelledPercentage: total > 0 ? (cancelled / total) * 100 : 0,

    activePercentage: total > 0 ? (active / total) * 100 : 0,
  };
}

// ============================================================
// 10. SINGLE DRIVER → MULTIPLE VEHICLES
// ============================================================

export function driverMultipleVehicles(rows) {
  const map = new Map();

  rows.forEach((row) => {
    const driver = text(row.Driver);

    const vehicle = text(row.VehicleNo);

    if (!map.has(driver)) {
      map.set(driver, new Set());
    }

    map.get(driver).add(vehicle);
  });

  return [...map.entries()]
    .map(([driver, vehicles]) => ({
      driver,

      vehicles: [...vehicles],

      count: vehicles.size,
    }))
    .filter((item) => item.count > 1)
    .sort((a, b) => b.count - a.count);
}

// ============================================================
// 11. SINGLE VEHICLE → MULTIPLE DRIVERS
// ============================================================

export function vehicleMultipleDrivers(rows) {
  const map = new Map();

  rows.forEach((row) => {
    const vehicle = text(row.VehicleNo);

    const driver = text(row.Driver);

    if (!map.has(vehicle)) {
      map.set(vehicle, new Set());
    }

    map.get(vehicle).add(driver);
  });

  return [...map.entries()]
    .map(([vehicle, drivers]) => ({
      vehicle,

      drivers: [...drivers],

      count: drivers.size,
    }))
    .filter((item) => item.count > 1)
    .sort((a, b) => b.count - a.count);
}

// ============================================================
// 12. DOUBLE ENTRIES
//
// Same Vehicle
// +
// Same Driver
// +
// Same Date
// ============================================================

export function duplicateEntries(rows) {
  const map = new Map();

  rows.forEach((row, index) => {
    const vehicle = text(row.VehicleNo);

    const driver = text(row.Driver);

    const date = parseDate(row.Date);

    let dateKey = "Unknown";

    if (date) {
      dateKey =
        `${date.getFullYear()}-` +
        `${String(date.getMonth() + 1).padStart(2, "0")}-` +
        `${String(date.getDate()).padStart(2, "0")}`;
    }

    const key = `${vehicle}|${driver}|${dateKey}`;

    if (!map.has(key)) {
      map.set(key, []);
    }

    map.get(key).push({
      ...row,

      excelRow: index + 2,
    });
  });

  return [...map.entries()]
    .filter(([, records]) => records.length > 1)
    .map(([key, records]) => ({
      key,

      vehicle: records[0].VehicleNo,

      driver: records[0].Driver,

      date: records[0].Date,

      count: records.length,

      records,
    }));
}
