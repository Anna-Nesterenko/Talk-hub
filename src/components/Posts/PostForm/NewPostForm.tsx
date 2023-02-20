import React, { useState } from "react";
import { User } from "firebase/auth";
import { IoDocumentText, IoImageOutline } from "react-icons/io5";
import { BsLink45Deg, BsMic } from "react-icons/bs";
import { Flex, Icon } from "@chakra-ui/react";
import { BiPoll } from "react-icons/bi";
import TabItem from "./TabItem";
import TextInputs from "./TextInputs";

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
  //   communityId: string;
  //   communityImageURL?: string;
  //   user: User;
};

const NewPostForm: React.FC<NewPostFormProps> = () => {
  const [selectedTab, setSelectedTab] = useState(formTabs[0].title);
  const [textInputs, setTextInputs] = useState({ title: "", body: "" });
  const [selectedFile, setSelectedFile] = useState<string>("");
  const [loading, setLoading] = useState(false);

  const handleCreatePost = async () => {};

  const onSelectImage = (event: React.ChangeEvent<HTMLInputElement>) => {};

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
          <>3</>
          //   <ImageUpload
          //     selectedFile={selectedFile}
          //     setSelectedFile={setSelectedFile}
          //     setSelectedTab={setSelectedTab}
          //     selectFileRef={selectFileRef}
          //     onSelectImage={onSelectImage}
          //   />
        )}
      </Flex>
    </Flex>
  );
};
export default NewPostForm;
