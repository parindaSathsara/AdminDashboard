import React from 'react';
import {
  CCard,
  CCardImage,
  CCardBody,
  CCardTitle,
} from '@coreui/react';
import '@coreui/coreui/dist/css/coreui.min.css';

export default function DiscountProductSelectListCard({details}) {
  return (
    <CCard
      style={{
        width: '18rem',
        // margin: '1rem',
        padding:'1rem',
        display: 'flex',
        flexDirection: 'row',
        alignItems: 'center', // Centers content vertically
             width:'100%',
             backgroundColor:'transparent'
      }}
    >
      <CCardImage
        src={details?.product_images?.split(",")[0] || ""}
        alt="Product Image"
        style={{
          width: '80px',
          height: '80px', 
          objectFit: 'cover',
        }}
      />
      <CCardBody
        style={{
          flex: 1, 
          padding: '0.5rem',
          width:'100%'
        }}
      >
        <CCardTitle>{details?.product_name}</CCardTitle>
        <CCardTitle><h6>{details?.sub_description}</h6></CCardTitle>
      </CCardBody>
    </CCard>
  );
}
