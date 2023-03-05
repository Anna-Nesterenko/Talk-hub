import React, { useState } from "react";
import CommunityModal from "@/components/Modal/CommunityModal";
import { Box, Flex, Icon, MenuItem, Text } from "@chakra-ui/react";
import { GrAdd } from "react-icons/gr";
import { useRecoilValue } from "recoil";
import { communityState } from "@/atoms/communitiesAtom";
import MenuListItem from "./MenuListItem";
import { FaGlobeEurope} from "react-icons/fa";


const Communities = () => {
  const [open, setOpen] = useState(false);
  const mySnippets = useRecoilValue(communityState).mySnippets;
//   console.log(mySnippets);
  return (
    <>
      <CommunityModal open={open} handleClose={() => setOpen(false)} />
      <Box mt={3} mb={4}>
        <Text pl={3} mb={1} fontSize="7pt" fontWeight={500} color="gray.500">
          MODERATING
        </Text>
        {mySnippets
          .filter((item) => item.isModerator)
          .map((snippet) => (
            <MenuListItem
              key={snippet.communityId}
              displayText={`r/${snippet.communityId}`}
              link={`/r/${snippet.communityId}`}
              icon={FaGlobeEurope}
              iconColor="brand.100"
              imageURL={snippet.imageURL}
            />
          ))}
      </Box>
      <Box mt={3} mb={4}>
        <Text pl={3} mb={1} fontSize="7pt" fontWeight={500} color="gray.500">
          MY COMMUNITIES
        </Text>
        <MenuItem
          width="100%"
          fontSize="10pt"
          _hover={{ bg: "gray.100" }}
          onClick={() => setOpen(true)}
        >
          <Flex align="center">
            <Icon fontSize={20} mr={2} as={GrAdd} />
            Create Community
          </Flex>
        </MenuItem>
        {mySnippets.map((snippet) => (
          <MenuListItem
            key={snippet.communityId}
            icon={FaGlobeEurope}
            displayText={`r/${snippet.communityId}`}
            link={`/r/${snippet.communityId}`}
            iconColor="blue.500"
            imageURL={snippet.imageURL}
          />
        ))}
      </Box>
    </>
  );
};
export default Communities;
