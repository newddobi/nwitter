import { authService, dbService } from "fbase";
import React, { useEffect, useState } from "react";
import { useHistory } from "react-router-dom";

export default ({ refreshUser, userObj }) => {
    const history = useHistory();
    const [newDisplayName, setNewDisplayName] = useState(userObj.displayName);

    useEffect(() => {
        getMyNweets();
    }, []);

    const onLogOutClick = () => {
        authService.signOut();
        history.push("/");
    };

    const getMyNweets = async () => {
        // where 등으로 DB를 필터링 할 수 있다
        const nweets = await dbService
            .collection("nweets")
            .where("creatorId", "==", userObj.uid)
            .orderBy("createdAt")
            .get();
        console.log(nweets.docs.map((doc) => doc.data()));
    };

    const onChange = (event) => {
        const {
            target: { value },
        } = event;
        setNewDisplayName(value);
    };

    const onSubmit = async (event) => {
        event.preventDefault();
        // 이름이 변경됐을 때만 수정 가능
        // 파이어베이스의 한계 - 유저 프로필에 많은 정보를 담을 수가 없다
        if (userObj.displayName !== newDisplayName) {
            // updateProfile 메소드는 아무것도 반환하지 않는다
            // 이슈발생 - 사용자 이름을 바꿔도 화면에서는 이전 이름을 가지고 있다
            await userObj.updateProfile({
                displayName: newDisplayName,
            });
            // firebase에 있는 profile을 업데이트 시켜준 후에 리액트에 있는 profile 새로고침
            refreshUser();
        }
    };

    return (
        <div className="container">
            <form onSubmit={onSubmit} className="profileForm">
                <input
                    onChange={onChange}
                    type="text"
                    autoFocus
                    placeholder="Display name"
                    value={newDisplayName}
                    className="formInput"
                />
                <input
                    type="submit"
                    value="Update Profile"
                    className="formBtn"
                    style={{
                        marginTop: 10,
                    }}
                />
            </form>
            <span className="formBtn cancelBtn logOut" onClick={onLogOutClick}>
                Log Out
            </span>
        </div>
    );
};
