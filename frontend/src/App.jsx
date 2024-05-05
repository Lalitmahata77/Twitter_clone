import { Navigate, Route, Routes } from "react-router-dom"
import SignupPage from "./pages/auth/signup/SignupPage"
import LoginPage from "./pages/auth/login/LoginPage"
import HomePage from "./pages/home/HomePage"
import Sidebar from "./components/common/Sidebar"
import RightPanel from "./components/common/RightPanel"
import NotificationPage from "./pages/notification/NotificationPage"
import ProfilePage from "./pages/profile/ProfilePage"
import {Toaster} from "react-hot-toast"
import LoadingSpinner from "./components/common/LoadingSpinner"
import { useQuery } from "@tanstack/react-query"
function App() {
const {data : authUser,isLoading} = useQuery({
  //we use querykey to give a unique name to our query and refer to it later
  queryKey : ["authUser"],
  queryFn : async() =>{
    try {
const res = await fetch("/api/auth/me");
const data = await res.json();
if(data.error) return null;
if(!res.ok) throw new Error(data.error || "something went wrong")
  return data
    } catch (error) {
      throw new Error(error)
    }
  },
  retry :false
})
if (isLoading) {
  return (
    <div className='h-screen flex justify-center items-center'>
      <LoadingSpinner size='lg' />
    </div>
  );
}
 
  return (
    <div className="flex max-w-6xl mx-auto">
     {authUser && <Sidebar/>}
      <Routes>
        <Route path="/" element = {authUser ? < HomePage/> : <Navigate to='/login'/>}/>
        <Route path="/signup" element = {!authUser ? < SignupPage/> : <Navigate to='/'/>}/>
        <Route path="/login" element = {!authUser ? <LoginPage/> : <Navigate to='/'/>}/>
        <Route path="/notification" element = {authUser ? <NotificationPage/> : <Navigate to='login'/>}/>
        <Route path="/profile/:username" element = {authUser ? <ProfilePage/> : <Navigate to='/login'/>}/>

      </Routes>
      {authUser && <RightPanel />}
   <Toaster/>
    </div>
  )
}

export default App
