import { Post } from "@/atoms/postsAtom";
import About from "@/components/Community/About";
import PageContentLayout from "@/components/Layout/PageContentLayout";
import Comments from "@/components/Posts/Comments";
import PostItem from "@/components/Posts/PostItem";
import { auth, firestore } from "@/firebase/config";
import useCommunityData from "@/hooks/useCommunityData";
import usePosts from "@/hooks/usePosts";
import { Box } from "@chakra-ui/react";
import { User } from "firebase/auth";
import { doc, getDoc } from "firebase/firestore";
import { useRouter } from "next/router";
import { useEffect } from "react";
import { useAuthState } from "react-firebase-hooks/auth";

const PostPage = () => {
  const [user] = useAuthState(auth);
  const router = useRouter();

  const { communityStateValue } = useCommunityData();
  const { postStateValue, setPostStateValue, onDeletePost, onVote } =
    usePosts();

  const fetchPost = async (postId: string) => {
    // console.log("FETCHING POST");
    try {
      const postDocRef = doc(firestore, "posts", postId);
      const postDoc = await getDoc(postDocRef);
      setPostStateValue((prev) => ({
        ...prev,
        selectedPost: { id: postDoc.id, ...postDoc.data() } as Post,
      }));
    } catch (error: any) {
      console.log("fetchPost error", error.message);
    }
  };

  useEffect(() => {
    const { pid } = router.query;
    if (pid && !postStateValue.selectedPost) {
      fetchPost(pid as string);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [router.query, postStateValue.selectedPost]);

  return (
    <PageContentLayout>
      <>
        {postStateValue.selectedPost && (
          <PostItem
            post={postStateValue.selectedPost}
            onVote={onVote}
            onDeletePost={onDeletePost}
            userVoteValue={
              postStateValue.postVotes.find(
                (item) => item.postId === postStateValue.selectedPost?.id
              )?.voteValue
            }
            userIsCreator={user?.uid === postStateValue.selectedPost?.creatorId}
          />
        )}
        <Comments
          user={user as User}
          selectedPost={postStateValue.selectedPost}
          communityId={postStateValue.selectedPost?.communityId as string}
        />
      </>
      <>
        <Box display="block">
          {communityStateValue.currentCommunity && (
            <About communityData={communityStateValue.currentCommunity} />
          )}
        </Box>
      </>
    </PageContentLayout>
  );
};
export default PostPage;
