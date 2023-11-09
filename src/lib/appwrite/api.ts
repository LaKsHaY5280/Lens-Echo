import { ID } from "appwrite";
import { account, appwriteconfig, database, avatar } from "./config";
import { INewUser } from "./types";

export async function createUserAccount(user: INewUser) {
  try {
    const newAccount = await account.create(
      ID.unique(),
      user.email,
      user.password,
      user.name
    );

    if (!newAccount) throw Error;

    const avatarUrl = avatar.getInitials(user.name);

    const newUser = await saveUserToDb({
      accountId: newAccount.$id,
      name: newAccount.name,
      username: user.username,
      email: newAccount.email,
      imageUrl: avatarUrl,
    });

    return newUser;
  } catch (error) {
    console.log(error);
  }
}

export async function saveUserToDb(user: {
  accountId: string;
  name: string;
  username?: string;
  email: string;
  imageUrl: URL;
}) {
  try {
    const newUser = await database.createDocument(
      appwriteconfig.databaseId,
      appwriteconfig.userCollectionId,
      ID.unique(),
      user
    );
    return newUser;
  } catch (error) {
    console.log(error);
  }
}

export async function signInAccount(user: { email: string; password: string }) {
  try {
    const session = await account.createEmailSession(user.email, user.password);
  } catch (error) {
    console.log(error);
  }
}
