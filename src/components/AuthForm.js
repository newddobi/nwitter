import { authService } from "fbase";
import React, { useState } from "react";

const AuthForm = () => {
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

    return (
        <>
            <form onSubmit={onSubmit} className="container">
                <input
                    name="email"
                    type="email"
                    placeholder="Email"
                    required
                    value={email}
                    onChange={onChange}
                    className="authInput"
                />
                <input
                    name="password"
                    type="password"
                    placeholder="Password"
                    required
                    value={password}
                    onChange={onChange}
                    className="authInput"
                />
                <input
                    type="submit"
                    className="authInput authSubmit"
                    value={newAccount ? "Create Account" : "Log In"}
                />
                {error && <span className="authError">{error}</span>}
            </form>
            <span onClick={toggleAccount} className="authSwitch">
                {newAccount ? "Sign in" : "Create Account"}
            </span>
        </>
    );
};

export default AuthForm;
