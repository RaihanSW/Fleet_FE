import React, { useState, useEffect, useRef } from "react";
import axios from "axios";
import { AnimatePresence, motion } from "framer-motion";

const formatDateTime = (datetime) => {
  const dateObj = new Date(datetime);
  const tanggal = dateObj.toLocaleDateString("en-GB", {
    day: "2-digit",
    month: "short",
    year: "numeric",
    timeZone: "UTC",
  });
  const jam = dateObj.toLocaleTimeString("en-GB", {
    hour: "2-digit",
    minute: "2-digit",
    hour12: false,
    timeZone: "UTC",
  });
  return { tanggal, jam };
};

const FleetTable = () => {
  const [fleetData, setFleetData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [filter, setFilter] = useState("");
  const [branchFilter, setBranchFilter] = useState("21 Express Pulogadung");
  const [branchKeyword, setBranchKeyword] = useState("");
  const [branchData, setBranchData] = useState([]);
  const [suggestions, setSuggestions] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;
  const autoscrollInterval = 30;
  const timerRef = useRef(null);
  const animationRef = useRef(null);

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
    if (currentPage === 1 && branchFilter) {
      fetchFleetData();
    }
  }, [currentPage, branchFilter]);


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
    if (currentPage < totalPages) {
      setCurrentPage(currentPage + 1);
      resetTimer();
    }
  };

  const handlePrevPage = () => {
    if (currentPage > 1) {
      setCurrentPage(currentPage - 1);
      resetTimer();
    }
  };

  const resetTimer = () => {
    if (timerRef.current) clearInterval(timerRef.current);
    if (animationRef.current) cancelAnimationFrame(animationRef.current);
    
    timerRef.current = setInterval(() => {
      setCurrentPage((prevPage) => {
        const nextPage = prevPage + 1;
        return nextPage > totalPages ? 1 : nextPage;
      });
    }, autoscrollInterval * 1000);
  };

  useEffect(() => {
    resetTimer();
    
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
      if (animationRef.current) cancelAnimationFrame(animationRef.current);
    };
  }, [filteredData.length, totalPages]);
  
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
                  <th className="py-3 px-6 text-center">Plat Number</th>
                  <th className="py-3 px-6 text-center">Waktu IN</th>
                  <th className="py-3 px-6 text-center">Waktu OUT</th>
                  <th className="py-3 px-6 text-center">Status</th>
                  <th className="py-3 px-6 text-center">Driver</th>
                  <th className="py-3 px-6 text-center">Tujuan</th>
                  <th className="py-3 px-6 text-center">Note</th>
                </tr>
              </thead>

              <AnimatePresence mode="sync">
                <motion.tbody
                  key={currentPage}
                  className="text-gray-600 text-sm font-light"
                  initial={{ opacity: 0, x: 100 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -100 }}
                  transition={{ duration: 0.5 }}
                >
                  {currentData.map((fleet, index) => (
                    <motion.tr 
                      key={fleet.id} 
                      className="border-b border-gray-200 hover:bg-gray-100"
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: index * 0.05, duration: 0.3 }}
                    >
                      <td className="py-3 px-6 text-center font-bold">{fleet.plat_number}</td>
                      <td className="py-3 px-6 text-center">
                        {fleet.in_time ? (() => {
                          const { tanggal, jam } = formatDateTime(fleet.in_time);
                          return (
                            <div>
                              <div className="text-sm font-bold">{tanggal}</div>
                              <div className="text-lg font-bold">{jam}</div>
                            </div>
                          );
                        })() : ""}
                      </td>
                      <td className="py-3 px-6 text-center">
                        {fleet.out_time ? (() => {
                          const { tanggal, jam } = formatDateTime(fleet.out_time);
                          return (
                            <div>
                              <div className="text-sm font-bold">{tanggal}</div>
                              <div className="text-lg font-bold">{jam}</div>
                            </div>
                          );
                        })() : ""}
                      </td>
                      <td className="py-3 px-6 text-center font-bold">{fleet.status_id}</td>
                      <td className="py-3 px-6 text-center font-bold">{fleet.driver}</td>
                      <td className="py-3 px-6 text-center font-bold">{fleet.destination}</td>
                      <td className="py-3 px-6 text-center font-bold">{fleet.note}</td>
                    </motion.tr>
                  ))}
                </motion.tbody>
              </AnimatePresence>
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
