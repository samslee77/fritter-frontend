import type {HydratedDocument, Types} from 'mongoose';
import type {Freet} from './model';
import FreetModel from './model';
import UserCollection from '../user/collection';

/**
 * This files contains a class that has the functionality to explore freets
 * stored in MongoDB, including adding, finding, updating, and deleting freets.
 * Feel free to add additional operations in this file.
 *
 * Note: HydratedDocument<Freet> is the output of the FreetModel() constructor,
 * and contains all the information in Freet. https://mongoosejs.com/docs/typescript.html
 */
class FreetCollection {
  /**
   * Add a freet to the collection
   *
   * @param {string} authorId - The id of the author of the freet
   * @param {string} content - The id of the content of the freet
   * @return {Promise<HydratedDocument<Freet>>} - The newly created freet
   */
  static async addOne(authorId: Types.ObjectId | string, content: string): Promise<HydratedDocument<Freet>> {
    const date = new Date();
    const freet = new FreetModel({
      authorId,
      dateCreated: date,
      content,
      dateModified: date,
      ageRestrictedViewing: false,
      likes: 0,
      dislikes: 0,
      consensusfiltered: false
    });
    await freet.save(); // Saves freet to MongoDB
    return freet.populate('authorId');
  }

  /**
   * Find a freet by freetId
   *
   * @param {string} freetId - The id of the freet to find
   * @return {Promise<HydratedDocument<Freet>> | Promise<null> } - The freet with the given freetId, if any
   */
  static async findOne(freetId: Types.ObjectId | string): Promise<HydratedDocument<Freet>> {
    return FreetModel.findOne({_id: freetId}).populate('authorId');
  }

  /**
   * Get all the freets in the database that the user is allowed to see (if the user is of age, then they can view all freets, but if they are under age, then they can only
   * see non age-restricted freets and age-restricted freets that only they made).
   *
   * @return {Promise<HydratedDocument<Freet>[]>} - An array of all of the freets
   */
  static async findAll(userId: Types.ObjectId | string): Promise<Array<HydratedDocument<Freet>>> {
    // Retrieves freets and sorts them from most to least recent
    const loggedInUser = await UserCollection.findOneByUserId(userId);
    let ret;
    if (loggedInUser && loggedInUser.age !== 'unknown' && parseInt(loggedInUser.age, 10) >= 18) {
      ret = FreetModel.find({consensusfiltered: false}).sort({dateModified: -1}).populate('authorId');
    } else {
      ret = FreetModel.find({$or: [{ageRestrictedViewing: false, consensusfiltered: false}, {authorId: userId, consensusfiltered: false}]}).sort({dateModified: -1}).populate('authorId');
    }

    return ret;
  }

  /**
   * Get all the freets in by the given author that the user is allowed to see (if the user is of age, then they can view all freets, but if they are under age, then they can only
   * see non age-restricted freets).
   *
   * @param {string} username - The username of author of the freets
   * @return {Promise<HydratedDocument<Freet>[]>} - An array of all of the freets
   */
  static async findAllByUsername(username: string, userId: Types.ObjectId | string): Promise<Array<HydratedDocument<Freet>>> {
    const author = await UserCollection.findOneByUsername(username);

    const loggedInUser = await UserCollection.findOneByUserId(userId);
    let ret;
    if (loggedInUser && loggedInUser.age !== 'unknown' && parseInt(loggedInUser.age, 10) >= 18) {
      ret = FreetModel.find({authorId: author._id, consensusfiltered: false}).sort({dateModified: -1}).populate('authorId');
    } else {
      ret = FreetModel.find({authorId: author._id, ageRestrictedViewing: false, consensusfiltered: false}).sort({dateModified: -1}).populate('authorId');
    }

    return ret;
  }

  // /**
  //  * Update a freet with the new content
  //  *
  //  * @param {string} freetId - The id of the freet to be updated
  //  * @param {string} content - The new content of the freet
  //  * @return {Promise<HydratedDocument<Freet>>} - The newly updated freet
  //  */
  // static async updateOne(freetId: Types.ObjectId | string, content: string): Promise<HydratedDocument<Freet>> {
  //   const freet = await FreetModel.findOne({_id: freetId});
  //   freet.content = content;
  //   freet.dateModified = new Date();
  //   await freet.save();
  //   return freet.populate('authorId');
  // }

  /**
   * Delete a freet with given freetId.
   *
   * @param {string} freetId - The freetId of freet to delete
   * @return {Promise<Boolean>} - true if the freet has been deleted, false otherwise
   */
  static async deleteOne(freetId: Types.ObjectId | string): Promise<boolean> {
    const freet = await FreetModel.deleteOne({_id: freetId});
    return freet !== null;
  }

  /**
   * Delete all the freets by the given author
   *
   * @param {string} authorId - The id of author of freets
   */
  static async deleteMany(authorId: Types.ObjectId | string): Promise<void> {
    await FreetModel.deleteMany({authorId});
  }

  /**
   * Make Freet Age Restricted
   *
   * @param {string} freetId - the id of the freet
   */
  static async ageRestrict(freetId: Types.ObjectId | string): Promise<HydratedDocument<Freet>> {
    const freet = await FreetModel.findOne({_id: freetId});
    freet.ageRestrictedViewing = true;
    await freet.save();
    return freet.populate('authorId');
  }
}

export default FreetCollection;
