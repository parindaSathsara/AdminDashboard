import React, { useEffect, useState } from 'react';
import './AdditionalData.css';
import { DataGrid, GridToolbar } from '@mui/x-data-grid';
import discountTotal from '../dcalculator';
import moment from 'moment';
import Button from '@mui/material/Button';
import Modal from 'react-bootstrap/Modal';
import TextField from '@mui/material/TextField';
import Typography from '@mui/material/Typography';
import { createNewOtherInfo } from '../../service/api_calls';
import Swal from 'sweetalert2';

function AdditionalData(props) {
  const [toggle, setToggle] = useState(true);
  const [inputChange, setInputChange] = useState({
    product_notes: '',
    confirmation_notes: '',
    account_notes: '',
    fulfilment_notes: '',
    other_notes: ''
  });
  const [flightData, setFlightData] = useState([]);
  const [passportData, setPassportData] = useState([]);
  const [vaccineData, setVaccineData] = useState([]);
  const [suppData, setSuppData] = useState([]);
  const [otherData, setOtherData] = useState([]);

  const handleInputChange = (e) => {
    setInputChange({ ...inputChange, [e.target.name]: e.target.value });
  }

  const handleFlightDetailsChange = (e) => {
    setFlightData(e.target.files);
  }

  const handlePassportData = (e) => {
    setPassportData(e.target.files);
  }

  const handleVaccineData = (e) => {
    setVaccineData(e.target.files);
  }

  const handleSupData = (e) => {
    setSuppData(e.target.files);
  }

  const handleOtherData = (e) => {
    setOtherData(e.target.files);
  }

  const handleOnSubmit = (e) => {
    e.preventDefault();
    
    // Check if all notes are empty
    const allNotesEmpty = Object.values(inputChange).every(val => val.trim() === "");
    
    // Check if all file arrays are empty
    const allFilesEmpty = flightData.length === 0 && passportData.length === 0 && 
                          vaccineData.length === 0 && suppData.length === 0 && 
                          otherData.length === 0;

    // If both notes and files are empty, show error and stop
    if (allNotesEmpty && allFilesEmpty) {
      Swal.fire({
        title: "Error",
        text: "Please add at least one note or upload a file before submitting.",
        icon: "error"
      });
      return;
    }

    const form_data = new FormData();
    form_data.append('orderid', props.orderid);
    form_data.append('product_notes', inputChange.product_notes);
    form_data.append('confirmation_notes', inputChange.confirmation_notes);
    form_data.append('account_notes', inputChange.account_notes);
    form_data.append('fulfilment_notes', inputChange.fulfilment_notes);
    form_data.append('other_notes', inputChange.other_notes);
    form_data.append('user_id', sessionStorage.getItem('uid'));

    for (let i = 0; i < flightData.length; i++) {
      form_data.append('flight_data[]', flightData[i]);
    }
    for (let i = 0; i < passportData.length; i++) {
      form_data.append('passport_data[]', passportData[i]);
    }
    for (let i = 0; i < vaccineData.length; i++) {
      form_data.append('vaccine_data[]', vaccineData[i]);
    }
    for (let i = 0; i < suppData.length; i++) {
      form_data.append('supplier_data[]', suppData[i]);
    }
    for (let i = 0; i < otherData.length; i++) {
      form_data.append('special_data[]', otherData[i]);
    }

    createNewOtherInfo(form_data).then(RESULT => {
      Swal.fire({
        title: "Additional Information Submitted",
        text: "Additional Information Updated Successfully",
        icon: "success"
      });
    });
  };

  return (
    <div className='aditional_box w-100'>
      <Modal {...props} size="xl" aria-labelledby="contained-modal-title-vcenter" centered >
        <Modal.Header closeButton>
          <Modal.Title id="contained-modal-title-vcenter">
            Additional Data Information
          </Modal.Title>
        </Modal.Header>
        <Modal.Body className="additional-data-modal-body">
          <form className="row" onSubmit={handleOnSubmit} encType='multipart/form-data'>
            <div className="form-group col-md-6 mb-3">
              <TextField 
                className='w-100 required additional-textfield' 
                id="product" 
                label="Product Notes" 
                multiline 
                rows={3}
                name='product_notes' 
                onChange={handleInputChange}
                variant="outlined"
              />
            </div>
            <div className="form-group col-md-6 mb-3">
              <TextField 
                className='w-100 required additional-textfield' 
                id="confirmation" 
                label="Confirmation Notes" 
                multiline 
                rows={3}
                name='confirmation_notes' 
                onChange={handleInputChange}
                variant="outlined"
              />
            </div>
            <div className="form-group col-md-6 mb-3">
              <TextField 
                className='w-100 required additional-textfield' 
                id="accounts" 
                label="Accounts Notes" 
                multiline 
                rows={3}
                name='account_notes' 
                onChange={handleInputChange}
                variant="outlined"
              />
            </div>
            <div className="form-group col-md-6 mb-3">
              <TextField 
                className='w-100 required additional-textfield' 
                id="fullfilment" 
                label="Fulfilment Notes" 
                multiline 
                rows={3}
                name='fulfilment_notes' 
                onChange={handleInputChange}
                variant="outlined"
              />
            </div>
            <div className="form-group col-md-12 mb-4">
              <TextField 
                className='w-100 required additional-textfield' 
                id="othernotes" 
                label="Other Notes" 
                multiline 
                rows={3}
                name='other_notes' 
                onChange={handleInputChange}
                variant="outlined"
              />
            </div>
            
            <hr className='my-4' />
            
            <div className='upload_section'>
              <div className="flight_upload mb-3 p-3 border rounded">
                <h6 className="section_title mb-3">FLIGHT DETAILS | {flightData.length} FILE(S)</h6>
                <Button variant="contained" component="label" size='small' onChange={handleFlightDetailsChange} >
                  UPLOAD FILE
                  <input type="file" hidden multiple name='flight_data' accept=".jpg,.png,.jpeg,.pdf" />
                </Button>
              </div>
              
              <div className="passport_upload mb-3 p-3 border rounded">
                <h6 className="section_title mb-3">PASSPORT COPIES | {passportData.length} FILE(S)</h6>
                <Button variant="contained" component="label" size='small' onChange={handlePassportData} >
                  UPLOAD FILE
                  <input type="file" hidden multiple name='passport_data' accept=".jpg,.png,.jpeg,.pdf" />
                </Button>
              </div>
              
              <div className="vaccine_upload mb-3 p-3 border rounded">
                <h6 className="section_title mb-3">VACCINE DETAILS | {vaccineData.length} FILE(S)</h6>
                <Button variant="contained" component="label" size='small' onChange={handleVaccineData} >
                  UPLOAD FILE
                  <input type="file" hidden multiple name='vaccine_data' accept=".jpg,.png,.jpeg,.pdf" />
                </Button>
              </div>
              
              <div className="supplier_upload mb-3 p-3 border rounded">
                <h6 className="section_title mb-3">SUPPLIER INFORMATION | {suppData.length} FILE(S)</h6>
                <Button variant="contained" component="label" size='small' onChange={handleSupData} >
                  UPLOAD FILE
                  <input type="file" hidden multiple name='supplier_data' accept=".jpg,.png,.jpeg,.pdf" />
                </Button>
              </div>
              
              <div className="special_upload mb-4 p-3 border rounded">
                <h6 className="section_title mb-3">SPECIAL INFORMATION | {otherData.length} FILE(S)</h6>
                <Button variant="contained" component="label" size='small' onChange={handleOtherData} >
                  UPLOAD FILE
                  <input type="file" hidden multiple name='special_data' accept=".jpg,.png,.jpeg,.pdf" />
                </Button>
              </div>
            </div>
            
            <div className="d-flex justify-content-between mt-4">
              <Button type='submit' variant="contained" size='medium' color='success'>
                SUBMIT
              </Button>
              <Button variant="outlined" size='medium' onClick={props.onHide}>
                CLOSE
              </Button>
            </div>
          </form>
        </Modal.Body>
      </Modal>
    </div>
  )
}

export default AdditionalData;