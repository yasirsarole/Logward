import React, { useState } from "react";

import CommentEditor from "./CommentEditor";

import arrowDown from "../images/arrow-down.svg";
import deleteImg from "../images/delete.svg";

const CommentViewer = ({
  comments,
  handleCommentDelete,
  handleSort,
  sorted,
}) => {
  const [replyName, setReplyName] = useState("");
  const [reply, setReply] = useState("");
  const [replyError, setReplyError] = useState(false);

  const commentsArr = !comments.length
    ? JSON.parse(localStorage.getItem("comments"))
    : comments || [];

  const handleReplyName = () => {
    console.log("handleReplyName");
  };

  const handleReply = () => {
    console.log("handleReply");
  };

  const handleReplyClick = () => {
    console.log("handleReplyClick");
  };

  return (
    <div className="comment-viewer flex justify-center">
      {!!Array.isArray(commentsArr) && !!commentsArr.length && (
        <div className="flex justify-center flex-col w-[600px]">
          <span
            className="block mb-2 cursor-pointer ml-auto flex"
            onClick={handleSort}
          >
            Sort By: Date and Time
            <img
              className={`w-[20px] ${sorted && `transform rotate-[180deg]`}`}
              src={arrowDown}
              alt="Arrow Down"
            />
          </span>
          {commentsArr.map(
            ({ id, comment, formattedDate, name, replies, type }) => (
              <div key={id}>
                <div className="editor-children p-4 border border-gray-300 rounded w-[600px] bg-gray-100 flex flex-col mb-3 relative">
                  <div className="flex justify-between mb-3">
                    <span className="font-bold capitalize">{name}</span>
                    <span>{formattedDate}</span>
                  </div>
                  <p className="mb-3">{comment}</p>
                  <div className="flex font-bold text-blue-500">
                    <span className="mr-4 text-sm cursor-pointer hover:underline">
                      Reply
                    </span>
                    <span className="text-sm cursor-pointer hover:underline">
                      Edit
                    </span>
                  </div>
                  <img
                    className="w-[20px] absolute right-[-11px] top-[50%] transform translate-y-[-50%] cursor-pointer"
                    src={deleteImg}
                    alt="Delete"
                    onClick={() => handleCommentDelete(id)}
                  />
                </div>
                <div className="reply-container pl-2">
                  <CommentEditor
                    title="Reply"
                    handleName={handleReplyName}
                    handleComment={handleReply}
                    handlePostClick={handleReplyClick}
                    name={replyName}
                    comment={reply}
                    error={replyError}
                  />
                </div>
              </div>
            )
          )}
        </div>
      )}
    </div>
  );
};

export default CommentViewer;
