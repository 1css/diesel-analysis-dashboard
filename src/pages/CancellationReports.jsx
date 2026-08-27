import { useMemo } from "react";

import ReactECharts from "echarts-for-react";

import ChartCard from "../components/ChartCard";
import BarChart from "../components/BarChart";

import {
  cancelledIndentsIssuedBy,
  monthlyCancellationRate,
} from "../utils/analytics";

export default function CancellationReports({ rows, view = "issued-by" }) {
  const cancelledIssuedBy = useMemo(
    () => cancelledIndentsIssuedBy(rows).slice(0, 20),
    [rows],
  );

  const monthly = useMemo(() => monthlyCancellationRate(rows), [rows]);

  if (view === "monthly") {
    return (
      <div>
        <div className="page-title">
          <span>CANCELLATION ANALYTICS</span>

          <h2>Monthly Cancellation Rate</h2>

          <p>Cancelled indents divided by total indents for each month.</p>
        </div>

        <ChartCard
          title="7. Monthly Cancellation Rate (%)"
          description="Cancelled indents divided by total indents for each month."
        >
          <ReactECharts
            option={{
              tooltip: {
                trigger: "axis",

                formatter: (params) => {
                  const item = monthly[params[0].dataIndex];

                  return `
                      <strong>
                        ${item.name}
                      </strong>
                      <br/>
                      Cancellation Rate:
                      ${item.value.toFixed(2)}%
                      <br/>
                      Cancelled:
                      ${item.cancelled}
                      <br/>
                      Total:
                      ${item.total}
                    `;
                },
              },

              grid: {
                left: 80,
                right: 30,
                top: 45,
                bottom: 80,
                containLabel: true,
              },

              xAxis: {
                type: "category",

                name: "Month",

                nameLocation: "middle",

                nameGap: 55,

                data: monthly.map((item) => item.name),
              },

              yAxis: {
                type: "value",

                name: "Cancellation Rate (%)",

                nameLocation: "middle",

                nameGap: 60,

                axisLabel: {
                  formatter: "{value}%",
                },
              },

              series: [
                {
                  type: "line",

                  smooth: true,

                  data: monthly.map((item) => item.value),
                },
              ],
            }}
            style={{
              height: 520,
            }}
          />
        </ChartCard>
      </div>
    );
  }

  return (
    <div>
      <div className="page-title">
        <span>CANCELLATION ANALYTICS</span>

        <h2>Diesel Cancellation Analysis</h2>

        <p>Cancellation analysis based on the Issued By field.</p>
      </div>

      <ChartCard
        title="3. Canceled Indents Issued By"
        description="Only cancelled indents are included. The grouping is based on IssuedBy — identifying whose issued indents were cancelled."
      >
        <BarChart
          data={cancelledIssuedBy}
          xAxisName="Indent Issued By"
          yAxisName="Cancelled Indents (Count)"
          height={520}
        />
      </ChartCard>
    </div>
  );
}
