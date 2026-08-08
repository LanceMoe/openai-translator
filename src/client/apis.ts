export default {
  baseUrl: 'https://api.openai.com',
  endpoints: {
    v1: {
      chat: {
        completions: {
          url: '/v1/chat/completions',
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
        },
      },
    },
  },
};
