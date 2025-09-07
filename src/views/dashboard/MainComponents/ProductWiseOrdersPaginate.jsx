import { CBadge, CButton, CCardImage, CCol, CFormInput, CInputGroup } from '@coreui/react';
import axios from 'axios';
import React, { useEffect, useState, useMemo, useContext } from 'react';
import { createTheme, ThemeProvider } from '@mui/material';
import { MaterialReactTable, useMaterialReactTable } from 'material-react-table';
import CIcon from '@coreui/icons-react';
import { cilInfo } from '@coreui/icons';
import MoreOrderView from 'src/Panels/OrderDetails/MoreOrderView/MoreOrderView';
import OrderDetails from 'src/Panels/OrderDetails/OrderDetails';
import LoaderPanel from 'src/Panels/LoaderPanel';
import { Tab, Tabs } from 'react-bootstrap';
import './ProductWiseOrders.css';
import { CurrencyContext } from 'src/Context/CurrencyContext';
import CurrencyConverter from 'src/Context/CurrencyConverter';
import { Search } from 'react-bootstrap-icons';
import { Clear } from '@material-ui/icons';

export default function ProductWiseOrdersPaginate() {
  const defaultMaterialTheme = createTheme();
  const { currencyData } = useContext(CurrencyContext);

  const [allOrdersProducts, setAllOrdersProducts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [lastUpdatedId, setLastUpdatedId] = useState("");
  const [currentFilters, setCurrentFilters] = useState("All");
  const [moreOrderModal, setMoreOrderModal] = useState(false);
  const [moreOrderModalCategory, setMoreOrderModalCategory] = useState("");
  const [moreOrderDetails, setMoreOrderDetails] = useState("");
  const [mainDataSet, setMainDataSet] = useState([]);
  const [hotelDataSet, setHotelDataSet] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');

  const [pagination, setPagination] = useState({
    pageIndex: 0,
    pageSize: 10,
    totalCount: 0,
  });

  const [statusCounts, setStatusCounts] = useState({
    All: 0,
    CustomerOrdered: 0,
    Approved: 0,
    Completed: 0,
    Cancel: 0
  });

  // Fetch data with debounce
  const fetchData = async (pageIndex, pageSize, statusFilter, search = '') => {
    setLoading(true);
    try {
      const params = {
        page: pageIndex + 1,
        per_page: pageSize,
        status: statusFilter,
      };

      if (search.trim() !== '') {
        params.search = search;
      }

      const response = await axios.get("fetch_all_orders_product_wise", { params });

      if (response.data.status === 200) {
        setAllOrdersProducts(response.data.productData);
        setPagination(prev => ({
          ...prev,
          totalCount: response.data.pagination.total,
        }));
      }
    } catch (error) {
      console.error("Error fetching orders:", error);
    } finally {
      setLoading(false);
    }
  };

  // Fetch status counts
  const fetchStatusCounts = async () => {
    try {
      const statusTypes = ['All', 'CustomerOrdered', 'Approved', 'Completed', 'Cancel'];
      const counts = { All: 0, CustomerOrdered: 0, Approved: 0, Completed: 0, Cancel: 0 };

      // Fetch count for each status
      for (const status of statusTypes) {
        try {
          const response = await axios.get('fetch_all_orders_product_wise', {
            params: {
              page: 1,
              per_page: 1, // We only need the count
              status: status,
            }
          });

          if (response.data.status === 200) {
            counts[status] = response.data.pagination.total;
          }
        } catch (err) {
          console.error(`Error fetching count for ${status}:`, err);
        }
      }

      setStatusCounts(counts);
    } catch (error) {
      console.error('Error fetching status counts:', error);
    }
  };

  useEffect(() => {
    fetchData(pagination.pageIndex, pagination.pageSize, currentFilters);
    fetchStatusCounts();
  }, []);

  useEffect(() => {
    fetchData(pagination.pageIndex, pagination.pageSize, currentFilters, searchTerm);
  }, [pagination.pageIndex, pagination.pageSize, currentFilters]);

  const handleSearch = () => {
    setPagination(prev => ({ ...prev, pageIndex: 0 }));
    fetchData(0, pagination.pageSize, currentFilters, searchTerm);
  };

  const handleClearSearch = () => {
    setSearchTerm('');
    setPagination(prev => ({ ...prev, pageIndex: 0 }));
    fetchData(0, pagination.pageSize, currentFilters);
  };

  // Handle Enter key press in search input
  const handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      handleSearch();
    }
  };

  const handleMoreInfoModal = (row) => {
    setMoreOrderModalCategory(row?.info.catid);

    if (row?.info?.catid === '3') {
      setMoreOrderDetails(row?.info?.lifestyle_booking_id);
    } else if (row?.info?.catid === '1') {
      setMoreOrderDetails(row?.info.essential_pre_order_id);
    } else if (row?.info?.catid === '5') {
      setMoreOrderDetails(row?.info?.booking_id);
    } else if (row?.info?.catid == '4') {
      setHotelDataSet(row?.info);
    }

    setMoreOrderModal(true);
    setMainDataSet(row);
  };

  const columns = [
    {
      accessorKey: 'info',
      header: 'Info',
      Cell: ({ row }) => (
        <CButton style={{ backgroundColor: 'transparent', padding: 0, borderWidth: 0 }} onClick={() => handleMoreInfoModal(row.original)}>
          <CIcon icon={cilInfo} className="text-info" size="xl" />
        </CButton>
      ),
      enableColumnFilter: false,
      enableSorting: false,
    },
    { accessorKey: 'order_id', header: 'Order ID', enableColumnFilter: false },
    {
      accessorKey: 'product_image',
      header: 'Product Image',
      enableSorting: false,
      Cell: ({ row }) => {
        const hasProductImage = row.original.product_image?.trim() !== "";
        const defaultImagePath = "https://play-lh.googleusercontent.com/qoEowqafsAPLEHj5pj-Tfgoj3XuehDt2cEBBe9vvRwyfaaMv3S2SzggQnbAmHx3eB6no=w240-h480-rw";
        const imageUrl = hasProductImage
          ? (row.original.product_image?.split(",")[0]?.includes("http")
            ? row.original.product_image?.split(",")[0]
            : "https://supplier.aahaas.com/" + row.original.product_image?.split(",")[0])
          : defaultImagePath;

        return (
          <div style={{ width: "100px", height: "100px", borderRadius: 20 }}>
            <CCardImage
              src={imageUrl}
              style={{ width: "100%", height: "100%", objectFit: "cover", borderRadius: 20 }}
              onError={(e) => {
                e.target.src = defaultImagePath;
              }}
            />
          </div>
        );
      },
      enableColumnFilter: false
    },
    { accessorKey: 'product_id', header: 'Product ID', enableColumnFilter: false },
    { accessorKey: 'product_title', header: 'Name', enableColumnFilter: false },
    { accessorKey: 'category', header: 'Category', enableColumnFilter: false },
    { accessorKey: 'service_location', header: 'Service Location', enableColumnFilter: false },
    { accessorKey: 'service_date', header: 'Service Date' },
    {
      accessorKey: 'total_amount',
      header: 'Total Amount',
      enableColumnFilter: false,
      Cell: ({ row }) => CurrencyConverter(row.original.currency, row.original.total_amount, currencyData)
    },
    {
      accessorKey: 'paid_amount',
      header: 'Paid Amount',
      enableColumnFilter: false,
      Cell: ({ row }) => CurrencyConverter(row.original.currency, row.original.paid_amount, currencyData)
    },
    {
      accessorKey: 'balance_amount',
      header: 'Balance Amount',
      enableColumnFilter: false,
      Cell: ({ row }) => CurrencyConverter(row.original.currency, row.original.balance_amount, currencyData)
    },
    { accessorKey: 'booked_date', header: 'Booked Date', enableColumnFilter: false }
  ];

  const data = useMemo(() => allOrdersProducts?.map((result, index) => {
   const bookedDate = (result?.catid === '4')
     ? result?.booked_date 
     : result?.checkout_date; 

   return {
     id: (pagination.pageIndex * pagination.pageSize) + index + 1,
     product_id: result?.PID,
     product_image: result?.product_image,
     service_location: result?.location,
     product_title: result?.product_title,
     category: result?.category,
     service_date: result?.service_date,
     balance_amount: result?.balance_amount,
     paid_amount: result?.paid_amount,
     total_amount: result?.total_amount,
     booked_date: bookedDate, 
     info: result,
     order_id: "AHS_" + result?.orderID,
     currency: result?.currency,
   };
 }), [allOrdersProducts, pagination.pageIndex, pagination.pageSize]);
  const rowStyle = (data) => {

    if (data?.info?.orderID == lastUpdatedId) {
      return ({
        backgroundColor: '#C6E9FF',
        color: '#234962',
        fontSize: 18
      })
    }

    if (currentFilters == "All") {
      if (data?.info?.status == "Approved") {
        return ({
          backgroundColor: '#FFEEAF',
          color: '#372E10',
          fontSize: 16
        })
      }
      else if (data?.info?.status == "Completed") {
        return ({
          backgroundColor: '#CEF5D1',
          color: '#07420c',
          fontSize: 16
        })
      }
      else if (data?.info?.status == "Cancel") {
        return ({
          backgroundColor: '#FFD3D3',
          color: '#9C2525',
          fontSize: 16
        })
      }
      else {

      }
    }
  }

  const table = useMaterialReactTable({
    columns,
    data,
    enableSorting: true,
    enableGlobalFilter: false, // We're using our own search
    enableColumnFilters: false,
    manualPagination: true,
    rowCount: pagination.totalCount,
    onPaginationChange: setPagination,
    state: {
      isLoading: loading,             // Add loading state
      showProgressBars: loading,      // Show progress bars during loading
      pagination,
    },
    muiTablePaginationProps: {
      rowsPerPageOptions: [10, 20, 25, 50, 100],
      showFirstLastPageButtons: true,
    },
    muiTableHeadCellProps: ({ column }) => ({
      title: column.getIsSorted()
        ? `Sort by ${column.columnDef.header} ${column.getIsSorted() === 'asc' ? '(Ascending)' : '(Descending)'}`
        : `Sort by ${column.columnDef.header}`,
      sx: {
        '&:hover': {
          cursor: column.getCanSort() ? 'pointer' : 'default',
        },
        position: 'relative',
        overflow: 'visible !important',
        '& .MuiButton-root': {
          position: 'relative',
          zIndex: 11,
        }
      },
    }),
    muiTableHeadProps: {
      sx: {
        background: '#070e1a',
        color: "#fff",
        padding: "15px",
        fontSize: "17px",
        fontWeight: '500',
      },
    },
    muiTableBodyRowProps: ({ row }) => ({
      sx: rowStyle(row.original), // Apply row style based on the data
    }),
    muiTableContainerProps: { sx: { maxHeight: '500px' } },
    enableStickyHeader: true,
  });

  const handleSelect = (key) => {
    setCurrentFilters(key);
    setPagination(prev => ({ ...prev, pageIndex: 0 }));
  };

  return (
    <>
      <div className="mb-3 mt-2" style={{ display: 'flex', justifyContent: 'flex-end' }}>
        <CInputGroup style={{ width: '300px' }}>
          <CFormInput
            placeholder="Search by Order ID..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            onKeyPress={handleKeyPress}
          />
          {searchTerm && (
            <CButton
              color="secondary"
              onClick={handleClearSearch}
              style={{ borderTopLeftRadius: 0, borderBottomLeftRadius: 0 }}
            >
              <Clear />
            </CButton>
          )}
          <CButton
            color="primary"
            onClick={handleSearch}
            style={{ borderTopLeftRadius: 0, borderBottomLeftRadius: 0 }}
          >
            <Search />
          </CButton>
        </CInputGroup>
      </div>

      <MoreOrderView
        show={moreOrderModal}
        onHide={() => setMoreOrderModal(false)}
        preID={moreOrderDetails}
        category={moreOrderModalCategory}
        productViewData
        productViewComponent={
          <OrderDetails
            orderid={mainDataSet}
            orderData={mainDataSet}
            hideStatus={false}
            productViewData
            updatedData={() => fetchData(pagination.pageIndex, pagination.pageSize, currentFilters, searchTerm)}
          />
        }
        hotelsOrderView={hotelDataSet}
      // style={{ zIndex: 10000 }} // Add this
      />

      <Tabs
        defaultActiveKey="All"
        id="orders-tabs"
        className="mt-4"
        style={{ fontSize: 16 }}
        onSelect={handleSelect}
        activeKey={currentFilters}
      >
        <Tab
          eventKey="All"
          title={
            <span className="custom-tab-all">
              All Orders <CBadge color="primary" shape="rounded-pill">{statusCounts.All}</CBadge>
            </span>
          }
        />
        <Tab
          eventKey="CustomerOrdered"
          title={
            <span className="custom-tab-pending">
              Pending <CBadge color="secondary" shape="rounded-pill">{statusCounts.CustomerOrdered}</CBadge>
            </span>
          }
        />
        <Tab
          eventKey="Approved"
          title={
            <span className="custom-tab-ongoing">
              Ongoing <CBadge color="warning" shape="rounded-pill">{statusCounts.Approved}</CBadge>
            </span>
          }
        />
        <Tab
          eventKey="Completed"
          title={
            <span className="custom-tab-completed">
              Completed <CBadge color="success" shape="rounded-pill">{statusCounts.Completed}</CBadge>
            </span>
          }
        />
        <Tab
          eventKey="Cancel"
          title={
            <span className="custom-tab-cancel">
              Cancelled <CBadge color="danger" shape="rounded-pill">{statusCounts.Cancel}</CBadge>
            </span>
          }
        />
      </Tabs>

      <MaterialReactTable table={table} />

    </>
  );
}