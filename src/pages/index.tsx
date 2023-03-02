import { communityState } from "@/atoms/communitiesAtom";
import { Post } from "@/atoms/postsAtom";
import PageContentLayout from "@/components/Layout/PageContentLayout";
import Posts from "@/components/Posts";
import PostItem from "@/components/Posts/PostItem";
import PostLoader from "@/components/Posts/PostLoader";
import { auth, firestore } from "@/firebase/config";
import useCommunityData from "@/hooks/useCommunityData";
import usePosts from "@/hooks/usePosts";
import { Stack } from "@chakra-ui/react";
import {
  limit,
  orderBy,
  query,
  collection,
  getDocs,
  where,
} from "firebase/firestore";
import { useEffect, useState } from "react";
import { useAuthState } from "react-firebase-hooks/auth";
import { useRecoilValue } from "recoil";

const Home = () => {
  const [user, loadingUser] = useAuthState(auth);
  const [loading, setLoading] = useState(false);
  const { communityStateValue } = useCommunityData();
  const {
    postStateValue,
    setPostStateValue,
    onVote,
    onDeletePost,
    onSelectPost,
  } = usePosts();

  const getUserHomePosts = async () => {
    console.log("GETTING USER FEED");
    setLoading(true);
    try {
      if (communityStateValue.mySnippets.length) {
        console.log("GETTING POSTS IN USER COMMUNITIES");

        const myCommunityIds = communityStateValue.mySnippets.map(
          (snippet) => snippet.communityId
        );
        const postQuery = query(
          collection(firestore, "posts"),
          where("communityId", "in", myCommunityIds),
          limit(15)
        );
        const postDocs = await getDocs(postQuery);
        const posts = postDocs.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));
        setPostStateValue((prev) => ({
          ...prev,
          posts: posts as Post[],
        }));
      } else {
        getNoUserHomePosts();
      }
    } catch (error: any) {
      console.log("getUserHomePosts error", error.message);
    }
    setLoading(false);
  };

  const getNoUserHomePosts = async () => {
    console.log("GETTING NO USER FEED");
    setLoading(true);
    try {
      const postQuery = query(
        collection(firestore, "posts"),
        orderBy("voteStatus", "desc"),
        limit(15)
      );
      const postDocs = await getDocs(postQuery);
      const posts = postDocs.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      console.log("NO USER FEED", posts);
      setPostStateValue((prev) => ({
        ...prev,
        posts: posts as Post[],
      }));
    } catch (error: any) {
      console.log("getNoUserHomePosts error", error.message);
    }
    setLoading(false);
  };

  const getUserPostVotes = async () => {};

  useEffect(() => {
    if (communityStateValue.snippetsFetched) getUserHomePosts();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user, communityStateValue.snippetsFetched]);

  useEffect(() => {
    if (!user && !loadingUser) {
      getNoUserHomePosts();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user, loadingUser]);

  return (
    <PageContentLayout>
      <>
        {loading ? (
          <PostLoader />
        ) : (
          <Stack>
            {postStateValue.posts.map((post) => (
              <PostItem
                key={post.id}
                post={post}
                onSelectPost={onSelectPost}
                onDeletePost={onDeletePost}
                onVote={onVote}
                userVoteValue={
                  postStateValue.postVotes.find(
                    (item) => item.postId === post.id
                  )?.voteValue
                }
                userIsCreator={user?.uid === post.creatorId}
                homePage
              />
            ))}
          </Stack>
        )}
      </>
      <>{/* <Recommendations /> */}</>
    </PageContentLayout>
  );
};
export default Home;
