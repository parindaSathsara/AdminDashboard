import axios from 'axios';
import React, { useContext } from 'react';
import Select from 'react-select';
import { CurrencyContext } from 'src/Context/CurrencyContext';

export default function CurrencyController() {
    const currencies = [
        { value: 'LKR', label: 'LKR' },
        { value: 'USD', label: 'USD' },
        { value: 'SGD', label: 'SGD' },
    ];



    const { currencyData, setCurrencyData } = useContext(CurrencyContext)

    const handleOnCurrencyClick = (value) => {
        axios.get(`getCurrency/${value?.value}`).then(response => {
            if (response?.data?.status == 200) {
                setCurrencyData(response?.data)
            }
        })
    }




    return (
        <div>

            <Select
                options={currencies}
                placeholder="Currency"
                onChange={(e) => handleOnCurrencyClick(e)}
                defaultValue={{ value: currencyData?.base, label: currencyData?.base }}
            />

        </div>
    );
}
