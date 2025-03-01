import express from 'express';
import passport from 'passport';
import "../middlewares/passport.js";
import jwt from "jsonwebtoken";
import User from "../models/User.js";

const router = express.Router();

router.get('/auth/google', (req, res, next) => {
    // Store username in state parameter along with roomId
    const state = JSON.stringify({
        roomId: req.query.roomId,
        username: req.query.username
    });
    
    // Pass the encoded state to Google
    passport.authenticate('google', { 
        scope: ['profile', 'email'],
        state: Buffer.from(state).toString('base64')
    })(req, res, next);
});

router.get('/auth/google/callback', passport.authenticate('google', { failureRedirect: '/login-failed', session: false }), (req, res) => {

    const token = jwt.sign({
        id: req.user.id
    }, process.env.JWT_SECRET, { expiresIn: '7d' });
    
    const state = JSON.parse(Buffer.from(req.query.state , 'base64').toString());

    res.redirect(`${process.env.CLIENT_URL}/room/${state.roomId}?token=${token}&username=${state.username}`);
})

export default router;