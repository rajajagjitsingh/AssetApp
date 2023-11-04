# Next.js React App with KendoReact, Firebase Authentication, and Storage

This repository contains a module of an asset management app which I developed for my work as an in house Asset Tracking and Maintenance Application in Dataverse.

This Module demonstrates ability to add, edit, view assets in a grid and a map view.

Due to privacy, I redeveloped this app for the purpuse of this assignment and created it in a whole new private repository. It utilizes Kendo UI React Framework with a trial license key and Google firebase for authentication and NOSQL storage.

In this repository there is a quick preview demo of the app running locally on my machine.

The whole in house application is much more intergrated and extensive covering more areas such as work orders, service history and many other properties.
Using powerautomate and azure functions, the application is able to automatically update asset locations by making scheduled calls to a GPS API - Visionlink to receive updated location coordinates and readings such as machine hours, odometer readings which in the background then updates the values to display.

## Features

- **Next.js:** This application is built using Next.js, a popular React framework that simplifies server-side rendering, routing, and other aspects of React development.

- **KendoReact Trial License:** We've used KendoReact, a comprehensive library of UI components for React applications, under a trial license. This provides access to a wide range of high-quality components for creating stunning user interfaces.

- **Google Firebase Authentication:** Authentication is a crucial aspect of many web applications. In this project, we've integrated Google Firebase Authentication to secure your app and manage user accounts. Users can sign up, log in, and enjoy a personalized experience.

- **Google Firebase Storage:** Storing and managing files in web applications can be challenging. With Google Firebase Storage, you can easily upload and manage user-generated content, making it ideal for various projects.

## Prerequisites

Before running this application, make sure you have the following dependencies and accounts set up:

- **Node.js:** Ensure you have Node.js installed on your system.

- **Google Firebase:** Set up a Firebase project and configure it for authentication and storage. Update the Firebase configuration in the app accordingly.

## Getting Started


**Clone the repository to your local machine**:

   ```shell
   git clone <repository_url>
   cd <repository_directory>
Install the project dependencies:

shell
Copy code
npm install
Configure your Firebase credentials in the project. You can do this by updating the Firebase configuration in the code or by using environment variables.

Start the development server:

shell
Copy code
npm run dev
Open your browser and access the application at http://localhost:3000.

Usage
Feel free to explore and customize the application to meet your specific needs. You can add more components, extend functionality, and tailor it to your project's requirements.

License
This project is licensed under the terms of the KendoReact Trial License. Please refer to the KendoReact license documentation for more details.

Feedback and Contributions
We welcome feedback, bug reports, and contributions from the community. If you find any issues or have ideas for improvement, please open an issue or create a pull request.

Author
Jagjit Singh - Your GitHub Profile

Acknowledgments
Special thanks to KendoReact and Google Firebase for their amazing tools and services.