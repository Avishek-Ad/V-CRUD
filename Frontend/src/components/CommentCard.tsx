// import { useContext, useEffect, useState } from "react";
// import { motion } from "framer-motion";
// import { commentContext } from "../contexts/CommentContext";
// import { useParams } from "react-router-dom";
// import { userContext } from "../contexts/UserContext";

// function CommentCard() {
//   const {
//     comments,
//     createComment,
//     loading: loadingComments,
//     fetchReplies,
//     createReply,
//     replies,
//   } = useContext(commentContext)!;
//   const { user } = useContext(userContext)!;
//   const { id: videoId } = useParams();

//   const [newComment, setNewComment] = useState("");
//   const [newReply, setNewReply] = useState("");
//   const [replyingTo, setReplyingTo] = useState<string | null>(null);
//   const [showReplyTo, setShowReplyTo] = useState<string | null>(null);

//   const handleComment = () => {
//     if (user && currentVideo && videoId) {
//       createComment(newComment, videoId);
//       setNewComment("");
//     } else {
//       setShowSignIn(true);
//     }
//   };

//   const handleReply = (commentId: string) => {
//     if (user && currentVideo && videoId) {
//       createReply(newReply, commentId);
//       setNewReply("");
//       setShowReplyTo(null);
//     } else {
//       setShowSignIn(true);
//     }
//   };

//   const handleShowReply = (commentId: string) => {
//     setShowReplyTo(showReplyTo === commentId ? null : commentId);
//     fetchReplies(commentId);
//   };
//   return (
//     <motion.div
//       initial={{ opacity: 0, y: 20, right: "100%" }}
//       animate={{ opacity: 1, y: 0, right: "0%" }}
//       exit={{ opacity: 0, y: 20, right: "100%" }}
//       transition={{ duration: 0.25 }}
//       className={`
//               fixed top-0 left-0 z-50 flex items-center justify-center
//               w-full h-full
//               lg:w-[400px] lg:h-[500px] bg-transparent lg:top-[15%] lg:left-[68%]
//             `}
//     >
//       <div
//         className={`
//                 bg-white dark:bg-zinc-900 text-black dark:text-white rounded-xl shadow-2xl
//                 w-full max-w-md max-h-[80vh] flex flex-col overflow-hidden relative
//                 p-6
//                 lg:max-w-none lg:max-h-none lg:p-6 lg:w-[400px] lg:h-[500px]
//                 lg:rounded-xl lg:shadow-2xl lg:relative
//               `}
//       >
//         <button
//           onClick={() => setShowComments(false)}
//           aria-label="Close comments"
//           className="absolute top-3 right-3 text-zinc-500 hover:text-red-500 transition"
//         >
//           <X size={24} />
//         </button>

//         <h2 className="text-xl font-semibold mb-4 border-b border-zinc-200 dark:border-zinc-700 pb-2">
//           Comments
//         </h2>

//         <div className="flex-1 overflow-y-auto pr-2 space-y-6 custom-scrollbar">
//           {comments && comments.length ? (
//             comments.map((comment) => (
//               <div key={comment._id} className="flex items-start space-x-4">
//                 {/* Placeholder for user profile picture */}
//                 {/* <div className="w-10 h-10 rounded-full bg-gray-300 dark:bg-zinc-700 flex-shrink-0" /> */}
//                 <img
//                   src={comment.user.avatar}
//                   alt={comment.user.username}
//                   className="w-10 h-10 rounded-full bg-gray-300 dark:bg-zinc-700 flex-shrink-0"
//                 />

//                 <div className="flex-1">
//                   <div className="flex items-center space-x-2">
//                     <h3 className="font-medium text-sm">
//                       {comment.user.username}
//                     </h3>
//                     <span className="text-xs text-zinc-500 dark:text-zinc-400">
//                       • {comment.createdAt}
//                     </span>
//                   </div>
//                   <p className="text-sm text-zinc-800 dark:text-zinc-200 mt-1">
//                     {comment.content}
//                   </p>

