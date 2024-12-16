import React, { useEffect, useState } from 'react'
import LifestylesOrderView from './Categories/LifestylesOrderView'
import Modal from 'react-bootstrap/Modal';
import { getLifestylesDataSet, getMoreDataSet } from './functions/getCheckoutProductData';
import EssentialsOrderView from './Categories/EssentialsOrderView';
import EducationOrderView from './Categories/EducationOrderView';
import PleaseWaitLoader from 'src/Panels/PleaseWaitLoader/PleaseWaitLoader';
import { Tab, Tabs } from 'react-bootstrap';

import $ from 'jquery';
import HotelsOrderView from './Categories/HotelsOrderView';

export default function MoreOrderView(props) {


    // console.log(props, "Props in More Order View")
    var category = props.category

    var orderData = []

    const [productDataSet, setProductDataSet] = useState([])

    // console.log(props.preID, "Pre ID 123")
    // console.log(props.category, "Category 123")

    const [loading, setLoading] = useState(false)

    // console.log("Modal is loading in background 123333",props.preID)

    useEffect(() => {
        if (props?.notificationView) {

            setProductDataSet(props?.notificationViewData)
            // console.log(props?.notificationViewData, "Notification View Data set isi")

        }
        else {


            if (props?.category == 4) {
                setProductDataSet([])
                setProductDataSet(props.hotelsOrderView)
            }
            else {


                console.log(props?.preID,"Props value data issss")
                setLoading(true)
                getMoreDataSet(category, props.preID).then(response => {
                    setProductDataSet(response)
                    setLoading(false)

                }).catch(response => {
                    // console.log(response, "Catch Response is")
                    setLoading(false)
                })
            }



        }


    }, [props.preID, props?.notificationViewData,props.hotelsOrderView])


    useEffect(() => {
        // $('div.modal').modal();

        // $('div.modal').on('shown.bs.modal', function () {
        //     $(document).off('focusin.modal');
        // });
    }, [])


    



    return (

        <Modal
            {...props}
            size="fullscreen"
            aria-labelledby="contained-modal-title-vcenter"


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

                                        {category == 4 ?
                                            <HotelsOrderView productData={productDataSet}></HotelsOrderView>
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



                                {category == 4 ?
                                    <HotelsOrderView productData={productDataSet}></HotelsOrderView>
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
