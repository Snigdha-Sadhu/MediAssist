import mongoose from "mongoose";
const EmergencySchema=new mongoose.Schema({
    name:{
        type:String,
        required:true,
    },
    type:{
        type:String,
        enum:["blood","hospital","ambulance","pharmacy"],
        required:true,
    },
    location:{
        type:{
            type:String,
            enum:["Point"],
            default:"Point"
        },

     coordinates: {
    type:[Number],
    required:true
  },
},
phone:{
    type:String,


},
verified:{
    type:String,
    enum:["open","closed","unknown"],
    default:"unknown"
},
status: {
      type: String,
      enum: ["pending", "approved", "rejected"],
      default: "pending",
    },
lastUpdated:{
    type:Date,
    default:Date.now,
},



},
{timestamps:true});

EmergencySchema.index({location:"2dsphere"});

export default mongoose.model(
    "Emergency",EmergencySchema
);