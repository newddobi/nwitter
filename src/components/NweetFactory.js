import { dbService, storageService } from "fbase";
import React, { useState } from "react";
import { v4 as uuidv4 } from "uuid";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPlus, faTimes } from "@fortawesome/free-solid-svg-icons";

const NweetFactory = ({ userObj }) => {
    const [nweet, setNweet] = useState("");
    const [attachment, setAttachment] = useState("");

    const onSubmit = async (event) => {
        if (nweet === "") {
            return;
        }

        event.preventDefault();

        // for lexical scope issue
        let attachmentUrl = "";

        if (attachment !== "") {
            // 파일에 대한 reference 생성후, 파일을 몇몇 내용과 함께 업데이트
            // 유저 아이디를 기반으로 폴더를 분리
            // uuid 라이브러리 사용 - 특별한 식별자를 랜덤으로 생성
            const attachmentRef = storageService
                .ref()
                .child(`${userObj.uid}/${uuidv4()}`);

            // 두 번째 인자는 format을 의미한다. readAsDataUrl로 읽었으니 data_url로 설정해준다.
            // putString은 Uploading task를 반환한다.
            const response = await attachmentRef.putString(
                attachment,
                "data_url"
            );
            attachmentUrl = await response.ref.getDownloadURL();
        }

        const nweetObj = {
            text: nweet,
            createdAt: Date.now(),
            creatorId: userObj.uid,
            attachmentUrl,
        };

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

    const onClearAttachment = () => setAttachment("");

    return (
        <form onSubmit={onSubmit} className="factoryForm">
            <div className="factoryInput__container">
                <input
                    className="factoryInput__input"
                    value={nweet}
                    onChange={onChange}
                    type="text"
                    placeholder="What's on your mind?"
                    maxLength={120}
                />
                <input
                    type="submit"
                    value="&rarr;"
                    className="factoryInput__arrow"
                />
            </div>
            <label htmlFor="attach-file" className="factoryInput__label">
                <span>Add photos</span>
                <FontAwesomeIcon icon={faPlus} />
            </label>
            <input
                id="attach-file"
                type="file"
                accept="image/*"
                onChange={onFileChange}
                style={{
                    opacity: 0,
                }}
            />
            {attachment && (
                <div className="factoryForm__attachment">
                    <img
                        src={attachment}
                        style={{
                            backgroundImage: attachment,
                        }}
                    />
                    <div
                        className="factoryForm__clear"
                        onClick={onClearAttachment}
                    >
                        <span>Remove</span>
                        <FontAwesomeIcon icon={faTimes} />
                    </div>
                </div>
            )}
        </form>
    );
};

export default NweetFactory;
