import React, { useEffect, useState } from 'react';
import { GoogleMap, useLoadScript, Marker, InfoWindow } from '@react-google-maps/api';
import './DeliveryDetails.css'
import { Tab, Tabs } from 'react-bootstrap';
import { CImage } from '@coreui/react';

export default function DeliveryDetails(props) {
    const libraries = ['places'];
    const mapContainerStyle = {
        width: '98vw',
        height: '80vh',
    };

    const { isLoaded, loadError } = useLoadScript({
        googleMapsApiKey: 'AIzaSyA39AkmLbtriHvMJ-uqOV4I_6hpVz-4Pbk',
        libraries,
    });

    const [mapRef, setMapRef] = useState();
    const [productData, setProductData] = useState([]);

    const [isOpen, setIsOpen] = useState(false);
    const [infoWindowData, setInfoWindowData] = useState();




    const onMapLoad = (map) => {
        setMapRef(map);
        const bounds = new google.maps.LatLngBounds();
        markers?.forEach(({ lat, lng }) => bounds.extend({ lat, lng }));
        map.fitBounds(bounds);
    };

    const handleMarkerClick = (id, lat, lng, address) => {
        mapRef?.panTo({ lat, lng });
        setInfoWindowData({ id, address });
        setIsOpen(true);
    };


    useEffect(() => {
        setProductData([props.dataset])
    }, [props.dataset]);

    if (loadError) {
        return <div>Error loading maps</div>;
    }

    if (!isLoaded) {
        return <div>Loading maps</div>;
    }

    return (
        <div>

            <Tabs defaultActiveKey="0" id="uncontrolled-tab-example" className="mt-4">
                {productData.map((data, dataIndex) => {


                    if (!data.latitude || !data.longitude) {

                        return (
                            <Tab key={dataIndex} eventKey={dataIndex} title={data.product_title}>
                                <p style={{ marginTop: 15, fontSize: 18, color: 'red' }}>This product doesn't have any delivery process available.</p>
                            </Tab>

                        )
                    }
                    else {
                        var latitude = parseFloat(data.latitude)
                        var longitude = parseFloat(data.longitude)

                        var cusLat = parseFloat(data.cusLat)
                        var cusLon = parseFloat(data.cusLon)


                        var markers = []

                        if (data.category == "Lifestyles") {
                            markers = [
                                { address: "Product - " + data.product_title, lat: latitude, lng: longitude, image: data.product_image?.split(',')[0] },
                            ];
                        }
                        else {
                            markers = [
                                { address: "Product - " + data.product_title, lat: latitude, lng: longitude, image: data.product_image?.split(',')[0] },
                                { address: "Customer", lat: cusLat, lng: cusLon, image: data.product_image?.split(',')[0] }
                            ];
                        }


                        if (markers.length > 0) {
                            return (

                                <Tab key={dataIndex} eventKey={dataIndex} title={data.product_title}>
                                    <GoogleMap
                                        mapContainerClassName="map-container"

                                        mapContainerStyle={mapContainerStyle}
                                        center={{ lat: latitude, lng: longitude }}
                                        zoom={10}
                                    >
                                        {markers.map(({ address, lat, lng, image }, ind) => (
                                            <Marker
                                                key={ind}
                                                position={{ lat, lng }}
                                                onClick={() => {
                                                    handleMarkerClick(ind, lat, lng, address);
                                                }}
                                            >
                                                {isOpen && infoWindowData?.id === ind && (
                                                    <InfoWindow
                                                        onCloseClick={() => {
                                                            setIsOpen(false);
                                                        }}
                                                    >
                                                        <div style={{ maxWidth: '200px' }}> {/* Adjust the max width as needed */}
                                                            <div style={{ display: 'flex', alignItems: 'center', marginBottom: '5px' }}>
                                                                <img src={`https://gateway.aahaas.com/${image}`} alt="Marker Image" height={20} width={20} style={{ borderRadius: '50%', marginRight: '5px' }} />
                                                                <h5 style={{ margin: 0 }}>{address}</h5>
                                                            </div>
                                                            {/* Additional information can be added here */}
                                                        </div>
                                                    </InfoWindow>
                                                )}
                                            </Marker>
                                        ))}

                                    </GoogleMap>
                                </Tab>
                            )
                        }

                    }

                })}
            </Tabs>
        </div>
    );
}
