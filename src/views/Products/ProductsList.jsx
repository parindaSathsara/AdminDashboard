import React, { useEffect, useState } from 'react'
import {
    CButton,
    CCard,
    CCardBody,
    CCardFooter,
    CCardGroup,
    CCardHeader,
    CCardImage,
    CCardLink,
    CCardSubtitle,
    CCardText,
    CCardTitle,
    CListGroup,
    CListGroupItem,
    CNav,
    CNavItem,
    CNavLink,
    CCol,
    CRow,
} from '@coreui/react'
import { DocsExample } from 'src/components'

import ReactImg from 'src/assets/images/react.jpg'
import { getAllProducts } from 'src/service/api_calls'
import Pagination from "react-js-pagination";
import MaterialTable from 'material-table'
import moment from 'moment'
import CIcon from '@coreui/icons-react'
import { cilInfo } from '@coreui/icons'
import MoreProductView from './MoreProductView/MoreProductView'


function ProductList() {

    const [productList, setProductList] = useState([])

    useEffect(() => {
        getAllProducts().then(data => {
            setProductList(data)
            console.log(data, "Dataset product list")
        })
    }, [])



    const [activePage, setActivePage] = useState(1);
    const itemsPerPage = 20; // Number of items to display per page

    // Calculate index range for current page
    const indexOfLastItem = activePage * itemsPerPage;
    const indexOfFirstItem = indexOfLastItem - itemsPerPage;
    const currentItems = productList.slice(indexOfFirstItem, indexOfLastItem);

    const handlePageChange = (pageNumber) => {
        setActivePage(pageNumber);
    };

    function toTitleCase(str) {
        return str.toLowerCase().replace(/\b\w/g, c => c.toUpperCase());
    }

    const handleOnClick = (data) => {
        console.log(data)

        setMoreProductModal(true)
        setMoreData(data)
    }

    const data = {
        columns: [
            {
                field: 'view', align: 'left', editable: 'never', filtering: false, render: (e) => {
                    return (
                        <>
                            <CButton style={{ backgroundColor: 'transparent', padding: 0, borderWidth: 0 }} onClick={() => handleOnClick(e)}>
                                <CIcon icon={cilInfo} className="text-info" size="xl" />
                            </CButton>
                        </>
                    );
                }
            },

            {
                title: 'Product Image',
                field: 'product_image',
                align: 'left',
                editable: 'never',
                render: rowData => (
                    <div style={{ width: "120px", height: "120px", borderRadius: 20 }}>
                        <CCardImage
                            src={rowData.product_image?.split(",")[0]}
                            style={{ width: "100%", height: "100%", objectFit: "cover", borderRadius: 20 }}
                        />
                    </div>
                ),
                filtering: false
            },
            {
                title: 'Product Title',
                field: 'product_title',
                align: 'left',
                editable: 'never',
            },
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
                        WebkitLineClamp: 3, // Limit to 3 lines

                    }}>
                        {rowData.product_description}
                    </div>
                ),
            },
            {
                title: 'Category',
                field: 'category',
                align: 'left',
                editable: 'never',
                lookup: { "Essentials": 'Essentials', "Lifestyles": 'Lifestyles', "Hotels": 'Hotels', "Educations": 'Educations' },
            },
            {
                title: 'Created Date',
                field: 'created_date',
                align: 'left',
                editable: 'never',
            }
        ],
        rows: productList.map(product => ({
            product_title: product.title,
            product_description: product.description,
            product_image: product.image,
            category: toTitleCase(product.category),
            created_date: moment(product.dateCreated).format("YYYY-MM-DD"),
            product_id: product?.product_id
        })),
    }


    const [moreData, setMoreData] = useState([])
    const [moreProductsModal, setMoreProductModal] = useState(false)



    return (
        <div>

            {/* <MoreOrderView
                show={moreOrderModal}
                onHide={() => setMoreOrderModal(false)}
                preID={moreOrderDetails}
                category={moreOrderModalCategory}
            >
            </MoreOrderView> */}


            <MoreProductView
                show={moreProductsModal}
                onHide={() => setMoreProductModal(false)}

                productData={moreData}
            >

            </MoreProductView>


            <MaterialTable
                title="Products List"
                // tableRef={tableRef}
                data={data.rows}
                columns={data.columns}



                options={{

                    sorting: true, search: true,
                    searchFieldAlignment: "right", searchAutoFocus: true, searchFieldVariant: "standard",
                    filtering: true, paging: true, pageSizeOptions: [20, 25, 50, 100], pageSize: 20,
                    paginationType: "stepped", showFirstLastPageButtons: false, paginationPosition: "both", exportButton: true,
                    exportAllData: true, exportFileName: "TableData", addRowPosition: "first", actionsColumnIndex: -1, selection: false,
                    showSelectAllCheckbox: false, showTextRowsSelected: false,
                    grouping: true, columnsButton: true,
                    headerStyle: { background: '#001b3f', color: "#fff", padding: "15px", fontSize: "17px", fontWeight: '500' },
                    rowStyle: { fontSize: "16px", width: "100%", color: "#000", fontWeight: '500' },

                    // fixedColumns: {
                    //     left: 6
                    // }
                }}

            />


        </div>
    );
}


export default ProductList;