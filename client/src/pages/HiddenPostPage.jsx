import MenuBar from "@/components/Feed/MenuBar"
import UpcomingUpdates from "@/components/Feed/UpcomingUpdates";
import { useMediaQuery } from "react-responsive";
import HiddenPost from "@/components/Post/post/HiddenPost";
import Navbar from "@/components/navForMobile/Navbar";
import Footer from "@/components/navForMobile/Footer";

const HiddenPostPage = () => {
    const isMobile = useMediaQuery({ query: '(max-width: 768px)' })
    return (
        <div className="h-[100vh]">
            {
                !isMobile && 
                <div className="flex gap-x-3 relative lg:px-40 md:px-3 bg-gray-800 overflow-x-hidden text-white"> 
                    <div className=" lg:w-[20vw] lg:block xl:block md:block fixed md:w-[30vw] sm:w-[10vw] hidden"><MenuBar/></div>
                    <div className="lg:w-[20vw] md:w-[30vw] sm:w-[10vw]"></div>
                    <div className="lg:w-[30vw] md:w-[45vw]"><HiddenPost/></div>
                    <div className="  relative">
                        <div className="w-[20vw] z-40 hidden md:fixed md:block lg:fixed lg:block"><UpcomingUpdates/></div>
                    </div>
                </div>
            }
            {
                isMobile &&
                <div>
                    <Navbar/>
                    <HiddenPost/>
                    <Footer/>
                </div>
            }
        </div>
    )
}

export default HiddenPostPage