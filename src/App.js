import { useEffect, useState } from "react";

import ChangeUser from "./components/ChangeUser/ChangeUser";
import CommentContainer from "./components/CommentContainer/CommentContainer";
import CommentInput from "./components/CommentInput/CommentInput";
import Prompt from "./components/Prompt/Prompt";

import "./main.scss";

const App = () => {
  const defaultState = {
    users: [
      {
        image: {
          png: "https://i.ibb.co/2qqMvDM/image-juliusomo.png",
          webp: "https://i.ibb.co/tmLSm40/image-juliusomo.webp",
          alt: "juliusomo profile icon",
        },
        id: 0,
        username: "juliusomo",
        upvotedComments: [],
        downvotedComments: [],
      },
      {
        image: {
          png: "https://i.ibb.co/48FbK33/image-amyrobson.png",
          webp: "https://i.ibb.co/YLrxwvj/image-amyrobson.webp",
          alt: "amyrobson profile icon",
        },
        id: 1,
        username: "amyrobson",
        upvotedComments: [],
        downvotedComments: [],
      },
      {
        image: {
          png: "https://i.ibb.co/TMTJM4P/image-maxblagun.png",
          webp: "https://i.ibb.co/dfCGKMF/image-maxblagun.webp",
          alt: "maxblagun profile icon",
        },
        id: 2,
        username: "maxblagun",
        upvotedComments: [],
        downvotedComments: [],
      },
      {
        image: {
          png: "https://i.ibb.co/jT6N7rv/image-ramsesmiron.png",
          webp: "https://i.ibb.co/P6MKMvg/image-ramsesmiron.webp",
          alt: "ramsesmiron profile icon",
        },
        id: 3,
        username: "ramsesmiron",
        upvotedComments: [],
        downvotedComments: [],
      },
    ],
    currentUser: {
      image: {
        png: "https://i.ibb.co/2qqMvDM/image-juliusomo.png",
        webp: "https://i.ibb.co/tmLSm40/image-juliusomo.webp",
        alt: "juliusomo profile icon",
      },
      id: 0,
      username: "juliusomo",
      upvotedComments: [],
      downvotedComments: [],
    },
    comments: [],
  };

  const [state, setState] = useState(getInitialState());

  const [commentToDeleteId, setCommentToDeleteId] = useState("");

  const [isPromptOpen, setPromptOpen] = useState(false);

  function getInitialState() {
    const data = localStorage.getItem("APP_STATE");
    const savedTodos = JSON.parse(data);
    return savedTodos || defaultState;
  }

  useEffect(() => {
    const data = JSON.stringify(state);
    localStorage.setItem("APP_STATE", data);
  }, [state]);

  useEffect(() => {
    isPromptOpen === true
      ? (document.body.style.overflow = "hidden")
      : (document.body.style.overflow = "unset");
  }, [isPromptOpen]);

  const handleVoteComment = (commentId, voteType) => {
    let valueToAdd = voteType === "upvote" ? 1 : -1;

    const voteCommentHelper = (commentId) => {
      const newDownvotedComments = state.currentUser.downvotedComments.filter(
        (comment) => comment !== commentId
      );

      const newUpvotedComments = state.currentUser.upvotedComments.filter(
        (comment) => comment !== commentId
      );

      const newComments = state.comments.map((comment) => {
        const newReplies = comment.replies.map((reply) => {
          return reply.id === commentId
            ? { ...reply, score: reply.score + valueToAdd }
            : reply;
        });
        const newComment = { ...comment, replies: newReplies };
        return newComment;
      });

      const newerComments = newComments.map((comment) =>
        comment.id === commentId
          ? { ...comment, score: comment.score + valueToAdd }
          : comment
      );

      return [newDownvotedComments, newUpvotedComments, newerComments];
    };

    if (
      voteType === "downvote" &&
      state.currentUser.upvotedComments.includes(commentId)
    ) {
      const [newDownvotedComments, newUpvotedComments, newComments] =
        voteCommentHelper(commentId);

      setState((curr) => {
        return {
          ...curr,
          comments: newComments,
          currentUser: {
            ...curr.currentUser,
            upvotedComments: newUpvotedComments,
            downvotedComments: newDownvotedComments,
          },
        };
      });

      return;
    }

    if (
      voteType === "upvote" &&
      state.currentUser.downvotedComments.includes(commentId)
    ) {
      const [newDownvotedComments, newUpvotedComments, newComments] =
        voteCommentHelper(commentId);

      setState((curr) => {
        return {
          ...curr,
          comments: newComments,
          currentUser: {
            ...curr.currentUser,
            upvotedComments: newUpvotedComments,
            downvotedComments: newDownvotedComments,
          },
        };
      });

      return;
    }

    if (
      voteType === "upvote" &&
      state.currentUser.upvotedComments.includes(commentId)
    )
      return;

    if (
      voteType === "downvote" &&
      state.currentUser.downvotedComments.includes(commentId)
    )
      return;

    const newComments = state.comments.map((comment) => {
      const newReplies = comment.replies.map((reply) => {
        return reply.id === commentId
          ? { ...reply, score: reply.score + valueToAdd }
          : reply;
      });
      const newComment = { ...comment, replies: newReplies };
      return newComment;
    });

    const newerComments = newComments.map((comment) =>
      comment.id === commentId
        ? { ...comment, score: comment.score + valueToAdd }
        : comment
    );

    setState((curr) => {
      return {
        ...curr,
        comments: newerComments,
        currentUser: {
          ...curr.currentUser,
          [`${voteType}dComments`]: [
            ...curr.currentUser[`${voteType}dComments`],
            commentId,
          ],
        },
      };
    });
  };

  const handleAddComment = (commentObject, repliedCommentId) => {
    if (repliedCommentId)
      setState((curr) => {
        const newComments = curr.comments.map((comment) => {
          return comment.id === repliedCommentId
            ? { ...comment, replies: [...comment.replies, commentObject] }
            : comment;
        });

        return {
          ...curr,
          currentUser: {
            ...curr.currentUser,
            upvotedComments: [
              ...curr.currentUser.upvotedComments,
              commentObject.id,
            ],
          },
          comments: newComments,
        };
      });

    if (!repliedCommentId)
      setState((curr) => {
        return {
          ...curr,
          currentUser: {
            ...curr.currentUser,
            upvotedComments: [
              ...curr.currentUser.upvotedComments,
              commentObject.id,
            ],
          },
          comments: [...curr.comments, commentObject],
        };
      });
  };

  const handleAddCommentToDelete = (commentId) => {
    setPromptOpen(true);
    setCommentToDeleteId(commentId);
  };

  const handleRemoveCommentToDelete = () => {
    setPromptOpen(false);
    setCommentToDeleteId("");
  };

  const handleDeleteComment = () => {
    if (!commentToDeleteId) return;

    const newComments = state.comments.map((comment) => {
      const newReplies = comment.replies.filter((reply) => {
        return reply.id !== commentToDeleteId;
      });
      const newComment = { ...comment, replies: newReplies };
      return newComment;
    });

    const newerComments = newComments.filter(
      (comment) => comment.id !== commentToDeleteId
    );

    setState((curr) => {
      return { ...curr, comments: newerComments };
    });

    setPromptOpen(false);
    setCommentToDeleteId("");
  };

  const handleEditComment = (commentId, commentContent) => {
    const newComments = state.comments.map((comment) => {
      const newReplies = comment.replies.map((reply) => {
        return reply.id === commentId
          ? { ...reply, content: commentContent }
          : reply;
      });
      const newComment = { ...comment, replies: newReplies };
      return newComment;
    });

    const newerComments = newComments.map((comment) =>
      comment.id === commentId
        ? { ...comment, content: commentContent }
        : comment
    );

    setState((curr) => {
      return { ...curr, comments: newerComments };
    });
  };

  const handleChangeCurrentUser = (e) => {
    const currentUser = state.currentUser;

    const selectedUserIndex = e.target.value;
    const selectedUserObject = state.users[selectedUserIndex];

    setState((curr) => {
      const newUsers = curr.users.map((user) => {
        return user.id === currentUser.id ? structuredClone(currentUser) : user;
      });

      return {
        ...curr,
        users: newUsers,
        currentUser: {
          image: selectedUserObject.image,
          id: selectedUserObject.id,
          username: selectedUserObject.username,
          upvotedComments: selectedUserObject.upvotedComments,
          downvotedComments: selectedUserObject.downvotedComments,
        },
      };
    });
  };

  const handleResetState = () => {
    setState(defaultState);
  };

  return (
    <>
      <div className="menu-bar">
        <button onClick={handleResetState} className="reset-state">
          Reset
        </button>
        <ChangeUser
          state={state}
          handleChangeCurrentUser={handleChangeCurrentUser}
        ></ChangeUser>
      </div>
      <section className="comment-section">
        {state.comments.map((comment) => (
          <CommentContainer
            currentUser={state.currentUser}
            key={comment.id}
            id={comment.id}
            content={comment.content}
            createdAt={comment.createdAt}
            score={comment.score}
            user={comment.user}
            replies={comment.replies}
            handleAddComment={handleAddComment}
            handleAddCommentToDelete={handleAddCommentToDelete}
            handleVoteComment={handleVoteComment}
            handleEditComment={handleEditComment}
          ></CommentContainer>
        ))}
        <CommentInput
          handleAddComment={handleAddComment}
          isGlobalComment={true}
          currentUser={state.currentUser}
        ></CommentInput>
        {isPromptOpen && (
          <Prompt
            handleDeleteComment={handleDeleteComment}
            handleRemoveCommentToDelete={handleRemoveCommentToDelete}
          ></Prompt>
        )}
      </section>
    </>
  );
};

export default App;
