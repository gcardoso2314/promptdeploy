const apiUrl = import.meta.env.VITE_API_URL as string;

const fetchUserPrompts = async (): Promise<Prompt[]> => {
  const promptsUrl = `${apiUrl}/api/v1/prompts/`;
  const token = sessionStorage.getItem("token");

  try {
    const response = await fetch(promptsUrl, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    });
    if (!response.ok) {
      throw new Error("Failed to fetch prompts.");
    }
    return response.json();
  } catch (error) {
    console.error("Error fetching prompts:", error);
    throw error;
  }
};

const addNewPrompt = async (
  name: string,
  variables: string[],
  description: string
): Promise<Prompt> => {
  const token = sessionStorage.getItem("token");
  const promptUrl = `${apiUrl}/api/v1/prompts/`;
  try {
    const response = await fetch(promptUrl, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ name, variables, description }),
    });
    if (!response.ok) {
      throw new Error("Failed to fetch prompts.");
    }
    return response.json();
  } catch (error) {
    console.error("Error creating prompt:", error);
    throw new Error("Failed to create prompt.");
  }
};

const fetchPromptById = async (promptId: number): Promise<Prompt> => {
  const token = sessionStorage.getItem("token");
  const promptUrl = `${apiUrl}/api/v1/prompts/${promptId}`;
  try {
    const response = await fetch(promptUrl, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    });
    if (!response.ok) {
      throw new Error("Failed to fetch prompts.");
    }
    return response.json();
  } catch (error) {
    console.error("Error fetching prompt:", error);
    throw new Error("Failed to fetch prompt.");
  }
};

const fetchLatestPromptTemplate = async (
  promptId: number
): Promise<PromptTemplate> => {
  const token = sessionStorage.getItem("token");
  const promptTemplateUrl = `${apiUrl}/api/v1/prompt_templates/latest/${promptId}`;
  try {
    const response = await fetch(promptTemplateUrl, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    });
    if (!response.ok) {
      throw new Error("Failed to fetch prompt template.");
    }
    return response.json();
  } catch (error) {
    console.error("Error fetching prompt template:", error);
    throw new Error("Failed to fetch prompt template.");
  }
};

const updatePrompt = async (
  prompt: Prompt
): Promise<Prompt> => {
  const token = sessionStorage.getItem("token");
  const promptUrl = `${apiUrl}/api/v1/prompts/${prompt.id}`;
  try {
    const response = await fetch(promptUrl, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({
        name: prompt.name,
        variables: prompt.variables,
        description: prompt.description
      }),
    });
    if (!response.ok) {
      throw new Error("Failed to update prompt.");
    }
    return response.json();
  } catch (error) {
    console.error("Error updating prompt:", error);
    throw new Error("Failed to update prompt.");
  }
}

const updatePromptTemplate = async (
  promptId: number,
  template: string
): Promise<PromptTemplate> => {
  const token = sessionStorage.getItem("token");
  const promptTemplateUrl = `${apiUrl}/api/v1/prompt_templates/${promptId}`;
  try {
    const response = await fetch(promptTemplateUrl, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ template }),
    });
    if (!response.ok) {
      throw new Error("Failed to update prompt template.");
    }
    return response.json();
  } catch (error) {
    console.error("Error updating prompt template:", error);
    throw new Error("Failed to update prompt template.");
  }
}

const fetchApiKeys = async (): Promise<ApiKey[]> => {
  const apiKeysUrl = `${apiUrl}/api/v1/api_keys/`;
  const token = sessionStorage.getItem("token");

  try {
    const response = await fetch(apiKeysUrl, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    });
    if (!response.ok) {
      throw new Error("Failed to fetch API keys.");
    }
    return response.json();
  } catch (error) {
    console.error("Error fetching API keys:", error);
    throw error;
  }
}

const createApiKey = async (name: string): Promise<CreateApiKeyResponse> => {
  const token = sessionStorage.getItem("token");
  const apiKeyUrl = `${apiUrl}/api/v1/api_keys/`;
  try {
    const response = await fetch(apiKeyUrl, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ name }),
    });
    if (!response.ok) {
      throw new Error("Failed to create API key.");
    }
    return response.json();
  } catch (error) {
    console.error("Error creating API key:", error);
    throw error;
  }

}

const deleteApiKey = async (apiKeyId: number): Promise<void> => {
  const token = sessionStorage.getItem("token");
  const apiKeyUrl = `${apiUrl}/api/v1/api_keys/${apiKeyId}`;
  try {
    const response = await fetch(apiKeyUrl, {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    });
    if (!response.ok) {
      throw new Error("Failed to delete API key.");
    }
  } catch (error) {
    console.error("Error deleting API key:", error);
    throw error;
  }
}

export {
  fetchUserPrompts,
  addNewPrompt,
  fetchPromptById,
  fetchLatestPromptTemplate,
  updatePrompt,
  updatePromptTemplate,
  fetchApiKeys,
  deleteApiKey,
  createApiKey,
};
