import type {HydratedDocument} from 'mongoose';
import moment from 'moment';
import type {Follow, PopulatedFollow} from '../follow/model';
import UserCollection from '../user/collection';

type FollowResponse = {
  _id: string;
  follower: string;
  following: string;
};

/**
 *
 *
 * @param {HydratedDocument<Follow>} follow - A follow map for a user
 * @returns {FollowResponse} - The follow object formatted for the frontend
 */
const constructFollowResponse = (follow: HydratedDocument<Follow>): FollowResponse => {
  const followCopy: PopulatedFollow = {
    ...follow.toObject({
      versionKey: false // Cosmetics; prevents returning of __v property
    })
  };

  return {
    ...followCopy,
    _id: followCopy._id.toString(),
    follower: followCopy.follower.username,
    following: followCopy.following.username
  };
};

export {
  constructFollowResponse
};
