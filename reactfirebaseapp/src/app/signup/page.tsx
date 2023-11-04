"use client";
import React, { useState } from "react";
import styles from "./../css/page.module.css";
import AuthComponent from "../components/authComponent";

const Signup = () => {
  return (
    <main className={styles.main}>
      <AuthComponent isLogin={false} />
    </main>
  );
};

export default Signup;
