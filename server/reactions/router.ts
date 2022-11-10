import type {NextFunction, Request, Response} from 'express';
import express from 'express';
import FreetCollection from '../freet/collection';
import * as userValidator from '../user/middleware';
import * as reactionValidator from './middleware';
import * as util from './util';
import ReactionCollection from '../reactions/collection';

const router = express.Router();

/**
 * Add a like to a Freet
 *
 */
router.post(
  '/like',
  [
    userValidator.isUserLoggedIn,
    reactionValidator.isFreetExists,
    reactionValidator.hasUserAlreadyReacted
  ],
  async (req: Request, res: Response) => {
    const userId = (req.session.userId as string) ?? ''; // Will not be an empty string since its validated in isUserLoggedIn
    const freetId = req.body.id as string;
    const addLike = await ReactionCollection.addLike(freetId, userId);
    const originalFreet = await FreetCollection.findOne(freetId);
    originalFreet.likes += 1;
    const likes = originalFreet.likes;
    const dislikes = originalFreet.dislikes;
    if ((likes + dislikes > 5) && dislikes / (likes + dislikes) > 0.5) {
      originalFreet.consensusfiltered = true;
    }

    await originalFreet.save();
    res.status(201).json({
      message: 'Your like was added successfully.',
      reaction: util.constructReactionResponse(addLike)
    });
  }
);

/**
 * Add a dislike to a Freet
 *
 */
router.post(
  '/dislike',
  [
    userValidator.isUserLoggedIn,
    reactionValidator.isFreetExists,
    reactionValidator.hasUserAlreadyReacted
  ],
  async (req: Request, res: Response) => {
    const userId = (req.session.userId as string) ?? ''; // Will not be an empty string since its validated in isUserLoggedIn
    const freetId = req.body.id as string;
    const addDislike = await ReactionCollection.addDislike(freetId, userId);
    const originalFreet = await FreetCollection.findOne(freetId);
    originalFreet.dislikes += 1;
    const likes = originalFreet.likes;
    const dislikes = originalFreet.dislikes;
    if ((likes + dislikes > 5) && dislikes / (likes + dislikes) > 0.5) {
      originalFreet.consensusfiltered = true;
    }

    await originalFreet.save();
    res.status(201).json({
      message: 'Your dislike was added successfully.',
      reaction: util.constructReactionResponse(addDislike)
    });
  }
);

/**
 * Remove a like from Freet
 *
 */
router.delete(
  '/like',
  [
    userValidator.isUserLoggedIn,
    reactionValidator.isFreetExists,
    reactionValidator.hasUserLiked
  ],
  async (req: Request, res: Response) => {
    const userId = (req.session.userId as string) ?? ''; // Will not be an empty string since its validated in isUserLoggedIn
    const freetId = req.body.id as string;
    await ReactionCollection.removeReaction(freetId, userId);
    const originalFreet = await FreetCollection.findOne(freetId);
    originalFreet.likes -= 1;
    const likes = originalFreet.likes;
    const dislikes = originalFreet.dislikes;
    if ((likes + dislikes > 5) && dislikes / (likes + dislikes) > 0.5) {
      originalFreet.consensusfiltered = true;
    } else {
      originalFreet.consensusfiltered = false;
    }

    await originalFreet.save();
    res.status(201).json({
      message: 'You have successfully removed your like from the freet.'
    });
  }
);

/**
 * Remove a dislike from Freet
 *
 */
router.delete(
  '/dislike',
  [
    userValidator.isUserLoggedIn,
    reactionValidator.isFreetExists,
    reactionValidator.hasUserDisliked
  ],
  async (req: Request, res: Response) => {
    const userId = (req.session.userId as string) ?? ''; // Will not be an empty string since its validated in isUserLoggedIn
    const freetId = req.body.id as string;
    await ReactionCollection.removeReaction(freetId, userId);
    const originalFreet = await FreetCollection.findOne(freetId);
    originalFreet.dislikes -= 1;
    const likes = originalFreet.likes;
    const dislikes = originalFreet.dislikes;
    if ((likes + dislikes > 5) && dislikes / (likes + dislikes) > 0.5) {
      originalFreet.consensusfiltered = true;
    } else {
      originalFreet.consensusfiltered = false;
    }

    await originalFreet.save();
    res.status(201).json({
      message: 'You have successfully removed your dislike from the freet.'
    });
  }
);

export {router as reactionRouter};
