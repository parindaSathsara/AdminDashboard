import React from 'react';
import { CSpinner } from '@coreui/react';

function PleaseWaitLoader() {
    return (
        <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh', backgroundColor: 'rgba(0, 0, 0, 0.6)', position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, zIndex: 9999 }}>
            <CSpinner
                color="white"
                style={{ width: '3rem', height: '3rem', marginRight: 10 }}
            />
            <h3 style={{ marginLeft: '8px', color: '#ffffff' }}>Loading, please wait...</h3>
        </div>
    );
}

export default PleaseWaitLoader;
