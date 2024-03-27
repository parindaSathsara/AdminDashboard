import React, {useState , useEffect} from 'react'
import { CCard, CCardBody, CCol, CCardHeader, CRow } from '@coreui/react'
import axios from 'axios'
import {
  CChartBar,
  CChartDoughnut,
  CChartLine,
  CChartPie,
  CChartPolarArea,
  CChartRadar,
} from '@coreui/react-chartjs'
import { DocsCallout } from 'src/components'
import { error } from 'jquery'
import { createTheme, ThemeProvider } from '@mui/material'
import MaterialTable from 'material-table'

const Charts = () => {
  const random = () => Math.round(Math.random() * 100)

  const defaultMaterialTheme = createTheme();

  const [sales, setSales] = useState({
    lifestyleSale: 0,
    essentialSale: 0,
    non_essentialSale: 0,
    educationSale: 0,
    hotelSale: 0,
  })
  const [productCounts, setProductCounts] = useState({
    lifestyle: 0,
    essential: 0,
    non_essential: 0,
    education: 0,
    hotel: 0,
  });

  const [monthlyProducts, setMonthlyProducts] = useState({
    lifestyleProduct: 0,
    essntialproduct: 0,
    nonEssentialProduct: 0,
    educationProduct: 0,
    hotelProduct: 0
  })
  const [salesTable, setSalesTable ] = useState([]);

  const getSalesTable = async() => {
    try{
      const response = await axios.get('get_sales_table');
      console.log(response, 'salesTable');
      if(response.data.status === 200){
        setSalesTable(response.data.categories);
      }
    }catch (error) {
      console.log(error);
    } 
  }

  const getSalesChart = async() => {
      try{
        const response = await axios.get('get_all_sales_total');
        console.log(response);
        if(response.data.status === 200){
          setSales(response.data.sales);
        }
      }catch (error) {
        console.log(error);
      }
  }

  const getProductCount = async () => {
    try {
        const response = await axios.get('get_all_category_products');
        if (response.data.status === 200) {
            setProductCounts(response.data.productCounts);
        }
    } catch (error) {
        console.error('Error fetching product counts:', error);
    }
  };

  const getProductsMonthly = async () => {
    try{
      const response = await axios.get('get_products_with_time');
      if(response.data.status === 200){


        console.log(response.data,"Response data value is")
        setMonthlyProducts(response.data.productCountMonthly);
      }
    }catch(error){
      console.log(error);
    }
  };
 
  useEffect(() => {
    getSalesChart()
    getProductCount()
    getProductsMonthly()
    getSalesTable()
  }, [])

  const data = {
    columns: [
        {
          title: 'Order ID', field: 'order_id', align: 'left', editable: 'never'
        },
        {
            title: 'Category', field: 'category', align: 'left', editable: 'never',
        },
        {
            title: 'Total Amount', field: 'total_amount', align: 'left', editable: 'never',
        },
        {
            title: 'Checkout Date', field: 'checkout_date', align: 'left', editable: 'never',
        },

    ],
    rows: salesTable?.map((value, idx) => {
      let $category = '';
      if (value.main_category_id === 1) {
        $category = 'Essential';
      } else if (value.main_category_id === 2) {
        $category = 'Non Essential';
      } else if (value.main_category_id === 3) {
        $category = 'Lifestyle';
      }else if (value.main_category_id === 4){
        $category = 'Hotels';
      }else if (value.main_category_id === 5){
        $category = 'Education';
      }else {
        $category = 'Flight';
      }
      console.log(value, 'productsCountttttttt');
      return {
          order_id: value.id,
          category: $category,
          total_amount: value.total_price,
          checkout_date: value.checkout_date,
          // total_amount: value.payment_type,
          // checkout_date: value.pay_category,
      }
  })
}

  return (
    <CRow>
      <CCol xs={6}>
        <CCard className="mb-4">
          <CCardHeader>Product Category Chart</CCardHeader>
          <CCardBody>
            <CChartBar
              data={{
                labels: ['Lifestyle', 'Essential', 'Non Essential', 'Hotel', 'Education'],
                datasets: [
                  {
                    label: 'Product count',
                    backgroundColor: '#2471A3',
                    data: [
                      productCounts.lifestyle,
                      productCounts.essential,
                      productCounts.non_essential,
                      productCounts.hotel,
                      productCounts.education,
                  ],
                  },
                ],
              }}
              labels="categories"
            />
          </CCardBody>
        </CCard>
      </CCol>
      <CCol xs={6}>
        <CCard className="mb-4">
          <CCardHeader>Annual Product Variation Chart</CCardHeader>
          <CCardBody>

          {console.log(monthlyProducts.hotels,"LS PRODUCTS")}
            <CChartLine 
              data={{
                labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Set', 'Oct', 'Nov', 'Dec'],
                datasets: [
                  {
                    label: 'Lifestyle',
                    backgroundColor: '#A2D9CE',
                    borderColor: '#A3E4D7',
                    pointBackgroundColor: '#A2D9CE',
                    pointBorderColor: '#fff',
                    data: monthlyProducts.lifestyles
                  },
                  {
                    label: 'Essential',
                    backgroundColor: '#AED6F1',
                    borderColor: '#85C1E9',
                    pointBackgroundColor: '#AED6F1',
                    pointBorderColor: '#fff',
                    data: monthlyProducts.essentials
                  },
                  {
                    label: 'Non Essential',
                    backgroundColor: '#D2B4DE',
                    borderColor: '#BB8FCE',
                    pointBackgroundColor: '#D2B4DE',
                    pointBorderColor: '#fff',
                    data: monthlyProducts.nonEssentials
                  },
                  {
                    label: 'Education',
                    backgroundColor: '#EDBB99',
                    borderColor: '#E59866',
                    pointBackgroundColor: '#EDBB99',
                    pointBorderColor: '#fff',
                    data: monthlyProducts.education
                  },
                  {
                    label: 'Hotel',
                    backgroundColor: '#F1948A',
                    borderColor: '#D98880',
                    pointBackgroundColor: '#F1948A',
                    pointBorderColor: '#fff',
                    data: monthlyProducts.hotels
                  },
                ],
              }}
            />
          </CCardBody>
        </CCard>
      </CCol>
      {/* <CCol xs={6}>
        <CCard className="mb-4">
          <CCardHeader>Doughnut Chart</CCardHeader>
          <CCardBody>
            <CChartDoughnut
              data={{
                labels: ['VueJs', 'EmberJs', 'ReactJs', 'AngularJs'],
                datasets: [
                  {
                    backgroundColor: ['#41B883', '#E46651', '#00D8FF', '#DD1B16'],
                    data: [40, 20, 80, 10],
                  },
                ],
              }}
            />
          </CCardBody>
        </CCard>
      </CCol> */}
      <CCol xs={6}>
        <CCard className="mb-4">
          <CCardHeader>Sales Total Chart - USD</CCardHeader>
          <CCardBody>
            <CChartPie
              data={{
                labels: ['Essential', 'Non Essential', 'Lifestyle', 'Education', 'Hotel'],
                datasets: [
                  {
                    data: [
                      sales.essentialSale,
                      sales.non_essentialSale,
                      sales.lifestyleSale,
                      sales.educationSale,
                      sales.hotelSale,
                  ],
                    backgroundColor: ['#FF6384', '#36A2EB', '#FFCE56', '#D68910', '#B7950B'],
                    hoverBackgroundColor: ['#FF6384', '#36A2EB', '#FFCE56', '#D68910', '#B7950B'],
                  },
                ],
              }}
            />
          </CCardBody>
        </CCard>
      </CCol>
      <CCol xs={6}>
        {(console.log(productCounts.categories, ''))}
          <CCard className='mb-4'>
            <CCardHeader>Sales Table With Categories</CCardHeader>
            <CCardBody>
            <ThemeProvider theme={defaultMaterialTheme}>
              <MaterialTable title="" 
                  data={data.rows}
                  columns={data.columns}
                  options={{
                            sorting: true, search: true,
                            searchFieldAlignment: "right", searchAutoFocus: true, searchFieldVariant: "standard",
                            filtering: false, paging: true, pageSizeOptions: [20, 25, 50, 100], pageSize: 10,
                            paginationType: "stepped", showFirstLastPageButtons: false, paginationPosition: "both", exportButton: true,
                            exportAllData: true, exportFileName: "TableData", addRowPosition: "first", actionsColumnIndex: -1, selection: false,
                            showSelectAllCheckbox: false, showTextRowsSelected: false,
                            grouping: true, columnsButton: true,
                            headerStyle: { background: '#001b3f', color: "#fff", padding: "15px", fontSize: "17px", fontWeight: '500' },
                            rowStyle: { fontSize: "15px", width: "100%", color: "#000" },
                            }}
                />
            </ThemeProvider>

            </CCardBody>
          </CCard>      
      </CCol>
    </CRow>
  )
}

export default Charts
