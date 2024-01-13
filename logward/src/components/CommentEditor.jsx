import React from "react";

const CommentEditor = ({
  title,
  handleName,
  handleComment,
  handlePostClick,
  name,
  comment,
  error,
}) => {
  return (
    <div className="comment-editor py-4 flex justify-center">
      <div
        className={`editor-children p-4 border border-gray-300 rounded bg-gray-100 flex flex-col ${
          title === "Reply" ? "w-[550px]" : "w-[600px]"
        }`}
      >
        <div className="flex mb-2 justify-between">
          <span>{title}</span>
          {error && (
            <span className="text-red-500">All fields are mandatory</span>
          )}
        </div>
        <input
          placeholder="Name"
          type="text"
          className="border border-gray-300 text-gray-900 text-sm rounded block w-full p-1 mb-3 px-2"
          value={name}
          onChange={handleName}
        />
        <textarea
          placeholder={title}
          className="border border-gray-300 text-gray-900 text-sm rounded block w-full p-1 mb-3 px-2"
          value={comment}
          onChange={handleComment}
        />
        <button
          type="button"
          className="border bg-blue-500 py-1 rounded text-sm text-white w-[80px] ml-auto"
          onClick={() => handlePostClick(title)}
        >
          POST
        </button>
      </div>
    </div>
  );
};

export default CommentEditor;
