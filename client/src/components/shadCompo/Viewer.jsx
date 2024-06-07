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


export function ViewerList({currentOpenedStory}) {
  console.log(currentOpenedStory);
  const [viewers,setviewers] = useState()
  const [search,setSearch] = useState('')
  const [userSearched,setUserSearched] = useState()
  const dispatch = useDispatch()

  useEffect(() => {
    if (currentOpenedStory?.id) {
      (async () => {
        const res = await dispatch(viewBlink(currentOpenedStory.id));
        console.log(res.payload?.data[0]?.Allviewers);
        setviewers(res.payload?.data[0]?.Allviewers)
      })()
    }
  }, [currentOpenedStory, dispatch]);

  const searchUser = async() => {
    viewers?.map(viewer => {
      const searched = viewer?.username.includes(search) ?  viewer : null
      setSearch('')
      return searched ? setUserSearched([searched]) : setUserSearched('No User Found !!')
    })
  }

  return ( 
    <Drawer>
      <DrawerTrigger asChild>
        <Button variant="outline">
          <div className="flex items-center gap-2">
            {
              viewers?.slice(0,3)?.map((viewer)=>{
                const imgSrc = viewer?.ProfileImage ?  viewer?.ProfileImage : profileImg 
                console.log(imgSrc);
                return (
                  <img key ={viewer?._id} src={imgSrc} alt="viewer" className="w-10 h-10 object-contain  rounded-[50%] -ml-4" />
                )
              })
            }
            {viewers?.length > 3 && <h2 className="bg-transparent bg-opacity-90 border-2 border-gray-400 w-10 py-2 rounded-[50%]  outline-none text-white"> {viewers?.length - 3} </h2>}
            {viewers?.length == 0  && <h2 className="bg-transparent bg-opacity-90 border-2 border-gray-400 w-10 py-2 rounded-[50%]  outline-none text-white"> 0 </h2>}
          </div>
        </Button>
      </DrawerTrigger>
      <DrawerContent className='text-white'>
        <div className="mx-auto w-full max-w-sm">
          <DrawerHeader>
            <DrawerTitle>Viewers</DrawerTitle>
          </DrawerHeader>
            <div>
              <input 
              type="text"
              placeholder="search username"
              className="bg-transparent bg-opacity-90 border-2 border-gray-700 text-sm py-2 mx-4 px-4 rounded-[10px] outline-none text-white"
              value={search}
              onChange={(e)=>{setSearch(e.target.value)}}
              />
              <button className="bg-transparent bg-opacity-90 border-2 border-gray-700 text-sm py-3 cursor-pointer px-4 rounded-[10px] outline-none text-white" onClick={searchUser}><FaSearch /></button>
            </div>
            <div>
              { !userSearched && 
                viewers?.map((viewer) =>(
                  <UserHeader key={viewer?._id} user={viewer} viewer={true}/>
                ))
              }
              { userSearched?.length != 0 && Array.isArray(userSearched) &&
                userSearched?.map((viewer) =>(
                  <UserHeader key={viewer?._id} user={viewer} viewer={true}/>
                ))
              }
              {
                typeof(userSearched) == 'string' && <div className="min-h-[10vh] my-4 h-full flex justify-center items-center">{userSearched}</div>
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
