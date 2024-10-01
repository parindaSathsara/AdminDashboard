import axios from 'axios';
import React, { useEffect, useMemo, useState } from 'react'
import Select from 'react-select'
import countryList from 'react-select-country-list';

import DriverCard from './DriverCard';

import '../Allocations.css';

function DriverAllocationHome() {

  const [existingDrivers, setExistingDrivers] = useState({
    status: true,
    driverData: [],
    error: ''
  });

  const options = useMemo(() => countryList().getData(), []);

  const [driverDetails, setDriverDetails] = useState({
    driverName: '',
    driverRegistredCountry: '',
    driverType: '',
    driverNIC: '',
    driverRegistredDate: ''
  });

  const [driverUpdateStatus, setDriverUpdateStatus] = useState({
    status: false,
    driverID: ''
  })

  const resetValues = async () => {
    setDriverDetails({
      driverName: '',
      driverRegistredCountry: '',
      driverType: '',
      driverNIC: '',
      driverRegistredDate: ''
    })
    setDriverUpdateStatus({
      status: false,
      driverID: ''
    })
  }

  const handleDriverFormSubmit = async (e) => {
    e.preventDefault();
    const dataset = {
      driver_name: driverDetails.driverName,
      registered_country: driverDetails.driverRegistredCountry,
      deiver_type: driverDetails.driverType,
      deriver_nic: driverDetails.driverNIC,
      registered_date: driverDetails.registered_date
    }
    await axios.post('/drivers/store', dataset).then(async (response) => {
      await getExistingDrivers()
    })
  }

  const handleOnchangeDriverDetails = (name, value) => {
    setDriverDetails({
      ...driverDetails,
      [name]: value
    })
  }

  const handleUpdateDriver = async (driverDet) => {
    setDriverDetails({
      driverName: driverDet.driver_name,
      driverRegistredCountry: driverDet.registered_country,
      driverType: driverDet.driver_type,
      driverNIC: driverDet.driver_nic,
      driverRegistredDate: driverDet.registered_date
    })
    setDriverUpdateStatus({
      status: true,
      driverID: driverDet.id
    })
  }

  const handleDelete = async (id) => {
    console.log(id);
    await getExistingDrivers();
  }

  const getExistingDrivers = async () => {
    setExistingDrivers({
      status: true,
      driverData: [],
      error: 'Loading driver details'
    })
    try {
      await axios.get('/drivers/all').then((response) => {
        if (response.status === 200 && response.data.status === 'success') {
          setExistingDrivers({
            status: false,
            driverData: response.data.data,
            error: ''
          })
        } else {
          setExistingDrivers({
            status: false,
            driverData: [],
            error: 'Something went wrong !'
          })
        }
      }).catch((error) => {
        setExistingDrivers({
          status: false,
          driverData: [],
          error: error
        })
      })
    } catch (error) {
      setExistingDrivers({
        status: false,
        driverData: [],
        error: error
      })
    }
    await resetValues();
  }

  useEffect(() => {
    getExistingDrivers();
  }, []);

  return (
    <div className='allocation-main-page-container col-12 row py-4 px-3'>

      <div className='col-lg-8'>
        <h6 className='mb-4 border-bottom pb-3'>Add / edit new drivers</h6>
        <form onSubmit={handleDriverFormSubmit}>
          <div className='container-fluid row my-3'>
            <div className='col-lg-4 d-flex flex-column align-items-start mb-3'>
              <label className='text-muted mb-1' style={{ fontSize: 13, textTransform: 'capitalize' }}>Driver name</label>
              <input type="text" className='form-control' placeholder='Ex : John doe' value={driverDetails.driverName} name='driverName' onChange={(e) => handleOnchangeDriverDetails(e.target.name, e.target.value)} />
            </div>
            <div className='col-lg-4 d-flex flex-column align-items-start mb-3'>
              <label className='text-muted mb-1' style={{ fontSize: 13, textTransform: 'capitalize' }}>Driver registred country</label>
              <Select options={options} className='form-control border-0 p-0' value={options.find(option => option.value === driverDetails.driverRegistredCountry)} onChange={(e) => handleOnchangeDriverDetails('driverRegistredCountry', e.value)} placeholder="Select a country" />
            </div>
            <div className='col-lg-4 d-flex flex-column align-items-start mb-3'>
              <label className='text-muted mb-1' style={{ fontSize: 13, textTransform: 'capitalize' }}>Driver type</label>
              <input type="text" className='form-control' placeholder='Deiver type' value={driverDetails.driverType} name='driverType' onChange={(e) => handleOnchangeDriverDetails(e.target.name, e.target.value)} />
            </div>
            <div className='col-lg-4 d-flex flex-column align-items-start mb-3'>
              <label className='text-muted mb-1' style={{ fontSize: 13, textTransform: 'capitalize' }}>Driver NIC</label>
              <input type="text" className='form-control' placeholder='Deiver type' value={driverDetails.driverNIC} name='driverNIC' onChange={(e) => handleOnchangeDriverDetails(e.target.name, e.target.value)} />
            </div>
            <div className='col-lg-4 d-flex flex-column align-items-start mb-3'>
              <label className='text-muted mb-1' style={{ fontSize: 13, textTransform: 'capitalize' }}>Registred date</label>
              <input type="date" className='form-control' placeholder='Deiver type' value={driverDetails.driverRegistredDate} name='driverRegistredDate' onChange={(e) => handleOnchangeDriverDetails(e.target.name, e.target.value)} />
            </div>
          </div>
          <div className='col-lg-12 d-flex justify-content-end align-items-center gap-3'>
            <button className='px-4 btn btn-primary' style={{ color: 'white', fontSize: 14 }} type='submit'>{driverUpdateStatus.status ? "update" : "Submit"}</button>
            <button className='px-4 btn btn-secondary' style={{ color: 'white', fontSize: 14 }} type='reset' onClick={resetValues}>Reset</button>
          </div>
        </form>
      </div>

      <div className='col-lg-4'>
        <h6 className='mb-4 border-bottom pb-3'>All Drivers</h6>
        {
          existingDrivers.status ?
            <p>
              {existingDrivers.error}
            </p> :
            existingDrivers.driverData.length > 0 &&
            existingDrivers.driverData.map((value, key) => (
              <DriverCard driverDetails={value} key={key} handleUpdateDriver={handleUpdateDriver} handleDelete={handleDelete} />
            ))
        }
      </div>

    </div>
  )
}

export default DriverAllocationHome