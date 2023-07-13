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
  const formNode = useRef(null);
  const addCommentTextArea = useRef(null);

  useEffect(() => {
    if (!isGlobalComment)
      commentInputNode.current.scrollIntoView({ behavior: "smooth" });
  });

  useEffect(() => {
    if (isGlobalComment) return;
    addCommentTextArea.current.focus();
    // eslint-disable-next-line
  }, []);

  const addComment = (e) => {
    e.preventDefault();

    if (!commentContent) return;

    const newComment = {
      id: uuidv4(),
      content: commentContent,
      createdAt: new Date(),
      score: 1,
      user: structuredClone(currentUser),
    };

    const completeNewComment = isGlobalComment
      ? { ...newComment, replies: [] }
      : { ...newComment, replyingTo: replyTo };

    handleAddComment(completeNewComment);

    addCommentTextArea.current.blur();
    setCommentContent("");
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
    <article ref={commentInputNode} className="comment-input">
      <form
        className="comment-input__form"
        ref={formNode}
        onSubmit={(e) => {
          e.preventDefault();
          addComment(e);
        }}
      >
        <textarea
          ref={addCommentTextArea}
          onKeyDown={(e) => onEnterPress(e, formNode)}
          placeholder={isGlobalComment ? "Add a comment..." : "Add a reply..."}
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
        {!isGlobalComment && (
          <button
            onClick={handleCloseReplyBox}
            className="comment-input__button comment-input__button--cancel"
          >
            Cancel
          </button>
        )}
        <button
          type="submit"
          className="comment-input__button comment-input__button--send"
        >
          {isGlobalComment ? "Send" : "Reply"}
        </button>
      </form>
    </article>
  );
};

export default CommentInput;
