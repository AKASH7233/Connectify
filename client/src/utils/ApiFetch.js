import axios from 'axios';


const Base_url = "https://connectify-1-ujfo.onrender.com" 

const axiosInstance = axios.create({
    baseURL: Base_url,
    timeout: 10000,
    withCredentials: true,
})

export default axiosInstance
