import About from "@/components/Community/About";
import PageContentLayout from "@/components/Layout/PageContentLayout";
import PostItem from "@/components/Posts/PostItem";
import { auth } from "@/firebase/config";
import useCommunityData from "@/hooks/useCommunityData";
import usePosts from "@/hooks/usePosts";
import { useRouter } from "next/router";
import { useAuthState } from "react-firebase-hooks/auth";

const PostPage = () => {
  const [user] = useAuthState(auth);

  const { communityStateValue } = useCommunityData();
  const { postStateValue, setPostStateValue, onDeletePost, onVote } = usePosts(
    communityStateValue.currentCommunity
  );
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
      </>
      <>
        {/* <About communityData={communityStateValue.currentCommunity} /> */}
      </>
    </PageContentLayout>
  );
};
export default PostPage;
