import React, { useState } from "react";
import { Button, Flex, Icon, Input, Text } from "@chakra-ui/react";
import { useSendPasswordResetEmail } from "react-firebase-hooks/auth";
import { BsDot, BsReddit } from "react-icons/bs";
import { useSetRecoilState } from "recoil";
import { authModalState } from "@/atoms/authModalAtom";
import { auth } from "@/firebase/config";

const ResetPassword: React.FC = () => {
  const [email, setEmail] = useState("");
  const [success, setSuccess] = useState(false);

  const setAuthModalState = useSetRecoilState(authModalState);
  const [sendPasswordResetEmail, sending, error] =
    useSendPasswordResetEmail(auth);

  const onSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    await sendPasswordResetEmail(email);
    setSuccess(true);
  };
  return (
    <Flex direction="column" alignItems="center" width="100%">
      <Icon as={BsReddit} color="brand.100" fontSize={40} mb={2} />
      <Text fontWeight={700} mb={2}>
        Reset your password
      </Text>
      {success ? (
        <Text mb={4}>Check your email :)</Text>
      ) : (
        <>
          <Text fontSize="sm" textAlign="center" mb={2}>
            {`Enter the email associated with your account and we'll send you a
            reset link`}
          </Text>
          <form onSubmit={onSubmit} style={{ width: "100%" }}>
            <Input
              required
              name="email"
              placeholder="email"
              type="email"
              mb={2}
              onChange={(e) => setEmail(e.target.value)}
            />
            <Text textAlign="center" fontSize="10pt" color="red">
              {error?.message}
            </Text>
            <Button
              width="100%"
              height="36px"
              mb={2}
              mt={2}
              type="submit"
              isLoading={sending}
            >
              Reset Password
            </Button>
          </form>
        </>
      )}
      <Flex
        alignItems="center"
        fontSize="9pt"
        color="blue.500"
        fontWeight={700}
        cursor="pointer"
      >
        <Text
          onClick={() =>
            setAuthModalState((prev) => ({
              ...prev,
              view: "login",
            }))
          }
        >
          LOGIN
        </Text>
        <Icon as={BsDot} />
        <Text
          onClick={() =>
            setAuthModalState((prev) => ({
              ...prev,
              view: "signup",
            }))
          }
        >
          SIGN UP
        </Text>
      </Flex>
    </Flex>
  );
};
export default ResetPassword;
