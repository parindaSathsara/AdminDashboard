const rowStyle = (data) => {

    console.log(data)

    if (data?.data?.status == "Approved") {
        return ({
            backgroundColor: '#FFF5E2',
            color: '#5D4211',
            fontSize: 16
        })
    }
    else if (data?.data?.status == "Completed") {
        return ({
            backgroundColor: '#CEF5D1',
            color: '#07420c',
            fontSize: 16
        })
    }
    else if (data?.data?.status == "Cancel" || data?.data?.supplier_status == "Cancel") {
        return ({
            backgroundColor: '#FFD3D3',
            color: '#9C2525',
            fontSize: 16
        })
    }
    else {

    }
}

export default rowStyle;
