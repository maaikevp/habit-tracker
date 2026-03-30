# Habit Tracker

Habit Tracker helps you build routines through clear streak tracking, quick swipe actions, and simple progress visibility.

## Customer Guide

### What the app does

- Lets you create habits with a daily, weekly, or monthly frequency
- Tracks each habit streak over time
- Shows streak rankings with medal spots for top performers

### How to use it

1. Sign in or create an account
2. Go to Add habit and create one or more habits
3. On Home:
   - Swipe right to complete a habit
   - Swipe left to delete a habit
4. Open Streaks to see rankings, streak counts, and top 3 medals

### How streak counting works

- Each habit has a completion window based on its frequency
- A habit can only be counted once per current window
- Completing on time extends the streak
- Missing enough windows means the next completion restarts from 1

### Data and account behavior

- Habits are stored in Supabase and linked to your account
- Signing out does not remove your saved habits
- Signing in on the same account restores your data

### FAQ

Q: Can I edit a habit?
A: Current version supports add, complete, and delete.

Q: Do medals stay forever?
A: No. Medals update automatically based on current streak ranking.

Q: Why did my streak not increase?
A: If the habit was already completed in the current window, it will not be double-counted.

## In-App Help

A customer-friendly Help tab is available in the app navigation with the same information in a quick, readable format.

## Developer Setup

1. Install dependencies

```bash
npm install
```

2. Start the app

```bash
npx expo start
```

3. Build with EAS

```bash
eas build --platform all
```

---

## Original Expo Starter Text

# Welcome to your Expo app 👋

This is an [Expo](https://expo.dev) project created with [`create-expo-app`](https://www.npmjs.com/package/create-expo-app).

## Get started

1. Install dependencies

   ```bash
   npm install
   ```

2. Start the app

   ```bash
   npx expo start
   ```

In the output, you'll find options to open the app in a

- [development build](https://docs.expo.dev/develop/development-builds/introduction/)
- [Android emulator](https://docs.expo.dev/workflow/android-studio-emulator/)
- [iOS simulator](https://docs.expo.dev/workflow/ios-simulator/)
- [Expo Go](https://expo.dev/go), a limited sandbox for trying out app development with Expo

You can start developing by editing the files inside the **app** directory. This project uses [file-based routing](https://docs.expo.dev/router/introduction).

## Get a fresh project

When you're ready, run:

```bash
npm run reset-project
```

This command will move the starter code to the **app-example** directory and create a blank **app** directory where you can start developing.

### Other setup steps

- To set up ESLint for linting, run `npx expo lint`, or follow our guide on ["Using ESLint and Prettier"](https://docs.expo.dev/guides/using-eslint/)
- If you'd like to set up unit testing, follow our guide on ["Unit Testing with Jest"](https://docs.expo.dev/develop/unit-testing/)
- Learn more about the TypeScript setup in this template in our guide on ["Using TypeScript"](https://docs.expo.dev/guides/typescript/)

## Learn more

To learn more about developing your project with Expo, look at the following resources:

- [Expo documentation](https://docs.expo.dev/): Learn fundamentals, or go into advanced topics with our [guides](https://docs.expo.dev/guides).
- [Learn Expo tutorial](https://docs.expo.dev/tutorial/introduction/): Follow a step-by-step tutorial where you'll create a project that runs on Android, iOS, and the web.

## Join the community

Join our community of developers creating universal apps.

- [Expo on GitHub](https://github.com/expo/expo): View our open source platform and contribute.
- [Discord community](https://chat.expo.dev): Chat with Expo users and ask questions.
