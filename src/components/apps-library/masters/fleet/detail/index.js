import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate, useParams } from "react-router-dom";

const FleetDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    plat_number: "",
    vehicletype: "",
    branch_name: "",
    driver: "",
    status_id: "",
    bpkb_date: "",
    destination: "",
    kir_date: "",
    note: "",
    ownershiptype: "",
    volume_capacity: "",
    weight_capacity: "",
  });

  const [vehicleTypes, setVehicleTypes] = useState([]);
  const [ownershipTypes, setOwnershipTypes] = useState([]);
  const [branches, setBranches] = useState([]); // Store branch data
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [successMessage, setSuccessMessage] = useState("");

  const formatDate = (dateString) => {
    if (!dateString) return "";
    return new Date(dateString).toISOString().split("T")[0];
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [vehicleResponse, ownershipResponse, branchResponse] = await Promise.all([
          axios.get(`${process.env.REACT_APP_BACKEND_HOST}/masters/vehicletype`),
          axios.get(`${process.env.REACT_APP_BACKEND_HOST}/masters/ownershiptype`),
          axios.get("https://partner-api.21express.co.id/masters/branch"), // Fetch branch data
        ]);
    
        setVehicleTypes(vehicleResponse.data.express21.results.data);
        setOwnershipTypes(ownershipResponse.data.express21.results.data);
        setBranches(branchResponse.data.express21.results.data); // Set branch data
      } catch (err) {
        console.error("Failed to fetch data:", err);
      }
    };
    

    fetchData();
  }, []);

  useEffect(() => {
    if (id && id !== ":id") {
      const fetchFleetDetail = async () => {
        try {
          const token = localStorage.getItem("token");
          const response = await axios.get(
            `${process.env.REACT_APP_BACKEND_HOST}/masters/fleet?filter_by_col=id&filter_by_text=${id}`,
            { headers: { Authorization: `Basic ${token}` } }
          );

          if (response.data.express21.results.data.length > 0) {
            const fleetData = response.data.express21.results.data[0];
            const { in_time, out_time, ...filteredData } = fleetData;

            setFormData({
              ...filteredData,
              bpkb_date: formatDate(fleetData.bpkb_date),
              kir_date: formatDate(fleetData.kir_date),
            });
          } else {
            setError("Fleet not found.");
          }
        } catch (err) {
          setError("Failed to fetch fleet details.");
        } finally {
          setLoading(false);
        }
      };

      fetchFleetDetail();
    } else {
      setLoading(false);
    }
  }, [id]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleSave = async (e) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem("token");
      const updatedData = {
        ...formData,
        bpkb_date: formData.bpkb_date || null,
        kir_date: formData.kir_date || null,
      };

      if (id) {
        await axios.put(
          `${process.env.REACT_APP_BACKEND_HOST}/masters/fleet`,
          updatedData,
          { headers: { Authorization: `Basic ${token}` } }
        );
      } else {
        await axios.post(
          `${process.env.REACT_APP_BACKEND_HOST}/masters/fleet`,
          updatedData,
          { headers: { Authorization: `Basic ${token}` } }
        );
      }

      setSuccessMessage("Fleet data saved successfully!");
      setTimeout(() => setSuccessMessage(""), 3000);
    } catch (err) {
      setError("Failed to save fleet data.");
    }
  };

  const fieldOrder = [
    { key: "plat_number", label: "Plat Number" },
    { key: "vehicletype", label: "Vehicle Type", type: "select", options: vehicleTypes },
    { key: "branch_name", label: "Branch Name", type: "select", options: branches },
    { key: "driver", label: "Driver" },
    { key: "status_id", label: "Status" },
    { key: "bpkb_date", label: "BPBK Date", type: "date" },
    { key: "destination", label: "Destination" },
    { key: "kir_date", label: "KIR Date", type: "date" },
    { key: "note", label: "Note" },
    { key: "ownershiptype", label: "Ownership Type", type: "select", options: ownershipTypes },
    { key: "volume_capacity", label: "Volume Capacity" },
    { key: "weight_capacity", label: "Weight Capacity" },
  ];

  return (
    <div className="p-6 bg-gray-100 min-h-screen">
      <div className="bg-white shadow-lg rounded-lg p-6 max-w-screen-xl mx-auto">
        <h1 className="text-3xl font-bold text-gray-800">
          {id ? "Edit Fleet" : "Add Fleet"}
        </h1>

        {error && <p className="text-red-500">{error}</p>}
        {successMessage && (
          <div className="bg-green-500 text-white p-3 rounded-md my-3 text-center">
            {successMessage}
          </div>
        )}

        {loading ? (
          <p className="text-gray-500">Loading data...</p>
        ) : (
          <form onSubmit={handleSave} className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {fieldOrder.map(({ key, label, type, options }) => (
              <div key={key}>
                <label className="block text-gray-700">{label}</label>
                {type === "select" ? (
                  <select
                    name={key}
                    value={formData[key] || ""}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 text-black border rounded-md"
                  >
                    <option value="">Select {label}</option>
                    {options.map((option) => (
                      <option key={option.id} value={option.name}>
                        {option.name}
                      </option>
                    ))}
                  </select>
                ) : (
                  <input
                    type={type === "date" ? "date" : "text"}
                    name={key}
                    value={formData[key] || ""}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 text-black border rounded-md"
                  />
                )}
              </div>
            ))}

            <div className="col-span-2 flex justify-end">
              <button
                type="submit"
                className="bg-blue-600 text-white px-6 py-2 rounded-lg font-semibold hover:bg-blue-700 transition-all duration-150"
              >
                Save
              </button>
              <button
                type="button"
                onClick={() => navigate("/Master/Fleet")}
                className="ml-2 bg-gray-500 text-white px-6 py-2 rounded-lg font-semibold hover:bg-gray-600 transition-all duration-150"
              >
                Cancel
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
};

export default FleetDetail;
