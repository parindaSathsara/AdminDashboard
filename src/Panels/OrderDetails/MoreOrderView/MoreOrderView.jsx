import React, { useEffect, useState } from 'react'
import LifestylesOrderView from './Categories/LifestylesOrderView'
import Modal from 'react-bootstrap/Modal';
import { getLifestylesDataSet, getMoreDataSet } from './functions/getCheckoutProductData';
import EssentialsOrderView from './Categories/EssentialsOrderView';
import EducationOrderView from './Categories/EducationOrderView';
import PleaseWaitLoader from 'src/Panels/PleaseWaitLoader/PleaseWaitLoader';
import { Tab, Tabs } from 'react-bootstrap';

export default function MoreOrderView(props) {


    // console.log(props.dataSet)
    var category = props.category

    var orderData = []

    const [productDataSet, setProductDataSet] = useState([])

    // console.log(props.preID, "Pre ID 123")
    // console.log(props.category, "Category 123")

    const [loading, setLoading] = useState(false)


    useEffect(() => {


        if (props?.notificationView) {

            setProductDataSet(props?.notificationViewData)
            console.log(props?.notificationViewData, "Notification View Data set isi")

        }
        else {
            setLoading(true)
            getMoreDataSet(category, props.preID).then(response => {
                setProductDataSet(response)
                setLoading(false)

            }).catch(response => {
                console.log(response, "Catch Response is")
                setLoading(false)
            })


        }


    }, [props.preID, props?.notificationViewData])





    return (

        <Modal
            {...props}
            size="fullscreen"
            aria-labelledby="contained-modal-title-vcenter"
            centered
        >

            <Modal.Header closeButton>
                <Modal.Title id="contained-modal-title-vcenter">
                    Product Details
                </Modal.Title>
            </Modal.Header>

            <Modal.Body>


                {loading == true ?
                    <PleaseWaitLoader></PleaseWaitLoader>
                    :

                    <>

                        {props.productViewData ?
                            <Tabs
                                defaultActiveKey="orderdetails"
                                id="uncontrolled-tab-example"
                                className="mt-4"
                            >

                                <Tab eventKey="basicdetails" title="Basic Info">
                                    <>
                                        {category == 3 ?
                                            <LifestylesOrderView productData={productDataSet}></LifestylesOrderView>

                                            :
                                            null
                                        }
                                        {category == 1 ?
                                            <EssentialsOrderView productData={productDataSet}></EssentialsOrderView>

                                            :
                                            null
                                        }
                                        {category == 5 ?
                                            <EducationOrderView productData={productDataSet}></EducationOrderView>

                                            :
                                            null
                                        }

                                    </>
                                </Tab>

                                <Tab eventKey="orderdetails" title="Order Info">
                                    {props?.productViewComponent}
                                </Tab>


                            </Tabs>
                            :
                            <>
                                {category == 3 ?
                                    <LifestylesOrderView productData={productDataSet}></LifestylesOrderView>

                                    :
                                    null
                                }
                                {category == 1 ?
                                    <EssentialsOrderView productData={productDataSet}></EssentialsOrderView>

                                    :
                                    null
                                }
                                {category == 5 ?
                                    <EducationOrderView productData={productDataSet}></EducationOrderView>

                                    :
                                    null
                                }

                            </>


                        }

                    </>

                }



            </Modal.Body>

        </Modal>


    )
}
