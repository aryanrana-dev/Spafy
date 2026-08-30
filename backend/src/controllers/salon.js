import dotenv from "dotenv";
dotenv.config();
import SalonService from "../models/SalonService.js";

export const fetchSalonService = async (req, res) => {
    try {
        const allServices = await SalonService.find({})
        res.status(200).json(allServices);
    } catch (error) {
        console.log("Error in fetching salon service : ", error.message);
        res.status(500).json({ error: "Failed to fetch salon services" });
    }
}