"use client";
import styles from "./../css/page.module.css";
import AuthComponent from "../components/authComponent";

const Login = () => {
  return (
    <main className={styles.main}>
      <AuthComponent isLogin={true} />
    </main>
  );
};

export default Login;
