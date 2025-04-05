import axios from "axios";

export async function deleteCode(id) {

    try {

        let token = localStorage.getItem("authToken");

        if (!token) return null;

      

        const response = await axios.delete(`${import.meta.env.BACKEND_BASEURL}/api/v1/codebase/${id}`, {
            
            headers: { Authorization: `goat ${token}` }
        });

        if (response && response.data.success) {
            
            return response.data;

        }
        else {
            return null;
        }

        
    } catch (error) {
      
        return null;
    }

}