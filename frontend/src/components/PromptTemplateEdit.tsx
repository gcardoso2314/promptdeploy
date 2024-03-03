import { Box, Fieldset, TextInput, Text, Group, ActionIcon, Button } from "@mantine/core"
import { useState } from "react";
import { IconEdit } from "@tabler/icons-react";

interface PromptTemplateEditProps {
    prompt: Prompt | null;
}

function PromptTemplateEdit({ prompt }: PromptTemplateEditProps) {
    const [editName, setEditName] = useState(false);
    const [editDescription, setEditDescription] = useState(false);

    if (!prompt) {
        return null;
    }

    return (
        <Box>
            <Fieldset legend="Prompt Details">
                <Group justify="space-between">
                    {editName ? <><TextInput label="Prompt Name" value={prompt.name} /><Button size="sm">Save</Button></> : <><Text>{prompt.name}</Text><ActionIcon onClick={() => setEditName(true)} size="sm"><IconEdit></IconEdit></ActionIcon></>}
                </Group>
                <Group justify="space-between">
                    {editDescription ? <><TextInput label="Prompt Description" value={prompt.description} mt="md" /></> : <><Text>{prompt.description}</Text><ActionIcon onClick={() => setEditDescription(true)} size="sm"><IconEdit></IconEdit></ActionIcon></>}
                </Group>

            </Fieldset>
        </Box>
    )
}

export default PromptTemplateEdit