import React, { Component, ErrorInfo, ReactNode } from 'react';
import ErrorState from './ErrorState';

interface Props {
  children: ReactNode;
  screenName?: string;
}

interface State {
  hasError: boolean;
  error: Error | null;
}

export default class AppErrorBoundary extends Component<Props, State> {
  state: State = { hasError: false, error: null };

  static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, info: ErrorInfo) {
    // Forward to analytics when wired up — masked to avoid PHI in logs
    if (__DEV__) {
      console.error('[AppErrorBoundary]', this.props.screenName, error, info.componentStack);
    }
  }

  private handleRetry = () => {
    this.setState({ hasError: false, error: null });
  };

  render() {
    if (this.state.hasError) {
      return (
        <ErrorState
          message={this.state.error?.message ?? 'An unexpected error occurred.'}
          onRetry={this.handleRetry}
        />
      );
    }
    return this.props.children;
  }
}
