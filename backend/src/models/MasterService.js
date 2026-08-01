import mongoose from "mongoose";

const masterServiceSchema = new mongoose.Schema({
    categoryId: { type: mongoose.Schema.Types.ObjectId, ref: 'Category', required: true },
    name: { type: String, required: true },
    description: { type: String }
});

const MasterService = mongoose.model("MasterService", masterServiceSchema)

export default MasterService;