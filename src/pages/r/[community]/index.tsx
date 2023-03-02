import React, { useEffect } from "react";
import type { GetServerSidePropsContext, NextPage } from "next";
import safeJsonStringify from "safe-json-stringify";
import { doc, getDoc } from "firebase/firestore";
import { auth, firestore } from "@/firebase/config";
import { Community, communityState } from "@/atoms/communitiesAtom";
import CommunityNotFound from "@/components/Community/CommunityNotFound";
import Header from "@/components/Community/Header";
import PageContentLayout from "@/components/Layout/PageContentLayout";
import CommunityPostLink from "@/components/Community/CommunityPostLink";
import Posts from "@/components/Posts";
import { useRecoilState } from "recoil";
import { useAuthState } from "react-firebase-hooks/auth";
import About from "@/components/Community/About";
import { Box } from "@chakra-ui/react";

type CommunityPageProps = {
  communityData: Community;
};

const CommunityPage: NextPage<CommunityPageProps> = ({ communityData }) => {
  const [user, loadingUser] = useAuthState(auth);
  const [communityStateValue, setCommunityStateValue] =
    useRecoilState(communityState);

  useEffect(() => {
    setCommunityStateValue((prev) => ({
      ...prev,
      currentCommunity: communityData,
    }));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [communityData]);

  // Community was not found in the database
  if (!communityData) {
    return <CommunityNotFound />;
  }

  return (
    <>
      <Header communityData={communityData} />
      <PageContentLayout>
        <>
          <CommunityPostLink />
          <Posts communityData={communityData} />
        </>
        <>
          <Box display="block">
            <About communityData={communityData} />
          </Box>
        </>
      </PageContentLayout>
    </>
  );
};

export default CommunityPage;

export async function getServerSideProps(context: GetServerSidePropsContext) {
  console.log("GET SERVER SIDE PROPS RUNNING");

  try {
    const communityDocRef = doc(
      firestore,
      "communities",
      context.query.community as string
    );
    const communityDoc = await getDoc(communityDocRef);
    return {
      props: {
        communityData: communityDoc.exists()
          ? JSON.parse(
              safeJsonStringify({ id: communityDoc.id, ...communityDoc.data() }) // needed for dates
            )
          : "",
      },
    };
  } catch (error) {
    // Could create error page here
    console.log("getServerSideProps error - [community]", error);
  }
}
