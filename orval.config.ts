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
          allConfig: {
            query: {
              useQuery: true,
            },
          },
          accountRecordList: {
            query: {
              useQuery: true,
            },
          },
          homeAccount: {
            query: {
              useQuery: true,
            },
          },
          otcGetMyAdInfo: {
            query: {
              useQuery: true,
            },
          },
          otcGetAdPrice: {
            query: {
              useQuery: true,
            },
          },
          otcFindMyAdList: {
            query: {
              useQuery: true,
            },
          },
          otcGetCertificationInfo: {
            query: {
              useQuery: true,
            },
          },
          otcGetInitAppealList: {
            query: {
              useQuery: true,
            },
          },
          otcToPayOrder: {
            query: {
              useQuery: true,
            },
          },
          otcGetOrderDetail: {
            query: {
              useQuery: true,
            },
          },
          otcFindOrderList: {
            query: {
              useQuery: true,
            },
          },
          otcFindMyPaymentList: {
            query: {
              useQuery: true,
            },
          },
          messageFind: {
            query: {
              useQuery: true,
            },
          },
          otcFindAdList: {
            query: {
              useQuery: true,
            },
          },
          otcConfig: {
            query: {
              useQuery: true,
            },
          },
          identityGet: {
            query: {
              useQuery: true,
            },
          },
          proOrderQuerySum: {
            query: {
              useQuery: true,
            },
          },
          proOrderQueryList: {
            query: {
              useQuery: true,
            },
          },
          accountQueryTransferList: {
            query: {
              useQuery: true,
            },
          },
          accountOutHoldAmount: {
            query: {
              useQuery: true,
            },
          },
          accountListAccountType: {
            query: {
              useQuery: true,
            },
          },
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
