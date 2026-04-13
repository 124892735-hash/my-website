import React, { Component, ErrorInfo, ReactNode } from 'react';

interface Props {
  children?: ReactNode;
}

interface State {
  hasError: boolean;
  error: Error | null;
}

export class ErrorBoundary extends Component<Props, State> {
  public state: State = {
    hasError: false,
    error: null
  };

  public static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error('Uncaught error:', error, errorInfo);
  }

  public render() {
    const { children } = (this as any).props;
    if (this.state.hasError) {
      let errorMessage = this.state.error?.message || '未知错误';
      let errorDetails = '';

      try {
        // Try to parse if it's our custom JSON error
        const parsed = JSON.parse(errorMessage);
        errorMessage = parsed.error || errorMessage;
        errorDetails = JSON.stringify(parsed, null, 2);
      } catch (e) {
        // Not a JSON string, leave as is
      }

      return (
        <div className="min-h-screen bg-black text-white flex flex-col items-center justify-center p-6">
          <div className="bg-zinc-900 border border-red-500/30 p-8 rounded-2xl max-w-2xl w-full">
            <h2 className="text-2xl font-bold text-red-400 mb-4">哎呀，出现了一些问题</h2>
            <p className="text-zinc-300 mb-4">
              {errorMessage.includes('unavailable') || errorMessage.includes('offline') 
                ? '无法连接到数据库。这通常是因为您的网络环境（如代理、VPN）或浏览器插件（如广告拦截器）阻止了连接。请尝试关闭代理或更换浏览器。'
                : '应用程序遇到了意外错误。'}
            </p>
            <div className="bg-black p-4 rounded-lg overflow-auto text-sm text-zinc-500 font-mono">
              {errorDetails || errorMessage}
            </div>
            <button
              className="mt-6 bg-white text-black px-6 py-2 rounded-lg font-medium hover:bg-zinc-200 transition-colors"
              onClick={() => window.location.reload()}
            >
              刷新页面重试
            </button>
          </div>
        </div>
      );
    }

    return children;
  }
}
