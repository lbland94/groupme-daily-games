import mongoose from 'mongoose';

/**
 * @swagger
 *
 * components:
 *   schemas:
 *     Game:
 *       type: object
 *       properties:
 *         name:
 *           type: string
 *         regex:
 *           type: string
 *         regexGroupNames:
 *           type: array
 *           items:
 *             type: string
 *         url:
 *           type: string
 */
export interface IScore extends mongoose.Document {
  name: string;
  regex: string;
  regexGroupNames: string[];
  url: string;
}

export interface IScoreJson {
  name: string;
  regex: string;
  regexGroupNames: string[];
  url: string;
  _id: string;
}

export const ScoreSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },
    regex: {
      type: String,
      required: true,
    },
    regexGroupNames: {
      type: Array,
      default: [],
      required: true,
    },
    url: {
      type: String,
      trim: true,
    },
  },
  {
    timestamps: true,
    useNestedStrict: true,
  },
);

ScoreSchema.set('toJSON', {
  transform(doc, ret, options) {
    delete ret.__v;
    delete ret.createdAt;
    delete ret.updatedAt;
  },
});

export default mongoose.model<IScore>('Score', ScoreSchema);
