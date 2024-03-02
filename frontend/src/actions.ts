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
      body: JSON.stringify({ name, description }),
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

const fetchPromptById = async (promptId: string): Promise<Prompt> => {
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
  promptId: string
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

export {
  fetchUserPrompts,
  addNewPrompt,
  fetchPromptById,
  fetchLatestPromptTemplate,
};
