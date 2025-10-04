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

  const [productData, setProductData] = useState([])
  const [discountData, setDiscountData] = useState(false)
  const [discountDataSet, setDiscountDataSet] = useState([])

  useEffect(() => {
    setProductData(props.dataset)
    console.log(props.dataset, "Product Data")

    if (props.dataset && props.dataset[0]?.discountData !== null) {
      setDiscountData(true)
      setDiscountDataSet(props.dataset[0]?.discountData)
      console.log(props.dataset[0]?.discountData, "Discount Data")
    } else {
      setDiscountData(false)
    }
  }, [props.dataset])

  // Create a function to determine if a row has discount data
  const hasDiscountData = (rowData) => {
    return rowData?.data?.discountData !== null && rowData?.data?.discountData !== undefined
  }

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
    setTravellerData({ ...travellerData, [name]: value })
  }

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
      Swal.fire({
        title: 'Please wait...',
        text: 'Submitting traveller experience...',
        allowOutsideClick: false,
        didOpen: () => {
          Swal.showLoading()
        },
      })

      setTimeout(() => {
        Swal.close()
      }, 5000)
      
      const response = await axios.post(`/create_traveller`, data)
      if (response.data.status == 200) {
        await axios
          .post(
            `${axios.defaults.url}/sendConfirmationMail/${rowData?.data?.checkoutID
            }/${'CompletedDelivery'}`,
          )
          .then((res) => {
            Swal.hideLoading()

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
      throw error
    }
  }

  const QuantityContainer = ({ data }) => {
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
  const [allocateProductData, setAllocateProductData] = useState({})

  const getMapView = async (data) => {
    setMapView(true)
    setMapViewData(data)
  }

  const [driverId, setDriverId] = useState('')
  const handleClickDriverAllocation = (dataset) => {
    setAllocateProductData(dataset?.data)
    if (dataset.data.category === 'Lifestyles') {
      setDriverId(dataset.data.vehicle_driver_id)

      // Pass country to filter drivers
      const country = dataset.data.country
      setDriverAllocationStatus({ status: true, data: dataset })
      getAllExistingDeivers(country)
    } else {
      alert('Driver allocation is available only for lifestyle products')
    }
  }

  const getDisableStatus = (rowData) => {
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

  // Custom export handlers
  const handleExportCsv = () => {
    const exportData = productData.map((value, index) => ({
      'PID': value?.PID,
      'Delivery Date': value?.service_date,
      'Reconfirmation Date': value?.reconfirmationDate || value?.reconfirmation_date,
      'QC': value?.qc,
      'Delivery Status': value?.deliveryStatus || value?.delivery_status,
      'Location': value?.location,
    }))
    
    downloadCsv(exportData, 'traveller_experience.csv')
  }

  const handleExportPdf = () => {
    const exportData = productData.map((value, index) => ({
      'PID': value?.PID,
      'Delivery Date': value?.service_date,
      'Reconfirmation Date': value?.reconfirmationDate || value?.reconfirmation_date,
      'QC': value?.qc,
      'Delivery Status': value?.deliveryStatus || value?.delivery_status,
      'Location': value?.location,
    }))
    
    // For PDF, you can use the same download approach or implement actual PDF generation
    const url = `${axios.defaults.baseURL}/export-traveller-experience-pdf`
    window.open(url, '_blank')
  }

  // CSV download utility
  const downloadCsv = (data, filename) => {
    if (!data || data.length === 0) {
      Swal.fire({
        text: 'No data to export',
        icon: 'warning',
      })
      return
    }

    const headers = Object.keys(data[0])
    const csvContent = [
      headers.join(','),
      ...data.map(row => 
        headers.map(header => 
          `"${String(row[header] || '').replace(/"/g, '""')}"`
        ).join(',')
      )
    ].join('\n')
    
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' })
    const url = window.URL.createObjectURL(blob)
    const link = document.createElement('a')
    link.href = url
    link.setAttribute('download', filename)
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
    window.URL.revokeObjectURL(url)
  }

  const columns = [
    { 
      title: 'PID', 
      field: 'pid',
      export: true
    },
    { 
      title: 'Delivery Date', 
      field: 'delivery_date', 
      type: 'date',
      export: true
    },
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
      export: false,
    },
    {
      title: 'Reconfirmation Date',
      field: 'reconfirmation_date',
      type: 'date',
      render: (rowData) => {
        const today = new Date()
        const todayString = today.toISOString().split('T')[0]
        
        const yesterday = new Date()
        yesterday.setDate(today.getDate() - 1)
        const yesterdayString = yesterday.toISOString().split('T')[0]
        
        return (
          <CFormInput
            style={{ fontSize: '11px' }}
            disabled={getDisableStatus(rowData)}
            type="date"
            value={productData[rowData?.index]?.reconfirmationDate || rowData?.reconfirmationDate}
            onChange={(e) => {
              const updatedProductData = [...productData]
              updatedProductData[rowData.index] = {
                ...updatedProductData[rowData.index],
                reconfirmationDate: e.target.value,
              }
              setProductData(updatedProductData)
            }}
            min={yesterdayString}
            max={todayString}
          />
        )
      },
      export: true,
    },
    {
      title: 'QC',
      field: 'qc',
      cellStyle: { width: 100 },
      render: (rowData) => (
        <CFormSelect
          style={{ fontSize: '11px' }}
          disabled={getDisableStatus(rowData)}
          custom
          value={productData[rowData?.index]?.qc || rowData?.qc}
          onChange={(e) => {
            const updatedProductData = [...productData]
            updatedProductData[rowData.index] = {
              ...updatedProductData[rowData.index],
              qc: e.target.value,
            }
            setProductData(updatedProductData)
          }}
        >
          <option value="">Select QC</option>
          {qcValues.map((qc) => (
            <option key={qc} value={qc}>
              {qc}
            </option>
          ))}
        </CFormSelect>
      ),
      export: true,
    },
    {
      title: 'Delivery Status',
      field: 'delivery_status',
      cellStyle: { width: 100 },
      render: (rowData) => {
        return (
          <CFormSelect
            style={{ fontSize: '11px' }}
            custom
            value={productData[rowData?.index]?.deliveryStatus || rowData?.deliveryStatus}
            onChange={(e) => {
              const updatedProductData = [...productData]
              updatedProductData[rowData.index] = {
                ...updatedProductData[rowData.index],
                deliveryStatus: e.target.value,
              }
              setProductData(updatedProductData)
            }}
            disabled={getDisableStatus(rowData)}
          >
            <option value="">Select Status</option>
            {deliveryStatusValues.map((status) => (
              <option key={status} value={status}>
                {status}
              </option>
            ))}
          </CFormSelect>
        )
      },
      export: true,
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
      export: false,
    },
    {
      title: 'PNL report',
      render: (rowData) => {
        return (
          ['view traveler pnl', 'all accounts access'].some((permission) =>
            userData?.permissions?.includes(permission),
          ) && (
            <CButton
              onClick={() => handlePNLReport(rowData?.data?.checkoutID)}
              style={{ fontSize: 11, color: 'white', backgroundColor: '#ed4242', border: 0 }}
              color="info"
            >
              Show PNL report
            </CButton>
          )
        )
      },
      export: false,
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
                  <CButton color="success" style={{ fontSize: 11, color: 'white' }}>
                    Submit
                  </CButton>
                )}
            </div>
          )
        } else if (rowData?.data.status == 'Completed') {
          return <CIcon icon={cilCheckCircle} size="xxl" />
        } else if (rowData?.data.status == 'Cancel') {
          return (
            <CBadge color="danger" style={{ padding: 5, fontSize: 11 }}>
              Order Cancelled
            </CBadge>
          )
        } else {
          return (
            <CBadge color="danger" style={{ padding: 5, fontSize: 11 }}>
              Waiting For Approval
            </CBadge>
          )
        }
      },
      export: false,
    },
  ]

  // Prepare the data for the Material Table - SYNC WITH productData
  const data = productData?.map((value, index) => {
    // Use current form values from productData, fallback to original data
    return {
      pid: value?.PID,
      delivery_date: value?.service_date,
      location: value?.location,
      reconfirmation_date: value?.reconfirmationDate || value?.reconfirmation_date,
      qc: value?.qc,
      delivery_status: value?.deliveryStatus || value?.delivery_status,
      data: value,
      index: index,
    }
  })

  const [formData, setFormData] = useState({})

  const [driverDetailsLoading, setDriverDetailsLoading] = useState(true)
  const [driverDetails, setDriverDetails] = useState([])

  const getAllExistingDeivers = async (country = null) => {
    setDriverDetailsLoading(true)

    let url = '/vehicle-drivers'
    if (country) {
      url += `?country=${country}`
    }

    await axios.get(url).then((response) => {
      setDriverDetailsLoading(false)
      setDriverDetails(response.data.data)
      setOriginalDriverDetails(response.data.data)
    })
  }
  
  const [originalDriverDetails, setOriginalDriverDetails] = useState([])
  
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

    const formData = new FormData()
    formData.append('transfer_type', type)

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
        setDriverAllocationStatus(false)
      })
      .catch((response) => {
        setDriverAllocationStatus(false)
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
          <div className="mb-3">
            <CRow>
              <CCol md={4}>
                <CFormInput
                  placeholder="Filter by Driver Name"
                  onChange={(e) => {
                    const searchTerm = e.target.value.toLowerCase()
                    const filtered = originalDriverDetails.filter(driver =>
                      driver.driver_name.toLowerCase().includes(searchTerm)
                    )
                    setDriverDetails(filtered)
                  }}
                />
              </CCol>
              <CCol md={4}>
                <CFormInput
                  placeholder="Filter by Vehicle Number"
                  onChange={(e) => {
                    const searchTerm = e.target.value.toLowerCase()
                    const filtered = originalDriverDetails.filter(driver =>
                      driver.vehicle_number.toLowerCase().includes(searchTerm)
                    )
                    setDriverDetails(filtered)
                  }}
                />
              </CCol>
              <CCol md={4}>
                <CFormInput
                  placeholder="Filter by Vehicle Province"
                  onChange={(e) => {
                    const searchTerm = e.target.value.toLowerCase()
                    const filtered = originalDriverDetails.filter(driver =>
                      driver.vehicle_province.toLowerCase().includes(searchTerm)
                    )
                    setDriverDetails(filtered)
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
                  const isAllocatedToCurrent = driver.allocation.filter((item) => {
                    return (
                      item.order_product_id == allocateProductData.checkoutID
                    )
                  })
                  const hasDrop = isAllocatedToCurrent.some(item => item.transfer_type === "drop")
                  const hasPickup = isAllocatedToCurrent.some(item => item.transfer_type === "pickup")
                  return (
                    <div
                      key={index}
                      className="driver-vehicle-card"
                      style={{ backgroundColor: (hasDrop || hasPickup) ? "#f0e68c" : "transparent" }}
                    >
                      <div className="vehicle-primary-info">
                        <div className="vehicle-identification">
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
          detailPanelColumnAlignment: 'left',
          detailPanelColumnStyle: {
            width: '10px',
            minWidth: '10px',
            maxWidth: '10px',
            padding: '0 5px',
            display: discountData ? 'table-cell' : 'none'
          },
          columnsResizable: false,
          // Custom export handlers
          exportMenu: [
            {
              label: 'Export PDF',
              exportFunc: (cols, datas) => handleExportPdf()
            },
            {
              label: 'Export CSV',
              exportFunc: (cols, datas) => handleExportCsv()
            }
          ]
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
                  maxWidth: 'calc(100% - 10px)',
                  marginLeft: '20px'
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
        ] : undefined}
        onRowClick={(event, rowData, togglePanel) => {
          if (hasDiscountData(rowData)) {
            togglePanel();
          }
        }}
      />
    </>
  )
}