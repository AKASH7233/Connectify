import {
    BookmarkCheck,
    Cloud,
    CreditCard,
    Forward,
    Keyboard,
    LifeBuoy,
    LogOut,
    Plus,
    Settings,
    Trash2,
    User,
    Users,
  } from "lucide-react"
  
  import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuGroup,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuPortal,
    DropdownMenuSeparator,
    DropdownMenuShortcut,
    DropdownMenuSub,
    DropdownMenuSubContent,
    DropdownMenuSubTrigger,
    DropdownMenuTrigger,
  } from "@/components/ui/dropdown-menu"

import { BsThreeDotsVertical } from "react-icons/bs";
import { useDispatch, useSelector } from "react-redux";
import { logout } from "@/redux/authSlice";
import { Link, useNavigate } from "react-router-dom";
import { DialogDemo } from "./Dialog";
import { useState } from "react";
import { DialogCloseButton } from "./Share";
import AlertBox from "./AlertBox";
import Cookies from "js-cookie";
  
  export function DropdownMenuDemo({user}) {
    const dispatch = useDispatch()
    const navigate = useNavigate()
    const [edit,setEdit] = useState(false)
    const sentResponse = (res) => {
        setEdit(res)
    }
    console.log(edit);
    const logoutUser = async() => {
        Cookies.remove('isLoggedIn',{
            expires: 1,
            secure: true,
            sameSite : 'None'
        });
        await dispatch(logout())
        navigate('/login')
    }

    const shareLink = `https://connectify-omega.vercel.app/user/${user?._id}`
    const title = user?.username

    // console.log(shareLink,title);

    const [view,setView] = useState(false)
    const res = (e) => {
        setView(e)
    }
    
    document.addEventListener('keydown', function(event) {
        console.log(event.keyCode);
        if (event.altKey) {
            switch (event.keyCode) {
                case 78: // Alt + P
                    // console.log('Alt + P was pressed!')
                    setEdit(true)
                    break;
                case 83: // Alt + S
                    console.log('Alt + S was pressed!')
                    break;
                case 72: // Alt + H
                    console.log('Alt + H was pressed!')
                    navigate('/hiddenpost')
                    break;
                case 84: // Alt + T
                    console.log('Alt + T was pressed!')
                    break;
                case 81: // Alt + Q
                    console.log('Alt + Q was pressed!')
                    logoutUser()
                    break;
                case 68: // Alt + D
                    console.log('Alt + D was pressed!')
                    setView(true)
                    break;
                default:
                    break;
            }
        }
    });
    
    

    return (
      <>
        <DropdownMenu>
            <DropdownMenuTrigger>
            <button className='p-2 rounded-[50%] bg-gray-900 bg-opacity-90 border-2 border-gray-700'><BsThreeDotsVertical/></button>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="w-56 bg-[#09090B] -my-12 mx-2 text-white ">
            <DropdownMenuLabel>My Account</DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuGroup >
                <DropdownMenuItem id='edit' onClick = {()=>{setEdit(true)}}>
                <User className="mr-2 h-4 w-4" />
                <span>Edit Profile</span>
                <DropdownMenuShortcut>ALT+P</DropdownMenuShortcut>
                </DropdownMenuItem>
                <Link to={`/bookedpost`}>
                    <DropdownMenuItem >
                    <BookmarkCheck className="mr-2 h-4 w-4" />
                    <span>Bookmark Posts</span>
                    <DropdownMenuShortcut>ALT+ B</DropdownMenuShortcut>
                    </DropdownMenuItem>
                </Link>
                <h1 className="flex items-center justify-between px-2 ">
                {/* <Forward className="mr-2 h-4 w-4" /> */}
                <span><DialogCloseButton  className = 'text-sm gap-x-0 -ml-5 ' shareLink={shareLink} title={title} drawer={true}/></span>
                <span className="text-gray-400 text-sm">ALT+ S</span>
                </h1>
                <Link to={`/hiddenpost`}>
                    <DropdownMenuItem >
                    <Keyboard className="mr-2 h-4 w-4" />
                    <span>Hidden Posts</span>
                    <DropdownMenuShortcut>ALT+ H</DropdownMenuShortcut>
                    </DropdownMenuItem>
                </Link>
            </DropdownMenuGroup>
            <DropdownMenuSeparator />
            <DropdownMenuGroup>
                <DropdownMenuItem disabled>
                <Users className="mr-2 h-4 w-4" />
                <span>Communities</span>
                </DropdownMenuItem>
                {/* <DropdownMenuSub>
                <DropdownMenuSubTrigger>
                    <UserPlus className="mr-2 h-4 w-4" />
                    <span>Invite users</span>
                </DropdownMenuSubTrigger>
                <DropdownMenuPortal>
                    <DropdownMenuSubContent>
                    <DropdownMenuItem>
                        <Mail className="mr-2 h-4 w-4" />
                        <span>Email</span>
                    </DropdownMenuItem>
                    <DropdownMenuItem>
                        <MessageSquare className="mr-2 h-4 w-4" />
                        <span>Message</span>
                    </DropdownMenuItem>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem>
                        <PlusCircle className="mr-2 h-4 w-4" />
                        <span>More...</span>
                    </DropdownMenuItem>
                    </DropdownMenuSubContent>
                </DropdownMenuPortal>
                </DropdownMenuSub> */}
                <DropdownMenuItem disabled>
                <Plus className="mr-2 h-4 w-4" />
                <span>New Community</span>
                <DropdownMenuShortcut>ALT+ T</DropdownMenuShortcut>
                </DropdownMenuItem>
            </DropdownMenuGroup>
            <DropdownMenuSeparator />
            <DropdownMenuItem>
                <Settings className="mr-2 h-4 w-4" />
                <span>Settings</span>
                <DropdownMenuShortcut>ALT+ J</DropdownMenuShortcut>
                </DropdownMenuItem>
            <DropdownMenuItem>
                <LifeBuoy className="mr-2 h-4 w-4" />
                <span>Support</span>
            </DropdownMenuItem>
            <DropdownMenuItem disabled>
                <Cloud className="mr-2 h-4 w-4" />
                <span>API</span>
            </DropdownMenuItem>
            <DropdownMenuSeparator/>
            <DropdownMenuItem onClick = {logoutUser}>
                <LogOut className="mr-2 h-4 w-4" />
                <span>Log out</span>
                <DropdownMenuShortcut>ALT+ Q</DropdownMenuShortcut>
            </DropdownMenuItem>
            <DropdownMenuSeparator/>
            <DropdownMenuItem className='text-red-400 font-bold ' onClick={()=>{setView(true)}}>
                <Trash2 className='h-5 w-5 mr-2'/>
                <span>Delete Account</span>
                <DropdownMenuShortcut>ALT+ D</DropdownMenuShortcut>
            </DropdownMenuItem>
            </DropdownMenuContent>
        </DropdownMenu>
        {view && <AlertBox open={true} warning={'account '} resFunc={res}/> }
        {edit && <DialogDemo open={true} res = {sentResponse}/>}
      </>
    )
  }
  