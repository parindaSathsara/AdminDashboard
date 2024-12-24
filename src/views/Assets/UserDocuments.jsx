import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './UserDocuments.css';
import jsonData from './UserDocument.json'
import { Icon, ThemeProvider, createTheme } from '@mui/material'
import MaterialTable from 'material-table'
import { CCard, CCardBody, CRow, CCol, CModal, CModalBody, CModalHeader, CModalFooter, CButton, CModalTitle, CImage } from '@coreui/react';  

const UserDocuments = () => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const defaultMaterialTheme = createTheme();
  const [showModal, setShowModal] = useState(false);
  const [files, setFiles] = useState([]);
  
  
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
          console.log(response.data.data,"document data");
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

  
      const handleCloseModal = () => {
          setShowModal(false);
      }

  return (
    <div className="">
      <ThemeProvider theme={defaultMaterialTheme}>
        <MaterialTable
          title="User Documents"
          data={data}
          columns={[
            { title: 'Order ID', field: 'checkout_id' },
            {
              title: 'Files',
              field: 'file_urls',
              render: rowData => (
                rowData.file_urls ? (
                  <>
                    <CButton onClick={() => {
                      setShowModal(true);
                      // console.log(axios.defaults.imageUrl+rowData.file_urls);
                      setFiles(axios.defaults.imageUrl+rowData.file_urls);
                    }} color="primary" variant="outline" size="sm">
                      View Documents
                    </CButton>
                  </>
                ) : (
                  <span className="empty-data">-</span>
                )
              )
            },
            {
              title: 'Location',
              field: 'customer_lat_lon',
              render: rowData => (
                rowData.customer_lat_lon && 
                rowData.customer_lat_lon.latitude && 
                rowData.customer_lat_lon.longitude ? (
                  <span 
                    className="location-link"
                    onClick={() => openGoogleMaps(
                      rowData.customer_lat_lon.latitude, 
                      rowData.customer_lat_lon.longitude
                    )}
                  >
                    <button className="view-details-btn">
                      View location
                    </button>
                  </span>
                ) : (
                  <span className="empty-data">-</span>
                )
              )
            }
          ]}
          options={{
            sorting: true,
            search: true,
          }}
        />
      </ThemeProvider>

      <CModal visible={showModal} onClose={handleCloseModal} size="lg">
        <CModalHeader closeButton>
          <CModalTitle>Modal title</CModalTitle>
        </CModalHeader>
        <CModalBody>
          {files.length > 0 ? (
            <div className="image-gallery">
             <CImage rounded thumbnail src={files} width={200} height={200} />
              
            </div>
          ) : (
            <div>No documents available</div>
          )}
        </CModalBody>
        <CModalFooter>
        </CModalFooter>
      </CModal>
    </div>
  );

  
};


export default UserDocuments;