//                   <div className="flex space-x-4 text-zinc-600 dark:text-zinc-400 mt-2 text-sm">
//                     <button className="flex items-center gap-1 hover:text-blue-600 transition">
//                       <ThumbsUp size={16} /> {comment.likes}
//                     </button>
//                     <button className="flex items-center gap-1 hover:text-red-600 transition">
//                       <ThumbsDown size={16} /> {comment.dislikes}
//                     </button>
//                     <div className="flex items-center gap-1">
//                       <button
//                         className="flex items-center gap-1 hover:text-primary transition"
//                         onClick={() =>
//                           setReplyingTo(
//                             replyingTo === comment._id ? null : comment._id
//                           )
//                         }
//                       >
//                         {replyingTo === comment._id ? "cancel" : "reply"}
//                       </button>
//                     </div>
//                   </div>
//                   {replyingTo === comment._id && (
//                     <div className="flex items-center gap-2 mt-2">
//                       <input
//                         type="text"
//                         placeholder="Add a Reply..."
//                         value={newReply}
//                         onChange={(e) => setNewReply(e.target.value)}
//                         className="w-full border text-sm border-zinc-200 dark:border-zinc-700 rounded-md px-2 py-1 focus:outline-none focus:ring-2 focus:ring-primary"
//                       />
//                       <button
//                         className="bg-primary text-white px-4 py-2 rounded-md hover:bg-primary/80 transition"
//                         onClick={() => handleReply(comment._id)}
//                       >
//                         <ArrowRight size={16} />
//                       </button>
//                     </div>
//                   )}

//                   {comment.replies.length > 0 && (
//                     <div
//                       className="flex items-center text-sm hover:text-primary transition mt-1"
//                       onClick={() => handleShowReply(comment._id)}
//                     >
//                       {showReplyTo === comment._id ? (
//                         <ChevronUp size={18} />
//                       ) : (
//                         <ChevronDown size={18} />
//                       )}
//                       {comment.replies.length} replies
//                     </div>
//                   )}

//                   {showReplyTo === comment._id &&
//                     replies.length > 0 &&
//                     replies.map((reply) => (
//                       <div
//                         key={comment._id}
//                         className="flex items-start space-x-2 mt-4"
//                       >
//                         <img
//                           src={reply.user.avatar}
//                           alt={reply.user.username}
//                           className="w-8 h-8 rounded-full bg-gray-300 dark:bg-zinc-700 flex-shrink-0"
//                         />

//                         <div className="flex-1">
//                           <div className="flex items-center space-x-2">
//                             <h3 className="font-medium text-sm">
//                               {reply.user.username}
//                             </h3>
//                             <span className="text-xs text-zinc-500 dark:text-zinc-400">
//                               • {reply.createdAt}
//                             </span>
//                           </div>
//                           <p className="text-sm text-zinc-800 dark:text-zinc-200 mt-1">
//                             {reply.content}
//                           </p>

//                           <div className="flex space-x-4 text-zinc-600 dark:text-zinc-400 text-sm mt-2">
//                             <button className="flex items-center gap-1 hover:text-blue-600 transition">
//                               <ThumbsUp size={14} /> {comment.likes}
//                             </button>
//                             <button className="flex items-center gap-1 hover:text-red-600 transition">
//                               <ThumbsDown size={14} /> {comment.dislikes}
//                             </button>
//                           </div>
//                         </div>
//                       </div>
//                     ))}
//                 </div>
//               </div>
//             ))
//           ) : (
//             <p className="text-center text-zinc-500 dark:text-zinc-400 mt-10">
//               No comments yet
//             </p>
//           )}
//         </div>
//         <div className="flex items-center gap-2 mt-2">
//           <input
//             type="text"
//             placeholder="Add a comment..."
//             value={newComment}
//             onChange={(e) => setNewComment(e.target.value)}
//             className="w-full border border-zinc-200 dark:border-zinc-700 rounded-md px-4 py-2 focus:outline-none focus:ring-2 focus:ring-primary"
//           />
//           <button
//             className="bg-primary text-white px-4 py-2 rounded-md hover:bg-primary/80 transition"
//             onClick={handleComment}
//           >
//             {loadingComments ? (
//               <LoaderCircle className="animate-spin w-5 h-5" />
//             ) : (
//               <ArrowRight size={24} />
//             )}
//           </button>
//         </div>
//       </div>
//     </motion.div>
//   );
// }

// export default CommentCard;
