import React, { useState, useEffect } from "react";
import { Line, Bar, Pie } from "react-chartjs-2";
import axios from "axios";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ArcElement,
} from "chart.js";    
//test
ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement, 
  BarElement,
  Title,
  Tooltip,
  Legend,
  ArcElement
);

const Dashboard = () => {
  const [lineChartData, setLineChartData] = useState(null);
  const [barChartData, setBarChartData] = useState(null);
  const [pieChartData, setPieChartData] = useState(null);
  const [fleetData, setFleetData] = useState([]); // New state for fleet data
  const [loading, setLoading] = useState(true);
  const [darkMode, setDarkMode] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [account, setAccount] = useState('');
  const [user, setUser] = useState([])

  const [error, setError] = useState(null);

  const toggleTheme = () => setDarkMode(!darkMode);
  const toggleMenu = () => setMenuOpen(!menuOpen);

  const handleLogout = () => {
    localStorage.removeItem("account");
    localStorage.removeItem("token");
    window.location.href = "/";
  };

  const storedAccount = JSON.parse(localStorage.getItem('account'));
  const storedToken = localStorage.getItem('token');

  useEffect(() => {
    const fetchAPIData = async (url) => {
      const response = await fetch(url);
      if (!response.ok) throw new Error("Failed to fetch data");
      return response.json();
    };
    
    const loadChartData = async () => {
      try {
        const [coinData, bitcoinData, fleetResponse] = await Promise.all([
          fetchAPIData("https://api.coingecko.com/api/v3/coins/markets?vs_currency=usd"),
          fetchAPIData("https://api.coingecko.com/api/v3/coins/bitcoin/market_chart?vs_currency=usd&days=7"),
          fetchAPIData(`${process.env.REACT_APP_BACKEND_HOST}/masters/fleet`), // Fetch fleet data
        ]);

        // Process fleet data
        setFleetData(fleetResponse.express21.results.data); // Set fleet data

        setLineChartData({
          labels: bitcoinData.prices.map((price) =>
            new Date(price[0]).toLocaleDateString()
          ),
          datasets: [
            {
              label: "Bitcoin Price",
              data: bitcoinData.prices.map((price) => price[1]),
              borderColor: "#4B89DC",
              backgroundColor: "rgba(75, 137, 220, 0.1)",
              borderWidth: 2,
              pointRadius: 0,
            },
          ],
        });
        setBarChartData({
          labels: coinData.map((coin) => coin.name),
          datasets: [
            {
              label: "Price (USD)",
              data: coinData.map((coin) => coin.current_price),
              backgroundColor: "#FFB04C",
              borderColor: "#FFA02B",
              borderWidth: 1,
            },
          ],
        });
        setPieChartData({
          labels: coinData.map((coin) => coin.name),
          datasets: [
            {
              label: "Market Share",
              data: coinData.map((coin) => coin.current_price),
              backgroundColor: [
                "#FF6384",
                "#36A2EB",
                "#FFCE56",
                "#4BC0C0",
                "#9966FF",
              ],
              borderColor: "#fff",
              borderWidth: 1,
            },
          ],
        });
      } catch (error) {
        console.error("Error loading chart data:", error);
      } finally {
        setLoading(false);
      }
    };

    loadChartData();

    
    // if (storedAccount) {
    //     setAccount(storedAccount);
    // }
    
    handleUserDetail();
  }, []);

  const handleUserDetail = () => {
    // var params = `asal=${selectedOrigin.id}&tujuan=${selectedKecamatan.id}&berat=${berat}&p=${panjang}&l=${lebar}&t=${tinggi}&inpKota=${selectedOrigin.name}&inpKecamatan=${selectedKecamatan.name}&cityDest=${selectedKecamatan.city_name}`
    const urls = `${process.env.REACT_APP_BACKEND_HOST}/users/account/info`
    axios.get(urls, {
      headers: {
        'Authorization': `Basic ${storedToken}`, // Example header
        // Set content type if needed
        // Add other headers here as needed
    }
    }).then(res => {
           setUser(res.data.express21.results.data);
           console.log(user)
           if (res.data.express21.results.data){
             console.log('awoowooo')
           } else {
              setError('Tarif Belum Tersedia')
           }
           // setSearchParams(params);
           setLoading(false);
     },
     (error) => {
           setError(error.message)
           setLoading(false);
     })
}

  return (
    <div
      className={`${darkMode ? "bg-gray-900 text-white" : "bg-gray-100 text-gray-800"} 
      min-h-screen flex`}
    >
      {/* Sidebar */}
      <aside
        className={`fixed top-0 left-0 h-full ${menuOpen ? "w-52" : "w-16"} 
        ${darkMode ? "bg-gray-800" : "bg-blue-800 shadow-lg"} 
        transition-all duration-300 p-4 flex flex-col items-center space-y-4 border-r border-gray-200`}
      >
        <button onClick={toggleMenu} className="text-gray-600 hover:text-gray-400 focus:outline-none">
          <svg
            className="w-6 h-6"
            fill="none"
            stroke="white"
            viewBox="0 0 24 24"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M4 6h16M4 12h16M4 18h16"
            />
          </svg>
        </button>
        {menuOpen && (
          <>
            <a href="#dashboard" className="text-sm font-medium text-white hover:text-gray-300">
              Dashboard
            </a>
            <a href="/userpagetest" className="text-sm font-medium text-white hover:text-gray-300">
              user
            </a>
            <a href="#analytics" className="text-sm font-medium text-white hover:text-gray-300">
              Analytics
            </a>
            <a href="#settings" className="text-sm font-medium text-white hover:text-gray-300">
              Settings
            </a>
            <button
              onClick={handleLogout}
              className="text-sm bg-red-600 p-1 rounded-md text-white hover:bg-red-500 mt-4"
            >
              Logout
            </button>
            {/* Dark Mode Toggle within Menu */}
            <button
              onClick={toggleTheme}
              className="mt-2 text-xs bg-gray-700 px-2 py-1 rounded-md text-white hover:bg-gray-600 transition"
            >
              {darkMode ? "Light Mode" : "Dark Mode"}
            </button>
          </>
        )}
      </aside>

      {/* Main Content */}
      <div className="flex-1 ml-16 lg:ml-52 p-6 transition-all">
        <header className="w-full flex justify-between items-center pb-4">
          <h1 className="text-2xl font-bold text-blue-700">Web Menu - {user.username}</h1>
        </header>
        <main>
          {loading ? (
            <p className="text-center text-gray-500">Loading charts...</p>
          ) : (
            <>
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <div className="p-4 bg-white rounded-md shadow-lg">
                  <h2 className="text-lg font-semibold text-blue-600 mb-4">
                    Bitcoin Price (7 Days)
                  </h2>
                  <div className="w-full h-64">
                    {lineChartData && (
                      <Line
                        data={lineChartData}
                        options={{
                          responsive: true,
                          plugins: { legend: { display: false } },
                          scales: {
                            x: { grid: { display: false } },
                            y: { grid: { display: false } },
                          },
                        }}
                      />
                    )}
                  </div>
                </div>
                <div className="p-4 bg-white rounded-md shadow-lg">
                  <h2 className="text-lg font-semibold text-blue-600 mb-4">
                    Top Cryptos by Price
                  </h2>
                  <div className="w-full h-64">
                    {barChartData && (
                      <Bar
                        data={barChartData}
                        options={{
                          responsive: true,
                          plugins: { legend: { display: false } },
                          scales: {
                            x: { grid: { display: false } },
                            y: { grid: { display: false } },
                          },
                        }}
                      />
                    )}
                  </div>
                </div>
                <div className="p-4 bg-white rounded-md shadow-lg">
                  <h2 className="text-lg font-semibold text-blue-600 mb-4">
                    Market Share
                  </h2>
                  <div className="w-full h-64">
                    {pieChartData && (
                      <Pie
                        data={pieChartData}
                        options={{
                          responsive: true,
                          plugins: { legend: { display: false } },
                        }}
                      />
                    )}
                  </div>
                </div>
              </div>

              {/* Fleet Data Table */}
              <div className="mt-8">
      <h2 className="text-lg font-semibold text-blue-600 mb-4 text-center">Fleet Data</h2>
      <div className="overflow-x-auto">
        <table className="min-w-full bg-white border border-gray-300 rounded-lg shadow-lg dark:bg-gray-800">
          <thead>
            <tr className="bg-gray-200 dark:bg-gray-700">
              <th className="py-2 px-4 border-b text-center text-gray-800 dark:text-white">ID</th>
              <th className="py-2 px-4 border-b text-center text-gray-800 dark:text-white">Branch Name</th>
              <th className="py-2 px-4 border-b text-center text-gray-800 dark:text-white">Vehicle Type</th>
              <th className="py-2 px-4 border-b text-center text-gray-800 dark:text-white">Plate Number</th>
              <th className="py-2 px-4 border-b text-center text-gray-800 dark:text-white">Driver</th>
              <th className="py-2 px-4 border-b text-center text-gray-800 dark:text-white">Status ID</th>
              <th className="py-2 px-4 border-b text-center text-gray-800 dark:text-white">Destination</th>
              <th className="py-2 px-4 border-b text-center text-gray-800 dark:text-white">BPKB Date</th>
              <th className="py-2 px-4 border-b text-center text-gray-800 dark:text-white">KIR Date</th>
              <th className="py-2 px-4 border-b text-center text-gray-800 dark:text-white">Ownership Type</th>
              <th className="py-2 px-4 border-b text-center text-gray-800 dark:text-white">Volume Capacity</th>
              <th className="py-2 px-4 border-b text-center text-gray-800 dark:text-white">Weight Capacity</th>
            </tr>
          </thead>
          <tbody>
            {fleetData.map((item) => (
              <tr key={item.id}>
                <td className="py-2 px-4 border-b text-center text-gray-800 dark:text-white">{item.id}</td>
                <td className="py-2 px-4 border-b text-center text-gray-800 dark:text-white">{item.branch_name}</td>
                <td className="py-2 px-4 border-b text-center text-gray-800 dark:text-white">{item.vehicletype}</td>
                <td className="py-2 px-4 border-b text-center text-gray-800 dark:text-white">{item.plat_number}</td>
                <td className="py-2 px-4 border-b text-center text-gray-800 dark:text-white">{item.driver}</td>
                <td className="py-2 px-4 border-b text-center text-gray-800 dark:text-white">{item.status_id}</td>
                <td className="py-2 px-4 border-b text-center text-gray-800 dark:text-white">{item.destination}</td>
                <td className="py-2 px-4 border-b text-center text-gray-800 dark:text-white">{item.bpkb_date}</td>
                <td className="py-2 px-4 border-b text-center text-gray-800 dark:text-white">{item.kir_date}</td>
                <td className="py-2 px-4 border-b text-center text-gray-800 dark:text-white">{item.ownershiptype}</td>
                <td className="py-2 px-4 border-b text-center text-gray-800 dark:text-white">{item.volume_capacity}</td>
                <td className="py-2 px-4 border-b text-center text-gray-800 dark:text-white">{item.weight_capacity}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>

            </>
          )}
        </main>
      </div>
    </div>
  );
};

export default Dashboard;
