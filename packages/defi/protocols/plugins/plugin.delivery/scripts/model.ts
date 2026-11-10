import { ChatOpenAI } from '@langchain/openai';

import { config } from './const';

export const model = new ChatOpenAI({
  model: config.modelName,
  temperature: config.temperature,
  maxRetries: 4,
  configuration: { baseURL: process.env.OPENAI_PROXY_URL },
});
