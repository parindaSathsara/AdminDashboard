import axios from "axios"

const getReports = async (dataSet) => {
  let dataArray = [];
  await axios.post("generate_custom_reports", dataSet).then(response => {
    if (response.data.status == 200) {
      dataArray = response.data.productData
    }
  }).catch((res) => {
    dataArray = []
  })
  return dataArray
}

const getCartInsightsReport = async (params) => {
  try {
    const response = await axios.get('/cart-insights', {
      params: {
        start_date: params.startDate,
        end_date: params.endDate,
        category: params.category,
      },
    });
    if (response.data.status === 200) {
      return response.data.data; // ✅ only return array
    }
    return [];
  } catch (error) {
    console.error('API Error:', error);
    return [];
  }
}

const getCrossCategoryReport = async (params) => {
  try {
    const response = await axios.get('/cross_category_report', {
      params: {
        categories: params.categories, // array of category names ['lifestyles','hotels']
        start_date: params.startDate,
        end_date: params.endDate,
        product_ids: params.productIds || [], // optional
      },
    });

    if (response.data.status === 200) {
      return response.data.data; // only return array of users
    }
    return [];
  } catch (error) {
    console.error('Cross Category API Error:', error);
    return [];
  }
};

export { getReports, getCartInsightsReport, getCrossCategoryReport }
