import React from "react";
import type { GetServerSidePropsContext, NextPage } from "next";
import safeJsonStringify from "safe-json-stringify";
import { doc, getDoc } from "firebase/firestore";
import { firestore } from "@/firebase/config";
import { Community } from "@/atoms/communitiesAtom";
import CommunityNotFound from "@/components/Community/CommunityNotFound";
import Header from "@/components/Community/Header";
import PageContentLayout from "@/components/Layout/PageContentLayout";
import CommunityPostLink from "@/components/Community/CommunityPostLink";

type CommunityPageProps = {
  communityData: Community;
};

const CommunityPage: NextPage<CommunityPageProps> = ({ communityData }) => {
  console.log(communityData);

  if (!communityData) {
    return <CommunityNotFound />;
  }
  return (
    <>
      <Header communityData={communityData} />
      <PageContentLayout>
        <>
          <CommunityPostLink />
        </>
        <>
          <div>Right side</div>
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
