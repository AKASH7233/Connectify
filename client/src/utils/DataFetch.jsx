import { useEffect, useState } from 'react'
import axiosInstance from './ApiFetch'

function DataFetch(url, info) {
    const [data,setData] = useState([])
    const [loading,setLoading] = useState(false)
    const fetch = async()=>{
        try {
            let response = await axiosInstance.post(url,{info})
            setLoading(true)
            console.log(response.data)
            setData(response.data)
            setLoading(false)
        } catch (error) {
            setLoading(false)
            setData(error)
        }
    }
    useEffect(()=> {
      fetch()
    },[]) 
    console.log(data,loading);
    return [data,loading]
}

export default DataFetch