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
} from "@chakra-ui/react";
import Communities from "./Communities";

const DirectoryMenu: React.FC = () => {
  return (
    <Menu>
      <MenuButton
        ml={2}
        mr={{ base: 2, md: 4 }}
        padding="0px 6px"
        borderRadius={4}
        _hover={{ outline: "1px solid", outlineColor: "gray.200" }}
      >
        <Flex
          align="center"
          justify="space-between"
          width={{ base: "auto", lg: "150px" }}
        >
          <Flex align="center">
            <Icon fontSize={24} mr={{ base: 1, md: 2 }} as={TiHome} />
            <Flex display={{ base: "none", lg: "flex" }}>
              <Text fontWeight={600} fontSize="10pt">
                Home
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
