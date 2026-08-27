import { useMemo, useState } from "react";

export default function DataExplorer({ rows }) {
  const [page, setPage] = useState(1);

  const pageSize = 50;

  const totalPages = Math.max(1, Math.ceil(rows.length / pageSize));

  const visibleRows = useMemo(
    () => rows.slice((page - 1) * pageSize, page * pageSize),
    [rows, page],
  );

  const columns = rows.length ? Object.keys(rows[0]) : [];

  return (
    <div>
      <div className="page-title">
        <span>RAW EXCEL DATA</span>

        <h2>Data Explorer</h2>

        <p>Complete row-level diesel data.</p>
      </div>

      <div className="chart-card">
        <div className="table-header">
          <strong>{rows.length.toLocaleString("en-IN")} records</strong>

          <div className="pagination">
            <button
              disabled={page === 1}
              onClick={() => setPage((p) => Math.max(1, p - 1))}
            >
              Previous
            </button>

            <span>
              {page} / {totalPages}
            </span>

            <button
              disabled={page === totalPages}
              onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
            >
              Next
            </button>
          </div>
        </div>

        <div className="table-scroll">
          <table>
            <thead>
              <tr>
                {columns.map((column) => (
                  <th key={column}>{column}</th>
                ))}
              </tr>
            </thead>

            <tbody>
              {visibleRows.map((row, index) => (
                <tr key={index}>
                  {columns.map((column) => (
                    <td key={column}>{String(row[column] ?? "-")}</td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
