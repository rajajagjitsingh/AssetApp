"use client";
// Import CSS styles for styling the component.
import styles from "./../css/page.module.css";

// Import the AuthComponent, which handles authentication.
import AuthComponent from "../components/authComponent";

// Define the Login component, which represents the login page.
const Login = () => {
  return (
    <main className={styles.main}>
      {/* Render the AuthComponent with the isLogin prop set to true, indicating it's a login page. */}
      <AuthComponent isLogin={true} />
    </main>
  );
};

// Export the Login component to make it available for use in other parts of the application.
export default Login;
