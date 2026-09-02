export default {
  baseUrl: 'https://api.openai.com/v1',
  endpoints: {
    v1: {
      chat: {
        completions: {
          url: '/chat/completions',
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
        },
      },
    },
  },
};
