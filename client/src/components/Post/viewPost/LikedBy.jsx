import React,{useState, useEffect} from 'react'
import { useDispatch } from 'react-redux'
import { useParams, } from 'react-router-dom'
import { postlikes } from '@/redux/likeSlice'
import UserHeader from '@/components/userHeader/UserHeader'
import { IoSearchSharp } from "react-icons/io5";
import { toast } from 'react-toastify'
import BackBtn from '@/components/BackBtn'

function LikedBy() {
    const dispatch = useDispatch()
    const {postId} = useParams()
    const [likedBy,setLikedBy] = useState()
    useEffect(()=>{
        ;(async()=>{
          let response = await dispatch(postlikes(postId))
          setLikedBy(response?.payload?.data?.likedUsers)
        })()
      },[])
      const [Search,setSearch] = useState('')
      let [userSearchedFor,setUserSearchedFor] = useState([]);

      const inputHandler = (e) => {
        setSearch(e.target.value)
        setUserSearchedFor([])
      }
  
      const search = () => {
        if(Search?.trim() == ""){
             toast.error('enter username to search')
            return null
        }
        let searchedUser = [];
        likedBy?.filter((user)=>{
          return user?.users?.username.includes(Search) ?  searchedUser.push(user) : ''  })
  
          return searchedUser?.length > 0 ? setUserSearchedFor(searchedUser) : setUserSearchedFor(['No User Found'])
      
      }
  
      return (
        // <div className='bg-black py-3 min-h-[100vh]'>
        //     <h2 className='text-center text-lg  text-white '>Liked By</h2>
        //     <h2 className=''>Liked By</h2>
        //   {likedBy?.length > 0 && likedBy?.map((user,i)=>(
        //     <UserHeader user={user?.users} key={i} userId={user?.users?._id} />
        //   ))}
        // </div>
        <div className='bg-black py-4'>
            <div className='flex px-4 gap-x-20 items-center py-4 lg:gap-x-36'>
                <BackBtn />
                <h2 className='text-center  text-white'>Liked By</h2>
            </div>
      <div className='min-h-[100vh] bg-black'>
        {likedBy?.length == 0 && <div className='w-full h-[80vh]'><div className='flex justify-center items-center h-full '><h2 className='text-white text-xl '>0 Likes</h2></div></div>}
        {
          likedBy?.length != 0 && <div className='bg-black px-10 py-5 relative'>
          <input 
          type="text" 
          value={Search}
          onChange={inputHandler}
          placeholder='search username'
          className='bg-transparent bg-opacity-90 border-2 border-gray-700 text-sm py-2 px-8 rounded-[10px] outline-none text-white lg:pr-24'
          />
          <button onClick={search} className='text-white bg-gray-900 absolute right-16 bg-opacity-90 border-2 border-gray-700 text-sm py-2 px-3 rounded-[10px]'><IoSearchSharp className = "text-xl"/></button>
        </div>
        }
        {userSearchedFor?.length == 0 && likedBy?.map((user)=>( 
          <UserHeader key={user?._id} user={user?.users}/>
        ))}
        {Search.trim() != '' && userSearchedFor[0] != 'No User Found'  && userSearchedFor?.map((user)=>( 
          <UserHeader key={user?._id} user={user?.users}/>
        ))
        }
        {
           Search.trim() == "" || userSearchedFor[0] == 'No User Found' && <div className='text-white min-h-[50vh] w-full flex items-center justify-center text-lg'>
            No User Found !!
          </div>
        }
        
    </div>
      </div>
      )
}

export default LikedBy