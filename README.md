# Noreport

A React Native app built with Expo for exploring and sharing short videos. Includes user authentication, video uploads with AI-enhanced prompts, and feed exploration features.

## Features

- User authentication (sign-up, sign-in) in `app/(auth)`.
- Video upload and listing in `app/(tabs)/create.tsx` and `app/(tabs)/home.tsx`.
- AI prompt support in video creation via `createVideo` (in `services/appwrite.ts`).
- Profile management in `app/(tabs)/profile.tsx`.

## Requirements

1. Node.js and npm (or yarn) installed.
2. Expo CLI installed globally.

## Setup

1. Clone the repo and install dependencies:
   ```sh
   npm install
   ```
2. Copy `.env.example` to `.env` and fill in the required values.
3. Start the Expo development server:
   ```sh
   npx expo start
   ```
4. Open the Expo Go app on your device and scan the QR code.

## Directory Structure

- `app/`: Contains the main app code.
  - `auth/`: User authentication screens.
  - `components/`: Shared components.
  - `hooks/`: Custom hooks.
  - `services/`: Appwrite API service.
  - `tabs/`: Main app screens.
- `assets/`: Static assets.
- `types/`: TypeScript types.
- `app.json`: Expo configuration.
- `package.json`: Node.js dependencies.
- `tsconfig.json`: TypeScript configuration.
- `README.md`: Project README.
- `.env.example`: Example environment variables.

See the [Expo documentation](https://docs.expo.dev/) for more information.