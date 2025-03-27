import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import moment from 'moment';

const ResiDetails = () => {
  const { code, resi } = useParams();
  const [trackingData, setTrackingData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchTrackingData = async () => {
      setLoading(true);
      try {
        const token = localStorage.getItem("token");
        if (!token) throw new Error("Authentication token is missing.");

        const trackingResponse = await axios.get(
          `https://partner-api.21express.co.id/siscos/tracking/multitrack?resi_no=${resi}`,
          {
            headers: {
              Authorization: `Basic ${token}`,
            },
          }
        );
        setTrackingData(trackingResponse.data.express21.results.data[0]);
      } catch (err) {
        console.error("Failed to fetch tracking data:", err.message);
        setError(err.response?.data?.message || "Server error occurred");
      } finally {
        setLoading(false);
      }
    };
    fetchTrackingData();
  }, [resi]);

  if (loading) return <p className="text-center text-gray-500">Loading tracking data...</p>;
  if (error) return <p className="text-center text-red-500">{error}</p>;

    return (
      <div className="p-6">
        <h1 className="text-2xl text-black font-bold mb-6">Tracking Details for Resi: {resi}</h1>
        {trackingData ? (
          <div className="flex flex-col lg:flex-row gap-6">
            {/* Tracking Details */}
            <div className="card bg-white p-3 rounded shadow-md lg:w-1/2">
  <div className="card-body h-96 p-2 overflow-auto">
    <table className="w-full">
      <tbody className="space-y-4">
        <tr className="py-2">
          <td className="w-1/2 text-black border-r text-lg">Tanggal Pengiriman</td>
          <td className="text-right text-black font-medium text-lg">
            {moment.utc(trackingData.tracking_status_detail.at(-1)?.dateprocess).format('YYYY-MM-DD HH:mm')}
          </td>
        </tr>
        <tr className="py-2">
          <td className="w-1/2 text-black border-r text-lg">Pengirim</td>
          <td className="text-right text-black font-medium text-lg">{trackingData.resi_info[0]?.shipper_name}</td>
        </tr>
        <tr className="py-2">
          <td className="w-1/2 text-black border-r text-lg">Penerima</td>
          <td className="text-right text-black font-medium text-lg">{trackingData.resi_info[0]?.consignee_name}</td>
        </tr>
        <tr className="py-2">
          <td className="w-1/2 text-black border-r text-lg">Tanggal Status</td>
          <td className="text-right text-black font-medium text-lg">
            {moment.utc(trackingData.tracking_status_detail[0]?.dateprocess).format('YYYY-MM-DD HH:mm')}
          </td>
        </tr>
        <tr className="py-2">
          <td className="w-1/2 text-black border-r text-lg">Asal</td>
          <td className="text-right text-black font-medium text-lg">{trackingData.shipment_detail?.origin_city}</td>
        </tr>
        <tr className="py-2">
          <td className="w-1/2 text-black border-r text-lg">Tujuan</td>
          <td className="text-right text-black font-medium text-lg">{trackingData.shipment_detail?.dest_city}</td>
        </tr>
        <tr className="py-2">
          <td className="w-1/2 text-black border-r text-lg">Layanan</td>
          <td className="text-right text-black font-medium text-lg">{trackingData.resi_info[0]?.service_type}</td>
        </tr>
        <tr className="py-2">
          <td className="w-1/2 text-black border-r text-lg">Berat Paket</td>
          <td className="text-right text-black font-medium text-lg">{trackingData.shipment_detail?.ttl_chargeable_weight} Kg</td>
        </tr>
      </tbody>
    </table>
  </div>
</div>

    
            {/* Package Trip */}
            <div className="lg:w-1/2 flex flex-col p-2">
              <div className="card bg-white p-3 shadow-md rounded">
                <label className="font-medium text-black">Package Trip</label>
                <div className="card-body m-4">
                  {trackingData ? (
                    <ol className="relative w-full border-l-4 border-gray-700 ml-5">
                      {trackingData.tracking_status_detail.map((td, idx) => {
                        let timestamp = moment.utc(td.dateprocess);
                        return (
                          <li className="mb-10 ml-6 w-full float-none" key={idx}>
                            <span className="flex absolute -left-[20px] justify-center items-center w-9 h-9 rounded-full bg-white">
                              {td.status === "RECEIVED" ? (
                                <svg width="30px" height="30px" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 448 512">
                                  <path d="M50.7 58.5L0 160H208V32H93.7C75.5 32 58.9 42.3 50.7 58.5zM240 160H448L397.3 58.5C389.1 42.3 372.5 32 354.3 32H240V160zm208 32H0V416c0 35.3 28.7 64 64 64H384c35.3 0 64-28.7 64-64V192z" />
                                </svg>
                              ) : (
                                <svg width="30px" height="30px" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512">
                                  <path d="M256 0a256 256 0 1 1 0 512A256 256 0 1 1 256 0zM232 120V256c0 8 4 15.5 10.7 20l96 64c11 7.4 25.9 4.4 33.3-6.7s4.4-25.9-6.7-33.3L280 243.2V120c0-13.3-10.7-24-24-24s-24 10.7-24 24z" />
                                </svg>
                              )}
                            </span>
                            <h3 className="flex items-center mr-5 mb-1 text-lg font-semibold text-gray-900 text-black">
                              {timestamp.format("DD - MMMM - YYYY | HH:mm")}
                              {td.first && (
                                <span className="bg-blue-100 text-blue-800 text-sm font-medium mr-6 px-2.5 py-0.5 rounded bg-blue-200 text-blue-800 ml-3">
                                  Latest
                                </span>
                              )}
                            </h3>
                            <p className="mb-4 mr-6 text-base font-normal text-gray-500 text-gray-400">
                              {td.status}
                            </p>
                          </li>
                        );
                      })}
                    </ol>
                  ) : (
                    <p className="text-center text-gray-500">No tracking data found.</p>
                  )}
                </div>
              </div>
            </div>
          </div>
        ) : (
          <p className="text-center text-gray-500">No tracking data found.</p>
        )}
      </div>
    );
  }
    

export default ResiDetails;
