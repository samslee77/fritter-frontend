import type {HydratedDocument} from 'mongoose';
import moment from 'moment';
import type {Verification} from './model';

type VerificationResponse = {
  _id: string;
  verified: string;
  name: string;
  age: string;
};

const formatDate = (date: Date): string => moment(date).format('MMMM Do YYYY, h:mm:ss a');

/**
 *
 * @param {HydratedDocument<Verification>} verification - A verification object
 * @returns {VerificationResponse} - the verification status, name, and age of user
 */
const constructVerificationResponse = (verification: HydratedDocument<Verification>): VerificationResponse => {
  const verificationCopy: Verification = {
    ...verification.toObject({
      versionKey: false // Cosmetics; prevents returning of __v property
    })
  };

  let status;
  if (verificationCopy.verified) {
    status = 'true';
  } else {
    status = 'false';
  }

  return {
    ...verificationCopy,
    _id: verificationCopy._id.toString(),
    verified: status,
    name: verificationCopy.name,
    age: verificationCopy.age
  };
};

export {
  constructVerificationResponse
};
