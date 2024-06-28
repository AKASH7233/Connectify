import React, { useEffect, useState } from 'react'
import {
    Drawer,
    DrawerClose,
    DrawerContent,
    DrawerDescription,
    DrawerHeader,
    DrawerTrigger,
  } from "@/components/ui/drawer"
  
import { 
    Bookmark,
    Flag,
    OctagonX,
    Trash2,
    EyeOff
} from 'lucide-react';

import { Switch } from "@/components/ui/switch"
import { FaXmark } from 'react-icons/fa6';
import { useDispatch } from 'react-redux';
import { togglehidePost } from '@/redux/postSlice';
import { DialogCloseButton } from './Share';
import { MdEdit } from "react-icons/md";
import AlertBox from './AlertBox';
import { EditTitle } from './EditTitle';

function DrawerPost({show,selfID,toggle,post}) {
  const dispatch = useDispatch()
  console.log(post?.isPublished);
  const [hidden,sethidden] = useState(!post?.isPublished)
  const [view,setView] = useState(show)
  console.log(hidden);

  const toggleVisibility = async() =>{
    await dispatch(togglehidePost(post?._id))
    sethidden(!hidden)
  }

  const shareLink = `https://connectify-omega.vercel.app/viewpost/${post?._id}/comment`
  const title = post?.title

  const res = () => {
    setView(false)
  }
  return (
    <>
      <Drawer open={show}>
        <DrawerContent className='bg-[#09090B] text-white'>
        <DrawerClose onClick={()=>{toggle(false)}} className='absolute right-4 top-2 text-lg' ><FaXmark/></DrawerClose>
            <DrawerHeader >
              {selfID && <EditTitle post={post}/>}
              <DrawerDescription className='text-md flex gap-x-4 my-2'><span><Bookmark/></span>Add To BookMark</DrawerDescription>
              <DrawerDescription className='text-md flex -mx-4 items-center'><DialogCloseButton shareLink={shareLink} title={title} drawer={true}/></DrawerDescription>
              {!selfID && <DrawerDescription className='text-md flex gap-x-4 my-2'><span><OctagonX/></span>Do not Recommend</DrawerDescription>}
              {!selfID && <DrawerDescription className='text-md flex gap-x-4 my-2'><span><Flag/></span>Report</DrawerDescription>}
              {selfID && <DrawerDescription className='text-md flex justify-between my-2 cursor-pointer'><span className='flex gap-x-4'><EyeOff/> <label htmlFor="hide">Hide Post</label></span> <Switch checked={hidden} onCheckedChange = {toggleVisibility} onCha id='hide' className="data-[state=checked]:bg-white"/></DrawerDescription>}
              {selfID && <DrawerDescription onClick ={res} className='text-md flex gap-x-4 my-2 text-red-400'><span><Trash2/></span>Delete</DrawerDescription>}            
            </DrawerHeader>
        </DrawerContent>
    </Drawer>
    {!view && <AlertBox open={true} warning={'post '} resFunc={res} id={post?._id}/> }
    </>

  )
}

export default DrawerPost
