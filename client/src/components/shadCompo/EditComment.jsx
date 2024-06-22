import * as React from "react"

import { Button } from "@/components/ui/button"
import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerDescription,
  DrawerFooter,
  DrawerHeader,
  DrawerTrigger,
} from "@/components/ui/drawer"
import { IoMdMore } from "react-icons/io";
import { Link } from "react-router-dom";
import { FaRegComment } from "react-icons/fa";
import { 
    Trash2,
    Flag
} from "lucide-react";
import { EditTitle } from "./EditTitle";

export function CommentOpt({currentComment,selfID, isAlreadyReply}) {
  console.log(`currentComment ${currentComment?._id}`);
  console.log(`currentComment ${currentComment?.comment}`);

  return ( 
    <Drawer>
      <DrawerTrigger asChild>
        <Button variant="outline">
            <IoMdMore color="white"/>
        </Button>
      </DrawerTrigger>
      <DrawerContent className='text-white'>
            <DrawerHeader >
              {selfID && <EditTitle comment={currentComment}/>}
              {isAlreadyReply && 
              <Link to={`/viewreplies/${currentComment?._id}`}>
                <DrawerDescription className='text-md flex gap-x-4 items-center my-2'><span><FaRegComment/></span>Reply</DrawerDescription>
              </Link>
              }
              {selfID && <DrawerDescription  className='text-md flex gap-x-4 my-2 text-red-400'><span><Trash2/></span>Delete</DrawerDescription>}      
              {!selfID && <DrawerDescription className='text-md flex gap-x-4 my-2'><span><Flag/></span>Report</DrawerDescription>}     
            </DrawerHeader>
        <DrawerFooter>
            <DrawerClose asChild>
              <Button variant="outline">Cancel</Button>
            </DrawerClose>
        </DrawerFooter>
      </DrawerContent>
    </Drawer>
  )
}
