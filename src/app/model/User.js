const { Schema, model } = require("mongoose")
const bcrypt = require('bcryptjs')

const userSchema = new Schema({
    name: {
        type: String,
        allowNull: false
    },
    email: {
        type: String,
        allowNull: false,
        unique: true
    },
    password: {
        type: String,
        allowNull: false
    },
    gender: {
        type: String,
        allowNull: false
    },
    birthday: {
        type: Date,
        allowNull: true,
        default: null
    },
    provider: {
        type: Boolean,
        default: false,
        allowNull: false
    },
    phone: {
        type: String,
        default: null,
    },
    status: {
        type: String,
        default: null,
    },
    likes: [{
        type: Schema.Types.ObjectId,
        ref: 'User',
    }],
    dislikes: [{
        type: Schema.Types.ObjectId,
        ref: 'User',
    }],
    s_likes: [{
        type: Schema.Types.ObjectId,
        ref: 'User',
    }],
    id_provider: {
        type: Schema.Types.ObjectId,
        ref: 'Provider',
        default: null,
    },
    id_avatar: {
        type: Schema.Types.ObjectId,
        ref: 'File',
        default: null,
    },
    id_address: {
        type: Schema.Types.ObjectId,
        ref: 'Address',
        default: null,
    },
},
    {
        timestamps: true, //createdAt, updatedAt. Armazena automatico pelo mongoose dt de criação e atualização
    })

// userSchema.pre('save', function(next){
//     // console.log("passando pelo middleware do model user")
//     const user = this //o this se refere ao esquema atual que estou, que seria o userSchema

//     if(!user.isModified('password')){
//         next()
//     }else{
//         bcrypt.hash(user.password, 10)
//         .then( hash => {
//             user.password = hash
//             next()
//         }).catch(next)
//     }

// })
// userSchema.pre('remove', function(next){
//     // console.log("passando pelo middleware do model user")
//     const user = this //o this se refere ao esquema atual que estou, que seria o userSchema
//     console.log(user)
//     this.model('Appointment').update({user: user._id},{$set:{user_Deleted: true}});

//     if(user._id && user.provider === true) {
//         this.model('Appointment').update({user: user._id},{$set:{provider_Deleted: true}});
//     }

//     next();

// })

module.exports = model('User', userSchema)