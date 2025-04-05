import axios from 'axios';

export const editCodeSumbit = async (language, code, title, note , id , ownerId) => {

    try {

        let token = localStorage.getItem("authToken");

        if (!token) return null;


        const body = {
            language,
            code,
            title,
            note: note || "",
            ownerId

        }

       


        const config = token ? { headers: { Authorization: `goat ${token}` } } : {};

        

        let response = await axios.put(`${import.meta.env.VITE_BACKEND_BASEURL}/api/v1/codebase/${id}`, body, config);

        if (response.data.success) {
            return response.data;
        }

    } catch (error) {
       
        return null;
    }

}