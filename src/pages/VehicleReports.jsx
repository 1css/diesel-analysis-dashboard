import { useMemo } from "react";

import ChartCard from "../components/ChartCard";
import BarChart from "../components/BarChart";
import PieChart from "../components/PieChart";

import {
  dieselShareByVehicleType,
  averageDieselByVehicleType,
} from "../utils/analytics";

export default function VehicleReports({ rows, view = "share" }) {
  const share = useMemo(() => dieselShareByVehicleType(rows), [rows]);

  const average = useMemo(() => averageDieselByVehicleType(rows), [rows]);

  if (view === "average") {
    return (
      <div>
        <PageTitle
          title="Average Diesel Liters per Vehicle Type"
          description="Average HSD issued per transaction, by vehicle type."
        />

        <ChartCard
          title="6. Average Diesel Liters per Vehicle Type"
          description="Average HSD issued per transaction"
        >
          <BarChart
            data={average}
            xAxisName="Vehicle Type"
            yAxisName="Average Diesel (Liters)"
            height={520}
          />
        </ChartCard>
      </div>
    );
  }

  return (
    <div>
      <PageTitle
        title="Vehicle Type Diesel Analysis"
        description="Diesel consumption and average diesel usage by vehicle type."
      />

      <ChartCard
        title="2. Share of Total Diesel (Liters) by Vehicle Type"
        description="Percentage contribution to total diesel consumption"
      >
        <PieChart data={share} height={520} />
      </ChartCard>
    </div>
  );
}

function PageTitle({ title, description }) {
  return (
    <div className="page-title">
      <span>VEHICLE ANALYTICS</span>

      <h2>{title}</h2>

      <p>{description}</p>
    </div>
  );
}
