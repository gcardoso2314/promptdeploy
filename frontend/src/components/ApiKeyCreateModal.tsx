import { useState } from "react";
import { Modal, Button, Paper, Text, Space, Notification } from "@mantine/core";
import ApiKeyCreateForm from "./ApiKeyCreateForm";

interface ApiCreateModalProps {
    opened: boolean;
    onClose: () => void;
    onNewApiKey: () => void;
}

function ApiKeyCreateModal(props: ApiCreateModalProps) {
    const [apiKey, setApiKey] = useState<string>("");
    const [error, setError] = useState<string>("");
    return (
        <Modal
            opened={props.opened}
            onClose={() => {
                setApiKey("");
                props.onClose();
            }}
            size="lg"
            aria-labelledby="contained-modal-title-vcenter"
            centered
            title="Give your API Key a name"
        >
            <Paper radius="md" p="xl" withBorder {...props}>
                {error && <Notification color="red" title="Oh no!" onClose={() => setError("")}>{error}</Notification>}
                {apiKey && (
                    <>
                        <h4>Your API Key has been successfully created</h4>
                        <Space h="md" />
                        <Text>Here is your new API Key. Please keep a record of it as you won't be able to recover it.</Text>
                        <Text>{apiKey}</Text>
                        <Space h="md" />
                        <Button onClick={() => {
                            setApiKey("");
                            props.onClose();
                        }}>Close</Button>
                    </>
                )}
                {!apiKey && (
                    <ApiKeyCreateForm
                        handleSuccess={(key: string) => {
                            setApiKey(key);
                            props.onNewApiKey();
                        }}
                        handleFailure={e => {
                            setError(e.message);
                        }}
                    />
                )}
            </Paper>
        </Modal>
    );
}

export default ApiKeyCreateModal;
