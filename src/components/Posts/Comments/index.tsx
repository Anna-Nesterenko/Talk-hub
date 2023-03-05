import { Post, postState } from "@/atoms/postsAtom";
import { firestore } from "@/firebase/config";
import {
  Box,
  Flex,
  SkeletonText,
  Stack,
  SkeletonCircle,
  Text,
} from "@chakra-ui/react";
import { User } from "firebase/auth";
import CommentItem, { Comment } from "./Item";
import {
  doc,
  writeBatch,
  collection,
  Timestamp,
  serverTimestamp,
  increment,
  query,
  where,
  orderBy,
  getDocs,
} from "firebase/firestore";
import React, { useEffect, useState } from "react";
import { useSetRecoilState } from "recoil";
import CommentInput from "./Input";

type commentsProps = {
  user: User;
  selectedPost: Post | null;
  communityId: string;
};

const Comments: React.FC<commentsProps> = ({
  user,
  selectedPost,
  communityId,
}) => {
  const [comment, setComment] = useState("");
  const [comments, setComments] = useState<Comment[]>([]);
  const [commentFetchLoading, setCommentFetchLoading] = useState(true);
  const [commentCreateLoading, setCommentCreateLoading] = useState(false);
  const [deleteLoading, setDeleteLoading] = useState("");
  const setPostState = useSetRecoilState(postState);

  const onCreateComment = async (comment: string) => {
    setCommentCreateLoading(true);
    try {
      const batch = writeBatch(firestore);
      const commentDocRef = doc(collection(firestore, "comments"));
      const newComment: Comment = {
        id: commentDocRef.id,
        postId: selectedPost?.id!,
        creatorId: user.uid,
        creatorDisplayText: user.email!.split("@")[0],
        communityId,
        text: comment,
        postTitle: selectedPost?.title!,
        createdAt: serverTimestamp() as Timestamp,
      };

      batch.set(commentDocRef, newComment);
      newComment.createdAt = { seconds: Date.now() / 1000 } as Timestamp;

      batch.update(doc(firestore, "posts", selectedPost?.id as string), {
        numberOfComments: increment(1),
      });

      setComment("");
      await batch.commit();

      setComments((prev) => [newComment, ...prev]);

      setPostState((prev) => ({
        ...prev,
        selectedPost: {
          ...prev.selectedPost,
          numberOfComments: prev.selectedPost?.numberOfComments! + 1,
        } as Post,
      }));
    } catch (error: any) {
      console.log("onCreateComment error", error.message);
    }
    setCommentCreateLoading(false);
  };

  const onDeleteComment = async (comment: Comment) => {
    setDeleteLoading(comment.id);
    try {
      if (!comment.id) throw "Comment has no ID";
      const batch = writeBatch(firestore);
      const commentDocRef = doc(firestore, "comments", comment.id);
      batch.delete(commentDocRef);

      const postDocRef = doc(firestore, "posts", selectedPost?.id as string);
      batch.update(postDocRef, { numberOfComments: increment(-1) });

      await batch.commit();

      setPostState((prev) => ({
        ...prev,
        selectedPost: {
          ...prev.selectedPost,
          numberOfComments: prev.selectedPost?.numberOfComments! - 1,
        } as Post,
      }));

      setComments((prev) => prev.filter((item) => item.id !== comment.id));
    } catch (error: any) {
      console.log("Error deleting comment", error.message);
    }
    setDeleteLoading("");
  };

  const getPostComments = async () => {
    try {
      const commentsQuery = query(
        collection(firestore, "comments"),
        where("postId", "==", selectedPost?.id),
        orderBy("createdAt", "desc")
      );
      const commentDocs = await getDocs(commentsQuery);
      const comments = commentDocs.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      setComments(comments as Comment[]);
    } catch (error: any) {
      console.log("getPostComments error", error.message);
    }
    setCommentFetchLoading(false);
  };

  useEffect(() => {
    if (!selectedPost) return;
    getPostComments();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedPost]);

  return (
    <Box bg="white" p={2} borderRadius="0px 0px 4px 4px">
      <Flex
        direction="column"
        pl={10}
        pr={4}
        mb={6}
        fontSize="10pt"
        width="100%"
      >
        {!commentFetchLoading && (
          <CommentInput
            comment={comment}
            setComment={setComment}
            loading={commentCreateLoading}
            user={user}
            onCreateComment={onCreateComment}
          />
        )}
      </Flex>
      <Stack spacing={6} p={2}>
        {commentFetchLoading ? (
          <>
            {[0, 1, 2].map((item) => (
              <Box key={item} padding="6" bg="white">
                <SkeletonCircle size="10" />
                <SkeletonText mt="4" noOfLines={2} spacing="4" />
              </Box>
            ))}
          </>
        ) : (
          <>
            {!!comments.length ? (
              <>
                {comments.map((item: Comment) => (
                  <CommentItem
                    key={item.id}
                    comment={item}
                    onDeleteComment={onDeleteComment}
                    isLoading={deleteLoading === item.id}
                    userId={user?.uid}
                  />
                ))}
              </>
            ) : (
              <Flex
                direction="column"
                justify="center"
                align="center"
                borderTop="1px solid"
                borderColor="gray.100"
                p={20}
              >
                <Text fontWeight={700} opacity={0.3}>
                  No Comments Yet
                </Text>
              </Flex>
            )}
          </>
        )}
      </Stack>
    </Box>
  );
};
export default Comments;
