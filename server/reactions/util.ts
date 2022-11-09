import type {HydratedDocument} from 'mongoose';
import moment from 'moment';
import type {User} from '../user/model';
import type {Reaction, PopulatedReaction} from './model';

type ReactionResponse = {
  _id: string;
  freetcontent: string;
  username: string;
  reaction: string;
};

/**
 *
 * @param {HydratedDocument<Reaction>} Reaction - A reaction object
 * @returns {ReactionResponse} - the reaction containing the freet and a user's reaction to the freet
 */
const constructReactionResponse = (reaction: HydratedDocument<Reaction>): ReactionResponse => {
  const reactionCopy: PopulatedReaction = {
    ...reaction.toObject({
      versionKey: false // Cosmetics; prevents returning of __v property
    })
  };

  let userReaction;
  if (reactionCopy.liked) {
    userReaction = 'liked';
  } else {
    userReaction = 'disliked';
  }

  return {
    _id: reactionCopy._id.toString(),
    freetcontent: reactionCopy.freet.content,
    username: reactionCopy.user.username,
    reaction: userReaction
  };
};

export {
  constructReactionResponse
};
