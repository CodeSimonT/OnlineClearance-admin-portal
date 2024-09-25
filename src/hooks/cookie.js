import { create } from 'zustand';
import Cookies from 'js-cookie';

const cookie = create((set)=>({
    departmentID:null,
    token:null,

    setCookie: (departmentID, token)=>{
        // Save the user ID and token as cookies with an expiration time
        Cookies.set('departmentID', departmentID, {expires: 7});
        Cookies.set('token', token, {expires: 7})
    },

    getCookie: ()=>{
        set({
            departmentID:Cookies.get('departmentID'),
            token:Cookies.get('token')
        })
    },

    clearCookie:()=>{
        Cookies.remove('token');
        Cookies.remove('departmentID');

        set({
            departmentID:null,
            token:null
        })
    }
}));

export default cookie;