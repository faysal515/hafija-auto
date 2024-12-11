import VehicleSearch from "@/components/VehicleSearch";
import vehicleData from "@/assets/transformed_output.json";

export default function VehicleSearchPage() {
  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold mb-6">
        Car Duty Calculator - December 2024
      </h1>
      <VehicleSearch vehicleData={vehicleData} />
    </div>
  );
}
