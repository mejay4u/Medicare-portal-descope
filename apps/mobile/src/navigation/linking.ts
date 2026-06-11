import type { LinkingOptions } from '@react-navigation/native';
import type { RootStackParamList } from './types';

export const linking: LinkingOptions<RootStackParamList> = {
  prefixes: ['medicare-portal://', 'https://medicare-portal.app'],
  config: {
    screens: {
      App: {
        screens: {
          TabHome: {
            screens: {
              Dashboard: 'dashboard',
              FindCare: {
                screens: {
                  FindCareList: 'find-care',
                  ProviderDetail: 'provider/:providerId',
                },
              },
              Benefits: 'benefits',
              Prescriptions: 'prescriptions',
            },
          },
          Notifications: 'notifications',
          Settings: 'settings',
          CaribearChat: 'chat',
        },
      },
      Auth: {
        screens: {
          Login: 'login',
        },
      },
    },
  },
};
