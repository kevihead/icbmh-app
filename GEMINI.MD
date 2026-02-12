# Conference App Requirements

This document outlines the requirements for the conference web application.

## 1. General Requirements

- **Application Name:** International Conference on Bulk Materials Storage, Handling & Transportation (ICBMH) App
- **Objective:** To provide an interactive experience for conference attendees, complementing the main conference website.
- **Target Audience:** Conference attendees, speakers, and organizers.
- ** Analyze the branding at https://icbmh.com/. Save the primary hex codes to a 'theme.config.ts' file and download the logo to /public/logo.png. Don't copy the layout—just the brand assets

## 2. Technology Stack

- **Framework:** Next.js 15
- **Styling:** Tailwind CSS
- **Authentication:** Firebase Authentication with support for Passkeys for a secure and seamless login experience.
- **Database:** Firestore (as part of Firebase) for storing user data, schedule information, and abstracts.

## 3. Core Features

### 3.1. User Authentication

- Users should be able to create an account and log in using Firebase Authentication.
- Support for Passkeys (WebAuthn) should be prioritized for a passwordless experience.
- User profiles should store basic information (name, affiliation, etc.) and linked to their personalized schedule.

### 3.2. Multi-Track Schedule

- The application must display a multi-track conference schedule.
- The schedule should be filterable and searchable by track, speaker, location and time.
- Users should be able to add sessions to their personal schedule.
- Session details should include:
    - Title
    - Abstract
    - Speaker(s)
    - Time and location
    - Track

### 3.3. Abstract Library

- A searchable and filterable library of all conference abstracts.
- Each abstract should be linked to its corresponding session in the schedule.
- Users should be able to bookmark or "favorite" abstracts.

### 3.4. Information Integration

- The application will pull logos, speaker information, and other relevant content from the main conference website.
- A mechanism for syncing this information should be implemented to ensure the app is up-to-date.

## 4. Design and UX

- The application should have a clean, modern, and responsive design, consistent with the branding of the main conference website.
- The user interface should be intuitive and easy to navigate.

## 5. Non-Functional Requirements

- **Performance:** The application should be fast and responsive.
- **Security:** All user data must be handled securely.
- **Scalability:** The application should be able to handle a large number of concurrent users.
