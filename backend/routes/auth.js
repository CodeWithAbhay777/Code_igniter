import express from 'express';
import passport from 'passport';
import "../middlewares/passport.js";
import jwt from "jsonwebtoken";
import User from "../models/User.js";

const router = express.Router();

router.get('/auth/google', passport.authenticate('google', { scope: ['profile', 'email'] }));

router.get('/auth/google/callback', passport.authenticate('google', { failureRedirect: '/login-failed', session: false }), (req, res) => {

    const token = jwt.sign({
        id: req.user.id
    }, process.env.JWT_SECRET, { expiresIn: '7d' });

    res.redirect(`${process.env.CLIENT_URL}/room/${req.query.state}?token=${token}`);
})

export default router;