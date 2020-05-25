const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const userSchema = new Schema({
    email :{
        type:String,
        trim: true,
        required:true,
        unique: true
    },
    password :{
        type:String,
        trim: true,
        required:true
    },
    createdEvents:[
        {
            type:Schema.Types.ObjectId,
            ref:'Event'
        }
    ]
});

module.exports = mongoose.model('User',userSchema);