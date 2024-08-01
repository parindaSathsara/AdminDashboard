import React, { useContext, useEffect, useState } from 'react'
import HotListCard from './Component/HotListCard'
import { fetchInAppNotifications } from './service/HotListServices'
import { UserLoginContext } from 'src/Context/UserLoginContext';

export default function HotList({ increaseNotification, display, data }) {

    const [hotList, setHotList] = useState([])



    useEffect(() => {

        setHotList(data)

    }, [data])


    return (
        <div>
            {hotList?.map(res => {
                return (
                    <HotListCard data={res}></HotListCard>
                )
            })}

        </div>
    )
}
