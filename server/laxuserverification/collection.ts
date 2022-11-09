import type {HydratedDocument, Types} from 'mongoose';
import type {Verification} from './model';
import VerificationModel from './model';
import UserCollection from '../user/collection';
import type {User} from '../user/model';

class VerificationCollection {
  /**
   * Update user's verification status (User has verified him/herself), also creates a new verification object and returns it
   *
   */
  static async updateOne(userId: Types.ObjectId | string, name: string, age: string): Promise<HydratedDocument<User>> {
    const verification = new VerificationModel({user: userId, verified: true, name: name, age: age});
    await verification.save();
    const user = await UserCollection.findOneByUserId(userId);
    user.verified = true;
    user.age = age;
    user.name = name;
    await user.save();
    return user;
  }

  /**
   * See the verification status of the user with username
   *
   */
  static async seeOne(username: string): Promise<HydratedDocument<Verification>> {
    const user = await UserCollection.findOneByUsername(username);
    const verification = new VerificationModel({verified: user.verified, name: user.name, age: user.age});
    return verification;
  }

  /**
   * Removes the verification of user with userId
   *
   */
  static async removeOne(userId: Types.ObjectId | string): Promise<void> {
    await VerificationModel.deleteOne({user: userId});
  }
}

export default VerificationCollection;
