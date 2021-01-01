import React, { useEffect, useState } from "react";
import AppRouter from "components/Router";
import { authService } from "fbase";

function App() {
    const [init, setInit] = useState(false);
    const [isLoggedIn, setIsLoggedIn] = useState(false);

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
                setIsLoggedIn(true);
            } else {
                setIsLoggedIn(false);
            }
            // init이 false라면 router를 숨길 것이다.
            setInit(true);
        });
    }, []);

    return (
        <>
            {init ? <AppRouter isLoggedIn={isLoggedIn} /> : "Initializing"}
            <footer>&copy; {new Date().getFullYear()} Nwitter </footer>
        </>
    );
}

export default App;
