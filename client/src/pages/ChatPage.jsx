import MenuBar from "@/components/Feed/MenuBar"

import UpcomingUpdates from "@/components/Feed/UpcomingUpdates";
import { useMediaQuery } from "react-responsive";
import ChatApp from "@/components/chat/Chat";
import Navbar from "@/components/navForMobile/Navbar";
import Footer from "@/components/navForMobile/Footer";

const ChatPage = () => {
    const isMobile = useMediaQuery({ query: '(max-width: 768px)' })
    console.log(isMobile);
    return (
        <div>
            {
                isMobile ? <div>
                    <Navbar/>
                    <ChatApp/>
                    <Footer/>
                    </div>
                :   <ChatApp />
            }
        </div>
    )
}

export default ChatPage
