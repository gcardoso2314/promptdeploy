import { FunctionComponent, useEffect, useState } from "react";
import { Text, SimpleGrid, Button, Drawer } from "@mantine/core";
import PromptCard from "./PromptCard";
import PromptAddModal from "./PromptAddModal";
import { fetchUserPrompts } from "../actions";
import { camelizeKeys } from "humps";
import { IconPlus } from "@tabler/icons-react";
import { useDisclosure } from "@mantine/hooks";

export const PromptGrid: FunctionComponent = () => {
  const [prompts, setPrompts] = useState<Prompt[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [newPromptModalVisible, setNewPromptModalVisible] =
    useState<boolean>(false);
  const [editPromptDrawerOpen, { open, close }] = useDisclosure(false);

  const addNewPrompt = (newPrompt: Prompt) => {
    setPrompts(prevPrompts => [...prevPrompts, newPrompt]);
  };

  useEffect(() => {
    const fetchAndSetPrompts = async () => {
      const data = await fetchUserPrompts();
      setPrompts(camelizeKeys(data));
      setIsLoading(false);
    };
    try {
      fetchAndSetPrompts();
    } catch (error) {
      setError("Failed to fetch prompts.");
      setIsLoading(false);
    }
  }, []); // Empty dependency array means this effect runs once on mount
  return (
    <>
      {error && <Text>Something went wrong when loading prompts.</Text>}
      {isLoading && <Text>Loading prompts...</Text>}
      <SimpleGrid cols={3}>
        {prompts.map(prompt => (
          <PromptCard
            key={prompt.id}
            id={prompt.id}
            name={prompt.name}
            description={prompt.description}
            createdAt={prompt.createdAt}
            isDeployed={prompt.isDeployed}
            openEditDrawer={open}
          />
        ))}
      </SimpleGrid>
      <Button mt="md" fullWidth onClick={() => setNewPromptModalVisible(true)}>
        <IconPlus size={18} />Add New Prompt
      </Button>
      <PromptAddModal
        opened={newPromptModalVisible}
        onClose={() => setNewPromptModalVisible(false)}
        onNewPrompt={addNewPrompt}
      />
      <Drawer opened={editPromptDrawerOpen} onClose={close} size="100%" title="Edit Prompt Template" transitionProps={{ duration: 500 }}>
        {/* Drawer content */}
      </Drawer>
    </>
  );
};
