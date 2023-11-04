// "use client" is not a standard JavaScript or React import statement.

// Import React and useState from the "react" library.
import React from "react";

// Import CSS styles for styling the component.
import styles from "./../css/page.module.css";

// Import the AuthComponent, which handles authentication.
import AuthComponent from "../components/authComponent";

// Define the Signup component, which represents the signup page.
const Signup = () => {
  return (
    // Render the main content of the component wrapped in a <main> element with the "main" CSS class.
    <main className={styles.main}>
      {/* Render the AuthComponent with the isLogin prop set to false, indicating it's a signup page. */}
      <AuthComponent isLogin={false} />
    </main>
  );
};

// Export the Signup component to make it available for use in other parts of the application.
export default Signup;
