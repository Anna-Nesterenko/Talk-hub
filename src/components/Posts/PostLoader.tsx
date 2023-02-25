import { Stack, SkeletonText, Skeleton, Box } from "@chakra-ui/react";
import React from "react";

const PostLoader = () => {
  return (
    <Stack spacing={6}>
      <Box padding="10px 10px" boxShadow="lg" bg="white" borderRadius={4}>
        <SkeletonText mt="4" noOfLines={1} width="40%" spacing="4" />
        <SkeletonText mt="4" noOfLines={4} spacing="4" />
        <Skeleton mt="4" height="460px" />
      </Box>
    </Stack>
  );
};
export default PostLoader;
