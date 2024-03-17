import { Box, Fieldset, TextInput, Text, Group, ActionIcon, TagsInput, Pill, Textarea, Button } from "@mantine/core"
import { useEffect, useState } from "react";
import { IconEdit, IconDeviceFloppy } from "@tabler/icons-react";
import { updatePrompt, fetchLatestPromptTemplate, updatePromptTemplate } from "../actions";

interface PromptTemplateEditProps {
    prompt: Prompt | null;
}

function PromptTemplateEdit({ prompt }: PromptTemplateEditProps) {
    if (!prompt) {
        return null;
    }

    const [name, setName] = useState(prompt.name);
    const [description, setDescription] = useState(prompt.description);
    const [variables, setVariables] = useState(prompt.variables);
    const [template, setTemplate] = useState("");
    const [editName, setEditName] = useState(false);
    const [editDescription, setEditDescription] = useState(false);
    const [editVariables, setEditVariables] = useState(false);

    useEffect(() => {
        const fetchTemplate = async () => {
            await fetchLatestPromptTemplate(prompt.id)
                .then(data => setTemplate(data.template))
                .catch(error => console.error(error));
        }
        fetchTemplate();
    }, [])

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

    const handleEditVariables = () => {
        prompt.variables = variables;
        updatePrompt(prompt);
        setEditVariables(false);
    }

    const handleUpdatePromptTemplate = () => {
        updatePromptTemplate(prompt.id, template);
    }

    const variablePills = prompt.variables.map(variable => <Pill key={variable} size="lg">{variable}</Pill>);

    const saveNameButton = <ActionIcon onClick={handleEditName} size="sm"><IconDeviceFloppy></IconDeviceFloppy></ActionIcon>;
    const saveDescriptionButton = <ActionIcon onClick={handleEditDescription} size="sm"><IconDeviceFloppy></IconDeviceFloppy></ActionIcon>;
    const saveVariablesButton = <ActionIcon onClick={handleEditVariables} size="sm"><IconDeviceFloppy></IconDeviceFloppy></ActionIcon>;

    return (
        <Box>
            <Fieldset legend="Prompt Name">
                <Group justify="start">
                    {editName ? <TextInput rightSection={saveNameButton} label="Prompt Name" defaultValue={prompt.name} onChange={e => setName(e.currentTarget.value)} /> : <><ActionIcon onClick={() => setEditName(true)} size="sm"><IconEdit></IconEdit></ActionIcon><Text>{prompt.name}</Text></>}
                </Group>
            </Fieldset>
            <Fieldset legend="Prompt Description" mt="sm">
                <Group justify="start">
                    {editDescription ? <TextInput rightSection={saveDescriptionButton} defaultValue={prompt.description} onChange={e => setDescription(e.currentTarget.value)} /> : <><ActionIcon onClick={() => setEditDescription(true)} size="sm"><IconEdit></IconEdit></ActionIcon><Text>{prompt.description}</Text></>}
                </Group>
            </Fieldset>
            <Fieldset legend="Prompt Variables" mt="sm">
                <Group justify="start">
                    {editVariables ? <TagsInput rightSection={saveVariablesButton} defaultValue={prompt.variables} onChange={variables => setVariables(variables)} /> : <><ActionIcon onClick={() => setEditVariables(true)} size="sm"><IconEdit></IconEdit></ActionIcon><Pill.Group>{variablePills}</Pill.Group></>}
                </Group>
            </Fieldset>
            <Textarea value={template} onChange={event => setTemplate(event.currentTarget.value)} label="Prompt Template" autosize minRows={3} mt="md" />
            <Button variant="primary" mt="md" onClick={handleUpdatePromptTemplate}>Save Prompt Template</Button>
        </Box>
    )
}

export default PromptTemplateEdit