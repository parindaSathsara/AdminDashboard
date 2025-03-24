import { useContext } from "react";
import { CurrencyContext } from "./CurrencyContext";




const CurrencyConverter = (conversionCurrency, amount, dataSet) => {


    // const { currencyData, setCurrencyData } = useContext(CurrencyContext);
  const currencyData = dataSet


    var totalPrice = 0.00;


    if (currencyData?.['rates']) {
        var conversion = currencyData?.['rates'][conversionCurrency]
        //console.log(conversionCurrency)
        totalPrice = amount / conversion;

        //console.log("Total Price value is", totalPrice)

        if (typeof totalPrice == 'number') {
            return currencyData?.['base'] + " " + (totalPrice).toFixed(2).replace(/(\d)(?=(\d{3})+(?!\d))/g, '$1,')

        } else {

            return currencyData?.['base'] + " " + 0

        }


    }
    else {
        return 0.00
    }


}


export default CurrencyConverter;
