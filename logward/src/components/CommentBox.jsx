import React, { useState, useEffect } from "react";
import { v4 as uuidv4 } from "uuid";

import CommentEditor from "./CommentEditor";
import CommentViewer from "./CommentViewer";

const CommentBox = () => {
  const [name, setName] = useState("");
  const [comment, setComment] = useState("");
  const [comments, setComments] = useState([]);
  const [error, setError] = useState(false);
  const [sorted, setSorted] = useState(false);

  //   set comments in state stored in localstorage
  useEffect(() => {
    setComments(JSON.parse(localStorage.getItem("comments") || "[]"));
  }, []);

  const handleName = (event) => {
    const value = event.target.value;
    setName(value);
  };

  const handleComment = (event) => {
    const value = event.target.value;
    setComment(value);
  };

  const handlePostClick = (type) => {
    if (name && comment) {
      const timeStamp = new Date();
      const formattedDate = timeStamp
        .toLocaleDateString("en-GB", {
          day: "numeric",
          month: "short",
          year: "numeric",
        })
        .replace(/ /g, " ");

      const commentObj = {
        id: uuidv4(),
        name,
        comment,
        timeStamp,
        formattedDate,
        type,
        replies: [],
      };

      const localStorageComments = JSON.parse(
        localStorage.getItem("comments") || "[]"
      );
      const newComments = !sorted
        ? [commentObj, ...localStorageComments]
        : [...localStorageComments, commentObj];

      // setting new comments in localstorage
      localStorage.setItem("comments", JSON.stringify(newComments));

      // clearing name and comment input field after they are set
      setName("");
      setComment("");
      setComments(newComments);
      setError(false);
    } else {
      setError(true);
    }
  };

  const handleCommentDelete = (id) => {
    const prevComments = JSON.parse(JSON.stringify(comments));
    const updatedComments = prevComments.filter((comment) => comment.id !== id);

    setComments(updatedComments);
    localStorage.setItem("comments", JSON.stringify(updatedComments));
  };

  const handleSort = () => {
    setSorted(!sorted);

    const prevComments = JSON.parse(JSON.stringify(comments));
    const sortedComments = prevComments.reverse();

    setComments(sortedComments);
    localStorage.setItem("comments", JSON.stringify(sortedComments));
  };

  return (
    <>
      <CommentEditor
        title="Comment"
        handleName={handleName}
        handleComment={handleComment}
        handlePostClick={handlePostClick}
        name={name}
        comment={comment}
        error={error}
      />
      <CommentViewer
        comments={comments}
        handleCommentDelete={handleCommentDelete}
        handleSort={handleSort}
        sorted={sorted}
      />
    </>
  );
};

export default CommentBox;
