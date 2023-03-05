import { Button, Flex, Image, Text } from "@chakra-ui/react";
import React, { useEffect } from "react";
import { useSignInWithGoogle } from "react-firebase-hooks/auth";
import { auth, firestore } from "@/firebase/config";
import { FIREBASE_ERRORS } from "@/firebase/errors";
import { User } from "firebase/auth";
import { setDoc, doc } from "firebase/firestore";

const OAuthButtons: React.FC = () => {
  const [signInWithGoogle, userCred, loading, error] =
    useSignInWithGoogle(auth);

  const createUserDocument = async (user: User) => {
    await setDoc(
      doc(firestore, "users", user.uid),
      JSON.parse(JSON.stringify(user))
    );
  };

  useEffect(() => {
    if (userCred) {
      createUserDocument(userCred.user);
    }
  }, [userCred]);

  return (
    <Flex direction="column" width="100%" mb={2}>
      <Button
        mb={2}
        variant="oauth"
        isLoading={loading}
        onClick={() => signInWithGoogle()}
      >
        <Image
          src="/images/googlelogo.png"
          alt="google logo"
          height="20px"
          mr={2}
        />
        Continue with Google
      </Button>

      <Text textAlign="center" color="red" fontSize="10pt">
        {error?.message ||
          FIREBASE_ERRORS[error?.message as keyof typeof FIREBASE_ERRORS]}
      </Text>
    </Flex>
  );
};
export default OAuthButtons;
