import rateLimit from 'express-rate-limit';

export const assistantLimit = rateLimit({
    windowMs : 60 * 1000,
    limit : 20 , 
    standardHeaders : 'draft-8',
    legacyHeaders: false,
    handler: (req, res, next, options) => res.status(429).json({success : false , message : "Too many requests, please try again later."}),
})