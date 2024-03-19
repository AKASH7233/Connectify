import { Link } from "react-router-dom"

const Home = () => {
    return (
        <div className="flex flex-col items-center justify-center h-screen space-y-4 bg-gray-800 text-white"> 
                <h1 className="text-3xl">Welcome to Our Website</h1> 
                <p>This is our amazing home page. Feel free to explore!</p>
                <Link to='/register' className="text-blue-500 hover:text-blue-700">Register</Link>
                <Link to='/login' className="text-blue-500 hover:text-blue-700">Login</Link>
        </div>
    )
}

export default Home