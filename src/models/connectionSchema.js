const { Schema, model } = require("mongoose");

const connectionSchema = new Schema(
  {
    fromUserId: {
      type: Schema.Types.ObjectId,
      required: true,
      ref: 'User' // Refers to the User model
    },
    toUserId: {
      type: Schema.Types.ObjectId,
      required: true,
      ref: 'User'
    },
    status: {
      type: String,
      required: true,
      enum: {
        values: ['ignore', 'interested', 'accepted', 'rejected'],
        message: '`{VALUE}` is not a supported status.'
      }
    }
  },
  {
    timestamps: true
  }
);

const ConnectionRequestModel = model('ConnectionRequest', connectionSchema);

module.exports = ConnectionRequestModel;
