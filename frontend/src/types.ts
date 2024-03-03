type Prompt = {
  id: number;
  name: string;
  description: string;
  createdAt: string;
  updatedAt: string;
  isDeployed: boolean;
};

type PromptTemplate = {
  id: number;
  promptId: number;
  template: string;
  variables: string[];
  createdAt: string;
};
