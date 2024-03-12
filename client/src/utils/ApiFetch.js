import axios from 'axios';


const Base_url = "https://connectify-app-tau.vercel.app/api/v1"

const axiosInstance = axios.create({
    baseURL: Base_url,
    timeout: 10000,
    withCredentials: true,
})

export default axiosInstance
