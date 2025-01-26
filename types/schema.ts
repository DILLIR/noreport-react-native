import type { Models } from 'react-native-appwrite';

export interface UsersType {
    username: string;
    email: string;
    avatar: string;
    accountId: string;
}

export interface UsersDocument extends UsersType, Models.Document {
}

export interface VideosType {
    title: string;
    thumbnail: string;
    prompt: string;
    sourceURL: string;
    users?: UsersType;
}

export interface VideosDocument extends VideosType, Models.Document {
    users: UsersDocument;
}

