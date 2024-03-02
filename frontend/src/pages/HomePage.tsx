import { useAuth } from "../AuthContext";

import { AppShell, Burger } from "@mantine/core";
import { useDisclosure } from "@mantine/hooks";
import { PromptGrid } from "../components/PromptGrid";
import { useNavigate } from "react-router-dom";
import { useEffect } from "react";

export const HomePage = () => {
  const { currentUser } = useAuth();
  const navigate = useNavigate();
  const [opened, { toggle }] = useDisclosure();

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
        <Burger opened={opened} onClick={toggle} hiddenFrom="sm" size="sm" />
        <div>PromptDeploy</div>
      </AppShell.Header>

      <AppShell.Navbar p="md">Navbar</AppShell.Navbar>

      <AppShell.Main>
        <PromptGrid />
      </AppShell.Main>
    </AppShell>
  );
};

export default HomePage;
