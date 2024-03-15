import { useEffect, useState } from 'react'
import axiosInstance from './ApiFetch'
import toast from 'react-hot-toast'

function DataFetch(url, info) {
    const [data,setData] = useState([])
    const [loading,setLoading] = useState(false)
    const fetch = async()=>{
        try {
            let response =  await axiosInstance.post(url,info)
            setLoading(true)
            setData(response.data)
            console.log(response.data);
            if(response.data.message){
                toast.success(response.data.message)
            }
            if(response?.data.error){
                toast.error(response.data.error)
            }
            setLoading(false)
        } catch (error) {
            setLoading(false)
            setData(error)
        }
        
    }
    useEffect(()=> {
      fetch()
    },[]) 
    return [data,loading]
}

export default DataFetch