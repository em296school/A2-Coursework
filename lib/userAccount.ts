import Validator from '@/app/controllers/Validator/Validator';
import {
  AccountProps,
  Accounts,
  UncreatedAccountProps,
} from '@/app/models/Accounts';
import { SessionProps, Sessions } from '@/app/models/Sessions';

import argon2 from 'argon2';
import { createHash, randomBytes } from 'crypto';
import { cookies } from 'next/headers';
import Snowflakify from 'snowflakify';

const snowflakify = new Snowflakify();

export type SignInProps = Promise<AccountProps | false>;

export function generateSessionToken() {
  // We generate a token (which is what is set as a cookie)
  // and then a hashed (which is stored in the DB) to mean
  // that if the DB is ever leaked, the actual token is not revealed
  // as SHA-256 is one-way hashing- but it means that we hash any
  // incoming tokens and then compare them in the DB.
  const token = randomBytes(32).toString('base64url');
  const hashed = createHash('sha256').update(token).digest('hex');

  return {
    token: token,
    hashed: hashed,
  };
}

export async function hashPassword(plainPassword: string) {
  return await argon2.hash(plainPassword, {
    type: argon2.argon2id,
    memoryCost: 19456,
    timeCost: 2,
    parallelism: 1,
  });
}

export async function verifyPassword(dbHash: string, plainPassword: string) {
  return await argon2.verify(dbHash, plainPassword);
}

async function generateUserId() {
  // Create a simple len(entries) + 1 user id for simplicity
  // of the project
  //const accounts = await Accounts.countDocuments();
  //const userId = accounts + 1;

  const userId = snowflakify.nextId();
  return Number(userId);
}

export async function getUserAccount(
  email: string,
  password: string
): SignInProps {
  // Make sure we have both the email & password:
  if (!email || !password) return false;

  // Check if the email is found:
  let userAccount: AccountProps = await Accounts.findOne({
    email: email,
  }).exec();
  if (!userAccount) {
    return false;
  }

  // Now we use Argon2's verify password to check the password
  // against the password hash (which contains the salt so we
  // dont need to worry about that):
  const passwordIsCorrect = await verifyPassword(
    userAccount.passwordHash,
    password
  );

  if (!passwordIsCorrect) {
    return false;
  }

  // Credentials are correct:
  return userAccount;
}

async function setCookie(account: AccountProps) {
  const inSevenDays = new Date(Date.now() + 1000 * 60 * 60 * 24 * 7);
  const { token, hashed } = generateSessionToken();

  await new Sessions({
    userId: account.user_id,
    hashed: hashed,
    expiresAt: inSevenDays,
  }).save();

  const cookiesSetter = await cookies();
  cookiesSetter.set('session', token, {
    httpOnly: true,
    secure: true,
    sameSite: 'strict',
    path: '/',
    expires: inSevenDays,
  });
}

export async function signIntoAccount(
  email: string,
  password: string
): SignInProps {
  let account: AccountProps | false = await getUserAccount(email, password);

  if (!account) {
    throw new Error('Incorrect email or password.');
  }

  // Now we handle the cookies so they
  // don't have to log in every time they
  // refresh the page.
  try {
    await setCookie(account);
  } catch {
    return false;
  }

  return account;
}

export async function getToken() {
  const cookiesSetter = await cookies();
  return cookiesSetter.get('session')?.value;
}

export async function signIntoAccountWithCookie(): SignInProps {
  const token = await getToken();

  if (!token) {
    return false;
  }

  // We rehash our session cookie so we can compare it to that
  // which is saved in the DB
  const hashed = createHash('sha256').update(token).digest('hex');

  // See if this exists?
  const session: SessionProps | null = await Sessions.findOne({
    hashed: hashed,
  });

  if (!session) {
    return false;
  }

  // Make sure its not expired (MongoDB checks expiration every 60 seocnds)
  if (session.expiresAt < new Date()) {
    return false;
  }

  // Try find the account now via userId look up'
  const account: AccountProps | null = await Accounts.findOne({
    user_id: session.userId,
  })
    .lean()
    .exec();

  if (!account) {
    return false;
  }

  // All good, we're already signed in so we return the account
  // to be used by the server
  return account;
}

export async function tryMakeAccount(
  accountProps: UncreatedAccountProps,
  plainPassword: string
) {
  const { email, telephone } = accountProps;
  const propsAreOK = new Validator(accountProps).validateAccountParams();
  const passwordIsOK = new Validator(plainPassword).validateAccountPassword();

  // Prevent people from creating a new account with an already valid
  // session cookie
  if (await getToken()) {
    throw new Error('User is already signed into an account.');
  }

  if (!propsAreOK || !passwordIsOK) {
    throw new Error('Account information is invalid.');
  }

  // Check if the email, or phone number, is already in use:
  let existing;
  let saved;

  try {
    existing = await Accounts.findOne({
      $or: [{ email: email }, { telephone: telephone }],
    });
  } catch {
    throw new Error('Unable to check account information at this time.');
  }

  if (existing) {
    throw new Error('Account with this information already exists.');
  }

  // We can make this account
  try {
    saved = await generateAccountDuringCreation(accountProps, plainPassword);
  } catch {
    throw new Error('Unable to create account at this time.');
  }

  const accountDoc: AccountProps = saved;
  try {
    await setCookie(accountDoc);
  } catch {
    throw new Error('Could not create cookie for session.');
  }

  // Account has been made
  return accountDoc;
}

async function generateAccountDuringCreation(
  accountProps: UncreatedAccountProps,
  plainPassword: string
) {
  const { email, first_name, last_name, telephone } = accountProps;
  const user_id = await generateUserId();
  const passwordHash = await hashPassword(plainPassword);

  return new Accounts({
    user_id: user_id,
    email: email.toLowerCase(),
    telephone: telephone,
    passwordHash: passwordHash,

    first_name: first_name.toLowerCase(),
    last_name: last_name.toLowerCase(),
    is_staff: false,
    is_admin: false,
  }).save();
}

export async function logOut() {
  // Get the session cookie
  const token = await getToken();

  if (!token) {
    throw new Error('User is not logged in.');
  }

  // Remove the cookie.
  const cookiesSetter = await cookies();
  cookiesSetter.delete('session');

  // Get the session & remove it from the DB.
  const hashed = createHash('sha256').update(token).digest('hex');
  try {
    const user = await Sessions.findOneAndDelete({
      hashed: hashed,
    });

    if (!user) {
      throw new Error('No session found.');
    }

    return true;
  } catch (err: Error | any) {
    let message = err?.message;
    throw new Error(message || 'Unexpected error occurred.');
  }
}
