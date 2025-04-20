import React, { useState, useEffect, useCallback } from 'react';
import { Card, Pagination, Spinner, Form, Button, Modal, Tabs, Tab, Badge } from 'react-bootstrap';
import axios from 'axios';
import { debounce } from 'lodash';
import * as XLSX from 'xlsx';

const VendorStats = () => {
  // State for vendor summary
  const [vendorSummary, setVendorSummary] = useState({
    total_vendors: 0,
    active_vendors: 0,
    inactive_vendors: 0,
    direct_vendors: 0,
    dmc_vendors: 0,
    direct_products: { total: 0, active: 0, inactive: 0 },
    dmc_products: { total: 0, active: 0, inactive: 0 },
    vendor_categories: {
      essentials: { total: 0, active: 0, inactive: 0 },
      non_essentials: { total: 0, active: 0, inactive: 0 },
      lifestyle: { total: 0, active: 0, inactive: 0 },
      hotels: { total: 0, active: 0, inactive: 0 },
      education: { total: 0, active: 0, inactive: 0 }
    },
    total_products: { total: 0, active: 0, inactive: 0 }
  });

  const [vendorCounts, setVendorCounts] = useState({
    all: 0,
    direct: 0,
    dmc: 0
  });
  
  // State for vendor management
  const [activeTab, setActiveTab] = useState('all');
  const [vendors, setVendors] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [pagination, setPagination] = useState({
    currentPage: 1,
    totalPages: 1,
    total: 0,
    perPage: 10
  });
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCountry, setSelectedCountry] = useState('');
  const [showDetailsModal, setShowDetailsModal] = useState(false);
  const [selectedVendor, setSelectedVendor] = useState(null);
  const [showProductSummary, setShowProductSummary] = useState(true);
  const [vendorDetailsForExcel, setVendorDetailsForExcel] = useState(null);
  const [loadingExcel, setLoadingExcel] = useState(false);

  // Category names mapping for export
  const CATEGORY_NAMES = {
    1: "Essentials",
    2: "Non-Essentials",
    3: "Lifestyle",
    4: "Hotels",
    5: "Education"
  };

  // Country code mapping
  const countryCodeToName = {
    AF: "afghanistan",
    AL: "albania",
    DZ: "algeria",
    AD: "andorra",
    AO: "angola",
    AG: "antigua and barbuda",
    AR: "argentina",
    AM: "armenia",
    AU: "australia",
    AT: "austria",
    AZ: "azerbaijan",
    BS: "bahamas",
    BH: "bahrain",
    BD: "bangladesh",
    BB: "barbados",
    BY: "belarus",
    BE: "belgium",
    BZ: "belize",
    BJ: "benin",
    BT: "bhutan",
    BO: "bolivia",
    BA: "bosnia and herzegovina",
    BW: "botswana",
    BR: "brazil",
    BN: "brunei",
    BG: "bulgaria",
    BF: "burkina faso",
    BI: "burundi",
    KH: "cambodia",
    CM: "cameroon",
    CA: "canada",
    CV: "cape verde",
    CF: "central african republic",
    TD: "chad",
    CL: "chile",
    CN: "china",
    CO: "colombia",
    KM: "comoros",
    CG: "congo (brazzaville)",
    CD: "congo (kinshasa)",
    CR: "costa rica",
    HR: "croatia",
    CU: "cuba",
    CY: "cyprus",
    CZ: "czech republic",
    DK: "denmark",
    DJ: "djibouti",
    DM: "dominica",
    DO: "dominican republic",
    EC: "ecuador",
    EG: "egypt",
    SV: "el salvador",
    GQ: "equatorial guinea",
    ER: "eritrea",
    EE: "estonia",
    SZ: "eswatini",
    ET: "ethiopia",
    FJ: "fiji",
    FI: "finland",
    FR: "france",
    GA: "gabon",
    GM: "gambia",
    GE: "georgia",
    DE: "germany",
    GH: "ghana",
    GR: "greece",
    GD: "grenada",
    GT: "guatemala",
    GN: "guinea",
    GW: "guinea-bissau",
    GY: "guyana",
    HT: "haiti",
    HN: "honduras",
    HU: "hungary",
    IS: "iceland",
    IN: "india",
    ID: "indonesia",
    IR: "iran",
    IQ: "iraq",
    IE: "ireland",
    IL: "israel",
    IT: "italy",
    JM: "jamaica",
    JP: "japan",
    JO: "jordan",
    KZ: "kazakhstan",
    KE: "kenya",
    KI: "kiribati",
    KP: "north korea",
    KR: "south korea",
    KW: "kuwait",
    KG: "kyrgyzstan",
    LA: "laos",
    LV: "latvia",
    LB: "lebanon",
    LS: "lesotho",
    LR: "liberia",
    LY: "libya",
    LI: "liechtenstein",
    LT: "lithuania",
    LU: "luxembourg",
    MG: "madagascar",
    MW: "malawi",
    MY: "malaysia",
    MV: "maldives",
    ML: "mali",
    MT: "malta",
    MH: "marshall islands",
    MR: "mauritania",
    MU: "mauritius",
    MX: "mexico",
    FM: "micronesia",
    MD: "moldova",
    MC: "monaco",
    MN: "mongolia",
    ME: "montenegro",
    MA: "morocco",
    MZ: "mozambique",
    MM: "myanmar",
    NA: "namibia",
    NR: "nauru",
    NP: "nepal",
    NL: "netherlands",
    NZ: "new zealand",
    NI: "nicaragua",
    NE: "niger",
    NG: "nigeria",
    MK: "north macedonia",
    NO: "norway",
    OM: "oman",
    PK: "pakistan",
    PW: "palau",
    PA: "panama",
    PG: "papua new guinea",
    PY: "paraguay",
    PE: "peru",
    PH: "philippines",
    PL: "poland",
    PT: "portugal",
    QA: "qatar",
    RO: "romania",
    RU: "russia",
    RW: "rwanda",
    KN: "saint kitts and nevis",
    LC: "saint lucia",
    VC: "saint vincent and the grenadines",
    WS: "samoa",
    SM: "san marino",
    ST: "sao tome and principe",
    SA: "saudi arabia",
    SN: "senegal",
    RS: "serbia",
    SC: "seychelles",
    SL: "sierra leone",
    SG: "singapore",
    SK: "slovakia",
    SI: "slovenia",
    SB: "solomon islands",
    SO: "somalia",
    ZA: "south africa",
    ES: "spain",
    LK: "sri lanka",
    SD: "sudan",
    SR: "suriname",
    SE: "sweden",
    CH: "switzerland",
    SY: "syria",
    TW: "taiwan",
    TJ: "tajikistan",
    TZ: "tanzania",
    TH: "thailand",
    TL: "timor-leste",
    TG: "togo",
    TO: "tonga",
    TT: "trinidad and tobago",
    TN: "tunisia",
    TR: "turkey",
    TM: "turkmenistan",
    TV: "tuvalu",
    UG: "uganda",
    UA: "ukraine",
    AE: "united arab emirates",
    GB: "united kingdom",
    US: "united states",
    UY: "uruguay",
    UZ: "uzbekistan",
    VU: "vanuatu",
    VA: "vatican city",
    VE: "venezuela",
    VN: "vietnam",
    YE: "yemen",
    ZM: "zambia",
    ZW: "zimbabwe"
  };


  // Fetch vendor summary data
  const getVendorSummary = async () => {
    try {
      setLoading(true);
      const response = await axios.get('/getVendorSummary');
      if (response.data.status === 200) {
        setVendorSummary({
          ...response.data.vendor_summary,
          total_products: response.data.vendor_summary.total_products || {
            total: 0,
            active: 0,
            inactive: 0
          }
        });
        setVendorCounts({
          all: response.data.vendor_summary.total_vendors || 0,
          direct: response.data.vendor_summary.direct_vendors || 0,
          dmc: response.data.vendor_summary.dmc_vendors || 0
        });
      }
      setLoading(false);
    } catch (error) {
      console.error('Error fetching vendor summary:', error);
      setError('Failed to load vendor statistics. Please try again later.');
      // Set default values if API fails
      setVendorSummary({
        total_vendors: 0,
        active_vendors: 0,
        inactive_vendors: 0,
        direct_vendors: 0,
        dmc_vendors: 0,
        direct_products: { total: 0, active: 0, inactive: 0 },
        dmc_products: { total: 0, active: 0, inactive: 0 },
        vendor_categories: {
          essentials: { total: 0, active: 0, inactive: 0 },
          non_essentials: { total: 0, active: 0, inactive: 0 },
          lifestyle: { total: 0, active: 0, inactive: 0 },
          hotels: { total: 0, active: 0, inactive: 0 },
          education: { total: 0, active: 0, inactive: 0 }
        },
        total_products: { total: 0, active: 0, inactive: 0 }
      });
      setLoading(false);
    }
  };

  // Function to fetch vendor data
  const fetchVendors = useCallback(async (page = 1) => {
    setLoading(true);
    setError(null);
    
    try {
      const vendorType = activeTab === 'all' ? 'All' : activeTab === 'direct' ? 'Direct' : 'DMC';
      
      const response = await axios.get('/get-vendors', {
        params: {
          search_term: searchTerm,
          page: page,
          per_page: pagination.perPage,
          vendor_type: vendorType,
          country: selectedCountry
        }
      });
      
      if (response.data && response.data.data) {
        setVendors(response.data.data.data);
        setPagination({
          currentPage: response.data.data.current_page,
          totalPages: response.data.data.last_page,
          total: response.data.data.total,
          perPage: response.data.data.per_page
        });
      }
    } catch (err) {
      console.error('Error fetching vendors:', err);
      setError('Failed to load vendors. Please try again later.');
      setVendors([]);
    } finally {
      setLoading(false);
    }
  }, [activeTab, searchTerm, selectedCountry, pagination.perPage]);

  // Fetch detailed vendor data for Excel export
  const fetchVendorDetails = async (vendorId) => {
    try {
      setLoadingExcel(true);
      const response = await axios.get(`/getVendorDetails/${vendorId}`);
      if (response.data.status === 200) {
        return response.data.vendor;
      }
      return null;
    } catch (error) {
      console.error('Error fetching vendor details:', error);
      return null;
    } finally {
      setLoadingExcel(false);
    }
  };

  // Function to download vendor Excel
  const downloadVendorExcel = async (vendor) => {
    // Show loading indicator
    setLoadingExcel(true);
    
    // Try to fetch detailed vendor data if available
    let vendorForExcel = vendor;
    try {
      const detailedVendor = await fetchVendorDetails(vendor.id);
      if (detailedVendor) {
        vendorForExcel = detailedVendor;
      }
    } catch (error) {
      console.warn('Could not fetch detailed vendor data, using summary data instead:', error);
    }

    const data = [];

    // Basic Details
    data.push(['Vendor Details', '']);
    data.push(['Company Name', vendorForExcel.company_name || 'N/A']);
    data.push(['Contact Name', `${vendorForExcel.first_name || ''} ${vendorForExcel.last_name || ''}`.trim() || 'N/A']);
    data.push(['Email', vendorForExcel.email || 'N/A']);
    data.push(['Phone', vendorForExcel.phone || 'N/A']);
    data.push(['', '']);

    // Category Summary
    data.push(['Category Summary', 'Count']);
    Object.entries(CATEGORY_NAMES).forEach(([categoryId, categoryName]) => {
      let count = 0;
      if (categoryName === 'Essentials') {
        count = vendorForExcel.essentials?.length || vendorForExcel.essentials_count || 0;
      } else if (categoryName === 'Non-Essentials') {
        count = vendorForExcel.non_essentials?.length || vendorForExcel.non_essentials_count || 0;
      } else if (categoryName === 'Lifestyle') {
        count = vendorForExcel.lifestyles?.length || vendorForExcel.lifestyles_count || 0;
      } else if (categoryName === 'Hotels') {
        count = vendorForExcel.hotels?.length || vendorForExcel.hotels_count || 0;
      } else if (categoryName === 'Education') {
        count = vendorForExcel.education?.length || vendorForExcel.education_count || 0;
      }
      data.push([categoryName, count]);
    });

    // =======================
    // Detailed Category Section
    // =======================

    // Essentials Details
    if (vendorForExcel.essentials && vendorForExcel.essentials.length > 0) {
      data.push(['', '']);
      data.push(['Essentials Details', '']);
      data.push(['Product Name', 'Description', 'Category 2', 'Category 3', 'Country', 'Status', 'Price']);
      vendorForExcel.essentials.forEach(item => {
        data.push([
          item.listing_title || 'N/A',
          item.sub_description || 'N/A',
          item.product_details?.category2 || 'N/A',
          item.product_details?.category3 || 'N/A',
          item.country || 'N/A',
          item.lisiting_status === "1" ? 'Active' : 'Inactive',
          item.price || 'N/A'
        ]);
      });
    }
    
    // Non-Essentials Details
    if (vendorForExcel.non_essentials && vendorForExcel.non_essentials.length > 0) {
      data.push(['', '']);
      data.push(['Non-Essentials Details', '']);
      data.push(['Product Name', 'Description', 'Category 2', 'Category 3', 'Country', 'Status', 'Price']);
      vendorForExcel.non_essentials.forEach(item => {
        data.push([
          item.listing_title || 'N/A',
          item.sub_description || 'N/A',
          item.product_details?.category2 || 'N/A',
          item.product_details?.category3 || 'N/A',
          item.country || 'N/A',
          item.lisiting_status === "1" ? 'Active' : 'Inactive',
          item.price || 'N/A'
        ]);
      });
    }

    // Lifestyles Details
    if (vendorForExcel.lifestyles && vendorForExcel.lifestyles.length > 0) {
      data.push(['', '']);
      data.push(['Lifestyle Details', '']);
      data.push(['Name', 'City', 'Attraction Type', 'Preferred', 'Micro Location', 'TripAdvisor Link', 'Status']);
      vendorForExcel.lifestyles.forEach(item => {
        data.push([
          item.lifestyle_name || 'N/A',
          item.lifestyle_city || 'N/A',
          item.lifestyle_attraction_type || 'N/A',
          item.preferred == 1 ? 'Yes' : 'No',
          item.micro_location || 'N/A',
          item.tripadvisor || 'N/A',
          item.active_status ? 'Active' : 'Inactive'
        ]);
      });
    }

    // Education Details
    if (vendorForExcel.education && vendorForExcel.education.length > 0) {
      data.push(['', '']);
      data.push(['Education Details', '']);
      data.push(['Course Name', 'Medium', 'Mode', 'Group Type', 'Free Session', 'Payment Method', 'Status']);
      vendorForExcel.education.forEach(item => {
        data.push([
          item.course_name || 'N/A',
          item.medium || 'N/A',
          item.course_mode || 'N/A',
          item.group_type || 'N/A',
          item.free_session || 'N/A',
          item.payment_method || 'N/A',
          item.status ? 'Active' : 'Inactive'
        ]);
      });
    }

    // Hotel Details
    if (vendorForExcel.hotels && vendorForExcel.hotels.length > 0) {
      data.push(['', '']);
      data.push(['Hotel Details', '']);
      data.push(['Hotel Name', 'Star', 'City', 'Address', 'TripAdvisor', 'Start Date', 'End Date', 'Status']);
      vendorForExcel.hotels.forEach(item => {
        data.push([
          item.hotel_name || 'N/A',
          item.star_classification || 'N/A',
          item.city || 'N/A',
          item.hotel_address || 'N/A',
          item.trip_advisor_link || 'N/A',
          item.start_date || 'N/A',
          item.end_date || 'N/A',
          item.hotel_status ? 'Active' : 'Inactive'
        ]);
      });
    }

    // =======================
    // Export to Excel
    // =======================

    const wb = XLSX.utils.book_new();
    const ws = XLSX.utils.aoa_to_sheet(data);

    ws['!cols'] = [{ width: 30 }, { width: 25 }, { width: 25 }, { width: 25 }, { width: 25 }, { width: 30 }];

    XLSX.utils.book_append_sheet(wb, ws, 'Vendor Details');

    const fileName = `Vendor_${vendorForExcel.id}_${vendorForExcel.company_name || 'details'}.xlsx`;
    XLSX.writeFile(wb, fileName);
    
    // Hide loading indicator
    setLoadingExcel(false);
  };

  // Debounced search function
  const debouncedSearch = useCallback(
    debounce((term) => {
      setSearchTerm(term);
      fetchVendors(1); // Reset to first page when searching
    }, 500),
    [fetchVendors]
  );

  // Handle search input change
  const handleSearchChange = (e) => {
    debouncedSearch(e.target.value);
  };

  // Handle country selection
  const handleCountryChange = (e) => {
    setSelectedCountry(e.target.value);
    fetchVendors(1); // Reset to first page when changing country
  };

  // Handle tab change
  const handleTabChange = (key) => {
    setActiveTab(key);
    setSearchTerm('');
    setSelectedCountry('');
    fetchVendors(1); // Reset to first page when changing tabs
  };

  // Handle pagination
  const handlePageChange = (page) => {
    fetchVendors(page);
  };

  // Show details modal
  const showVendorDetails = (vendor) => {
    setSelectedVendor(vendor);
    setShowDetailsModal(true);
  };

  // Initial data fetches
  useEffect(() => {
    getVendorSummary();
  }, []);
  
  useEffect(() => {
    fetchVendors(1);
  }, [fetchVendors]);

  // Render pagination controls
  const renderPagination = () => {
    const pages = [];
    const { currentPage, totalPages } = pagination;
    
    // Determine range of pages to show
    let startPage = Math.max(1, currentPage - 2);
    let endPage = Math.min(totalPages, currentPage + 2);
    
    // Ensure we always show 5 pages if available
    if (endPage - startPage < 4) {
      if (startPage === 1) {
        endPage = Math.min(5, totalPages);
      } else if (endPage === totalPages) {
        startPage = Math.max(1, totalPages - 4);
      }
    }
    
    // First page
    if (startPage > 1) {
      pages.push(
        <Pagination.Item 
          key={1} 
          active={1 === currentPage}
          onClick={() => handlePageChange(1)}
        >
          1
        </Pagination.Item>
      );
      if (startPage > 2) {
        pages.push(<Pagination.Ellipsis key="ellipsis-start" />);
      }
    }
    
    // Page range
    for (let i = startPage; i <= endPage; i++) {
      pages.push(
        <Pagination.Item 
          key={i} 
          active={i === currentPage}
          onClick={() => handlePageChange(i)}
        >
          {i}
        </Pagination.Item>
      );
    }
    
    // Last page
    if (endPage < totalPages) {
      if (endPage < totalPages - 1) {
        pages.push(<Pagination.Ellipsis key="ellipsis-end" />);
      }
      pages.push(
        <Pagination.Item 
          key={totalPages} 
          active={totalPages === currentPage}
          onClick={() => handlePageChange(totalPages)}
        >
          {totalPages}
        </Pagination.Item>
      );
    }
    
    return (
      <Pagination className="justify-content-center mt-4">
        <Pagination.Prev 
          disabled={currentPage === 1}
          onClick={() => handlePageChange(currentPage - 1)}
        />
        {pages}
        <Pagination.Next 
          disabled={currentPage === totalPages}
          onClick={() => handlePageChange(currentPage + 1)}
        />
      </Pagination>
    );
  };

  // Render vendor cards
  const renderVendorCards = () => {
    if (vendors.length === 0) {
      return (
        <div className="text-center py-5">
          <p>No vendors found. Try adjusting your search or filters.</p>
        </div>
      );
    }

    return (
      <div className="row">
        {vendors.map(vendor => (
          <div key={vendor.id} className="col-md-6 col-lg-4 mb-4">
            <Card className="h-100 shadow-sm">
              <Card.Header className="d-flex justify-content-between align-items-center">
                <h5 className="m-0 text-truncate" title={vendor.company_name}>
                  {vendor.company_name}
                </h5>
                <Badge bg={vendor.status === "1" ? "success" : "danger"}>
                  {vendor.status === "1" ? "Active" : "Inactive"}
                </Badge>
              </Card.Header>
              <Card.Body>
                <p className="mb-1">
                  <strong>Contact:</strong>{" "}
                  {`${vendor.first_name || ''} ${vendor.last_name || ''}`.trim() || 'N/A'}
                </p>
                <p className="mb-1">
                  <strong>Phone:</strong> {vendor.phone || 'N/A'}
                </p>
                <p className="mb-1">
                  <strong>Email:</strong> {vendor.email || 'N/A'}
                </p>
                <p className="mb-3">
                  <strong>Address:</strong>{" "}
                  <span title={vendor.address}>{vendor.address || 'N/A'}</span>
                </p>
                
                <div className="d-flex flex-wrap mb-2">
                  {vendor.essentials_count > 0 && (
                    <Badge bg="primary" className="me-1 mb-1">
                      Essentials: {vendor.essentials_count}
                    </Badge>
                  )}
                  {vendor.non_essentials_count > 0 && (
                    <Badge bg="info" className="me-1 mb-1">
                      Non-Essentials: {vendor.non_essentials_count}
                    </Badge>
                  )}
                  {vendor.lifestyles_count > 0 && (
                    <Badge bg="secondary" className="me-1 mb-1">
                      Lifestyle: {vendor.lifestyles_count}
                    </Badge>
                  )}
                  {vendor.hotels_count > 0 && (
                    <Badge bg="warning" text="dark" className="me-1 mb-1">
                      Hotels: {vendor.hotels_count}
                    </Badge>
                  )}
                  {vendor.education_count > 0 && (
                    <Badge bg="success" className="me-1 mb-1">
                      Education: {vendor.education_count}
                    </Badge>
                  )}
                </div>
              </Card.Body>
              <Card.Footer className="d-flex justify-content-between">
                <Button 
                  variant="outline-primary" 
                  size="sm"
                  onClick={() => showVendorDetails(vendor)}
                >
                  View Details
                </Button>
                <Button 
                  variant="outline-success" 
                  size="sm"
                  onClick={() => downloadVendorExcel(vendor)}
                  disabled={loadingExcel}
                >
                  {loadingExcel ? 'Generating...' : 'Download Excel'}
                </Button>
              </Card.Footer>
            </Card>
          </div>
        ))}
      </div>
    );
  };

  // Loading state display for initial load
  if (loading && vendors.length === 0 && !vendorSummary.total_vendors) {
    return (
      <div className="d-flex justify-content-center align-items-center vh-100">
        <Spinner animation="border" variant="primary" />
        <span className="ms-2">Loading Vendor Statistics...</span>
      </div>
    );
  }

  // Error state display
  if (error && vendors.length === 0 && !vendorSummary.total_vendors) {
    return (
      <div className="alert alert-danger mt-4">
        {error}
      </div>
    );
  }

  return (
    <div className="p-4 bg-light">
      <h1 className="text-center mb-4" style={{ color: '#3c4b64' }}>
        Vendor Categorization
      </h1>

      {/* Vendor Summary Statistics */}
      <div className="row mb-4">
        {/* Total Vendors */}
        <div className="col-md-4">
          <Card className="shadow-sm text-center" style={{ borderTop: '3px solid #3c4b64' }}>
            <Card.Body>
              <div className="d-flex justify-content-between align-items-center">
                <h5 className="mb-0">Total Vendors</h5>
                <h3 className="mb-0" style={{ color: '#3c4b64' }}>{vendorSummary.total_vendors}</h3>
              </div>
            </Card.Body>
          </Card>
        </div>

        {/* Active Vendors */}
        <div className="col-md-4">
          <Card className="shadow-sm text-center" style={{ borderTop: '3px solid green' }}>
            <Card.Body>
              <div className="d-flex justify-content-between align-items-center">
                <h5 className="mb-0">Active Vendors</h5>
                <h3 className="mb-0" style={{ color: 'green' }}>{vendorSummary.active_vendors}</h3>
              </div>
            </Card.Body>
          </Card>
        </div>

        {/* Inactive Vendors */}
        <div className="col-md-4">
          <Card className="shadow-sm text-center" style={{ borderTop: '3px solid red' }}>
            <Card.Body>
              <div className="d-flex justify-content-between align-items-center">
                <h5 className="mb-0">Inactive Vendors</h5>
                <h3 className="mb-0" style={{ color: 'red' }}>{vendorSummary.inactive_vendors}</h3>
              </div>
            </Card.Body>
          </Card>
        </div>

        {/* Direct Vendor Products */}
        <div className="col-md-6 mt-3">
          <Card className="shadow-sm text-center" style={{ borderTop: '3px solid orange' }}>
            <Card.Body>
              <h5 className="mb-2">Direct Vendor Products</h5>
              <div className="d-flex justify-content-around">
                <div>
                  <small>Total</small>
                  <h3 className="mb-0" style={{ color: 'orange' }}>
                    {vendorSummary.direct_products?.total || 0}
                  </h3>
                </div>
                <div>
                  <small style={{ color: 'green' }}>Active</small>
                  <h3 className="mb-0" style={{ color: 'green' }}>
                    {vendorSummary.direct_products?.active || 0}
                  </h3>
                </div>
                <div>
                  <small style={{ color: 'red' }}>Inactive</small>
                  <h3 className="mb-0" style={{ color: 'red' }}>
                    {vendorSummary.direct_products?.inactive || 0}
                  </h3>
                </div>
              </div>
            </Card.Body>
          </Card>
        </div>

        {/* DMC Vendor Products */}
        <div className="col-md-6 mt-3">
          <Card className="shadow-sm text-center" style={{ borderTop: '3px solid purple' }}>
            <Card.Body>
              <h5 className="mb-2">DMC Vendor Products</h5>
              <div className="d-flex justify-content-around">
                <div>
                  <small>Total</small>
                  <h3 className="mb-0" style={{ color: 'purple' }}>
                    {vendorSummary.dmc_products?.total || 0}
                  </h3>
                </div>
                <div>
                  <small style={{ color: 'green' }}>Active</small>
                  <h3 className="mb-0" style={{ color: 'green' }}>
                    {vendorSummary.dmc_products?.active || 0}
                  </h3>
                </div>
                <div>
                  <small style={{ color: 'red' }}>Inactive</small>
                  <h3 className="mb-0" style={{ color: 'red' }}>
                    {vendorSummary.dmc_products?.inactive || 0}
                  </h3>
                </div>
              </div>
            </Card.Body>
          </Card>
        </div>
      </div>

      {/* Product Summary Collapsible Section */}
      <Card className="mb-4">
        <Card.Header
          onClick={() => setShowProductSummary(!showProductSummary)}
          style={{ cursor: 'pointer', backgroundColor: '#f8f9fa' }}
        >
          <div className="d-flex justify-content-between align-items-center">
            <h5 className="mb-0 d-flex justify-content-between align-items-center">Product Summary</h5>
            <span>
              {showProductSummary ? (
                <i className="bi bi-chevron-up"></i>
              ) : (
                <i className="bi bi-chevron-down"></i>
              )}
            </span>
          </div>
        </Card.Header>
        <Card.Body className={showProductSummary ? '' : 'd-none'}>
          {/* Vendor Categories */}
          {vendorSummary?.vendor_categories && (
            <div className="row mt-2">
              {Object.entries(vendorSummary.vendor_categories).map(([key, value]) => {
                const categoryTitles = {
                  essentials: 'Essentials',
                  non_essentials: 'Non Essentials',
                  lifestyle: 'Lifestyle',
                  hotels: 'Hotels',
                  education: 'Education',
                };

                const categoryColors = {
                  essentials: '#007bff',
                  non_essentials: '#17a2b8',
                  lifestyle: '#6f42c1',
                  hotels: '#fd7e14',
                  education: '#20c997',
                };

                return (
                  <div key={key} className="col-md-4 mt-3">
                    <Card className="shadow-sm text-center" style={{ borderTop: `3px solid ${categoryColors[key]}` }}>
                      <Card.Body>
                        <h5 className="mb-2">{categoryTitles[key]}</h5>
                        <div className="d-flex justify-content-around">
                          <div>
                            <small>Total</small>
                            <h6>{value.total}</h6>
                          </div>
                          <div>
                            <small style={{ color: 'green' }}>Active</small>
                            <h6 style={{ color: 'green' }}>{value.active}</h6>
                          </div>
                          <div>
                            <small style={{ color: 'red' }}>Inactive</small>
                            <h6 style={{ color: 'red' }}>{value.inactive}</h6>
                          </div>
                        </div>
                      </Card.Body>
                    </Card>
                  </div>
                );
              })}
            </div>
          )}

          {/* Total Products Summary */}
          {vendorSummary?.total_products && (
            <div className="row mt-4">
              <div className="col-md-12">
                <Card className="shadow-sm text-center" style={{ borderTop: '3px solid #6c757d' }}>
                  <Card.Body>
                    <h5 className="mb-2">Total Products Summary</h5>
                    <div className="d-flex justify-content-around">
                      <div>
                        <small>Total</small>
                        <h6>{vendorSummary.total_products.total}</h6>
                      </div>
                      <div>
                        <small style={{ color: 'green' }}>Active</small>
                        <h6 style={{ color: 'green' }}>{vendorSummary.total_products.active}</h6>
                      </div>
                      <div>
                        <small style={{ color: 'red' }}>Inactive</small>
                        <h6 style={{ color: 'red' }}>{vendorSummary.total_products.inactive}</h6>
                      </div>
                    </div>
                  </Card.Body>
                </Card>
              </div>
            </div>
          )}
        </Card.Body>
      </Card>

      {/* Vendor Management Tabs */}
      <Tabs
  activeKey={activeTab}
  onSelect={handleTabChange}
  className="mb-4"
>
  <Tab eventKey="all" title={`All Vendors (${vendorCounts.all})`}>
    <div className="mb-4 row">
      <div className="col-md-6 mb-3 mb-md-0">
        <Form.Group>
          <Form.Label>Search Vendors</Form.Label>
          <Form.Control
            type="text"
            placeholder="Search by name, email, phone..."
            onChange={handleSearchChange}
            value={searchTerm}
          />
        </Form.Group>
      </div>
      <div className="col-md-6">
        <Form.Group>
          <Form.Label>Filter by Country</Form.Label>
          <Form.Select
            value={selectedCountry}
            onChange={handleCountryChange}
          >
            <option value="">All Countries</option>
            {Object.entries(countryCodeToName).map(([code, name]) => (
              <option key={code} value={code}>
                {name}
              </option>
            ))}
          </Form.Select>
        </Form.Group>
      </div>
    </div>
  </Tab>
  
  <Tab eventKey="direct" title={`Direct Vendors (${vendorCounts.direct})`}>
    <div className="mb-4 row">
      <div className="col-md-6 mb-3 mb-md-0">
        <Form.Group>
          <Form.Label>Search Vendors</Form.Label>
          <Form.Control
            type="text"
            placeholder="Search by name, email, phone..."
            onChange={handleSearchChange}
            value={searchTerm}
          />
        </Form.Group>
      </div>
      <div className="col-md-6">
        <Form.Group>
          <Form.Label>Filter by Country</Form.Label>
          <Form.Select
            value={selectedCountry}
            onChange={handleCountryChange}
          >
            <option value="">All Countries</option>
            {Object.entries(countryCodeToName).map(([code, name]) => (
              <option key={code} value={code}>
                {name}
              </option>
            ))}
          </Form.Select>
        </Form.Group>
      </div>
    </div>
  </Tab>
  
  <Tab eventKey="dmc" title={`DMC Vendors (${vendorCounts.dmc})`}>
    <div className="mb-4 row">
      <div className="col-md-6 mb-3 mb-md-0">
        <Form.Group>
          <Form.Label>Search Vendors</Form.Label>
          <Form.Control
            type="text"
            placeholder="Search by name, email, phone..."
            onChange={handleSearchChange}
            value={searchTerm}
          />
        </Form.Group>
      </div>
      <div className="col-md-6">
        <Form.Group>
          <Form.Label>Filter by Country</Form.Label>
          <Form.Select
            value={selectedCountry}
            onChange={handleCountryChange}
          >
            <option value="">All Countries</option>
            {Object.entries(countryCodeToName).map(([code, name]) => (
              <option key={code} value={code}>
                {name}
              </option>
            ))}
          </Form.Select>
        </Form.Group>
      </div>
    </div>
  </Tab>
</Tabs>
      
      {/* Display loading, error, or vendor cards */}
      {loading && vendors.length === 0 ? (
        <div className="text-center py-5">
          <Spinner animation="border" variant="primary" />
          <p className="mt-3">Loading Vendors...</p>
        </div>
      ) : error && vendors.length === 0 ? (
        <div className="alert alert-danger">{error}</div>
      ) : (
        <>
          <div className="mb-3">
            <p>
              Showing {vendors.length} of {pagination.total} vendors
              {searchTerm && <span> matching "{searchTerm}"</span>}
              {selectedCountry && <span> in {countryCodeToName[selectedCountry]}</span>}
            </p>
          </div>
          
          {renderVendorCards()}
          
          {pagination.totalPages > 1 && renderPagination()}
        </>
      )}
      
      {/* Vendor Details Modal */}
      {selectedVendor && (
        <Modal
          show={showDetailsModal}
          onHide={() => setShowDetailsModal(false)}
          size="lg"
        >
          <Modal.Header closeButton>
            <Modal.Title>{selectedVendor.company_name}</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <h5>Basic Information</h5>
            <hr />
            <div className="row mb-4">
              <div className="col-md-6">
                <p><strong>Contact Person:</strong> {`${selectedVendor.first_name || ''} ${selectedVendor.last_name || ''}`.trim() || 'N/A'}</p>
                <p><strong>Email:</strong> {selectedVendor.email || 'N/A'}</p>
                <p><strong>Phone:</strong> {selectedVendor.phone || 'N/A'}</p>
              </div>
              <div className="col-md-6">
                <p><strong>Address:</strong> {selectedVendor.address || 'N/A'}</p>
                <p><strong>Status:</strong> {selectedVendor.status === "1" ? "Active" : "Inactive"}</p>
                <p><strong>Location:</strong> {selectedVendor.lat_long || 'N/A'}</p>
              </div>
            </div>
            
            <h5>Business Description</h5>
            <hr />
            <p>{selectedVendor.business_description || 'No description available.'}</p>
            
            <h5>Category Summary</h5>
            <hr />
            <div className="row">
              <div className="col-md-4 mb-3">
                <Card className="h-100">
                  <Card.Body className="text-center">
                    <h6>Essentials</h6>
                    <h4>{selectedVendor.essentials_count || 0}</h4>
                  </Card.Body>
                </Card>
              </div>
              <div className="col-md-4 mb-3">
                <Card className="h-100">
                  <Card.Body className="text-center">
                    <h6>Non-Essentials</h6>
                    <h4>{selectedVendor.non_essentials_count || 0}</h4>
                  </Card.Body>
                </Card>
              </div>
              <div className="col-md-4 mb-3">
                <Card className="h-100">
                  <Card.Body className="text-center">
                    <h6>Lifestyle</h6>
                    <h4>{selectedVendor.lifestyles_count || 0}</h4>
                  </Card.Body>
                </Card>
              </div>
              <div className="col-md-6 mb-3">
                <Card className="h-100">
                  <Card.Body className="text-center">
                    <h6>Hotels</h6>
                    <h4>{selectedVendor.hotels_count || 0}</h4>
                  </Card.Body>
                </Card>
              </div>
              <div className="col-md-6 mb-3">
                <Card className="h-100">
                  <Card.Body className="text-center">
                    <h6>Education</h6>
                    <h4>{selectedVendor.education_count || 0}</h4>
                  </Card.Body>
                </Card>
              </div>
            </div>
          </Modal.Body>
          <Modal.Footer>
            <Button 
              variant="success" 
              onClick={() => downloadVendorExcel(selectedVendor)}
              disabled={loadingExcel}
            >
              {loadingExcel ? 'Generating...' : 'Download Excel'}
            </Button>
            <Button 
              variant="secondary" 
              onClick={() => setShowDetailsModal(false)}
            >
              Close
            </Button>
          </Modal.Footer>
        </Modal>
      )}
      
      {/* Global loading overlay for Excel generation */}
      {loadingExcel && (
        <div 
          style={{
            position: 'fixed',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            backgroundColor: 'rgba(0, 0, 0, 0.5)',
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            zIndex: 9999
          }}
        >
          <div className="bg-white p-4 rounded d-flex flex-column align-items-center">
            <Spinner animation="border" variant="primary" />
            <p className="mt-2 mb-0">Generating Excel file...</p>
          </div>
        </div>
      )}
    </div>
  );
};

export default VendorStats;