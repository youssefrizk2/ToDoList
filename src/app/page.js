"use client";
import { useRouter } from 'next/navigation';
import { initializeApp } from "firebase/app";
import { getAuth, createUserWithEmailAndPassword, signInWithEmailAndPassword, onAuthStateChanged } from "firebase/auth";
import { useState, useEffect } from 'react';
import styles from "./login.module.css";

// Firebase configuration
const firebaseConfig = {
    apiKey: "AIzaSyC5ZxMHwxMFzE4nkB_-Gi5CQ4HRMQNC31s",
    authDomain: "todolist-4a421.firebaseapp.com",
    projectId: "todolist-4a421",
    storageBucket: "todolist-4a421.appspot.com",
    messagingSenderId: "296963303477",
    appId: "1:296963303477:web:2ad61bb9327edcba40e97c",
    measurementId: "G-V0P7BMCJDR"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

const Login = () => {
    const router = useRouter();
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [message, setMessage] = useState('');

    const auth = getAuth(app);

    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, (user) => {
            if (user) {
                // User is signed in
                setMessage(`Welcome, ${user.email}`);
            } else {
                // User is signed out
                setMessage('');
            }
        });

        return () => unsubscribe();
    }, [auth]);

    const handleSignup = async (e) => {
        e.preventDefault();
        try {
            const userCredential = await createUserWithEmailAndPassword(auth, email, password);
            setMessage(`Signed up as ${userCredential.user.email}`);
        } catch (error) {
            setMessage(`Error: ${error.message}`);
        }
    };

    const handleLogin = async (e) => {
        e.preventDefault();
        try {
            const userCredential = await signInWithEmailAndPassword(auth, email, password);
            setMessage(`Logged in as ${userCredential.user.email}`);
            router.push('./todolist'); // Navigate to the todolist page
        } catch (error) {
            setMessage(`Error: ${error.message}`);
        }
    };

    return (
        <div className={styles.container}>
            <div className={styles.titlediv}>
                <h1 className={styles.title}>Please Sign-Up/Login</h1>
            </div>
            <div className={styles.auth}>
                <input
                    type="email"
                    placeholder="Email"
                    className={styles.textinput}
                    onChange={(e) => setEmail(e.target.value)}
                />
                <input
                    type="password"
                    placeholder="Password"
                    className={styles.textinput}
                    onChange={(e) => setPassword(e.target.value)}
                />
                <button type='submit' className={styles.button} onClick={handleSignup}>Sign Up</button>
                <button type='submit' className={styles.button} onClick={handleLogin}>Login</button>
            </div>
            {message && <p>{message}</p>}
        </div>
    );
};

export default Login;