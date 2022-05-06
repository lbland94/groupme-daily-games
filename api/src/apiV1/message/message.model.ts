import mongoose from 'mongoose';

/**
 * @swagger
 *
 * components:
 *   schemas:
 *     Message:
 *       type: object
 *       properties:
 *         username:
 *           type: string
 *         text:
 *           type: string
 *         time:
 *           type: number
 */
export interface IMessage extends mongoose.Document {
  username: string;
  text: string;
  time: number;
}

export interface IMessageJson {
  username: string;
  text: string;
  time: number;
  _id: string;
}

export const MessageSchema = new mongoose.Schema(
  {
    username: {
      type: String,
      required: true,
      trim: true,
    },
    text: {
      type: String,
      required: true,
    },
    time: {
      type: Date,
      required: true,
    },
  },
  {
    timestamps: true,
    useNestedStrict: true,
  },
);

MessageSchema.set('toJSON', {
  transform(doc, ret, options) {
    delete ret.__v;
    delete ret.createdAt;
    delete ret.updatedAt;
  },
});

export default mongoose.model<IMessage>('Message', MessageSchema);
