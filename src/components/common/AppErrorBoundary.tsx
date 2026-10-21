import React from 'react';

interface State {
  error: Error | null;
}

/**
 * A failing panel should degrade to a retry prompt, never a blank white site.
 */
export class AppErrorBoundary extends React.Component<{ children: React.ReactNode }, State> {
  state: State = { error: null };

  static getDerivedStateFromError(error: Error): State {
    return { error };
  }

  componentDidCatch(error: Error) {
    console.error('FIREWATCH UB render error:', error);
  }

  render() {
    if (!this.state.error) return this.props.children;

    return (
      <div className="min-h-screen flex items-center justify-center bg-[#F7F8FA] p-6">
        <div className="max-w-md w-full bg-white p-8 rounded-3xl border border-black/[0.06] shadow-sm text-center space-y-4">
          <span className="text-3xl">🔥</span>
          <h1 className="font-editorial text-2xl font-bold text-[#0B124D]">Хуудас түр зогслоо</h1>
          <p className="text-[11px] font-mono uppercase tracking-widest text-[#FF633C]">
            Page temporarily paused
          </p>
          <p className="text-sm text-[#72778A] leading-relaxed">
            Энэ хэсгийг зурахад алдаа гарлаа. Та доорх товчоор дахин оролдож эсвэл үндсэн хэсэг рүү
            буцана уу.
          </p>
          <p className="text-xs text-[#72778A]/80 leading-relaxed">
            Something went wrong while drawing this section. Use the buttons below to retry or go
            back home — the rest of the site still works.
          </p>
          <p className="text-[11px] font-mono text-[#E93B2F]/80 break-all">
            {this.state.error.message}
          </p>
          <div className="flex items-center justify-center gap-2 pt-2">
            <button
              onClick={() => this.setState({ error: null })}
              className="px-4 py-2 rounded-xl bg-[#0B124D] text-white text-xs font-bold hover:bg-[#11166B] transition-colors"
            >
              Дахин оролдох / Retry
            </button>
            <button
              onClick={() => {
                window.location.hash = '#landing';
                window.location.reload();
              }}
              className="px-4 py-2 rounded-xl border border-black/[0.08] text-xs font-bold text-[#0B124D] hover:bg-slate-100 transition-colors"
            >
              Нүүр хуудас руу / Home
            </button>
          </div>
        </div>
      </div>
    );
  }
}
