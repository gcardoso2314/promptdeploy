import React from "react";
import { useAuth } from "../AuthContext";
import { useLocation, useNavigate } from "react-router-dom";
import { upperFirst, useToggle } from "@mantine/hooks";
import { useForm } from "@mantine/form";
import {
  TextInput,
  PasswordInput,
  Text,
  Paper,
  Group,
  PaperProps,
  Button,
  Anchor,
  Stack,
  Center,
  Space,
} from "@mantine/core";

export const LoginPage = (props: PaperProps) => {
  const { login, register, currentUser, loading } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();
  const [type, toggle] = useToggle(["login", "register"]);
  const form = useForm({
    initialValues: {
      email: "",
      name: "",
      password: "",
      firstName: "",
      lastName: "",
    },

    validate: {
      email: val => (/^\S+@\S+$/.test(val) ? null : "Invalid email"),
      password: val =>
        val.length <= 6
          ? "Password should include at least 6 characters"
          : null,
    },
  });

  if (loading) {
    return null;
  }

  if (currentUser) {
    navigate("/");
  }

  const onFormSubmit = async (
    values: {
      email: string;
      password: string;
      firstName: string;
      lastName: string;
    },
    event?: React.FormEvent
  ) => {
    event?.preventDefault();
    const fromPage = location.state?.from ? location.state.from : "/";

    try {
      if (type === "register") {
        await register(
          values.email,
          values.password,
          values.firstName,
          values.lastName,
          fromPage
        );
      } else {
        await login(values.email, values.password, fromPage);
      }
    } catch (error) {
      alert((error as Error).message);
    }
  };

  return (
    <Center>
      <Paper radius="md" p="xl" withBorder {...props}>
        <Text size="lg" fw={500}>
          Welcome to PromptDeploy!
        </Text>
        <Space h="sm" />

        <form
          onSubmit={form.onSubmit((values, event) =>
            onFormSubmit(values, event)
          )}
        >
          <Stack>
            {type === "register" && (
              <>
                <TextInput
                  required
                  label="First Name"
                  placeholder="First Name"
                  value={form.values.firstName}
                  onChange={event =>
                    form.setFieldValue("firstName", event.currentTarget.value)
                  }
                  radius="md"
                />
                <TextInput
                  required
                  label="Last Name"
                  placeholder="Last Name"
                  value={form.values.lastName}
                  onChange={event =>
                    form.setFieldValue("lastName", event.currentTarget.value)
                  }
                  radius="md"
                />
              </>
            )}

            <TextInput
              required
              label="Email"
              placeholder="Enter your email"
              value={form.values.email}
              onChange={event =>
                form.setFieldValue("email", event.currentTarget.value)
              }
              error={form.errors.email && "Invalid email"}
              radius="md"
            />

            <PasswordInput
              required
              label="Password"
              placeholder="Enter your password"
              value={form.values.password}
              onChange={event =>
                form.setFieldValue("password", event.currentTarget.value)
              }
              error={
                form.errors.password &&
                "Password should include at least 6 characters"
              }
              radius="md"
            />
          </Stack>

          <Group justify="space-between" mt="xl">
            <Anchor
              component="button"
              type="button"
              c="dimmed"
              onClick={() => toggle()}
              size="xs"
            >
              {type === "register"
                ? "Already have an account? Login"
                : "Don't have an account? Register"}
            </Anchor>
            <Button type="submit" radius="xl">
              {upperFirst(type)}
            </Button>
          </Group>
        </form>
      </Paper>
    </Center>
  );
};

export default LoginPage;
