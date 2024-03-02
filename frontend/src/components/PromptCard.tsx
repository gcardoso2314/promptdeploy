import { FunctionComponent } from "react";
import { Card, Text, Badge, Button, Group } from "@mantine/core";

interface PromptCardProps {
  id: number;
  name: string;
  description: string;
  createdAt: string;
}

export const PromptCard: FunctionComponent<PromptCardProps> = ({
  id,
  name,
  description,
}) => {
  return (
    <Card shadow="sm" padding="lg" radius="md" withBorder>
      <Group justify="space-between" mt="md" mb="xs">
        <Text fw={500}>{name}</Text>
        <Badge color="green">Deployed</Badge>
      </Group>

      <Text size="sm" c="dimmed">
        {description}
      </Text>

      <Button
        component="a"
        color="blue"
        fullWidth
        mt="md"
        radius="md"
        href={`/prompt/${id}`}
      >
        Edit
      </Button>
    </Card>
  );
};

export default PromptCard;
