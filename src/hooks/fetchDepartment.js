import axios from "axios"
import Cookies from 'js-cookie';

const fetchDepartment = async()=>{
    const env = import.meta.env;
    const serverURL = env.VITE_REACT_SERVER_URL;

    const departmentID = Cookies.get('departmentID');
    const token = Cookies.get('token');

        if(!departmentID || !token){
            throw new Error;
        }

        const {data} = await axios.get(`${serverURL}/osc/api/get/single/department?id=${departmentID}`,{
            headers:{
                Authorization:token
            }
        })

        return data;
}
export default fetchDepartment