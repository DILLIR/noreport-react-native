import {
  Client,
  Account,
  ID,
  Avatars,
  Databases,
  Query,
  Models,
  Storage,
  ImageGravity,
} from "react-native-appwrite";
import { UsersDocument, VideosDocument } from "../types/schema";
import { ImagePickerAsset } from "expo-image-picker";
import { Form } from "../app/(tabs)/create";

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
const storage = new Storage(client);

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

export const getAllPosts = async (): Promise<VideosDocument[]> => {
  try {
    const posts = await databases.listDocuments(
      databaseId,
      videosCollectionId,
      [Query.orderDesc("$createdAt")]
    );

    return posts.documents as VideosDocument[];
  } catch (error) {
    console.error("Error fetching posts:", error);
    throw new Error("An error occurred while fetching posts.");
  }
};

export const getLatestPosts = async (): Promise<VideosDocument[]> => {
  try {
    const posts = await databases.listDocuments(
      databaseId,
      videosCollectionId,
      [Query.orderDesc("$createdAt"), Query.limit(7)]
    );

    return posts.documents as VideosDocument[];
  } catch (error) {
    console.error("Error fetching posts:", error);
    throw new Error("An error occurred while fetching posts.");
  }
};

export const searchPosts = async (query: string): Promise<VideosDocument[]> => {
  try {
    const posts = await databases.listDocuments(
      databaseId,
      videosCollectionId,
      [Query.search("title", query)]
    );

    return posts.documents as VideosDocument[];
  } catch (error) {
    console.error("Error fetching posts:", error);
    throw new Error("An error occurred while fetching posts.");
  }
};

export const getUserPosts = async (
  userId: string
): Promise<VideosDocument[]> => {
  try {
    const posts = await databases.listDocuments(
      databaseId,
      videosCollectionId,
      [Query.equal("creator", userId), Query.orderDesc("$createdAt")]
    );

    return posts.documents as VideosDocument[];
  } catch (error) {
    console.error("Error fetching posts:", error);
    throw new Error("An error occurred while fetching posts.");
  }
};

export const signOut = async () => {
  try {
    await account.deleteSession("current");
  } catch (error) {
    console.error("Error during sign-out:", error);
    throw new Error("Failed to sign out. Please try again later.");
  }
};

export const getFilePreview = async (fileId: string, type: string) => {
  let fileUrl;
  try {
    if (type === "video") {
      fileUrl = storage.getFileView(storageId, fileId);
    } else if (type === "image") {
      fileUrl = storage.getFilePreview(
        storageId,
        fileId,
        2000,
        2000,
        ImageGravity.Top,
        100
      );
    } else {
      throw new Error("Invalid file type.");
    }

    if (!fileUrl) {
      throw new Error("No file URL found.");
    }

    return fileUrl;
  } catch (error) {
    console.error("Error fetching file preview:", error);
    throw new Error("An error occurred while fetching the file preview.");
  }
};

export const uploadFile = async (
  file: ImagePickerAsset,
  type: "image" | "video"
) => {
  if (!file) {
    throw new Error("No file provided.");
  }

  const asset = {
    name: file.fileName ?? file.uri.split("/").pop()!,
    type: file.mimeType!,
    uri: file.uri,
    size: file.fileSize!,
  };

  console.log("Uploading file:", asset);

  try {
    const uploadedFile = await storage.createFile(
      storageId,
      ID.unique(),
      asset
    );
    const fileUrl = await getFilePreview(uploadedFile.$id, type);
    return fileUrl;
  } catch (error) {
    console.log("Error uploading file:", error);
    throw new Error("An error occurred while uploading the file.");
  }
};

export const createVideo = async (
  form: Required<Form & { userId: string }>
) => {
  try {
    const [thumbnailUrl, VideoUrl] = await Promise.all([
      uploadFile(form.thumbnail!, "image"),
      uploadFile(form.video!, "video"),
    ]);

    const newPost = await databases.createDocument(
      databaseId,
      videosCollectionId,
      ID.unique(),
      {
        title: form.title,
        prompt: form.prompt,
        thumbnail: thumbnailUrl,
        sourceURL: VideoUrl,
        creator: form.userId,
      }
    );

    return newPost;
  } catch (error) {
    console.error("Error creating video:", error);
    throw new Error("An error occurred while creating the video.");
  }
};
