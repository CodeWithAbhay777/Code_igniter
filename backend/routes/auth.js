import express from 'express';
const router = express.Router();

router.get("/login/failed" , (req,res) => {
    res.status(401).json({
        success :false,
        msg : "Sign in failure",
    })
});



router.get(
    "/google/callback",
    passport.authenticate("google" , {
        successRedirect: process.env.CLIENT_URL,
        failureRedirect: "/login/failed",

    })
);


