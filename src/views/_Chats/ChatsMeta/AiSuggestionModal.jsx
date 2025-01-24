import { CButton, CTable, CTableBody, CTableDataCell, CTableHead, CTableHeaderCell, CTableRow } from '@coreui/react'
import { useState } from 'react'
import { Tab, Tabs } from 'react-bootstrap'
import Modal from 'react-bootstrap/Modal'

function AiSuggestionModal(props) {
  const [key, setKey] = useState('home')
  return (
    <Modal {...props} size="lg" aria-labelledby="contained-modal-title-vcenter" centered>
      <Modal.Header closeButton>
        <Modal.Title id="contained-modal-title-vcenter">Recommended Offerings</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <b>Key Words:</b> {props.recommendations.keywords?.map((keyword) => keyword + ', ')}
        <hr />
        <Tabs
          id="controlled-tab-example"
          activeKey={key}
          onSelect={(k) => setKey(k)}
          className="mb-3"
        >
          <Tab eventKey="home" title="Home">
            <CTable>
              <CTableHead>
                <CTableRow>
                  <CTableHeaderCell scope="col">#</CTableHeaderCell>
                  <CTableHeaderCell scope="col">Class</CTableHeaderCell>
                  <CTableHeaderCell scope="col">Heading</CTableHeaderCell>
                  <CTableHeaderCell scope="col">Heading</CTableHeaderCell>
                </CTableRow>
              </CTableHead>
              <CTableBody>
                <CTableRow>
                  <CTableHeaderCell scope="row">1</CTableHeaderCell>
                  <CTableDataCell>Mark</CTableDataCell>
                  <CTableDataCell>Otto</CTableDataCell>
                  <CTableDataCell>@mdo</CTableDataCell>
                </CTableRow>
                <CTableRow>
                  <CTableHeaderCell scope="row">2</CTableHeaderCell>
                  <CTableDataCell>Jacob</CTableDataCell>
                  <CTableDataCell>Thornton</CTableDataCell>
                  <CTableDataCell>@fat</CTableDataCell>
                </CTableRow>
                <CTableRow>
                  <CTableHeaderCell scope="row">3</CTableHeaderCell>
                  <CTableDataCell colSpan={2}>Larry the Bird</CTableDataCell>
                  <CTableDataCell>@twitter</CTableDataCell>
                </CTableRow>
              </CTableBody>
            </CTable>
          </Tab>
          <Tab eventKey="hame" title="Hame">
            Tab content for Home
          </Tab>
        </Tabs>
        {/* Stringify result */}
        <b>Result:</b> {JSON.stringify(props.recommendations)}
      </Modal.Body>
      <Modal.Footer>
        <CButton color="primary" onClick={props.onHide}>
          Close
        </CButton>
      </Modal.Footer>
    </Modal>
  )
}

export default AiSuggestionModal
