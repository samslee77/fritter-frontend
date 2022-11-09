import type {HydratedDocument, Types} from 'mongoose';
import type {Follow} from './model';
import FollowModel from './model';
import UserCollection from '../user/collection';
import type {User} from '../user/model';

/**
 * This files contains a class that has the functionality to explore Followers
 * stored in MongoDB, including adding, finding, and deleting followers.
 *
 * Note: HydratedDocument<Follow> is the output of the FollowModel() constructor,
 * and contains all the information in Follow. https://mongoosejs.com/docs/typescript.html
 */
class FollowCollection {
  /**
   * Add a follow to the collection
   *
   */
  static async addFollow(follower: Types.ObjectId | string, following: Types.ObjectId | string): Promise<HydratedDocument<Follow>> {
    const follow = new FollowModel({follower, following});
    await follow.save();
    return follow.populate(['follower', 'following']);
  }

  /**
   * Remove a follow from the collection
   *
   */
  static async removeFollow(follower: Types.ObjectId | string, following: Types.ObjectId | string): Promise<void> {
    const follow = await FollowModel.deleteOne({follower, following});
  }

  /**
   * When a user deletes their account, remove all the follow relationships including that user
   *
   */
  static async removeAllFollowsWithUser(user: Types.ObjectId | string): Promise<void> {
    const delete1 = await FollowModel.deleteMany({follower: user});
    const delete2 = await FollowModel.deleteMany({following: user});
  }

  /**
   * Check if a follow relationship between follower and following exists, used for throwing errors
   *
   */
  static async viewFollow(follower: Types.ObjectId | string, following: Types.ObjectId | string): Promise<HydratedDocument<Follow>> {
    const follow = await FollowModel.findOne({follower, following});
    return follow;
  }

  /**
   * See all the logged in user's current followers
   *
   */
  static async viewAllFollowers(following: Types.ObjectId | string): Promise<Array<HydratedDocument<Follow>>> {
    const followers = await FollowModel.find({following: following}).populate(['follower', 'following']);
    return followers;
  }

  /**
   * See all the users that the logged in user is following
   *
   */
  static async viewAllFollowing(follower: Types.ObjectId | string): Promise<Array<HydratedDocument<Follow>>> {
    const followings = await FollowModel.find({follower: follower}).populate(['follower', 'following']);
    return followings;
  }
}

export default FollowCollection;
