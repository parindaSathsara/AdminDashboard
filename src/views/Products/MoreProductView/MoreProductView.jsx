import React, { useEffect, useState } from 'react'

import Modal from 'react-bootstrap/Modal';

import PleaseWaitLoader from 'src/Panels/PleaseWaitLoader/PleaseWaitLoader';
// import LifestylesProductView from './Categories/LifestylesOrderView';
// import EssentialsProductView from './Categories/EssentialsOrderView';
// import EducationProductView from './Categories/EducationOrderView';
import { getProductData } from './functions/getProductData';
import LifestylesProductView from './Categories/LifestylesProductView';
import EssentialsProductView from './Categories/EssentialsProductView';
import EducationProductView from './Categories/EducationProductView';
import HotelProductView from './Categories/HotelProductView';

export default function MoreProductView(props) {


    console.log(props, "Props Value is")
    var category = props.productData.category
    var productData = props.productData


    // console.log(productData, "Product Data is")

    const [productDataSet, setProductDataSet] = useState([])

    // console.log(props.preID, "Pre ID 123")
    // console.log(props.category, "Category 123")

    const [loading, setLoading] = useState(false)


    useEffect(() => {

        setLoading(true)
        getProductData(productData).then(response => {
            setProductDataSet(response)
            setLoading(false)

            // console.log(response, "Data Response Value is111")
        }).catch(response => {
            // console.log(response, "Catch Response is")
            setLoading(false)
        })

    }, [props.productData])





    return (

        <Modal
            {...props}
            size="fullscreen"
            aria-labelledby="contained-modal-title-vcenter"
            centered
            style={{ zIndex: 1300 }}
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

                        {category == "Lifestyles" ?
                            <LifestylesProductView productData={productDataSet}></LifestylesProductView>
                            :
                            null
                        }



                        {category == "Essentials" ?
                            <EssentialsProductView productData={productDataSet}></EssentialsProductView>
                            :
                            null
                        }

                        {category == "Educations" ?
                            <EducationProductView productData={productDataSet}></EducationProductView>
                            :
                            null
                        }
                        {category == "Hotels" ?
                            <HotelProductView productData={productDataSet}></HotelProductView>
                            :
                            null
                        }



                    </>

                }



            </Modal.Body>

        </Modal>


    )
}
