import { useEffect, useRef, useState } from "react";
import { v4 as uuidv4 } from "uuid";

const CommentInput = ({
  currentUser,
  isGlobalComment,
  handleAddComment,
  handleCloseReplyBox,
  replyTo,
}) => {
  const [commentContent, setCommentContent] = useState(
    // isGlobalComment ? "" : `@${replyTo} `
    ""
  );

  const commentInputNode = useRef(null);

  useEffect(() => {
    if (!isGlobalComment)
      commentInputNode.current.scrollIntoView({ behavior: "smooth" });
  });

  const addComment = () => {
    if (!commentContent) return;

    const newComment = {
      id: uuidv4(),
      content: commentContent,
      createdAt: "Today",
      score: 1,
      user: structuredClone(currentUser),
    };

    const completeNewComment = isGlobalComment
      ? { ...newComment, replies: [] }
      : { ...newComment, replyingTo: replyTo };

    handleAddComment(completeNewComment);

    setCommentContent("");
  };

  return (
    <article ref={commentInputNode} className="comment-input">
      <textarea
        placeholder="Add a comment..."
        className="comment-input__input"
        rows="3"
        value={commentContent}
        onChange={(e) => setCommentContent(e.target.value)}
      ></textarea>
      <picture className="comment-input__profile-picture">
        <source srcSet={currentUser.image.webp} type="image/webp" />
        <source srcSet={currentUser.image.png} type="image/png" />
        <img src={currentUser.image.png} alt={currentUser.image.alt} />
      </picture>
      <div className="comment-input__buttons">
        {!isGlobalComment && (
          <button
            onClick={handleCloseReplyBox}
            className="comment-input__button omment-input__button--cancel"
          >
            Cancel
          </button>
        )}
        <button
          onClick={addComment}
          className="comment-input__button comment-input__button--send"
        >
          {isGlobalComment ? "Send" : "Reply"}
        </button>
      </div>
    </article>
  );
};

export default CommentInput;
