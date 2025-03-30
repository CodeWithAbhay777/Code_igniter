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

        console.log("id is ", id);

        console.log("body ",body)


        const config = token ? { headers: { Authorization: `goat ${token}` } } : {};

        console.log(config);

        let response = await axios.put(`http://localhost:3000/api/v1/codebase/${id}`, body, config);

        if (response.data.success) {
            return response.data;
        }

    } catch (error) {
        console.log(error.message);
        return null;
    }

}