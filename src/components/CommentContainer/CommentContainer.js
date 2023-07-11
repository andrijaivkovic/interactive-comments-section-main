import { useState } from "react";

import Comment from "../Comment/Comment";
import CommentInput from "../CommentInput/CommentInput";

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

  const [isReplyBoxOpen, setReplyBoxOpen] = useState(false);
  const [replyTo, setReplyTo] = useState("");

  const handleOpenReplyBox = (username) => {
    setReplyBoxOpen(false);
    setReplyTo(username);
    setReplyBoxOpen(true);
  };

  const handleCloseReplyBox = () => {
    setReplyTo(null);
    setReplyBoxOpen(false);
  };

  const addComment = (commentObject) => {
    handleAddComment(commentObject, id);
    setReplyBoxOpen(false);
  };

  return (
    <>
      <div className="comment-container">
        <Comment
          id={id}
          setReplyTo={setReplyTo}
          handleReplyBox={handleOpenReplyBox}
          currentUser={currentUser}
          key={id}
          content={content}
          createdAt={createdAt}
          score={score}
          user={user}
          handleAddCommentToDelete={handleAddCommentToDelete}
          handleVoteComment={handleVoteComment}
          handleEditComment={handleEditComment}
        ></Comment>
        <div
          style={{ display: hasReplies || isReplyBoxOpen ? "flex" : "none" }}
          className="comment-replies-container"
        >
          {hasReplies &&
            replies.map((reply) => (
              <Comment
                id={reply.id}
                replyingTo={reply.replyingTo}
                setReplyTo={setReplyTo}
                handleReplyBox={handleOpenReplyBox}
                currentUser={currentUser}
                key={reply.id}
                content={reply.content}
                createdAt={reply.createdAt}
                score={reply.score}
                user={reply.user}
                handleAddCommentToDelete={handleAddCommentToDelete}
                handleVoteComment={handleVoteComment}
                handleEditComment={handleEditComment}
              ></Comment>
            ))}
          {isReplyBoxOpen && (
            <CommentInput
              replyTo={replyTo}
              handleCloseReplyBox={handleCloseReplyBox}
              handleAddComment={addComment}
              currentUser={currentUser}
            ></CommentInput>
          )}
        </div>
      </div>
    </>
  );
};

export default CommentContainer;
