import React from "react";
import { ChevronDownIcon } from "@chakra-ui/icons";
import { TiHome } from "react-icons/ti";
import {
  Flex,
  Icon,
  Menu,
  MenuButton,
  MenuList,
  Text,
  Image,
} from "@chakra-ui/react";
import Communities from "./Communities";
import useDirectory from "@/hooks/useDirectory";

const DirectoryMenu: React.FC = () => {
  const { directoryState, toggleMenuOpen } = useDirectory();
  //   console.log(directoryState);
  return (
    <Menu isOpen={directoryState.isOpen}>
      <MenuButton
        ml={2}
        mr={{ base: 2, md: 4 }}
        padding="0px 6px"
        borderRadius={4}
        _hover={{ outline: "1px solid", outlineColor: "gray.200" }}
        onClick={toggleMenuOpen}
      >
        <Flex
          align="center"
          justify="space-between"
          width={{ base: "auto", lg: "150px" }}
        >
          <Flex align="center">
            {directoryState.selectedMenuItem.imageURL ? (
              <Image
                alt="home avatar"
                borderRadius="full"
                boxSize="24px"
                src={directoryState.selectedMenuItem.imageURL}
                mr={2}
              />
            ) : (
              <Icon
                fontSize={24}
                mr={{ base: 1, md: 2 }}
                color={directoryState.selectedMenuItem.iconColor}
                as={directoryState.selectedMenuItem.icon}
              />
            )}
            <Flex display={{ base: "none", lg: "flex" }}>
              <Text fontWeight={600} fontSize="10pt">
                {directoryState.selectedMenuItem.displayText}
              </Text>
            </Flex>
          </Flex>
          <ChevronDownIcon />
        </Flex>
      </MenuButton>
      <MenuList>
        <Communities />
      </MenuList>
    </Menu>
  );
};
export default DirectoryMenu;
