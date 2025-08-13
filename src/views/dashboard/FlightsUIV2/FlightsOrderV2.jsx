import React, { useState } from 'react'
import {
  CCard,
  CCardBody,
  CCardHeader,
  CCol,
  CRow,
  CBadge,
  CButton,
  CButtonGroup,
  CTable,
  CTableBody,
  CTableDataCell,
  CTableHead,
  CTableHeaderCell,
  CTableRow,
  CAlert,
  CNav,
  CNavItem,
  CNavLink,
  CTabContent,
  CTabPane,
  CListGroup,
  CListGroupItem,
  CAccordion,
  CAccordionBody,
  CAccordionHeader,
  CAccordionItem,
} from '@coreui/react'
import { 
  FaPlane, 
  FaUser, 
  FaCreditCard, 
  FaCalendarAlt, 
  FaMapMarkerAlt, 
  FaClock, 
  FaDownload, 
  FaPrint, 
  FaDollarSign, 
  FaStar, 
  FaPhone, 
  FaEnvelope, 
  FaGlobe, 
  FaFlag, 
  FaPassport,
  FaFileDownload,
  FaArrowRight,
  FaSuitcase
} from 'react-icons/fa'
import { saveAs } from 'file-saver'

export default function FlightsOrderV2({ flightMetadata }) {
  const [activeKey, setActiveKey] = useState(1)

  if (!flightMetadata?.requestedData) {
    return (
      <CAlert color="warning" className="m-4">
        <strong>No flight data available</strong>
      </CAlert>
    )
  }

  const { requestedData } = flightMetadata
  const revalidationData = JSON.parse(requestedData.revalidationData || '{}')?.revalidationData
  const isRoundTrip = requestedData.searchData?.tripType === 'roundTrip'
  const provider = revalidationData?.provider || 'Unknown Provider'

  // Custom styles
  const customStyles = `
    .flight-header {
      background: linear-gradient(135deg, #004e64 0%, #476e7c 100%);
      color: white;
      border-radius: 12px;
      padding: 1.5rem;
      margin-bottom: 1.5rem;
    }
    .compact-card {
      border: 1px solid #e9ecef;
      border-radius: 8px;
      box-shadow: 0 2px 8px rgba(0,78,100,0.08);
      margin-bottom: 1rem;
    }
    .tab-nav {
      background: #f8f9fa;
      border-radius: 8px 8px 0 0;
      border-bottom: 2px solid #004e64;
    }
    .tab-nav .nav-link {
      color: #476e7c;
      font-weight: 500;
      padding: 0.75rem 1.5rem;
      border: none;
    }
    .tab-nav .nav-link.active {
      background: #004e64;
      color: white;
      border-radius: 6px 6px 0 0;
    }
    .flight-route {
      background: #f8f9fa;
      border-radius: 8px;
      padding: 1rem;
      margin-bottom: 1rem;
    }
    .btn-custom-primary {
      background: #004e64;
      border-color: #004e64;
      color: white;
      border-radius: 6px;
      padding: 0.5rem 1rem;
      font-size: 0.875rem;
    }
    .btn-custom-primary:hover {
      background: #003a4a;
      border-color: #003a4a;
    }
    .btn-custom-secondary {
      background: #ed4242;
      border-color: #ed4242;
      color: white;
      border-radius: 6px;
      padding: 0.5rem 1rem;
      font-size: 0.875rem;
    }
    .btn-custom-secondary:hover {
      background: #d63031;
      border-color: #d63031;
    }
    .btn-custom-tertiary {
      background: #476e7c;
      border-color: #476e7c;
      color: white;
      border-radius: 6px;
      padding: 0.5rem 1rem;
      font-size: 0.875rem;
    }
    .btn-custom-tertiary:hover {
      background: #3a5a66;
      border-color: #3a5a66;
    }
    .price-display {
      background: linear-gradient(45deg, #004e64, #476e7c);
      color: white;
      padding: 1rem;
      border-radius: 8px;
      text-align: center;
    }
    .passenger-card {
      background: #f8f9fa;
      border-left: 4px solid #004e64;
      border-radius: 0 8px 8px 0;
      padding: 1rem;
      margin-bottom: 1rem;
    }
    .info-row {
      padding: 0.5rem 0;
      border-bottom: 1px solid #eee;
    }
    .info-row:last-child {
      border-bottom: none;
    }
    .badge-primary-custom {
      background: #004e64;
      color: white;
    }
    .badge-secondary-custom {
      background: #ed4242;
      color: white;
    }
    .badge-tertiary-custom {
      background: #476e7c;
      color: white;
    }
    .text-primary-custom {
      color: #004e64 !important;
    }
    .text-secondary-custom {
      color: #ed4242 !important;
    }
    .text-tertiary-custom {
      color: #476e7c !important;
    }
    .compact-table th {
      background: #f8f9fa;
      font-weight: 600;
      padding: 0.75rem;
      font-size: 0.875rem;
    }
    .compact-table td {
      padding: 0.75rem;
      font-size: 0.875rem;
    }
  `

  // Helper functions (following your existing pattern)
  const formatCurrency = (amount, currency = 'USD') => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: currency,
    }).format(amount)
  }

  // Using your existing function patterns
  const convertToActualTimeMeta = (time) => {
    return new Date(`2000-01-01T${time}`).toLocaleTimeString('en-US', {
      hour: '2-digit',
      minute: '2-digit',
      hour12: true,
    })
  }

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      weekday: 'short',
      month: 'short',
      day: 'numeric',
    })
  }

  const calculateDurationMeta = (schedules) => {
    if (!schedules || schedules.length === 0) return '0h 0m'
    const totalMinutes = schedules.reduce((total, schedule) => total + (schedule.elapsedTime || 0), 0)
    const hours = Math.floor(totalMinutes / 60)
    const mins = totalMinutes % 60
    return `${hours}h ${mins}m`
  }

  const calculateTotalStopCount = (schedules) => {
    if (!schedules || schedules.length === 0) return 0
    return schedules.reduce((total, schedule) => total + (schedule.stopCount || 0), 0)
  }

  const getStopCountText = (stopCount) => {
    if (stopCount === 0) return 'Non-stop'
    if (stopCount === 1) return '1 Stop'
    return `${stopCount} Stops`
  }

  const getAirportDisplayName = (airportCode) => {
    // You can replace this with your getAirportName function
    const airportNames = {
      'CMB': 'Bandaranaike International Airport',
      'SIN': 'Singapore Changi Airport',
      'DEL': 'Indira Gandhi International Airport'
    }
    return airportNames[airportCode] || airportCode
  }

  const getCityDisplayName = (cityCode) => {
    // You can replace this with your getCityName function
    const cityNames = {
      'CMB': 'Colombo',
      'SIN': 'Singapore', 
      'DEL': 'New Delhi'
    }
    return cityNames[cityCode] || cityCode
  }

  const getCountryDisplayName = (cityCode) => {
    // You can replace this with your getCountryName function
    const countryNames = {
      'CMB': 'Sri Lanka',
      'SIN': 'Singapore',
      'DEL': 'India'
    }
    return countryNames[cityCode] || cityCode
  }

  const getFlightDisplayName = (carrier) => {
    // You can replace this with your getFlightNameMeta function
    return `${carrier?.marketing || ''} ${carrier?.marketingFlightNumber || ''}`
  }

  // Helper function to determine booking status
  const getBookingStatus = () => {
    const status = flightMetadata?.responseData?.status
    return {
      isSuccess: status !== 201,
      status: status,
      message: status === 201 ? 'Booking Failed' : 'Booking Successful'
    }
  }

  // Download functions
  const downloadFlightDetails = () => {
    const bookingStatus = getBookingStatus()
    const flightData = {
      orderId: requestedData.orderId,
      bookingStatus: bookingStatus,
      provider: provider,
      tripType: requestedData.searchData?.tripType,
      bookingDate: requestedData.summary?.bookingDate,
      pricing: {
        totalPrice: requestedData.originPayment?.total_amount,
        baseFare: requestedData.originPayment?.basefair,
        taxes: requestedData.originPayment?.taxfair,
        currency: requestedData.originPayment?.currency
      },
      routes: requestedData.searchData?.routes,
      // Simplified flight legs - only essential info
      flightSummary: revalidationData?.legs?.map(leg => ({
        from: leg.legDescription?.departureLocation,
        to: leg.legDescription?.arrivalLocation,
        date: leg.legDescription?.departureDate,
        duration: calculateDurationMeta(leg.schedules),
        stops: calculateTotalStopCount(leg.schedules),
        airlines: leg.schedules?.map(s => s.carrier?.marketing).filter((v, i, a) => a.indexOf(v) === i)
      }))
    }

    const dataStr = JSON.stringify(flightData, null, 2)
    const dataBlob = new Blob([dataStr], { type: 'application/json' })
    saveAs(dataBlob, `flight-details-${requestedData.orderId}.json`)
  }

  const downloadPassengerDetails = () => {
    const passengerData = {
      orderId: requestedData.orderId,
      passengers: requestedData.allPassengers,
      contactInformation: requestedData.contactInformation,
    }

    const dataStr = JSON.stringify(passengerData, null, 2)
    const dataBlob = new Blob([dataStr], { type: 'application/json' })
    saveAs(dataBlob, `passenger-details-${requestedData.orderId}.json`)
  }

  const downloadCSVReport = () => {
    const csvData = [
      ['Order ID', 'Provider', 'Passenger Name', 'From', 'To', 'Departure', 'Total Amount', 'Currency'],
      ...requestedData.searchData?.routes?.map((route, index) => [
        requestedData.orderId,
        provider,
        requestedData.allPassengers?.[0]?.firstName + ' ' + requestedData.allPassengers?.[0]?.lastName,
        route.from,
        route.to,
        route.date,
        requestedData.originPayment?.total_amount,
        requestedData.originPayment?.currency,
      ]) || [],
    ]

    const csvContent = csvData.map(row => row.join(',')).join('\n')
    const dataBlob = new Blob([csvContent], { type: 'text/csv' })
    saveAs(dataBlob, `flight-report-${requestedData.orderId}.csv`)
  }

  return (
    <div className="flights-order-management p-3">
      <style>{customStyles}</style>
      
      {/* Compact Header */}
      <div className="flight-header">
        <CRow className="align-items-center">
          <CCol md={8}>
            <div className="d-flex align-items-center mb-2">
              <FaPlane size={20} className="me-2" />
              <h4 className="mb-0">Order #{requestedData.orderId}</h4>
              <span className="badge badge-primary-custom ms-3 px-3 py-1">
                {provider.toUpperCase()}
              </span>
              {/* Booking Status Badge */}
              <span className={`badge ms-2 px-3 py-1 ${getBookingStatus().isSuccess ? 'badge-primary-custom' : 'badge-secondary-custom'}`}>
                {getBookingStatus().message}
              </span>
            </div>
            <div className="d-flex align-items-center gap-4 text-sm">
              <span><FaCalendarAlt className="me-1" size={14} /> {requestedData.summary?.bookingDate}</span>
              <span><FaUser className="me-1" size={14} /> {requestedData.summary?.totalPassengers} Passenger(s)</span>
              <span><FaStar className="me-1" size={14} /> {requestedData.passengersClass?.travelClass}</span>
            </div>
          </CCol>
          <CCol md={4} className="text-end">
            <div className="price-display">
              <h3 className="mb-1">{formatCurrency(requestedData.originPayment?.total_amount, requestedData.originPayment?.currency)}</h3>
              <small>Base: {formatCurrency(requestedData.originPayment?.basefair, requestedData.originPayment?.currency)} + Tax: {formatCurrency(requestedData.originPayment?.taxfair, requestedData.originPayment?.currency)}</small>
            </div>
          </CCol>
        </CRow>
        
        <CRow className="mt-3">
          <CCol>
            <div className="d-flex gap-2">
              <button className="btn btn-custom-primary btn-sm" onClick={downloadFlightDetails}>
                <FaDownload className="me-1" size={12} /> Flight Details
              </button>
              <button className="btn btn-custom-secondary btn-sm" onClick={downloadPassengerDetails}>
                <FaFileDownload className="me-1" size={12} /> Passengers
              </button>
              <button className="btn btn-custom-tertiary btn-sm" onClick={downloadCSVReport}>
                <FaPrint className="me-1" size={12} /> CSV Report
              </button>
            </div>
          </CCol>
        </CRow>
      </div>

      {/* Compact Tab Navigation */}
      <CCard className="compact-card">
        <div className="tab-nav">
          <CNav variant="tabs">
            <CNavItem>
              <CNavLink
                active={activeKey === 1}
                onClick={() => setActiveKey(1)}
                style={{ cursor: 'pointer' }}
              >
                <FaPlane className="me-1" size={14} />
                Flights
              </CNavLink>
            </CNavItem>
            <CNavItem>
              <CNavLink
                active={activeKey === 2}
                onClick={() => setActiveKey(2)}
                style={{ cursor: 'pointer' }}
              >
                <FaUser className="me-1" size={14} />
                Passengers
              </CNavLink>
            </CNavItem>
            <CNavItem>
              <CNavLink
                active={activeKey === 3}
                onClick={() => setActiveKey(3)}
                style={{ cursor: 'pointer' }}
              >
                <FaDollarSign className="me-1" size={14} />
                Pricing
              </CNavLink>
            </CNavItem>
            <CNavItem>
              <CNavLink
                active={activeKey === 4}
                onClick={() => setActiveKey(4)}
                style={{ cursor: 'pointer' }}
              >
                <FaFileDownload className="me-1" size={14} />
                Response Data
              </CNavLink>
            </CNavItem>
          </CNav>
        </div>

        <CCardBody className="p-3">
          <CTabContent>
            {/* Flight Details Tab - Following ArrDepLine pattern */}
            <CTabPane visible={activeKey === 1}>
              {revalidationData?.legs?.map((leg, legIndex) => {
                const schedules = leg.schedules || []
                const departureSchedule = schedules[0]
                const arrivalSchedule = schedules[schedules.length - 1]
                const totalStopCount = calculateTotalStopCount(schedules)
                const totalDuration = calculateDurationMeta(schedules)
                
                // Following your dataSet pattern
                const legDataSet = {
                  departureCity: departureSchedule?.departure?.city,
                  departureTime: convertToActualTimeMeta(departureSchedule?.departure?.time),
                  departureDate: formatDate(departureSchedule?.departure?.departureDate),
                  departureTerminal: departureSchedule?.departure?.terminal,
                  departureAirport: getAirportDisplayName(departureSchedule?.departure?.airport),
                  arrivalCity: arrivalSchedule?.arrival?.city,
                  arrivalTime: convertToActualTimeMeta(arrivalSchedule?.arrival?.time),
                  arrivalDate: formatDate(arrivalSchedule?.arrival?.arrivalDate),
                  arrivalTerminal: arrivalSchedule?.arrival?.terminal,
                  arrivalAirport: getAirportDisplayName(arrivalSchedule?.arrival?.airport),
                  duration: totalDuration,
                  stopCount: getStopCountText(totalStopCount),
                  flightCodes: schedules.map(s => s.carrier)
                }

                return (
                  <div key={legIndex} className="flight-route">
                    {/* Section Header - Following your pattern */}
                    <h6 className="section-header mb-3 text-primary-custom">
                      {getCityDisplayName(legDataSet.departureCity) !== getCountryDisplayName(legDataSet.departureCity)
                        ? `${getCityDisplayName(legDataSet.departureCity)} (${getCountryDisplayName(legDataSet.departureCity)})`
                        : getCountryDisplayName(legDataSet.departureCity)}
                      {' to '}
                      {getCityDisplayName(legDataSet.arrivalCity) !== getCountryDisplayName(legDataSet.arrivalCity)
                        ? `${getCityDisplayName(legDataSet.arrivalCity)} (${getCountryDisplayName(legDataSet.arrivalCity)})`
                        : getCountryDisplayName(legDataSet.arrivalCity)}
                    </h6>
                    
                    {/* Main Flight Row - Following your ArrDepLine structure */}
                    <CRow className="align-items-center mb-3">
                      {/* Airline Images Column */}
                      <CCol md={2} className="text-center">
                        <div className="d-flex justify-content-center gap-1 flex-wrap">
                          {legDataSet.flightCodes.map((carrier, index) => (
                            <div key={index} className="airline-logo">
                              <img 
                                src={`https://gateway.aahaas.com/Airlines/${carrier.marketing}.png`}
                                alt={carrier.marketing}
                                style={{ width: '32px', height: '32px', objectFit: 'contain' }}
                                onError={(e) => {
                                  e.target.style.display = 'none'
                                }}
                              />
                            </div>
                          ))}
                        </div>
                      </CCol>

                      {/* Departure Info */}
                      <CCol md={4}>
                        <h6 className="mb-1 text-primary-custom">
                          {legDataSet.departureDate} {legDataSet.departureTime}
                        </h6>
                        <p className="mb-0 text-muted">{legDataSet.departureCity}</p>
                        <p className="mb-0 text-muted small">{legDataSet.departureAirport}</p>
                        {legDataSet.departureTerminal && (
                          <small className="text-muted">Terminal {legDataSet.departureTerminal}</small>
                        )}
                      </CCol>

                      {/* Duration & Stops */}
                      <CCol md={2} className="text-center">
                        <p className="mb-0 text-muted">{legDataSet.duration}</p>
                        <p className="mb-0 text-secondary-custom fw-bold small">{legDataSet.stopCount}</p>
                        <div className="flight-line mt-1">
                          <div className="d-flex align-items-center justify-content-center">
                            <div className="border-top border-2 flex-grow-1" style={{borderColor: '#476e7c'}}></div>
                            <FaPlane className="mx-2 text-tertiary-custom" size={14} />
                            <div className="border-top border-2 flex-grow-1" style={{borderColor: '#476e7c'}}></div>
                          </div>
                        </div>
                      </CCol>

                      {/* Arrival Info */}
                      <CCol md={3} className="text-end">
                        <h6 className="mb-1 text-secondary-custom">
                          {legDataSet.arrivalDate} {legDataSet.arrivalTime}
                        </h6>
                        <p className="mb-0 text-muted">{legDataSet.arrivalCity}</p>
                        <p className="mb-0 text-muted small">{legDataSet.arrivalAirport}</p>
                        {legDataSet.arrivalTerminal && (
                          <small className="text-muted">Terminal {legDataSet.arrivalTerminal}</small>
                        )}
                      </CCol>

                      {/* Flight Numbers */}
                      <CCol md={1} className="text-end">
                        {legDataSet.flightCodes.map((carrier, index) => (
                          <div key={index} className="mb-1">
                            <small className="fw-bold text-primary-custom">
                              {getFlightDisplayName(carrier)}
                            </small>
                          </div>
                        ))}
                      </CCol>
                    </CRow>

                    {/* Detailed Schedule Breakdown for Multi-segment flights */}
                    {schedules.length > 1 && (
                      <div className="detailed-schedule mt-3 p-3 bg-light rounded">
                        <h6 className="text-tertiary-custom mb-3">
                          <FaClock className="me-1" size={14} />
                          Detailed Schedule ({schedules.length} segments)
                        </h6>
                        {schedules.map((schedule, scheduleIndex) => (
                          <CRow key={scheduleIndex} className="align-items-center mb-2 pb-2 border-bottom">
                            <CCol sm={3} className="text-center">
                              <div>
                                <strong className="text-primary-custom">
                                  {convertToActualTimeMeta(schedule.departure?.time)}
                                </strong>
                                <div className="small text-muted">{schedule.departure?.airport}</div>
                                {schedule.departure?.terminal && (
                                  <span className="badge badge-tertiary-custom">T{schedule.departure.terminal}</span>
                                )}
                              </div>
                            </CCol>
                            <CCol sm={6} className="text-center">
                              <div>
                                <strong className="text-primary-custom">
                                  {getFlightDisplayName(schedule.carrier)}
                                </strong>
                                <div className="small text-muted">
                                  {calculateDurationMeta([schedule])} • {schedule.carrier?.equipment?.code}
                                  {schedule.stopCount === 0 && (
                                    <span className="badge badge-primary-custom ms-2">Non-stop</span>
                                  )}
                                </div>
                              </div>
                            </CCol>
                            <CCol sm={3} className="text-center">
                              <div>
                                <strong className="text-secondary-custom">
                                  {convertToActualTimeMeta(schedule.arrival?.time)}
                                </strong>
                                <div className="small text-muted">{schedule.arrival?.airport}</div>
                                {schedule.arrival?.terminal && (
                                  <span className="badge badge-tertiary-custom">T{schedule.arrival.terminal}</span>
                                )}
                              </div>
                            </CCol>
                          </CRow>
                        ))}
                      </div>
                    )}
                  </div>
                )
              })}

              {/* Compact Baggage Info */}
              <div className="mt-4">
                <h6 className="text-primary-custom mb-3">
                  <FaSuitcase className="me-2" size={14} />
                  Baggage Allowance
                </h6>
                <CRow>
                  {revalidationData?.baggageInformation?.map((baggage, index) => (
                    <CCol md={6} key={index}>
                      <div className="border rounded p-2 mb-2 bg-light">
                        <small className="text-muted">
                          {baggage.airlineCode} - Segments {baggage.segments?.map(s => s.id + 1).join(', ')}
                        </small>
                        <div>
                          <strong>{baggage.allowance?.weight || 0} {baggage.allowance?.unit || 'kg'}</strong>
                          <span className="badge badge-primary-custom ms-2">Included</span>
                        </div>
                      </div>
                    </CCol>
                  ))}
                </CRow>
              </div>
            </CTabPane>

            {/* Passenger Information Tab */}
            <CTabPane visible={activeKey === 2}>
              <CRow>
                <CCol lg={8}>
                  {requestedData.allPassengers?.map((passenger, index) => (
                    <div key={index} className="passenger-card">
                      <div className="d-flex justify-content-between align-items-start mb-3">
                        <div>
                          <h5 className="mb-1 text-primary-custom">
                            {passenger.title} {passenger.firstName} {passenger.lastName}
                          </h5>
                          <span className="badge badge-primary-custom">{passenger.type}</span>
                        </div>
                        <div className="text-end">
                          <FaFlag className="me-1" size={14} />
                          <span>{passenger.nationality?.flag} {passenger.nationality?.name}</span>
                        </div>
                      </div>
                      
                      <CRow>
                        <CCol md={6}>
                          <div className="info-row d-flex justify-content-between">
                            <span className="text-muted">Date of Birth</span>
                            <strong>{passenger.formattedDateOfBirth || passenger.dateOfBirth}</strong>
                          </div>
                          <div className="info-row d-flex justify-content-between">
                            <span className="text-muted">Gender</span>
                            <strong>{passenger.gender}</strong>
                          </div>
                          <div className="info-row d-flex justify-content-between">
                            <span className="text-muted">Age</span>
                            <strong>{passenger.age || 'N/A'}</strong>
                          </div>
                        </CCol>
                        <CCol md={6}>
                          <div className="info-row d-flex justify-content-between">
                            <span className="text-muted"><FaPassport className="me-1" size={12} />Passport</span>
                            <strong>{passenger.passportNumber}</strong>
                          </div>
                          <div className="info-row d-flex justify-content-between">
                            <span className="text-muted">Expiry</span>
                            <strong>{passenger.formattedPassportExpiry || passenger.passportExpiry}</strong>
                          </div>
                          <div className="info-row d-flex justify-content-between">
                            <span className="text-muted">Nationality</span>
                            <strong>{passenger.nationality?.code}</strong>
                          </div>
                        </CCol>
                      </CRow>
                    </div>
                  ))}
                </CCol>
                
                <CCol lg={4}>
                  <div className="compact-card">
                    <CCardHeader className="bg-light py-2">
                      <h6 className="mb-0">Contact Information</h6>
                    </CCardHeader>
                    <CCardBody className="p-3">
                      <div className="info-row d-flex align-items-center">
                        <FaEnvelope className="me-2 text-primary-custom" size={14} />
                        <div>
                          <small className="text-muted d-block">Email</small>
                          <strong>{requestedData.contactInformation?.email}</strong>
                        </div>
                      </div>
                      <div className="info-row d-flex align-items-center">
                        <FaPhone className="me-2 text-secondary-custom" size={14} />
                        <div>
                          <small className="text-muted d-block">Phone</small>
                          <strong>{requestedData.contactInformation?.formattedPhoneNumber}</strong>
                        </div>
                      </div>
                    </CCardBody>
                  </div>
                </CCol>
              </CRow>
            </CTabPane>

            {/* Payment & Pricing Tab */}
            <CTabPane visible={activeKey === 3}>
              <CRow>
                <CCol lg={8}>
                  <div className="compact-card">
                    <CCardHeader className="bg-light py-2">
                      <h6 className="mb-0"><FaDollarSign className="me-1" size={14} />Price Breakdown</h6>
                    </CCardHeader>
                    <CCardBody className="p-0">
                      <CTable className="compact-table mb-0">
                        <tbody>
                          <tr>
                            <td>Base Fare</td>
                            <td className="text-end">
                              {formatCurrency(requestedData.originPayment?.basefair, requestedData.originPayment?.currency)}
                            </td>
                          </tr>
                          <tr>
                            <td>Taxes & Fees</td>
                            <td className="text-end">
                              {formatCurrency(requestedData.originPayment?.taxfair, requestedData.originPayment?.currency)}
                            </td>
                          </tr>
                          <tr className="table-light">
                            <td><strong>Total Amount</strong></td>
                            <td className="text-end">
                              <strong className="text-primary-custom">
                                {formatCurrency(requestedData.originPayment?.total_amount, requestedData.originPayment?.currency)}
                              </strong>
                            </td>
                          </tr>
                        </tbody>
                      </CTable>
                    </CCardBody>
                  </div>

                  {/* Compact Tax Breakdown */}
                  <div className="compact-card mt-3">
                    <CCardHeader className="bg-light py-2">
                      <h6 className="mb-0">Tax Breakdown</h6>
                    </CCardHeader>
                    <CCardBody className="p-0">
                      <CTable className="compact-table mb-0">
                        <thead>
                          <tr>
                            <th>Code</th>
                            <th>Description</th>
                            <th>Station</th>
                            <th className="text-end">Amount</th>
                          </tr>
                        </thead>
                        <tbody>
                          {revalidationData?.taxSummaries?.slice(0, 5).map((tax, index) => (
                            <tr key={index}>
                              <td><span className="badge badge-tertiary-custom">{tax.code}</span></td>
                              <td><small>{tax.description.substring(0, 30)}...</small></td>
                              <td>{tax.station}</td>
                              <td className="text-end">
                                {formatCurrency(tax.amount / 304.719, 'USD')}
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </CTable>
                    </CCardBody>
                  </div>
                </CCol>

                <CCol lg={4}>
                  <div className="compact-card">
                    <CCardHeader className="bg-light py-2">
                      <h6 className="mb-0">Payment Details</h6>
                    </CCardHeader>
                    <CCardBody className="p-3">
                      <div className="info-row d-flex justify-content-between">
                        <span>Payment Method</span>
                        <span className="badge badge-primary-custom">{requestedData.cardPayData?.paymentMethod}</span>
                      </div>
                      <div className="info-row d-flex justify-content-between">
                        <span>Order Number</span>
                        <strong>{requestedData.cardPayData?.orderNumber}</strong>
                      </div>
                      <div className="info-row d-flex justify-content-between">
                        <span>Customer ID</span>
                        <strong>{requestedData.cardPayData?.customer}</strong>
                      </div>
                    </CCardBody>
                  </div>

                  <div className="compact-card mt-3">
                    <CCardHeader className="bg-light py-2">
                      <h6 className="mb-0">Booking Summary</h6>
                    </CCardHeader>
                    <CCardBody className="p-3">
                      <div className="info-row d-flex justify-content-between">
                        <span>Total Passengers</span>
                        <span className="badge badge-primary-custom">{requestedData.summary?.totalPassengers}</span>
                      </div>
                      <div className="info-row d-flex justify-content-between">
                        <span>Trip Type</span>
                        <span>{isRoundTrip ? 'Round Trip' : 'One Way'}</span>
                      </div>
                      <div className="info-row d-flex justify-content-between">
                        <span>Currency</span>
                        <strong>{requestedData.summary?.currency}</strong>
                      </div>
                    </CCardBody>
                  </div>
                </CCol>
              </CRow>
            </CTabPane>
            {/* Response Data Tab */}
            <CTabPane visible={activeKey === 4}>
              <div className="compact-card">
                <CCardHeader className="bg-light py-2 d-flex justify-content-between align-items-center">
                  <h6 className="mb-0">
                    <FaFileDownload className="me-1" size={14} />
                    Raw Response Data
                  </h6>
                  <div>
                    {getBookingStatus().isSuccess ? (
                      <span className="badge badge-primary-custom">Success</span>
                    ) : (
                      <span className="badge badge-secondary-custom">Failed</span>
                    )}
                    <span className="badge badge-tertiary-custom ms-2">
                      Status: {getBookingStatus().status}
                    </span>
                  </div>
                </CCardHeader>
                <CCardBody className="p-0">
                  <pre style={{
                    background: '#f8f9fa',
                    padding: '1rem',
                    margin: 0,
                    fontSize: '0.75rem',
                    lineHeight: '1.4',
                    overflow: 'auto',
                    maxHeight: '600px',
                    fontFamily: 'Monaco, Consolas, "Lucida Console", monospace'
                  }}>
                    {JSON.stringify(flightMetadata?.responseData || {}, null, 2)}
                  </pre>
                </CCardBody>
              </div>
            </CTabPane>
          </CTabContent>
        </CCardBody>
      </CCard>
    </div>
  )
}