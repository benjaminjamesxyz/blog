import { Component, type ReactNode, type ErrorInfo } from 'react';

interface Props {
  children: ReactNode;
}

interface State {
  hasError: boolean;
  error: Error | null;
}

export default class ErrorBoundary extends Component<Props, State> {
  state: State = { hasError: false, error: null };

  static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, info: ErrorInfo) {
    console.error('MDX render error:', error, info);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="not-prose rounded-lg border border-error/30 bg-error-bg p-6 my-6">
          <h3 className="text-error font-semibold text-sm mb-2">Content render error</h3>
          <pre className="text-xs text-muted overflow-x-auto">{this.state.error?.message}</pre>
        </div>
      );
    }
    return this.props.children;
  }
}
