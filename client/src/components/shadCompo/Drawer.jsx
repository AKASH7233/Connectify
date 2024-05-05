import React from 'react'
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
    Forward,
    Flag,
    OctagonX,
    Trash2,
    EyeOff
} from 'lucide-react';

import { Switch } from "@/components/ui/switch"
import { FaXmark } from 'react-icons/fa6';

function DrawerPost({show,selfID,userId,toggle}) {
  console.log(selfID,userId);
  return (
    <Drawer open={show}>
        <DrawerContent className='bg-[#09090B] text-white'>
        <DrawerClose onClick={()=>{toggle(false)}} className='absolute right-4 top-2 text-lg' ><FaXmark/></DrawerClose>
            <DrawerHeader >
              <DrawerDescription className='text-md flex gap-x-4 my-2'><span><Bookmark/></span>Add To BookMark</DrawerDescription>
              <DrawerDescription className='text-md flex gap-x-4 my-2'><span><Forward/></span>Share</DrawerDescription>
              {!selfID && <DrawerDescription className='text-md flex gap-x-4 my-2'><span><OctagonX/></span>Do not Recommend</DrawerDescription>}
              {!selfID && <DrawerDescription className='text-md flex gap-x-4 my-2'><span><Flag/></span>Report</DrawerDescription>}
              {selfID && <DrawerDescription className='text-md flex justify-between my-2'><span className='flex gap-x-4'><EyeOff/> <label htmlFor="hide">Hide Post</label></span> <Switch id='hide' className="data-[state=checked]:bg-white"/></DrawerDescription>}
              {selfID && <DrawerDescription className='text-md flex gap-x-4 my-2 text-red-400'><span><Trash2/></span>Delete</DrawerDescription>}            </DrawerHeader>
        </DrawerContent>
    </Drawer>

  )
}

export default DrawerPost
