import './App.css'

import { BrowserRouter, Route, Routes } from 'react-router-dom'

import RequireAuth from './components/auth/RequireAuth'
import UpdateProfile from './components/Profile/UpdateProfile'
import BookedPostPage from './pages/Bookmarked'
import Chat from './components/chat/Chat'
import CommentRepliesPage from './pages/CommentRepliesPage'
import FollowPage from './pages/FollowPage'
import HiddenPostPage from './pages/HiddenPostPage'
import Home from './pages/Home'
import LikedByPage from './pages/LikesPage'
import Login from './pages/Login'
import MyAccount from './pages/MyAccount'
import NotFound from './pages/NotFound404'
import Register from './pages/Register'
import SearchPage from './pages/SearchPage'
import UploadBlinkPage from './pages/UploadBlink'
import UploadPage from './pages/UploadPage'
import UserAccount from './pages/UserAccount'
import VisitedPostPage from './pages/VistiedPost'
import DataFetch from './utils/DataFetch'

function App() {

  return (
    <div className=''>
      <BrowserRouter>
        <Routes>
          <Route path='/register' element = {<Register/>} />
          <Route path='/login' element = {<Login/>} />

          <Route element={<RequireAuth />} >
            <Route path='/' element={<Home />} />
            <Route path='/user/:userId' element={<UserAccount />} />
            <Route path='/myProfile' element={<MyAccount />} />
            <Route path='/uploadPost' element={<UploadPage />} />
            <Route path='/test' element={<DataFetch />} />
            <Route path='/search' element={<SearchPage />} />

            <Route path='/editprofile' element={<UpdateProfile />} />

            <Route path='/followlist/:type/:userId' element={<FollowPage />} />

            <Route path='/chat' element={<Chat />} />
            <Route path='/viewpost/:postId/:type' element={<VisitedPostPage />} />
            <Route path='viewreplies/:commentId' element={<CommentRepliesPage />} />
            <Route path='/likes/:postId' element={<LikedByPage />} />
            <Route path='/hiddenpost' element={<HiddenPostPage />} />
            <Route path='/uploadBlink' element={<UploadBlinkPage />} />
            <Route path='/bookedpost' element={<BookedPostPage />} />
          </Route>
          <Route path='*' element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </div>
  )
}


export default App
