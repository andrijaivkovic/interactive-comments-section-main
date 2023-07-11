import { useState } from "react";

import replyIcon from "../../images/icon-reply.svg";
import deleteIcon from "../../images/icon-delete.svg";
import editIcon from "../../images/icon-edit.svg";

import iconPlus from "../../images/icon-plus.svg";
import iconMinus from "../../images/icon-minus.svg";

const Comment = ({
  id,
  content,
  createdAt,
  score,
  user,
  currentUser,
  replyingTo,
  handleReplyBox,
  handleAddCommentToDelete,
  handleVoteComment,
  handleEditComment,
}) => {
  const [isEditingModeEnabled, setEditingModeEnabled] = useState(false);
  const [commentEditFieldContent, setCommentEditFieldContent] =
    useState(content);

  const isUpvoted = currentUser.upvotedComments.includes(id);
  const isDownvoted = currentUser.downvotedComments.includes(id);

  const addCommentToDelete = (commentId) => {
    handleAddCommentToDelete(commentId);
  };

  const voteComment = (commentId, voteType) => {
    handleVoteComment(commentId, voteType);
  };

  const editComment = () => {
    handleEditComment(id, commentEditFieldContent);

    setEditingModeEnabled(false);
  };

  const handleSetEditingModeEnabled = () => {
    setEditingModeEnabled(true);
  };

  const handleSetEditingModeDisabled = () => {
    setEditingModeEnabled(false);
    setCommentEditFieldContent(content);
  };

  return (
    <article className="comment">
      <header className="comment__header">
        <picture className="comment__profile-picture">
          <source srcSet={user.image.webp} type="image/webp" />
          <source srcSet={user.image.png} type="image/png" />
          <img src={user.image.png} alt={user.image.alt} />
        </picture>
        <p className="comment__username">{user.username}</p>
        {user.username === currentUser.username && (
          <p className="comment__you">you</p>
        )}
        <p className="comment__post-time">{createdAt}</p>
      </header>
      {isEditingModeEnabled ? (
        <textarea
          placeholder="Edit your comment..."
          className="comment__edit-field"
          rows="3"
          value={commentEditFieldContent}
          onChange={(e) => setCommentEditFieldContent(e.target.value)}
        ></textarea>
      ) : (
        <p className="comment__content">
          {replyingTo && <span>@{replyingTo}</span>} {content}
        </p>
      )}
      <div
        className={`comment__score ${isUpvoted ? "upvoted" : ""} ${
          isDownvoted ? "downvoted" : ""
        }`}
      >
        <button
          onClick={() => voteComment(id, "upvote")}
          className="comment__score-button comment__score-button--upvote"
        >
          <img src={iconPlus} alt="Plus Icon" />
        </button>
        <p className="comment__score-value">{score}</p>
        <button
          onClick={() => voteComment(id, "downvote")}
          className="comment__score-button comment__score-button--downvote"
        >
          <img src={iconMinus} alt="Minus Icon" />
        </button>
      </div>
      <div className="comment__buttons">
        {user.username === currentUser.username ? (
          isEditingModeEnabled ? (
            <>
              <button
                onClick={handleSetEditingModeDisabled}
                className="comment__button comment__button--cancel"
              >
                <p>Cancel</p>
              </button>
              <button
                onClick={editComment}
                className="comment__button comment__button--update"
              >
                <p>Update</p>
              </button>
            </>
          ) : (
            <>
              <button
                onClick={() => addCommentToDelete(id)}
                className="comment__button comment__button--delete"
              >
                <img src={deleteIcon} alt="Delete Icon" />
                <p>Delete</p>
              </button>
              <button
                onClick={handleSetEditingModeEnabled}
                className="comment__button comment__button--edit"
              >
                <img src={editIcon} alt="Edit Icon" />
                <p>Edit</p>
              </button>
            </>
          )
        ) : (
          <button
            onClick={() => handleReplyBox(user.username)}
            className="comment__button comment__button--reply"
          >
            <img src={replyIcon} alt="Reply Icon" />
            <p>Reply</p>
          </button>
        )}
      </div>
    </article>
  );
};

export default Comment;
