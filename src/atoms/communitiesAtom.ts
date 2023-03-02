import { atom } from "recoil";
import { FieldValue, Timestamp } from "firebase/firestore";

export interface Community {
  id: string;
  creatorId: string;
  numberOfMembers: number;
  privacyType: "public" | "restricted" | "private";
  createdAt?: Timestamp;
  imageURL?: string;
}

export interface CommunitySnippet {
  communityId: string;
  isModerator?: boolean;
  imageURL?: string;
}

export interface CommunityState {
  //   [key: string]:
  //     | CommunitySnippet[]
  //     | { [key: string]: Community }
  //     | Community
  //     | boolean
  //     | undefined;
  mySnippets: CommunitySnippet[];
  snippetsFetched: boolean;
  currentCommunity?: Community;
  //   visitedCommunities: {
  //     [key: string]: Community;
  //   };
}

// export const defaultCommunity: Community = {
//   id: "",
//   creatorId: "",
//   numberOfMembers: 0,
//   privacyType: "public",
// };

export const defaultCommunityState: CommunityState = {
  mySnippets: [],
  snippetsFetched: false,
  //   initSnippetsFetched: false,
  //   visitedCommunities: {},
  //   currentCommunity: defaultCommunity,
};

export const communityState = atom<CommunityState>({
  key: "communitiesState",
  default: defaultCommunityState,
});
