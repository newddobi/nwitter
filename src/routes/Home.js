import Nweet from "components/Nweet";
import { v4 as uuidv4 } from 'uuid';
import { dbService, storageService } from "fbase";
import React, { useEffect, useState } from "react";

const Home = ({ userObj }) => {
    const [nweet, setNweet] = useState("");
    const [nweets, setNweets] = useState([]);
    const [attachment, setAttachment] = useState("");

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
        // for lexical scope issue
        let attachmentUrl = "";

        if (attachment !== "") {
            // 파일에 대한 reference 생성후, 파일을 몇몇 내용과 함께 업데이트
            // 유저 아이디를 기반으로 폴더를 분리
            // uuid 라이브러리 사용 - 특별한 식별자를 랜덤으로 생성
            const attachmentRef = storageService.ref().child(`${userObj.uid}/${uuidv4()}`)
            // 두 번째 인자는 format을 의미한다. readAsDataUrl로 읽었으니 data_url로 설정해준다.
            // putString은 Uploading task를 반환한다.
            const response = await attachmentRef.putString(attachment, "data_url");
            attachmentUrl = await response.ref.getDownloadURL();
        }

        const nweetObj = {
            text: nweet,
            createdAt: Date.now(),
            creatorId: userObj.uid,
            attachmentUrl,
        }
        // Promise 객체 반환
        await dbService.collection("nweets").add(nweetObj);
        // submit하고 나면 입력창 공백으로 설정
        setNweet("");
        setAttachment("");
    };

    const onChange = (event) => {
        // event 안에 있는 target 안에 있는 value를 달라고 하는 것
        const {
            target: { value },
        } = event;
        setNweet(value);
    };

    const onFileChange = (event) => {
        const {
            target: { files },
        } = event;
        const theFile = files[0];
        // 파일을 읽기 위해 fileReader API 사용
        const reader = new FileReader();
        // reader에 event listener 추가
        // finishedEvent의 result는 사진을 텍스트로 반환시켜준 값 브라우저는 이 텍스트를 사진으로 바꿀 수 있다
        reader.onloadend = (finishedEvent) => {
            const {
                currentTarget: { result },
            } = finishedEvent;
            setAttachment(result);
        };
        reader.readAsDataURL(theFile);
    };

    const onClearAttachment = () => setAttachment(null);

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
                <input type="file" accept="image/*" onChange={onFileChange} />
                <input type="submit" value="Nweet" />
                {attachment && (
                    <div>
                        <img alt="prePhoto" src={attachment} width="50px" height="50px" />
                        <button onClick={onClearAttachment}>Clear</button>
                    </div>
                )}
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
