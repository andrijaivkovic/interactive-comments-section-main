// import { useState } from "react";

import Comment from "../Comment/Comment";

const CommentContainer = ({
  id,
  content,
  createdAt,
  score,
  user,
  replies,
  currentUser,
  handleAddComment,
  handleAddCommentToDelete,
  handleVoteComment,
  handleEditComment,
}) => {
  const hasReplies = !!replies.length;

  return (
    <>
      <div className="comment-container">
        <Comment
          id={id}
          currentUser={currentUser}
          key={id}
          content={content}
          createdAt={createdAt}
          score={score}
          user={user}
          handleAddComment={handleAddComment}
          handleAddCommentToDelete={handleAddCommentToDelete}
          handleVoteComment={handleVoteComment}
          handleEditComment={handleEditComment}
        ></Comment>
        <div
          style={{ display: hasReplies ? "flex" : "none" }}
          className="comment-replies-container"
        >
          {hasReplies &&
            replies.map((reply) => (
              <Comment
                id={reply.id}
                globalCommentId={id}
                replyingTo={reply.replyingTo}
                currentUser={currentUser}
                key={reply.id}
                content={reply.content}
                createdAt={reply.createdAt}
                score={reply.score}
                user={reply.user}
                handleAddComment={handleAddComment}
                handleAddCommentToDelete={handleAddCommentToDelete}
                handleVoteComment={handleVoteComment}
                handleEditComment={handleEditComment}
              ></Comment>
            ))}
        </div>
      </div>
    </>
  );
};

export default CommentContainer;
