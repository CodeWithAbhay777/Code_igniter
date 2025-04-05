import axios from 'axios';
import { languageSupport } from './language_support';

const getVersion = (lang) => {
    const language = languageSupport.find((val) => val.language === lang);
    return language ? language.version : null;
}


const API = axios.create({
    baseURL: 'https://emkc.org/api/v2/piston',
})

export const executeCode = async ( languageValue , inputValue) => {
       
        const response = await API.post("/execute", {
            language: languageValue,
            version: getVersion(languageValue),
            files: [
                {
                    content: inputValue
                }
            ]
        })

       
        return response.data;
        
    
  
}