import type {NextFunction, Request, Response} from 'express';
import express from 'express';
import UserCollection from '../user/collection';
import VerificationCollection from './collection';
import * as userValidator from '../user/middleware';
import * as verificationValidator from './middleware';
import * as util from './util';
import * as userutil from '../user/util';

const router = express.Router();

/**
 * Get verification status of another user (don't have to be logged in)
 *
 * @name GET /api/verify?username=USERNAME
 *
 * @return {VerificationResponse} - the verification status of the user
 *
 */
/**
 * Get verification status of currently logged in user
 *
 * @name GET /api/verify
 *
 * @return {VerificationResponse} - the verification status of the user
 *
 */
router.get(
  '/',
  [
    verificationValidator.isValidUsername
  ],
  async (req: Request, res: Response, next: NextFunction) => {
    if (req.query.username === undefined) {
      next();
      return;
    }

    const username = (req.query.username as string);
    const verification = await VerificationCollection.seeOne(username);
    res.status(200).json({
      message: 'Here is the users verification status.',
      verification: util.constructVerificationResponse(verification)
    });
  },
  [
    userValidator.isUserLoggedIn
  ],
  async (req: Request, res: Response) => {
    const userId = (req.session.userId as string) ?? '';
    const user = await UserCollection.findOneByUserId(userId);
    const verification = await VerificationCollection.seeOne(user.username);
    res.status(200).json({
      message: 'Here is your verification status.',
      verification: util.constructVerificationResponse(verification)
    });
  }
);

/**
 * Update a user's verification status
 *
 */
router.put(
  '/',
  [
    userValidator.isUserLoggedIn,
    verificationValidator.isUserAlreadyVerified,
    verificationValidator.isValidName,
    verificationValidator.isValidAge
  ],
  async (req: Request, res: Response) => {
    const userId = (req.session.userId as string) ?? ''; // Will not be an empty string since its validated in isUserLoggedIn
    const user = await VerificationCollection.updateOne(userId, req.body.name, req.body.age);
    res.status(200).json({
      message: 'Your profile was updated successfully.',
      user: userutil.constructUserResponse(user)
    });
  }
);

export {router as verificationRouter};
