import ReactECharts from "echarts-for-react";

export default function PieChart({ data = [], height = 450 }) {
  const option = {
    tooltip: {
      trigger: "item",

      formatter: "{b}<br/>Diesel: {c} L<br/>Share: {d}%",
    },

    legend: {
      bottom: 5,

      type: "scroll",

      textStyle: {
        color: "#91a3b9",
      },
    },

    series: [
      {
        type: "pie",

        radius: ["45%", "72%"],

        label: {
          formatter: "{b}\n{d}%",
        },

        data: data.map((item) => ({
          name: item.name,
          value: item.value,
        })),
      },
    ],
  };

  return (
    <ReactECharts option={option} style={{ width: "100%", height }} notMerge />
  );
}
