import React, { useRef, useState } from "react";
import { User } from "firebase/auth";
import { IoDocumentText, IoImageOutline } from "react-icons/io5";
import { BsLink45Deg, BsMic } from "react-icons/bs";
import { Flex, Icon } from "@chakra-ui/react";
import { BiPoll } from "react-icons/bi";
import TabItem from "./TabItem";
import TextInputs from "./TextInputs";
import ImageUpload from "./ImageUpload";
import { useRouter } from "next/router";

import { firestore, storage } from "@/firebase/config";
import {
  addDoc,
  serverTimestamp,
  collection,
  updateDoc,
} from "firebase/firestore";
import { getDownloadURL, ref, uploadString } from "firebase/storage";
import useSelectFile from "@/hooks/useSelectFile";

const formTabs: TabItemType[] = [
  {
    title: "Post",
    icon: IoDocumentText,
  },
  {
    title: "Images & Video",
    icon: IoImageOutline,
  },
  {
    title: "Link",
    icon: BsLink45Deg,
  },
  {
    title: "Poll",
    icon: BiPoll,
  },
  {
    title: "Talk",
    icon: BsMic,
  },
];

export type TabItemType = {
  title: string;
  icon: typeof Icon.arguments;
};

type NewPostFormProps = {
  communityImageURL?: string;
  user: User;
};

const NewPostForm: React.FC<NewPostFormProps> = ({
  user,
  communityImageURL,
}) => {
  const router = useRouter();
  const [selectedTab, setSelectedTab] = useState(formTabs[0].title);
  const [textInputs, setTextInputs] = useState({ title: "", body: "" });
  const { selectedFile, setSelectedFile, onSelectFile } = useSelectFile();
  const [loading, setLoading] = useState(false);
  const selectFileRef = useRef<HTMLInputElement>(null);
  const [error, setError] = useState("");
  const { community } = router.query;

  const handleCreatePost = async () => {
    setLoading(true);
    const { title, body } = textInputs;
    try {
      const postDocRef = await addDoc(collection(firestore, "posts"), {
        communityId: community,
        communityImageURL: communityImageURL || "",
        creatorId: user.uid,
        userDisplayText: user.email!.split("@")[0],
        title,
        body,
        numberOfComments: 0,
        voteStatus: 0,
        createdAt: serverTimestamp(),
        editedAt: serverTimestamp(),
      });

      console.log("HERE IS NEW POST ID", postDocRef.id);

      // check if selectedFile exists, if it does, do image processing
      if (selectedFile) {
        const imageRef = ref(storage, `posts/${postDocRef.id}/image`);
        await uploadString(imageRef, selectedFile, "data_url");
        const downloadURL = await getDownloadURL(imageRef);
        await updateDoc(postDocRef, {
          imageURL: downloadURL,
        });
        console.log("HERE IS DOWNLOAD URL", downloadURL);
      }

      router.back();
    } catch (error) {
      console.log("createPost error", error);
      setError("Error creating post");
    }
    setLoading(false);
  };

  const onTextChange = ({
    target: { name, value },
  }: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setTextInputs((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  return (
    <Flex direction="column" bg="white" borderRadius={4} mt={2}>
      <Flex width="100%">
        {formTabs.map((item, index) => (
          <TabItem
            key={index}
            item={item}
            selected={item.title === selectedTab}
            setSelectedTab={setSelectedTab}
          />
        ))}
      </Flex>
      <Flex p={4}>
        {selectedTab === "Post" && (
          <TextInputs
            textInputs={textInputs}
            onChange={onTextChange}
            handleCreatePost={handleCreatePost}
            loading={loading}
          />
        )}
        {selectedTab === "Images & Video" && (
          <ImageUpload
            selectedFile={selectedFile}
            setSelectedFile={setSelectedFile}
            setSelectedTab={setSelectedTab}
            selectFileRef={selectFileRef}
            onSelectImage={onSelectFile}
          />
        )}
      </Flex>
    </Flex>
  );
};
export default NewPostForm;
