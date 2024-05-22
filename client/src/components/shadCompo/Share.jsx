import { MdContentCopy } from "react-icons/md";

import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import {  Forward } from 'lucide-react';
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { useRef, useState } from "react";
import { useCallback } from "react";
import ShareBtn from "../ShareBtn/ShareBtn";

export function DialogCloseButton({shareLink,title,drawer = false,className = ''}) {

    
    const shareRef = useRef(null)
    const [isCopied,setIsCopied] = useState(false)

    const copy = useCallback(() => {
        shareRef.current?.select()
        shareRef.current?.setSelectionRange(0, 999);
        window.navigator.clipboard.writeText(shareLink)
        setIsCopied(true)
    })

    

  return (
    <div>
     {/* {
        !navigator.share &&  */}
        <Dialog>
        <DialogTrigger asChild>
          <Button variant="outline">{drawer ? <span className={`flex text-lg items-center gap-x-4 ${className}`}><Forward/> share</span>:<Forward/>}</Button>
        </DialogTrigger>
        <DialogContent className="sm:max-w-md w-[90vw] rounded-xl bg-[#09090B] text-gray-400">
          <DialogHeader>
            <DialogTitle className='text-white'>Share link</DialogTitle>
            <DialogDescription className='text-gray-400'>
              Anyone who has this link will be able to view this.
            </DialogDescription>
          </DialogHeader>
          <div className="flex items-center space-x-2">
            <div className="grid flex-1 gap-2">
              <Label htmlFor="link" className="sr-only">
                Link
              </Label>
              <Input
                ref={shareRef}
                id="link"
                defaultValue = {shareLink}
                readOnly
                className='border-white  text-white rounded-[10px]'
              />
            </div>
            <button onClick={copy} size="sm" className="p-3 bg-white rounded-[10px] text-black">
              <MdContentCopy className="h-4 w-4 " />
            </button>
            {/* {isCopied && <p className="lg:top-12 absolute right-3 top-[61%] text-sm bg-white px-2 text-black rounded-xl">copied</p>} */}
        </div>
        <div className="lg:px-6">
          <ShareBtn title={title} url={shareLink}/>
        </div>
          {/* <DialogFooter className="sm:justify-start">
            <DialogClose asChild>
              <button type="button" className='bg-white text-black mt-5 py-2 px-5 rounded-xl' variant="secondary">
                Close
              </button>
            </DialogClose>
          </DialogFooter> */}
        </DialogContent>
      </Dialog>
     {/* } */}
     
    </div>
  )
}
