import { useEffect, useRef, useState } from "react";

import CommentInput from "../CommentInput/CommentInput";

import replyIcon from "../../images/icon-reply.svg";
import deleteIcon from "../../images/icon-delete.svg";
import editIcon from "../../images/icon-edit.svg";

import iconPlus from "../../images/icon-plus.svg";
import iconMinus from "../../images/icon-minus.svg";

const Comment = ({
  id,
  globalCommentId,
  content,
  createdAt,
  score,
  user,
  currentUser,
  replyingTo,
  handleAddComment,
  handleAddCommentToDelete,
  handleVoteComment,
  handleEditComment,
}) => {
  const [isEditingModeEnabled, setEditingModeEnabled] = useState(false);
  const [commentEditFieldContent, setCommentEditFieldContent] =
    useState(content);

  const [isReplyBoxOpen, setReplyBoxOpen] = useState(false);
  const [replyTo, setReplyTo] = useState("");

  const editCommentForm = useRef(null);
  const editCommentTextArea = useRef(null);

  useEffect(() => {
    if (!isEditingModeEnabled) return;

    editCommentTextArea.current.focus();
    editCommentTextArea.current.setSelectionRange(
      editCommentTextArea.current.value.length,
      editCommentTextArea.current.value.length
    );
  }, [isEditingModeEnabled]);

  const isUpvoted = currentUser.upvotedComments.includes(id);
  const isDownvoted = currentUser.downvotedComments.includes(id);

  const dateFormating = () => {
    const currentTime = new Date();
    const createdAtDate = new Date(createdAt);

    if (currentTime.getTime() - createdAtDate.getTime() < 86400000)
      return "Today";

    if (
      currentTime.getTime() - createdAtDate.getTime() > 86400000 &&
      currentTime.getTime() - createdAtDate.getTime() < 86400000 * 2
    )
      return "1 day ago";

    if (
      currentTime.getTime() - createdAtDate.getTime() > 86400000 * 2 &&
      currentTime.getTime() - createdAtDate.getTime() < 86400000 * 3
    )
      return "2 days ago";

    return createdAtDate.toDateString();
  };

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
    const commentId = globalCommentId ? globalCommentId : id;

    handleAddComment(commentObject, commentId);
    setReplyBoxOpen(false);
  };

  const addCommentToDelete = (commentId) => {
    handleAddCommentToDelete(commentId);
  };

  const voteComment = (commentId, voteType) => {
    handleVoteComment(commentId, voteType);
  };

  const editComment = (e) => {
    e.preventDefault();

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

  // submit a form inside of comment input when enter is pressed inside of an element
  const onEnterPress = (e, formNode) => {
    // check if the browser supports requestSubmit method
    if (!formNode.current.requestSubmit) return;

    if (e.keyCode === 13 && e.shiftKey === false) {
      formNode.current.requestSubmit();
    }
  };

  return (
    <div className="comment-box">
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
          <p className="comment__post-time">{dateFormating()}</p>
        </header>
        {isEditingModeEnabled ? (
          <form
            ref={editCommentForm}
            className="comment__edit-form"
            onSubmit={(e) => editComment(e)}
          >
            <textarea
              ref={editCommentTextArea}
              onKeyDown={(e) => onEnterPress(e, editCommentForm)}
              placeholder="Edit your comment..."
              className="comment__edit-field"
              rows="3"
              value={commentEditFieldContent}
              onChange={(e) => setCommentEditFieldContent(e.target.value)}
            ></textarea>
          </form>
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
                  onClick={() => editCommentForm.current.requestSubmit()}
                  type="submit"
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
              onClick={() => handleOpenReplyBox(user.username)}
              className="comment__button comment__button--reply"
            >
              <img src={replyIcon} alt="Reply Icon" />
              <p>Reply</p>
            </button>
          )}
        </div>
      </article>
      {isReplyBoxOpen && (
        <CommentInput
          replyTo={replyTo}
          handleCloseReplyBox={handleCloseReplyBox}
          handleAddComment={addComment}
          currentUser={currentUser}
        ></CommentInput>
      )}
    </div>
  );
};

export default Comment;
