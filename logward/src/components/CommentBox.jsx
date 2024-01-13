import React, { useState, useEffect } from "react";
import { v4 as uuidv4 } from "uuid";

import NameAndMessageEditor from "./NameAndMessageEditor";
import CommentViewer from "./CommentViewer";

import { formattedDate } from "../utils/getCurrentFormattedDate";

const CommentBox = () => {
  const [name, setName] = useState("");
  const [comment, setComment] = useState("");
  const [comments, setComments] = useState([]);
  const [error, setError] = useState(false);
  const [sorted, setSorted] = useState(false);

  //   set comments in state stored in localstorage
  useEffect(() => {
    setComments(JSON.parse(localStorage.getItem("comments") || "[]"));
    setName("");
    setComment("");
  }, []);

  const handleName = (e) => {
    setName(e.target.value);
  };

  const handleComment = (e) => {
    setComment(e.target.value);
  };

  const handlePostClick = (type) => {
    const trimmedName = name.trim();
    const trimmedComment = comment.trim();

    if (trimmedName && trimmedName) {
      const commentObj = {
        id: uuidv4(),
        name: trimmedName,
        comment: trimmedComment,
        timeStamp: new Date(),
        formattedDate: formattedDate(),
        type,
        replies: [],
        showReplyBox: false,
        editIsEnabled: false,
        editValidation: false,
      };

      const localStorageComments = JSON.parse(
        localStorage.getItem("comments") || "[]"
      );
      const newComments = !sorted
        ? [commentObj, ...localStorageComments]
        : [...localStorageComments, commentObj];

      // setting new comments in localstorage and state
      setUpdatedComments(newComments);

      // clearing name and comment input field after they are set
      setName("");
      setComment("");
      setError(false);
    } else {
      setError(true);
    }
  };

  const handleCommentDelete = (id) => {
    const updatedComments = comments.filter((comment) => comment.id !== id);

    setUpdatedComments(updatedComments);
  };

  const handleSort = () => {
    const prevComments = JSON.parse(JSON.stringify(comments));
    const sortedComments = prevComments.reverse();

    setSorted(!sorted);
    setUpdatedComments(sortedComments);
  };

  const setUpdatedComments = (updatedComments) => {
    setComments(updatedComments);
    localStorage.setItem("comments", JSON.stringify(updatedComments));
  };

  const onEditClick = (id) => {
    const updatedComments = comments.map((comment) => {
      if (comment.id === id) {
        comment.editIsEnabled = true;
      }

      return comment;
    });

    // setting new comments in localstorage and state
    setUpdatedComments(updatedComments);
  };

  const handleEditChange = (id, newComment, blur) => {
    const updatedComments = comments.map((comment) => {
      if (comment.id === id) {
        if (!newComment.trim()) {
          comment.editValidation = true;
        } else {
          comment.editValidation = false;
        }

        if (blur && newComment.trim()) {
          comment.editIsEnabled = false;
        }

        comment.comment = newComment;
      } else {
        comment.editValidation = true;
      }

      return comment;
    });

    // setting new comments in localstorage and state
    setUpdatedComments(updatedComments);
  };

  return (
    <>
      <NameAndMessageEditor
        title="Comment"
        handleName={handleName}
        handleMessage={handleComment}
        handlePostClick={handlePostClick}
        name={name}
        message={comment}
        error={error}
      />
      <CommentViewer
        comments={comments}
        handleCommentDelete={handleCommentDelete}
        handleSort={handleSort}
        sorted={sorted}
        setUpdatedComments={setUpdatedComments}
        onEditClick={onEditClick}
        handleEditChange={handleEditChange}
      />
    </>
  );
};

export default CommentBox;
