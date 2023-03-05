import { authModalState } from "@/atoms/authModalAtom";
import { auth } from "@/firebase/config";
import useDirectory from "@/hooks/useDirectory";
import { Flex, Icon, Input } from "@chakra-ui/react";
import { useRouter } from "next/router";
import { useAuthState } from "react-firebase-hooks/auth";
import { BsLink45Deg } from "react-icons/bs";
import { FaSmileWink } from "react-icons/fa";
import { IoImageOutline } from "react-icons/io5";
import { useSetRecoilState } from "recoil";

const CommunityPostLink = () => {
  const router = useRouter();
  const [user] = useAuthState(auth);
  const setAuthModalState = useSetRecoilState(authModalState);
  const { toggleMenuOpen } = useDirectory();

  const onClick = () => {
    if (!user) {
      setAuthModalState({ open: true, view: "login" });
      return;
    }
    // Could check for user to open auth modal before redirecting to submit
    const { community } = router.query;
    if (community) {
      router.push(`/r/${community}/submit`);
      return;
    }
    // Open directory menu to select community to post to
    toggleMenuOpen();
  };

  return (
    <Flex
      justify="space-evenly"
      align="center"
      bg="white"
      height="56px"
      borderRadius={4}
      border="1px solid"
      borderColor="gray.300"
      p={2}
      mb={4}
    >
      <Icon as={FaSmileWink} fontSize={36} color="gray.300" mr={4} />
      <Input
        placeholder="Create Post"
        fontSize="10pt"
        _placeholder={{ color: "gray.500" }}
        _hover={{
          bg: "white",
          border: "1px solid",
          borderColor: "blue.500",
        }}
        _focus={{
          outline: "none",
          bg: "white",
          border: "1px solid",
          borderColor: "blue.500",
        }}
        bg="gray.50"
        borderColor="gray.200"
        height="36px"
        borderRadius={4}
        mr={4}
        onClick={onClick}
      />
      <Icon
        as={IoImageOutline}
        fontSize={24}
        mr={4}
        color="gray.400"
        cursor="pointer"
      />
      <Icon as={BsLink45Deg} fontSize={24} color="gray.400" cursor="pointer" />
    </Flex>
  );
};
export default CommunityPostLink;
