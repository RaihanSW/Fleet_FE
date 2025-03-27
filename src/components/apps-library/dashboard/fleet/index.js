import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import {
  PieChart, Pie, Cell, Tooltip, 
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Legend, 
  ResponsiveContainer
} from "recharts";

const FleetTable = () => {
  const [fleetData, setFleetData] = useState([]);
  const [paginatedData, setPaginatedData] = useState([]);
  const [repairData, setRepairData] = useState([]);
  const [statusData, setStatusData] = useState([]);
  const [cityData, setCityData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;
  const navigate = useNavigate();

  const fetchData = async (url, setter, transform = (data) => data) => {
    try {
      const response = await axios.get(url);
      setter(transform(response.data));
    } catch (err) {
      console.error(`Error fetching data from ${url}:`, err);
    }
  };

  useEffect(() => {
    fetchData(`${process.env.REACT_APP_BACKEND_HOST}/devkits/dashboard/fleet/repair`, (data) => {
      setFleetData(data.express21.results.data);
      setLoading(false);
    });

    fetchData(`${process.env.REACT_APP_BACKEND_HOST}/devkits/dashboard/fleet/repair`, (data) => {
      if (data.express21?.results) {
        setRepairData([
          { name: "Reparasi Berat", value: data.express21.results.reparasi_berat },
          { name: "Reparasi Ringan", value: data.express21.results.reparasi_ringan },
        ]);
      }
    });

    fetchData(`${process.env.REACT_APP_BACKEND_HOST}/devkits/dashboard/fleet/status`, (data) => {
      if (data.express21?.results?.data) {
        setStatusData(
          Object.entries(data.express21.results.data)
            .filter(([key]) => ["IN", "OUT", "REPARASI"].includes(key)) // Filter only these statuses
            .map(([key, value]) => ({
              name: key,
              value,
            }))
        );
      }
    });

    fetchData(`${process.env.REACT_APP_BACKEND_HOST}/devkits/dashboard/fleet/city`, (data) => {
      if (data.express21?.results?.data) {
        setCityData(
          Object.entries(data.express21.results.data).map(([key, value]) => ({
            city: key,
            count: value,
          }))
        );
      }
    });
  }, []);

  useEffect(() => {
    setPaginatedData(fleetData.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage));
  }, [currentPage, fleetData]);

  return (
    <div className="p-8 bg-gray-50 min-h-screen">
      <div className="bg-white shadow-lg rounded-xl p-8 max-w-screen-xxl mx-auto">
        
        {/* Header Section */}
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold text-gray-800">Fleet Dashboard</h1>
          <button
            onClick={() => navigate("/Masters/Fleet/Detail")}
            className="bg-blue-700 text-white px-5 py-3 rounded-lg font-semibold hover:bg-blue-800 transition duration-200"
          >
            + Add Fleet Data
          </button>
        </div>

        {/* Charts Section */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
 {/* Pie Chart - Repair */}
<ResponsiveContainer width="100%" height={280}>
  <PieChart>
    <Pie
      data={repairData}
      dataKey="value"
      nameKey="name"
      cx="50%"
      cy="50%"
      outerRadius={80}
      innerRadius={50} // Added to create a donut chart
      label
    >
      {repairData.map((_, index) => (
        <Cell key={index} fill={["#FF5733", "#FFC300"][index]} />
      ))}
    </Pie>
    <Tooltip />
    <Legend /> {/* Added Legend */}
  </PieChart>
</ResponsiveContainer>

{/* Pie Chart - Status */}
<ResponsiveContainer width="100%" height={280}>
  <PieChart>
    <Pie
      data={statusData}
      dataKey="value"
      nameKey="name"
      cx="50%"
      cy="50%"
      outerRadius={80}
      innerRadius={50} // Creates a donut chart
      label
    >
      {statusData.map((_, index) => (
        <Cell
          key={index}
          fill={["#FF5733", "#FFC300", "#0088FE", "#00C49F", "#FFBB28", "#A833FF", "#FF3380"][index % 7]} 
        />
      ))}
    </Pie>
    <Tooltip />
    <Legend /> {/* Added Legend */}
  </PieChart>
</ResponsiveContainer>

{/* Bar Chart - Fleet Position */}
<ResponsiveContainer width="100%" height={280}>
  <BarChart data={cityData}>
    <CartesianGrid strokeDasharray="3 3" />
    <XAxis 
      dataKey="city" 
      tick={{ fontSize: 10, angle: -45, textAnchor: "end" }} 
      interval={0} 
    />
    <YAxis />
    <Tooltip />
    <Legend /> {/* Already present, but keeping it here for consistency */}
    <Bar dataKey="count" fill="#82ca9d" barSize={25} />
  </BarChart>
</ResponsiveContainer>

        </div>  

        {/* Fleet Table */}
        <div className="overflow-x-auto">
          <table className="min-w-full border-collapse shadow-md">
            <thead>
              <tr className="bg-gray-100 text-gray-700 uppercase text-md border-b">
                <th className="py-4 px-6 text-left">Plate Number</th>
                <th className="py-4 px-6 text-left">Status</th>
                <th className="py-4 px-6 text-left">Note</th>
              </tr>
            </thead>  
            <tbody className="text-gray-700 text-md">
              {paginatedData.map((fleet) => (
                <tr key={fleet.id} className="border-b border-gray-300 hover:bg-gray-100 transition duration-200">
                  <td className="py-4 px-6">{fleet.plat_number}</td>
                  <td className="py-4 px-6">{fleet.status || "N/A"}</td>
                  <td className="py-4 px-6">{fleet.note || "N/A"}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>


      </div>
    </div>
  );
};

export default FleetTable;
