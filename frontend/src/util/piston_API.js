import axios from 'axios';
import { languageSupport } from './language_support';

const getVersion = (lang) => {
    const language = languageSupport.find((val) => val.language === lang);
    return language ? language.version : null;
}


// const API = axios.create({
//     baseURL: '/api',
// })

const API = axios.create({
    baseURL: 'https://emkc.org/api/v2/piston',
})

export const executeCode = async ( languageValue , inputValue) => {
        console.log("code reaches here 1")
        const response = await API.post("/execute", {
            language: languageValue,
            version: getVersion(languageValue),
            files: [
                {
                    content: inputValue
                }
            ]
        })

        console.log("code reaches here 2")
        console.log(response.data);
        return response.data;
        
    
  
}