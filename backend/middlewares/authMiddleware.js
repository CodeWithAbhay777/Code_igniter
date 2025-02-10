import jwt from "jsonwebtoken";

const authMiddleware = (req,res,next) => {
    try {

        const authHeader = req.headers.authorization;

        if (!authHeader || !authHeader.startsWith('goat ')){
            return res.status(403).json({msg : "Not authorized"});
        }

        const token = authHeader.split(' ')[1];

        const decoded = jwt.verify(token , process.env.JWT_SECRET );

        if (decoded.userId) {
            req.userId = decoded.userId;
            next();
        }
        else {
            return res.status(403).json({msg : "Not authorized"});
        }
        
    } catch (error) {
        console.log(error.message);
        return res.status(403).json({msg : "Not authorized"});
        
    }
}


export default authMiddleware;