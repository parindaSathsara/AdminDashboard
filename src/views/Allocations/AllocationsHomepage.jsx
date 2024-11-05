import React, { useState } from 'react'
import DriverAllocationHome from './DriverAllocation/DriverAllocationHome';
import VehicleAllocationHome from './VehicleAllocation/VehicleAllocationHome';

function AllocationsHomepage() {

    const [allocationType, setAllocationType] = useState("1");

    return (
        <div className='container-fluid'>
            <div className='d-flex justify-content-between align-items-center'>
                <h6>Order allocations</h6>
                <div className='ms-auto'>
                    <div className='d-flex justify-content-start gap-3'>
                        <button className={`btn border ${allocationType === "1" && 'btn-primary'}`} onClick={() => setAllocationType('1')}>Driver allocation</button>
                        <button className={`btn border ${allocationType === "2" && 'btn-primary'}`} onClick={() => setAllocationType('2')}>Vehicle allocation</button>
                    </div>
                </div>
            </div>
            <div className='my-4'>
                {
                    allocationType === "1" ?
                        <DriverAllocationHome />
                        : allocationType === "2" ?
                            <VehicleAllocationHome />
                            : null
                }
            </div>
        </div>
    )
}

export default AllocationsHomepage;