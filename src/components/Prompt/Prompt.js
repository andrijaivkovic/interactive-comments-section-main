const Prompt = (props) => {
  const deleteComment = () => {
    props.handleDeleteComment();
  };

  return (
    <div className="prompt">
      <div
        onClick={props.handleRemoveCommentToDelete}
        className="prompt__bg"
      ></div>
      <div className="prompt__content">
        <header className="prompt__header">Delete Comment</header>
        <p className="prompt__text">
          Are you sure you want to delete this comment? This will remove the
          comment and can't be undone
        </p>
        <footer className="prompt__buttons">
          <button
            onClick={props.handleRemoveCommentToDelete}
            className="prompt__button"
          >
            No, Cancel
          </button>
          <button
            onClick={deleteComment}
            className="prompt__button prompt__button--delete"
          >
            Yes, Delete
          </button>
        </footer>
      </div>
    </div>
  );
};

export default Prompt;
