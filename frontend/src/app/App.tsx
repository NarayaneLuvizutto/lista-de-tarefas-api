import { useEffect, useMemo, useState } from 'react';
import { LoginPage } from '../pages/LoginPage';
import { RegisterPage } from '../pages/RegisterPage';
import { TasksPage } from '../pages/TasksPage';
import { getSession, saveSession, clearSession } from '../features/auth/authStorage';
import type { LoginResponse } from '../features/auth/authTypes';

export type View = 'login' | 'register' | 'tasks';

export function App() {
  const [view, setView] = useState<View>('login');
  const [session, setSession] = useState<LoginResponse | null>(() => getSession());

  useEffect(() => {
    setView(session ? 'tasks' : 'login');
  }, [session]);

  const auth = useMemo(
    () => ({
      session,
      signIn(nextSession: LoginResponse) {
        saveSession(nextSession);
        setSession(nextSession);
      },
      signOut() {
        clearSession();
        setSession(null);
      }
    }),
    [session]
  );

  if (view === 'register') {
    return <RegisterPage onBack={() => setView('login')} onRegistered={() => setView('login')} />;
  }

  if (!auth.session) {
    return <LoginPage onSignIn={auth.signIn} onCreateAccount={() => setView('register')} />;
  }

  return <TasksPage session={auth.session} onSignOut={auth.signOut} />;
}
