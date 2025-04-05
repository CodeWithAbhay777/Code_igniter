import jwt from "jsonwebtoken";

const authMiddleware = (req,res,next) => {
    try {

        const authHeader = req.headers.authorization;

        if (!authHeader || !authHeader.startsWith('goat ')){
            return res.status(403).json({msg : "Not authorized"});
        }

        const token = authHeader.split(' ')[1];

        const decoded = jwt.verify(token , process.env.JWT_SECRET );

        if (decoded.id) {
            req.userId = decoded.id;
            next();
        }
        else {
            return res.status(403).json({msg : "Not authorized"});
        }
        
    } catch (error) {
        
        return res.status(403).json({msg : "Not authorized"});
        
    }
}


export default authMiddleware;