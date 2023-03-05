import About from "@/components/Community/About";
import PageContentLayout from "@/components/Layout/PageContentLayout";
import NewPostForm from "@/components/Posts/PostForm/NewPostForm";
import { auth } from "@/firebase/config";
import useCommunityData from "@/hooks/useCommunityData";
import { Box, Text } from "@chakra-ui/react";
import React from "react";
import { useAuthState } from "react-firebase-hooks/auth";

const SubmitPostPage = () => {
  const [user] = useAuthState(auth);
  const { communityStateValue } = useCommunityData();
//   console.log("community", communityStateValue);

  return (
    <PageContentLayout maxWidth="1060px">
      <>
        <Box p="14px 0px" borderBottom="1px solid" borderColor="white">
          <Text fontWeight={600}>Create a post</Text>
        </Box>
        {user && (
          <NewPostForm
            communityImageURL={communityStateValue.currentCommunity?.imageURL}
            user={user}
          />
        )}
      </>
      <>
        {communityStateValue.currentCommunity && (
          <About communityData={communityStateValue.currentCommunity} />
        )}
      </>
    </PageContentLayout>
  );
};
export default SubmitPostPage;
