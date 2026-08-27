import ReactECharts from "echarts-for-react";

const AXIS_NAME_STYLE = {
  color: "red",
};

const AXIS_LABEL_COLOR = "red";

export default function BarChart({
  data = [],
  xAxisName,
  yAxisName,
  height = 450,
  horizontal = false,
  money = false,
}) {
  const option = {
    animation: true,

    tooltip: {
      trigger: "axis",

      axisPointer: {
        type: "shadow",
      },

      formatter: (params) => {
        const item = params[0];

        const value = Number(item.value || 0);

        const display = money
          ? `₹${value.toLocaleString("en-IN", {
              maximumFractionDigits: 0,
            })}`
          : value.toLocaleString("en-IN", {
              maximumFractionDigits: 2,
            });

        return `
          <strong>
            ${item.name}
          </strong>
          <br/>
          ${yAxisName}: ${display}
        `;
      },
    },

    grid: {
      left: 80,
      right: 30,
      top: 50,
      bottom: 90,
      containLabel: true,
    },

    xAxis: horizontal
      ? {
          type: "value",

          name: xAxisName,

          nameLocation: "middle",

          nameGap: 45,

          nameTextStyle: AXIS_NAME_STYLE,

          axisLabel: {
            color: AXIS_LABEL_COLOR,
          },
        }
      : {
          type: "category",

          name: xAxisName,

          nameLocation: "middle",

          nameGap: 65,

          nameTextStyle: AXIS_NAME_STYLE,

          data: data.map((item) => item.name),

          axisLabel: {
            interval: 0,

            rotate: data.length > 6 ? 30 : 0,

            color: AXIS_LABEL_COLOR,
          },
        },

    yAxis: horizontal
      ? {
          type: "category",

          name: yAxisName,

          nameTextStyle: AXIS_NAME_STYLE,

          data: data.map((item) => item.name),

          axisLabel: {
            width: 170,

            overflow: "truncate",

            color: AXIS_LABEL_COLOR,
          },
        }
      : {
          type: "value",

          name: yAxisName,

          nameLocation: "middle",

          nameGap: 60,

          nameTextStyle: AXIS_NAME_STYLE,

          axisLabel: {
            color: AXIS_LABEL_COLOR,
          },
        },

    dataZoom:
      data.length > 10
        ? [
            {
              type: "inside",
            },

            {
              type: "slider",
              bottom: 15,
            },
          ]
        : [],

    series: [
      {
        type: "bar",

        data: data.map((item) => item.value),

        barMaxWidth: 40,

        emphasis: {
          focus: "series",
        },
      },
    ],
  };

  return <ReactECharts option={option} style={{ height }} notMerge />;
}
