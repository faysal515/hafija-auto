import { useState, useEffect } from "react";
import analysisData from "@/assets/analysis_output.json";

export default function VehicleSearch({ vehicleData }: { vehicleData: any[] }) {
  const [selectedBrand, setSelectedBrand] = useState("");
  const [selectedModel, setSelectedModel] = useState("");
  const [selectedYear, setSelectedYear] = useState("");
  const [filteredResults, setFilteredResults] = useState<any[]>([]);

  // Reset model when brand changes
  useEffect(() => {
    setSelectedModel("");
  }, [selectedBrand]);

  // Filter results when any selection changes
  useEffect(() => {
    let results = [...vehicleData];

    if (selectedBrand) {
      results = results.filter((item) => item.brand === selectedBrand);
    }

    if (selectedModel) {
      results = results.filter((item) => item.model === selectedModel);
    }

    if (selectedYear) {
      results = results.filter((item) => item["MFG. YEAR"] === selectedYear);
    }

    setFilteredResults(results);
  }, [selectedBrand, selectedModel, selectedYear, vehicleData]);

  // Add this check before rendering the table
  const shouldShowResults = selectedBrand && (selectedModel || selectedYear);

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {/* Brand Select */}
        <div>
          <label className="block text-sm font-medium mb-2">Brand</label>
          <select
            className="w-full p-2 rounded bg-gray-700 border border-gray-600"
            value={selectedBrand}
            onChange={(e) => setSelectedBrand(e.target.value)}
          >
            <option value="">Select Brand</option>
            {analysisData.brands.map((brand) => (
              <option key={brand} value={brand}>
                {brand}
              </option>
            ))}
          </select>
        </div>

        {/* Model Select */}
        <div>
          <label className="block text-sm font-medium mb-2">Model</label>
          <select
            className="w-full p-2 rounded bg-gray-700 border border-gray-600"
            value={selectedModel}
            onChange={(e) => setSelectedModel(e.target.value)}
            disabled={!selectedBrand}
          >
            <option value="">Select Model</option>
            {selectedBrand &&
              analysisData.models_by_brand[selectedBrand].map((model) => (
                <option key={model} value={model}>
                  {model}
                </option>
              ))}
          </select>
        </div>

        {/* Year Select */}
        <div>
          <label className="block text-sm font-medium mb-2">
            Year (Optional)
          </label>
          <select
            className="w-full p-2 rounded bg-gray-700 border border-gray-600"
            value={selectedYear}
            onChange={(e) => setSelectedYear(e.target.value)}
          >
            <option value="">Select Year</option>
            {analysisData.years.map((year) => (
              <option key={year} value={year}>
                {year}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Results Table - Added animation classes */}
      {shouldShowResults && filteredResults.length > 0 && (
        <div className="overflow-x-auto animate-fade-in transition-all duration-300 ease-in-out opacity-100">
          <table className="min-w-full bg-gray-800 rounded-lg">
            <thead>
              <tr>
                <th className="px-4 py-2 border-b border-gray-700">Brand</th>
                <th className="px-4 py-2 border-b border-gray-700">Model</th>
                <th className="px-4 py-2 border-b border-gray-700">Year</th>
                <th className="px-4 py-2 border-b border-gray-700">Chassis</th>
                <th className="px-4 py-2 border-b border-gray-700">CC</th>
                <th className="px-4 py-2 border-b border-gray-700">
                  INV. VALUE
                </th>
                <th className="px-4 py-2 border-b border-gray-700">Current</th>
                <th className="px-4 py-2 border-b border-gray-700">Previous</th>
              </tr>
            </thead>
            <tbody>
              {filteredResults.map((item, index) => (
                <tr key={index} className="hover:bg-gray-700">
                  <td className="px-4 py-2 border-b border-gray-700">
                    {item.brand}
                  </td>
                  <td className="px-4 py-2 border-b border-gray-700">
                    {item.model}
                  </td>
                  <td className="px-4 py-2 border-b border-gray-700">
                    {item["MFG. YEAR"]}
                  </td>
                  <td className="px-4 py-2 border-b border-gray-700">
                    {item.chassis}
                  </td>
                  <td className="px-4 py-2 border-b border-gray-700">
                    {item.cc}
                  </td>
                  <td className="px-4 py-2 border-b border-gray-700">
                    {item["INV. VALUE"]}
                  </td>
                  <td className="px-4 py-2 border-b border-gray-700">
                    {item.current}
                  </td>
                  <td className="px-4 py-2 border-b border-gray-700">
                    {item.previous}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Message - Added animation classes */}
      {!shouldShowResults && (
        <div className="text-center text-gray-400 mt-4 animate-fade-in transition-all duration-300 ease-in-out opacity-100">
          Please select a brand and either a model or year to view results
        </div>
      )}
    </div>
  );
}
