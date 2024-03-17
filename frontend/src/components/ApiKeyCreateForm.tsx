import { Stack, TextInput, Button } from "@mantine/core";
import { createApiKey } from "../actions";
import { useForm } from "@mantine/form";

interface ApiKeyCreateFormProps {
    handleSuccess: (key: string) => void;
    handleFailure: (error: Error) => void;
}

interface FormValues {
    name: string;
}

function ApiKeyCreateForm({ handleSuccess, handleFailure }: ApiKeyCreateFormProps) {
    const form = useForm<FormValues>({
        initialValues: {
            name: '',
        },
    })

    const handleSubmit = async (values: { name: string }, event?: React.FormEvent) => {
        event?.preventDefault();
        try {
            const response = await createApiKey(values.name);
            handleSuccess(response.key);
        } catch (error) {
            handleFailure(Error("Failed to create API key."));
        }
    };
    return (
        <form onSubmit={form.onSubmit((values, event) =>
            handleSubmit(values, event)
        )}>
            <Stack>
                <TextInput label="Name" placeholder="Name" onChange={event => form.setFieldValue("name", event.currentTarget.value)
                } />
                <Button type="submit">Confirm</Button>
            </Stack>
        </form>
    );
}

export default ApiKeyCreateForm;
