import { CButton, CSpinner,CTooltip } from '@coreui/react'
import { useState, useEffect } from 'react'
import { Tab, Tabs } from 'react-bootstrap'
import { ThemeProvider, createTheme } from '@mui/material'
import Modal from 'react-bootstrap/Modal'
import MaterialTable from 'material-table'
import { cilFullscreen, cilFullscreenExit } from '@coreui/icons'
import CIcon from '@coreui/icons-react'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { Tooltip } from '@material-ui/core'

function AiSuggestionModal(props) {
  const { setRecommendations, getRecommendations } = props
  const [key, setKey] = useState('LifeStyle')
  const [data, setData] = useState([])
  const [otherData, setOtherData] = useState([])
  const [hotelData, setHotelData] = useState([])
  const [educationData, setEducationData] = useState([])
  const [isFullscreen, setIsFullscreen] = useState(false) // State for fullscreen mode

  //while onhide the modal, the data should be cleared
  useEffect(() => {
    if (!props.show) {
      setData([])
      setRecommendations({}) // Clear recommendations
    }
  }, [props.show])

  const defaultMaterialTheme = createTheme()

  // Use useEffect to handle props updates
  useEffect(() => {
    // console.log('props.recommendations', props)
    if (props.recommendations && props.recommendations.life_style_products) {
      setData(props.recommendations.life_style_products)
    }
    if (props.recommendations && props.recommendations.hotels) {
      setHotelData(props.recommendations.hotels) 
    }
    if (props.recommendations && props.recommendations.education_products) {
      setEducationData(props.recommendations.education_products) 
    }
  }, [props.recommendations])

  useEffect(() => {
    if (props.recommendations && props.recommendations.other_products) {
      setOtherData(props.recommendations.other_products)
    }
  }, [props.recommendations])

  return (
    <Modal
      {...props}
      size="xl"
      aria-labelledby="contained-modal-title-vcenter"
      centered
      fullscreen={isFullscreen}
    >
      <Modal.Header closeButton>
        {/* <CButton
          color="secondary"
          style={{ backgroundColor: '#ffffff', color: '#666666', marginRight: '10px' }}
          onClick={() => setIsFullscreen(!isFullscreen)}
        >
          <div>
            {isFullscreen ? (
             <i class="fa fa-window-minimize" aria-hidden="true"></i>
            ) : (
              <i class="fa fa-window-maximize" aria-hidden="true"></i>
            )}
          </div>
        </CButton> */}
        <Modal.Title id="contained-modal-title-vcenter">Recommended Offerings</Modal.Title>
        <CTooltip  
                    content={'Refresh Recommendations'}
                    placement="auto">
        <CButton
          style={{ marginLeft: '10px', backgroundColor: '#041d24' }}
          onClick={() => getRecommendations()}
        >
          <i class="fa fa-refresh" aria-hidden="true"></i>
        </CButton>
        </CTooltip>
      </Modal.Header>
      <Modal.Body>
        {props.loadingRecommendations ? (
          <div style={{ textAlign: 'center', minHeight: '5rem' }}>
            <i class="fa fa-spinner fa-pulse fa-3x fa-fw text-blue"></i>
            <br />
            <h3>Analyzing Chat And Getting Recommendations....</h3>
          </div>
        ) : (
          <>
           <b>Key Words:</b> {props.recommendations.keywords?.join(', ')}
           <hr />
          { (data?.length === 0) ? (
    <div className="text-center py-5" style={{ backgroundColor: '#f8f9fa', borderRadius: '8px' }}>
      <h5>Chat history is not enough to analyze and get recommendations</h5>
      <p className="text-muted">Please continue chatting to generate more recommendations</p>
    </div>
  ) 
           : 
          (
            <Tabs
              id="controlled-tab-example"
              activeKey={key}
              onSelect={(k) => setKey(k)}
              className="mb-3"
            >
              <Tab eventKey="LifeStyle" title="LifeStyle">
                {/* Material Table for life_style_products */}
                <ThemeProvider theme={defaultMaterialTheme}>
                  <MaterialTable
                    style={{ fontSize: '8px' }}
                    title="LifeStyle Products"
                    data={data}
                    columns={[
                      {
                        title: ' ',
                        field: 'image',
                        render: (rowData) => (
                          <img
                            src={rowData.image}
                            alt={rowData.lifestyle_name}
                            style={{ width: 100, height: 100, objectFit: 'cover', borderRadius: 8 }}
                          />
                        ),
                      },
                      { title: 'Product Name', field: 'lifestyle_name' },
                      { title: 'Address', field: 'address' },
                      { 
                        title: 'Description', 
                        field: 'sub_description', 
                        // render: rowData => rowData?.sub_description?.substring(0, 100)+'...'
                        render: rowData => rowData?.sub_description 
    ? rowData.sub_description.substring(0, 100) + '...' 
    : 'No description'
                      },
                      { title: 'Key Words', field: 'selling_points' },
                    ]}
                    options={{
                      headerStyle: {
                        backgroundColor: '#01579b',
                        color: '#FFF',
                      },
                      cellStyle: { fontSize: '13px' },
                      sorting: true,
                      search: true,
                    }}
                  />
                </ThemeProvider>
              </Tab>
              <Tab eventKey="Everyday" title="Everyday">
                <ThemeProvider theme={defaultMaterialTheme}>
                  <MaterialTable
                    style={{ fontSize: '8px' }}
                    title="Essential / Non-Essential Products"
                    data={otherData}
                    columns={[
                      {
                        title: ' ',
                        field: 'image',
                        render: (rowData) => (
                          <img
                            src={rowData.product_images.split(',')[0]}
                            alt={rowData.lifestyle_name}
                            style={{ width: 100, height: 100, objectFit: 'cover', borderRadius: 8 }}
                          />
                        ),
                      },
                      { title: 'Product Name', field: 'listing_title' },
                      { title: 'Brand', field: 'brand_id' },
                      { 
                        title: 'Description', 
                        field: 'sub_description', 
                        render: rowData => rowData.sub_description.substring(0, 100)+'...'
                      },
                      { title: 'Key Words', field: 'seo_tags' },
                      { title: 'Country', field: 'country' },
                    ]}
                    options={{
                      headerStyle: {
                        backgroundColor: '#01579b',
                        color: '#FFF',
                      },
                      cellStyle: { fontSize: '13px' },
                      sorting: true,
                      search: true,
                    }}
                  />
                </ThemeProvider>
              </Tab>
              <Tab eventKey="Education" title="Education">
                <ThemeProvider theme={defaultMaterialTheme}>
                  <MaterialTable
                    style={{ fontSize: '8px' }}
                    title="Education Products"
                    data={educationData}
                    columns={[
                      {
                        title: ' ',
                        field: 'image',
                        render: (rowData) => (
                          <img
                            src={rowData.image_path}
                            alt={rowData.course_name}
                            style={{ width: 100, height: 100, objectFit: 'cover', borderRadius: 8 }}
                          />
                        ),
                      },
                      { title: 'Product Name', field: 'course_name' },
                      { 
                        title: 'Description', 
                        field: 'sub_description', 
                        render: rowData => rowData.sub_description.substring(0, 100)+'...'
                      },
                      // { title: 'Key Words', field: 'seo_tags' },
                      { title: 'Group Type', field: 'group_type' },
                    ]}
                    options={{
                      headerStyle: {
                        backgroundColor: '#01579b',
                        color: '#FFF',
                      },
                      cellStyle: { fontSize: '13px' },
                      sorting: true,
                      search: true,
                    }}
                  />
                </ThemeProvider>
              </Tab>
              <Tab eventKey="Hotel" title="Hotel">
                <ThemeProvider theme={defaultMaterialTheme}>
                  <MaterialTable
                    style={{ fontSize: '8px' }}
                    title="Hotels Products"
                    data={hotelData}
                    columns={[
                      {
                        title: ' ',
                        field: 'image',
                        render: (rowData) => (
                          <img
                            src={rowData.hotel_image}
                            alt={rowData.hotel_name}
                            style={{ width: 100, height: 100, objectFit: 'cover', borderRadius: 8 }}
                          />
                        ),
                      },
                      { title: 'Product Name', field: 'hotel_name' },
                      { 
                        title: 'Description', 
                        field: 'sub_description', 
                        render: rowData => rowData.sub_description.substring(0, 100)+'...'
                      },
                      { title: 'City', field: 'city' },
                      { title: 'Country', field: 'country' },
                    ]}
                    options={{
                      headerStyle: {
                        backgroundColor: '#01579b',
                        color: '#FFF',
                      },
                      cellStyle: { fontSize: '13px' },
                      sorting: true,
                      search: true,
                    }}
                  />
                </ThemeProvider>
              </Tab>
            </Tabs>)
           }
          </>
        )}
      </Modal.Body>
      <Modal.Footer>
        {/* <CButton style={{backgroundColor:"#041d24"}} onClick={props.onHide}>
          Close
        </CButton> */}
      </Modal.Footer>
    </Modal>
  )
}

export default AiSuggestionModal
