"use client";
import React, { useState } from "react";
import { createUserWithEmailAndPassword, updateProfile } from "firebase/auth";
import { auth } from "../services/firebase";
import { Label } from "@progress/kendo-react-labels";
import styles from "./../css/page.module.css";
import { TextBox } from "@progress/kendo-react-inputs";
import { signInWithEmailAndPassword } from "firebase/auth";
import Link from "next/link";
import { Button } from "@progress/kendo-react-buttons";
import { useRouter } from "next/navigation";
import { Loader } from "@progress/kendo-react-indicators";
export interface authComponentProps {
  isLogin: boolean;
}

const AuthComponent = (props: authComponentProps) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [errorText, setErrorText] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  const passwordChange = React.useCallback(
    (event: any) => {
      setPassword(event.target.value);
    },
    [password]
  );

  const emailChange = React.useCallback(
    (event: any) => {
      setEmail(event.target.value);
    },
    [email]
  );
  const firstNameChange = React.useCallback(
    (event: any) => {
      setFirstName(event.target.value);
    },
    [firstName]
  );
  const lastNameChange = React.useCallback(
    (event: any) => {
      setLastName(event.target.value);
    },
    [lastName]
  );

  const onSubmit = async (e: any) => {
    e.preventDefault();
    setIsLoading(true);
    if (props.isLogin) {
      signInWithEmailAndPassword(auth, email, password)
        .then((userCredential) => {
          debugger;
          setIsLoading(false);
          // Signed in
          const user = userCredential.user;
          // navigate("/home");
          console.log(user);
          router.push("./assets");
        })
        .catch((error) => {
          setErrorText(error.message);
          setIsLoading(false);
          const errorCode = error.code;
          const errorMessage = error.message;
          console.log(errorCode, errorMessage);
        });
    } else {
      createUserWithEmailAndPassword(auth, email, password)
        .then(async (userCredential) => {
          const user = userCredential.user;
          await updateProfile(user, {
            displayName: firstName + " " + lastName,
          })
            .then((res) => {
              setIsLoading(false);
              router.push("./assets");
              debugger;
            })
            .catch((error) => {
              setIsLoading(false);
              setErrorText(error.message);
              const errorCode = error.code;
              const errorMessage = error.message;
              console.log(errorCode, errorMessage);
            });
          // Signed in
          console.log(user);
          // navigate("/login");
        })
        .catch((error) => {
          setIsLoading(false);
          debugger;
          setErrorText(error.message);
          const errorCode = error.code;
          const errorMessage = error.message;
          console.log(errorCode, errorMessage);
        });
    }
  };
  const loginLabel = props.isLogin ? "SignIn" : "SignUp";
  return (
    <section id="authSection">
      <div>
        {isLoading && <Loader size="large" />}
        <div>
          <Label className={styles.labelItem}>Assets</Label>
          <Label className={styles.labelItem}>
            <h4>{loginLabel}</h4>
          </Label>
          <form>
            {!props.isLogin && (
              <>
                <div className={styles.formInputDiv}>
                  <Label className={styles.labelItem}>First Name</Label>

                  <TextBox
                    type="text"
                    aria-placeholder="First Name"
                    value={firstName}
                    onChange={firstNameChange}
                    required
                    disabled={isLoading}
                    placeholder="First Name"
                  ></TextBox>
                </div>
                <div className={styles.formInputDiv}>
                  <Label className={styles.labelItem}>Last Name</Label>

                  <TextBox
                    type="text"
                    aria-placeholder="Last Name"
                    value={lastName}
                    onChange={lastNameChange}
                    required
                    disabled={isLoading}
                    placeholder="Last Name"
                  ></TextBox>
                </div>
              </>
            )}
            <div className={styles.formInputDiv}>
              <Label className={styles.labelItem}>Email address</Label>

              <TextBox
                type="email"
                aria-placeholder="Email address"
                value={email}
                onChange={emailChange}
                required
                disabled={isLoading}
                placeholder="Email address"
              ></TextBox>
            </div>

            <div className={styles.formInputDiv}>
              <Label className={styles.labelItem}>Password</Label>
              <TextBox
                type="password"
                aria-placeholder="Create password"
                value={password}
                onChange={passwordChange}
                required
                disabled={isLoading}
                placeholder="Password"
              ></TextBox>
            </div>
            <div className={styles.formInputDiv}>
              <Button
                title={loginLabel}
                type="submit"
                onClick={onSubmit}
                disabled={isLoading}
              >
                {loginLabel}
              </Button>
            </div>
          </form>
          {props.isLogin ? (
            <p>
              Dont have an account?{" "}
              <Link href="./signup">
                <b>Sign Up</b>
              </Link>
            </p>
          ) : (
            <p>
              Already have an account?{" "}
              <Link href="./login">
                <b>Sign in</b>
              </Link>
            </p>
          )}
        </div>
        {isLoading && <Loader size="large" />}
        {errorText && (
          <h4 style={{ color: "red", padding: "10px" }}>{errorText}</h4>
        )}
      </div>
    </section>
  );
};

export default AuthComponent;
