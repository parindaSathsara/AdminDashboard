import { CBadge, CButton, CCardImage, CCol } from '@coreui/react';
import axios from 'axios';
import React, { useEffect, useState, useCallback, useMemo, useContext } from 'react';
import { createTheme, ThemeProvider } from '@mui/material';
import { MaterialReactTable, useMaterialReactTable } from 'material-react-table';
import CIcon from '@coreui/icons-react';
import { cilInfo } from '@coreui/icons';
import MoreOrderView from 'src/Panels/OrderDetails/MoreOrderView/MoreOrderView';
import OrderDetails from 'src/Panels/OrderDetails/OrderDetails';
import LoaderPanel from 'src/Panels/LoaderPanel';
import { Tab, Tabs } from 'react-bootstrap';
import './ProductWiseOrders.css';
import { db } from 'src/firebase';
import { collection, onSnapshot } from 'firebase/firestore';
import debounce from 'lodash/debounce';
import { CurrencyContext } from 'src/Context/CurrencyContext';
import CurrencyConverter from 'src/Context/CurrencyConverter';

export default function ProductWiseOrders() {
  const defaultMaterialTheme = createTheme();

  const [allOrdersProducts, setAllOrdersProducts] = useState([]);
  const [statusProducts, setStatusProducts] = useState([]);
  const [allOrdersProductsStatic, setAllOrdersProductsStatic] = useState([]);
  const [customerData, setCustomerData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [lastUpdatedId, setLastUpdatedId] = useState("");
  const [currentFilters, setCurrentFilters] = useState("All");
  const [moreOrderModal, setMoreOrderModal] = useState(false);
  const [moreOrderModalCategory, setMoreOrderModalCategory] = useState("");
  const [moreOrderDetails, setMoreOrderDetails] = useState("");
  const [mainDataSet, setMainDataSet] = useState([]);

  const getAllProductsOrders = async (val) => {
    if (val !== "realtime") {
      setLoading(true);
    }

    await axios.get("fetch_all_orders_product_wise").then(res => {
      if (res.data.status === 200) {
        setAllOrdersProducts(res.data.productData);
        setStatusProducts(res.data.productData);
        setAllOrdersProductsStatic(res.data.productData)

        setCustomerData(res.data.customerData);
        // console.log(res.data);
        setLoading(false);
      }
    }).catch(() => {
      setLoading(false);
    });
  };

  useEffect(() => {
    getAllProductsOrders("load");
  }, []);

  useEffect(() => {
    const unsubscribe = onSnapshot(
      collection(db, 'order_ids'),
      (querySnapshot) => {
        if (!querySnapshot.empty) {
          const lastDocument = querySnapshot.docs[querySnapshot.docs.length - 1];
          setLastUpdatedId(lastDocument.id);

          setTimeout(() => {
            setLastUpdatedId("");
          }, 5000);

          getAllProductsOrders("realtime");
        } else {
          // console.log("No orders found.");
        }
        getAllProductsOrders("realtime");
      },
      (error) => {
        console.error("Error fetching real-time data: ", error);
      }
    );

    return () => unsubscribe();
  }, []);

  const fetchFilteredProducts = useCallback(() => {
    setLoading(true);
    let products = [];
    if (currentFilters === "All") {
      products = allOrdersProductsStatic;
    } else {
      products = allOrdersProductsStatic.filter(filterData => filterData.status === currentFilters);
    }
    setAllOrdersProducts(products);
    setLoading(false);
  }, [currentFilters, allOrdersProductsStatic]);

  const [hotelDataSet, setHotelDataSet] = useState([])

  const handleMoreInfoModal = (row) => {

    console.log(row?.info?.lifestyle_booking_id, "ROWWWWWWWWWW", row?.info?.catid)
    setMoreOrderModalCategory(row?.info.catid);
    if (row?.info?.catid === '3') {

      setMoreOrderDetails(row?.info?.lifestyle_booking_id);
      console.log(row?.info?.lifestyle_booking_id, "LS Booking iD value isss");
    } else if (row?.info?.catid === '1') {
      setMoreOrderDetails(row?.info.essential_pre_order_id);
      console.log(row?.info?.essential_pre_order_id);
    } else if (row?.info?.catid === '5') {
      setMoreOrderDetails(row?.info?.booking_id);
      console.log(row?.info?.booking_id);
    }
    else if (row?.info?.catid == '4') {

      console.log(row, "Info iss valueeee")
      setHotelDataSet(row?.info)
    }

    console.log(row);
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



        return (
          <div style={{ width: "100px", height: "100px", borderRadius: 20 }}>
            <CCardImage
              src={row.original.product_image?.split(",")[0]?.includes("http") ? row.original.product_image?.split(",")[0] : "https://supplier.aahaas.com/" + row.original.product_image?.split(",")[0]}
              style={{ width: "100%", height: "100%", objectFit: "cover", borderRadius: 20 }}
            />
          </div>
        )

      },
      enableColumnFilter: false
    },
    { accessorKey: 'product_id', header: 'Product ID', enableColumnFilter: false },
    { accessorKey: 'product_title', header: 'Name', enableColumnFilter: false },
    { accessorKey: 'category', header: 'Category', enableColumnFilter: false },
    { accessorKey: 'service_location', header: 'Service Location', enableColumnFilter: false },
    { accessorKey: 'service_date', header: 'Service Date', type: 'date', filterPlaceholder: "Select Date" },
    { accessorKey: 'total_amount', header: 'Total Amount', enableColumnFilter: false },
    { accessorKey: 'paid_amount', header: 'Paid Amount', enableColumnFilter: false },
    { accessorKey: 'balance_amount', header: 'Balance Amount', enableColumnFilter: false },
    { accessorKey: 'booked_date', header: 'Booked Date', enableColumnFilter: false }
  ];





  const { currencyData, setCurrencyData } = useContext(CurrencyContext);


  const data = useMemo(() => allOrdersProducts?.map((result) => ({
    product_id: result?.PID,
    product_image: result?.product_image,
    service_location: result?.location,
    product_title: result?.product_title,
    category: result?.category,
    service_date: result?.service_date,
    balance_amount: CurrencyConverter(result?.currency, result?.balance_amount, currencyData),
    paid_amount: CurrencyConverter(result?.currency, result?.paid_amount, currencyData),
    balance_amount: CurrencyConverter(result?.currency, result?.balance_amount, currencyData),
    total_amount: CurrencyConverter(result?.currency, result?.total_amount, currencyData),
    booked_date: result?.checkout_date,
    info: result,
    customerData: result?.customerData,
    order_id: "AHS_" + result?.orderID,
  })), [allOrdersProducts, currencyData]);


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
    initialState: { pagination: { pageSize: 10 } },
    enableSorting: true,
    enableGlobalFilter: true,
    enableColumnFilters: false,
    enablePagination: true,
    enableGrouping: true,
    muiTableProps: {
      muiTableContainerProps: {
        sx: {
          maxHeight: 400,
        },
      },
    },
    muiTablePaginationProps: {
      rowsPerPageOptions: [10, 20, 25, 50, 100],
      showFirstLastPageButtons: false,
      position: 'both',
    },
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
  };

  const debouncedFetchFilteredProducts = useMemo(
    () => debounce(fetchFilteredProducts, 300), [fetchFilteredProducts]
  );

  useEffect(() => {
    debouncedFetchFilteredProducts();
    return () => {
      debouncedFetchFilteredProducts.cancel();
    };
  }, [currentFilters, debouncedFetchFilteredProducts]);



  const onHideModal = () => {
    setMoreOrderModal(false)
    // getAllProductsOrders("realtime");

    // console.log("Passing Dataset")
  }

  const handleUpdateState = () => {

    // console.log("Updating State")
    getAllProductsOrders("realtime");
  }


  console.log(moreOrderDetails, "Props value data issss")

  return (
    <>
      <MoreOrderView
        show={moreOrderModal}
        onHide={() => onHideModal()}
        preID={moreOrderDetails}
        category={moreOrderModalCategory}
        productViewData
        productViewComponent={<OrderDetails orderid={mainDataSet} orderData={mainDataSet} hideStatus={false} productViewData updatedData={() => handleUpdateState()} />}
        hotelsOrderView={hotelDataSet}
      />

      <Tabs
        defaultActiveKey="All"
        id="uncontrolled-tab-example"
        className="mt-4"
        style={{ fontSize: 16 }}
        onSelect={handleSelect}

      >
        <Tab eventKey="All" title={<span className="custom-tab-all">All Orders <span class="badge text-bg-light">{statusProducts.length}</span></span>} />
        <Tab eventKey="CustomerOrdered" title={<span className="custom-tab-pending">Pending <span class=" text-white badge text-bg-secondary">{statusProducts.filter(filterData => filterData?.status == "CustomerOrdered").length}</span></span>} />
        <Tab eventKey="Approved" title={<span className="custom-tab-ongoing">Ongoing <span class=" text-white badge text-bg-warning">{statusProducts.filter(filterData => filterData?.status == "Approved").length}</span></span>} />
        <Tab eventKey="Completed" title={<span className="custom-tab-completed">Completed <span class="text-white  badge text-bg-success">{statusProducts.filter(filterData => filterData?.status == "Completed").length}</span></span>} />
        <Tab eventKey="Cancel" title={<span className="custom-tab-cancel">Cancelled <span class="text-white badge text-bg-danger">{statusProducts.filter(filterData => filterData?.status == "Cancel").length}</span></span>} />
      </Tabs>

      {loading ? (
        <LoaderPanel message={"All orders are being fetched"} />
      ) : (

        <MaterialReactTable table={table} />

      )}
    </>
  );
}
