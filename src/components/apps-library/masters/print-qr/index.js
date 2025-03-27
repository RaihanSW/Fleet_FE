import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate, useParams } from 'react-router-dom';

// Main Component
const UserPageTest = () => {
  const [users, setUsers] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [platNum,setPlatNum] = useState('');
  const [qrImage,setQrImage] = useState('');
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const { uid } = useParams(); // Get the uid from the URL params


  const getQRImage = async () => {
    try {
      setLoading(true);
      const response = await axios.get(`${process.env.REACT_APP_BACKEND_HOST}/masters/qrcode?plat_num=${platNum}`);
      const fetchedData = response.data.express21.results.imagebyte;

      var imgsrc = `data:image/png;base64,${fetchedData}`;
      setQrImage(imgsrc);
      setLoading(false);
    } catch (err) {
      setError("Failed to fetch data. Please try again later.");
      setLoading(false);
    }
  };


  const downloadQRPdf = async () => {
    try {
      if(!platNum){
        setError("Masukkan Nomor Plat terlebih dahulu");
        return false
      }
      setLoading(true);
      const response = await axios.get(`${process.env.REACT_APP_BACKEND_HOST}/masters/qrcode/pdf?plat_num=${platNum}`);
      // const fetchedData = response.data.express21.results.imagebyte;

      const blob = new Blob([response.data], { type: 'application/pdf' });
      const url = URL.createObjectURL(blob);

      const link = document.createElement('a');
      link.href = url;
      link.download = `QRcode_${platNum}.pdf`;

      // Append link to body, trigger download, then remove it
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);

      // Revoke the Blob URL to free memory
      URL.revokeObjectURL(url);

      setLoading(false);
    } catch (err) {
      setError("Failed to fetch data. Please try again later.");
      setLoading(false);
    }
  };


  return (
    <div className="p-6 bg-gray-100 min-h-screen">
      <div className="bg-white shadow-lg rounded-lg p-6 max-w-screen mx-auto min-h-screen">
        {/* Title Section */}
        <h2 className="text-4xl font-bold text-gray-800 mb-6">Master QR</h2>

        <div className="flex items-center space-x-4">
          <input
            type="text"
            placeholder="Cari Plat Nomor"
            value={platNum}
            onChange={(e) => setPlatNum(e.target.value)}
            className="w-1/2 p-3 text-black border rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-600"
          />
          <button
              onClick={getQRImage}
              className="bg-blue-500 text-white px-4 py-2 rounded-md shadow-md hover:bg-blue-600"
            >
              Fetch Data
            </button>
        </div>

        <img className="mx-auto py-8 w-96 h-96" src={qrImage} alt="Base64 Image" />;


        <div className="text-center">
          <button
            onClick={downloadQRPdf}
            className=" bg-blue-500 mx-auto text-white px-4 py-2 rounded-md shadow-md hover:bg-blue-600"
          >
            Print
          </button>
        </div>
       

        {/* Error Message Section */}
        {error && (
          <section className="text-center">
            <p className="text-red-600 bg-red-100 border border-red-300 rounded p-4">
              {error}
            </p>
          </section>
        )}
      </div>
    </div>
    
  );
};

export default UserPageTest;
