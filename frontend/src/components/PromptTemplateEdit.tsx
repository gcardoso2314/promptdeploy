import { Box, Fieldset, TextInput, Text, Group, ActionIcon, Button } from "@mantine/core"
import { useState } from "react";
import { IconEdit, IconDeviceFloppy } from "@tabler/icons-react";
import { updatePrompt } from "../actions";

interface PromptTemplateEditProps {
    prompt: Prompt | null;
}

function PromptTemplateEdit({ prompt }: PromptTemplateEditProps) {
    if (!prompt) {
        return null;
    }

    const [name, setName] = useState(prompt.name);
    const [description, setDescription] = useState(prompt.description);
    const [editName, setEditName] = useState(false);
    const [editDescription, setEditDescription] = useState(false);

    const handleEditName = () => {
        prompt.name = name;
        updatePrompt(prompt);
        setEditName(false);
    }

    const handleEditDescription = () => {
        prompt.description = description;
        updatePrompt(prompt);
        setEditDescription(false);
    }

    const saveNameButton = <ActionIcon onClick={handleEditName} size="sm"><IconDeviceFloppy></IconDeviceFloppy></ActionIcon>;
    const saveDescriptionButton = <ActionIcon onClick={handleEditDescription} size="sm"><IconDeviceFloppy></IconDeviceFloppy></ActionIcon>;

    return (
        <Box>
            <Fieldset legend="Prompt Details">
                <Group justify="start">
                    {editName ? <TextInput rightSection={saveNameButton} label="Prompt Name" defaultValue={prompt.name} onChange={e => setName(e.currentTarget.value)} /> : <><ActionIcon onClick={() => setEditName(true)} size="sm"><IconEdit></IconEdit></ActionIcon><Text>{prompt.name}</Text></>}
                </Group>
                <Group justify="start" mt="md">
                    {editDescription ? <TextInput rightSection={saveDescriptionButton} label="Prompt Description" defaultValue={prompt.description} onChange={e => setDescription(e.currentTarget.value)} /> : <><ActionIcon onClick={() => setEditDescription(true)} size="sm"><IconEdit></IconEdit></ActionIcon><Text>{prompt.description}</Text></>}
                </Group>

            </Fieldset>
        </Box>
    )
}

export default PromptTemplateEdit