export default {
  baseUrl: 'https://api.openai.com/',
  alterBaseUrl: 'https://openai-api-node.lance.moe/',
  endpoints: {
    v1: {
      completions: {
        url: 'v1/completions',
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
      },
      chat: {
        completions: {
          url: 'v1/chat/completions',
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
        },
      },
    },
  },
};
