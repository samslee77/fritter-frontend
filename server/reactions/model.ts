import type {Types} from 'mongoose';
import {Schema, model} from 'mongoose';
import type {Freet} from '../freet/model';
import type {User} from '../user/model';

export type Reaction = {
  _id: Types.ObjectId; // MongoDB assigns each object this ID on creation
  user: Types.ObjectId;
  freet: Types.ObjectId;
  liked: boolean;
};

export type PopulatedReaction = {
  _id: Types.ObjectId; // MongoDB assigns each object this ID on creation
  user: User;
  freet: Freet;
  liked: boolean;
};

const ReactionSchema = new Schema({
  user: {
    type: Schema.Types.ObjectId,
    required: true,
    ref: 'User'
  },
  freet: {
    type: Schema.Types.ObjectId,
    required: true,
    ref: 'Freet'
  },
  liked: {
    type: Boolean,
    required: true
  }
});

const ReactionModel = model<Reaction>('Reaction', ReactionSchema);
export default ReactionModel;
