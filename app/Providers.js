'use client';

import { TeamProvider } from './teamChoice';
import { PlayerProvider } from './playerChoice';
import { LoginProvider } from './loginProvider';

export default function Providers({ children }) {
  return (
    <TeamProvider>
      <LoginProvider>
        <PlayerProvider>
          {children}
        </PlayerProvider>
      </LoginProvider>
    </TeamProvider>
  );
}

