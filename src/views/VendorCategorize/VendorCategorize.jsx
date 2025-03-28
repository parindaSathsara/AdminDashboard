import React, { useEffect, useState } from 'react';
import { Card, Badge, Tabs, Tab, Spinner, Modal, Pagination } from 'react-bootstrap';
import axios from 'axios';

const CATEGORY_NAMES = {
  1: 'Essentials',
  2: 'Non-Essentials',
  3: 'Lifestyle',
  4: 'Hotels',
  5: 'Education'
};

const VendorCategorize = () => {
  const [vendorDetails, setVendorDetails] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeCategory, setActiveCategory] = useState('all');
  const [activeVendorType, setActiveVendorType] = useState('Direct');
  const [pagination, setPagination] = useState({
    current_page: 1,
    per_page: 50,
    total: 0,
    last_page: 1
  });
  const [error, setError] = useState(null);
  const [selectedDetails, setSelectedDetails] = useState(null);
  const [showDetailsModal, setShowDetailsModal] = useState(false);
  const [vendorSummary, setVendorSummary] = useState(null);


  const getVendorSummary = async () => {
    try {
      const response = await axios.get('/getVendorSummary');
      if (response.data.status === 200) {
        setVendorSummary(response.data.vendor_summary);
      }
    } catch (error) {
      console.error('Error fetching vendor summary:', error);
    }
  };


  const getVendorDetailsCategorize = async (page = 1, perPage = 50) => {
    try {
      const response = await axios.get('/getAllVendorsCategorize', {
        params: {
          page,
          per_page: perPage,
          vendor_type: activeVendorType
        }
      });

      if (response.data.status === 200) {
        return {
          data: response.data.response.data || [],
          current_page: response.data.current_page || 1,
          per_page: response.data.per_page || perPage,
          total: response.data.total || 0,
          last_page: response.data.last_page || 1,
          vendor_count: response.data.vendor_count || 894
        };
      }

      return {
        data: [],
        current_page: 1,
        per_page: perPage,
        total: 0,
        last_page: 1,
        vendor_count: 894
      };
    } catch (error) {
      console.error('Error fetching vendor details:', error);
      throw error;
    }
  };

  const fetchVendorData = async (page = 1) => {
    try {
      setLoading(true);
      setError(null);

      const vendorsResponse = await getVendorDetailsCategorize(page, pagination.per_page);

      setVendorDetails(vendorsResponse.data);
      setPagination({
        current_page: vendorsResponse.current_page,
        per_page: vendorsResponse.per_page,
        total: vendorsResponse.total,
        last_page: vendorsResponse.last_page
      });
    } catch (error) {
      setError('Failed to load vendor data. Please try again later.');
      console.error('Error fetching vendor data:', error);
      setVendorDetails([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchVendorData();
    getVendorSummary();

  }, [activeVendorType]);

  const handlePageChange = (page) => {
    fetchVendorData(page);
  };

  const getFilteredVendors = () => {
    const vendors = Array.isArray(vendorDetails) ? vendorDetails : [];

    if (activeVendorType === 'DMC') {
      return []; // Always return empty array for DMC
    }

    if (activeCategory === 'all') return vendors;

    return vendors.filter(vendor =>
      vendor['Catergory ID'] === activeCategory.toString()
    );
  };

  const renderCategoryCounts = (vendor) => {
    // Only render category counts for Direct vendors
    if (activeVendorType !== 'Direct') return null;

    return Object.entries(CATEGORY_NAMES).map(([categoryId, categoryName]) => {
      let count = 0;
      let ids = [];

      if (categoryName === 'Essentials') {
        count = vendor.essentials?.count || 0;
        ids = vendor.essentials?.ids || [];
      } else if (categoryName === 'Non-Essentials') {
        count = vendor.non_essentials?.count || 0;
        ids = vendor.non_essentials?.ids || [];
      } else if (categoryName === 'Lifestyle') {
        count = vendor.lifestyles?.length || 0;
        ids = vendor.lifestyles?.map(l => l.id) || [];
      } else if (categoryName === 'Hotels') {
        count = vendor.hotels?.length || 0;
        ids = vendor.hotels?.map(h => h.id) || [];
      } else if (categoryName === 'Education') {
        count = vendor.education?.length || 0;
        ids = vendor.education?.map(e => e.id) || [];
      }

      return (
        <Badge
          key={categoryId}
          bg={count > 0 ? 'success' : 'secondary'}
          className="me-2 mb-2"
          onClick={() => count > 0 && handleShowDetails(categoryName, vendor.id, ids)}
          style={{
            cursor: count > 0 ? 'pointer' : 'default',
            opacity: count > 0 ? 1 : 0.6
          }}
        >
          {categoryName}: {count}
        </Badge>
      );
    });
  };

  const handleShowDetails = (categoryName, vendorId, categoryIds) => {
    const vendor = vendorDetails.find(v => v.id === vendorId);
    if (!vendor) return;

    let details = [];

    switch (categoryName) {
      case 'Essentials':
        details = vendor.essNess?.filter(item =>
          categoryIds.includes(item.id) &&
          item.productDetails?.category1 === 'Essentials'
        ) || [];
        break;
      case 'Non-Essentials':
        details = vendor.essNess?.filter(item =>
          categoryIds.includes(item.id) &&
          item.productDetails?.category2 === 'Non-Essentials'
        ) || [];
        break;
      case 'Lifestyle':
        details = vendor.lifestyles?.filter(item =>
          categoryIds.includes(item.id)
        ) || [];
        break;
      case 'Hotels':
        details = vendor.hotels?.filter(item =>
          categoryIds.includes(item.id)
        ) || [];
        break;
      case 'Education':
        details = vendor.education?.filter(item =>
          categoryIds.includes(item.id)
        ) || [];
        break;
      default:
        details = [];
    }

    if (details.length > 0) {
      setSelectedDetails({
        categoryName,
        details
      });
      setShowDetailsModal(true);
    }
  };

  const renderDetailsModal = () => {
    if (!selectedDetails) return null;

    const getDetailsContent = (detail) => {
      switch (selectedDetails.categoryName) {
        case 'Essentials':
        case 'Non-Essentials':
          return [
            { label: 'Product Name', value: detail.product_name || 'N/A' },
            { label: 'Description', value: detail.description || 'N/A' },
            { label: 'Category', value: detail.category1 || 'N/A' },
            { label: 'Subcategory', value: detail.category2 || 'N/A' },
            { label: 'Status', value: detail.active_status ? 'Active' : 'Inactive' }
          ];
        case 'Lifestyle':
          return [
            { label: 'Activity Name', value: detail.lifestyle_name || 'N/A' },
            { label: 'Description', value: detail.lifestyle_description || 'N/A' },
            { label: 'Location', value: `${detail.lifestyle_city}, ${detail.address}` || 'N/A' },
            { label: 'Selling Points', value: detail.selling_points || 'N/A' },
            { label: 'Status', value: detail.active_status ? 'Active' : 'Inactive' }
          ];
        case 'Hotels':
          return [
            { label: 'Hotel Name', value: detail.hotel_name || 'N/A' },
            { label: 'Description', value: detail.hotel_description || 'N/A' },
            { label: 'Location', value: `${detail.city}, ${detail.hotel_address}` || 'N/A' },
            { label: 'Star Classification', value: detail.star_classification || 'N/A' },
            { label: 'Status', value: detail.hotel_status === "1" ? 'Active' : 'Inactive' }
          ];
        case 'Education':
          return [
            { label: 'Course Name', value: detail.course_name || 'N/A' },
            { label: 'Description', value: detail.course_description || 'N/A' },
            { label: 'Medium', value: detail.medium || 'N/A' },
            { label: 'Course Mode', value: detail.course_mode || 'N/A' },
            { label: 'Status', value: detail.status === "1" ? 'Active' : 'Inactive' }
          ];
        default:
          return [
            { label: 'Name', value: detail.name || 'N/A' },
            { label: 'Description', value: detail.description || 'N/A' },
            { label: 'Status', value: detail.status || 'N/A' }
          ];
      }
    };

    return (
      <Modal
        show={showDetailsModal}
        onHide={() => setShowDetailsModal(false)}
        size="lg"
      >
        <Modal.Header
          closeButton
          style={{ backgroundColor: '#3c4b64', color: 'white' }}

        >
          <Modal.Title>
            {selectedDetails.categoryName} Details ({selectedDetails.details.length})
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {selectedDetails.details.map((detail, index) => (
            <Card key={index} className="mb-4 shadow-sm">
              <Card.Header
                className="bg-light"
                style={{ borderBottom: `2px solid #3c4b64` }}
              >
                <h5 className="mb-0">
                  {detail.product_name || detail.lifestyle_name || detail.hotel_name || detail.course_name || `Item ${index + 1}`}
                </h5>
              </Card.Header>
              <Card.Body>
                <div className="row">
                  {getDetailsContent(detail).map((item, idx) => (
                    <div key={idx} className="col-md-6 mb-2">
                      <strong style={{ color: '#3c4b64' }}>{item.label}:</strong>
                      <div className="text-muted">
                        {typeof item.value === 'string' ?
                          item.value.replace(/<[^>]*>?/gm, '') : // Remove HTML tags if present
                          item.value}
                      </div>
                    </div>
                  ))}
                </div>
                {detail.image || detail.hotel_image || detail.image_path ? (
                  <div className="mt-2">
                    <img
                      src={detail.image || detail.hotel_image || detail.image_path}
                      alt="Detail"
                      className="img-fluid rounded"
                      style={{ maxHeight: '150px' }}
                    />
                  </div>
                ) : null}
              </Card.Body>
            </Card>
          ))}
        </Modal.Body>
      </Modal>
    );
  };

  if (loading) {
    return (
      <div className="d-flex justify-content-center align-items-center vh-100">
        <Spinner animation="border" variant="primary" />
        <span className="ms-2">Loading Vendors...</span>
      </div>
    );
  }

  if (error) {
    return (
      <div className="alert alert-danger mt-4">
        {error}
      </div>
    );
  }
  return (
    <div className="p-4 bg-light">
      <h1
        className="text-center mb-4"
        style={{ color: '#3c4b64' }}
      >
        Vendor Categorization
      </h1>

      {vendorSummary && (
        <div className="row mb-4">
          <div className="col-md-4">
            <Card className="text-center shadow-sm" style={{ borderTop: '3px solid #3c4b64' }}>
              <Card.Body>
                <h5>Total Vendors</h5>
                <h3 style={{ color: '#3c4b64' }}>{vendorSummary.total_vendors}</h3>
              </Card.Body>
            </Card>
          </div>
          <div className="col-md-4">
            <Card className="text-center shadow-sm" style={{ borderTop: '3px solid green' }}>
              <Card.Body>
                <h5>Active Vendors</h5>
                <h3 style={{ color: 'green' }}>{vendorSummary.active_vendors}</h3>
              </Card.Body>
            </Card>
          </div>
          <div className="col-md-4">
            <Card className="text-center shadow-sm" style={{ borderTop: '3px solid red' }}>
              <Card.Body>
                <h5>Inactive Vendors</h5>
                <h3 style={{ color: 'red' }}>{vendorSummary.inactive_vendors}</h3>
              </Card.Body>
            </Card>
          </div>
        </div>
      )}


      {/* Vendor Type Tabs */}
      <Tabs
        id="vendor-type-tabs"
        activeKey={activeVendorType}
        onSelect={(key) => setActiveVendorType(key)}
        className="mb-3"
      >
        <Tab eventKey="Direct" title={`Direct (${vendorDetails.vendor_count || 894})`} />
        <Tab eventKey="DMC" title={`DMC (${vendorDetails.vendor_count || 0})`} />
      </Tabs>

      {/* Category Tabs */}
      <Tabs
        id="vendor-tabs"
        activeKey={activeCategory}
        onSelect={(key) => setActiveCategory(key)}
        className="mb-4"
      >
        <Tab eventKey="all" title="All Vendors" />

      </Tabs>
      <div className="row">
        {getFilteredVendors().length > 0 ? (
          getFilteredVendors().map(vendor => (
            <div key={vendor.id} className="col-md-6 col-lg-4 mb-4">
              <Card className="shadow-sm" style={{ borderTop: '3px solid #3c4b64' }}>
                <Card.Header style={{ backgroundColor: '#3c4b64', color: 'white' }}>
                  <div className="d-flex justify-content-between">
                    <h5>{vendor.company_name || 'Unnamed Vendor'}</h5>
                    <Badge bg="dark">ID: {vendor.id}</Badge>
                  </div>
                </Card.Header>
                <Card.Body>
                  <p><strong>Name:</strong> {vendor.first_name} {vendor.last_name}</p>
                  <p><strong>Email:</strong> {vendor.email}</p>
                  <p><strong>Phone:</strong> {vendor.phone}</p>

                  {activeVendorType === 'Direct' ? (
                    <>
                      <h6 className="mt-3">Category Presence</h6>
                      <div className="d-flex flex-wrap">
                        {renderCategoryCounts(vendor).length > 0 ? (
                          renderCategoryCounts(vendor)
                        ) : (
                          <p className="text-danger fw-bold">No product yet</p>
                        )}
                      </div>
                    </>
                  ) : (
                    <p className="text-danger fw-bold mt-3">No product yet</p>
                  )}
                </Card.Body>
              </Card>
            </div>
          ))
        ) : (
          <div className="col-12 text-center py-5">
            <p className="text-danger fw-bold">No product yet</p>
          </div>
        )}
      </div>


       {/* Pagination - Now conditionally rendered based on activeVendorType */}
       {!loading && activeVendorType === 'Direct' && pagination.total > pagination.per_page && (
        <div className="d-flex justify-content-center mt-4">
          <Pagination>
            <Pagination.First
              onClick={() => handlePageChange(1)}
              disabled={pagination.current_page === 1}
            />
            <Pagination.Prev
              onClick={() => handlePageChange(pagination.current_page - 1)}
              disabled={pagination.current_page === 1}
            />

            {[...Array(pagination.last_page).keys()].map(page => (
              <Pagination.Item
                key={page + 1}
                active={page + 1 === pagination.current_page}
                onClick={() => handlePageChange(page + 1)}
                style={{
                  backgroundColor: page + 1 === pagination.current_page ? '#3c4b64' : 'inherit',
                  color: page + 1 === pagination.current_page ? 'white' : 'inherit'
                }}
              >
                {page + 1}
              </Pagination.Item>
            ))}

            <Pagination.Next
              onClick={() => handlePageChange(pagination.current_page + 1)}
              disabled={pagination.current_page === pagination.last_page}
            />
            <Pagination.Last
              onClick={() => handlePageChange(pagination.last_page)}
              disabled={pagination.current_page === pagination.last_page}
            />
          </Pagination>
        </div>
      )}

      {/* Per Page Selection - Also conditionally rendered */}
      {activeVendorType === 'Direct' && (
        <div className="d-flex justify-content-end mb-3">
          <select
            className="form-select w-auto"
            value={pagination.per_page}
            onChange={(e) => {
              setPagination({ ...pagination, per_page: parseInt(e.target.value) });
              fetchVendorData(1);
            }}
          >
            <option value="10">10 per page</option>
            <option value="25">25 per page</option>
            <option value="50">50 per page</option>
            <option value="100">100 per page</option>
          </select>
        </div>
      )}

      {renderDetailsModal()}
    </div>
  );
};

export default VendorCategorize;