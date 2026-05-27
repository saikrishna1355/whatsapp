import { config } from '../../config';
import type { AIProvider } from './ai.types';

export function getAIProvider(): AIProvider {
  switch (config.ai.provider) {
    case 'openai':
      // Lazy import to avoid loading SDK when not needed
      return require('./providers/openai.provider').openaiProvider;
    case 'bedrock':
      return require('./providers/bedrock.provider').bedrockProvider;
    default:
      throw new Error(`AI provider not configured. Set AI_PROVIDER env var.`);
  }
}
