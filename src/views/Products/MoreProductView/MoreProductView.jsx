import React, { useEffect, useState } from 'react'
import Modal from 'react-bootstrap/Modal';
import PleaseWaitLoader from 'src/Panels/PleaseWaitLoader/PleaseWaitLoader';
import LifestylesProductView from './Categories/LifestylesProductView';
import EssentialsProductView from './Categories/EssentialsProductView';
import EducationProductView from './Categories/EducationProductView';
import HotelProductView from './Categories/HotelProductView';
import { getProductData, getBridgifyProductData } from './functions/getProductData';

export default function MoreProductView(props) {
    console.log(props.productData, "Props Value is")
    var category = props.productData.category
    var productData = props.productData

    const [productDataSet, setProductDataSet] = useState([])
    const [loading, setLoading] = useState(false)
    const [bridgifyProduct, setBridgifyProduct] = useState(false)

    useEffect(() => {
        setLoading(true)
        let product_id = props.productData.product_id
        
        getProductData(productData).then(response => {
            setProductDataSet(response)
            setLoading(false)
            console.log(response, "Response_id");
            if(response?.data?.provider == "bridgify"){
                setBridgifyProduct(true)
            }else{
                setBridgifyProduct(false)
            }
        }).catch(response => {
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
                {loading ? (
                    <PleaseWaitLoader></PleaseWaitLoader>
                ) : bridgifyProduct ? (
                    // Bridgify Product Details View
                    <div className="bridgify-product-details">
                        <h2>{productDataSet.data.attraction.title}</h2>
                        <img 
                            src={productDataSet.data.attraction.main_photo_url} 
                            alt={productDataSet.data.attraction.title}
                            style={{ maxWidth: '100%', height: 'auto' }}
                        />
                        <p>{productDataSet.data.attraction.description}</p>
                        
                        <div className="details-section">
                            <h3>Details</h3>
                            <p><strong>Price:</strong> ${productDataSet.data.attraction.price}</p>
                            <p><strong>Duration:</strong> {productDataSet.data.attraction.duration}</p>
                            <p><strong>Rating:</strong> {productDataSet.data.attraction.rating} ({productDataSet.data.attraction.number_of_reviews} reviews)</p>
                            <p><strong>Cancellation Policy:</strong> {productDataSet.data.attraction.cancellation_policy}</p>
                            {productDataSet.data.attraction.free_cancellation && (
                                <p><strong>Free Cancellation Available</strong></p>
                            )}
                        </div>
                        
                        <div className="included-section">
                            <h3>Included</h3>
                            <p>{productDataSet.data.attraction.additional_info.included}</p>
                        </div>
                        
                        <div className="excluded-section">
                            <h3>Excluded</h3>
                            <p>{productDataSet.data.attraction.additional_info.excluded}</p>
                        </div>
                        
                        <div className="important-info">
                            <h3>Important Information</h3>
                            <ul>
                                {productDataSet.data.attraction.additional_info.important_information.map((info, index) => (
                                    <li key={index}>{info}</li>
                                ))}
                            </ul>
                        </div>
                        
                        <a 
                            href={productDataSet.data.attraction.order_webpage} 
                            target="_blank" 
                            rel="noopener noreferrer"
                            className="btn btn-primary"
                        >
                            Book Now
                        </a>
                    </div>
                ) : (
                    // Regular Product Views
                    <>
                        {category == "Lifestyles" &&
                            <LifestylesProductView productData={productDataSet}></LifestylesProductView>
                        }
                        {category == "Essentials" &&
                            <EssentialsProductView productData={productDataSet}></EssentialsProductView>
                        }
                        {category == "Educations" &&
                            <EducationProductView productData={productDataSet}></EducationProductView>
                        }
                        {category == "Hotels" &&
                            <HotelProductView productData={productDataSet}></HotelProductView>
                        }
                    </>
                )}
            </Modal.Body>
        </Modal>
    )
}