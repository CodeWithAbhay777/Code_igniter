import axios from 'axios';

export const saveCode = async (language, code, title, note) => {

    try {

        let token = localStorage.getItem("authToken");

        if (!token) return null;


        const body = {
            language,
            code,
            title,
            note: note || "",
        }



       


        const config = token ? { headers: { Authorization: `goat ${token}` } } : {};

        

        let response = await axios.post(`${import.meta.env.VITE_BACKEND_BASEURL}/api/v1/codebase`, body, config);

        if (response.data.success) {
            return response.data;
        }

    } catch (error) {
        
        return null;
    }

}