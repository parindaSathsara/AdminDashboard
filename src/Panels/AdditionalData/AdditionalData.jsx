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

        // console.log(...form_data);

        createNewOtherInfo(form_data).then(RESULT => {
            Swal.fire({
                title: "Additional Information Submitted",
                text: "Additional Information Updated Successfully",
                icon: "success"
            });
        })

    }

    return (
        <div className='aditional_box w-100'>
            <Modal
                {...props}
                size="xl"
                aria-labelledby="contained-modal-title-vcenter"
                centered
            >
                <Modal.Header closeButton>
                    <Modal.Title id="contained-modal-title-vcenter">
                        Additional Data Information
                    </Modal.Title>
                </Modal.Header>
                <Modal.Body>

                    <form className="row" onSubmit={handleOnSubmit} encType='multipart/form-data'>
                        <div className="form-group col-md-6">
                            <TextField
                                className='w-100 required'
                                id="product"
                                label="Product Notes"
                                multiline
                                maxRows={5}
                                name='product_notes'
                                onChange={handleInputChange}
                            />
                        </div>

                        <div className="form-group col-md-6">
                            <TextField
                                className='w-100 required'
                                id="confirmation"
                                label="Confirmation Notes"
                                multiline
                                maxRows={5}
                                name='confirmation_notes'
                                onChange={handleInputChange}
                            />
                        </div>

                        <div className="form-group col-md-6">
                            <TextField
                                className='my-2 w-100 required'
                                id="accounts"
                                label="Accounts Notes"
                                multiline
                                maxRows={5}
                                name='account_notes'
                                onChange={handleInputChange}
                            />
                        </div>

                        <div className="form-group col-md-6">
                            <TextField
                                className='my-2 w-100 required'
                                id="fullfilment"
                                label="Fullfilment Notes"
                                multiline
                                maxRows={5}
                                name='fulfilment_notes'
                                onChange={handleInputChange}
                            />
                        </div>

                        <div className="form-group col-md-12">
                            <TextField
                                className='my-2 w-100 required'
                                id="othernotes"
                                label="Other Notes"
                                multiline
                                maxRows={5}
                                name='other_notes'
                                onChange={handleInputChange}
                            />
                        </div>

                        <hr />

                        <div className='upload_section'>
                            <div className="flight_upload">
                                <h6 className="section_title">Flight Details | {flightData.length} File(s)</h6>
                                <Button
                                    variant="contained"
                                    component="label"
                                    size='small'
                                    onChange={handleFlightDetailsChange}

                                >
                                    Upload File
                                    <input
                                        type="file"
                                        hidden
                                        multiple
                                        name='flight_data'
                                        accept=".jpg,.png,.jpeg,.pdf"
                                    />
                                </Button>
                            </div>

                            <div className="passport_upload">
                                <h6 className="section_title">Passport Copies | {passportData.length} File(s)</h6>
                                <Button
                                    variant="contained"
                                    component="label"
                                    size='small'
                                    onChange={handlePassportData}
                                >
                                    Upload File
                                    <input
                                        type="file"
                                        hidden
                                        multiple
                                        name='passport_data'
                                        accept=".jpg,.png,.jpeg,.pdf"
                                    />
                                </Button>
                            </div>

                            <div className="vaccine_upload">
                                <h6 className="section_title">Vaccine Details | {vaccineData.length} File(s)</h6>
                                <Button
                                    variant="contained"
                                    component="label"
                                    size='small'
                                    onChange={handleVaccineData}
                                >
                                    Upload File
                                    <input
                                        type="file"
                                        hidden
                                        multiple
                                        name='vaccine_data'
                                        accept=".jpg,.png,.jpeg,.pdf"
                                    />
                                </Button>
                            </div>

                            <div className="supplier_upload">
                                <h6 className="section_title">Supplier Information | {suppData.length} File(s)</h6>
                                <Button
                                    variant="contained"
                                    component="label"
                                    size='small'
                                    onChange={handleSupData}
                                >
                                    Upload File
                                    <input
                                        type="file"
                                        hidden
                                        multiple
                                        name='supplier_data'
                                        accept=".jpg,.png,.jpeg,.pdf"
                                    />
                                </Button>
                            </div>

                            <div className="special_upload">
                                <h6 className="section_title">Special Information | {otherData.length} File(s)</h6>
                                <Button
                                    variant="contained"
                                    component="label"
                                    size='small'
                                    onChange={handleOtherData}
                                >
                                    Upload File
                                    <input
                                        type="file"
                                        hidden
                                        multiple
                                        name='special_data'
                                        accept=".jpg,.png,.jpeg,.pdf"
                                    />
                                </Button>
                            </div>
                        </div>

                        {/* ################ */}

                        <Button type='submit' className='mt-4 btn_submit_addtional' variant="contained" size='small' color='success'>Submit</Button>
                    </form>
                </Modal.Body>
                <Modal.Footer>
                    <Button className='mx-2' variant="contained" size='small' onClick={props.onHide}>Close</Button>
                </Modal.Footer>
            </Modal>
        </div>
    )
}

export default AdditionalData