import { useMemo } from "react";

import ChartCard from "../components/ChartCard";
import BarChart from "../components/BarChart";

import { topTransportVendors } from "../utils/analytics";

export default function VendorReports({ rows }) {
  const vendors = useMemo(() => topTransportVendors(rows), [rows]);

  return (
    <div>
      <div className="page-title">
        <span>TRANSPORT VENDOR REPORT</span>

        <h2>6. Top 10 Transport Vendors by Diesel Money Spent</h2>

        <p>Top transport vendors ranked by diesel expenditure.</p>
      </div>

      <ChartCard
        title="6. Top 10 Transport Vendors by Diesel Money Spent"
        description="TransportName compared with HSDAmount"
      >
        <BarChart
          data={vendors}
          xAxisName="Transport Vendor"
          yAxisName="Diesel Money Spent (₹)"
          money
          horizontal
          height={560}
        />
      </ChartCard>
    </div>
  );
}
