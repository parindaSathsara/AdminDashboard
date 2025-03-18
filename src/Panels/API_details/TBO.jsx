import {
  CCard,
  CCardBody,
  CCardText,
  CCardTitle,
  CCol,
  CContainer,
  CRow,
} from "@coreui/react";
import axios from "axios";
import React, { useState, useEffect } from "react";

const TBO = () => {
  const [tboDetails, setTboDetails] = useState(null);

  useEffect(() => {
    fetchTboDetails();
  }, []);

  const fetchTboDetails = async () => {
    try {
      const res = await axios.get("/tbov2/getAgencyBalance");
      setTboDetails(res.data);
      console.log(res.data);
    } catch (err) {
      console.error("Error fetching details:", err);
    }
  };

  return (
    <CContainer>
      <h2>Agency Balance</h2>
      {tboDetails && (
        <CCard style={{ width: "22rem", margin: "1rem" }}>
          <CCardBody>
            <CCardTitle>Financial Details</CCardTitle>
            <CCardText>
              <strong>Cash Balance:</strong>{" "}
              {tboDetails.CashBalance}{" "}
              {tboDetails.CashBalanceInPrefCurrency || "USD"}
            </CCardText>
            <CCardText>
              <strong>Credit Balance:</strong>{" "}
              {tboDetails.CreditBalance}{" "}
              {tboDetails.CreditBalanceInPrefCurrency || "USD"}
            </CCardText>
          </CCardBody>
        </CCard>
      )}
    </CContainer>
  );
};

export default TBO;
