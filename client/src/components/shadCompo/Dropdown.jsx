import {
    Cloud,
    CreditCard,
    Github,
    Keyboard,
    LifeBuoy,
    LogOut,
    Mail,
    MessageSquare,
    Plus,
    PlusCircle,
    Settings,
    User,
    UserPlus,
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
import { useDispatch } from "react-redux";
import { logout } from "@/redux/authSlice";
import { Link, useNavigate } from "react-router-dom";
import { DialogDemo } from "./Dialog";
import { useState } from "react";
  
  export function DropdownMenuDemo() {
    const dispatch = useDispatch()
    const navigate = useNavigate()
    const [edit,setEdit] = useState(false)
    const sentResponse = (res) => {
        setEdit(res)
    }
    console.log(edit);
    const logoutUser = async() => {
        await dispatch(logout())
        navigate('/')
    }
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
                <DropdownMenuShortcut>⇧⌘P</DropdownMenuShortcut>
                </DropdownMenuItem>
                <DropdownMenuItem id='billing' onClick = {sentResponse}>
                <CreditCard className="mr-2 h-4 w-4" />
                <span>Billing</span>
                <DropdownMenuShortcut>⌘B</DropdownMenuShortcut>
                </DropdownMenuItem>
                <DropdownMenuItem>
                <Settings className="mr-2 h-4 w-4" />
                <span>Settings</span>
                <DropdownMenuShortcut>⌘S</DropdownMenuShortcut>
                </DropdownMenuItem>
                <Link to={`/hiddenpost`}>
                    <DropdownMenuItem >
                    <Keyboard className="mr-2 h-4 w-4" />
                    <span>Hidden Posts</span>
                    <DropdownMenuShortcut>⌘H</DropdownMenuShortcut>
                    </DropdownMenuItem>
                </Link>
            </DropdownMenuGroup>
            <DropdownMenuSeparator />
            <DropdownMenuGroup>
                <DropdownMenuItem>
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
                <DropdownMenuItem>
                <Plus className="mr-2 h-4 w-4" />
                <span>New Community</span>
                <DropdownMenuShortcut>⌘+T</DropdownMenuShortcut>
                </DropdownMenuItem>
            </DropdownMenuGroup>
            <DropdownMenuSeparator />
            <DropdownMenuItem>
                <Settings className="mr-2 h-4 w-4" />
                <span>Settings</span>
                <DropdownMenuShortcut>⌘S</DropdownMenuShortcut>
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
                <DropdownMenuShortcut>⇧⌘Q</DropdownMenuShortcut>
            </DropdownMenuItem>
            </DropdownMenuContent>
        </DropdownMenu>
        {edit && <DialogDemo open={true} res = {sentResponse}/>}
      </>
    )
  }
  