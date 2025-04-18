# Portfelik

A personal finance management application built with React, TypeScript, and Firebase.
Some of the backend code is moved already either to Firebase Cloud Functions or [separate API layer written in Go](https://github.com/adrianghub/portfelik-bff).

[Preview of the app](https://adrianzinko.com)

![Transactions view - mobile](./.github/img/1.png)
![Portfelik - logo draft](./.github/img/2.png)
![Transactions view - desktop](./.github/img/3.png)


## Features

- User authentication with Firebase Auth
- Protected routes for authenticated users
- Admin-only routes and features
- Firestore database with security rules

## Prerequisites

- Node.js (v20 or higher)
- npm
- Firebase account

## Setup

1. Clone the repository
2. Install dependencies:
   ```bash
   npm install
   ```
3. Create a Firebase project at [https://console.firebase.google.com/](https://console.firebase.google.com/)
4. Enable Authentication with Email/Password provider
5. Create a Firestore database
6. Copy your Firebase configuration from the Firebase console
7. Create a `.env` file in the root directory based on `.env.example` and fill in your Firebase configuration
8. Deploy Firestore security rules:
   ```bash
   firebase deploy --only firestore:rules
   ```
9. Create an admin user in the Firebase console:
   - Create a user with email and password in the Authentication section
   - In the Firestore database, create a document in the `users` collection with the following structure:
     ```
     {
       uid: "<user-uid-from-authentication>",
       email: "<user-email>",
       role: "admin",
       createdAt: <timestamp>,
       lastLoginAt: <timestamp>
     }
     ```

## Development

Start the development server:

```bash
npm run dev
# or
yarn dev
```

## Build

Build the project for production:

```bash
npm run build
# or
yarn build
```

## Deployment

Deploy to Firebase Hosting:

```bash
firebase deploy --only hosting
```
