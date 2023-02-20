import React from "react";
import { Flex, Input, InputGroup, InputLeftElement } from "@chakra-ui/react";
import { SearchIcon } from "@chakra-ui/icons";
import { User } from "firebase/auth";

type SearchInputProps = {
  user?: User | null;
};

const SearchInput: React.FC<SearchInputProps> = ({ user }) => {
  return (
    <Flex
      flexGrow={1}
      mr={2}
      maxWidth={user ? "auto" : "600px"}
      alignItems="center"
    >
      <InputGroup>
        <InputLeftElement pointerEvents="none" color="gray.400">
          <SearchIcon mb={2} />
        </InputLeftElement>
        <Input placeholder="Search post..." height="34px" />
      </InputGroup>
    </Flex>
  );
};
export default SearchInput;
