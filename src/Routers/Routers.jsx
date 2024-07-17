
import React from 'react'
import { Route, Routes } from 'react-router-dom'
import { CustomerRoute} from './CustomerRoute'
import LoginForm from '../component/Auth/LoginForm'
import { useSelector } from 'react-redux'
import Home from '../component/Home/Home'
import { ManagerRoute } from './ManagerRoute'
import { AdminRoute } from './AdminRoute'



const Routers = () => {
    const { auth } = useSelector((store) => store);
    return (
        <Routes>
            <Route path="/*" element={ auth.user ? <CustomerRoute /> :<LoginForm/>} />
            <Route path="/manager/jewelry/*" element={<ManagerRoute />} />
            <Route path="/admin/jewelry/*" element={<AdminRoute/>} />
        </Routes>
    )
}
export default Routers