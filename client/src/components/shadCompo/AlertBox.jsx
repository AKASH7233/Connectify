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
  
function AlertBox({warning,open,resFunc}) {
  
    const [show,setShow] = useState(open)
    
    const sentres = (e) => {
      e.target.id == "cancel" ? resFunc(false) : resFunc(true)
      setShow(false)

    }
  return (
    <div>
        <AlertDialog open={show}>
            
            <AlertDialogContent className='bg-black w-[90vw]'>
                <AlertDialogHeader>
                <AlertDialogTitle className={'text-white'}>Are you absolutely sure?</AlertDialogTitle>
                <AlertDialogDescription className='text-gray-400'>
                    This action cannot be undone. This will permanently delete your {warning } 
                     and remove your {warning}'s data from our servers.
                </AlertDialogDescription>
                </AlertDialogHeader> 
                <AlertDialogFooter>
                <AlertDialogCancel className='bg-slate-800 text-red-400' id='cancel' onClick={sentres}>Cancel</AlertDialogCancel>
                <AlertDialogAction className='bg-slate-800 text-red-400' id='delete' onClick={sentres}>Delete</AlertDialogAction>
                </AlertDialogFooter>
            </AlertDialogContent>
        </AlertDialog>

    </div>
  )
}

export default AlertBox