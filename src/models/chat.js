import mongoose from "mongoose";
import {Schema} from "mongoose"

const ChatSchema = new Schema({
    nick: String,
    msg: String,
    created_at: {
        type: Date,
        default: Date.now
    }
})
export default  mongoose.model('Chat', ChatSchema)