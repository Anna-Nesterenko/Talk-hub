import { defaultMenuItem } from "@/atoms/directoryMenuAtom";
import { auth } from "@/firebase/config";
import useDirectory from "@/hooks/useDirectory";
import { Flex, Image } from "@chakra-ui/react";
import React from "react";
import { useAuthState } from "react-firebase-hooks/auth";
import DirectoryMenu from "./DirectoryMenu";
import RightContent from "./RightContent";
import SearchInput from "./SearchInput";

const Navbar: React.FC = () => {
  const [user, loading, error] = useAuthState(auth);
  const { onSelectMenuItem } = useDirectory();

  return (
    <Flex
      bg="white"
      height="44px"
      padding="6px 12px"
      justify={{ md: "space-between" }}
    >
      <Flex
        align="center"
        width={{ base: "40px", md: "auto" }}
        cursor="pointer"
        onClick={() => onSelectMenuItem(defaultMenuItem)}
      >
        <Image height="30px" src="/images/haooy.svg" alt="Reddit Face" />
        <Image
          height="35px"
          src="/images/text.svg"
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
