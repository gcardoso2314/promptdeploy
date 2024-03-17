type Prompt = {
  id: number;
  name: string;
  description: string;
  variables: string[];
  createdAt: string;
  updatedAt: string;
  isDeployed: boolean;
};

type PromptTemplate = {
  id: number;
  promptId: number;
  template: string;
  createdAt: string;
};

type ApiKey = {
  id: number;
  name: string;
  keySuffix: string;
}