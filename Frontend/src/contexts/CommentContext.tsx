import { createContext, useState } from "react";
import axiosInstance from "../libs/axios";

type Comment = {
  _id: string;
  createdAt: string;
  content: string;
  user: { username: string; avatar: string };
  video: string;
  replies: string[];
  likes: string[];
  dislikes: string[];
};

type Reply = Omit<Comment, "video">;

type CommentContextType = {
  loading: boolean;
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
  const [loading, setLoading] = useState<boolean>(false);
  const [comments, setComments] = useState<Comment[]>([]);
  const [replies, setReplies] = useState<Reply[]>([]);
  const [message, setMessage] = useState<string>("");

  const fetchComments = async (videoId: string) => {
    setLoading(true);
    try {
      const response = await axiosInstance.get(`/comments/${videoId}`);
      if (response.data.success) {
        setComments(response.data.comments);
        console.log(response.data.comments);
      }
    } catch (error) {
      console.log("Error in fetchComments", error);
    } finally {
      setLoading(false);
    }
  };

  const fetchReplies = async (commentId: string) => {
    setLoading(true);
    try {
      const response = await axiosInstance.get(`/comments/reply/${commentId}`);
      if (response.data.success) {
        setReplies(response.data.replies);
        console.log(response.data.replies);
      }
    } catch (error) {
      console.log("Error in fetchReplies", error);
    } finally {
      setLoading(false);
    }
  };

  const createComment = async (content: string, videoId: string) => {
    setLoading(true);
    try {
      const response = await axiosInstance.post(`/comments/${videoId}`, {
        content,
      });
      if (response.data.success) {
        setMessage(response.data.message);
        setComments([...comments, response.data.comment]);
        console.log(response.data.comment);
      }
    } catch (error) {
      console.log("Error in createComment", error);
    } finally {
      setLoading(false);
    }
  };

  const createReply = async (content: string, commentId: string) => {
    setLoading(true);
    try {
      const response = await axiosInstance.post(
        `/comments/reply/${commentId}`,
        {
          content,
        }
      );

      if (response.data.success) {
        setMessage(response.data.message);
        setReplies([...replies, response.data.reply]);
        setComments(
          comments.map((comment) => {
            if (comment._id === commentId) {
              comment.replies.push(response.data.reply._id);
            }
            return comment;
          })
        );
        console.log(response.data.reply);
      }
    } catch (error) {
      console.log("Error in createReply", error);
    } finally {
      setLoading(false);
    }
  };

  const updateComment = async (commentId: string, content: string) => {
    setLoading(true);
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
    } finally {
      setLoading(false);
    }
  };

  const deleteComment = async (commentId: string) => {
    setLoading(true);
    try {
      const response = await axiosInstance.delete(`/${commentId}`);
      if (response.data.success) {
        setMessage(response.data.message);
        comments.filter((comment) => comment._id !== commentId);
        replies.filter((reply) => reply._id !== commentId);
      }
    } catch (error) {
      console.log("Error in deleteComment", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <commentContext.Provider
      value={{
        loading,
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
