"use client";
import React, { createContext, useContext, useEffect, useState } from 'react';
import { getUserConfig, UserConfig } from '@/lib/utils/env';
import { trackUserTelemetry } from '@/lib/utils/telemetry';

type ContextProps = {
  config?: UserConfig | null;
};

const GlobalConfigContext = createContext<ContextProps>({});

export const GlobalConfigProvider = ({ children }: { children: React.ReactNode }) => {
  const [config, setConfig] = useState<UserConfig | null>(null);

  useEffect(() => {
    getUserConfig()
      .then((config) => {
        setConfig(config);
        // telemetry setup
        const cleanup = trackUserTelemetry(null, config);
        return cleanup;
      })
      .catch((error) => {
        console.error('Failed to get user config', error);
      });
  }, []);

  const value = {
    config,
  };

  return (
    <GlobalConfigContext.Provider value={value}>
      {children}
    </GlobalConfigContext.Provider>
  );
};

export default function useGlobalConfig() {
  return useContext(GlobalConfigContext);
}
