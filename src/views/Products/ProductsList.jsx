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
import { io } from 'socket.io-client'

import productSound from '../../assets/productSound.mp3'
import LoaderPanel from 'src/Panels/LoaderPanel'


function ProductList() {

    const [productList, setProductList] = useState([])

    // const socket = io('http://172.16.26.244:5000');
    // const socket = io('https://socket.aa');

    useEffect(() => {
        // socket.on('initial', initialDataHandler);

        // socket.on('change', changedRowHandler);

        // return () => {
        //     socket.disconnect();
        // };

        initialDataHandler()
    }, []);

    const [newlyAddedColumns, setNewlyAddedColumns] = useState([]);
    const [loading, setLoading] = useState(false)

    const initialDataHandler = (initialData) => {

        setLoading(true)
        getAllProducts().then((data) => {
            setProductList(data);
            setLoading(false)
        });


    };

    const changedRowHandler = (changedRow) => {
        getAllProducts().then((data) => {
            setProductList(data);
            const newlyAddedColumn = changedRow?.lastId;
            if (newlyAddedColumn) {
                setNewlyAddedColumns([...newlyAddedColumns, newlyAddedColumn]);
                // After 5 seconds, remove the newly added column from the list
                setTimeout(() => {
                    setNewlyAddedColumns([]);
                }, 5000);
            }
        });
    };








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
        // console.log(data)

        setMoreProductModal(true)
        setMoreData(data)
    }

    function stripHtmlTags(html) {
        const tempDiv = document.createElement("div");
        tempDiv.innerHTML = html;
        return tempDiv.textContent || tempDiv.innerText || "";
    }

    const data = {
        columns: [
            {
                title: 'Info',
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
                            src={rowData.product_image?.split(",")[0]?.includes("http") ? rowData.product_image?.split(",")[0] : "https://supplier.aahaas.com/" + rowData.product_image?.split(",")[0]}
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
            product_description: stripHtmlTags(product.description),
            product_image: product.image,
            category: toTitleCase(product.category),
            created_date: moment(product.dateCreated).format("YYYY-MM-DD"),
            product_id: product?.product_id
        })),
    }



    const [moreData, setMoreData] = useState([])
    const [moreProductsModal, setMoreProductModal] = useState(false)
    const rowStyle = (rowData) => {
        const isRowNewlyAdded = newlyAddedColumns.length > 0 && newlyAddedColumns.includes(rowData.product_id);



        return {
            fontSize: "16px",
            width: "100%",
            color: "#000",
            fontWeight: isRowNewlyAdded ? 'normal' : 'normal',
            backgroundColor: isRowNewlyAdded ? '#E6F9EF' : 'white', // You can adjust the background color here
        };
    };

    const [audio] = useState(new Audio(productSound));

    useEffect(() => {

        // if (newlyAddedColumns.length > 0) {
        //     audio.play();
        // } else {
        //     audio.pause();
        //     audio.currentTime = 0;
        // }

    }, [newlyAddedColumns]);

    // newlyAddedColumns.push("asd")

    if (loading == true) {
        return (
            <LoaderPanel message={"Loading Products"} />
        )
    }
    else {
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
                        paginationType: "stepped", showFirstLastPageButtons: false, paginationPosition: "both",
                        exportAllData: true, exportFileName: "TableData", addRowPosition: "first", actionsColumnIndex: -1, selection: false,
                        showSelectAllCheckbox: false, showTextRowsSelected: false,
                        grouping: true, columnsButton: true,
                        headerStyle: { background: '#626f75', color: "#fff", padding: "15px", fontSize: "17px", fontWeight: '500' },
                        rowStyle: rowStyle,

                        // fixedColumns: {
                        //     left: 6
                        // }
                    }}
                // components={{
                //     // Component overrides
                //     Row: (props) => {
                //         const isRowNewlyAdded = newlyAddedColumns.length > 0 && newlyAddedColumns.includes(props.data.id);
                //         return <MaterialTable.Row {...props} className={isRowNewlyAdded ? 'newly-added-row' : ''} />;
                //     },
                // }}

                />

            </div>
        );
    }

}


export default ProductList;