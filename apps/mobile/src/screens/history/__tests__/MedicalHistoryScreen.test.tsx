import React from 'react';
import { render } from '@testing-library/react-native';
import MedicalHistoryScreen from '../MedicalHistoryScreen';
import { NavigationContainer } from '@react-navigation/native';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';

// Mocking safe area insets
jest.mock('react-native-safe-area-context', () => ({
  useSafeAreaInsets: () => ({ top: 0, bottom: 0, left: 0, right: 0 }),
}));

// Mocking MaterialCommunityIcons
jest.mock('@expo/vector-icons', () => ({
  MaterialCommunityIcons: 'MaterialCommunityIcons',
}));

// Hero/member data normally comes from the API via React Query
jest.mock('@medicare/shared', () => ({
  ...jest.requireActual('@medicare/shared'),
  useHero: () => ({
    data: {
      aiInsight: {
        titleSuffix: 'your wellness journey is trending positively.',
        description: 'Your recent labs look great.',
      },
    },
    isLoading: false,
  }),
  useMember: () => ({ data: { name: 'Arthur Morgan' } }),
}));

jest.mock('../../../services/medical.service', () => ({
  medicalService: {
    getMedicalHistory: jest.fn().mockResolvedValue([
      {
        id: 'h1',
        category: 'Diagnosis',
        type: 'diagnosis',
        title: 'Type 2 Diabetes',
        subtitle: 'Dr. Smith',
        date: '2025-10-12',
        monthLabel: 'October 2025',
        description: 'Routine check',
      },
      {
        id: 'h2',
        category: 'Lab results',
        type: 'lab',
        title: 'Comprehensive Blood Work',
        subtitle: 'Quest Labs',
        date: '2025-09-20',
        monthLabel: 'September 2025',
        description: 'Annual panel',
      },
      {
        id: 'h3',
        category: 'Test',
        type: 'visit',
        title: 'Annual Wellness Visit',
        subtitle: 'Dr. Smith',
        date: '2025-09-05',
        monthLabel: 'September 2025',
        description: 'Yearly visit',
      },
      {
        id: 'h4',
        category: 'Vaccination',
        type: 'immunization',
        title: 'Annual Flu Shot',
        subtitle: 'CVS Pharmacy',
        date: '2025-08-15',
        monthLabel: 'August 2025',
        description: 'Seasonal vaccine',
      },
    ]),
  },
}));

describe('MedicalHistoryScreen', () => {
  const mockProps: any = {
    navigation: {
      navigate: jest.fn(),
    },
    route: {},
  };

  it('renders correctly', async () => {
    const queryClient = new QueryClient({
      defaultOptions: { queries: { retry: false } },
    });

    const { getByText, getByLabelText, findByText } = render(
      <QueryClientProvider client={queryClient}>
        <NavigationContainer>
          <MedicalHistoryScreen {...mockProps} />
        </NavigationContainer>
      </QueryClientProvider>
    );

    // Check if title is present
    expect(getByText('Arthur, your wellness journey is trending positively.')).toBeTruthy();

    // Check if filter chips are present
    expect(getByText('All')).toBeTruthy();
    expect(getByText('Vaccination')).toBeTruthy();
    expect(getByText('Diagnosis')).toBeTruthy();

    // Check if timeline items are present (loaded async from the service)
    expect(await findByText('Type 2 Diabetes')).toBeTruthy();
    expect(await findByText('Comprehensive Blood Work')).toBeTruthy();
    expect(await findByText('Annual Wellness Visit')).toBeTruthy();
    expect(await findByText('Annual Flu Shot')).toBeTruthy();

    // Check screen accessibility label
    expect(getByLabelText('medical-history-screen')).toBeTruthy();
  });
});
