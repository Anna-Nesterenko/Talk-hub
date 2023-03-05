import { useRouter } from "next/router";
import { useAuthState } from "react-firebase-hooks/auth";
import {
  Community,
  CommunitySnippet,
  communityState,
} from "@/atoms/communitiesAtom";
import { useState, useEffect } from "react";
import { useRecoilState, useSetRecoilState } from "recoil";
import { auth, firestore } from "@/firebase/config";
import {
  collection,
  getDocs,
  writeBatch,
  doc,
  increment,
  getDoc,
} from "firebase/firestore";
import { authModalState } from "@/atoms/authModalAtom";

const useCommunityData = () => {
  const [user] = useAuthState(auth);
  const setAuthModalState = useSetRecoilState(authModalState);
  const router = useRouter();

  const [communityStateValue, setCommunityStateValue] =
    useRecoilState(communityState);

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const onJoinOrLeaveCommunity = (community: Community, isJoined?: boolean) => {
    // console.log("ON JOIN LEAVE", community.id);

    if (!user) {
      setAuthModalState({ open: true, view: "login" });
      return;
    }

    setLoading(true);
    if (isJoined) {
      leaveCommunity(community.id);
      return;
    }
    joinCommunity(community);
  };

  const joinCommunity = async (community: Community) => {
    // console.log("JOINING COMMUNITY: ", community.id);
    try {
      const batch = writeBatch(firestore);

      const newSnippet: CommunitySnippet = {
        communityId: community.id,
        imageURL: community.imageURL || "",
        isModerator: user?.uid === community.creatorId,
      };
      batch.set(
        doc(firestore, `users/${user?.uid}/communitySnippets`, community.id),
        newSnippet
      );
      batch.update(doc(firestore, "communities", community.id), {
        numberOfMembers: increment(1),
      });
      await batch.commit();

      setCommunityStateValue((prev) => ({
        ...prev,
        mySnippets: [...prev.mySnippets, newSnippet],
      }));
    } catch (error: any) {
      console.log("joinCommunity error", error);
      setError(error.message);
    }
    setLoading(false);
  };

  const leaveCommunity = async (communityId: string) => {
    try {
      const batch = writeBatch(firestore);

      batch.delete(
        doc(firestore, `users/${user?.uid}/communitySnippets/${communityId}`)
      );

      batch.update(doc(firestore, "communities", communityId), {
        numberOfMembers: increment(-1),
      });

      await batch.commit();
      setCommunityStateValue((prev) => ({
        ...prev,
        mySnippets: prev.mySnippets.filter(
          (item) => item.communityId !== communityId
        ),
      }));
    } catch (error: any) {
      console.log("leaveCommunity error", error);
      setError(error.message);
    }
    setLoading(false);
  };

  const getMySnippets = async () => {
    setLoading(true);
    try {
      const snippetsDocs = await getDocs(
        collection(firestore, `users/${user?.uid}/communitySnippets`)
      );
      const snippets = snippetsDocs.docs.map((doc) => ({ ...doc.data() }));
      setCommunityStateValue((prev) => ({
        ...prev,
        mySnippets: snippets as CommunitySnippet[],
        snippetsFetched: true,
      }));
    } catch (error: any) {
      console.log("getMYSnippetsError", error);
      setError(error.message);
    }
    setLoading(false);
  };

  const getCommunityData = async (communityId: string) => {
    // console.log("GETTING COMMUNITY DATA");

    try {
      const communityDocRef = doc(firestore, "communities", communityId);
      const communityDoc = await getDoc(communityDocRef);

      setCommunityStateValue((prev) => ({
        ...prev,
        currentCommunity: {
          id: communityDoc.id,
          ...communityDoc.data(),
        } as Community,
      }));
    } catch (error: any) {
      console.log("getCommunityData error", error.message);
    }
  };

  useEffect(() => {
    if (!user) {
      setCommunityStateValue((prev) => ({
        ...prev,
        mySnippets: [],
        snippetsFetched: false,
      }));
      return;
    }
    getMySnippets();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user]);

  useEffect(() => {
    const { community } = router.query;
    if (community && !communityStateValue.currentCommunity) {
      getCommunityData(community as string);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [router.query, communityStateValue.currentCommunity]);

  return { onJoinOrLeaveCommunity, communityStateValue, loading };
};
export default useCommunityData;
