import { toast } from 'react-toastify';

function ErrorToast(message) {
    toast.error(message, {
        position: "top-right",
        autoClose: 5000,
        pauseOnHover:false,
        hideProgressBar: false,
        closeOnClick: true,
        draggable: true,
        progress: undefined,
        theme: "light",
    });
}

export default ErrorToast