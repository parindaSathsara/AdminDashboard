import { CButton, CCol, CForm, CFormCheck, CFormFeedback, CFormInput, CFormLabel, CFormSelect, CFormTextarea, CInputGroup, CInputGroupText } from "@coreui/react";
import { useEffect, useState } from "react";
import Swal from "sweetalert2";


function PaymentRejection(props) {

    const [validated, setValidated] = useState(false)
    const handleSubmit = (event) => {
        const form = event.currentTarget
        if (form.checkValidity() === false) {
            event.preventDefault()
            event.stopPropagation()
        }
        // else {
        //     event.preventDefault()
        //     setValidated(true)
        //     // Swal.fire({
        //     //     title: "Are you sure?",
        //     //     text: "You want to reject this payment",
        //     //     icon: "question",
        //     //     showCancelButton: true,
        //     //     confirmButtonColor: "#979797",
        //     //     cancelButtonColor: "#d33",
        //     //     confirmButtonText: "Reject Payment"
        //     // }).then((result) => {
        //     //     if (result.isConfirmed) {
        //     //         Swal.fire({
        //     //             title: "Payment Approved!",
        //     //             text: "Order - " + orderid + "Payment Approved",
        //     //             icon: "success"
        //     //         });
        //     //     }
        //     // });

        // }

        event.preventDefault();
        setValidated(true)
        Swal.fire({
            title: "Are you sure?",
            text: "You want to reject this payment",
            icon: "question",
            showCancelButton: true,
            confirmButtonColor: "#979797",
            cancelButtonColor: "#d33",
            confirmButtonText: "Reject Payment"
        }).then((result) => {
            if (result.isConfirmed) {
                Swal.fire({
                    title: "Payment Rejected!",
                    text: "Order - " + props.orderid + " Payment Rejected",
                    icon: "success"
                });
            }
        });




    }


    const [formData, setFormData] = useState({
        reasonRejection: '',
        remarks: '',
    })


    const [balanceAmount, setBalanceAmount] = useState({
        paidAmount: 0.00,
        balanceAmountToPay: 0.00
    })


    const handleFormData = (e) => {
        const { name, value } = e.target;

        setFormData({
            ...formData,
            [name]: value,
        });
    }


    const handleBalancePayment = (e) => {
        const { name, value } = e.target;

        setBalanceAmount({
            ...balanceAmount,
            balanceAmountToPay: paymentDataSet.paid_amount - value,
            paidAmount: value
        });


    }



    const [paymentDataSet, setPaymentDataSet] = useState([])


    useEffect(() => {

        setPaymentDataSet(props.paymentDataSet)
        setBalanceAmount({
            ...balanceAmount,
            balanceAmountToPay: props.paymentDataSet?.paid_amount,
        });

        // console.log(props.paymentDataSet, "Payment Data set value is")

    }, [props.paymentDataSet])



    return (
        <CForm
            className="row g-3 needs-validation"
            noValidate
            validated={validated}
            onSubmit={handleSubmit}
        >

            <CCol md={12}>
                <CFormSelect
                    aria-describedby="validationCustom04Feedback"
                    feedbackInvalid="Please select proper reason for payment rejection"
                    id="validationCustom04"
                    label="Reason for Payment Rejection"
                    onChange={handleFormData}
                    name="reasonRejection"
                    value={formData.reasonRejection}
                    required
                >
                    <option value={""} selected>Select Option</option>
                    <option value="Indicates that only a portion of the total amount has been paid">Indicates that only a portion of the total amount has been paid</option>

                    <option value="The uploaded receipt is unclear, illegible, or distorted">The uploaded receipt is unclear, illegible, or distorted</option>
                    <option value="The receipt provided contains incorrect information, such as wrong transaction amounts, dates, or payee details">The receipt provided contains incorrect information, such as wrong transaction amounts, dates, or payee details</option>
                    <option value="The uploaded receipt is incomplete, missing essential details, or pages">The uploaded receipt is incomplete, missing essential details, or pages</option>
                    <option value="The receipt format does not adhere to the specified guidelines or standards set by the payment system">The receipt format does not adhere to the specified guidelines or standards set by the payment system</option>
                    <option value="The receipt submitted has passed its validity or expiration date">The receipt submitted has passed its validity or expiration date</option>
                    <option value="The same receipt has been uploaded multiple times for the same transaction">The same receipt has been uploaded multiple times for the same transaction</option>
                    <option value="The uploaded file is not in the specified or supported format (e.g., PDF, JPEG, PNG)">The uploaded file is not in the specified or supported format (e.g., PDF, JPEG, PNG)</option>
                    <option value="The currency mentioned in the receipt does not match the accepted currency for the transaction">The currency mentioned in the receipt does not match the accepted currency for the transaction</option>
                    <option value="The payment method used is not approved or accepted by the organization">The payment method used is not approved or accepted by the organization</option>
                    <option value="The payment or receipt violates the organization's financial policies">The payment or receipt violates the organization's financial policies</option>
                </CFormSelect>
            </CCol>

            <CCol md={12}>
                <CFormTextarea
                    type="text"
                    defaultValue=""
                    name="remarks"
                    id="validationCustom01"
                    label="Remarks"
                    value={formData.remarks}
                    onChange={handleFormData}
                />
            </CCol>


            {formData.reasonRejection == "Indicates that only a portion of the total amount has been paid" ?
                <>
                    <CCol md={6}>
                        <CFormInput
                            type="number"
                            defaultValue="0.00"

                            name="paidAmount"
                            id="validationCustom05"
                            label="Paid Amount"
                            feedbackInvalid="Please fill paid amount"
                            onChange={handleBalancePayment}
                            required
                        />
                    </CCol>
                    <CCol md={6}>
                        <CFormInput
                            type="number"
                            defaultValue="0.00"
                            name="balanceAmount"
                            id="validationCustom06"
                            label="Balance Amount"

                            disabled={true}

                            value={balanceAmount.balanceAmountToPay}
                            onChange={handleBalancePayment}

                        />
                    </CCol>

                </>

                :
                null
            }





            <CCol xs={12}>
                <CButton className="btnViewAction" type="submit" >
                    Reject Payment
                </CButton>
            </CCol>
        </CForm>
    )
}

export default PaymentRejection;