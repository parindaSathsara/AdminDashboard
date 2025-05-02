import React, { useState, useEffect, useCallback } from 'react';
import { Card, Pagination, Spinner, Form, Button, Modal, Tabs, Tab, Badge } from 'react-bootstrap';
import axios from 'axios';
import { debounce } from 'lodash';
import * as XLSX from 'xlsx';

const VendorStats = () => {
  const [tabLoading, setTabLoading] = useState(false);
  const [searchLoading, setSearchLoading] = useState(false);
  const [countryLoading, setCountryLoading] = useState(false);
  const [categoryLoading, setCategoryLoading] = useState(false);
  const [categoryCardsLoading, setCategoryCardsLoading] = useState(false);

  const [vendorCache, setVendorCache] = useState({
    all: { data: [], pagination: null },
    direct: { data: [], pagination: null },
    dmc: { data: [], pagination: null },
    api: { data: [], pagination: null }  // Added this line

  });

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
    dmc: 0,
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
  const [selectedCategory, setSelectedCategory] = useState('');
  const [showDetailsModal, setShowDetailsModal] = useState(false);
  const [selectedVendor, setSelectedVendor] = useState(null);
  const [showProductSummary, setShowProductSummary] = useState(true);
  const [vendorDetailsForExcel, setVendorDetailsForExcel] = useState(null);
  const [loadingExcel, setLoadingExcel] = useState(false);
  const [apiSearchTerm, setApiSearchTerm] = useState('');

  // Category names mapping for export
  const CATEGORY_NAMES = {
    1: "Essentials",
    2: "Non-Essentials",
    3: "Lifestyle",
    4: "Hotels",
    5: "Education"
  };

  const API_VENDORS = [
    { id: 'api1', name: 'Drivado', description: 'Travel API services' },
    { id: 'api2', name: 'TravelNxt', description: 'Travel APIs' },
    { id: 'api3', name: 'Giata', description: 'Hotel content API' },
    { id: 'api4', name: 'Bridgify', description: 'Travel API services' },
    { id: 'api5', name: 'TBO', description: 'Hotel API services' },
    { id: 'api6', name: 'Zetexa', description: 'E-Sim API services' },
    { id: 'api7', name: 'Cebu', description: 'Travel API services' },
    { id: 'api8', name: 'Sebre', description: 'Flight API services' },
  ];

  const CATEGORY_OPTIONS = [
    { value: '', label: 'All Categories' },
    { value: 'essentials', label: 'Essentials' },
    { value: 'non_essentials', label: 'Non-Essentials' },
    { value: 'lifestyles', label: 'Lifestyle' },
    { value: 'hotels', label: 'Hotels' },
    { value: 'education', label: 'Education' }
  ];

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


  // Initial data fetches
  useEffect(() => {
    fetchVendors(1);
  }, [activeTab, searchTerm, selectedCountry, selectedCategory, pagination.perPage, vendorCache]);


  const fetchVendors = async (page = 1) => {
    setLoading(true);
    setError(null);
  
    const cacheKey = activeTab;
    const cache = vendorCache[cacheKey];
  
    // Only use cache when no filters are applied
    const useCache = page === 1 && !searchTerm && !selectedCountry && !selectedCategory;
    
    if (useCache && cache && cache.data.length > 0) {
      setVendors(cache.data);
      setPagination(cache.pagination);
      setLoading(false);
      return;
    }
  
    try {
      const vendorType = activeTab === 'all' ? 'All' : activeTab === 'direct' ? 'Direct' : 'DMC';
      console.log("Fetching vendors with parameters:", {
        search_term: searchTerm,
        page,
        per_page: pagination.perPage,
        vendor_type: vendorType,
        country: selectedCountry,
        category: selectedCategory || 'all'
      });
      
      const requestData = {
        search_term: searchTerm,
        page: page,
        per_page: pagination.perPage,
        vendor_type: vendorType,
        country: selectedCountry,
        category: selectedCategory || 'all'
      }
      
      const response = await axios.get('/get-vendors', {
        params: requestData
      });
      
      if (response.data && response.data.data) {
        const newData = response.data.data.data;
        const newPagination = {
          currentPage: response.data.data.current_page,
          totalPages: response.data.data.last_page,
          total: response.data.data.total,
          perPage: response.data.data.per_page
        };
  
        setVendors(newData);
        setPagination(newPagination);
  
        // Update cache only when no filters are applied
        if (useCache) {
          setVendorCache(prev => ({
            ...prev,
            [cacheKey]: {
              data: newData,
              pagination: newPagination
            }
          }));
        }
      }
    } catch (err) {
      console.error('Error fetching vendors:', err);
      setError('Failed to load vendors. Please try again later.');
      setVendors([]);
    } finally {
      setLoading(false);
    }
  };
  // Function to fetch vendor data
  // const fetchVendors = useCallback(async (page = 1) => {
  //   setLoading(true);
  //   setError(null);

  //   const cacheKey = activeTab;
  //   const cache = vendorCache[cacheKey];

  //   // Check cache first
  //   if (cache && cache.data.length > 0 && page === 1 && !searchTerm && !selectedCountry && !selectedCategory) {
  //     setVendors(cache.data);
  //     setPagination(cache.pagination);
  //     setLoading(false);
  //     return;
  //   }

  //   try {
  //     const vendorType = activeTab === 'all' ? 'All' : activeTab === 'direct' ? 'Direct' : 'DMC';

  //     const response = await axios.get('/get-vendors', {
  //       params: {
  //         search_term: searchTerm,
  //         page: page,
  //         per_page: pagination.perPage,
  //         vendor_type: vendorType,
  //         country: selectedCountry,
  //         category: selectedCategory || 'all'
  //       }
  //     });

  //     if (response.data && response.data.data) {
  //       const newData = response.data.data.data;
  //       const newPagination = {
  //         currentPage: response.data.data.current_page,
  //         totalPages: response.data.data.last_page,
  //         total: response.data.data.total,
  //         perPage: response.data.data.per_page
  //       };

  //       setVendors(newData);
  //       setPagination(newPagination);

  //       // Update cache if no filters applied
  //       if (!searchTerm && !selectedCountry && !selectedCategory && page === 1) {
  //         setVendorCache(prev => ({
  //           ...prev,
  //           [cacheKey]: {
  //             data: newData,
  //             pagination: newPagination
  //           }
  //         }));
  //       }
  //     }
  //   } catch (err) {
  //     console.error('Error fetching vendors:', err);
  //     setError('Failed to load vendors. Please try again later.');
  //     setVendors([]);
  //   } finally {
  //     setLoading(false);
  //   }
  // }, [activeTab, searchTerm, selectedCountry, selectedCategory, pagination.perPage, vendorCache]);

  // Fetch detailed vendor data for Excel export
  const fetchVendorDetails = async (vendorId) => {
    try {
      setLoadingExcel(true);
      const response = await axios.get(`/getVendorDetailsById/${vendorId}`);
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
    // const response = await axios.get('/getVendorDetailsById/'+vendor.id);
    // console.log("response", response.data);
    
    // Try to fetch detailed vendor data if available
    let vendorForExcel = vendor;
    try {
      const detailedVendor = await fetchVendorDetails(vendor.id);
      if (detailedVendor) {
        vendorForExcel = detailedVendor;
        console.log("vendorForExcel",vendorForExcel);
        
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
  data.push(['', '']);
  data.push(['Essentials Details', '']);
  data.push(['Product Name', 'Description', 'Category 2', 'Category 3', 'Country', 'Status', 'Price']);
  vendorForExcel.essentials?.forEach(item => {
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
  
  // Non-Essentials Details
  data.push(['', '']);
  data.push(['Non-Essentials Details', '']);
  data.push(['Product Name', 'Description', 'Category 2', 'Category 3', 'Country', 'Status', 'Price']);
  vendorForExcel.non_essentials?.forEach(item => {
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

    // Lifestyles Details
    data.push(['', '']);
    data.push(['Lifestyle Details', '']);
    data.push(['Name', 'City', 'Attraction Type', 'Preferred', 'Micro Location', 'TripAdvisor Link', 'Status']);
    vendorForExcel.lifestyles?.forEach(item => {
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
    vendorForExcel.education?.forEach(item => {
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
    vendorForExcel.hotels?.forEach(item => {
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


    // Export to Excel 
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
      const vendorType = activeTab === 'all' ? 'All' : activeTab === 'direct' ? 'Direct' : 'DMC';
      
      setLoading(true);
      axios.get('/get-vendors', {
        params: {
          search_term: term,
          page: 1,
          per_page: pagination.perPage,
          vendor_type: vendorType,
          country: selectedCountry,
          category: selectedCategory || 'all'
        }
      })
      .then(response => {
        if (response.data && response.data.data) {
          const newData = response.data.data.data;
          const newPagination = {
            currentPage: response.data.data.current_page,
            totalPages: response.data.data.last_page,
            total: response.data.data.total,
            perPage: response.data.data.per_page
          };
          
          setVendors(newData);
          setPagination(newPagination);
        }
      })
      .catch(err => {
        console.error('Error during search:', err);
        setError('Failed to load vendors. Please try again later.');
        setVendors([]);
      })
      .finally(() => {
        setLoading(false);
      });
    }, 300),
    [activeTab, selectedCountry, selectedCategory, pagination.perPage]
  );
  // Handle search input change
  const handleSearchChange = (e) => {
    const term = e.target.value;
    setSearchLoading(true);
    
    // Always update the UI immediately
    setSearchTerm(term);
    
    // Cancel any pending debounced searches
    debouncedSearch.cancel();
    
    // If the search field is cleared, immediately fetch all vendors
    if (term === '') {
      console.log("Search cleared - fetching all vendors");
      // Force a fresh fetch by directly calling the API
      const vendorType = activeTab === 'all' ? 'All' : activeTab === 'direct' ? 'Direct' : 'DMC';
      
      setLoading(true);
      axios.get('/get-vendors', {
        params: {
          search_term: '',  // Explicitly set empty search term
          page: 1,
          per_page: pagination.perPage,
          vendor_type: vendorType,
          country: selectedCountry,
          category: selectedCategory || 'all'
        }
      })
      .then(response => {
        if (response.data && response.data.data) {
          const newData = response.data.data.data;
          const newPagination = {
            currentPage: response.data.data.current_page,
            totalPages: response.data.data.last_page,
            total: response.data.data.total,
            perPage: response.data.data.per_page
          };
          
          // Update state with fresh data
          setVendors(newData);
          setPagination(newPagination);
          
          // Update cache if no other filters
          if (!selectedCountry && !selectedCategory) {
            setVendorCache(prev => ({
              ...prev,
              [activeTab]: {
                data: newData,
                pagination: newPagination
              }
            }));
          }
        }
      })
      .catch(err => {
        console.error('Error fetching vendors after clearing search:', err);
        setError('Failed to load vendors. Please try again later.');
        setVendors([]);
      })
      .finally(() => {
        setLoading(false);
        setSearchLoading(false);
      });
    } else {
      // For non-empty searches, use the debounced search
      debouncedSearch(term);
      
      // Show loading for at least 500ms to prevent flickering
      setTimeout(() => {
        setSearchLoading(false);
      }, 500);
    }
  };
  // Handle API search
  const handleApiSearchChange = (e) => {
    const term = e.target.value.toLowerCase();
    setApiSearchTerm(term);
  };

  // Filter API vendors based on search term
  const filteredApiVendors = API_VENDORS.filter(vendor =>
    vendor.name.toLowerCase().includes(apiSearchTerm) ||
    vendor.description.toLowerCase().includes(apiSearchTerm)
  );

  // Handle country selection
  const handleCountryChange = (e) => {
    const country = e.target.value;
    setCountryLoading(true);
    setSelectedCountry(country);

    // Check cache first if no search term
    if (!searchTerm) {
      const cacheKey = activeTab;
      const cache = vendorCache[cacheKey];

      if (country === '' && cache.data.length > 0) {
        setVendors(cache.data);
        setPagination(cache.pagination);
        setCountryLoading(false);
        return;
      }
    }

    // If no cache hit, fetch from server
    // fetchVendors(1).finally(() => {
    //   setCountryLoading(false);
    // });

    setCountryLoading(false)
  };

  // Handle category selection
  const handleCategoryChange = (e) => {
    const category = e.target.value;
    setCategoryLoading(true);
    setSelectedCategory(category);

    // Check cache first if no search term and no country
    if (!searchTerm && !selectedCountry) {
      const cacheKey = activeTab;
      const cache = vendorCache[cacheKey];

      if (category === '' && cache.data.length > 0) {
        setVendors(cache.data);
        setPagination(cache.pagination);
        setCategoryLoading(false);
        return;
      }
    }

    // If no cache hit, fetch from server
    // fetchVendors(1).finally(() => {
    setCategoryLoading(false);
    // });
  };

  // Handle tab change
  const handleTabChange = (key) => {

    setTabLoading(true);
    setActiveTab(key);
    setSearchTerm('');
    setSelectedCountry('');
    setSelectedCategory('');
    setApiSearchTerm('');

    // Clear current vendors immediately
    setVendors([]);

    if (key !== 'api') {

      setTabLoading(false)
      // setTimeout(() => {
      //   // fetchVendors(1).finally(() => {
      //   //   setTabLoading(false);
      //   // });
      // }, 0);
    } else {
      // Just clear loading for API tab
      setTabLoading(false);
    }
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

  // useEffect(() => {
  //   if (activeTab !== 'api') {
  //     try {
  //       fetchVendors(1);
  //     } catch (error) {
  //       console.error("Error in fetch vendors effect:", error);
  //       setLoading(false);
  //     }
  //   }

  // }, [fetchVendors, activeTab]);

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
  // const renderVendorCards = () => {
  //   if (vendors.length === 0) {
  //     return (
  //       <div className="text-center py-5">
  //         <p>No vendors found. Try adjusting your search or filters.</p>
  //       </div>
  //     );
  //   }

  //   return (
  //     <div className="row">
  //       {loading === true ?  <div className="bg-white p-4 rounded d-flex flex-column align-items-center">
  //           <Spinner animation="border" variant="primary" />
  //           <p className="mt-2 mb-0">Loading Vendors...</p>
  //         </div> :  vendors.map(vendor => (
  //         <div key={vendor.id} className="col-md-6 col-lg-4 mb-4">
  //           <Card className="h-100 shadow-sm">
  //             <Card.Header className="d-flex justify-content-between align-items-center">
  //               <h5 className="m-0 text-truncate" title={vendor.company_name}>
  //                 {vendor.company_name}
  //               </h5>
  //               <Badge bg={vendor.status === "1" ? "success" : "danger"}>
  //                 {vendor.status === "1" ? "Active" : "Inactive"}
  //               </Badge>
  //             </Card.Header>
  //             <Card.Body>
  //               <p className="mb-1">
  //                 <strong>Contact:</strong>{" "}
  //                 {`${vendor.first_name || ''} ${vendor.last_name || ''}`.trim() || 'N/A'}
  //               </p>
  //               <p className="mb-1">
  //                 <strong>Phone:</strong> {vendor.phone || 'N/A'}
  //               </p>
  //               <p className="mb-1">
  //                 <strong>Email:</strong> {vendor.email || 'N/A'}
  //               </p>
  //               <p className="mb-3">
  //                 <strong>Address:</strong>{" "}
  //                 <span title={vendor.address}>{vendor.address || 'N/A'}</span>
  //               </p>

  //               <div className="d-flex flex-wrap mb-2">
  //                 {vendor.essentials_count > 0 && (
  //                   <Badge bg="primary" className="me-1 mb-1">
  //                     Essentials: {vendor.essentials_count}
  //                   </Badge>
  //                 )}
  //                 {vendor.non_essentials_count > 0 && (
  //                   <Badge bg="info" className="me-1 mb-1">
  //                     Non-Essentials: {vendor.non_essentials_count}
  //                   </Badge>
  //                 )}
  //                 {vendor.lifestyles_count > 0 && (
  //                   <Badge bg="secondary" className="me-1 mb-1">
  //                     Lifestyle: {vendor.lifestyles_count}
  //                   </Badge>
  //                 )}
  //                 {vendor.hotels_count > 0 && (
  //                   <Badge bg="warning" text="dark" className="me-1 mb-1">
  //                     Hotels: {vendor.hotels_count}
  //                   </Badge>
  //                 )}
  //                 {vendor.education_count > 0 && (
  //                   <Badge bg="success" className="me-1 mb-1">
  //                     Education: {vendor.education_count}
  //                   </Badge>
  //                 )}
  //               </div>
  //             </Card.Body>
  //             <Card.Footer className="d-flex justify-content-between">
  //               <Button
  //                 variant="outline-primary"
  //                 size="sm"
  //                 onClick={() => showVendorDetails(vendor)}
  //               >
  //                 View Details
  //               </Button>
  //               <Button
  //                 variant="outline-success"
  //                 size="sm"
  //                 onClick={() => downloadVendorExcel(vendor)}
  //                 disabled={loadingExcel}
  //               >
  //                 {loadingExcel ? 'Generating...' : 'Download Excel'}
  //               </Button>
  //             </Card.Footer>
  //           </Card>
  //         </div>
  //       ))}
  //     </div>
  //   );
  // };
  const renderVendorCards2 = () => {
    if (vendors.length === 0) {
      return (
        <div className="text-center py-5">
          <p>No vendors found. Try adjusting your search or filters.</p>
        </div>
      );
    }
  
    return (
      <div className="row">
        {loading === true ? (
          <div className="bg-white p-4 rounded d-flex flex-column align-items-center">
            <Spinner animation="border" variant="primary" />
            <p className="mt-2 mb-0">Loading Vendors...</p>
          </div>
        ) : (
          vendors.map(vendor => (
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
  
                  {vendor.countries && vendor.countries.length > 0 && (
                    <div className="mb-3">
                      <p className="mb-1"><strong>Available Countries:</strong></p>
                      <div className="d-flex flex-wrap gap-1">
                        {vendor.countries.map(country => (
                          <Badge 
                            key={country.country_code} 
                            bg="light" 
                            text="dark"
                            className="border"
                            title={`${country.total_products} products in ${country.country_name}`}
                          >
                            {country.country_name} ({country.total_products})
                          </Badge>
                        ))}
                      </div>
                    </div>
                  )}
  
                  <div className="d-flex flex-wrap mb-2">
                    {selectedCountry ? (
                      <>
                        {'essentials_country_count' in vendor && vendor.essentials_country_count > 0 && (
                          <Badge bg="primary" className="me-1 mb-1">
                            Essentials {countryCodeToName[selectedCountry]}: {vendor.essentials_country_count}
                          </Badge>
                        )}
                        {'non_essentials_country_count' in vendor && vendor.non_essentials_country_count > 0 && (
                          <Badge bg="info" className="me-1 mb-1">
                            Non-Essentials {countryCodeToName[selectedCountry]}: {vendor.non_essentials_country_count}
                          </Badge>
                        )}
                        {'lifestyles_country_count' in vendor && vendor.lifestyles_country_count > 0 && (
                          <Badge bg="secondary" className="me-1 mb-1">
                            Lifestyle {countryCodeToName[selectedCountry]}: {vendor.lifestyles_country_count}
                          </Badge>
                        )}
                        {'hotels_country_count' in vendor && vendor.hotels_country_count > 0 && (
                          <Badge bg="warning" text="dark" className="me-1 mb-1">
                            Hotels {countryCodeToName[selectedCountry]}: {vendor.hotels_country_count}
                          </Badge>
                        )}
                        {'education_country_count' in vendor && vendor.education_country_count > 0 && (
                          <Badge bg="success" className="me-1 mb-1">
                            Education {countryCodeToName[selectedCountry]}: {vendor.education_country_count}
                          </Badge>
                        )}
                      </>
                    ) : (
                      <>
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
                      </>
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
          ))
        )}
      </div>
    );
  };
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
        {loading === true ? (
          <div className="bg-white p-4 rounded d-flex flex-column align-items-center">
            <Spinner animation="border" variant="primary" />
            <p className="mt-2 mb-0">Loading Vendors...</p>
          </div>
        ) : (
          vendors.map(vendor => (
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
                    {selectedCountry ? (
                      <>
                        {'essentials_country_count' in vendor && vendor.essentials_country_count > 0 && (
                          <Badge bg="primary" className="me-1 mb-1">
                            Essentials {countryCodeToName[selectedCountry]}: {vendor.essentials_country_count}
                          </Badge>
                        )}
                        {'non_essentials_country_count' in vendor && vendor.non_essentials_country_count > 0 && (
                          <Badge bg="info" className="me-1 mb-1">
                            Non-Essentials {countryCodeToName[selectedCountry]}: {vendor.non_essentials_country_count}
                          </Badge>
                        )}
                        {'lifestyles_country_count' in vendor && vendor.lifestyles_country_count > 0 && (
                          <Badge bg="secondary" className="me-1 mb-1">
                            Lifestyle {countryCodeToName[selectedCountry]}: {vendor.lifestyles_country_count}
                          </Badge>
                        )}
                        {'hotels_country_count' in vendor && vendor.hotels_country_count > 0 && (
                          <Badge bg="warning" text="dark" className="me-1 mb-1">
                            Hotels {countryCodeToName[selectedCountry]}: {vendor.hotels_country_count}
                          </Badge>
                        )}
                        {'education_country_count' in vendor && vendor.education_country_count > 0 && (
                          <Badge bg="success" className="me-1 mb-1">
                            Education {countryCodeToName[selectedCountry]}: {vendor.education_country_count}
                          </Badge>
                        )}
                      </>
                    ) : (
                      <>
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
                      </>
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
          ))
        )}
      </div>
    );
  };

  // Render API vendor cards
  const renderApiVendorCards = () => {
    if (filteredApiVendors.length === 0) {
      return (
        <div className="text-center py-5">
          <p>No API vendors found matching your search.</p>
        </div>
      );
    }

    return (
      <div className="row">
        {filteredApiVendors.map(vendor => (
          <div key={vendor.id} className="col-md-6 col-lg-4 mb-4">
            <Card className="h-100 shadow-sm">
              <Card.Header className="d-flex justify-content-between align-items-center bg-dark text-white">
                <h5 className="m-0 text-truncate" title={vendor.name}>
                  {vendor.name}
                </h5>
                <Badge bg="info">API</Badge>
              </Card.Header>
              <Card.Body>
                <p className="mb-3">{vendor.description}</p>
                {/* <div className="d-flex justify-content-between mt-auto">
                  <Button
                    variant="outline-dark"
                    size="sm"
                    href={`#/api-details/${vendor.id}`}
                  >
                    View Documentation
                  </Button>
                  <Button
                    variant="success"
                    size="sm"
                    href={`#/api-access/${vendor.id}`}
                  >
                    Get API Access
                  </Button>
                </div> */}
              </Card.Body>
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
      {activeTab !== 'api' && (
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
      )}

      {/* Product Summary Collapsible Section */}
      {activeTab !== 'api' && (
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
                    non_essentials: 'Non-Essentials',
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
      )}

      {/* Vendor Management Tabs */}
      <Tabs
        activeKey={activeTab}
        onSelect={handleTabChange}
        className="mb-4"
      >
        <Tab eventKey="all" title={
          <div className="d-flex align-items-center">
            All Vendors ({vendorCounts.all})
            {tabLoading && activeTab === 'all' &&
              <Spinner animation="border" size="sm" className="ms-2" />
            }
          </div>
        }>
          <div className="mb-4 row">
            <div className="col-md-4 mb-3 mb-md-0">
              <Form.Group>
                <Form.Label>Search Vendors</Form.Label>
                <div className="position-relative">
                  <Form.Control
                    type="text"
                    placeholder="Search by name, email, phone..."
                    onChange={handleSearchChange}
                    value={searchTerm}
                    disabled={tabLoading}
                  />
                  {searchLoading && (
                    <div style={{ position: 'absolute', right: '10px', top: '50%', transform: 'translateY(-50%)' }}>
                      <Spinner animation="border" size="sm" />
                    </div>
                  )}
                </div>
              </Form.Group>
            </div>
            <div className="col-md-4 mb-3 mb-md-0">
              <Form.Group>
                <Form.Label>Filter by Country</Form.Label>
                <div className="position-relative">
                  <Form.Select
                    value={selectedCountry}
                    onChange={handleCountryChange}
                    disabled={tabLoading}
                  >
                    <option value="">All Countries</option>
                    {Object.entries(countryCodeToName).map(([code, name]) => (
                      <option key={code} value={code}>
                        {name}
                      </option>
                    ))}
                  </Form.Select>
                  {countryLoading && (
                    <div style={{ position: 'absolute', right: '30px', top: '50%', transform: 'translateY(-50%)' }}>
                      <Spinner animation="border" size="sm" />
                    </div>
                  )}
                </div>
              </Form.Group>
            </div>
            <div className="col-md-4">
              <Form.Group>
                <Form.Label>Filter by Category</Form.Label>
                <div className="position-relative">
                  <Form.Select
                    value={selectedCategory}
                    onChange={handleCategoryChange}
                    disabled={tabLoading}
                  >
                    {CATEGORY_OPTIONS.map(option => (
                      <option key={option.value} value={option.value}>
                        {option.label}
                      </option>
                    ))}
                  </Form.Select>
                  {categoryLoading && (
                    <div style={{ position: 'absolute', right: '30px', top: '50%', transform: 'translateY(-50%)' }}>
                      <Spinner animation="border" size="sm" />
                    </div>
                  )}
                </div>
              </Form.Group>
            </div>
          </div>
        </Tab>

        <Tab eventKey="direct" title={
          <div className="d-flex align-items-center">
            Direct Vendors ({vendorCounts.direct})
            {tabLoading && activeTab === 'direct' &&
              <Spinner animation="border" size="sm" className="ms-2" />
            }
          </div>
        }>
          <div className="mb-4 row">
            <div className="col-md-4 mb-3 mb-md-0">
              <Form.Group>
                <Form.Label>Search Vendors</Form.Label>
                <div className="position-relative">
                  <Form.Control
                    type="text"
                    placeholder="Search by name, email, phone..."
                    onChange={handleSearchChange}
                    value={searchTerm}
                    disabled={tabLoading}
                  />
                  {searchLoading && (
                    <div style={{ position: 'absolute', right: '10px', top: '50%', transform: 'translateY(-50%)' }}>
                      <Spinner animation="border" size="sm" />
                    </div>
                  )}
                </div>
              </Form.Group>
            </div>
            <div className="col-md-4 mb-3 mb-md-0">
              <Form.Group>
                <Form.Label>Filter by Country</Form.Label>
                <div className="position-relative">
                  <Form.Select
                    value={selectedCountry}
                    onChange={handleCountryChange}
                    disabled={tabLoading}
                  >
                    <option value="">All Countries</option>
                    {Object.entries(countryCodeToName).map(([code, name]) => (
                      <option key={code} value={code}>
                        {name}
                      </option>
                    ))}
                  </Form.Select>
                  {countryLoading && (
                    <div style={{ position: 'absolute', right: '30px', top: '50%', transform: 'translateY(-50%)' }}>
                      <Spinner animation="border" size="sm" />
                    </div>
                  )}
                </div>
              </Form.Group>
            </div>
            <div className="col-md-4">
              <Form.Group>
                <Form.Label>Filter by Category</Form.Label>
                <div className="position-relative">
                  <Form.Select
                    value={selectedCategory}
                    onChange={handleCategoryChange}
                    disabled={tabLoading}
                  >
                    {CATEGORY_OPTIONS.map(option => (
                      <option key={option.value} value={option.value}>
                        {option.label}
                      </option>
                    ))}
                  </Form.Select>
                  {categoryLoading && (
                    <div style={{ position: 'absolute', right: '30px', top: '50%', transform: 'translateY(-50%)' }}>
                      <Spinner animation="border" size="sm" />
                    </div>
                  )}
                </div>
              </Form.Group>
            </div>
          </div>
        </Tab>

        <Tab eventKey="dmc" title={
          <div className="d-flex align-items-center">
            DMC Vendors ({vendorCounts.dmc})
            {tabLoading && activeTab === 'dmc' &&
              <Spinner animation="border" size="sm" className="ms-2" />
            }
          </div>
        }>
          <div className="mb-4 row">
            <div className="col-md-4 mb-3 mb-md-0">
              <Form.Group>
                <Form.Label>Search Vendors</Form.Label>
                <div className="position-relative">
                  <Form.Control
                    type="text"
                    placeholder="Search by name, email, phone..."
                    onChange={handleSearchChange}
                    value={searchTerm}
                    disabled={tabLoading}
                  />
                  {searchLoading && (
                    <div style={{ position: 'absolute', right: '10px', top: '50%', transform: 'translateY(-50%)' }}>
                      <Spinner animation="border" size="sm" />
                    </div>
                  )}
                </div>
              </Form.Group>
            </div>
            <div className="col-md-4 mb-3 mb-md-0">
              <Form.Group>
                <Form.Label>Filter by Country</Form.Label>
                <div className="position-relative">
                  <Form.Select
                    value={selectedCountry}
                    onChange={handleCountryChange}
                    disabled={tabLoading}
                  >
                    <option value="">All Countries</option>
                    {Object.entries(countryCodeToName).map(([code, name]) => (
                      <option key={code} value={code}>
                        {name}
                      </option>
                    ))}
                  </Form.Select>
                  {countryLoading && (
                    <div style={{ position: 'absolute', right: '30px', top: '50%', transform: 'translateY(-50%)' }}>
                      <Spinner animation="border" size="sm" />
                    </div>
                  )}
                </div>
              </Form.Group>
            </div>
            <div className="col-md-4">
              <Form.Group>
                <Form.Label>Filter by Category</Form.Label>
                <div className="position-relative">
                  <Form.Select
                    value={selectedCategory}
                    onChange={handleCategoryChange}
                    disabled={tabLoading}
                  >
                    {CATEGORY_OPTIONS.map(option => (
                      <option key={option.value} value={option.value}>
                        {option.label}
                      </option>
                    ))}
                  </Form.Select>
                  {categoryLoading && (
                    <div style={{ position: 'absolute', right: '30px', top: '50%', transform: 'translateY(-50%)' }}>
                      <Spinner animation="border" size="sm" />
                    </div>
                  )}
                </div>
              </Form.Group>
            </div>
          </div>
        </Tab>

        {/* API Vendors Tab */}
        <Tab eventKey="api" title={
          <div className="d-flex align-items-center">
            API Vendors ({API_VENDORS.length})
            {tabLoading && activeTab === 'api' &&
              <Spinner animation="border" size="sm" className="ms-2" />
            }
          </div>
        }>
          <div className="mb-4">
            <Form.Group>
              <Form.Label>Search API Vendors</Form.Label>
              <div className="position-relative">
                <Form.Control
                  type="text"
                  placeholder="Search by name or description..."
                  onChange={handleApiSearchChange}
                  value={apiSearchTerm}
                  disabled={tabLoading}
                />
              </div>
            </Form.Group>
          </div>

          {renderApiVendorCards()}
        </Tab>
      </Tabs>

      {/* Main content area with loading indication */}
      {activeTab !== 'api' && (
        (tabLoading || searchLoading || countryLoading || categoryLoading) && vendors.length === 0 ? (
          <div className="text-center py-5">
            <Spinner animation="border" variant="primary" />
            <p className="mt-3">
              {tabLoading && `Loading ${activeTab === 'all' ? 'All' : activeTab === 'direct' ? 'Direct' : 'DMC'} Vendors...`}
              {searchLoading && !tabLoading && "Searching vendors..."}
              {countryLoading && !tabLoading && !searchLoading && "Filtering by country..."}
              {categoryLoading && !tabLoading && !searchLoading && !countryLoading && "Filtering by category..."}
            </p>
          </div>
        ) : (
          <>
            <div className="mb-3">
              <p>
                Showing {vendors.length} of {pagination.total} vendors
                {searchTerm && <span> matching "<strong>{searchTerm}</strong>"</span>}
                {selectedCountry && <span> in <strong>{countryCodeToName[selectedCountry]}</strong></span>}
                {selectedCategory && <span> in <strong>{CATEGORY_OPTIONS.find(opt => opt.value === selectedCategory)?.label}</strong></span>}
              </p>
            </div>

            {renderVendorCards()}

            {loading === true ? "" :(pagination.totalPages > 1 && renderPagination())}
          </>
        )
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