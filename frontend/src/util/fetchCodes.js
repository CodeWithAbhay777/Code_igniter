import { useEffect } from "react";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import axios from "axios";

const makeApiCall = async (search , currentPage ) => {
    try {

        let token = localStorage.getItem("authToken");

        if (!token) return null;

      

        const response = await axios.get('http://localhost:3000/api/v1/codebase', {
            params: { limit: 10, page: currentPage, search },
            headers: { Authorization: `goat ${token}` }
        });

        if (response && response.data.success) {
            
            return response.data;

        }
        else {
            return null;
        }

        
    } catch (error) {
        console.log(error.message);
        toast.error("Error : Try it later");
    }
} 

export function useFetchCodes(dependencies, delay , search , currentPage , setCodeData, setTotal , setIsLoading) {
   useEffect(() => {

    
    let saveTimeout;
    setIsLoading(true);
    clearTimeout(saveTimeout);

    saveTimeout = setTimeout(async() => {
       
        const data = await makeApiCall(search , currentPage);
        if (data) {
            console.log(data)
            setCodeData(data.codeData);
            setTotal(data.total);
            setIsLoading(false);
        }else{
            setIsLoading(false);
            return
        }
        

    },delay)

   },[...dependencies])
}