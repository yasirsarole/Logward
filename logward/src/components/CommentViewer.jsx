import React, { useState } from "react";
import { v4 as uuidv4 } from "uuid";

import NameAndMessageEditor from "./NameAndMessageEditor";

import arrowDown from "../images/arrow-down.svg";
import deleteImg from "../images/delete.svg";

import { formattedDate } from "../utils/getCurrentFormattedDate";

const CommentViewer = ({
  comments,
  handleCommentDelete,
  handleSort,
  sorted,
  setUpdatedComments,
  commentId,
  onEditClick,
  handleEditChange,
}) => {
  const [replyName, setReplyName] = useState("");
  const [reply, setReply] = useState("");
  const [replyError, setReplyError] = useState(false);

  const commentsArr = !comments.length
    ? JSON.parse(localStorage.getItem("comments"))
    : comments || [];

  const handleReplyName = (e) => {
    setReplyName(e.target.value);
  };

  const handleReply = (e) => {
    setReply(e.target.value);
  };

  const handleReplyClick = (id) => {
    const trimmedName = replyName.trim();
    const trimmedReply = reply.trim();

    if (trimmedName && trimmedReply) {
      const replyObj = {
        id: uuidv4(),
        name: trimmedName,
        comment: trimmedReply,
        timeStamp: new Date(),
        formattedDate: formattedDate(),
        type: "Reply",
      };

      const prevComments = JSON.parse(JSON.stringify(comments));
      const updatedComments = prevComments.map((comment) => {
        if (comment.id === id) {
          comment.showReplyBox = false;
          comment.replies = [replyObj, ...(comment.replies || [])];
        }

        return comment;
      });

      // setting new comments in localstorage and state
      setUpdatedComments(updatedComments);

      // clearing name and comment input field after they are set
      setReply("");
      setReplyName("");
      setReplyError(false);
    } else {
      setReplyError(true);
    }
  };

  const onReplyClick = (id) => {
    const prevComments = JSON.parse(JSON.stringify(comments));
    const updatedComments = prevComments.map((comment) => {
      if (comment.id === id) {
        comment.showReplyBox = true;
      } else {
        // only 1 comment reply at one time
        comment.showReplyBox = false;
        setReply("");
        setReplyName("");
      }

      return comment;
    });

    // setting new comments in localstorage and state
    setUpdatedComments(updatedComments);
  };

  const handleReplyDelete = (replyId, commentId) => {
    const prevComments = JSON.parse(JSON.stringify(comments));
    const filteredComment = prevComments.filter(
      (comment) => comment.id === commentId
    )[0];

    filteredComment.replies = filteredComment.replies.filter(
      (reply) => reply.id !== replyId
    );
    setUpdatedComments(prevComments);
  };

  const handleReplyEdit = (replyId, newReply, blur, commentId) => {
    const prevComments = JSON.parse(JSON.stringify(comments));
    const filteredComment = prevComments.filter(
      (comment) => comment.id === commentId
    )[0];

    filteredComment.replies = filteredComment.replies.map((reply) => {
      if (reply.id === replyId) {
        if (!newReply.trim()) {
          reply.editValidation = true;
        } else {
          reply.editValidation = false;
        }

        if (blur && newReply.trim()) {
          reply.editIsEnabled = false;
        }

        reply.comment = newReply;
      } else {
        reply.editValidation = true;
      }

      return reply;
    });

    // setting new comments in localstorage and state
    setUpdatedComments(prevComments);
  };

  const handleReplyEditClick = (replyId, commentId) => {
    const prevComments = JSON.parse(JSON.stringify(comments));
    const filteredComment = prevComments.filter(
      (comment) => comment.id === commentId
    )[0];

    filteredComment.replies = filteredComment.replies.map((reply) => {
      if (reply.id === replyId) {
        reply.editIsEnabled = true;
      }

      return reply;
    });

    // setting new comments in localstorage and state
    setUpdatedComments(prevComments);
  };

  return (
    <div className="comment-viewer flex justify-center">
      {Array.isArray(commentsArr) && commentsArr.length > 0 && (
        <div className="flex justify-center flex-col">
          {commentsArr[0].replies && (
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
          )}

          {commentsArr.map(
            ({
              id,
              comment,
              formattedDate,
              name,
              replies,
              type,
              showReplyBox,
              editIsEnabled,
              editValidation,
            }) => (
              <div
                key={id}
                className={`comment-item ${
                  type === "Reply" ? "w-[550px]" : "w-[600px]"
                }`}
              >
                <div className="editor-children p-4 border border-gray-300 rounded bg-gray-100 flex flex-col mb-3 relative">
                  <div className="flex justify-between mb-3">
                    <span className="font-bold capitalize">{name}</span>
                    <span>{formattedDate}</span>
                  </div>

                  {editIsEnabled ? (
                    <textarea
                      className={`border ${
                        editValidation ? "border-red-500" : "border-gray-300"
                      } text-gray-900 text-sm rounded block w-full p-1 mb-3 px-2 mb-3 outline-none comment-textarea`}
                      value={comment}
                      onBlur={(e) =>
                        handleEditChange(id, e.target.value, true, commentId)
                      }
                      autoFocus
                      onChange={(e) =>
                        handleEditChange(id, e.target.value, false, commentId)
                      }
                    />
                  ) : (
                    <p className="mb-3">{comment}</p>
                  )}

                  <div className="flex font-bold text-blue-500">
                    {type !== "Reply" && (
                      <span
                        className="mr-4 text-sm cursor-pointer hover:underline"
                        onClick={() => onReplyClick(id)}
                      >
                        Reply
                      </span>
                    )}
                    <span
                      className="text-sm cursor-pointer hover:underline"
                      onClick={() => onEditClick(id, commentId)}
                    >
                      Edit
                    </span>
                  </div>
                  <img
                    className="w-[20px] absolute right-[-11px] top-[50%] transform translate-y-[-50%] cursor-pointer"
                    src={deleteImg}
                    alt="Delete"
                    onClick={() => handleCommentDelete(id, commentId)}
                  />
                </div>

                <div className="reply-container ml-[50px]">
                  {showReplyBox && (
                    <NameAndMessageEditor
                      title="Reply"
                      handleName={handleReplyName}
                      handleMessage={handleReply}
                      handlePostClick={() => handleReplyClick(id)}
                      name={replyName}
                      message={reply}
                      error={replyError}
                    />
                  )}

                  {Array.isArray(replies) && replies.length > 0 && (
                    <CommentViewer
                      comments={replies}
                      handleCommentDelete={handleReplyDelete}
                      commentId={id}
                      onEditClick={handleReplyEditClick}
                      handleEditChange={handleReplyEdit}
                    />
                  )}
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
