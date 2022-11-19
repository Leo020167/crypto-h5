import { defineConfig } from 'orval';

export default defineConfig({
  petstore: {
    output: {
      mode: 'split',
      target: 'src/api/endpoints/transformer.ts',
      schemas: 'src/api/model',
      client: 'react-query',
      prettier: true,
      override: {
        mutator: {
          path: './src/api/mutator/custom-instance.ts',
          name: 'customInstance',
        },
        operations: {
          depositList: {
            query: {
              useQuery: true,
            },
          },
          depositWithdrawGetInfo: {
            query: {
              useQuery: true,
            },
          },
          inviteHome: {
            query: {
              useQuery: true,
            },
          },
        },
      },
    },
    input: {
      target: './swagger.yml',
    },
  },
});
