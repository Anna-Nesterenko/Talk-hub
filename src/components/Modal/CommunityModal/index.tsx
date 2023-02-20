import { auth, firestore } from "@/firebase/config";
import { doc, serverTimestamp, runTransaction } from "firebase/firestore";
import React, { useState } from "react";
import { BsFillEyeFill, BsFillPersonFill } from "react-icons/bs";
import { HiLockClosed } from "react-icons/hi";
import {
  Button,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalCloseButton,
  ModalBody,
  ModalFooter,
  Box,
  Divider,
  Text,
  Input,
  Stack,
  Checkbox,
  Flex,
  Icon,
} from "@chakra-ui/react";
import { useAuthState } from "react-firebase-hooks/auth";

type CommunityModalProps = { open: boolean; handleClose: () => void };

const CommunityModal: React.FC<CommunityModalProps> = ({
  open,
  handleClose,
}) => {
  const [user] = useAuthState(auth);
  const [communityName, setCommunityName] = useState("");
  const [charsRemaining, setCharsRemaining] = useState(21);
  const [communityType, setCommunityType] = useState("public");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.value.length > 21) return;
    setCommunityName(e.target.value);
    // recalculate how many chars we have left in the name
    setCharsRemaining(21 - e.target.value.length);
  };

  const onCommunityTypeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setCommunityType(e.target.name);
  };

  const handleCreateCommunity = async () => {
    if (error) setError("");
    // Validate the community
    const format = /[ `!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?~]/;
    if (format.test(communityName) || communityName.length < 3) {
      setError(
        "Community names must be between 3-21 characters, and can only contain letters, numbers, or underscores"
      );
      return;
    }
    setLoading(true);

    try {
      const communityDocRef = doc(firestore, "communities", communityName);

      await runTransaction(firestore, async (transaction) => {
        // console.log("transaction", transaction);
        const communityDoc = await transaction.get(communityDocRef);
        if (communityDoc.exists()) {
          throw new Error(`Sorry, r/${communityName} is taken. Try another.`);
        }

        transaction.set(communityDocRef, {
          creatorId: user?.uid,
          createdAt: serverTimestamp(),
          numberOfMembers: 1,
          privacyType: communityType,
        });
        // create communitySnippet on user
        transaction.set(
          doc(firestore, `users/${user?.uid}/communitySnippets`, communityName),
          {
            communityId: communityName,
            isModerator: true,
          }
        );
      });
    } catch (error) {
      console.log("handleCreateCommunity error", error);
      setError((error as Error).message);
    }
    setLoading(false);
  };

  return (
    <>
      <Modal
        isCentered
        onClose={handleClose}
        isOpen={open}
        motionPreset="slideInBottom"
      >
        <ModalOverlay />
        <ModalContent>
          <ModalHeader
            display="flex"
            flexDirection="column"
            fontSize={15}
            padding={3}
          >
            Create a community
          </ModalHeader>
          <Box pl={3} pr={3}>
            <Divider />
            <ModalCloseButton />
            <ModalBody display="flex" flexDirection="column" padding="10px 0">
              <Text fontSize={15} fontWeight={600}>
                Name
              </Text>
              <Text fontSize={11} color="gray.500">
                Community names including capitalization cannot be changed
              </Text>
              <Text
                position="relative"
                top="28px"
                left="10px"
                width="20px"
                color="gray.400"
              >
                r/
              </Text>
              <Input
                position="static"
                value={communityName}
                size="sm"
                pl="22px"
                mb={1}
                onChange={handleChange}
              />
              <Text
                fontSize="9pt"
                color={charsRemaining === 0 ? "red" : "gray.500"}
              >
                {charsRemaining} Characters remaining
              </Text>
              <Text fontSize="9pt" color="red" pt={1}>
                {error}
              </Text>
              <Box mt={4} mb={4}>
                <Text fontWeight={600} fontSize={15}>
                  Community Type
                </Text>
                <Stack spacing={2}>
                  <Checkbox
                    name="public"
                    isChecked={communityType === "public"}
                    onChange={onCommunityTypeChange}
                  >
                    <Flex align="center" justify="center">
                      <Icon as={BsFillPersonFill} color="gray.500" mr={2} />
                      <Text fontSize="10pt" mr={2}>
                        Public
                      </Text>
                      {communityType === "public" && (
                        <Text fontSize="8pt" color="gray.500">
                          Anyone can view, post and comment to this community
                        </Text>
                      )}
                    </Flex>
                  </Checkbox>
                  <Checkbox
                    name="restricted"
                    isChecked={communityType === "restricted"}
                    onChange={onCommunityTypeChange}
                  >
                    <Flex align="center" justify="center">
                      <Icon as={BsFillEyeFill} color="gray.500" mr={2} />
                      <Text fontSize="10pt" mr={2}>
                        Restricted
                      </Text>
                      {communityType === "restricted" && (
                        <Text fontSize="8pt" color="gray.500">
                          Anyone can view this community, but only approved
                          users
                        </Text>
                      )}
                    </Flex>
                  </Checkbox>
                  <Checkbox
                    name="private"
                    isChecked={communityType === "private"}
                    onChange={onCommunityTypeChange}
                  >
                    <Flex align="center" justify="center">
                      <Icon as={HiLockClosed} color="gray.500" mr={2} />
                      <Text fontSize="10pt" mr={2}>
                        Private
                      </Text>
                      {communityType === "private" && (
                        <Text fontSize="8pt" color="gray.500">
                          Only approved users can view and submit to this
                          community
                        </Text>
                      )}
                    </Flex>
                  </Checkbox>
                </Stack>
              </Box>
            </ModalBody>
          </Box>

          <ModalFooter bg="gray.100" borderRadius="0 0 10px 10px">
            <Button
              variant="outline"
              height="30px"
              mr={3}
              onClick={handleClose}
            >
              Cancel
            </Button>
            <Button
              height="30px"
              onClick={handleCreateCommunity}
              isLoading={loading}
            >
              Create Community
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </>
  );
};
export default CommunityModal;
