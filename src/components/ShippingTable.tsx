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

  // Filter out rows where both Chittagong and Mongla are blank/"-" or Mongla date has passed
  const filteredShippingData = shippingData.filter((row) => {
    // Check if both Chittagong and Mongla are empty or "-"
    const isChittagongEmpty =
      !row.chittagong || row.chittagong === "-" || row.chittagong.trim() === "";
    const isMonglaEmpty =
      !row.mongla || row.mongla === "-" || row.mongla.trim() === "";

    console.log("Row:", row.company, "Mongla:", row.mongla);

    // If both are empty, remove the row
    if (isChittagongEmpty && isMonglaEmpty) {
      console.log("Removing row - both ports empty:", row.company);
      return false;
    }

    // If Mongla has a date, check if it has passed
    if (!isMonglaEmpty) {
      // Try to parse the date in a robust way
      let monglaDate: Date | null = null;

      // Accepts formats: YYYY-MM-DD, DD/MM/YYYY, DD-MM-YYYY
      if (/^\d{4}-\d{2}-\d{2}$/.test(row.mongla)) {
        // YYYY-MM-DD
        monglaDate = new Date(row.mongla);
        console.log("Parsed YYYY-MM-DD format:", row.mongla, "->", monglaDate);
      } else if (/^\d{2}[\-\/]\d{2}[\-\/]\d{4}$/.test(row.mongla)) {
        // DD/MM/YYYY or DD-MM-YYYY
        const [d, m, y] = row.mongla.split(/[\-\/]/);
        monglaDate = new Date(`${y}-${m}-${d}`);
        console.log("Parsed DD/MM/YYYY format:", row.mongla, "->", monglaDate);
      } else {
        console.log("Could not parse date format:", row.mongla);
      }

      // If we successfully parsed the date
      if (monglaDate && !isNaN(monglaDate.getTime())) {
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        monglaDate.setHours(0, 0, 0, 0);

        console.log("Comparing dates:", {
          monglaDate: monglaDate.toISOString(),
          today: today.toISOString(),
          isPast: monglaDate < today,
        });

        // If the date has passed, remove the row
        if (monglaDate < today) {
          console.log("Removing row - date passed:", row.company, row.mongla);
          return false;
        }
      }
    }

    return true;
  });

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
          {filteredShippingData.map((row, index) => (
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
