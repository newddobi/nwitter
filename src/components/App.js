import React, { useEffect, useState } from "react";
import AppRouter from "components/Router";
import { authService } from "fbase";

function App() {
    const [init, setInit] = useState(false);
    // const [isLoggedIn, setIsLoggedIn] = useState(false);
    // 유저정보의 경우 애플리케이션의 최상단에 있어야 여러 컴포넌트, 라우터로 보낼 수 있다
    const [userObj, setUserObj] = useState(null);

    // authService.currentUser는 파이어베이스에서 정보를 받아와야하기 때문에 어플리케이션이 초기화 됐을때는 null이다가 이후 값이 채워진다.
    // 사용자의 상태를 지속적으로 체크하는 onAuthStateChanged를 사용해야 한다.
    // console.log(authService.currentUser);
    // setInterval(() => {
    //   console.log(authService.currentUser);
    // }, 2000);

    // 우리가 실제로 로그인이 되었는지 안 되었는지를 알 수 있다.
    useEffect(() => {
        authService.onAuthStateChanged((user) => {
            if (user) {
                setUserObj({
                    displayName: user.displayName,
                    uid: user.uid,
                    updateProfile: (args) => user.updateProfile(args),
                });
            }
            // init이 false라면 router를 숨길 것이다.
            setInit(true);
        });
    }, []);

    // 유저정보가 바뀌면 다른 컴포넌트들에게 정보 전달
    const refreshUser = () => {
        const user = authService.currentUser;
        
        setUserObj({
            displayName: user.displayName,
            uid: user.uid,
            updateProfile: (args) => user.updateProfile(args),
        });
    };

    return (
        <>
            {/* 기본적으로 userObj가 존재할 때 로그인이 된다 */}
            {init ? (
                <AppRouter
                    refreshUser={refreshUser}
                    isLoggedIn={Boolean(userObj)}
                    userObj={userObj}
                />
            ) : (
                "Initializing"
            )}
            <footer>&copy; {new Date().getFullYear()} Nwitter </footer>
        </>
    );
}

export default App;
