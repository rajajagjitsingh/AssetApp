"use client";
import { Label } from "@progress/kendo-react-labels";
import styles from "./css/page.module.css";
import Link from "next/link";
import "firebase/auth";
import {
  AppUserContext,
  UserContext,
  UserProvider,
  useUser,
} from "./services/context";
import React, { useContext } from "react";

export default function Home() {
  return (
    <UserProvider>
      <MainContent />
    </UserProvider>
  );
}
function MainContent() {
  const user = useUser();

  return (
    <main className={styles.main}>
      <div className={styles.description}>
        <p>Assets Viewer</p>
        <div>
          <Label>By Jagjit Singh Bilkhu</Label>
        </div>
      </div>

      <div className={styles.center}>
        <Link href={user ? "/assets" : "./login"}>
          <h2 className={styles.logo}>
            {user ? "Go to Dashboard" : "Get Started"}
          </h2>
        </Link>
      </div>
      <Label>
        {user ? "Hello " + (user?.displayName || user?.email) : "Not Logged In"}
      </Label>

      <div className={styles.grid}>
        <Label className={styles.card}>
          <h2>React</h2>
        </Label>
        <Label className={styles.card}>
          <h2>Google Authentication & FireBase</h2>
        </Label>
        <Label className={styles.card}>
          <h2>Kendo React</h2>
        </Label>
        <Label className={styles.card}>
          <h2>Next.js</h2>
        </Label>
      </div>
    </main>
  );
}
