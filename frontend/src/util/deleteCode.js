import axios from "axios";

export async function deleteCode(id) {

    try {

        let token = localStorage.getItem("authToken");

        if (!token) return null;

      console.log(id)

        const response = await axios.delete(`http://localhost:3000/api/v1/codebase/${id}`, {
            
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
        // toast.error("Error : Try it later");
    }

}