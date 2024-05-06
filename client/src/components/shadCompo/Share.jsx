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
import { useRef } from "react";
import { useCallback } from "react";

export function DialogCloseButton({link}) {

    const shareLink = `localhost:5173/viewpost/${link}/comment`

    const shareRef = useRef(null)

    const copy = useCallback(() => {
        shareRef.current?.select()
        shareRef.current?.setSelectionRange(0, 999);
        window.navigator.clipboard.writeText(shareLink)
    })

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="outline"><Forward/></Button>
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
            <span className="sr-only">Copy</span>
            <MdContentCopy className="h-4 w-4 " />
          </button>
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
