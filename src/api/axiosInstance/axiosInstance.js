import axios from "axios";
import baseUrl from "../api_url/apiUrl";

const axiosInstance = axios.create({
    baseURL: baseUrl,
    // headers:{
    // }
})

export default axiosInstance;