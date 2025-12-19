
import express from "express";
import OpenAI from "openai";
import { assistantLimit } from "../middlewares/ratelimiting.js";



const router = express.Router();
const secretKey = process.env.OPENAI_API_KEY; 
let messages = [];

const openai = new OpenAI ({
  apiKey : secretKey,
});

router.post('/assistant' , assistantLimit ,async (req , res) => {
    let {task} = req.body;
    
    messages.push({ "role": "user", "content": `${task}` });

    try {

        let response = await openai.chat.completions.create({
            model: 'gpt-3.5-turbo',
      
            messages: messages,
      
          });

          if (response) {
            let reply = response.choices[0].message.content;
            
            res.status(200).json({success : true , msg : reply});
          }
          else {
            res.status(404).json({success : false , msg : "Data not found"});
          }

    }catch (error) {
        
        res.status(500).send({success : false , msg : "Something went wrong!"});
    }
})



export default router;