import { createContext, useState } from "react";
import axiosInstance from "../libs/axios";

type Comment = {
  _id: string;
  content: string;
  user: { username: string; avatar: string };
  video: string;
  replies: string[];
  likes: string[];
  dislikes: string[];
};

type Reply = Omit<Comment, "video">;

type CommentContextType = {
  comments: Comment[];
  replies: Reply[];
  message: string;
  fetchComments: (videoId: string) => void;
  fetchReplies: (commentId: string) => void;
  createComment: (content: string, videoId: string) => void;
  createReply: (content: string, commentId: string) => void;
  updateComment: (commentId: string, content: string) => void;
  deleteComment: (commentId: string) => void;
};

type CommentProviderProps = {
  children: React.ReactNode;
};

export const commentContext = createContext<CommentContextType | null>(null);

const CommentProvider = ({ children }: CommentProviderProps) => {
  const [comments, setComments] = useState<Comment[]>([]);
  const [replies, setReplies] = useState<Reply[]>([]);
  const [message, setMessage] = useState<string>("");

  const fetchComments = async (videoId: string) => {
    try {
      const response = await axiosInstance.get(`/comments/${videoId}`);
      if (response.data.success) {
        setComments(response.data.comments);
      }
    } catch (error) {
      console.log("Error in fetchComments", error);
    }
  };

  const fetchReplies = async (commentId: string) => {
    try {
      const response = await axiosInstance.get(`/reply/${commentId}`);
      if (response.data.success) {
        setReplies(response.data.replies);
      }
    } catch (error) {
      console.log("Error in fetchReplies", error);
    }
  };

  const createComment = async (content: string, videoId: string) => {
    try {
      const response = await axiosInstance.post(`/comments/${videoId}`, {
        content,
      });
      if (response.data.success) {
        setMessage(response.data.message);
        fetchComments(videoId);
      }
    } catch (error) {
      console.log("Error in createComment", error);
    }
  };

  const createReply = async (content: string, commentId: string) => {
    try {
      const response = await axiosInstance.post(`/reply/${commentId}`, {
        content,
      });

      if (response.data.success) {
        setMessage(response.data.message);
        setReplies([...replies, response.data.reply]);
      }
    } catch (error) {
      console.log("Error in createReply", error);
    }
  };

  const updateComment = async (commentId: string, content: string) => {
    try {
      const response = await axiosInstance.put(`/${commentId}`, {
        content,
      });
      if (response.data.success) {
        setMessage(response.data.message);
        comments.map((comment) => {
          if (comment._id === commentId) {
            comment.content = content;
          }
        });
        replies.map((reply) => {
          if (reply._id === commentId) {
            reply.content = content;
          }
        });
      }
    } catch (error) {
      console.log("Error in updateComment", error);
    }
  };

  const deleteComment = async (commentId: string) => {
    try {
      const response = await axiosInstance.delete(`/${commentId}`);
      if (response.data.success) {
        setMessage(response.data.message);
        comments.filter((comment) => comment._id !== commentId);
        replies.filter((reply) => reply._id !== commentId);
      }
    } catch (error) {
      console.log("Error in deleteComment", error);
    }
  };

  return (
    <commentContext.Provider
      value={{
        comments,
        replies,
        message,
        fetchComments,
        fetchReplies,
        createComment,
        createReply,
        updateComment,
        deleteComment,
      }}
    >
      {children}
    </commentContext.Provider>
  );
};

export default CommentProvider;
