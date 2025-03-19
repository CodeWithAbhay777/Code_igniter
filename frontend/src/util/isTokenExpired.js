
const decodeJWT = (token) => {
    try{
        const base64Url = token.split(".")[1];
        const base64 = base64Url.replace(/-/g , "+").replace(/_/g,"/");
        return JSON.parse(atob(base64));
    }
    catch(err){
        return null;
    }
}

export const isTokenExpired = (token) => {
    const decoded = decodeJWT(token);
    if (!decoded || !decoded.exp) return true;

    const currTime = Math.floor(Date.now() / 1000);
    return decoded.exp < currTime;
}