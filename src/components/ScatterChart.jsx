import ReactECharts from "echarts-for-react";

export default function ScatterChart({ data = [], height = 550 }) {
  const option = {
    animation: false,

    tooltip: {
      formatter: (params) => {
        const item = data[params.dataIndex];

        return `
          <strong>
            ${item.vehicle}
          </strong>
          <br/>
          Driver: ${item.driver}
          <br/>
          Diesel: ${item.liters.toFixed(2)} L
          <br/>
          Amount: ₹${item.money.toLocaleString("en-IN")}
        `;
      },
    },

    grid: {
      left: 85,
      right: 35,
      top: 40,
      bottom: 75,
      containLabel: true,
    },

    xAxis: {
      type: "value",

      name: "Diesel Liters (L)",

      nameLocation: "middle",

      nameGap: 45,
    },

    yAxis: {
      type: "value",

      name: "Diesel Amount (₹)",

      nameLocation: "middle",

      nameGap: 65,
    },

    dataZoom: [
      {
        type: "inside",
      },
    ],

    series: [
      {
        type: "scatter",

        symbolSize: 7,

        data: data.map((item) => [item.liters, item.money]),
      },
    ],
  };

  return <ReactECharts option={option} style={{ height }} notMerge />;
}
