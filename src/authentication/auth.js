import { jwtDecode } from "jwt-decode";
import Cookies from 'js-cookie';

export const authenticate = () => {
      // Check if userId and userToken cookies exist
        const depertmentID = Cookies.get('departmentID');
        const departmentToken = Cookies.get('token');

        if (!depertmentID || !departmentToken) {
            // userId or departmentToken is missing, user is not authenticated
            return false;
        }

        try {
            const decodedToken = jwtDecode(departmentToken); // You'll need to import jwt_decode or use your preferred library
            const currentTime = Date.now() / 1000; // Convert current time to seconds
    
            // Check if the token's expiration time is in the future
            return decodedToken.exp > currentTime;
        } catch (error) {
            // Token decoding error or invalid token
            return false;
        }
};