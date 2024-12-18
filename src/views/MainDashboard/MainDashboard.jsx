import React, { useContext, useEffect, useState } from 'react'
import classNames from 'classnames'

import {
  CAlert,
  CAlertHeading,
  CAlertLink,
  CCard,
  CCardBody,
  CCardHeader,
  CCardTitle,
  CCol,
  CRow,
} from '@coreui/react'

import { UserLoginContext } from 'src/Context/UserLoginContext'
import { CurrencyContext } from 'src/Context/CurrencyContext'
import { DocsExample } from 'src/components'
import OrderAllocate from './OrdersList.jsx/OrdersListAllocations'
import axios from 'axios'

const MainDashboard = () => {

  const { userData, setUserData } = useContext(UserLoginContext);
  const {currencyData, setCurrencyData} = useContext(CurrencyContext);


//   useEffect(() => {
//     const currencyDataL = localStorage.getItem('currencyData');

//     if (currencyDataL) {
//         setCurrencyData(JSON.parse(currencyDataL));
//     } else {
//         axios.get(`getCurrency/${"USD"}`).then(response => {
//             if (response?.data?.status == 200) {
//                 console.log(response.data, "Currency Data");
//                 setCurrencyData(response.data);
//                 localStorage.setItem('currencyData', JSON.stringify(response.data));
//                 window.location.reload();
//             }
//         });
//     }
// }, []);
  // console.log(userData, "User Data is")

  return (
    <>


      <CCardTitle id="traffic" className="card-title mb-4" style={{ fontSize: 24 }}>
        Hi {userData?.name}
      </CCardTitle>

      <CRow>
        <CCol xs={12}>
          <CCard className="mb-4">
            <CCardHeader>
              <strong>All Orders</strong>
            </CCardHeader>
            <CCardBody>
              <p className="text-medium-emphasis small">
                Pending customer orders awaiting processing, prioritization, and timely fulfillment.
              </p>

              {/* {// console.log(userData, "User Data issssss")} */}

              {userData.user_role == "super_admin"|| userData.roles.includes("Sales") || userData.roles.includes("Booking")  ?
                // <OrderAllocate normalUser={false}></OrderAllocate>
                <OrderAllocate normalUser={false}></OrderAllocate>
                : 
                <OrderAllocate normalUser={false}></OrderAllocate> 
               }


            </CCardBody>

          </CCard>
        </CCol>


        {/* <CCol xs={12}>
          <CCard className="mb-4">
            <CCardHeader>
              <strong>React Alert</strong> <small>Dismissing</small>
            </CCardHeader>
            <CCardBody>
              <p className="text-medium-emphasis small">
                Alerts can also be easily dismissed. Just add the <code>dismissible</code> prop.
              </p>
              <DocsExample href="components/alert#dismissing">
                <CAlert
                  color="warning"
                  dismissible
                  onClose={() => {
                    alert('👋 Well, hi there! Thanks for dismissing me.')
                  }}
                >
                  <strong>Go right ahead</strong> and click that dimiss over there on the right.
                </CAlert>
              </DocsExample>
            </CCardBody>
          </CCard>
        </CCol> */}
      </CRow>





    </>
  )
}

export default MainDashboard