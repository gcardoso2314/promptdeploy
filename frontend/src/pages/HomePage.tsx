import { useAuth } from "../AuthContext";

import {
  AppShell,
  Burger,
  NavLink,
  Text,
  Button,
  Group,
  useMantineColorScheme,
  ActionIcon,
} from "@mantine/core";
import { useDisclosure } from "@mantine/hooks";
import { PromptGrid } from "../components/PromptGrid";
import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { IconHome2, IconMoonStars, IconSun, IconKey } from "@tabler/icons-react";
import { ApiKeysTable } from "../components/ApiKeysTable";

export const HomePage = () => {
  const { currentUser, logout } = useAuth();
  const navigate = useNavigate();
  const [opened, { toggle }] = useDisclosure();
  const { colorScheme, toggleColorScheme } = useMantineColorScheme();
  const dark = colorScheme === "dark";
  const [screen, setScreen] = useState("prompts");

  if (!currentUser) {
    useEffect(() => navigate("/login"), []);
    return null;
  }

  return (
    <AppShell
      header={{ height: 60 }}
      navbar={{
        width: 300,
        breakpoint: "sm",
        collapsed: { mobile: !opened },
      }}
      padding="md"
    >
      <AppShell.Header>
        <Group justify="space-between" p="md">
          <Burger opened={opened} onClick={toggle} hiddenFrom="sm" size="sm" />
          <Text fw={500} fz={20}>
            PromptDeploy
          </Text>
          <Group>
            <ActionIcon
              variant="outline"
              color={dark ? "yellow" : "blue"}
              onClick={() => toggleColorScheme()}
              title="Toggle color scheme"
              size="lg"
            >
              {dark ? <IconSun size={20} /> : <IconMoonStars size={20} />}
            </ActionIcon>
            <Button size="sm" onClick={logout}>
              <Text>Logout</Text>
            </Button>
          </Group>
        </Group>
      </AppShell.Header>

      <AppShell.Navbar p="md">
        <NavLink
          label="My Prompts"
          leftSection={<IconHome2 size="1rem" stroke={1.5} />}
          onClick={() => setScreen("prompts")}
        />
        <NavLink
          label="API Keys"
          leftSection={<IconKey size="1rem" stroke={1.5} />}
          onClick={() => setScreen("apiKeys")}
        />
      </AppShell.Navbar>

      <AppShell.Main>
        {
          screen === "prompts" && <PromptGrid />
        }
        {
          screen === "apiKeys" && <ApiKeysTable />
        }
      </AppShell.Main>
    </AppShell>
  );
};

export default HomePage;
