import Nweet from "components/Nweet";
import { dbService } from "fbase";
import React, { useEffect, useState } from "react";

const Home = ({ userObj }) => {
    const [nweet, setNweet] = useState("");
    const [nweets, setNweets] = useState([]);

    // 오래된 방식이기 때문에 다른 방법으로 코드 작성
    // async를 써야하기 때문에 개별함수로 작성
    // const getNweets = async() => {
    //     // get은 Query Snapshot을 반환한다. Query Snapshot은
    //     // docs, empty, metadata, query, size 등 여러가지를 가지고 있다.
    //     const dbNweets = await dbService.collection("nweets").get();
    //     dbNweets.forEach(document => {
    //         const nweetObject = {
    //             ...document.data(),
    //             id: document.id,
    //         }
    //         // 새로 작성한 트윗과 그 이전 것들을 반환
    //         /*
    //             처음봤다면 헷갈릴 수도 있다.
    //             가끔, set이 붙는 함수를 쓸 때, 값 대신에 함수를 전달할 수 있다.
    //             그리고 만약 함수를 전달하면 리액트는 이전 값에 접근할 수 있게 해준다.
    //         */
    //         setNweets(prev => [nweetObject, ...prev]);
    //     });
    // }

    // 위의 getNweets 방식보더 더 적게 re-render 하기 때문에 더 빠르게 실행하도록 만들어준다
    useEffect(() => {
        // getNweets();

        // 데이터 베이스의 변화를 알려줌(read, delete, update etc)
        // nweets는 우리가 페이지를 불러올 때 snapshot에서 나온다
        // listener로 snapshot을 사용중
        dbService.collection("nweets").onSnapshot((snapshot) => {
            const nweetArray = snapshot.docs.map((doc) => ({
                id: doc.id,
                ...doc.data(),
            }));
            setNweets(nweetArray);
        });
    }, []);

    const onSubmit = async (event) => {
        event.preventDefault();
        // Promise 객체 반환
        await dbService.collection("nweets").add({
            text: nweet,
            createdAt: Date.now(),
            creatorId: userObj.uid,
        });
        // submit하고 나면 입력창 공백으로 설정
        setNweet("");
    };

    const onChange = (event) => {
        // event 안에 있는 target 안에 있는 value를 달라고 하는 것
        const {
            target: { value },
        } = event;
        setNweet(value);
    };

    return (
        <div>
            <form onSubmit={onSubmit}>
                <input
                    value={nweet}
                    onChange={onChange}
                    type="text"
                    placeholder="What's on your mind"
                    maxLength={120}
                />
                <input type="submit" value="Nweet" />
            </form>
            <div>
                {nweets.map((nweet) => (
                    <Nweet
                        key={nweet.id}
                        nweetObj={nweet}
                        isOwner={nweet.creatorId === userObj.uid}
                    />
                ))}
            </div>
        </div>
    );
};
export default Home;
