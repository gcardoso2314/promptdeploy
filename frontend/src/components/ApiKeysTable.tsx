import { FunctionComponent, useEffect, useState } from "react";
import { Text, Table, Notification, rem, ActionIcon } from "@mantine/core";
import { deleteApiKey, fetchApiKeys } from "../actions";
import { camelizeKeys } from "humps";
import { IconX } from "@tabler/icons-react";

export const ApiKeysTable: FunctionComponent = () => {
    const [apiKeys, setApiKeys] = useState<ApiKey[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState("");

    useEffect(() => {
        const fetchAndSetPrompts = async () => {
            const data = await fetchApiKeys();
            setApiKeys(camelizeKeys(data));
            setIsLoading(false);
        };
        try {
            fetchAndSetPrompts();
        } catch (error) {
            setError("Failed to fetch prompts.");
            setIsLoading(false);
        }
    }, []);

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
            {isLoading && <Text>Loading prompts...</Text>}
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
        </>
    );
};