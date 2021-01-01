import { dbService } from "fbase";
import React, { useEffect, useState } from "react";

const Home = () => {
    const [nweet, setNweet] = useState("");
    const [nweets, setNweets] = useState([]);

    // async를 써야하기 때문에 개별함수로 작성
    const getNweets = async() => {
        // get은 Query Snapshot을 반환한다. Query Snapshot은 
        // docs, empty, metadata, query, size 등 여러가지를 가지고 있다.
        const dbNweets = await dbService.collection("nweets").get();
        dbNweets.forEach(document => {
            // 새로 작성한 트윗과 그 이전 것들을 반환
            /* 
                처음봤다면 헷갈릴 수도 있다.
                가끔, set이 붙는 함수를 쓸 때, 값 대신에 함수를 전달할 수 있다. 
                그리고 만약 함수를 전달하면 리액트는 이전 값에 접근할 수 있게 해준다.
            */
            setNweets(prev => [document.data(), ...prev]);
        });
    }
    // 시작할 때 dbService를 가져와서
    useEffect(() => {
        getNweets();
    }, [])

    const onSubmit = async (event) => {
        event.preventDefault();
        // Promise 객체 반환
        await dbService.collection("nweets").add({
            nweet,
            createdAt: Date.now(),
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
        </div>
    );
};
export default Home;
