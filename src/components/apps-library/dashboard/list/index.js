import React, { useState, useEffect } from "react";
import axios from "axios";

const FleetTable = () => {
  const [fleetData, setFleetData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [filter, setFilter] = useState("");
  const [branchFilter, setBranchFilter] = useState("");
  const [branchKeyword, setBranchKeyword] = useState("");
  const [branchData, setBranchData] = useState([]);
  const [suggestions, setSuggestions] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  useEffect(() => {
    if (!branchKeyword || branchKeyword.length < 3) {
      setSuggestions([]);
      return;
    }
    
    const fetchBranchData = async () => {
      try {
        const response = await axios.get(
          `https://partner-api.21express.co.id/masters/branch?keywords=${branchKeyword}`
        );
        setSuggestions(response.data.express21.results.data || []);
      } catch (err) {
        setError("Failed to fetch branch data.");
      }
    };

    fetchBranchData();
  }, [branchKeyword]);

  useEffect(() => {
    if (!branchFilter) return;

    const fetchFleetData = async () => {
      setLoading(true);
      try {
        const response = await axios.get(
          `${process.env.REACT_APP_BACKEND_HOST}/masters/fleet?filter_by_col=branch_name&filter_by_text=${branchFilter}`
        );
        setFleetData(response.data.express21.results.data || []);
        setCurrentPage(1);
      } catch (err) {
        setError("Failed to fetch fleet data.");
      } finally {
        setLoading(false);
      }
    };

    fetchFleetData();
  }, [branchFilter]);

  const handleSuggestionClick = (branch) => {
    setSuggestions([]);
    setBranchKeyword(branch.name);
    setBranchFilter(branch.name);
    setBranchData([branch]);
  };

  const filteredData = fleetData.filter((fleet) =>
    fleet.plat_number.toLowerCase().includes(filter.toLowerCase())
  );

  const totalPages = Math.ceil(filteredData.length / itemsPerPage);
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentData = filteredData.slice(indexOfFirstItem, indexOfLastItem);

  const handleNextPage = () => {
    if (currentPage < totalPages) setCurrentPage(currentPage + 1);
  };

  const handlePrevPage = () => {
    if (currentPage > 1) setCurrentPage(currentPage - 1);
  };

  return (
    <div className="p-6 bg-gray-100 min-h-screen">
      <div className="bg-white shadow-lg rounded-lg p-6 max-w-screen-xxl mx-auto">
        <div className="flex items-center justify-between mt-4">
          <h1 className="text-3xl font-bold text-gray-800">Fleet List - {branchFilter}</h1>
          <div className="relative w-64">
            <input
              type="text"
              placeholder="Enter Branch Keyword"
              value={branchKeyword}
              onChange={(e) => setBranchKeyword(e.target.value)}
              className="p-2 text-black border border-gray-300 rounded-lg w-full"
            />
            {suggestions.length > 0 && (
              <div className="absolute left-0 w-full bg-white text-black border border-gray-300 rounded-lg mt-1 z-10">
                {suggestions.map((branch) => (
                  <div
                    key={branch.id}
                    className="p-2 cursor-pointer hover:bg-gray-200"
                    onClick={() => handleSuggestionClick(branch)}
                  >
                    {branch.name}
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {loading ? (
          <p className="text-gray-500 mt-4">Loading data...</p>
        ) : error ? (
          <p className="text-red-500 mt-4">{error}</p>
        ) : (
          <div className="overflow-x-auto mt-4">
            <table className="min-w-full table-auto border-collapse">
              <thead>
                <tr className="bg-gray-200 text-gray-600 uppercase text-sm leading-normal">
                  <th className="py-3 px-6 text-left">Plat Number</th>
                  <th className="py-3 px-6 text-left">Waktu IN</th>
                  <th className="py-3 px-6 text-left">Waktu OUT</th>
                  <th className="py-3 px-6 text-left">Status</th>
                  <th className="py-3 px-6 text-left">Driver</th>
                  <th className="py-3 px-6 text-left">Tujuan</th>
                  <th className="py-3 px-6 text-left">Note</th>
                </tr>
              </thead>
              <tbody className="text-gray-600 text-sm font-light">
                {currentData.map((fleet) => (
                  <tr key={fleet.id} className="border-b border-gray-200 hover:bg-gray-100">
                    <td className="py-3 px-6 text-left">{fleet.plat_number}</td>
                    <td className="py-3 px-6 text-left">{fleet.in_time}</td>
                    <td className="py-3 px-6 text-left">{fleet.out_time}</td>
                    <td className="py-3 px-6 text-left">{fleet.status_id}</td>
                    <td className="py-3 px-6 text-left">{fleet.driver}</td>
                    <td className="py-3 px-6 text-left">{fleet.destination}</td>
                    <td className="py-3 px-6 text-left">{fleet.note}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        <div className="flex justify-between items-center mt-4">
          <button
            onClick={handlePrevPage}
            disabled={currentPage === 1}
            className={`px-4 py-2 bg-gray-300 rounded ${currentPage === 1 ? "cursor-not-allowed opacity-50" : "hover:bg-gray-400"}`}
          >
            Previous
          </button>
          <p className="text-sm text-gray-700">Page {currentPage} of {totalPages}</p>
          <button
            onClick={handleNextPage}
            disabled={currentPage === totalPages}
            className={`px-4 py-2 bg-gray-300 rounded ${currentPage === totalPages ? "cursor-not-allowed opacity-50" : "hover:bg-gray-400"}`}
          >
            Next
          </button>
        </div>
      </div>
    </div>
  );
};

export default FleetTable;
