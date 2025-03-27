import React, { useState, useEffect } from "react";
import axios from "axios";

const FleetTable = () => {
  const [fleetData, setFleetData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchFleetData = async () => {
      try {
        const response = await axios.get(`${process.env.REACT_APP_BACKEND_HOST}/masters/fleet`);
        const fetchedData = response.data.express21.results.data;
        setFleetData(fetchedData);
        setLoading(false);
      } catch (err) {
        setError("Failed to fetch data. Please try again later.");
        setLoading(false);
      }
    };

    fetchFleetData();
  }, []);

  return (
    <div className="p-6 bg-gray-100 min-h-screen">
      <div className="bg-white shadow-lg rounded-lg p-6 max-w-screen-xl mx-auto">
        <h1 className="text-3xl font-bold text-gray-800 mb-6">Fleet List</h1>

        {loading ? (
          <p className="text-gray-500">Loading data...</p>
        ) : error ? (
          <p className="text-red-500">{error}</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full table-auto border-collapse">
              <thead>
                <tr className="bg-gray-200 text-gray-600 uppercase text-sm leading-normal">
                  <th className="py-3 px-6 text-left">ID</th>
                  <th className="py-3 px-6 text-left">Branch Name</th>
                  <th className="py-3 px-6 text-left">Vehicle Type</th>
                  <th className="py-3 px-6 text-left">Plat Number</th>
                  <th className="py-3 px-6 text-left">Driver</th>
                  <th className="py-3 px-6 text-left">Status</th>
                  <th className="py-3 px-6 text-left">Destination</th>
                  <th className="py-3 px-6 text-left">BPKB Date</th>
                  <th className="py-3 px-6 text-left">KIR Date</th>
                  <th className="py-3 px-6 text-left">Ownership Type</th>
                  <th className="py-3 px-6 text-left">Volume Capacity</th>
                  <th className="py-3 px-6 text-left">Weight Capacity</th>
                </tr>
              </thead>
              <tbody className="text-gray-600 text-sm font-light font-bold">
                {fleetData.map((item) => (
                  <tr key={item.id} className="border-b border-gray-200 hover:bg-gray-100">
                    <td className="py-2 px-4 border-b text-center text-gray-800 dark:text-white font-bold">{item.id}</td>
                    <td className="py-2 px-4 border-b text-center text-gray-800 dark:text-white font-bold">{item.branch_name}</td>
                    <td className="py-2 px-4 border-b text-center text-gray-800 dark:text-white font-bold">{item.vehicletype}</td>
                    <td className="py-2 px-4 border-b text-center text-gray-800 dark:text-white font-bold">{item.plat_number}</td>
                    <td className="py-2 px-4 border-b text-center text-gray-800 dark:text-white font-bold">{item.driver}</td>
                    <td className="py-2 px-4 border-b text-center text-gray-800 dark:text-white font-bold">{item.status_id}</td>
                    <td className="py-2 px-4 border-b text-center text-gray-800 dark:text-white font-bold">{item.destination}</td>
                    <td className="py-2 px-4 border-b text-center text-gray-800 dark:text-white font-bold">{item.bpkb_date}</td>
                    <td className="py-2 px-4 border-b text-center text-gray-800 dark:text-white font-bold">{item.kir_date}</td>
                    <td className="py-2 px-4 border-b text-center text-gray-800 dark:text-white font-bold">{item.ownershiptype}</td>
                    <td className="py-2 px-4 border-b text-center text-gray-800 dark:text-white font-bold">{item.volume_capacity}</td>
                    <td className="py-2 px-4 border-b text-center text-gray-800 dark:text-white font-bold">{item.weight_capacity}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};

export default FleetTable;
