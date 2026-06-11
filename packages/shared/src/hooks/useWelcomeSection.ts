import { useMember } from './queries';

function getTimeBasedGreeting(): string {
  const hour = new Date().getHours();
  if (hour < 12) return 'Good morning';
  if (hour < 17) return 'Good afternoon';
  return 'Good evening';
}

export interface WelcomeSectionState {
  greeting: string;
  firstName: string;
  subtitle: string;
  isLoading: boolean;
}

export function useWelcomeSection(): WelcomeSectionState {
  const { data: member, isLoading } = useMember();

  const rawName = member?.name ?? '';
  const firstName = rawName.split(' ')[0] || 'there';
  const greeting = getTimeBasedGreeting();

  return {
    greeting,
    firstName,
    subtitle: 'Your wellness journey is looking bright today.',
    isLoading,
  };
}
