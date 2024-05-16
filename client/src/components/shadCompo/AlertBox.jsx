import React, { useState } from 'react'
import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
    AlertDialogTrigger,
  } from "@/components/ui/alert-dialog"
import { useDispatch } from 'react-redux'
import { deletePost } from '@/redux/postSlice'
import { deleteUser } from '@/redux/authSlice'
import { useNavigate } from 'react-router-dom'
  
function AlertBox({warning,open,resFunc,id}) {
  
    const [show,setShow] = useState(open)
    const dispatch = useDispatch()
    const navigate = useNavigate()


    const deleteAPost = async() =>{
      await dispatch(deletePost(id))
      window.history.go(-1)
    }

    const deleteCurrentuser = async() =>{
      await dispatch(deleteUser())
      navigate('/login')
    }
  return (
    <div>
        <AlertDialog open={show}>
            
            <AlertDialogContent className='bg-black w-[90vw] rounded-xl'>
                <AlertDialogHeader>
                <AlertDialogTitle className={'text-white'}>Are you absolutely sure?</AlertDialogTitle>
                <AlertDialogDescription className='text-gray-400'>
                    This action cannot be undone. This will permanently delete your {warning } 
                     and remove your {warning}'s data from our servers.
                </AlertDialogDescription>
                </AlertDialogHeader> 
                <AlertDialogFooter>
                <AlertDialogCancel className='bg-slate-800  text-gray-400' id='cancel'>Cancel</AlertDialogCancel>
                <AlertDialogAction className='bg-slate-800 text-red-400 border border-red-400' id='delete' onClick={warning == 'post ' ? deleteAPost : deleteCurrentuser}>Delete</AlertDialogAction>
                </AlertDialogFooter>
            </AlertDialogContent>
        </AlertDialog>

    </div>
  )
}

export default AlertBox