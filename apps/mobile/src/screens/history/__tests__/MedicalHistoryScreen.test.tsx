import React from 'react';
import { render } from '@testing-library/react-native';
import MedicalHistoryScreen from '../MedicalHistoryScreen';
import { NavigationContainer } from '@react-navigation/native';

// Mocking safe area insets
jest.mock('react-native-safe-area-context', () => ({
  useSafeAreaInsets: () => ({ top: 0, bottom: 0, left: 0, right: 0 }),
}));

// Mocking MaterialCommunityIcons
jest.mock('@expo/vector-icons', () => ({
  MaterialCommunityIcons: 'MaterialCommunityIcons',
}));

describe('MedicalHistoryScreen', () => {
  const mockProps: any = {
    navigation: {
      navigate: jest.fn(),
    },
    route: {},
  };

  it('renders correctly', () => {
    const { getByText, getByLabelText } = render(
      <NavigationContainer>
        <MedicalHistoryScreen {...mockProps} />
      </NavigationContainer>
    );

    // Check if title is present
    expect(getByText('Arthur, your wellness journey is trending positively.')).toBeTruthy();
    
    // Check if filter chips are present
    expect(getByText('All')).toBeTruthy();
    expect(getByText('Tests & Results')).toBeTruthy();
    expect(getByText('Medications')).toBeTruthy();

    // Check if timeline items are present
    expect(getByText('Type 2 Diabetes')).toBeTruthy();
    expect(getByText('Comprehensive Blood Work')).toBeTruthy();
    expect(getByText('Annual Wellness Visit')).toBeTruthy();
    expect(getByText('Annual Flu Shot')).toBeTruthy();

    // Check screen accessibility label
    expect(getByLabelText('medical-history-screen')).toBeTruthy();
  });
});
