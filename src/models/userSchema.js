const mongoose = require('mongoose')
const jwt=require('jsonwebtoken')

const { Schema } = mongoose;

const userSchema = new Schema({
    firstName: {
        type: String,
        required: true,
        minlength: [4, `too small name ?`]
    },
    lastName: {
        type: String
    },
    emailId: {
        type: String,
        lowercase: true,
        required: true,
        unique: [true, `eamial already ind bere try aak`],
        index: true,
        trim: true
    },
    password: {
        type: String,
        required: true,
    },
    age: {
        type: Number,
        min: 18
    },
    photoUrl: {
        type: String,
        default: "https://randomuser.me/api/portraits/women/82.jpg"
    },
    gender: {
        type: String,
        enum: ['male', 'female']


    },
    about: {
        type: String,
        default: "defouatl about section",
        validate: {
            validator: function (v) {
                const bannedWords = ['bolan', 'mandan'];
               return !bannedWords.some(word => v.toLowerCase().includes(word));

            },
            message: props => `${props.value} is contain banned words`
        }

    },
    skills: {
        type: Array,

    }
},{
    timestamps:true
} )


userSchema.methods.jwtsign=function (){
 const user=this
  const token=  jwt.sign({ _id: user._id }, 'secret',{expiresIn:'1d'})
  return token;
}

const User = mongoose.model('User', userSchema)

module.exports = User;