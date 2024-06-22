import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { useState } from "react"
import { useDispatch } from "react-redux"
import { MdEdit } from "react-icons/md"
import toast from "react-hot-toast"
import { EditPost } from "@/redux/postSlice"
import { DialogClose } from "@radix-ui/react-dialog"
import { editComment } from "@/redux/commentSlice"

export function EditTitle({post = null , comment = null }) {

    const dispatch = useDispatch()
    const [title,setTitle] = useState(post?.title) 
    const [commentTitle,setCommentTitle] = useState(comment?.comment)
    console.log(commentTitle);
    const inputHandler = (e) => {
        setTitle(e.target.value)
    }

    const submit = async(e) =>{
        e.preventDefault()
        if(post){
          if(title?.trim() == ''){
            toast.error(`Title is required !`)
            return null
          }
          await dispatch(EditPost({id: post?._id,title :title}))
        } else{
              if(commentTitle?.trim() == ''){
                toast.error(`Title is required !`)
                return null
              }
              await dispatch(editComment({url: comment?._id, comment: commentTitle}))
        }
         location.reload()
    }
  return (
    <Dialog>
        <DialogTrigger className='text-md flex items-center gap-x-4 my-2 '><span><MdEdit className='text-xl'/></span>Edit</DialogTrigger>
      <DialogContent className="sm:max-w-[425px] bg-[#09090B] text-white w-[90vw] rounded-xl">
        <DialogHeader>
          <DialogTitle>Edit {`${post ? "Post's Title": "Comment"}`}</DialogTitle>
          {/* <p className="absolute right-4 top-4 rounded-sm opacity-70 ring-offset-background transition-opacity hover:opacity-100 focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:pointer-events-none data-[state=open]:bg-accent data-[state=open]:text-muted-foreground">X</p> */}
          <DialogDescription className= 'text-gray-400'>
            Make changes to your profile here. Click save when you're done.
          </DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="grid grid-cols-4 items-center gap-1">
            <Label htmlFor="name" className="text-left">
              New {post ? 'Title': 'Comment'}
            </Label>
            {
              post ?
              <Input
              id="fullName"
              defaultValue={title}
              className="col-span-3 rounded-xl"
              onChange = {inputHandler}
              /> : <Input
              id="fullName"
              defaultValue={commentTitle}
              className="col-span-3 rounded-xl"
              onChange = {(e)=>{setCommentTitle(e.target.value)}}
              />
            }
          </div>
        </div>
        <DialogFooter>
          <DialogClose><Button className='rounded-xl bg-white text-black' type="submit" onClick = {submit}>Save changes</Button></DialogClose>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
