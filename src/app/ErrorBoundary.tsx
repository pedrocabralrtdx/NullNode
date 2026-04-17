import React, { Component, ErrorInfo, ReactNode } from 'react';

interface Props {
  children?: ReactNode;
}

interface State {
  hasError: boolean;
  error?: Error;
}

export class ErrorBoundary extends Component<Props, State> {
  public state: State = {
    hasError: false
  };

  public static getDerivedStateFromError(error: Error): State {
    // Update state so the next render will show the fallback UI.
    return { hasError: true, error };
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error('Uncaught error:', error, errorInfo);
  }

  public render() {
    if (this.state.hasError) {
      return (
        <div className="flex h-screen w-full items-center justify-center bg-black p-4 text-white">
          <div className="glass-panel max-w-lg p-6 text-center border-red-500/50 shadow-[0_0_15px_rgba(239,68,68,0.2)]">
            <h1 className="mb-4 text-2xl font-bold text-red-400">System Failure</h1>
            <p className="mb-6 text-white/70">
              A critical error occurred in the primary interface module.
            </p>
            <div className="mb-6 text-left p-3 bg-black/50 text-red-300 text-xs font-mono overflow-auto border border-red-500/20">
              {this.state.error?.toString()}
            </div>
            <button
              className="px-6 py-2 border border-red-500/50 text-red-400 hover:bg-red-500/10 transition-colors"
              onClick={() => window.location.reload()}
            >
              REBOOT SYSTEM
            </button>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}
