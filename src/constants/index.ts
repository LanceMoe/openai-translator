/* eslint-disable camelcase */
export const OPENAI_MODELS = ['gpt-3.5-turbo-0301', 'gpt-3.5-turbo', 'text-davinci-003', 'text-davinci-002'] as const;

export const GPT_MODELS = ['gpt-3.5-turbo-0301', 'gpt-3.5-turbo'] as const;

export const OPENAI_MODELS_TITLES = {
  'gpt-3.5-turbo-0301': 'gpt-3.5-turbo-0301',
  'gpt-3.5-turbo': 'gpt-3.5-turbo (recommended)',
  'text-davinci-003': 'text-davinci-003',
  'text-davinci-002': 'text-davinci-002',
} as const;

export const OPENAI_MODELS_DESCRIPTION = {
  'gpt-3.5-turbo-0301': 'GPT-3.5 Turbo (30.1B)',
  'gpt-3.5-turbo': 'GPT-3.5 Turbo (30.1B)',
  'text-davinci-003': 'Text Davinci (3.3B)',
  'text-davinci-002': 'Text Davinci (3.3B)',
} as const;
