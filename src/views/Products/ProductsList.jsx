import React, { useEffect, useState, useRef, useMemo } from 'react'
import {
  CButton,
  CCardImage,
} from '@coreui/react'
import { getAllProducts } from 'src/service/api_calls'
import MaterialTable from 'material-table'
import moment from 'moment'
import CIcon from '@coreui/icons-react'
import { cilInfo } from '@coreui/icons'
import MoreProductView from './MoreProductView/MoreProductView'
import LoaderPanel from 'src/Panels/LoaderPanel'
import productSound from '../../assets/productSound.mp3'

// ✅ helper
function toTitleCase(str) {
  return str.toLowerCase().replace(/\b\w/g, c => c.toUpperCase());
}

function stripHtmlTags(html) {
  const tempDiv = document.createElement("div");
  tempDiv.innerHTML = html;
  return tempDiv.textContent || tempDiv.innerText || "";
}

function ProductList() {
  const [productList, setProductList] = useState([])
  const [loading, setLoading] = useState(false)
  const [moreData, setMoreData] = useState([])
  const [moreProductsModal, setMoreProductModal] = useState(false)
  const tableRef = useRef()

  // 🔄 fetch products
  const fetchProducts = () => {
    setLoading(true)
    getAllProducts().then((data) => {
      setProductList(data)
      setLoading(false)
    })
  }

  useEffect(() => {
    fetchProducts()
  }, [])

  // ✅ lookup for created_date filtering
  const createdDateLookup = useMemo(() => {
    const lookup = {}
    ;[...new Set(productList.map(p => moment(p.dateCreated).format("YYYY-MM-DD")))]
      .forEach(date => { lookup[date] = date })
    return lookup
  }, [productList])

  // ✅ columns (static – no recreation)
  const columns = useMemo(() => [
    {
      title: 'Info',
      field: 'view',
      align: 'left',
      editable: 'never',
      filtering: false,
      render: (e) => (
        <CButton
          style={{ backgroundColor: 'transparent', padding: 0, borderWidth: 0 }}
          onClick={() => {
            setMoreProductModal(true)
            setMoreData(e)
          }}
        >
          <CIcon icon={cilInfo} className="text-info" size="xl" />
        </CButton>
      )
    },
    {
      title: 'Product Image',
      field: 'product_image',
      align: 'left',
      editable: 'never',
      render: rowData => (
        <div style={{ width: "120px", height: "120px", borderRadius: 20 }}>
          <CCardImage
            src={rowData.product_image?.split(",")[0]?.includes("http")
              ? rowData.product_image?.split(",")[0]
              : "https://supplier.aahaas.com/" + rowData.product_image?.split(",")[0]}
            style={{ width: "100%", height: "100%", objectFit: "cover", borderRadius: 20 }}
          />
        </div>
      ),
      filtering: false
    },
    { title: 'Product Title', field: 'product_title', align: 'left', editable: 'never' },
    {
      title: 'Product Description',
      field: 'product_description',
      align: 'left',
      editable: 'never',
      render: rowData => (
        <div style={{
          display: "-webkit-box",
          WebkitBoxOrient: "vertical",
          overflow: "hidden",
          textOverflow: "ellipsis",
          WebkitLineClamp: 3
        }}>
          {rowData.product_description}
        </div>
      )
    },
    {
      title: 'Category',
      field: 'category',
      align: 'left',
      editable: 'never',
      lookup: { "Essentials": 'Essentials', "Lifestyles": 'Lifestyles', "Hotels": 'Hotels', "Educations": 'Educations' }
    },
    {
      title: 'Created Date',
      field: 'created_date',
      align: 'left',
      editable: 'never',
      lookup: createdDateLookup
    }
  ], [createdDateLookup])

  // ✅ rows
  const rows = useMemo(() =>
    productList.map(product => ({
      product_title: product.title,
      product_description: stripHtmlTags(product.description),
      product_image: product.image,
      category: toTitleCase(product.category),
      created_date: moment(product.dateCreated).format("YYYY-MM-DD"),
      product_id: product?.product_id
    })), [productList])

  if (loading) {
    return <LoaderPanel message={"Loading Products"} />
  }

  return (
    <div>
      <MoreProductView
        show={moreProductsModal}
        onHide={() => setMoreProductModal(false)}
        productData={moreData}
      />

      <MaterialTable
        tableRef={tableRef}
        title="Products List"
        data={rows}
        columns={columns}
        options={{
          sorting: true,
          search: true,
          filtering: true,
          paging: true,
          pageSizeOptions: [20, 25, 50, 100],
          pageSize: 20,
          paginationType: "stepped",
          exportAllData: true,
          exportFileName: "TableData",
          actionsColumnIndex: -1,
          selection: false,
          grouping: true,
          columnsButton: true,
          headerStyle: {
            background: '#626f75',
            color: "#fff",
            padding: "15px",
            fontSize: "17px",
            fontWeight: '500'
          },
        }}
      />
    </div>
  )
}

export default ProductList
