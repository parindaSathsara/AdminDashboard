import axios from 'axios'

function getAllDataUserWise() {
  axios
    .get('/fetch_all_orders_userwise')
    .then((res) => {
      console.log(res)

      if (res.data.status === 200) {
        dataArray = res.data.response
      }
    })
    .catch((err) => {
      throw new Error(err)
    })
}

export default getAllDataUserWise
