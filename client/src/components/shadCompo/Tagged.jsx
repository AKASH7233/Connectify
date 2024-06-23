import * as React from "react"

import { Button } from "@/components/ui/button"
import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerDescription,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from "@/components/ui/drawer"
import { useState } from "react";
import { useEffect } from "react";
import { useDispatch } from "react-redux";
import { viewBlink } from "@/redux/blinkSlice";
import profileImg from "../../assets/profile.png"
import UserHeader from "../userHeader/UserHeader";
import { FaSearch } from "react-icons/fa";
import { getTaggedUser } from "@/redux/postSlice";


export function TaggedList({currentPost}) {
  console.log(currentPost);
  const [viewers,setviewers] = useState()
  const [search,setSearch] = useState('')
  const [userSearched,setUserSearched] = useState()
  const dispatch = useDispatch()

  useEffect(() => {
    if (currentPost) {
      (async () => {
        const res = await dispatch(getTaggedUser(currentPost));
        console.log(res.payload?.data);
        setviewers(res.payload?.data)
      })()
    }
  }, [currentPost, dispatch]);

  // const searchUser = async() => {
  //   console.log(viewers);
  //   viewers?.map(viewer => {
  //     console.log(viewer);
  //     const searched = viewer?.taggedUsers.username?.includes(search) ?  viewer : null
  //     console.log(searched)
  //     return searched != null ? setUserSearched([searched]) : setUserSearched('No User Found !!')
  //   })
  // }

  const searchUser = () => {
    if(search?.trim() == ""){
      toast.error('enter username to search')
     return null
    }
    console.log(search.length);
    let searchedUser = [];
    viewers?.map((user)=>{
      console.log(user);
      return user?.taggedUsers?.username.includes(search) ? searchedUser.push(user) : ''  })
      
      return searchedUser?.length > 0 ? setUserSearched(searchedUser) : setUserSearched(['No User Found'])
    
  }
  console.log(userSearched);

  // console.log(userSearched);

  return ( 
    <Drawer>
      <DrawerTrigger asChild>
        <Button variant="outline">
          <div className="bg-gray-200 rounded-xl px-2 text-blue-600">
            {/* {
              viewers?.slice(0,3)?.map((viewer)=>{
                const imgSrc = viewer?.ProfileImage ?  viewer?.ProfileImage : profileImg 
                console.log(imgSrc);
                return (
                  <img key ={viewer?._id} src={imgSrc} alt="viewer" className="w-10 h-10 object-contain  rounded-[50%] -ml-4" />
                )
              })
            }
            {viewers?.length > 3 && <h2 className="bg-transparent bg-opacity-90 border-2 border-gray-400 w-10 py-2 rounded-[50%]  outline-none text-white"> {viewers?.length - 3} </h2>}
            {viewers?.length == 0  && <h2 className="bg-transparent bg-opacity-90 border-2 border-gray-400 w-10 py-2 rounded-[50%]  outline-none text-white"> 0 </h2>} */}
            {`📌with ${viewers?.length} others`}
          </div>
        </Button>
      </DrawerTrigger>
      <DrawerContent className='text-white'>
        <div className="mx-auto w-full max-w-sm">
          <DrawerHeader>
            <DrawerTitle>Tagged To</DrawerTitle>
          </DrawerHeader>
            <div className="relative mb-4">
              <input 
              type="text"
              placeholder="search username"
              className="bg-transparent w-full bg-opacity-90 border-2 border-gray-700 text-sm py-3 px-4 rounded-[10px] outline-none text-white"
              value={search}
              onChange={(e)=>{setSearch(e.target.value);setUserSearched([])}}
              />
              <button className="bg-gray-900 bg-opacity-90 border-2 right-0 border-gray-700 text-sm py-3 pt-4 top-0 cursor-pointer absolute  px-4 rounded-[10px] outline-none text-white" onClick={searchUser}><FaSearch className="text-sm"/></button>
            </div>
            <div>
            {search.trim() == '' && viewers?.map((user)=>( 
              <UserHeader key={user?._id} user={user?.taggedUsers}/>
            ))}
            {search.trim() != '' && userSearched != 'No User Found' && userSearched?.map((user)=>( 
              <UserHeader key={user?._id} user={user?.taggedUsers}/>
            ))
            }
            {
              search.trim() == "" || userSearched == 'No User Found' && <div className='text-white min-h-[50vh] w-full flex items-center justify-center text-lg'>
                No User Found !!
              </div>
            }
            </div>
          <DrawerFooter>
            <DrawerClose asChild>
              <Button variant="outline" >Cancel</Button>
            </DrawerClose>
          </DrawerFooter>
        </div>
      </DrawerContent>
    </Drawer>
  )
}
