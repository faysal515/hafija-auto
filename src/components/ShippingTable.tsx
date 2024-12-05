import React, { useEffect, useState } from "react";

interface ShippingData {
  company: string;
  shipName: string;
  voyage: string;
  yokohama: string;
  nagoya: string;
  osaka: string;
  chittagong: string;
  mongla: string;
}

const ShippingTable = () => {
  const [shippingData, setShippingData] = useState<ShippingData[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchShippingData = async () => {
      try {
        const response = await fetch("/api/shipping");
        const data = await response.json();
        if (data.success) {
          setShippingData(data.data);
        }
      } catch (error) {
        console.error("Error fetching shipping data:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchShippingData();
  }, []);

  if (isLoading) {
    return (
      <div className="flex justify-center items-center py-8">
        <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-yellow-400"></div>
      </div>
    );
  }

  return (
    <div className="overflow-x-auto rounded-xl border border-gray-700 shadow-lg">
      <table className="min-w-full divide-y divide-gray-700">
        <thead className="bg-gray-800">
          <tr>
            <th className="py-4 px-6 text-left text-xs font-semibold text-yellow-400 uppercase tracking-wider">
              Company
            </th>
            <th className="py-4 px-6 text-left text-xs font-semibold text-yellow-400 uppercase tracking-wider">
              Ship Name
            </th>
            <th className="py-4 px-6 text-center text-xs font-semibold text-yellow-400 uppercase tracking-wider">
              Voyage
            </th>
            <th className="py-4 px-6 text-center text-xs font-semibold text-yellow-400 uppercase tracking-wider">
              Yokohama
            </th>
            <th className="py-4 px-6 text-center text-xs font-semibold text-yellow-400 uppercase tracking-wider">
              Nagoya
            </th>
            <th className="py-4 px-6 text-center text-xs font-semibold text-yellow-400 uppercase tracking-wider">
              Osaka
            </th>
            <th className="py-4 px-6 text-center text-xs font-semibold text-yellow-400 uppercase tracking-wider">
              Chittagong
            </th>
            <th className="py-4 px-6 text-center text-xs font-semibold text-yellow-400 uppercase tracking-wider">
              Mongla
            </th>
          </tr>
        </thead>
        <tbody className="bg-gray-900 divide-y divide-gray-800">
          {shippingData.map((row, index) => (
            <tr
              key={`${row.company}-${row.voyage}-${index}`}
              className={`
                ${index % 2 === 0 ? "bg-gray-900" : "bg-gray-800/50"}
                transition-colors duration-150 hover:bg-gray-700
              `}
            >
              <td className="py-3 px-6 text-sm font-medium text-gray-200">
                {row.company}
              </td>
              <td className="py-3 px-6 text-sm font-medium text-gray-200">
                {row.shipName}
              </td>
              <td className="py-3 px-6 text-sm text-gray-300 text-center">
                {row.voyage}
              </td>
              <td className="py-3 px-6 text-sm text-gray-300 text-center whitespace-nowrap">
                {row.yokohama !== "-" && row.yokohama}
              </td>
              <td className="py-3 px-6 text-sm text-gray-300 text-center whitespace-nowrap">
                {row.nagoya !== "-" && row.nagoya}
              </td>
              <td className="py-3 px-6 text-sm text-gray-300 text-center whitespace-nowrap">
                {row.osaka !== "-" && row.osaka}
              </td>
              <td className="py-3 px-6 text-sm text-gray-300 text-center whitespace-nowrap">
                {row.chittagong !== "-" && row.chittagong}
              </td>
              <td className="py-3 px-6 text-sm text-gray-300 text-center whitespace-nowrap">
                {row.mongla !== "-" && row.mongla}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default ShippingTable;
