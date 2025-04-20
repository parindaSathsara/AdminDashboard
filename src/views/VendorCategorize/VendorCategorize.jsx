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
  const [activeSearchTab, setActiveSearchTab] = useState('country');
const [vendorSearchInput, setVendorSearchInput] = useState('');
const [vendorSearchTerm, setVendorSearchTerm] = useState('');
const [searchedVendors, setSearchedVendors] = useState([]);
const [vendorSearchLoading, setVendorSearchLoading] = useState(false);
const [vendorSearchError, setVendorSearchError] = useState(null);
const [vendorSearchPagination, setVendorSearchPagination] = useState({
  current_page: 1,
  per_page: 50,
  total: 0,
  last_page: 1
});
const [detailsPagination, setDetailsPagination] = useState({
  current_page: 1,
  per_page: 10, // Show 10 items per page in the modal
  total: 0,
  last_page: 1
});
  const [selectedCountry, setSelectedCountry] = useState('all');
  const [countryVendors, setCountryVendors] = useState([]);
  const [countryLoading, setCountryLoading] = useState(false);
  const [countryError, setCountryError] = useState(null);

  const [countrySearchInput, setCountrySearchInput] = useState('');
  const [countrySearchTerm, setCountrySearchTerm] = useState('');

  const [showProductSummary, setShowProductSummary] = useState(true);
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
  const [countryPagination, setCountryPagination] = useState({
    current_page: 1,
    per_page: 50,
    total: 0,
    last_page: 1
  });

  useEffect(() => {
    // Switch to country tab when country is selected and no search term is active
    if (selectedCountry !== 'all' && !vendorSearchTerm) {
      setActiveSearchTab('country');
    }
    // Switch to search tab when search term is entered
    else if (vendorSearchTerm) {
      setActiveSearchTab('search');
    }
  }, [selectedCountry, vendorSearchTerm]);



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

  // const filteredVendors = useMemo(() => {
  //   if (activeVendorType === "API") {
  //     return API_VENDORS;
  //   }

  //   const vendors = Array.isArray(vendorDetails) ? vendorDetails : [];

  //   const businessTypeMatch = (vendor) => {
  //     if (activeVendorType === "Direct") {
  //       return vendor.business_type?.toLowerCase() === "individual";
  //     } else if (activeVendorType === "DMC") {
  //       return vendor.business_type?.toLowerCase() === "company";
  //     }
  //     return true;
  //   };

  //   const typeFiltered = vendors.filter(businessTypeMatch);

  //   if (activeCategory !== "all") {
  //     return typeFiltered.filter(
  //       (vendor) => vendor["Catergory ID"] === activeCategory.toString()
  //     );
  //   }

  //   if (!searchTerm) return typeFiltered;

  //   const searchTermLower = searchTerm.toLowerCase();

  //   // Create a reverse mapping from country name to country code
  //   const countryNameToCode = {};
  //   Object.entries(countryCodeToName).forEach(([code, name]) => {
  //     countryNameToCode[name] = code;
  //   });

  //   // Add common alternative names for Sri Lanka
  //   const sriLankaAliases = ["srilanka", "sri lanka", "ceylon"];
  //   sriLankaAliases.forEach(alias => {
  //     countryNameToCode[alias] = "LK";
  //   });

  //   return typeFiltered.filter((vendor) => {
  //     // Check basic fields
  //     if (vendor.company_name?.toLowerCase().includes(searchTermLower)) return true;
  //     if (`${vendor.first_name || ""} ${vendor.last_name || ""}`.toLowerCase().includes(searchTermLower)) return true;
  //     if (vendor.address?.toLowerCase().includes(searchTermLower)) return true;
  //     if (vendor.lat_long?.toLowerCase().includes(searchTermLower)) return true;

  //     // Check if search term matches a country name
  //     const searchedCountryCode = countryNameToCode[searchTermLower];

  //     // Check if vendor country code matches the searched country code
  //     const vendorCountryCode = vendor.country ||
  //       (vendor.lifestyles && vendor.lifestyles[0]?.country) ||
  //       (vendor.education && vendor.education[0]?.country) ||
  //       (vendor.hotels && vendor.hotels[0]?.country);

  //     if (searchedCountryCode && vendorCountryCode === searchedCountryCode) return true;

  //     // Special case for Sri Lanka - also check address and other fields
  //     if (sriLankaAliases.includes(searchTermLower) &&
  //       (vendor.address?.toLowerCase().includes("sri lanka") ||
  //         vendor.address?.toLowerCase().includes("srilanka") ||
  //         vendor.city?.toLowerCase().includes("sri lanka") ||
  //         vendor.micro_location?.toLowerCase().includes("sri lanka"))) {
  //       return true;
  //     }

  //     return false;
  //   });
  // }, [vendorDetails, activeVendorType, activeCategory, searchTerm]);

  // Add debounced search function for country vendors
  const debouncedCountrySearch = useCallback(
    debounce((searchValue) => {
      setCountrySearchTerm(searchValue);
      if (selectedCountry !== 'all') {
        fetchVendorsByCountry(selectedCountry, 1, countryPagination.per_page, searchValue);
      }
    }, 500),
    [selectedCountry, countryPagination.per_page]
  );

  // Add debounced search function for vendor search
