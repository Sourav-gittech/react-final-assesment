import { Navigate, Outlet } from "react-router-dom";
import { endPoint_User } from "../api/api_url/apiUrl";
import axiosInstance from "../api/axiosInstance/axiosInstance";
import { useEffect, useState } from "react";

// Fetch All User 
const getAllUser = async () => {
    try {
        const res = await axiosInstance.get(endPoint_User);
        if (res.status === 200) {
            return res.data;
        } else {
            Swal.fire("Oops...", "Something went wrong!", "error");
            return [];
        }
    }
    catch (err) {
        console.log(err);
        return [];
    }
}

// Fetch logged user id
const fetchLoggedUser = async () => {
    try {
        const allUser = await getAllUser();
        const token = (sessionStorage.getItem("access-token") || "").trim();

        const findLoggedUser = allUser.find(user => user.token === token);
        // console.log("Logged user ", findLoggedUser);

        return findLoggedUser ? findLoggedUser.user_type : null;
    }
    catch (err) {
        console.log(err);
        return null;
    }
}

const AdminPRoutes = () => {
    const [loading, setLoading] = useState(true);
    const [isAdmin, setIsAdmin] = useState(false);

    useEffect(() => {
        const checkUser = async () => {
            const userType = await fetchLoggedUser();
            setIsAdmin(userType === "admin");
            setLoading(false);
        };
        checkUser();
    }, []);

    if (loading) {
        return <div>Loading...</div>;
    }

    return isAdmin ? <Outlet /> : <Navigate to="/go_admin_login" />
}

const UserPRoutes = () => {
    const token = window.sessionStorage.getItem('access-token');
    // console.log('Token ', token);

    return token ? <Outlet /> : <Navigate to={'/go_login'} />
}

const ProtectRegisterRoutes = ()=>{
    const token = window.sessionStorage.getItem('access-token');
    // console.log('Token ', token);

    const [loading, setLoading] = useState(true);
    const [isAdmin, setIsAdmin] = useState(false);

    useEffect(() => {
        const checkUser = async () => {
            const userType = await fetchLoggedUser();
            setIsAdmin(userType === "admin");
            setLoading(false);
        };
        checkUser();
    }, []);

    if (loading) {
        return <div>Loading...</div>;
    }

    return isAdmin || !token ? <Outlet /> : <Navigate to={'/stop_login'} />
} 

const ProtectLoginRoutes = ()=>{
    const token = window.sessionStorage.getItem('access-token');
    // console.log('Token ', token);

    return !token ? <Outlet /> : <Navigate to={'/stop_login'} />
} 

export { UserPRoutes, AdminPRoutes,ProtectRegisterRoutes,ProtectLoginRoutes };