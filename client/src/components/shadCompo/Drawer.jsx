import React from 'react'
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
  
  import { 
    Bookmark,
    Forward,
    Flag,
    OctagonX,
    Trash2,
    EyeOff
} from 'lucide-react';

import { Switch } from "@/components/ui/switch"


import { Button } from '../ui/button'
function DrawerPost() {
  return (
    <Drawer>
        <DrawerTrigger className='text-white'>Open</DrawerTrigger>
        <DrawerContent className='bg-[#09090B] text-white'>
            <DrawerHeader >
            {/* <DrawerClose className='absolute right-0 top-0'>
                <Button variant="outline">X</Button>
            </DrawerClose> */}
            
            <DrawerDescription className='text-md flex gap-x-4 my-2'><span><Bookmark/></span>Add To BookMark</DrawerDescription>
            <DrawerDescription className='text-md flex gap-x-4 my-2'><span><Forward/></span>Share</DrawerDescription>
            <DrawerDescription className='text-md flex gap-x-4 my-2'><span><OctagonX/></span>Do not Recommend</DrawerDescription>
            <DrawerDescription className='text-md flex gap-x-4 my-2'><span><Flag/></span>Report</DrawerDescription>
            <DrawerDescription className='text-md flex gap-x-4 my-2'><span><EyeOff/></span>Hide Post <Switch className='bg-white'/></DrawerDescription>
            <DrawerDescription className='text-md flex gap-x-4 my-2 text-red-400'><span><Trash2/></span>Delete</DrawerDescription>
            </DrawerHeader>
            
            {/* <Button>Submit</Button> */}
            
        </DrawerContent>
    </Drawer>

  )
}

export default DrawerPost