const debouncedVendorSearch = useCallback(
  debounce((searchValue) => {
    setVendorSearchTerm(searchValue);
    if (searchValue) {
      searchVendorsByName(searchValue, 1, vendorSearchPagination.per_page);
    } else {
      setSearchedVendors([]);
    }
  }, 500),
  [vendorSearchPagination.per_page]
);

// Add a handler for vendor search input changes
const handleVendorSearchChange = (e) => {
  setVendorSearchInput(e.target.value);
  debouncedVendorSearch(e.target.value);
};

// Add function to search vendors by name
const searchVendorsByName = async (searchTerm, page = 1, perPage = 50) => {
  try {
    setVendorSearchLoading(true);
    setVendorSearchError(null);

    console.log(`Searching vendors with: search=${searchTerm}, page=${page}, per_page=${perPage}`);

    const response = await axios.get('/searchVendors', {
      params: { 
        search: searchTerm,
        page: page,
        per_page: perPage
      }
    });

    console.log('Vendor search response:', response.data);

    if (response.data.status === 200) {
      setSearchedVendors(response.data.vendors || []);
      
      // Store pagination information for vendor search
      setVendorSearchPagination({
        current_page: response.data.current_page || 1,
        per_page: response.data.per_page || perPage,
        total: response.data.total || 0,
        last_page: response.data.last_page || 1
      });
    } else {
      setSearchedVendors([]);
      setVendorSearchError(response.data.message || 'No vendors found');
    }
  } catch (error) {
    console.error('Error searching vendors:', error);
    setVendorSearchError('Failed to search vendors. Please try again.');
    setSearchedVendors([]);
  } finally {
    setVendorSearchLoading(false);
  }
};

