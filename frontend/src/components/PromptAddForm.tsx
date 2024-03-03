import { Stack, TextInput, TagsInput, Button } from "@mantine/core";
import { addNewPrompt } from "../actions";
import { useForm } from "@mantine/form";

interface PromptAddFormProps {
  handleSuccess: (prompt: Prompt) => void;
  handleFailure: (error: Error) => void;
}

interface FormValues {
  name: string;
  description: string;
  variables: string[];
}

function PromptAddForm({ handleSuccess, handleFailure }: PromptAddFormProps) {
  const form = useForm<FormValues>({
    initialValues: {
      name: '',
      description: '',
      variables: []
    },
  })

  const handleSubmit = async (values: { name: string, description: string, variables: string[] }, event?: React.FormEvent) => {
    event?.preventDefault();
    try {
      console.log(`Adding new prompt: ${values.name} ${values.description} ${values.variables}`);
      const newPrompt = await addNewPrompt(values.name, values.variables, values.description);
      handleSuccess(newPrompt);
    } catch (error) {
      handleFailure(Error(`Failed to create prompt ${name}: ${error}`));
    }
  };
  return (
    <form onSubmit={form.onSubmit((values, event) =>
      handleSubmit(values, event)
    )}>
      <Stack>
        <TextInput label="Name" placeholder="Name" onChange={event => form.setFieldValue("name", event.currentTarget.value)
        } />
        <TextInput label="Description" placeholder="Description" onChange={event => form.setFieldValue("description", event.currentTarget.value)
        } />
        <TagsInput label="Prompt Variables" placeholder="Press Enter to add a variable" onChange={values => form.setFieldValue("variables", values)
        } />

        <Button type="submit">Confirm</Button>
      </Stack>
    </form>
  );
}

export default PromptAddForm;
