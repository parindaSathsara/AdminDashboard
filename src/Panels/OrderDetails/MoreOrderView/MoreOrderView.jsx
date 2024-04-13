import React, { useEffect, useState } from 'react'
import LifestylesOrderView from './Categories/LifestylesOrderView'
import Modal from 'react-bootstrap/Modal';
import { getLifestylesDataSet, getMoreDataSet } from './functions/getCheckoutProductData';
import EssentialsOrderView from './Categories/EssentialsOrderView';
import EducationOrderView from './Categories/EducationOrderView';
import PleaseWaitLoader from 'src/Panels/PleaseWaitLoader/PleaseWaitLoader';

export default function MoreOrderView(props) {


    console.log(props.dataSet)
    var category = props.category
    var orderData = []

    const [productDataSet, setProductDataSet] = useState([])

    console.log(props.preID, "Pre ID 123")
    console.log(props.category, "Category 123")

    const [loading, setLoading] = useState(false)


    useEffect(() => {


        setLoading(true)
        getMoreDataSet(category, props.preID).then(response => {
            setProductDataSet(response)
            setLoading(false)

            console.log(response, "Data Response Value is111")
        }).catch(response => {
            console.log(response, "Catch Response is")
            setLoading(false)
        })



    }, [props.preID])





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



            </Modal.Body>

        </Modal>


    )
}
