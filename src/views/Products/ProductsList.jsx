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

    const data = {
        columns: [
            {
                title: 'Product Image',
                field: 'product_image',
                align: 'left',
                editable: 'never',
                render: rowData => (
                    <div style={{ width: "150px", height: "150px", borderRadius: 20 }}>
                        <CCardImage
                            src={rowData.product_image?.split(",")[0]}
                            style={{ width: "100%", height: "100%", objectFit: "cover" }}
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
        ],
        rows: productList.map(product => ({
            product_title: product.title,
            product_description: product.description,
            product_image: product.image,
            category: toTitleCase(product.category)
        })),
    };
    return (
        <div>
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

            {/* <CRow>
                {currentItems.map((data, dataIndex) => (
                    <CCol xs={6} key={dataIndex}>
                        <CCard className="mb-3" md={12} lg={12} style={{ padding: 10 }}>
                            <CRow className="g-0">
                                <CCol md={2} style={{ height: "150px", display: "flex", alignItems: "center", justifyContent: "center" }}>
                                    <div style={{ width: "100%", height: "100%" }}>
                                        <CCardImage src={data.image?.split(",")[0]} style={{ width: "100%", height: "100%", objectFit: "cover" }} />
                                    </div>
                                </CCol>
                                <CCol md={9}>
                                    <CCardBody>
                                        <CCardTitle>{data.title}</CCardTitle>
                                        <CCardText style={{ overflow: "hidden", textOverflow: "ellipsis", display: "-webkit-box", WebkitLineClamp: 3, WebkitBoxOrient: "vertical" }}>
                                            {data.description}
                                        </CCardText>
                                    </CCardBody>
                                </CCol>
                            </CRow>
                        </CCard>
                    </CCol>
                ))}
            </CRow>
            <Pagination
                activePage={activePage}
                itemsCountPerPage={itemsPerPage}
                totalItemsCount={productList.length}
                pageRangeDisplayed={5}
                onChange={handlePageChange}
                itemClass="page-item"
                linkClass="page-link"
            /> */}
        </div>
    );
}


export default ProductList;