// Update the handleVendorSearchPageChange function for pagination
const handleVendorSearchPageChange = (page) => {
  searchVendorsByName(vendorSearchTerm, page, vendorSearchPagination.per_page);
};

  // Add this function to fetch vendors by country
  // Update the fetchVendorsByCountry function to support pagination
  // const fetchVendorsByCountry = async (countryCode, page = 1, perPage = 50) => {
  //   try {
  //     setCountryLoading(true);
  //     setCountryError(null);

  //     console.log(`Fetching vendors for country code: ${countryCode}, page: ${page}, perPage: ${perPage}`);

  //     const response = await axios.get('/getVendorsByCountry', {
  //       params: {
  //         country_code: countryCode,
  //         page: page,
  //         per_page: perPage
  //       }
  //     });

  //     console.log('Country search response:', response.data);

  //     if (response.data.status === 200) {
  //       setCountryVendors(response.data.vendors || []);

  //       // Store pagination information for country vendors
  //       setCountryPagination({
  //         current_page: response.data.current_page || 1,
  //         per_page: response.data.per_page || perPage,
  //         total: response.data.total || 0,
  //         last_page: response.data.last_page || 1
  //       });
  //     } else {
  //       setCountryVendors([]);
  //       setCountryError(response.data.message || 'No vendors found for this country');
  //     }
  //   } catch (error) {
  //     console.error('Error fetching vendors by country:', error);
  //     setCountryError('Failed to fetch vendors by country. Please try again.');
  //     setCountryVendors([]);
  //   } finally {
  //     setCountryLoading(false);
  //   }
  // };

  // Update the fetchVendorsByCountry function to include search
  const fetchVendorsByCountry = async (countryCode, page = 1, perPage = 50, search = '') => {
    try {
      setCountryLoading(true);
      setCountryError(null);

      console.log(`Fetching vendors for country code: ${countryCode}, page: ${page}, perPage: ${perPage}, search: ${search}`);

      const response = await axios.get('/getVendorsByCountry', {
        params: {
          country_code: countryCode,
          page: page,
          per_page: perPage,
          search: search
        }
      });

      console.log('Country search response:', response.data);

      if (response.data.status === 200) {
        setCountryVendors(response.data.vendors || []);

        // Store pagination information for country vendors
        setCountryPagination({
          current_page: response.data.current_page || 1,
          per_page: response.data.per_page || perPage,
          total: response.data.total || 0,
          last_page: response.data.last_page || 1
        });
      } else {
        setCountryVendors([]);
        setCountryError(response.data.message || 'No vendors found for this country');
      }
    } catch (error) {
      console.error('Error fetching vendors by country:', error);
      setCountryError('Failed to fetch vendors by country. Please try again.');
      setCountryVendors([]);
    } finally {
      setCountryLoading(false);
    }
  };

  // Add a handler for country search input changes
  const handleCountrySearchChange = (e) => {
    setCountrySearchInput(e.target.value);
    debouncedCountrySearch(e.target.value);
  };

  // Update the handleCountryPageChange function to include search
  const handleCountryPageChange = (page) => {
    fetchVendorsByCountry(selectedCountry, page, countryPagination.per_page, countrySearchTerm);
  };
  const filteredVendors = useMemo(() => {
    if (activeVendorType === "API") {
      return API_VENDORS;
    }

    if (activeVendorType === "Countries") {
      // For Countries tab, we're already filtering in the backend
      return Array.isArray(vendorDetails) ? vendorDetails : [];
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

    // Check if the search term is a country name
    const searchedCountryCode = Object.entries(countryCodeToName).find(
      ([code, name]) => name === searchTermLower
    )?.[0];

    // Check if search term is a 2-letter country code
    const isCountryCode = searchTerm.length === 2 && /^[a-zA-Z]{2}$/.test(searchTerm);

    return typeFiltered.filter((vendor) => {
      // Basic field checks
      if (vendor.company_name?.toLowerCase().includes(searchTermLower)) return true;
      if (`${vendor.first_name || ""} ${vendor.last_name || ""}`.toLowerCase().includes(searchTermLower)) return true;
      if (vendor.address?.toLowerCase().includes(searchTermLower)) return true;

      // Country code check - either direct match on the vendor's country or in any of the vendor's products
      if (isCountryCode || searchedCountryCode) {
        const codeToCheck = isCountryCode ? searchTerm.toUpperCase() : searchedCountryCode;

        // Check vendor's direct country if available
        if (vendor.country === codeToCheck) return true;

        // Check country in vendor's products
        const hasCountryInLifestyles = vendor.lifestyles?.some(item => item.country === codeToCheck);
        const hasCountryInHotels = vendor.hotels?.some(item => item.country === codeToCheck);
        const hasCountryInEducation = vendor.education?.some(item => item.country === codeToCheck);

        if (hasCountryInLifestyles || hasCountryInHotels || hasCountryInEducation) return true;
      }

      // Special case for Sri Lanka
      if (searchTermLower === "sri lanka" || searchTermLower === "srilanka" || searchTermLower === "ceylon") {
        const hasLKInProducts =
          vendor.lifestyles?.some(item => item.country === "LK") ||
          vendor.hotels?.some(item => item.country === "LK") ||
          vendor.education?.some(item => item.country === "LK");

        if (hasLKInProducts) return true;

        // Also check address fields
        if (vendor.address?.toLowerCase().includes("sri lanka") ||
          vendor.address?.toLowerCase().includes("srilanka") ||
          vendor.city?.toLowerCase().includes("sri lanka") ||
          vendor.micro_location?.toLowerCase().includes("sri lanka")) {
          return true;
        }
      }

      return false;
    });
  }, [vendorDetails, activeVendorType, activeCategory, searchTerm, selectedCountry]);

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
      console.log(`API request with: page=${page}, per_page=${perPage}`); // Add logging

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

  // const fetchVendorData = async (page = 1) => {
  //   try {
  //     setLoading(true);
  //     setError(null);

  //     const vendorsResponse = await getVendorDetailsCategorize(page, pagination.per_page);
  //     console.log(vendorsResponse, "vendor_response");

  //     console.log('API response pagination:', {
  //       current_page: vendorsResponse.current_page,
  //       per_page: vendorsResponse.per_page,
  //       total: vendorsResponse.total
  //     }); // Add this logging

  //     setVendorDetails(vendorsResponse.data);
  //     setPagination({
  //       current_page: vendorsResponse.current_page,
  //       per_page: vendorsResponse.per_page,
  //       total: vendorsResponse.total,
  //       last_page: vendorsResponse.last_page
  //     });
  //   } catch (error) {
  //     setError('Failed to load vendor data. Please try again later.');
  //     console.error('Error fetching vendor data:', error);
  //     setVendorDetails([]);
  //   } finally {
  //     setLoading(false);
  //   }
  // };

  const fetchVendorData = async (page = 1, perPageOverride = null) => {
    try {
      setLoading(true);
      setError(null);

      // Use the override if provided, otherwise use the state value
      const perPageToUse = perPageOverride !== null ? perPageOverride : pagination.per_page;

      console.log(`Fetching vendors with: page=${page}, per_page=${perPageToUse}`);

      const vendorsResponse = await getVendorDetailsCategorize(page, perPageToUse);

      console.log('API response pagination:', {
        current_page: vendorsResponse.current_page,
        per_page: vendorsResponse.per_page,
        total: vendorsResponse.total
      });

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
      if (categoryName === 'Essentials') count = vendor.essentials?.length || 0;
      else if (categoryName === 'Non-Essentials') count = vendor.non_essentials?.length || 0;
      else if (categoryName === 'Lifestyle') count = vendor.lifestyles?.length || 0;
      else if (categoryName === 'Hotels') count = vendor.hotels?.length || 0;
      else if (categoryName === 'Education') count = vendor.education?.length || 0;
      data.push([categoryName, count]);
    });

    // =======================
    // Detailed Category Section
    // =======================

     // Essentials Details
  data.push(['', '']);
  data.push(['Essentials Details', '']);
  data.push(['Product Name', 'Description', 'Category 2', 'Category 3', 'Country', 'Status', 'Price']);
  vendor.essentials?.forEach(item => {
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
  vendor.non_essentials?.forEach(item => {
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
    console.log(vendor, "vendor_details");


    return Object.entries(CATEGORY_NAMES).map(([categoryId, categoryName]) => {
      let count = 0;
      let ids = [];

      if (categoryName === 'Essentials') {
        count = vendor.essentials?.length || 0;
        ids = vendor.essentials?.map(e => e.id) || [];
      } else if (categoryName === 'Non-Essentials') {
        count = vendor.non_essentials?.length || 0;
        ids = vendor.non_essentials?.map(n => n.id) || [];
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

  // const handleShowDetails = (categoryName, vendorId, categoryIds) => {
  //   const vendor = vendorDetails.find(v => v.id === vendorId);
  //   if (!vendor) return;
  //   console.log(vendor, "category_name_vendor_details");
  //   console.log(categoryName, "category_name");
  //   console.log(categoryIds, "category_name_ids");
  //   console.log(vendorId, "category_name_vendorId");

  //   let details = [];

  //   switch (categoryName) {
  //     case 'Essentials':
  //       details = vendor.essentials?.filter(item =>
  //         categoryIds.includes(item.id)
  //       ) || [];
  //       // details = vendor.essentials?.filter(item =>
  //       //   categoryIds.includes(item.id) &&
  //       //   item.productDetails?.category1 === 1
  //       // ) || [];
  //       console.log(details, "Essentials_details");

  //       break;
  //     case 'Non-Essentials':
  //       details = vendor.non_essentials?.filter(item =>
  //         categoryIds.includes(item.id)) || [];
  //       console.log(details, "Non_Essentials_details");

  //       break;
  //     case 'Lifestyle':
  //       details = vendor.lifestyles?.filter(item =>
  //         categoryIds.includes(item.id)
  //       ) || [];
  //       console.log(vendor.lifestyles, "lifestyle_details");

  //       break;
  //     case 'Hotels':
  //       details = vendor.hotels?.filter(item =>
  //         categoryIds.includes(item.id)
  //       ) || [];
  //       break;
  //     case 'Education':
  //       details = vendor.education?.filter(item =>
  //         categoryIds.includes(item.id)
  //       ) || [];
  //       break;
  //     default:
  //       details = [];
  //   }

  //   if (details.length > 0) {
  //     setSelectedDetails({
  //       categoryName,
  //       details
  //     });
  //     setShowDetailsModal(true);
  //   }
  // };

  const handleShowDetails = (categoryName, vendorId, categoryIds) => {
    const vendor = vendorDetails.find(v => v.id === vendorId);
    if (!vendor) return;
    
    let allDetails = [];
  
    switch (categoryName) {
      case 'Essentials':
        allDetails = vendor.essentials || [];
        break;
        
      case 'Non-Essentials':
        allDetails = vendor.non_essentials || [];
        break;
        
      case 'Lifestyle':
        allDetails = vendor.lifestyles?.filter(item =>
          categoryIds.includes(item.id)
        ) || [];
        break;
        
      case 'Hotels':
        allDetails = vendor.hotels?.filter(item =>
          categoryIds.includes(item.id)
        ) || [];
        break;
        
      case 'Education':
        allDetails = vendor.education?.filter(item =>
          categoryIds.includes(item.id)
        ) || [];
        break;
        
      default:
        allDetails = [];
    }
  
    if (allDetails.length > 0) {
      // Calculate pagination
      const totalDetails = allDetails.length;
      const perPage = 10; // 10 items per page in the modal
      const lastPage = Math.ceil(totalDetails / perPage);
      
      setDetailsPagination({
        current_page: 1,
        per_page: perPage,
        total: totalDetails,
        last_page: lastPage
      });
  
      setSelectedDetails({
        categoryName,
        details: allDetails,
        // Store all details, will paginate in the modal
        allDetails: allDetails
      });
      
      setShowDetailsModal(true);
    }
  };
  const handleDetailsPageChange = (page) => {
    if (!selectedDetails || !selectedDetails.allDetails) return;
    
    setDetailsPagination({
      ...detailsPagination,
      current_page: page
    });
  };
  const renderDetailsModal = () => {
    if (!selectedDetails) return null;

    const startIndex = (detailsPagination.current_page - 1) * detailsPagination.per_page;
  const endIndex = startIndex + detailsPagination.per_page;
  const paginatedDetails = selectedDetails.allDetails.slice(startIndex, endIndex);


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
          return [
            { label: 'Product Name', value: detail.listing_title || 'N/A' },
            { label: 'Description', value: detail.listing_description || 'N/A' },
            { label: 'Category', value: `${detail.product_details?.category1 || '1'} (Essentials)` },
            { label: 'Subcategory', value: detail.product_details?.category2 || 'N/A' },
            { label: 'Country', value: detail.country || 'N/A' },
            { label: 'Price', value: detail.price || 'N/A' },
            { label: 'Status', value: detail.lisiting_status === "1" ? 'Active' : 'Inactive' }
          ];

        case 'Non-Essentials':
          return [
            { label: 'Product Name', value: detail.listing_title || 'N/A' },
            { label: 'Description', value: detail.listing_description || 'N/A' },
            { label: 'Category', value: `${detail.product_details?.category1 || '2'} (Non-Essentials)` },
            { label: 'Subcategory', value: detail.product_details?.category2 || 'N/A' },
            { label: 'Country', value: detail.country || 'N/A' },
            { label: 'Price', value: detail.price || 'N/A' },
            { label: 'Status', value: detail.lisiting_status === "1" ? 'Active' : 'Inactive' }
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
          {selectedDetails.categoryName} Details 
          ({selectedDetails.allDetails.length})
        </Modal.Title>
      </Modal.Header>
      <Modal.Body>
        {paginatedDetails.map((detail, index) => (
          <Card key={index} className="mb-4 shadow-sm">
            <Card.Header
              className="bg-light"
              style={{ borderBottom: `2px solid #3c4b64` }}
            >
              <h5 className="mb-0">
                {selectedDetails.categoryName === 'Essentials' || selectedDetails.categoryName === 'Non-Essentials'
                  ? detail.listing_title
                  : detail.product_name || detail.lifestyle_name || detail.hotel_name || detail.course_name || `Item ${startIndex + index + 1}`}
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
              {(detail.product_images || detail.image || detail.hotel_image || detail.image_path) && (
                <div className="mt-2">
                  <img
                    src={detail.product_images || detail.image || detail.hotel_image || detail.image_path}
                    alt="Product"
                    className="img-fluid rounded"
                    style={{ maxHeight: '150px' }}
                  />
                </div>
              )}
            </Card.Body>
          </Card>
        ))}

        {/* Add pagination controls if there are multiple pages */}
        {detailsPagination.last_page > 1 && (
          <div className="d-flex justify-content-center mt-3">
            <Pagination>
              <Pagination.First
                onClick={() => handleDetailsPageChange(1)}
                disabled={detailsPagination.current_page === 1}
              />
              <Pagination.Prev
                onClick={() => handleDetailsPageChange(detailsPagination.current_page - 1)}
                disabled={detailsPagination.current_page === 1}
              />

              {(() => {
                const totalPages = detailsPagination.last_page;
                const currentPage = detailsPagination.current_page;
                const delta = 1; // Show 1 page before and after current page

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
                      key={`details-page-${page}`}
                      active={page === currentPage}
                      onClick={() => handleDetailsPageChange(page)}
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
                onClick={() => handleDetailsPageChange(detailsPagination.current_page + 1)}
                disabled={detailsPagination.current_page === detailsPagination.last_page}
              />
              <Pagination.Last
                onClick={() => handleDetailsPageChange(detailsPagination.last_page)}
                disabled={detailsPagination.current_page === detailsPagination.last_page}
              />
            </Pagination>
          </div>
        )}
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

      {/* {vendorSummary && (
        <div className="row mb-4">

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
      )} */}

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
      {activeVendorType === 'Countries' && selectedCountry !== 'all' && countryVendors.length > 0 && (
        <div className="row mb-4">
          <div className="col-md-6">
            <Card className="shadow-sm text-center" style={{ borderTop: '3px solid #3c4b64' }}>
              <Card.Body>
                <div className="d-flex justify-content-between align-items-center">
                  <h5 className="mb-0">Vendors in {countryCodeToName[selectedCountry]?.charAt(0).toUpperCase() + countryCodeToName[selectedCountry]?.slice(1)}</h5>
                  <h3 className="mb-0" style={{ color: '#3c4b64' }}>{countryVendors.length}</h3>
                </div>
              </Card.Body>
            </Card>
          </div>

          <div className="col-md-6">
            <Card className="shadow-sm text-center" style={{ borderTop: '3px solid #6f42c1' }}>
              <Card.Body>
                <div className="d-flex justify-content-between align-items-center">
                  <h5 className="mb-0">Product Count</h5>
                  <h3 className="mb-0" style={{ color: '#6f42c1' }}>
                    {countryVendors.reduce((total, vendor) => total + (vendor.product_counts?.total_products?.total || 0), 0)}
                  </h3>
                </div>
              </Card.Body>
            </Card>
          </div>
        </div>
      )}

      {/* Vendor Categories */}
      {/* {vendorSummary?.vendor_categories && (
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
      )} */}

      {/* Total Products Summary */}
      {/* {vendorSummary?.total_products && (
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
      )} */}

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

      {/* Search Bar - Hide when in Countries tab */}
      {activeVendorType !== 'Countries' && (
        <div className="mb-4">
          <Form.Control
            type="text"
            placeholder="Search vendors by company name, location..."
            value={searchInput}
            onChange={handleSearchChange}
            style={{ maxWidth: '400px' }}
          />
        </div>
      )}

      {/* Vendor Type Tabs */}
      <Tabs
        id="vendor-type-tabs"
        activeKey={activeVendorType}
        onSelect={(key) => {
          setActiveVendorType(key);
          setActiveCategory('all');
          setSearchInput('');
          setSearchTerm('');

          if (key === 'Countries') {
            // Reset country selection when switching to Countries tab
            setSelectedCountry('all');
            setCountryVendors([]);
          } else {
            // Fetch regular data for other tabs
            fetchVendorData(1);
          }
        }}
        className="mb-3"
      >
        <Tab eventKey="Direct" title={`Direct (${vendorSummary?.direct_vendors || 0})`} />
        <Tab eventKey="DMC" title={`DMC (${vendorSummary?.dmc_vendors || 0})`} />
        <Tab eventKey="API" title={`API (${API_VENDORS.length})`} />
        <Tab eventKey="Countries" title="Countries" />


      </Tabs>
      {/* Country Selector - Only show when Countries tab is active */}
      {activeVendorType === 'Countries' && (
  <div className="mb-4">
    <div className="row">
      <div className="col-md-6">
        <Card className="mb-4">
          <Card.Header className="bg-light">
            <h5 className="mb-0">Search by Country</h5>
          </Card.Header>
          <Card.Body>
            <Form.Label>Select Country</Form.Label>
            <Form.Select
              value={selectedCountry}
              onChange={(e) => {
                const countryCode = e.target.value;
                setSelectedCountry(countryCode);
                setCountryPagination({
                  current_page: 1,
                  per_page: countryPagination.per_page,
                  total: 0,
                  last_page: 1
                });
                setCountrySearchInput('');
                setCountrySearchTerm('');

                if (countryCode !== 'all') {
                  fetchVendorsByCountry(countryCode, 1, countryPagination.per_page, '');
                } else {
                  setCountryVendors([]);
                }
              }}
            >
              <option value="all">Select a Country</option>
              {Object.entries(countryCodeToName).map(([code, name]) => (
                <option key={code} value={code}>
                  {name.charAt(0).toUpperCase() + name.slice(1)} ({code})
                </option>
              ))}
            </Form.Select>

            {selectedCountry !== 'all' && (
              <div className="mt-2 text-info">
                <small>
                  <i className="bi bi-info-circle me-1"></i>
                  Showing vendors from {countryCodeToName[selectedCountry]?.charAt(0).toUpperCase() + countryCodeToName[selectedCountry]?.slice(1) || selectedCountry}
                  {countrySearchTerm && ` matching "${countrySearchTerm}"`}
                </small>
              </div>
            )}
          </Card.Body>
        </Card>
      </div>

      <div className="col-md-6">
        <Card className="mb-4">
          <Card.Header className="bg-light">
            <h5 className="mb-0">Search All Vendors</h5>
          </Card.Header>
          <Card.Body>
            <Form.Label>Search by Company Name</Form.Label>
            <Form.Control
              type="text"
              placeholder="Enter company name to search..."
              value={vendorSearchInput}
              onChange={handleVendorSearchChange}
            />
            {vendorSearchTerm && (
              <div className="mt-2 text-info">
                <small>
                  <i className="bi bi-info-circle me-1"></i>
                  Searching for vendors matching "{vendorSearchTerm}"
                </small>
              </div>
            )}
          </Card.Body>
        </Card>
      </div>
    </div>

    <div className="row">
      {/* Country search results */}
      {selectedCountry !== 'all' && (
        <div className="col-12 mb-4">
          <Card>
            <Card.Header className="bg-primary text-white">
              <h5 className="mb-0">
                Vendors in {countryCodeToName[selectedCountry]?.charAt(0).toUpperCase() + countryCodeToName[selectedCountry]?.slice(1)}
                {countryVendors.length > 0 && ` (${countryVendors.length})`}
              </h5>
            </Card.Header>
            <Card.Body>
              {countryLoading ? (
                <div className="text-center py-5">
                  <Spinner animation="border" variant="primary" />
                  <span className="ms-2">Loading vendors...</span>
                </div>
              ) : countryError ? (
                <div className="alert alert-danger">
                  {countryError}
                </div>
              ) : countryVendors.length === 0 ? (
                <div className="alert alert-info">
                  No vendors found in {countryCodeToName[selectedCountry]?.charAt(0).toUpperCase() + countryCodeToName[selectedCountry]?.slice(1)}
                </div>
              ) : (
                <>
                  <div className="row">
                    {countryVendors.map(vendor => (
                      <VendorCard key={vendor.id} vendor={vendor} />
                    ))}
                  </div>

                  {/* Pagination for country vendors */}
                  {countryVendors.length > 0 && countryPagination.total > countryPagination.per_page && (
                    <div className="d-flex justify-content-center mt-4">
                      <Pagination>
                        <Pagination.First
                          onClick={() => handleCountryPageChange(1)}
                          disabled={countryPagination.current_page === 1}
                        />
                        <Pagination.Prev
                          onClick={() => handleCountryPageChange(countryPagination.current_page - 1)}
                          disabled={countryPagination.current_page === 1}
                        />

                        {(() => {
                          const totalPages = countryPagination.last_page;
                          const currentPage = countryPagination.current_page;
                          const delta = 2;

                          let pages = [];
                          pages.push(1);

                          if (currentPage - delta > 2) {
                            pages.push('ellipsis-left');
                          }

                          for (let i = Math.max(2, currentPage - delta); i <= Math.min(totalPages - 1, currentPage + delta); i++) {
                            pages.push(i);
                          }

                          if (currentPage + delta < totalPages - 1) {
                            pages.push('ellipsis-right');
                          }

                          if (totalPages > 1) {
                            pages.push(totalPages);
                          }

                          return pages.map((page, index) => {
                            if (page === 'ellipsis-left' || page === 'ellipsis-right') {
                              return <Pagination.Ellipsis key={page} disabled />;
                            }

                            return (
                              <Pagination.Item
                                key={`country-page-${page}`}
                                active={page === currentPage}
                                onClick={() => handleCountryPageChange(page)}
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
                          onClick={() => handleCountryPageChange(countryPagination.current_page + 1)}
                          disabled={countryPagination.current_page === countryPagination.last_page}
                        />
                        <Pagination.Last
                          onClick={() => handleCountryPageChange(countryPagination.last_page)}
                          disabled={countryPagination.current_page === countryPagination.last_page}
                        />
                      </Pagination>
                    </div>
                  )}

                  {/* Items per page selector for country vendors */}
                  <div className="d-flex justify-content-end mb-3 mt-3">
                    <select
                      className="form-select w-auto"
                      value={countryPagination.per_page.toString()}
                      onChange={(e) => {
                        const newPerPage = parseInt(e.target.value);
                        console.log(`Changed country per_page to: ${newPerPage}`);
                        setCountryPagination({ ...countryPagination, per_page: newPerPage });
                        fetchVendorsByCountry(selectedCountry, 1, newPerPage, countrySearchTerm);
                      }}
                    >
                      <option value="10">10 per page</option>
                      <option value="25">25 per page</option>
                      <option value="50">50 per page</option>
                      <option value="100">100 per page</option>
                    </select>
                  </div>
                </>
              )}
            </Card.Body>
          </Card>
        </div>
      )}

      {/* Vendor search results */}
      {vendorSearchTerm && (
        <div className="col-12 mb-4">
          <Card>
            <Card.Header className="bg-info text-white">
              <h5 className="mb-0">
                Search Results for "{vendorSearchTerm}"
                {searchedVendors.length > 0 && ` (${vendorSearchPagination.total})`}
              </h5>
            </Card.Header>
            <Card.Body>
              {vendorSearchLoading ? (
                <div className="text-center py-5">
                  <Spinner animation="border" variant="info" />
                  <span className="ms-2">Searching vendors...</span>
                </div>
              ) : vendorSearchError ? (
                <div className="alert alert-danger">
                  {vendorSearchError}
                </div>
              ) : searchedVendors.length === 0 ? (
                <div className="alert alert-info">
                  No vendors found matching "{vendorSearchTerm}"
                </div>
              ) : (
                <>
                  <div className="row">
                    {searchedVendors.map(vendor => (
                      <VendorCard key={vendor.id} vendor={vendor} />
                    ))}
                  </div>

                  {/* Pagination for vendor search results */}
                  {searchedVendors.length > 0 && vendorSearchPagination.total > vendorSearchPagination.per_page && (
                    <div className="d-flex justify-content-center mt-4">
                      <Pagination>
                        <Pagination.First
                          onClick={() => handleVendorSearchPageChange(1)}
                          disabled={vendorSearchPagination.current_page === 1}
                        />
                        <Pagination.Prev
                          onClick={() => handleVendorSearchPageChange(vendorSearchPagination.current_page - 1)}
                          disabled={vendorSearchPagination.current_page === 1}
                        />

                        {(() => {
                          const totalPages = vendorSearchPagination.last_page;
                          const currentPage = vendorSearchPagination.current_page;
                          const delta = 2;

                          let pages = [];
                          pages.push(1);

                          if (currentPage - delta > 2) {
                            pages.push('ellipsis-left');
                          }

                          for (let i = Math.max(2, currentPage - delta); i <= Math.min(totalPages - 1, currentPage + delta); i++) {
                            pages.push(i);
                          }

                          if (currentPage + delta < totalPages - 1) {
                            pages.push('ellipsis-right');
                          }

                          if (totalPages > 1) {
                            pages.push(totalPages);
                          }

                          return pages.map((page, index) => {
                            if (page === 'ellipsis-left' || page === 'ellipsis-right') {
                              return <Pagination.Ellipsis key={page} disabled />;
                            }

                            return (
                              <Pagination.Item
                                key={`vendor-search-page-${page}`}
                                active={page === currentPage}
                                onClick={() => handleVendorSearchPageChange(page)}
                                style={{
                                  backgroundColor: page === currentPage ? '#17a2b8' : 'inherit',
                                  color: page === currentPage ? 'white' : 'inherit'
                                }}
                              >
                                {page}
                              </Pagination.Item>
                            );
                          });
                        })()}

                        <Pagination.Next
                          onClick={() => handleVendorSearchPageChange(vendorSearchPagination.current_page + 1)}
                          disabled={vendorSearchPagination.current_page === vendorSearchPagination.last_page}
                        />
                        <Pagination.Last
                          onClick={() => handleVendorSearchPageChange(vendorSearchPagination.last_page)}
                          disabled={vendorSearchPagination.current_page === vendorSearchPagination.last_page}
                        />
                      </Pagination>
                    </div>
                  )}

                  {/* Items per page selector for vendor search */}
                  <div className="d-flex justify-content-end mb-3 mt-3">
                    <select
                      className="form-select w-auto"
                      value={vendorSearchPagination.per_page.toString()}
                      onChange={(e) => {
                        const newPerPage = parseInt(e.target.value);
                        console.log(`Changed search per_page to: ${newPerPage}`);
                        setVendorSearchPagination({ ...vendorSearchPagination, per_page: newPerPage });
                        searchVendorsByName(vendorSearchTerm, 1, newPerPage);
                      }}
                    >
                      <option value="10">10 per page</option>
                      <option value="25">25 per page</option>
                      <option value="50">50 per page</option>
                      <option value="100">100 per page</option>
                    </select>
                  </div>
                </>
              )}
            </Card.Body>
          </Card>
        </div>
      )}

      {selectedCountry === 'all' && !vendorSearchTerm && (
        <div className="col-12 text-center py-5">
          <p className="text-muted">Please select a country or search for vendors</p>
        </div>
      )}
    </div>
  </div>
)}
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
        {activeVendorType === 'Countries' ? (
          <div className="col-12">
            {countryLoading ? (
              <div className="text-center py-5">
                <Spinner animation="border" variant="primary" />
                <span className="ms-2">Loading vendors for {countryCodeToName[selectedCountry]?.charAt(0).toUpperCase() + countryCodeToName[selectedCountry]?.slice(1)}...</span>
              </div>
            ) : countryError ? (
              <div className="text-center py-5">
                <div className="alert alert-danger">
                  {countryError}
                </div>
              </div>
            ) : selectedCountry === 'all' ? (
              <div className="text-center py-5">
                <p className="text-muted">Please select a country to view vendors</p>
              </div>
            ) : (
              <>
                <div className="row">
                  {countryVendors.length > 0 ? (
                    countryVendors.map(vendor => (
                      <VendorCard key={vendor.id} vendor={vendor} />
                    ))
                  ) : (
                    <div className="col-12 text-center py-5">
                      <p className="text-danger fw-bold">No vendors found for {countryCodeToName[selectedCountry]?.charAt(0).toUpperCase() + countryCodeToName[selectedCountry]?.slice(1)}</p>
                    </div>
                  )}
                </div>

                {/* Pagination for country vendors */}
                {countryVendors.length > 0 && countryPagination.total > countryPagination.per_page && (
                  <div className="d-flex justify-content-center mt-4">
                    <Pagination>
                      <Pagination.First
                        onClick={() => handleCountryPageChange(1)}
                        disabled={countryPagination.current_page === 1}
                      />
                      <Pagination.Prev
                        onClick={() => handleCountryPageChange(countryPagination.current_page - 1)}
                        disabled={countryPagination.current_page === 1}
                      />

                      {(() => {
                        const totalPages = countryPagination.last_page;
                        const currentPage = countryPagination.current_page;
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
                              key={`country-page-${page}`}
                              active={page === currentPage}
                              onClick={() => handleCountryPageChange(page)}
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
                        onClick={() => handleCountryPageChange(countryPagination.current_page + 1)}
                        disabled={countryPagination.current_page === countryPagination.last_page}
                      />
                      <Pagination.Last
                        onClick={() => handleCountryPageChange(countryPagination.last_page)}
                        disabled={countryPagination.current_page === countryPagination.last_page}
                      />
                    </Pagination>
                  </div>
                )}

                {/* Items per page selector for country vendors */}
                <div className="d-flex justify-content-end mb-3 mt-3">
                  <select
                    className="form-select w-auto"
                    value={countryPagination.per_page.toString()}
                    onChange={(e) => {
                      const newPerPage = parseInt(e.target.value);
                      console.log(`Changed per_page to11: ${newPerPage}`); // Add logging
                      setCountryPagination({ ...countryPagination, per_page: newPerPage });
                      fetchVendorsByCountry(selectedCountry, 1, newPerPage);
                    }}
                  >
                    <option value="10">10 per page</option>
                    <option value="25">25 per page</option>
                    <option value="50">50 per page</option>
                    <option value="100">100 per page</option>
                  </select>
                </div>
              </>
            )}
          </div>
        ) : (
          // Your existing non-country code here
          filteredVendors.length > 0 ? (
            filteredVendors.map(vendor => (
              <VendorCard key={vendor.id} vendor={vendor} />
            ))
          ) : (
            <div className="col-12 text-center py-5">
              <p className="text-danger fw-bold">No vendors found</p>
            </div>
          )
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

      {activeVendorType !== 'API' && activeVendorType !== 'Countries' && !loading && pagination.total > pagination.per_page && (
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
              const newPerPage = parseInt(e.target.value);
              console.log(`Changed per_page to: ${newPerPage}`);
              setPagination({ ...pagination, per_page: newPerPage });
              fetchVendorData(1, newPerPage); // Pass the new per_page value directly
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