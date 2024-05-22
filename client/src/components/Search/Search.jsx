
import React,{useState} from 'react'
import { useDispatch } from 'react-redux'
import { Link, useParams, } from 'react-router-dom'
import UserHeader from '@/components/userHeader/UserHeader'
import { IoSearchSharp } from "react-icons/io5";
import { toast } from 'react-toastify'
import axiosInstance from '@/utils/ApiFetch';

function Search() {
    const [user,setUser] = useState()
    const [Search,setSearch] = useState('')
    const [err,SetErr] = useState('')
  
    const inputHandler = (e) => {
        setSearch(e.target.value)
        setUser(['No Req'])
        SetErr(null)
    }
  
    const search = async() => {
      if(Search?.trim() == ""){
          toast.error('enter username to search')
          return null
      }
      console.log(Search);
      let response = await axiosInstance.get(`/search/search/${Search}`)
        if(response?.data?.data){
          setUser(response?.data?.data)
          SetErr(null)
        }
        if(response?.data?.error){
          SetErr(response?.data?.error)
          setUser(['No Req'])
        }
      }
 
      return (
       
        <div className='bg-black py-4'>
          <div className='min-h-[100vh] bg-black'>
            
            <div className='bg-black px-10 py-5 relative'>
              <input 
              type="text" 
              value={Search}
              onChange={inputHandler}
              placeholder='search username or FullName'
              className='bg-transparent bg-opacity-90 border-2 border-gray-700 text-md py-2 px-4 w-[75vw] lg:w-80 md:w-60 rounded-[10px] outline-none text-white placeholder:text-sm'
              />
              <button onClick={search} className='text-white bg-gray-900 absolute right-10 top-5 bg-opacity-90 border-2 border-gray-700  py-2 px-3 rounded-[10px]'><IoSearchSharp className = "text-2xl"/></button>
            </div>
            
            <div className='20px my-4'>
              {
                Array.isArray(user) && user[0] != "No Req" && user?.map((user,i)=>(
                  <UserHeader user={user} key={i}/>
                )) 
              }
              {
              !Array.isArray(user) && user?.post.map((user,i)=>(
                  <div className='flex mx-4'>
                    <Link to={`/viewpost/${user?._id}/comment`}>
                      <img src={user?.postFile} className={'w-52 '} key={i}/>
                    </Link>
                  </div>
                ))
              }

              {
              err && <div className=' h-[50vh]  flex justify-center items-center text-white'>
                  <h2 className='text-center'>{err}</h2>
              </div>
              }
            </div>
            
        </div>
      </div>
      )
}

export default Search