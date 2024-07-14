import axios from 'axios';


const Base_url =  "https://connectify-6tvs.onrender.com/api/v1" 
//  "http://localhost:8000/api/v1"

const axiosInstance = axios.create({
    baseURL: Base_url,
    timeout: 10000,
    withCredentials: true,
})

export default axiosInstance
