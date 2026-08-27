import { useMemo } from "react";
import ReactECharts from "echarts-for-react";
import ChartCard from "./components/ChartCard";
import { topFuelStations } from "./utils/analytics";
import { color } from "echarts";
import { Grid } from "lucide-react";

export default function FuelStationReports({rows}){
    const stations=useMemo(()=>topFuelStations(rows),[rows])


    const option={
        tooltip:{
            trigger:"axis",
        axisPointer:{
            type:"shadow",
        },

        formatter:(params)=>{
            const index=params[0].dataIndex

            const station=stations[index];

            return `
                <strong>
                ${station.name}
                </strong>
                <br />
                Location:
                ${station.location}
                <br />
                indents:
                ${station.indents.toLocaleString("en-IN")}
                <br />
                Diesel:
                ${station.liters.toLocaleString("en-IN", {
                  maximumFractionDigits: 2,
                })} L
                <br />
                Money Spent:
                ₹${station.money.toLocaleString("en-IN", {
                  maximumFractionDigits: 0,
                })}
            `;
        }
        },
        legend:{
            top:5,
            textStyle:{
                color:"#fa2b8"
            }
        },
        grid:{
            left:80,
            right:80,
            top:60,
            bottom:105,
            containLabel:true
        }
    }

}