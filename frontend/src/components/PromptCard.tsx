import { FunctionComponent } from "react";
import { Card, Text, Badge, Button, Group } from "@mantine/core";

interface PromptCardProps {
  id: number;
  name: string;
  description: string;
  createdAt: string;
  isDeployed: boolean;
  openEditDrawer: () => void;
}

export const PromptCard: FunctionComponent<PromptCardProps> = ({
  name,
  description,
  isDeployed,
  openEditDrawer,
}) => {
  return (
    <Card shadow="sm" padding="lg" radius="md" withBorder>
      <Group justify="space-between" mt="md" mb="xs">
        <Text size="lg" fw={500}>{name}</Text>
        {isDeployed && <Badge color="green">Live</Badge>}
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
        onClick={() => openEditDrawer()}
      >
        Edit
      </Button>
    </Card>
  );
};

export default PromptCard;
