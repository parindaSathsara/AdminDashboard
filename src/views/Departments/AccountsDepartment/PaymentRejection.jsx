import { CButton, CCol, CForm, CFormCheck, CFormFeedback, CFormInput, CFormLabel, CFormSelect, CFormTextarea } from "@coreui/react";
import axios from "axios";
import { useEffect, useState } from "react";
import Swal from "sweetalert2";

function PaymentRejection(props) {
    const [validated, setValidated] = useState(false);
    const [formData, setFormData] = useState({
        reasonRejection: '',
        remarks: '',
        paidAmount: '',
    });

    const [balanceAmount, setBalanceAmount] = useState({
        paidAmount: 0.00,
        balanceAmountToPay: 0.00
    });
    const [paymentDataSet, setPaymentDataSet] = useState([]);

    useEffect(() => {
        setPaymentDataSet(props.paymentDataSet);
        setBalanceAmount({
            ...balanceAmount,
            balanceAmountToPay: props.paymentDataSet?.paid_amount || 0.00,
        });
    }, [props.paymentDataSet]);

    const handleFormData = (e) => {
        const { name, value } = e.target;

        setFormData({
            ...formData,
            [name]: value,
        });

        if (name === 'paidAmount') {
            setBalanceAmount({
                ...balanceAmount,
                paidAmount: value,
                balanceAmountToPay: paymentDataSet.paid_amount - value,
            });
        }
    };

    const handleSubmit = (event) => {
        event.preventDefault();
        const form = event.currentTarget;

        if (form.checkValidity() === false || (formData.paidAmount > balanceAmount.balanceAmountToPay && formData.reasonRejection === "Indicates that only a portion of the total amount has been paid")) {
            event.stopPropagation();
            setValidated(true);
        } else {
            setValidated(true);
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
                    axios.post(`/order/${props.orderid}/reject-payment`, formData)
                      .then(res => {
                        Swal.fire({
                          title: "Payment Rejected!",
                          text: res.data.message,
                          icon: "success"
                        });

                        props.handleRejectionSuccess();
                      })
                      .catch(error => {
                      Swal.fire({
                        title: "Payment Rejected!",
                        text: error.response.data.message,
                        icon: "error"
                    });
                    
                      });
                    
                }
            });
        }
    };

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
                    feedbackInvalid="Please select a proper reason for payment rejection"
                    id="validationCustom04"
                    label="Reason for Payment Rejection"
                    onChange={handleFormData}
                    name="reasonRejection"
                    value={formData.reasonRejection}
                    required
                >
                    <option value="">Select Option</option>
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
                    name="remarks"
                    id="validationCustom01"
                    feedbackInvalid="Please add the remarks"
                    label="Remarks"
                    value={formData.remarks}
                    onChange={handleFormData}
                    required
                />  {/* <CFormFeedback type="invalid">
                    Please provide remarks.
                </CFormFeedback>
               */}
            </CCol>

            {formData.reasonRejection === "Indicates that only a portion of the total amount has been paid" &&
                <>
                    <CCol md={6}>
                        <CFormInput
                            type="number"
                            name="paidAmount"
                            id="validationCustom05"
                            label="Paid Amount"
                            feedbackInvalid="Paid amount must be less than or equal to balance amount"
                            value={formData.paidAmount}
                            onChange={handleFormData}
                            required
                        />
                        {formData.paidAmount > balanceAmount.balanceAmountToPay && (
                            <CFormFeedback invalid>Paid amount cannot be greater than the balance amount.</CFormFeedback>
                        )}
                    </CCol>
                    <CCol md={6}>
                        <CFormInput
                            type="number"
                            name="balanceAmount"
                            id="validationCustom06"
                            label="Balance Amount"
                            disabled={true}
                            value={balanceAmount.balanceAmountToPay}
                        />
                    </CCol>
                </>
            }

            <CCol xs={12}>
                <CButton className="btnViewAction" type="submit">
                    Reject Payment
                </CButton>
            </CCol>
        </CForm>
    );
}

export default PaymentRejection;
