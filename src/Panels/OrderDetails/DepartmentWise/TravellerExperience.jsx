import React, { useContext, useEffect, useState } from 'react'
import MaterialTable from 'material-table'
import CIcon from '@coreui/icons-react'
import { cilCheckCircle, cilInfo } from '@coreui/icons'
import Modal from 'react-bootstrap/Modal'
import DeliveryDetails from 'src/Panels/DeliveryDetails/DeliveryDetails'
import axios from 'axios'
import Swal from 'sweetalert2'
import rowStyle from '../Components/rowStyle'

import {
  CBadge,
  CButton,
  CFormInput,
  CFormSelect,
  CCloseButton,
  CCol,
  COffcanvas,
  COffcanvasHeader,
  COffcanvasTitle,
  CRow,
} from '@coreui/react'

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faSpinner } from '@fortawesome/free-solid-svg-icons'

import Tooltip from '@mui/material/Tooltip'

import './TravellerExperience.css'
import { render } from '@testing-library/react'
import { UserLoginContext } from 'src/Context/UserLoginContext'
import DatePicker from 'react-datepicker'
import 'react-datepicker/dist/react-datepicker.css'

export default function TravellerExperience(props) {
  const { userData } = useContext(UserLoginContext)
  const customPopoverStyle = {
    '--cui-popover-max-width': '400px',
    '--cui-popover-border-color': '#0F1A36',
    '--cui-popover-header-bg': '#0F1A36',
    '--cui-popover-header-color': 'var(--cui-white)',
    '--cui-popover-body-padding-x': '1rem',
    '--cui-popover-body-padding-y': '.5rem',
  }

  // const productData = props.dataset;

  const [productData, setProductData] = useState([])

  // newly added start
  const [discountData, setDiscountData] = useState(false);
  const [discountDataSet, setDiscountDataSet] = useState([]);

useEffect(() => {
  setProductData(props.dataset);
  console.log(props.dataset, "Product Data");

  if (props.dataset && props.dataset[0]?.discountData !== null) {
    setDiscountData(true);
    setDiscountDataSet(props.dataset[0]?.discountData);
    console.log(props.dataset[0]?.discountData, "Discount Data");
    console.log(discountDataSet, "Discount Data Set");
    
    
  } else {
    setDiscountData(false); // optional, in case it should reset
  }
}, [props.dataset]);

// Create a function to determine if a row has discount data
const hasDiscountData = (rowData) => {
  return rowData?.data?.discountData !== null && rowData?.data?.discountData !== undefined;
};

// newly added end


  // useEffect(() => {
  //   setProductData(props.dataset)
  // }, [props.dataset])

  // console.log(productData, "Productttttttt")

  const [driverAllocationStatus, setDriverAllocationStatus] = useState({
    status: false,
    data: [],
  })

  const [travellerData, setTravellerData] = useState({
    pid: '',
    delivery_date: '',
    reconfirmation_date: '',
    qc: '',
    delivery_status: '',
    location1: '',
  })

  const handleInputFields = (name, value) => {
    // console.log([name, value], 'hjhjhjhjhjh');
    setTravellerData({ ...travellerData, [name]: value })
    // console.log(travellerData.reconfirmationDate);
  }

  // const createTravellerExperience = async (travellerData) => {

  //     console.log(travellerData, 'traveller new data');
  //     var returnData = []

  //     await axios.post(`/create_traveller_experience`, travellerData).then((res) => {
  // console.log(res, 'traveller Experience')
  //         if (res.data.status === 200) {
  //             returnData = res.data
  //         }

  //     }).catch((err) => {
  //         throw new Error(err);
  //     })

  //     // return returnData

  // }

  const createTravellerExperience = async (rowData, idx) => {
    const data = {
      pid: rowData?.data?.checkoutID,
      delivery_date: rowData?.delivery_date,
      reconfirmation_date: productData[idx]?.reconfirmationDate ? productData[idx]?.reconfirmationDate : rowData?.reconfirmationDate,
      qc: productData[idx]?.qc ? productData[idx]?.qc : rowData?.qc,
      delivery_status: productData[idx]?.deliveryStatus ? productData[idx]?.deliveryStatus : rowData?.deliveryStatus,
      location1: '',
    }

    console.log(data, "Data values areeeee1233123123123")


    if (!data.reconfirmation_date || !data.qc || !data.delivery_status) {
      Swal.fire({
        text: 'Please fill all the required fields',
        icon: 'error',
      })
      return
    }

    try {
      Swal.showLoading()
      const response = await axios.post(`/create_traveller`, data)
      if (response.data.status == 200) {
        await axios
          .post(
            `${axios.defaults.url}/sendConfirmationMail/${rowData?.data?.checkoutID
            }/${'CompletedDelivery'}`,
          )
          .then((res) => {
            Swal.hideLoading()
            // console.log('res',res.data)

            if (res.data.status === 200) {
              Swal.fire({
                title: 'Traveller Details Updated Successfully',
                text: '',
                icon: 'success',
              })
              props.reload()
            }
          })
          .catch((err) => {
            console.log(err, 'Error')
          })

        props.reload()
      } else if (response.data.status == 400) {
        console.log('res', response.data)
        Swal.fire({
          title: 'Failed to Proceed the Order',
          text: response.data.validation_errors.reconfirmation_date[0],
          icon: 'error',
        })
      } else if (response.data.status == 410) {
        Swal.fire({
          text: 'Failed to Proceed the Order',
          icon: 'error',
        })
      }
    } catch (error) {
      // console.error('Error creating traveller experience:', error);
      throw error // Rethrow the error to handle it at a higher level if necessary
    }
  }

  const QuantityContainer = ({ data }) => {
    // console.log(data, "Data Value is")

    if (data.category == 'Education') {
      return (
        <CCol style={{ width: '320px' }}>
          <CRow>
            <CCol style={{ flex: 2 }}>
              <h6>Max Adult Occupancy</h6>
            </CCol>
            <CCol style={{ flex: 0.7, textAlign: 'right' }}>
              <h6>{data.MaxAdultOccupancy}</h6>
            </CCol>
          </CRow>
          <CRow>
            <CCol style={{ flex: 2 }}>
              <h6>Max Child Occupancy</h6>
            </CCol>
            <CCol style={{ flex: 0.7, textAlign: 'right' }}>
              <h6>{data.MaxChildOccupancy}</h6>
            </CCol>
          </CRow>
          <CRow>
            <CCol style={{ flex: 2 }}>
              <h6>Total Occupancy</h6>
            </CCol>
            <CCol style={{ flex: 0.7, textAlign: 'right' }}>
              <h6>{data.TotalOccupancy}</h6>
            </CCol>
          </CRow>
        </CCol>
      )
    } else if (data.category == 'Essentials/Non Essentials') {
      return (
        <CCol style={{ width: '320px' }}>
          <CRow>
            <CCol style={{ flex: 2 }}>
              <h6>Quantity</h6>
            </CCol>
            <CCol style={{ flex: 0.7, textAlign: 'right' }}>
              <h6>{data.Quantity}</h6>
            </CCol>
          </CRow>

          <CRow>
            <CCol style={{ flex: 2 }}>
              <h6>SKU</h6>
            </CCol>
            <CCol style={{ flex: 0.7, textAlign: 'right' }}>
              <h6>
                {data.SKU} {data.Unit}
              </h6>
            </CCol>
          </CRow>
        </CCol>
      )
    } else if (data.category == 'Lifestyles') {
      return (
        <CCol style={{ width: '320px' }}>
          <CRow>
            <CCol style={{ flex: 2 }}>
              <h6>Adult Count</h6>
            </CCol>
            <CCol style={{ flex: 0.7, textAlign: 'right' }}>
              <h6>{data.AdultCount}</h6>
            </CCol>
          </CRow>

          <CRow>
            <CCol style={{ flex: 2 }}>
              <h6>Child Count</h6>
            </CCol>
            <CCol style={{ flex: 0.7, textAlign: 'right' }}>
              <h6>{data.ChildCount}</h6>
            </CCol>
          </CRow>

          {data.ChildCount > 0 ? (
            <CRow>
              <CCol style={{ flex: 2 }}>
                <h6>Child Ages</h6>
              </CCol>
              <CCol style={{ flex: 0.7, textAlign: 'right' }}>
                <h6>{data.Age}</h6>
              </CCol>
            </CRow>
          ) : null}

          <CRow>
            <CCol style={{ flex: 2 }}>
              <h6>Total Occupancy</h6>
            </CCol>
            <CCol style={{ flex: 0.7, textAlign: 'right' }}>
              <h6>{data.TotalOccupancy}</h6>
            </CCol>
          </CRow>

          <CRow>
            <CCol style={{ flex: 2 }}>
              <h6>Max Adult Occupancy</h6>
            </CCol>
            <CCol style={{ flex: 0.7, textAlign: 'right' }}>
              <h6>{data.MaxAdultOccupancy}</h6>
            </CCol>
          </CRow>

          <CRow>
            <CCol style={{ flex: 2 }}>
              <h6>Max Child Occupancy</h6>
            </CCol>
            <CCol style={{ flex: 0.7, textAlign: 'right' }}>
              <h6>{data.MaxChildOccupancy}</h6>
            </CCol>
          </CRow>
        </CCol>
      )
    }
  }

  const qcValues = ['Approved', 'Pending']
  const deliveryStatusValues = ['Delivered', 'Pending']

  const [mapView, setMapView] = useState(false)

  const [mapViewData, setMapViewData] = useState([])

  const [allocateProductData, setAllocateProductData] = useState({});

  const getMapView = async (data) => {
    setMapView(true)
    setMapViewData(data)
  }

  const [driverId, setDriverId] = useState('')
  const handleClickDriverAllocation = (dataset) => {
    // console.log(dataset, "Dataset Value is")
    setAllocateProductData(dataset?.data);
    if (dataset.data.category === 'Lifestyles') {
      setDriverId(dataset.data.vehicle_driver_id)
      setDriverAllocationStatus({ status: true, data: dataset })
    } else {
      alert('Driver allocation is avaliable only for lifestyle products')
    }
  }

  const getDisableStatus = (rowData) => {
    // console.log(rowData, "Rowwwww")

    if (
      rowData?.data?.status == 'Cancel' ||
      rowData?.data?.status == 'CustomerOrdered' ||
      rowData?.data?.status == 'Completed'
    ) {
      return true
    }

    if (
      rowData?.data?.status == 'Cancel' ||
      rowData?.data?.status == 'CustomerOrdered' ||
      rowData?.data?.status == 'Completed'
    ) {
      return true
    }

    return false
  }

  const [PNLVoucherView, setPNLVoucherView] = useState(false)
  const [currenctOrdeId, setCurrenctOrderId] = useState('')
  const [productPNLReport, setProductPNLReport] = useState([])

  const handlePNLReport = async (id) => {
    await axios.get(`/pnl/order-product/${id}`).then((response) => {
      setPNLVoucherView(true)
      setCurrenctOrderId(id)
      setProductPNLReport(response.data)
    })
  }

  const downloadPdf = async () => {
    try {
      // console.log(productData?.[0].checkoutID, "chechout id")
      const url = `${axios.defaults.baseURL}/pnl/order-product/${productData?.[0].checkoutID}/pdf`
      console.log('Opening URL:', url)
      window.open(url, '_blank')
    } catch (error) {
      console.error('Error downloading the PDF:', error)
    }
  }

  const handleCLosePNRLReportModal = () => {
    setPNLVoucherView(false)
    setCurrenctOrderId('')
    setProductPNLReport([])
  }

  // console.log(value, 'fgf');

  // Function to disable all dates except today and yesterday
  const isDateSelectable = (date) => {
    const today = new Date()
    const yesterday = new Date(today)
    yesterday.setDate(today.getDate() - 1)

    return (
      date.toDateString() === today.toDateString() ||
      date.toDateString() === yesterday.toDateString()
    )
  }
  const [selectedDate, setSelectedDate] = useState(new Date())

  const getSelectedDate = (data) => {
    if (dateChanging) {
      return selectedDate
    } else {
      if (data?.reconfirmationDate) {
        return data?.reconfirmationDate
      } else {
        return selectedDate
      }
    }
  }

  const [dateChanging, setDateChanging] = useState(false)

  const columns = [
    // // newly added start
    // { 
    //   title: 'Discount', 
    //   field: 'hasDiscount',
    //   width: 80, // Keep it narrow
    //   render: (rowData) => {
    //     return hasDiscountData(rowData) ? (
    //       <div style={{ 
    //         backgroundColor: '#e8f5e9', 
    //         padding: '4px 8px',
    //         borderRadius: '12px',
    //         display: 'inline-block',
    //         fontSize: '12px',
    //         fontWeight: 'bold',
    //         color: '#2e7d32'
    //       }}>
    //         Discount
    //       </div>
    //     ) : "-";
    //   }
    // }, //newly added end

    { title: 'PID', field: 'pid' },
    { title: 'Delivery Date', field: 'delivery_date', type: 'date' },
    {
      title: 'Location',
      field: 'location1',
      render: (rowData) => (
        <CButton
          color="info"
          style={{ fontSize: 11, color: 'white' }}
          onClick={() => getMapView(rowData.data)}
        >
          Show in Map
        </CButton>
      ),
    },
    {
      title: 'Reconfirmation Date',
      field: 'reconfirmation_date',
      type: 'date',
      render: (rowData) => {
        // Get today's date in 'YYYY-MM-DD' format
        const today = new Date()
        const todayString = today.toISOString().split('T')[0]
        // console.log(rowData?.reconfirmationDate, 'reconfirmationDate')
        // Get yesterday's date in 'YYYY-MM-DD' format
        const yesterday = new Date()
        yesterday.setDate(today.getDate() - 1)
        const yesterdayString = yesterday.toISOString().split('T')[0]
        // console.log(rowData, 'Row DAta value issssss')
        return (
          <CFormInput
            style={{ fontSize: '11px' }}
            disabled={getDisableStatus(rowData)}
            defaultValue={rowData?.reconfirmationDate}
            type="date"
            value={productData[rowData?.index]?.reconfirmationDate}
            onChange={(e) => {
              // setDateChanging(true)

              const updatedProductData = [...productData]
              updatedProductData[rowData.index] = {
                ...updatedProductData[rowData.index],
                reconfirmationDate: e.target.value,
              }



              setProductData(updatedProductData)

              // handleInputFields('reconfirmation_date', e.target.value)
              // setSelectedDate(e.target.value)
              // setDateChanging(false)
            }}
            min={yesterdayString}
            max={todayString}
          />
        )
      },
    },

    {
      title: 'QC',
      field: 'qc',
      render: (rowData) => (
        <CFormSelect
          style={{ fontSize: '11px' }}
          disabled={getDisableStatus(rowData)}
          custom
          onChange={(e) => {
            const updatedProductData = [...productData]
            updatedProductData[rowData.index] = {
              ...updatedProductData[rowData.index],
              qc: e.target.value,
            }

            setProductData(updatedProductData)

            // handleInputFields('qc', e.target.value)
          }}
        >
          <option>{rowData.qc !== null ? rowData?.qc : 'Select QC'}</option>
          {qcValues.map((qc) => (
            <option key={qc} value={qc}>
              {qc}
            </option>
          ))}
        </CFormSelect>
      ),
    },
    {
      title: 'Delivery Status',
      field: 'delivery_status',
      render: (rowData) => {
        return (
          <CFormSelect
            style={{ fontSize: '11px' }}
            custom
            onChange={(e) => {
              const updatedProductData = [...productData]
              updatedProductData[rowData.index] = {
                ...updatedProductData[rowData.index],
                deliveryStatus: e.target.value,
              }

              setProductData(updatedProductData)


              console.log(updatedProductData, "Updated Product Dataaaaaaaaaaaaaaaa")

              //   handleInputFields('delivery_status', e.target.value)
            }}
            disabled={getDisableStatus(rowData)}
          >
            <option>
              {rowData.deliveryStatus !== null ? rowData?.deliveryStatus : 'Select Status'}
            </option>
            {deliveryStatusValues.map((status) => (
              <option key={status} value={status}>
                {status}
              </option>
            ))}
          </CFormSelect>
        )
      },
    },
    {
      title: 'Driver allocation',
      field: 'Driver allocation',
      render: (rowData) => (
        <Tooltip
          title={
            rowData.data.category === 'Lifestyles'
              ? 'Allocate driver'
              : 'Driver allocation is not avalible'
          }
        >
          {['driver allocate'].some((permission) =>
            userData?.permissions?.includes(permission),
          ) && (
              <CButton
                color="info"
                disabled={rowData.data.category != 'Lifestyles' || rowData?.data?.status === "Cancel" || rowData?.data?.status === "CustomerOrdered" || rowData?.data?.status === "Completed"}
                style={{
                  fontSize: 11,
                  color: 'white',
                  backgroundColor: rowData.data.vehicle_allocation == 1 ? '#476e7c' : null,
                  border: 0,
                }}
                onClick={() => handleClickDriverAllocation(rowData)}
                className="btn btn-primary"
              >
                {rowData.data.vehicle_allocation == 1 ? 'View Allocation' : 'Allocate driver'}
              </CButton>
            )}
        </Tooltip>
      ),
    },
    {
      title: 'PNL report',
      render: (rowData) => {
        return (
          ['view traveler pnl', 'all accounts access'].some((permission) =>
            userData?.permissions?.includes(permission),
          ) && (
            <CButton
              // onClick={() => console.log(rowData)}

              onClick={() => handlePNLReport(rowData?.data?.checkoutID)}
              style={{ fontSize: 11, color: 'white', backgroundColor: '#ed4242', border: 0 }}
              color="info"
            >
              Show PNL report
            </CButton>
          )
        )
      },
    },
    {
      title: '',
      render: (rowData) => {
        if (rowData?.data.status == 'Approved') {
          return (
            <div onClick={() => createTravellerExperience(rowData, rowData?.index)}>
              {['submit traveler request'].some((permission) =>
                userData?.permissions?.includes(permission),
              ) && (
                  <CButton color="success" style={{ fontSize: 14, color: 'white' }}>
                    Submit
                  </CButton>
                )}
            </div>
          )
        } else if (rowData?.data.status == 'Completed') {
          return <CIcon icon={cilCheckCircle} size="xxl" />
        } else if (rowData?.data.status == 'Cancel') {
          return (
            <CBadge color="danger" style={{ padding: 5, fontSize: 12 }}>
              Order Cancelled
            </CBadge>
          )
        } else {
          return (
            <CBadge color="danger" style={{ padding: 5, fontSize: 12 }}>
              Waiting For Approval
            </CBadge>
          )
        }
      },
    },
    // { title: 'DFeedback', field: 'dFeedback', render: rowData => <CFormSelect custom>{rowData.dFeedback}</CFormSelect> },
  ]

  // Prepare the data for the Material Table
  const data = productData?.map((value, index) => ({
    pid: value?.['PID'],
    delivery_date: value?.service_date,
    location: value?.location,
    reconfirmationDate: value?.reconfirmation_date,
    qc: value?.qc,
    // deliveryStatus: <CFormSelect custom>{deliveryStatusValues.map(status => <option key={status} value={status}>{status}</option>)}</CFormSelect>,
    deliveryStatus: value?.delivery_status,
    data: value,
    index: index,
    // dFeedback: <CFormSelect custom>{value?.dFeedback}</CFormSelect>,
  }))

  const [formData, setFormData] = useState({})

  // Function to handle changes to the Reconfirmation Date
  const handleReconfirmationDateChange = (date, rowData) => {
    // You can handle the date change here, e.g., update rowData.reconfirmationDate
  }

  const [driverDetailsLoading, setDriverDetailsLoading] = useState(true)
  const [driverDetails, setDriverDetails] = useState([])

  const getAllExistingDeivers = async () => {
    setDriverDetailsLoading(true)
    await axios.get('/vehicle-drivers').then((response) => {
      setDriverDetailsLoading(false)
      console.log('driverrrrrrrrrrr', response.data.data)
      setDriverDetails(response.data.data)
    })
  }

  useEffect(() => {
    getAllExistingDeivers()
  }, [driverAllocationStatus.status])

  const handleResetAllocationModal = () => {
    setDriverAllocationStatus({
      status: false,
      data: [],
    })
  }

  const handleChooseDriver = async (type, dataset) => {
    console.log(dataset, 'Dataset Value is')
    let Prod_ID = driverAllocationStatus.data.data.checkoutID
    let Veh_ID = dataset.id

    const formData = new FormData();
    formData.append('transfer_type', type);

    await axios
      .post(`/allocate-order-product/${Prod_ID}/vehicle-driver/${Veh_ID}`,
        formData,
        {
          xsrfHeaderName: 'X-CSRF-Token',
          withCredentials: true,
          headers: { 'Content-Type': 'multipart/form-data' },
        })
      .then((response) => {
        if (response.data.message === 'success') {
          Swal.fire({
            title: 'Traveller Details Updated Successfully',
            text: '',
            icon: 'success',
          })
          handleResetAllocationModal()
          props.reload()
        } else {
          Swal.fire({
            title: response.data.message,
            text: '',
            icon: 'error',
          })
          handleResetAllocationModal()
          props.reload()
        }
        setDriverAllocationStatus(false);
      })
      .catch((response) => {
        setDriverAllocationStatus(false);
        console.log(response.response.data.message, 'Catch Response Value is')
        Swal.fire({
          title: response.response.data.message,
          text: '',
          icon: 'error',
        })
      })
  }

  return (
    <>
      <Modal show={mapView} onHide={() => setMapView(false)} size="fullscreen" style={{ zIndex: 999999999 }}>
        <Modal.Header closeButton>
          <Modal.Title>Location Data</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <DeliveryDetails dataset={mapViewData}></DeliveryDetails>
        </Modal.Body>
        {/* <Modal.Footer></Modal.Footer> */}
      </Modal>

      <Modal
        show={driverAllocationStatus.status}
        size="lg"
        onHide={handleResetAllocationModal}
        centered
        style={{ zIndex: 9999 }}
      >
        <Modal.Header closeButton>
          <Modal.Title>Allocate Vehicle</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {/* Add Filter Inputs */}
          <div className="mb-3">
            <CRow>
              <CCol md={4}>
                <CFormInput
                  placeholder="Filter by Driver Name"
                  onChange={(e) => {
                    const searchTerm = e.target.value.toLowerCase();
                    const filtered = driverDetails.filter(driver =>
                      driver.driver_name.toLowerCase().includes(searchTerm)
                    );
                    setDriverDetails(filtered);
                    if (e.target.value === '') {
                      getAllExistingDeivers(); // Reset to original list if search is cleared
                    }
                  }}
                />
              </CCol>
              <CCol md={4}>
                <CFormInput
                  placeholder="Filter by Vehicle Number"
                  onChange={(e) => {
                    const searchTerm = e.target.value.toLowerCase();
                    const filtered = driverDetails.filter(driver =>
                      driver.vehicle_number.toLowerCase().includes(searchTerm)
                    );
                    setDriverDetails(filtered);
                    if (e.target.value === '') {
                      getAllExistingDeivers();
                    }
                  }}
                />
              </CCol>
              <CCol md={4}>
                <CFormInput
                  placeholder="Filter by Vehicle Province"
                  onChange={(e) => {
                    const searchTerm = e.target.value.toLowerCase();
                    const filtered = driverDetails.filter(driver =>
                      driver.vehicle_province.toLowerCase().includes(searchTerm)
                    );
                    setDriverDetails(filtered);
                    if (e.target.value === '') {
                      getAllExistingDeivers();
                    }
                  }}
                />
              </CCol>
            </CRow>
          </div>

          <div className="driver-allocation-modal-body">
            {driverDetailsLoading ? (
              <div className="loading-container">
                <FontAwesomeIcon icon={faSpinner} spinPulse className="loading-spinner" />
                <h6>Loading...</h6>
                <h6>Driver information, one moment please…</h6>
              </div>
            ) : driverDetails.length === 0 ? (
              <div className="no-drivers-container">
                <h6>Oops! Sorry</h6>
                <h6>There are no drivers available at this time</h6>
              </div>
            ) : (
              driverDetails
                .sort((a, b) => (a.id === driverId ? -1 : b.id === driverId ? 1 : 0))
                .map((driver, index) => {
                  // const isAllocated = driver.allocation.find((item) => {
                  //   return (
                  //     item.service_date == allocateProductData.service_date &&
                  //     item.time_slot == allocateProductData.pickupTime
                  //   );
                  // });
                  const isAllocatedToCurrent = driver.allocation.filter((item) => {
                    return (
                      item.order_product_id == allocateProductData.checkoutID
                    );
                  });
                  const hasDrop = isAllocatedToCurrent.some(item => item.transfer_type === "drop");
                  const hasPickup = isAllocatedToCurrent.some(item => item.transfer_type === "pickup");
                  return (
                    <div
                      key={index}
                      className="driver-vehicle-card"
                      style={{ backgroundColor: (hasDrop || hasPickup) ? "#f0e68c" : "transparent" }}
                    >
                      <div className="vehicle-primary-info">
                        <div className="vehicle-identification">
                          {/* {isAllocated && driverId != driver.id && (<span className='text-danger'>The driver is unavailable for the selected time slot and service date</span>)} */}
                          <span className="vehicle-number">Vehicle No: {driver.vehicle_number}</span>
                          <span className="vehicle-province">{driver.vehicle_province}</span>
                        </div>
                        <div className="driver-name">
                          <span>Driver: {driver.driver_name}</span>
                        </div>
                      </div>

                      <div className="vehicle-details">
                        <div className="vehicle-characteristics">
                          <span>Type: {driver.vehicle_type}</span>
                          <span>Model: {driver.vehicle_model}</span>
                          <span>Color: {driver.vehicle_color}</span>
                          <span>Make: {driver.vehicle_make}</span>
                        </div>
                      </div>

                      <div className="secondary-info">
                        <div className="driver-secondary-details">
                          <span>Reg Date: {driver.vehicle_registered_date}</span>
                          <span>Condition: {driver.vehicle_vehicle_condition}</span>
                          <span>Status: {driver.vehicle_status}</span>
                        </div>
                      </div>

                      <div className="secondary-info">
                        <div className="driver-secondary-details">
                          <span>Country: {driver.driver_registered_country}</span>
                          <span>Type: {driver.driver_type}</span>
                          <span>NIC: {driver.driver_nic}</span>
                          <span>Reg Date: {driver.driver_registered_date}</span>
                          <span>Driver Status: {driver.driver_status}</span>
                        </div>
                      </div>
                      <div>
                        {isAllocatedToCurrent.length > 0 &&
                          isAllocatedToCurrent.map((item, index) => (
                            <div key={index}>
                              <span className='badge bg-dark m-1'>Allocated Date: {item.service_date}</span>
                              <span className='badge bg-dark m-1'>Time Slot: {item.time_slot}</span>
                              <span className='badge bg-dark m-1'>Transfer Type: {item.transfer_type}</span>
                            </div>
                          ))
                        }
                      </div>
                      {console.log("isAllocatedToCurrent", isAllocatedToCurrent)}
                      {!hasDrop && (<CButton
                        color="success"
                        className="select-allocation-btn"
                        onClick={() => handleChooseDriver('drop', driver)}
                      >
                        Select vehicle for drop
                      </CButton>)}
                      {!hasPickup && (<CButton
                        color="primary"
                        className="select-allocation-btn"
                        onClick={() => handleChooseDriver('pickup', driver)}
                      >
                        Select vehicle for pickup
                      </CButton>)}


                      {/* {!isAllocated && (driverId === driver.id ? (
                        <CButton
                          color="dark"
                          disabled
                          className="select-allocation-btn"
                          onClick={() => handleChooseDriver(driver)}
                        >
                          Selected
                        </CButton>
                      ) : (
                        <CButton
                          color="warning"
                          className="select-allocation-btn"
                          onClick={() => handleChooseDriver('one-way', driver)}
                        >
                          Select vehicle for one way
                        </CButton>
                      ))}
                      {!isAllocated && (driverId === driver.id ? (
                        <CButton
                          color="dark"
                          disabled
                          className="select-allocation-btn"
                          onClick={() => handleChooseDriver(driver)}
                        >
                          Selected
                        </CButton>
                      ) : (
                        <CButton
                          color="success"
                          className="select-allocation-btn"
                          onClick={() => handleChooseDriver('two-way', driver)}
                        >
                          Select vehicle for two way
                        </CButton>
                      ))} */}
                    </div>
                  )
                })
            )}
          </div>
        </Modal.Body>
      </Modal>

      <Modal show={PNLVoucherView} size="xl" onHide={handleCLosePNRLReportModal} style={{ zIndex: 999999999 }}>
        <Modal.Header closeButton>
          <Modal.Title>Supplier Voucher</Modal.Title>
          {productPNLReport.status !== 'fail' &&
            productPNLReport.message !== 'No data to display' && (
              <CButton
                color="info"
                style={{ fontSize: 16, color: 'white', marginLeft: 20, alignContent: 'center' }}
                onClick={downloadPdf}
              >
                Download Voucher
              </CButton>
            )}
        </Modal.Header>
        <Modal.Body>
          {productPNLReport.status === 'fail' &&
            productPNLReport.message === 'No data to display' ? (
            <div className="d-flex flex-column align-items-center my-5">
              <h6>Oops! Sorry</h6>
              <p>The product has been yet to be approved !</p>
            </div>
          ) : (
            <div dangerouslySetInnerHTML={{ __html: productPNLReport }} />
          )}
        </Modal.Body>
      </Modal>

      {/* <MaterialTable
        title="Traveller Experience"
        columns={columns}
        data={data}
        options={{
          headerStyle: { fontSize: '11px' },
          cellStyle: { fontSize: '11px' },
          paging: false,
          search: false,
          columnsButton: true,
          exportButton: true,
          grouping: true,
          rowStyle: rowStyle,
        }}
      /> */}
<MaterialTable
  title="Traveller Experience"
  columns={columns}
  data={data}
  options={{
    headerStyle: { fontSize: '14px' },
    cellStyle: { fontSize: '14px' },
    paging: false,
    search: false,
    columnsButton: true,
    exportButton: true,
    grouping: true,
    rowStyle: rowStyle,
    // These options control the detail panel column
    detailPanelColumnAlignment: 'left',
    detailPanelColumnStyle: { 
      width: '10px',  // Reduced from default
      minWidth: '10px', // Ensures it doesn't expand
      maxWidth: '10px', // Ensures it doesn't expand
      padding: '0 5px', // Reduces padding
      display: discountData ? 'table-cell' : 'none'

    },
    // This prevents the column from being resizable
    columnsResizable: false
  }}
  
  detailPanel={discountData ? [
    {
      render: rowData => {
        if (!hasDiscountData(rowData)) return null;
        
        const discountData = rowData.data.discountData;
        const discountMainData = discountData?.discountMainData;
        
        if (!discountMainData) return null;
        
        return (
          <div style={{ 
            backgroundColor: '#e8f5e9', 
            padding: '10px',
            margin: '0',
            border: '1px solid #c8e6c9', 
            borderRadius: '4px',
            // Constrain the width of the content
            maxWidth: 'calc(100% - 10px)', // Accounts for the column width
            marginLeft: '20px' // Aligns with the column
          }}>
            <h5 style={{ color: '#2e7d32', marginBottom: '12px' }}>
              {discountMainData.discount_tag_line || 'Special Discount Offer'}
            </h5>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '20px' }}>
              <div>
                <p><strong>Discount Type:</strong> {discountMainData.discount_type}</p>
                <p><strong>Valid Until:</strong> {discountMainData.discount_end_date}</p>
              </div>
              <div>
                <p><strong>Travel Period:</strong> {discountMainData.discount_travel_start_date} to {discountMainData.discount_travel_end_date}</p>
                {discountData.productData && (
                  <p><strong>Free Product:</strong> {discountData.productData.product_name}</p>
                )}
              </div>
            </div>
          </div>
        );
      }
    }
  ]:undefined}
  onRowClick={(event, rowData, togglePanel) => {
    if (hasDiscountData(rowData)) {
      togglePanel();
    }
  }}
/>
    </>
  )
}
