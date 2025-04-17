import React, { useEffect, useState, useCallback, useMemo } from 'react';
import { Card, Badge, Tabs, Tab, Spinner, Modal, Pagination, Form, Button } from 'react-bootstrap';
import axios from 'axios';
import * as XLSX from 'xlsx';
import { debounce } from 'lodash';

const CATEGORY_NAMES = {
  1: 'Essentials',
  2: 'Non-Essentials',
  3: 'Lifestyle',
  4: 'Hotels',
  5: 'Education'
};

const API_VENDORS = [
  { id: 'api1', name: 'Drivado', description: 'Travel API services' },
  { id: 'api2', name: 'TravelNxt', description: 'Travel APIs' },
  { id: 'api3', name: 'Giata', description: 'Hotel content API' },
  { id: 'api4', name: 'Bridgify', description: 'Travel API services' },
  { id: 'api4', name: 'TBO', description: 'Hotel API services' },
  { id: 'api4', name: 'Zetexa', description: 'E-Sim API services' },
  { id: 'api4', name: 'Cebu', description: 'Travel API services' },
  { id: 'api4', name: 'Sebre', description: 'Flight API services' },

];

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
  // const [vendorSummary, setVendorSummary] = useState(null);
  const [vendorSummary, setVendorSummary] = useState({
    total_vendors: 0,
    active_vendors: 0,
    inactive_vendors: 0,
    direct_vendors: 0,
    dmc_vendors: 0,
    vendor_categories: {
      essentials: { total: 0, active: 0, inactive: 0 },
      non_essentials: { total: 0, active: 0, inactive: 0 },
      lifestyle: { total: 0, active: 0, inactive: 0 },
      hotels: { total: 0, active: 0, inactive: 0 },
      education: { total: 0, active: 0, inactive: 0 }
    },
    total_products: { total: 0, active: 0, inactive: 0 }
  });
  const [searchTerm, setSearchTerm] = useState('');
  const [searchInput, setSearchInput] = useState('');

  const [vendorCountries, setVendorCountries] = useState({});

  // Memoized filtered vendors
  // useEffect(() => {
  //   const fetchCountries = async () => {
  //     const countryMap = {};

  //     await Promise.all(
  //       vendorDetails.map(async (vendor) => {
  //         if (vendor.lat_long && !vendorCountries[vendor.lat_long]) {
  //           const [lat, lon] = vendor.lat_long.split(",").map(coord => coord.trim()); // Trim spaces

  //           try {
  //             const response = await axios.get(
  //               `https://nominatim.openstreetmap.org/reverse?lat=${lat}&lon=${lon}&format=json`
  //             );


  //             countryMap[vendor.lat_long] = response.data.address.country || "Unknown";
  //           } catch (error) {
  //             countryMap[vendor.lat_long] = "Unknown";
  //           }
  //         }
  //       })
  //     );

  //     setVendorCountries((prev) => ({ ...prev, ...countryMap }));

  //     console.log(vendorCountries,"vendorCountries")
  //   };

  //   if (vendorDetails.length > 0) {
  //     fetchCountries();
  //   }
  // }, [vendorDetails]);

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

  const filteredVendors = useMemo(() => {
    if (activeVendorType === "API") {
      return API_VENDORS;
    }

    const vendors = Array.isArray(vendorDetails) ? vendorDetails : [];

    const businessTypeMatch = (vendor) => {
      if (activeVendorType === "Direct") {
        return vendor.business_type?.toLowerCase() === "individual";
      } else if (activeVendorType === "DMC") {
        return vendor.business_type?.toLowerCase() === "company";
      }
      return true;
    };

    const typeFiltered = vendors.filter(businessTypeMatch);

    if (activeCategory !== "all") {
      return typeFiltered.filter(
        (vendor) => vendor["Catergory ID"] === activeCategory.toString()
      );
    }

    if (!searchTerm) return typeFiltered;

    const searchTermLower = searchTerm.toLowerCase();

    // Create a reverse mapping from country name to country code
    const countryNameToCode = {};
    Object.entries(countryCodeToName).forEach(([code, name]) => {
      countryNameToCode[name] = code;
    });

    // Add common alternative names for Sri Lanka
    const sriLankaAliases = ["srilanka", "sri lanka", "ceylon"];
    sriLankaAliases.forEach(alias => {
      countryNameToCode[alias] = "LK";
    });

    return typeFiltered.filter((vendor) => {
      // Check basic fields
      if (vendor.company_name?.toLowerCase().includes(searchTermLower)) return true;
      if (`${vendor.first_name || ""} ${vendor.last_name || ""}`.toLowerCase().includes(searchTermLower)) return true;
      if (vendor.address?.toLowerCase().includes(searchTermLower)) return true;
      if (vendor.lat_long?.toLowerCase().includes(searchTermLower)) return true;

      // Check if search term matches a country name
      const searchedCountryCode = countryNameToCode[searchTermLower];

      // Check if vendor country code matches the searched country code
      const vendorCountryCode = vendor.country ||
        (vendor.lifestyles && vendor.lifestyles[0]?.country) ||
        (vendor.education && vendor.education[0]?.country) ||
        (vendor.hotels && vendor.hotels[0]?.country);

      if (searchedCountryCode && vendorCountryCode === searchedCountryCode) return true;

      // Special case for Sri Lanka - also check address and other fields
      if (sriLankaAliases.includes(searchTermLower) &&
        (vendor.address?.toLowerCase().includes("sri lanka") ||
          vendor.address?.toLowerCase().includes("srilanka") ||
          vendor.city?.toLowerCase().includes("sri lanka") ||
          vendor.micro_location?.toLowerCase().includes("sri lanka"))) {
        return true;
      }

      return false;
    });
  }, [vendorDetails, activeVendorType, activeCategory, searchTerm]);

  // Debounced search function
  const debouncedSearch = useCallback(
    debounce((searchValue) => {
      setSearchTerm(searchValue);
    }, 500),
    []
  );

  const handleSearchChange = (e) => {
    setSearchInput(e.target.value);
    debouncedSearch(e.target.value);
  };

  // const getVendorSummary = async () => {
  //   try {
  //     const response = await axios.get('/getVendorSummary');
  //     if (response.data.status === 200) {
  //       console.log(response.data.vendor_summary);
  //       setVendorSummary(response.data.vendor_summary);

  //     }
  //   } catch (error) {
  //     console.error('Error fetching vendor summary:', error);
  //   }
  // };

  const getVendorSummary = async () => {
    try {
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
      }
    } catch (error) {
      console.error('Error fetching vendor summary:', error);
      // Set default values if API fails
      setVendorSummary({
        total_vendors: 0,
        active_vendors: 0,
        inactive_vendors: 0,
        direct_vendors: 0,
        dmc_vendors: 0,
        vendor_categories: {
          essentials: { total: 0, active: 0, inactive: 0 },
          non_essentials: { total: 0, active: 0, inactive: 0 },
          lifestyle: { total: 0, active: 0, inactive: 0 },
          hotels: { total: 0, active: 0, inactive: 0 },
          education: { total: 0, active: 0, inactive: 0 }
        },
        total_products: { total: 0, active: 0, inactive: 0 }
      });
    }
  };

  const getVendorDetailsCategorize = async (page = 1, perPage = 50) => {
    try {
      const response = await axios.get('/getAllVendorsCategorize', {
        params: {
          page,
          per_page: perPage,
          vendor_type: activeVendorType,
          search: searchTerm
        }
      });
      // console.log('response_vendors', response);


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
      console.log(vendorsResponse, "vendor_response");

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

  const downloadVendorExcel = (vendor) => {
    const data = [];

    // Basic Details
    data.push(['Vendor Details', '']);
    data.push(['Company Name', vendor.company_name || 'N/A']);
    data.push(['Contact Name', `${vendor.first_name || ''} ${vendor.last_name || ''}`.trim() || 'N/A']);
    data.push(['Email', vendor.email || 'N/A']);
    data.push(['Phone', vendor.phone || 'N/A']);
    data.push(['', '']);

    // Category Summary
    data.push(['Category Summary', 'Count']);
    Object.entries(CATEGORY_NAMES).forEach(([categoryId, categoryName]) => {
      let count = 0;
      if (categoryName === 'Essentials') count = vendor.essentials?.count || 0;
      else if (categoryName === 'Non-Essentials') count = vendor.non_essentials?.count || 0;
      else if (categoryName === 'Lifestyle') count = vendor.lifestyles?.length || 0;
      else if (categoryName === 'Hotels') count = vendor.hotels?.length || 0;
      else if (categoryName === 'Education') count = vendor.education?.length || 0;
      data.push([categoryName, count]);
    });

    // =======================
    // Detailed Category Section
    // =======================

    // Lifestyles Details
    data.push(['', '']);
    data.push(['Lifestyle Details', '']);
    data.push(['Name', 'City', 'Attraction Type', 'Preferred', 'Micro Location', 'TripAdvisor Link', 'Status']);
    vendor.lifestyles?.forEach(item => {
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

    // Education Details
    data.push(['', '']);
    data.push(['Education Details', '']);
    data.push(['Course Name', 'Medium', 'Mode', 'Group Type', 'Free Session', 'Payment Method', 'Status']);
    vendor.education?.forEach(item => {
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

    // Hotel Details
    data.push(['', '']);
    data.push(['Hotel Details', '']);
    data.push(['Hotel Name', 'Star', 'City', 'Address', 'TripAdvisor', 'Start Date', 'End Date', 'Status']);
    vendor.hotels?.forEach(item => {
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

    // =======================
    // Export to Excel
    // =======================

    const wb = XLSX.utils.book_new();
    const ws = XLSX.utils.aoa_to_sheet(data);

    ws['!cols'] = [{ width: 30 }, { width: 25 }, { width: 25 }, { width: 25 }, { width: 25 }, { width: 30 }];

    XLSX.utils.book_append_sheet(wb, ws, 'Vendor Details');

    const fileName = `Vendor_${vendor.id}_${vendor.company_name || 'details'}.xlsx`;
    XLSX.writeFile(wb, fileName);
  };


  const renderCategoryCounts = (vendor) => {
    // if (activeVendorType !== 'Direct') return null;

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

  const VendorCard = React.memo(({ vendor }) => {
    if (activeVendorType === 'API') {
      return (
        <div className="col-md-6 col-lg-4 mb-4">
          <Card className="shadow-sm h-100" style={{ borderTop: '3px solid #6f42c1' }}>
            <Card.Header style={{ backgroundColor: '#6f42c1', color: 'white' }}>
              <div className="d-flex justify-content-between align-items-center">
                <h5 className="mb-0">{vendor.name}</h5>
                <Badge bg="dark">API</Badge>
              </div>
            </Card.Header>
            <Card.Body>
              <p><strong>Description:</strong> {vendor.description}</p>
            </Card.Body>
            <Card.Footer className="bg-light">
              <Button
                variant="outline-primary"
                size="sm"
                onClick={() => {
                  setSelectedDetails({
                    categoryName: 'API',
                    details: [vendor]
                  });
                  setShowDetailsModal(true);
                }}
                className="w-100"
              >
                <i className="bi bi-info-circle me-2"></i> View Details
              </Button>
            </Card.Footer>
          </Card>
        </div>
      );
    }
    return (
      <div className="col-md-6 col-lg-4 mb-4">
        <Card className="shadow-sm h-100" style={{ borderTop: '3px solid #3c4b64' }}>
          <Card.Header style={{ backgroundColor: '#3c4b64', color: 'white' }}>
            <div className="d-flex justify-content-between align-items-center">
              <h5 className="mb-0">{vendor.company_name || 'Unnamed Vendor'}</h5>
              <Badge bg="dark">ID: {vendor.id}</Badge>
            </div>
          </Card.Header>
          <Card.Body>
            <p><strong>Name:</strong> {vendor.first_name} {vendor.last_name}</p>
            <p><strong>Email:</strong> {vendor.email}</p>
            <p><strong>Phone:</strong> {vendor.phone}</p>

            {activeVendorType === 'Direct' || 'DMC' ? (
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
          <Card.Footer className="bg-light">
            <Button
              variant="outline-primary"
              size="sm"
              onClick={() => downloadVendorExcel(vendor)}
              className="w-100"
            >
              <i className="bi bi-download me-2"></i> Download Excel
            </Button>
          </Card.Footer>
        </Card>
      </div>
    );
  });

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
      if (selectedDetails.categoryName === 'API') {
        return [
          { label: 'API Name', value: detail.name || 'N/A' },
          { label: 'Description', value: detail.description || 'N/A' },
          { label: 'Type', value: 'API Service' }
        ];
      }
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
                          item.value.replace(/<[^>]*>?/gm, '') :
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
      <h1 className="text-center mb-4" style={{ color: '#3c4b64' }}>
        Vendor Categorization
      </h1>

      {vendorSummary && (
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

          {/* Direct Vendors */}
          <div className="col-md-6 mt-3">
            <Card className="shadow-sm text-center" style={{ borderTop: '3px solid orange' }}>
              <Card.Body>
                <div className="d-flex justify-content-between align-items-center">
                  <h5 className="mb-0">Direct Vendors</h5>
                  <h3 className="mb-0" style={{ color: 'orange' }}>{vendorSummary.direct_vendors}</h3>
                </div>
              </Card.Body>
            </Card>
          </div>

          {/* DMC Vendors */}
          <div className="col-md-6 mt-3">
            <Card className="shadow-sm text-center" style={{ borderTop: '3px solid purple' }}>
              <Card.Body>
                <div className="d-flex justify-content-between align-items-center">
                  <h5 className="mb-0">DMC Vendors</h5>
                  <h3 className="mb-0" style={{ color: 'purple' }}>{vendorSummary.dmc_vendors}</h3>
                </div>
              </Card.Body>
            </Card>
          </div>

        </div>
      )}

      {/* Vendor Categories */}
      {vendorSummary?.vendor_categories && (
        <div className="row mt-4">
          {Object.entries(vendorSummary.vendor_categories).map(([key, value]) => {
            // Define category display names and colors
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
  <div className="row mt-4 mb-3">
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



      {/* Search Bar */}
      <div className="mb-4">
        <Form.Control
          type="text"
          placeholder="Search vendors by company name, location..."
          value={searchInput}
          onChange={handleSearchChange}
          style={{ maxWidth: '400px' }}
        />
      </div>

      {/* Vendor Type Tabs */}
      <Tabs
        id="vendor-type-tabs"
        activeKey={activeVendorType}
        onSelect={(key) => {
          setActiveVendorType(key);
          setActiveCategory('all'); // Reset category filter when changing vendor type
          // fetchVendorData(1); // Fetch fresh data for the new vendor type
        }}
        className="mb-3"
      >
        <Tab eventKey="Direct" title={`Direct (${vendorSummary?.direct_vendors || 0})`} />
        <Tab eventKey="DMC" title={`DMC (${vendorSummary?.dmc_vendors || 0})`} />
        <Tab eventKey="API" title={`API (${API_VENDORS.length})`} />

      </Tabs>

      {/* Category Tabs - Hide when in API tab */}
      {activeVendorType !== 'API' && (
        <Tabs
          id="vendor-tabs"
          activeKey={activeCategory}
          onSelect={(key) => setActiveCategory(key)}
          className="mb-4"
        >
          <Tab eventKey="all" title="All Vendors" />
        </Tabs>
      )}

      <div className="row">
        {filteredVendors.length > 0 ? (
          filteredVendors.map(vendor => (
            <VendorCard key={vendor.id} vendor={vendor} />
          ))
        ) : (
          <div className="col-12 text-center py-5">
            <p className="text-danger fw-bold">No vendors found</p>
          </div>
        )}
      </div>

      {/* {activeVendorType !== 'API' && !loading && pagination.total > pagination.per_page && (
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
      )} */}

      {activeVendorType !== 'API' && !loading && pagination.total > pagination.per_page && (
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

            {/* Modified Pagination Items Logic */}
            {(() => {
              const totalPages = pagination.last_page;
              const currentPage = pagination.current_page;
              const delta = 2; // Number of pages to show before and after current page

              let pages = [];

              // Always show first page
              pages.push(1);

              // Calculate range around current page
              const leftBound = Math.max(2, currentPage - delta);
              const rightBound = Math.min(totalPages - 1, currentPage + delta);

              // Add ellipsis after first page if needed
              if (leftBound > 2) {
                pages.push('ellipsis-left');
              }

              // Add pages around current page
              for (let i = leftBound; i <= rightBound; i++) {
                pages.push(i);
              }

              // Add ellipsis before last page if needed
              if (rightBound < totalPages - 1) {
                pages.push('ellipsis-right');
              }

              // Always show last page if it's not the first page
              if (totalPages > 1) {
                pages.push(totalPages);
              }

              // Render pagination items
              return pages.map((page, index) => {
                if (page === 'ellipsis-left' || page === 'ellipsis-right') {
                  return <Pagination.Ellipsis key={page} disabled />;
                }

                return (
                  <Pagination.Item
                    key={`page-${page}`}
                    active={page === currentPage}
                    onClick={() => handlePageChange(page)}
                    style={{
                      backgroundColor: page === currentPage ? '#3c4b64' : 'inherit',
                      color: page === currentPage ? 'white' : 'inherit'
                    }}
                  >
                    {page}
                  </Pagination.Item>
                );
              });
            })()}

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

      {/* {activeVendorType !== 'API' && activeVendorType === ('DMC' || 'Direct') && (
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
      )} */}

      {activeVendorType !== 'API' && (activeVendorType === 'DMC' || activeVendorType === 'Direct') && (
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