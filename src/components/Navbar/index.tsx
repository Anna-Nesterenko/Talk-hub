import { auth } from "@/firebase/config";
import { Flex, Image } from "@chakra-ui/react";
import React from "react";
import { useAuthState } from "react-firebase-hooks/auth";
import DirectoryMenu from "./DirectoryMenu";
import RightContent from "./RightContent";
import SearchInput from "./SearchInput";

const Navbar: React.FC = () => {
  const [user, loading, error] = useAuthState(auth);

  return (
    <Flex
      bg="white"
      height="44px"
      padding="6px 12px"
      justify={{ md: "space-between" }}
    >
      <Flex align="center" width={{ base: "40px", md: "auto" }}>
        <Image height="30px" src="/images/redditFace.svg" alt="Reddit Face" />
        <Image
          height="46px"
          src="/images/redditText.svg"
          alt="Reddit Text"
          display={{ base: "none", md: "unset" }}
        />
      </Flex>
      {user && <DirectoryMenu />}
      <SearchInput user={user} />
      <RightContent user={user} />
    </Flex>
  );
};

export default Navbar;
