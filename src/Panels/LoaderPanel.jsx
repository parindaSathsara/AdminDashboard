import { CSpinner } from '@coreui/react';
import React from 'react';


const LoaderPanel = ({ message }) => {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', height: '80vh' }}>
      <CSpinner size={"40px"} />
      {message && <p style={{ marginTop: '15px', fontWeight: '600', fontSize: 22 }}>{message}</p>}
    </div>
  );
};

export default LoaderPanel;