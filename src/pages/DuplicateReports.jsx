import { useMemo } from "react";

import ChartCard from "../components/ChartCard";

import { duplicateEntries } from "../utils/analytics";

export default function DuplicateReports({ rows }) {
  const duplicates = useMemo(() => duplicateEntries(rows), [rows]);

  return (
    <div>
      <div className="page-title">
        <span>DATA QUALITY</span>

        <h2>12. Double Entries: Same Vehicle & Same Driver on Same Date</h2>

        <p>Potential duplicate diesel transactions.</p>
      </div>

      <ChartCard
        title="12. Double Entries: Same Vehicle & Same Driver on Same Date"
        description="Vehicle + Driver + Date are used to detect duplicate groups."
      >
        <div className="duplicate-count">
          <strong>{duplicates.length.toLocaleString("en-IN")}</strong>

          <span>duplicate groups detected</span>
        </div>

        <div className="table-scroll">
          <table>
            <thead>
              <tr>
                <th>Vehicle</th>

                <th>Driver</th>

                <th>Date</th>

                <th>Entries</th>
              </tr>
            </thead>

            <tbody>
              {duplicates.slice(0, 1000).map((item, index) => (
                <tr key={index}>
                  <td>{item.vehicle}</td>

                  <td>{item.driver}</td>

                  <td>{String(item.date)}</td>

                  <td>
                    <strong>{item.count}</strong>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </ChartCard>
    </div>
  );
}
