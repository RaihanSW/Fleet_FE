  import React, { useState, useEffect } from "react";
  import axios from "axios";
  import { useNavigate } from "react-router-dom";

  const FleetTable = () => {
    const [fleetData, setFleetData] = useState([]);
    const [filteredData, setFilteredData] = useState([]);
    const [searchTerm, setSearchTerm] = useState("");
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");
    const [currentPage, setCurrentPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const itemsPerPage = 10;
    const navigate = useNavigate();

    useEffect(() => {
      const fetchFleetData = async () => {
        try {
          const response = await axios.get(`${process.env.REACT_APP_BACKEND_HOST}/masters/fleet`);
          const fetchedData = response.data.express21.results.data;
          setFleetData(fetchedData);
          setFilteredData(fetchedData);
          setTotalPages(Math.ceil(fetchedData.length / itemsPerPage));
          setLoading(false);
        } catch (err) {
          setError("Failed to fetch data. Please try again later.");
          setLoading(false);
        }
      };

      fetchFleetData();
    }, []);

    const handleSearchChange = (event) => {
      setSearchTerm(event.target.value);
    };

    const handleSearch = () => {
      const lowerCaseTerm = searchTerm.toLowerCase();
      const filtered = fleetData.filter((fleet) =>
        fleet.plat_number.toLowerCase().includes(lowerCaseTerm) ||
        fleet.vehicletype.toLowerCase().includes(lowerCaseTerm) ||
        fleet.branch_name.toLowerCase().includes(lowerCaseTerm) ||
        fleet.driver.toLowerCase().includes(lowerCaseTerm)
      );
      setFilteredData(filtered);
      setCurrentPage(1);
      setTotalPages(Math.ceil(filtered.length / itemsPerPage));
    };

    const handlePrevPage = () => {
      if (currentPage > 1) setCurrentPage(currentPage - 1);
    };

    const handleNextPage = () => {
      if (currentPage < totalPages) setCurrentPage(currentPage + 1);
    };

    const indexOfLastItem = currentPage * itemsPerPage;
    const indexOfFirstItem = indexOfLastItem - itemsPerPage;
    const currentItems = filteredData.slice(indexOfFirstItem, indexOfLastItem);

    return (
      <div className="p-6 bg-gray-100 min-h-screen">
        <div className="bg-white shadow-lg rounded-lg p-6 max-w-screen-xl mx-auto">
          <div className="flex justify-between items-center mb-6">
            <h1 className="text-3xl font-bold text-gray-800">Fleet List</h1>
            <button
            onClick={() => navigate("/Master/Fleet/Detail/:id")}
            className="bg-blue-600 text-white px-4 py-2 rounded-lg font-semibold hover:bg-blue-700 transition-all duration-150 ml-4"
          >
            + Add Fleet Data
          </button>

          </div>

          {/* Search Input */}
          <div className="flex items-center mb-4">
            <input
              type="text"
              placeholder="Search fleet..."
              value={searchTerm}
              onChange={handleSearchChange}
              className="border border-gray-300 text-black rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <button
              onClick={handleSearch}
              className="ml-2 bg-blue-600 px-4 py-2 rounded-lg font-semibold hover:bg-blue-700 transition-all duration-150"
            >
              Search
            </button>
          </div>

          {loading ? (
            <p className="text-gray-500">Loading data...</p>
          ) : error ? (
            <p className="text-red-500">{error}</p>
          ) : (
            <>
              <div className="overflow-x-auto">
                <table className="min-w-full table-auto border-collapse">
                  <thead>
                    <tr className="bg-gray-200 text-gray-600 uppercase text-sm leading-normal">
                      <th className="py-3 px-6 text-left">Plat Number</th>
                      <th className="py-3 px-6 text-left">Vehicle Type</th>
                      <th className="py-3 px-6 text-left">Branch Name</th>
                      <th className="py-3 px-6 text-left">Driver</th>
                      <th className="py-3 px-6 text-left">Status</th>
                      <th className="py-3 px-6 text-left">BPBK Date</th>
                      <th className="py-3 px-6 text-left">Destination</th>
                      <th className="py-3 px-6 text-left">KIR Date</th>
                      <th className="py-3 px-6 text-left">Note</th>
                      <th className="py-3 px-6 text-left">Ownership Type</th>
                      <th className="py-3 px-6 text-left">Volume Capacity</th>
                      <th className="py-3 px-6 text-left">Weight Capacity</th>
                    </tr>
                  </thead>
                  <tbody className="text-gray-600 text-sm font-light">
                    {currentItems.map((fleet) => (
                      <tr
                        key={fleet.id}
                        className="border-b border-gray-200 hover:bg-gray-100 cursor-pointer"
                        onClick={() => navigate(`/Master/Fleet/Detail/${fleet.id}`)}  // Pass the ID in the URL
                      >
                        <td className="py-3 px-6 text-left whitespace-nowrap">{fleet.plat_number}</td>
                        <td className="py-3 px-6 text-left">{fleet.vehicletype}</td>
                        <td className="py-3 px-6 text-left">{fleet.branch_name}</td>
                        <td className="py-3 px-6 text-left">{fleet.driver}</td>
                        <td className="py-3 px-6 text-left">{fleet.status_id}</td>
                        <td className="py-3 px-6 text-left">{fleet.bpkb_date}</td>
                        <td className="py-3 px-6 text-left">{fleet.destination}</td>
                        <td className="py-3 px-6 text-left">{fleet.kir_date}</td>
                        <td className="py-3 px-6 text-left">{fleet.note}</td>
                        <td className="py-3 px-6 text-left">{fleet.ownershiptype}</td>
                        <td className="py-3 px-6 text-left">{fleet.volume_capacity}</td>
                        <td className="py-3 px-6 text-left">{fleet.weight_capacity}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

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
            </>
          )}
        </div>
      </div>
    );
  };

  export default FleetTable;
