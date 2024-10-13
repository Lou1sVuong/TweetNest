# TweetNest

## Overview

This is a social network project built with **TypeScript**, **MongoDB**, **JWT**, **Express**, **Swagger**, **Express Validation**, **AWS S3**, and **AWS SES**. The application allows users to sign up, log in, create posts, follow other users, and engage in typical social media interactions like commenting and liking posts. Additionally, it uses AWS S3 for media file storage (e.g., profile pictures, post images) and AWS SES for email notifications (e.g., registration confirmation, password reset).

## Features

- **User Authentication**: Register and log in using JWT for secure session management.
- **Posts and Comments**: Users can create, edit, and delete posts, and comment on others' posts.
- **Follow System**: Follow and unfollow other users to see their activity in your feed.
- **Likes and Reactions**: Like posts and comments.
- **Profile Management**: Update user profile information, including avatar and bio.
- **API Documentation**: Interactive API documentation using Swagger UI.
- **Validation**: Input validation for user data and requests using Express Validation.
- **AWS S3 Integration**: Upload and store user profile pictures, post images, and other media files on AWS S3.
- **AWS SES Integration**: Send transactional emails such as welcome emails and password reset requests.


## Tech Stack

- **TypeScript**: Type-safe JavaScript for server-side logic.
- **Express.js**: Web framework for building the API.
- **MongoDB**: NoSQL database for storing user and post data.
- **JWT**: JSON Web Tokens for handling authentication and session management.
- **Express Validation**: Middleware for validating user inputs.
- **Swagger**: Provides an interactive API documentation for developers to explore and test the endpoints.
- **AWS S3**: Store media files like profile pictures and post images.
- **AWS SES**: Send email notifications to users.


### API Documentation

Swagger API documentation is available at `http://localhost:yourport/api-docs`.

## Project Structure

```bash
📦src
 ┣ 📂constants
 ┣ 📂controllers
 ┣ 📂middlewares
 ┣ 📂models
 ┣ 📂routes
 ┣ 📂services
 ┣ 📂templates
 ┣ 📂utils
 ┣ 📜index.ts
 ┗ 📜type.d.ts
```


## License

This project is licensed under the MIT License.
