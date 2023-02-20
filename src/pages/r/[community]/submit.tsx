import { communityState } from "@/atoms/communitiesAtom";
import PageContentLayout from "@/components/Layout/PageContentLayout";
import NewPostForm from "@/components/Posts/PostForm/NewPostForm";
import { auth } from "@/firebase/config";
import useCommunityData from "@/hooks/useCommunityData";
import { Box, Text } from "@chakra-ui/react";
import { useRouter } from "next/router";
import React from "react";
import { useAuthState } from "react-firebase-hooks/auth";
import { useRecoilValue } from "recoil";

const SubmitPostPage = () => {
  const [user, loadingUser, error] = useAuthState(auth);
  const router = useRouter();
  const { community } = router.query;
  const communityStateValue = useRecoilValue(communityState);
  const { loading } = useCommunityData();

  return (
    <PageContentLayout maxWidth="1060px">
      <>
        <Box p="14px 0px" borderBottom="1px solid" borderColor="white">
          <Text fontWeight={600}>Create a post</Text>
        </Box>
        <NewPostForm
        //   communityId={communityStateValue.currentCommunity.id}
        //   communityImageURL={communityStateValue.currentCommunity.imageURL}
        //   user={user}
        />
      </>
      <>about component</>
    </PageContentLayout>
  );
};
export default SubmitPostPage;
