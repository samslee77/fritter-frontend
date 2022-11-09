import type {NextFunction, Request, Response} from 'express';
import express from 'express';
import * as userValidator from '../user/middleware';
import * as followValidator from '../follow/middleware';
import * as util from './util';
import UserCollection from '../user/collection';
import FollowCollection from './collection';

const router = express.Router();

/**
 * Get the list of all followers of the user currently logged in
 *
 * @name GET /api/Follow/followers
 *
 */
router.get(
  '/followers',
  [
    userValidator.isUserLoggedIn
  ],
  async (req: Request, res: Response, next: NextFunction) => {
    const userId = (req.session.userId as string) ?? '';
    const followers = await FollowCollection.viewAllFollowers(userId);
    res.status(200).json({
      message: 'Here are your followers.',
      follow: followers.map(util.constructFollowResponse)
    });
  }
);

/**
 * Get the list of all the users that the current user is following
 *
 * @name GET /api/Follow/following
 *
 */
router.get(
  '/following',
  [
    userValidator.isUserLoggedIn
  ],
  async (req: Request, res: Response, next: NextFunction) => {
    // Check if authorId query parameter was supplied
    const userId = (req.session.userId as string) ?? '';
    const following = await FollowCollection.viewAllFollowing(userId);
    res.status(200).json({
      message: 'Here are the users you are following.',
      follow: following.map(util.constructFollowResponse)
    });
  }
);

/**
 * Add a follower-following relationship
 *
 * @name POST /api/Follow
 *
 */
router.post(
  '/',
  [
    userValidator.isUserLoggedIn,
    followValidator.doesUsernameExist,
    followValidator.doesFollowExist,
    followValidator.isFollowUser
  ],
  async (req: Request, res: Response) => {
    const follower = (req.session.userId as string) ?? ''; // Will not be an empty string since its validated in isUserLoggedIn
    const following = (req.body.username as string) ?? '';

    const followingUser = await UserCollection.findOneByUsername(following);
    const followingId = followingUser._id;

    const follow = await FollowCollection.addFollow(follower, followingId);
    res.status(201).json({
      message: 'You have successfully followed the user.',
      follow: util.constructFollowResponse(follow)
    });
  }
);

/**
 * Remove a follower-following relationship
 *
 * @name DELETE /api/Follow
 *
 * @return {string} - A success message
 */
router.delete(
  '/',
  [
    userValidator.isUserLoggedIn,
    followValidator.doesUsernameExist,
    followValidator.doesFollowNotExist
  ],
  async (req: Request, res: Response, next: NextFunction) => {
    const currUser = (req.session.userId as string) ?? '';
    const followed = await UserCollection.findOneByUsername(req.body.username);
    const followedid = followed._id;
    await FollowCollection.removeFollow(currUser, followedid);
    res.status(200).json({
      message: 'This follow relationship has successfully been removed.'
    });
  }
);

/**
 * Remove a follower-following relationship
 *
 * @name DELETE /api/Follow/follow
 *
 * @return {string} - A success message
 */
router.delete(
  '/remove',
  [
    userValidator.isUserLoggedIn,
    followValidator.doesUsernameExist,
    followValidator.doesFollowerExist
  ],
  async (req: Request, res: Response, next: NextFunction) => {
    const currUser = (req.session.userId as string) ?? '';
    const followed = await UserCollection.findOneByUsername(req.body.username);
    const followedid = followed._id;
    await FollowCollection.removeFollow(followedid, currUser);
    res.status(200).json({
      message: 'This follow relationship has successfully been removed.'
    });
  }
);

export {router as followRouter};
