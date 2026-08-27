import { useMemo } from "react";

import ChartCard from "../components/ChartCard";
import BarChart from "../components/BarChart";

import { topIndentIssuedByDiesel } from "../utils/analytics";

export default function IssuedByReports({ rows }) {
  const data = useMemo(() => topIndentIssuedByDiesel(rows), [rows]);

  return (
    <div>
      <div className="page-title">
        <span>INDENT ISSUED BY ANALYTICS</span>

        <h2>4. Top 10 Indent Issued By by Diesel</h2>

        <p>Top 10 users ranked by total diesel liters issued.</p>
      </div>

      <ChartCard
        title="4. Top 10 Indent Issued By by Diesel"
        description="IssuedBy compared against total HSD diesel liters"
      >
        <BarChart
          data={data}
          xAxisName="Indent Issued By"
          yAxisName="Diesel Issued (Liters)"
          height={520}
        />
      </ChartCard>
    </div>
  );
}
