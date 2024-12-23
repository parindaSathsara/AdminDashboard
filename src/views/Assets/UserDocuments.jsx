import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './UserDocuments.css';
import jsonData from './UserDocument.json'

const UserDocuments = () => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const openGoogleMaps = (latitude, longitude) => {
    if (!isNaN(latitude) && !isNaN(longitude)) {
      const googleMapsUrl = `https://www.google.com/maps/search/?api=1&query=${latitude},${longitude}`;
      console.log(googleMapsUrl);
      
      window.open(googleMapsUrl, '_blank', 'noopener,noreferrer');
    }
  };

  useEffect(() => {
    const url = '/aahaas_order_more_data';
    axios
      .get(url)
      .then((response) => {
        if (Array.isArray(response.data.data)) {
          setData(response.data.data);
        } else {
          setError('Data format is incorrect or missing "data" array');
        }
        setLoading(false);
      })
      .catch((error) => {
        setError(error.message);
        setLoading(false);
      });
  }, []);

  if (loading) {
    return (
      <div className="loading-container">
        <div className="loading-spinner"></div>
        Loading data...
      </div>
    );
  }

  if (error) {
    return (
      <div className="error-container">
        <div className="error-message">
          Error loading data: {error}
        </div>
      </div>
    );
  }

  return (
    <div className="userDoc">

    <div className="container">
      <h2 className="page-title">Documents</h2>
      <div className="table-container">
        <div className="table-wrapper">
          <table>
            <thead>
              <tr>
                <th>Order ID</th>
                <th>Files</th>
                <th>Location</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {data.map((document, index) => (
                <tr key={document.id}>
                  <td>{document.checkout_id}</td>
                  <td>
                    {document.file_urls ? (
                      <a
                        href={document.file_urls}
                        className="file-link"
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        {document.file_urls.split('/').pop()}
                      </a>
                    ) : (
                      <span className="empty-data">-</span>
                    )}
                  </td>
                  <td>
                    {document.customer_lat_lon && 
                     document.customer_lat_lon.latitude && 
                     document.customer_lat_lon.longitude ? (
                      <span 
                        className="location-link"
                        onClick={() => openGoogleMaps(
                          document.customer_lat_lon.latitude, 
                          document.customer_lat_lon.longitude
                        )}
                      >
                        {`${document.customer_lat_lon.latitude.toFixed(4)}, 
                          ${document.customer_lat_lon.longitude.toFixed(4)}`}
                      </span>
                    ) : (
                      <span className="empty-data">-</span>
                    )}
                  </td>
                  <td>
                    <button className="view-details-btn">
                      View Details
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
    </div>

  );

  
};


export default UserDocuments;