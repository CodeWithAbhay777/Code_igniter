import express from "express";
import codebase from '../models/Codebase.js';
import authMiddleware from "../middlewares/authMiddleware.js";

const router = express.Router();

router.get("/", authMiddleware, async (req, res) => {
    try {
        const userID = req.userId;
        if (userID) {
            const codeData = await codebase.find({ ownerId: userID });


            res.status(200).json({
                success: true,
                message: "all code data",
                codeData
            })

        }
        else {
            res.status(400).json({
                success: false,
                message: "Not authorized"
            })
        }

    } catch (error) {
        console.log(error.message);
        res.status(500).json({
            success: false,
            message: "Something went wrong",

        });

    }
});

router.post("/", authMiddleware, async (req, res) => {

    try {

        const newCodebase = new codebase(req.body);
        await newCodebase.save();

        res.status(200).json({
            success: true,
            message: "data saved succesfully",
            newCodebase
        })

    } catch (error) {
        res.status(500).json({
            success: false,
            message: "Something went wrong"
        });
    }



});

router.get("/:id", async (req, res) => {
    try {
        const { id } = req.params;
        const data = await codebase.findById({ id });

        if (data) {
            res.status(200).json({
                success: true,
                message: "successfull response",
                data
            });
        }
        else {
            res.status(404).json({
                success: false,
                message: "no data found",

            })
        }

    } catch (error) {
        console.log(error.message);
        res.status(500).json({
            success: false,
            message: "Something went wrong",

        })

    }

});

router.put("/:id", async (req, res) => {

    try {
        const { id } = req.params;
        const data = await codebase.findById({ id });



        if (data) {

            data = req.body;

            await data.save();

            res.status(200).json({
                success: true,
                message: "updated successfully",
                data
            });
        }
        else {
            res.status(404).json({
                success: false,
                message: "no data found",

            })
        }

    } catch (error) {
        console.log(error.message);
        res.status(500).json({
            success: false,
            message: "Something went wrong",

        })

    }

});

router.delete("/:id", async (req, res) => {
    try {
        const { id } = req.params;
        const data = codebase.findByIdAndDelete({ id });

        if (data) {
            res.status(200).json({
                success: true,
                message: "deleted successfully",
                data
            })

        }
        else {
            res.status(404).json({
                success: false,
                message: "no data found"
            });
        }

    } catch (error) {
        console.log(error.message);
        res.status(500).json({
            success : false,
            message : "Something went wrong"
        });
    }
});



export default router;