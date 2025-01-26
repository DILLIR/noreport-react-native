import {
  Client,
  Account,
  ID,
  Avatars,
  Databases,
  Query,
  Models,
} from "react-native-appwrite";
import { UsersDocument } from "../types/schema";

const {
  EXPO_PUBLIC_API_URL: endpoint,
  EXPO_PUBLIC_PROJECT_ID: projectId,
  EXPO_PUBLIC_PLATFORM: platform,
  EXPO_PUBLIC_DATABASE_ID: databaseId,
  EXPO_PUBLIC_USER_COLLECTION_ID: userCollectionId,
  EXPO_PUBLIC_VIDEOS_COLLECTION_ID: videosCollectionId,
  EXPO_PUBLIC_STORAGE_ID: storageId,
} = process.env;

if (
  !endpoint ||
  !projectId ||
  !platform ||
  !databaseId ||
  !userCollectionId ||
  !videosCollectionId ||
  !storageId
) {
  throw new Error("Missing environment variables");
}

const client = new Client()
  .setEndpoint(endpoint)
  .setProject(projectId)
  .setPlatform(platform);

const account = new Account(client);
const avatars = new Avatars(client);
const databases = new Databases(client);

interface CreateUserProps {
  username: string;
  email: string;
  password: string;
}

export const signUp = async ({
  email,
  password,
  username,
}: CreateUserProps) => {
  try {
    const newAccount = await account.create(
      ID.unique(),
      email,
      password,
      username
    );

    const avatarUrl = avatars.getInitials(username);

    await signIn({ email, password });

    const newUser = await databases.createDocument(
      databaseId,
      userCollectionId,
      ID.unique(),
      {
        accountId: newAccount.$id,
        avatar: avatarUrl,
        email,
        username,
      }
    );

    return newUser;
  } catch (error: any) {
    console.error("Error during sign-up:", error.message || error);
    throw new Error("Failed to sign up. Please try again later.");
  }
};

interface SignInProps {
  email: string;
  password: string;
}

export const signIn = async ({
  email,
  password,
}: SignInProps): Promise<Models.Session> => {
  try {
    const newSession = await account.createEmailPasswordSession(
      email,
      password
    );

    return newSession;
  } catch (error: any) {
    console.error("Error during sign-in:", error.message || error);
    throw new Error(
      "Failed to sign in. Please check your credentials and try again."
    );
  }
};

export const getCurrentUser = async (): Promise<UsersDocument | undefined> => {
  try {
    const currentAccount = await account.get();

    if (!currentAccount?.$id) {
      console.error("No current account found.");
      return undefined;
    }

    const currentUser = await databases.listDocuments(
      databaseId,
      userCollectionId,
      [Query.equal("accountId", currentAccount.$id)]
    );

    if (!currentUser?.documents?.length) {
      console.error("No user document found for the current account.");
      return undefined;
    }

    return currentUser.documents[0] as UsersDocument;
  } catch (error) {
    console.error("Error fetching current user:", error);
    throw new Error("An error occurred while fetching the current user.");
  }
};
