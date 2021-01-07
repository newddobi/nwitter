import { dbService, storageService } from "fbase";
import React, { useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTrash, faPencilAlt } from "@fortawesome/free-solid-svg-icons";

const Nweet = ({ nweetObj, isOwner }) => {
    // 수정모드인지 아닌지 알려줌
    const [editing, setEditing] = useState(false);
    // input에 입력된 text 업데이트
    const [newNweet, setNewNweet] = useState(nweetObj.text);

    const onDeleteClick = async () => {
        const ok = window.confirm(
            "Are you sure you want to delete this nweet?"
        );
        console.log(ok);
        if (ok) {
            await dbService.doc(`nweets/${nweetObj.id}`).delete();
            // 저장된 사진 지우기
            await storageService.refFromURL(nweetObj.attachmentUrl).delete();
        }
    };

    const toggleEditing = () => setEditing((prev) => !prev);

    const onSubmit = async (event) => {
        event.preventDefault();
        console.log(nweetObj, newNweet);
        await dbService.doc(`nweets/${nweetObj.id}`).update({
            text: newNweet,
        });
        setEditing(false);
    };

    const onChange = (event) => {
        const {
            target: { value },
        } = event;
        setNewNweet(value);
    };

    return (
        <div className="nweet">
            {editing ? (
                <>
                    {/* 보안에 신경쓰고 싶다면 주인인 사람만 form을 볼 수 있도록 할 수 있다 */}
                    {isOwner && (
                        <>
                            <form
                                onSubmit={onSubmit}
                                className="container nweetEdit"
                            >
                                <input
                                    type="text"
                                    placeholder="Edit your nweet"
                                    value={newNweet}
                                    required
                                    autoFocus
                                    onChange={onChange}
                                    className="formInput"
                                />
                                <input
                                    type="submit"
                                    value="Update Nweet"
                                    className="formBtn"
                                />
                            </form>
                            <span
                                onClick={toggleEditing}
                                className="formBtn cancelBtn"
                            >
                                Cancel
                            </span>
                        </>
                    )}
                </>
            ) : (
                <>
                    <h4>{nweetObj.text}</h4>
                    {nweetObj.attachmentUrl && (
                        <img src={nweetObj.attachmentUrl} />
                    )}
                    {isOwner && (
                        <div class="nweet__actions">
                            <span onClick={onDeleteClick}>
                                <FontAwesomeIcon icon={faTrash} />
                            </span>
                            <span onClick={toggleEditing}>
                                <FontAwesomeIcon icon={faPencilAlt} />
                            </span>
                        </div>
                    )}
                </>
            )}
        </div>
    );
};

export default Nweet;
