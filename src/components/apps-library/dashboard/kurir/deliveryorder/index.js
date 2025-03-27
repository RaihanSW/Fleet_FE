import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";

const DeliveryDetails = () => {
  const { code } = useParams();
  const navigate = useNavigate();
  const [deliveryDetails, setDeliveryDetails] = useState([]);
  const [filteredDetails, setFilteredDetails] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  useEffect(() => {
    const fetchDeliveryDetails = async () => {
      try {
        const token = localStorage.getItem("token");
        if (!token) throw new Error("Authentication token is missing.");

        const response = await axios.get(
          `${process.env.REACT_APP_BACKEND_HOST}/siscos/deliverylist?code=${code}`,
          {
            headers: {
              Authorization: `Basic ${token}`,
            },
          }
        );


        // disini perlu ada gabungan antara received data dan unreceived data
        const receivedData = response.data.express21.results.received_data || [];
        const unreceivedData = response.data.express21.results.unreceived_data || [];
        const allData = [...receivedData, ...unreceivedData];

        setDeliveryDetails(allData);        
        setFilteredDetails(allData);
        setLoading(false);
      } catch (err) {
        console.error(err.message || "Failed to fetch delivery details.");
        setError(err.message);
        setLoading(false);
      }
    };

    fetchDeliveryDetails();
  }, [code]);

  const handleSearch = (e) => {
    const query = e.target.value.toLowerCase();
    setSearchQuery(query);

    const filtered = deliveryDetails.filter((shipment) =>
      shipment.shipment_code.toLowerCase().includes(query)
    );
    setFilteredDetails(filtered);
    setCurrentPage(1);
  };

  const handleRowClick = (shipmentCode) => {
    navigate(`/Dashboard/Kurir/ListDo/${code}/resi/${shipmentCode}`);
  };

  const totalPages = Math.ceil(filteredDetails.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const paginatedDetails = filteredDetails.slice(startIndex, startIndex + itemsPerPage);

  const handlePrevPage = () => {
    if (currentPage > 1) setCurrentPage(currentPage - 1);
  };

  const handleNextPage = () => {
    if (currentPage < totalPages) setCurrentPage(currentPage + 1);
  };

  if (loading) return <p className="text-center text-gray-500">Loading delivery details...</p>;
  if (error) return <p className="text-center text-red-500">{error}</p>;

  return (
    <div className="p-6">
      <h1 className="text-2xl text-black font-bold mb-6">Delivery Details for Code: {code}</h1>

      <div className="mb-6">
        <input
          type="text"
          placeholder="Search by Nomor Resi..."
          value={searchQuery}
          onChange={handleSearch}  
          className="w-full md:w-1/3 p-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
      </div>

      {paginatedDetails.length > 0 ? (
        <div className="bg-white p-4 rounded-lg shadow-lg">
          <div className="overflow-x-auto">
            <table className="min-w-full bg-white border border-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-4 py-2 text-left text-sm font-medium text-gray-500 uppercase">No</th>
                  <th className="px-4 py-2 text-left text-sm font-medium text-gray-500 uppercase">Nomor Resi</th>
                  <th className="px-4 py-2 text-left text-sm font-medium text-gray-500 uppercase">Status</th>
                </tr>
              </thead>
              <tbody>
                {paginatedDetails.map((shipment, index) => (
                  <tr
                    key={index}
                    className="hover:bg-gray-50 cursor-pointer"
                    onClick={() => handleRowClick(shipment.shipment_code)}
                  >
                    <td className="px-4 py-2 text-sm text-gray-700 border-t">{startIndex + index + 1}</td>
                    <td className="px-4 py-2 text-sm text-gray-700 border-t">{shipment.shipment_code}</td>
                    <td className="px-4 py-2 text-sm border-t">
                      <span
                        className={`px-2 py-1 rounded-full text-xs font-semibold ${
                          shipment.tracking_status == "RECEIVED"
                            ? "bg-green-100 text-green-700"
                            : "bg-red-100 text-red-700"
                        }`}
                      >
                        {shipment.tracking_status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      ) : (
        <p className="text-center text-gray-500">No shipment details found for this delivery.</p>
      )}

      <div className="flex justify-between items-center mt-4">
        <button
          onClick={handlePrevPage}
          disabled={currentPage === 1}
          className={`px-4 py-2 bg-gray-300 rounded ${
            currentPage === 1 ? "cursor-not-allowed opacity-50" : "hover:bg-gray-400"
          }`}
        >
          Previous
        </button>
        <p className="text-sm text-gray-700">
          Page {currentPage} of {totalPages}
        </p>
        <button
          onClick={handleNextPage}
          disabled={currentPage === totalPages}
          className={`px-4 py-2 bg-gray-300 rounded ${
            currentPage === totalPages ? "cursor-not-allowed opacity-50" : "hover:bg-gray-400"
          }`}
        >
          Next
        </button>
      </div>
    </div>
  );
};

export default DeliveryDetails;