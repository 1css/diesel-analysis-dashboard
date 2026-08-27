import { useMemo } from "react";

import ChartCard from "../components/ChartCard";

import {
  driverMultipleVehicles,
  vehicleMultipleDrivers,
} from "../utils/analytics";

export default function RelationshipReports({ rows, view = "driver-vehicles" }) {
  const driverData = useMemo(() => driverMultipleVehicles(rows), [rows]);

  const vehicleData = useMemo(() => vehicleMultipleDrivers(rows), [rows]);

  if (view === "vehicle-drivers") {
    return (
      <div>
        <div className="page-title">
          <span>DRIVER & VEHICLE ANALYTICS</span>

          <h2>Single Vehicle, Multiple Drivers</h2>

          <p>Vehicles associated with more than one driver.</p>
        </div>

        <ChartCard
          title="10. Single Vehicle, Multiple Drivers"
          description="Vehicles associated with more than one driver"
        >
          <RelationshipTable type="vehicle" data={vehicleData} />
        </ChartCard>
      </div>
    );
  }

  return (
    <div>
      <div className="page-title">
        <span>DRIVER & VEHICLE ANALYTICS</span>

        <h2>Single Driver, Multiple Vehicles</h2>

        <p>Drivers associated with more than one vehicle.</p>
      </div>

      <ChartCard
        title="9. Single Driver, Multiple Vehicles"
        description="Drivers associated with more than one vehicle"
      >
        <RelationshipTable type="driver" data={driverData} />
      </ChartCard>
    </div>
  );
}

function RelationshipTable({ type, data }) {
  if (data.length === 0) {
    return <div className="empty-state">No multiple relationships found.</div>;
  }

  return (
    <div className="relationship-table">
      {data.slice(0, 300).map((item, index) => {
        const name = type === "driver" ? item.driver : item.vehicle;

        const list = type === "driver" ? item.vehicles : item.drivers;

        return (
          <div className="relationship-row" key={index}>
            <div>
              <strong>{name}</strong>

              <small>{list.join(", ")}</small>
            </div>

            <span>{item.count}</span>
          </div>
        );
      })}
    </div>
  );
}
