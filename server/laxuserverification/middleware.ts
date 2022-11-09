import type {Request, Response, NextFunction} from 'express';
import {Types} from 'mongoose';
import VerificationCollection from './collection';
import UserCollection from '../user/collection';

/**
 * Checks if a username in req.query is valid, that is, it matches the username regex and if it exists in Fritter
 */
const isValidUsername = async (req: Request, res: Response, next: NextFunction) => {
  const usernameRegex = /^\w+$/i;
  if (!usernameRegex.test((req.query.username as string))) {
    res.status(400).json({
      error: 'Username must be a nonempty alphanumeric string.'
    });
    return;
  }

  if (req.query.username) { //need this if statement otherwise the functions used below will cause errors
    const user = await UserCollection.findOneByUsername((req.query.username as string));
    if (!user) {
      res.status(404).json({
        error: `A user with username ${req.query.username as string} does not exist.`
      });
      return;
    }
  }

  next();
};

/**
 * Checks if a user has already been verified
 */
const isUserAlreadyVerified = async (req: Request, res: Response, next: NextFunction) => {
  const userId = (req.session.userId as string) ?? '';
  const obtainUser = await UserCollection.findOneByUserId(userId);
  const userVerification = obtainUser.verified;
  if (userVerification) {
    res.status(403).json({
      error: 'User is already verified.'
    });
    return;
  }

  next();
};

/**
 * Checks if the entered name seems like an actual name
 */
const isValidName = (req: Request, res: Response, next: NextFunction) => {
  const nameRegex = /^\w+$/i;
  if (!nameRegex.test(req.body.name)) {
    res.status(400).json({
      error: 'Name must be a nonempty alphanumeric string.'
    });
    return;
  }

  next();
};

/**
 * Checks if the entered age is actually an age
 */
const isValidAge = (req: Request, res: Response, next: NextFunction) => {
  const ageRegex = /^[1-9][0-9]*/; // age has to be > 1 (although this is not true for Twitter since the minimum age is 13, I'm thinking about age in general hero (age is always greater than 0))
  if (!ageRegex.test(req.body.age)) {
    res.status(400).json({
      error: 'Age must be a nonzero number (can not start with a 0).'
    });
    return;
  }

  next();
};

export {
  isValidUsername,
  isUserAlreadyVerified,
  isValidName,
  isValidAge
};
