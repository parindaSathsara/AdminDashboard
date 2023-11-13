import React, { useEffect, useState, useMemo, useRef } from 'react';
import { Button } from 'react-bootstrap';
import Modal from 'react-bootstrap/Modal';
import PDFView from './PDFView/PDFView';
import { getOtherInforDataByOrderId, updateAdditionalInfoDataByOrderId } from '../../service/api_calls';
import './AdditionalInfoBox.css';
import circle_loader_ from '../../assets/brand/aahaas.png';
// import tick from '../../../../assets/tik_gif.gif';

function AdditionalInfoBox(props) {

    const [otherInfoData, setOtherInfo] = useState([]);
    const [upadting, setUpdating] = useState(false);


    const inputRef = useRef();

    const handleSubmitValue = (e, x) => {
        console.log(x)
        setUpdating(true)
        const form_data = new FormData();

        form_data.append('field', e);
        form_data.append('value', x);
        form_data.append('user', sessionStorage.getItem('uid'));

        updateAdditionalInfoDataByOrderId(form_data, props.orderid).then((res) => {
            if (res == 200) {
                setUpdating(false)
            }
        })
    }

    const handleKeyDown = (e) => {
        if (e.keyCode == 13) {
            if (window.confirm('Are you sure want to change?')) {
                handleSubmitValue(e.target.name, e.target.value)
            }
        }
    }

    useMemo(() => {
        getOtherInforDataByOrderId(props?.orderid).then((res) => {
            setOtherInfo(res)
        })
    }, [])

    console.log(otherInfoData)

    useEffect(() => {
        getOtherInforDataByOrderId(props?.orderid).then((res) => {
            setOtherInfo(res)
        })
    }, [props])

    return (
        <div>
            <Modal
                {...props}
                size="xl"
                aria-labelledby="contained-modal-title-vcenter"
                centered
            >
                <Modal.Header closeButton>
                    <Modal.Title id="contained-modal-title-vcenter">
                        Updated Information
                    </Modal.Title>
                </Modal.Header>
                <Modal.Body>

                    {
                        upadting == true ?
                            <div className="loader_pre">
                                {
                                    upadting == true ?
                                        <img src={circle_loader_} className='loading__loader' />
                                        :
                                            null
                                }
                            </div>
                            : null
                    }

                    <div className="additional_infor_boxmodal">
                        <table className="table table-bordered">
                            <thead>
                                <tr>
                                    <th colSpan={2}>Product Notes</th>
                                    <th colSpan={3}>Confirmation Notes</th>
                                </tr>
                            </thead>
                            <tbody>
                                {
                                    otherInfoData?.map((val, idx) => {
                                        return (
                                            <tr key={idx}>
                                                <td colSpan={2} className='top_data'>
                                                    <input type="text" className='form-control d-block editable_texts' name='product_notes' defaultValue={val.product_notes} onKeyDown={handleKeyDown} />
                                                </td>
                                                <td colSpan={3} className='top_data'><input type="text" className='form-control d-block editable_texts' name='confirmation_notes' defaultValue={val.confirmation_notes} onKeyDown={handleKeyDown} /></td>
                                            </tr>
                                        )
                                    })
                                }
                            </tbody>
                            <thead>
                                <tr>
                                    <th colSpan={2}>Accounts Notes</th>
                                    <th colSpan={3}>Fullfillment Notes</th>
                                </tr>
                            </thead>
                            <tbody>
                                {
                                    otherInfoData?.map((val, idx) => {
                                        return (
                                            <tr key={idx}>
                                                <td colSpan={2}><input type="text" className='form-control d-block editable_texts' name='accounts_notes' defaultValue={val.accounts_notes} onKeyDown={handleKeyDown} /></td>
                                                <td colSpan={3}><input type="text" className='form-control d-block editable_texts' name='fullfilment_notes' defaultValue={val.fullfilment_notes} onKeyDown={handleKeyDown} /></td>
                                            </tr>
                                        )
                                    })
                                }
                            </tbody>

                            <thead>
                                <tr>
                                    <th colSpan={5}>Other Notes</th>
                                </tr>
                            </thead>
                            <tbody>
                                {
                                    otherInfoData?.map((val, idx) => {
                                        return (
                                            <tr key={idx}>
                                                <td colSpan={5}><input type="text" className='form-control d-block editable_texts' name='other_notes' defaultValue={val.other_notes} onKeyDown={handleKeyDown} /></td>
                                            </tr>
                                        )
                                    })
                                }
                            </tbody>

                            <thead>
                                <tr>
                                    <th>Flight Details</th>
                                    <th>Passport Details</th>
                                    <th>Vaccine Details</th>
                                    <th>Supplier Details</th>
                                    <th>Special Details</th>
                                </tr>
                            </thead>
                            <tbody>

                                {
                                    otherInfoData?.map((val, idx) => {
                                        return (
                                            <tr key={idx}>
                                                <td>
                                                    {
                                                        val.flight_details.split(',')?.map((value, index) => (
                                                            <>
                                                                <a href={'../../../' + value} className='link' target='_blank' key={index} >Flight Detail {index + 1}</a> <br />
                                                            </>
                                                        ))
                                                    }
                                                </td>
                                                <td>
                                                    {
                                                        val.passport_copies.split(',')?.map((value, index) => (
                                                            <>
                                                                <a href={'../../../' + value} className='link' target='_blank' key={index} >Passport Detail {index + 1}</a> <br />
                                                            </>
                                                        ))
                                                    }
                                                </td>
                                                <td>
                                                    {
                                                        val.vaccine_certificate.split(',')?.map((value, index) => (
                                                            <>
                                                                <a href={'../../../' + value} className='link' target='_blank' key={index} >Vaccination Detail {index + 1}</a> <br />
                                                            </>
                                                        ))
                                                    }
                                                </td>

                                                <td>
                                                    {
                                                        val.supplier_confirmation.split(',')?.map((value, index) => (
                                                            <>
                                                                <a href={'../../../' + value} className='link' target='_blank' key={index} >Supplier Detail {index + 1}</a> <br />
                                                            </>
                                                        ))
                                                    }
                                                </td>

                                                <td>
                                                    {
                                                        val.special_notes.split(',')?.map((value, index) => (
                                                            <>
                                                                <a href={'../../../' + value} className='link' target='_blank' key={index} >Special Detail {index + 1}</a> <br />
                                                            </>
                                                        ))
                                                    }
                                                </td>
                                                {/* <td colSpan={2}>{val.flight_details}</td> */}
                                            </tr>
                                        )
                                    })
                                }
                            </tbody>
                        </table>
                    </div>


                </Modal.Body>
                <Modal.Footer>
                    {/* <Button size='sm' variant='outline-secondary' onClick={props.onHide}>Close</Button>
                  <Button size='sm' variant='outline-secondary' onClick={handleShowImage} disabled={textChange.email_type == '' || textChange.email_type == null ? true : false}>Preview</Button>
                  <Button type='submit' size='sm' onClick={handleFormSubmit} variant='primary'>Send</Button> */}
                </Modal.Footer>
            </Modal>

            <PDFView />
        </div>
    )
}

export default AdditionalInfoBox