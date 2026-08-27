import { Fuel } from "lucide-react";

export default function LoadingScreen() {
  return (
    <div className="loading-overlay">
      <div className="loading-box">
        <div className="loading-spinner">
          <Fuel size={28} />
        </div>

        <h2>Processing Diesel Data</h2>

        <p>Reading Excel data and preparing analytics...</p>

        <div className="loading-progress">
          <span />
        </div>
      </div>
    </div>
  );
}
