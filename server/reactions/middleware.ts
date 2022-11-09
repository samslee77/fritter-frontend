import type {Request, Response, NextFunction} from 'express';
import {Types} from 'mongoose';
import ReactionCollection from '../reactions/collection';
import FreetCollection from '../freet/collection';

const isFreetExists = async (req: Request, res: Response, next: NextFunction) => {
  const validFormat = Types.ObjectId.isValid(req.body.id as string);

  const freet = validFormat ? await FreetCollection.findOne(req.body.id as string) : '';
  if (!freet) {
    res.status(404).json({
      error: `Freet with freet ID ${req.body.id as string} does not exist.`
    });
    return;
  }

  next();
};

const hasUserAlreadyReacted = async (req: Request, res: Response, next: NextFunction) => {
  const userId = req.session.userId as string;
  const freetId = req.body.id as string;
  const reaction = await ReactionCollection.findReaction(freetId, userId);
  if (reaction) {
    res.status(403).json({
      error: 'You have already reacted to this Freet.'
    });
    return;
  }

  next();
};

const hasUserLiked = async (req: Request, res: Response, next: NextFunction) => {
  const userId = req.session.userId as string;
  const freetId = req.body.id as string;
  const reaction = await ReactionCollection.findReaction(freetId, userId);
  if (reaction && !reaction.liked) {
    res.status(404).json({
      error: 'You have not liked this Freet.'
    });
    return;
  }

  if (!reaction) {
    res.status(403).json({
      error: 'You have not reacted to this Freet.'
    });
    return;
  }

  next();
};

const hasUserDisliked = async (req: Request, res: Response, next: NextFunction) => {
  const userId = req.session.userId as string;
  const freetId = req.body.id as string;
  const reaction = await ReactionCollection.findReaction(freetId, userId);
  if (reaction && reaction.liked) {
    res.status(404).json({
      error: 'You have not disliked this Freet.'
    });
    return;
  }

  if (!reaction) {
    res.status(403).json({
      error: 'You have not reacted to this Freet.'
    });
    return;
  }

  next();
};

export {
  isFreetExists,
  hasUserAlreadyReacted,
  hasUserLiked,
  hasUserDisliked
};
