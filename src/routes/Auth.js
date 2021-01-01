import { authService, firebaseInstance } from "fbase";
import React, { useState } from "react";

// 자동으로 import를 해주려면 const와 export default 분리하여 사용
const Auth = () => {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [newAccount, setNewAccount] = useState(true);
    const [error, setError] = useState("");
    // 서로 다른 onChange function을 만들지 않기 위해 하나를 만들어 사용한다.
    const onChange = (event) => {
        const {
            target: { name, value },
        } = event;
        if (name === "email") {
            setEmail(value);
        } else if (name === "password") {
            setPassword(value);
        }
    };
    const onSubmit = async (event) => {
        // 내가 컨트롤 할 수 있게 기본 이벤트를 방지한다.
        // 예를들어 form의 onSubmit을 누르면 새 페이지로 리프레쉬 되는데 이를 방지해준다.
        event.preventDefault();
        try {
            let data;
            if (newAccount) {
                // create account
                // createUserWithEmailAndPassword는 Promise 객체를 반환한다.
                // 사용자 계정을 성공적으로 만들면, 이 사용자는 어플리케이션에 바로 로그인 될 것이다.
                data = await authService.createUserWithEmailAndPassword(
                    email,
                    password
                );
            } else {
                // log in
                data = await authService.signInWithEmailAndPassword(
                    email,
                    password
                );
            }
            console.log(data);
        } catch (error) {
            setError(error.message);
        }
    };

    // newAccount의 이전 값을 가져와서 그 값에 반대되는 것을 반환
    const toggleAccount = () => setNewAccount((prev) => !prev);
    const onSocialClick = async (event) => {
        const {
            target: { name },
        } = event;
        let provider;
        if (name === "google") {
            provider = new firebaseInstance.auth.GoogleAuthProvider();
        } else if (name === "github") {
            provider = new firebaseInstance.auth.GithubAuthProvider();
        }
        const data = await authService.signInWithPopup(provider);
        console.log(data);
    };
    return (
        <div>
            <form onSubmit={onSubmit}>
                <input
                    name="email"
                    type="email"
                    placeholder="Email"
                    required
                    value={email}
                    onChange={onChange}
                />
                <input
                    name="password"
                    type="password"
                    placeholder="Password"
                    required
                    value={password}
                    onChange={onChange}
                />
                <input
                    type="submit"
                    value={newAccount ? "Create Account" : "Log In"}
                />
            </form>
            <span onClick={toggleAccount}>
                {newAccount ? "Sign in" : "Create Account"}
            </span>
            {error}
            <div>
                <button name="google" onClick={onSocialClick}>
                    Continue with Google
                </button>
                <button name="github" onClick={onSocialClick}>
                    Continue with Github
                </button>
            </div>
        </div>
    );
};
export default Auth;
