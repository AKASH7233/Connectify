import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { X } from "lucide-react"
import * as DialogPrimitive from "@radix-ui/react-dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { useState } from "react"
import { useDispatch,useSelector } from "react-redux"
import { updateProfile } from "@/redux/authSlice"
import toast from "react-hot-toast"

export function DialogDemo({open,res}) {

    const [show,setShow] = useState(open)
    console.log(show);

    const dispatch = useDispatch()
    const user = useSelector(state=> state?.auth?.user)?.user || useSelector(state => state?.auth?.user[0])
    const [info,setInfo] = useState({
        username: user?.username,
        Description : user?.Description || '',
        fullName : user?.fullName,
    })
    const inputHandler = (e) => {
        setInfo({...info,[e.target.id] : e.target.value})
    }
    console.log(info);
    const submit = async(e) =>{
        e.preventDefault()
        if(info?.username.trim() == ''  && info?.fullName.trim() == ''){
            toast.error(`username and fullname is required !`)
            return null
        }
        let response = await dispatch(updateProfile(info))
        console.log(response);
        res(false)
        setShow(false)
    }
  return (
    <Dialog open={show} >
      <DialogContent className="sm:max-w-[425px] bg-[#09090B] text-white w-[90vw] rounded-xl">
        <button onClick={()=>{res(false)}} className="w-4 h-4 absolute right-4 top-4 bg-[#09090B] z-40">X</button>
        <DialogHeader>
          <DialogTitle>Edit profile</DialogTitle>
          {/* <p className="absolute right-4 top-4 rounded-sm opacity-70 ring-offset-background transition-opacity hover:opacity-100 focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:pointer-events-none data-[state=open]:bg-accent data-[state=open]:text-muted-foreground">X</p> */}
          <DialogDescription className= 'text-gray-400'>
            Make changes to your profile here. Click save when you're done.
          </DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="name" className="text-left">
              Name
            </Label>
            <Input
              id="fullName"
              defaultValue={info?.fullName}
              className="col-span-3 rounded-xl"
              onChange = {inputHandler}
              
            />
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="username" className="text-left">
              Username
            </Label>
            <Input
              id="username"
              defaultValue={info?.username}
              className="col-span-3 rounded-xl"
              onChange = {inputHandler}
            />
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="username" className="text-left">
              Bio
            </Label>
            <Input
              id="Description"
              defaultValue={info?.Description}
              placeHolder= 'Add your Bio..'
              className="col-span-3 rounded-xl"
              onChange = {inputHandler}
            />
          </div>
        </div>
        <DialogFooter>
          <Button className='rounded-xl bg-white text-black' type="submit" onClick = {submit}>Save changes</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
