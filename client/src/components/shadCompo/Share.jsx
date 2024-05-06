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

export function DialogCloseButton({link,drawer = false}) {

    const shareLink = `localhost:5173/viewpost/${link}/comment`
    const [title,setTitle] = useState(false)
    const shareRef = useRef(null)

    const copy = useCallback(() => {
        shareRef.current?.select()
        shareRef.current?.setSelectionRange(0, 999);
        window.navigator.clipboard.writeText(shareLink)
        setTitle(true)
    })

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="outline">{drawer ? <span className="flex text-lg items-center gap-x-4"><Forward/> share</span>:<Forward/>}</Button>
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
          {title && <p className="absolute right-3 top-[61%] text-sm bg-white px-2 text-black rounded-xl">copied</p>}
      </div>
        <DialogFooter className="sm:justify-start">
          <DialogClose asChild>
            <Button type="button" className='bg-white text-black mt-5 rounded-xl' variant="secondary">
              Close
            </Button>
          </DialogClose>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
