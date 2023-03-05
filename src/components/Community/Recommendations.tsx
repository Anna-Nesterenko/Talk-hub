import { Community } from "@/atoms/communitiesAtom";
import { firestore } from "@/firebase/config";
import useCommunityData from "@/hooks/useCommunityData";
import {
  Flex,
  Skeleton,
  SkeletonCircle,
  Stack,
  Text,
  Image,
  Icon,
  Button,
  Box,
} from "@chakra-ui/react";
import { collection, getDocs, limit, orderBy, query } from "firebase/firestore";
import Link from "next/link";
import { useEffect, useState } from "react";
import { FaGlobeEurope } from "react-icons/fa";

const Recommendations = () => {
  const [communities, setCommunities] = useState<Community[]>([]);
  const [loading, setLoading] = useState(false);
  const { communityStateValue, onJoinOrLeaveCommunity } = useCommunityData();

  const getCommunityRecommendations = async () => {
    setLoading(true);
    try {
      const communityQuery = query(
        collection(firestore, "communities"),
        orderBy("numberOfMembers", "desc"),
        limit(5)
      );
      const communityDocs = await getDocs(communityQuery);
      const communities = communityDocs.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      setCommunities(communities as Community[]);
    } catch (error) {
      console.log("getCommunityRecommendations error", error);
    }
    setLoading(false);
  };

  const getCommunityAll = async () => {
    const communityQuery = query(
      collection(firestore, "communities"),
      orderBy("numberOfMembers", "desc")
    );
    const communityDocs = await getDocs(communityQuery);
    const communities = communityDocs.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }));
    setCommunities(communities as Community[]);
  };

  useEffect(() => {
    getCommunityRecommendations();
  }, []);

  return (
    <Flex
      direction="column"
      bg="white"
      borderRadius={4}
      border="1px solid"
      borderColor="gray.300"
      height="fit-content"
      width="270px"
    >
      <Flex
        align="flex-end"
        color="white"
        p="6px 10px"
        height="70px"
        borderRadius="4px 4px 0px 0px"
        fontWeight={700}
        bgImage="url(/images/bgHome.jpg)"
        backgroundSize="cover"
        bgGradient="linear-gradient(to bottom, rgba(0, 0, 0, 0), rgba(0, 0, 0, 0.75)),
        url('/images/bgHome.jpg')"
      >
        Top Communities
      </Flex>
      <Flex direction="column">
        {loading ? (
          <Stack mt={2} p={3}>
            <Flex justify="space-between" align="center">
              <SkeletonCircle size="10" />
              <Skeleton height="10px" width="70%" />
            </Flex>
            <Flex justify="space-between" align="center">
              <SkeletonCircle size="10" />
              <Skeleton height="10px" width="70%" />
            </Flex>
            <Flex justify="space-between" align="center">
              <SkeletonCircle size="10" />
              <Skeleton height="10px" width="70%" />
            </Flex>
          </Stack>
        ) : (
          <>
            {communities.map((item, index) => {
              const isJoined = !!communityStateValue.mySnippets.find(
                (snippet) => snippet.communityId === item.id
              );
              return (
                <Flex
                  key={item.id}
                  position="relative"
                  align="center"
                  fontSize="10pt"
                  borderBottom="1px solid"
                  borderColor="gray.200"
                  p="10px 12px"
                >
                  <Flex width="80%" align="center">
                    <Flex width="15%">
                      <Text>{index + 1}</Text>
                    </Flex>
                    <Flex align="center" width="80%">
                      {item.imageURL ? (
                        <Image
                          alt="avatar"
                          src={item.imageURL}
                          borderRadius="full"
                          boxSize="28px"
                          mr={2}
                        />
                      ) : (
                        <Icon
                          as={FaGlobeEurope}
                          fontSize={30}
                          color="brand.100"
                          mr={2}
                        />
                      )}

                      <Link href={`/r/${item.id}`}>
                        <Text
                          _hover={{ color: "gray.500" }}
                        >{`r/${item.id}`}</Text>
                      </Link>
                    </Flex>
                  </Flex>
                  <Box position="absolute" right="10px">
                    <Button
                      height="22px"
                      fontSize="8pt"
                      variant={isJoined ? "outline" : "solid"}
                      onClick={(event) => {
                        event.stopPropagation();
                        onJoinOrLeaveCommunity(item, isJoined);
                      }}
                    >
                      {isJoined ? "Joined" : "Join"}
                    </Button>
                  </Box>
                </Flex>
              );
            })}
            <Box p="10px 20px">
              <Button height="30px" width="100%" onClick={getCommunityAll}>
                View All
              </Button>
            </Box>
          </>
        )}
      </Flex>
    </Flex>
  );
};
export default Recommendations;
