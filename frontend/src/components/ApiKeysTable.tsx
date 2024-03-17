import { FunctionComponent, useEffect, useState } from "react";
import { Text, Table, Notification, rem, ActionIcon, Button } from "@mantine/core";
import { deleteApiKey, fetchApiKeys } from "../actions";
import { camelizeKeys } from "humps";
import { IconX } from "@tabler/icons-react";
import ApiKeyCreateModal from "./ApiKeyCreateModal";

export const ApiKeysTable: FunctionComponent = () => {
    const [apiKeys, setApiKeys] = useState<ApiKey[]>([]);
    const [apiKeyCreated, setApiKeyCreated] = useState<boolean>(false);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState("");
    const [newApiKeyModalVisible, setNewApiKeyModalVisible] =
        useState<boolean>(false);

    useEffect(() => {
        const fetchAndSetPrompts = async () => {
            const data = await fetchApiKeys();
            setApiKeys(camelizeKeys(data));
            setIsLoading(false);
            setApiKeyCreated(false);
        };
        try {
            fetchAndSetPrompts();
        } catch (error) {
            setError("Failed to fetch prompts.");
            setIsLoading(false);
            setApiKeyCreated(false);
        }
    }, [apiKeyCreated]);

    const handleDeleteApiKey = async (apiKeyId: number) => {
        try {
            await deleteApiKey(apiKeyId);
            setApiKeys((prevApiKeys) => prevApiKeys.filter((key) => key.id !== apiKeyId));
        } catch (error) {
            console.error("Error deleting API key:", error);
            setError("Failed to delete API key.");
        }
    }

    const createDeleteIcon = (apiKeyId: number) => {
        return <ActionIcon><IconX style={{ width: rem(20), height: rem(20) }} onClick={() => handleDeleteApiKey(apiKeyId)} /></ActionIcon>;
    }

    const tableRows = apiKeys.map((key) => (
        <Table.Tr key={key.id}>
            <Table.Td>{key.name}</Table.Td>
            <Table.Td>{Array(12).fill("*").join("") + key.keySuffix}</Table.Td>
            <Table.Td>{createDeleteIcon(key.id)}</Table.Td>
        </Table.Tr>
    ));

    return (
        <>
            {error &&
                <Notification mt="sm" color="red" title="Oh no!" onClose={() => setError("")}>
                    {error}
                </Notification>}
            {isLoading && <Text>Loading API Keys...</Text>}
            <Button onClick={() => setNewApiKeyModalVisible(true)}>
                Create API Key
            </Button>
            <Table>
                <Table.Thead>
                    <Table.Tr>
                        <Table.Th>Name</Table.Th>
                        <Table.Th>Key</Table.Th>
                        <Table.Th></Table.Th>
                    </Table.Tr>
                </Table.Thead>
                <Table.Tbody>{tableRows}</Table.Tbody>
            </Table>
            {newApiKeyModalVisible && <ApiKeyCreateModal opened={newApiKeyModalVisible} onNewApiKey={() => setApiKeyCreated(true)} onClose={() => setNewApiKeyModalVisible(false)} />}
        </>
    );
};