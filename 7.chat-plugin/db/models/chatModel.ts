const mongoose = require('mongoose');
const { Schema } = mongoose;

const roomsSchema = new mongoose.Schema(
    {
        name: {
            type: Schema.Types.String,
            trim: true,
            required: true,
            max: 50,
            index: true,
            lowercase: true
        },
        mail: {
            type: Schema.Types.String,
            trim: true,
            required: true,
            max: 70,
            index: true,
            lowercase: true
        },
        roomID: {
            type: Schema.Types.Number,
            required: true,
            index: true,
            lowercase: true
        },
        accountID: {
            type: Schema.Types.Number,
            required: true,
            index: true,
            lowercase: true
        },
        msgs: { 
            type: Schema.Types.Array ,
            default: []
        },
        read: {
            type: Schema.Types.Boolean,
            default: false
        },
        createdAt: { type: Date, default: Date.now },
        updatedAt: { type: Date, default: Date.now },
        deleted: {
            type: Schema.Types.Boolean,default : false,
            required: true,
        },
    },
    { _id:true,timestamps: true,  collection: 'rooms', autoIndex: true  }
);

/**In Mongoose, a virtual is a property that is not stored in MongoDB. Virtual are typically used for computed properties on documents. */

roomsSchema.methods = {  
    UnDelete :function() {
        return this.deleted = false;
    },

    Delete :function() {
        return this.deleted = true;
    }
};


module.exports = mongoose.model('rooms', roomsSchema);
