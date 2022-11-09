import type {HydratedDocument, Types} from 'mongoose';
import type {Reaction} from './model';
import ReactionModel from './model';

class ReactionCollection {
  /**
   *
   * Check if the user with user Id has reacted to a freet, needed for the middleware to ensure that a user doesn't react multiple times
   *
   */
  static async findReaction(freetId: Types.ObjectId | string, userId: Types.ObjectId | string): Promise<HydratedDocument<Reaction>> {
    return ReactionModel.findOne({user: userId, freet: freetId});
  }

  static async addLike(freetId: Types.ObjectId | string, userId: Types.ObjectId | string): Promise<HydratedDocument<Reaction>> {
    const like = new ReactionModel({user: userId, freet: freetId, liked: true});
    await like.save(); // Saves freet to MongoDB
    return like.populate(['freet', 'user']);
  }

  static async addDislike(freetId: Types.ObjectId | string, userId: Types.ObjectId | string): Promise<HydratedDocument<Reaction>> {
    const dislike = new ReactionModel({user: userId, freet: freetId, liked: false});
    await dislike.save(); // Saves freet to MongoDB
    return dislike.populate(['freet', 'user']);
  }

  static async removeReaction(freetId: Types.ObjectId | string, userId: Types.ObjectId | string): Promise<void> {
    await ReactionModel.deleteOne({userId, freetId});
  }

  static async removeAllReactionsWithUser(userId: Types.ObjectId | string): Promise<void> {
    await ReactionModel.deleteMany({user: userId});
  }

  static async removeAllReactionsWithFreet(freetId: Types.ObjectId | string): Promise<void> {
    await ReactionModel.deleteMany({freet: freetId});
  }
}

export default ReactionCollection;
