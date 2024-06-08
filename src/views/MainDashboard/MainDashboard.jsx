import React, { useContext } from 'react'
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
import { DocsExample } from 'src/components'
import BasicTable from './OrdersList.jsx/OrdersListAllocations'

const MainDashboard = () => {

  const { userData, setUserData } = useContext(UserLoginContext);

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

              <BasicTable></BasicTable>

            </CCardBody>



          </CCard>
        </CCol>
        <CCol xs={12}>
          <CCard className="mb-4">
            <CCardHeader>
              <strong>React Alert</strong> <small>Link color</small>
            </CCardHeader>
            <CCardBody>
              <p className="text-medium-emphasis small">
                Use the <code>&lt;CAlertLink&gt;</code> component to immediately give matching colored
                links inside any alert.
              </p>

            </CCardBody>
          </CCard>
        </CCol>
        <CCol xs={12}>
          <CCard className="mb-4">
            <CCardHeader>
              <strong>React Alert</strong> <small>Additional content</small>
            </CCardHeader>
            <CCardBody>
              <p className="text-medium-emphasis small">
                Alert can also incorporate supplementary components &amp; elements like heading,
                paragraph, and divider.
              </p>
              <DocsExample href="components/alert#additional-content">
                <CAlert color="success">
                  <CAlertHeading tag="h4">Well done!</CAlertHeading>
                  <p>
                    Aww yeah, you successfully read this important alert message. This example text is
                    going to run a bit longer so that you can see how spacing within an alert works
                    with this kind of content.
                  </p>
                  <hr />
                  <p className="mb-0">
                    Whenever you need to, be sure to use margin utilities to keep things nice and
                    tidy.
                  </p>
                </CAlert>
              </DocsExample>
            </CCardBody>
          </CCard>
        </CCol>
        <CCol xs={12}>
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
        </CCol>
      </CRow>





    </>
  )
}

export default MainDashboard