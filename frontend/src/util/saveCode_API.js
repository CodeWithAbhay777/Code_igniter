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



        console.log("body ",body)


        const config = token ? { headers: { Authorization: `goat ${token}` } } : {};

        console.log(config);

        let response = await axios.post("http://localhost:3000/api/v1/codebase", body, config);

        if (response.data.success) {
            return response.data;
        }

    } catch (error) {
        console.log(error.message);
        return null;
    }

}