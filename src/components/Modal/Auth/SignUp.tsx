import { authModalState } from "@/atoms/authModalAtom";
import { Button, Flex, Input, Text } from "@chakra-ui/react";
import React, { useEffect, useState } from "react";
import { useSetRecoilState } from "recoil";
import { useCreateUserWithEmailAndPassword } from "react-firebase-hooks/auth";
import { auth, firestore } from "@/firebase/config";
import { FIREBASE_ERRORS } from "@/firebase/errors";
import { setDoc, doc } from "firebase/firestore";
import { User } from "@firebase/auth";

const SignUp: React.FC = () => {
  const [signUpForm, setSignUpForm] = useState({
    email: "",
    password: "",
    confirmPassword: "",
  });

  const setAuthModalState = useSetRecoilState(authModalState);
  const [error, setError] = useState("");

  const [createUserWithEmailAndPassword, userCred, loading, userError] =
    useCreateUserWithEmailAndPassword(auth);

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (error) setError("");
    if (signUpForm.password !== signUpForm.confirmPassword) {
      setError("Password do not match");
      return;
    }
    createUserWithEmailAndPassword(signUpForm.email, signUpForm.password);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSignUpForm((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

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
    <form onSubmit={handleSubmit}>
      <Input
        required
        name="email"
        placeholder="Email"
        type="email"
        mb={2}
        onChange={handleChange}
      />
      <Input
        required
        name="password"
        placeholder="Password"
        type="password"
        mb={2}
        onChange={handleChange}
      />
      <Input
        required
        name="confirmPassword"
        placeholder="Confirm password"
        type="password"
        mb={2}
        onChange={handleChange}
      />

      <Text textAlign="center" color="red" fontSize="10pt">
        {error ||
          FIREBASE_ERRORS[userError?.message as keyof typeof FIREBASE_ERRORS]}
      </Text>

      <Button
        width="100%"
        height="36px"
        mb={2}
        mt={2}
        type="submit"
        isLoading={loading}
      >
        Sign Up
      </Button>
      <Flex fontSize="9pt" justifyContent="center">
        <Text mr={1}>Already a redditor?</Text>
        <Text
          color="blue.500"
          fontWeight={700}
          cursor="pointer"
          onClick={() =>
            setAuthModalState((prev) => ({
              ...prev,
              view: "login",
            }))
          }
        >
          LOGIN
        </Text>
      </Flex>
    </form>
  );
};
export default SignUp;
