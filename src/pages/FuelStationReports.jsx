import { useMemo } from "react";

import ReactECharts from "echarts-for-react";

import ChartCard from "../components/ChartCard";

import { topFuelStations } from "../utils/analytics";

export default function FuelStationReports({ rows }) {
  const stations = useMemo(() => topFuelStations(rows), [rows]);

  const option = {
    tooltip: {
      trigger: "axis",

      axisPointer: {
        type: "shadow",
      },

      formatter: (params) => {
        const index = params[0].dataIndex;

        const station = stations[index];

        return `
          <strong>
            ${station.name}
          </strong>
          <br/>
          Location:
          ${station.location}
          <br/>
          Indents:
          ${station.indents.toLocaleString("en-IN")}
          <br/>
          Diesel:
          ${station.liters.toLocaleString("en-IN", {
            maximumFractionDigits: 2,
          })} L
          <br/>
          Money Spent:
          ₹${station.money.toLocaleString("en-IN", {
            maximumFractionDigits: 0,
          })}
        `;
      },
    },

    legend: {
      top: 5,

      textStyle: {
        color: "#8fa2b8",
      },
    },

    grid: {
      left: 80,
      right: 80,
      top: 60,
      bottom: 105,
      containLabel: true,
    },

    xAxis: {
      type: "category",

      name: "Fuel Station",

      nameLocation: "middle",

      nameGap: 70,

      data: stations.map((item) => item.name),

      axisLabel: {
        interval: 0,

        rotate: 30,
      },
    },

    yAxis: [
      {
        type: "value",

        name: "Indent Count",

        nameLocation: "middle",

        nameGap: 55,
      },

      {
        type: "value",

        name: "Money Spent (₹)",

        nameLocation: "middle",

        nameGap: 65,
      },
    ],

    series: [
      {
        name: "Indents",

        type: "bar",

        data: stations.map((item) => item.indents),
      },

      {
        name: "Money Spent",

        type: "line",

        smooth: true,

        yAxisIndex: 1,

        data: stations.map((item) => item.money),
      },
    ],
  };

  return (
    <div>
      <div className="page-title">
        <span>FUEL STATION ANALYTICS</span>

        <h2>5. Top 10 Fuel Stations: Indents vs Money Spent with Location</h2>

        <p>
          Top fuel stations based on diesel expenditure, including station
          location.
        </p>
      </div>

      <ChartCard
        title="5. Top 10 Fuel Stations: Indents vs Money Spent with Location"
        description="Bars = indent count • Line = money spent • Hover over a station to see its location."
      >
        <ReactECharts
          option={option}
          style={{
            height: 560,
          }}
        />
      </ChartCard>

      {/* Location table */}

      <ChartCard
        title="Fuel Station Location Details"
        description="Top 10 fuel stations and their locations"
      >
        <div className="table-scroll">
          <table>
            <thead>
              <tr>
                <th>Rank</th>

                <th>Fuel Station</th>

                <th>Location</th>

                <th>Indents</th>

                <th>Diesel (L)</th>

                <th>Money Spent (₹)</th>
              </tr>
            </thead>

            <tbody>
              {stations.map((station, index) => (
                <tr key={index}>
                  <td>{index + 1}</td>

                  <td>{station.name}</td>

                  <td>{station.location}</td>

                  <td>{station.indents.toLocaleString("en-IN")}</td>

                  <td>
                    {station.liters.toLocaleString("en-IN", {
                      maximumFractionDigits: 2,
                    })}
                  </td>

                  <td>
                    ₹
                    {station.money.toLocaleString("en-IN", {
                      maximumFractionDigits: 0,
                    })}
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
