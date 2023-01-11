import { config as dotEnvConfig } from 'https://deno.land/x/dotenv@v3.2.0/mod.ts'
dotEnvConfig({ export: true });

interface ENV {
  TOKEN: string | undefined;
  WAIT_RESPONSE: number | undefined;
}

interface Config {
  TOKEN: string;
  WAIT_RESPONSE: number;
}

// Loading Deno.env as ENV interface

const getConfig = (): ENV => {
  return {
    TOKEN: Deno.env.get('TOKEN'),
    WAIT_RESPONSE: parseFloat(Deno.env.get('WaitResponse'))??10
  };
};

const getSanitzedConfig = (config: ENV): Config => {
  for (const [key, value] of Object.entries(config)) {
    if (value === undefined) {
      throw `Missing key ${key} in config.env`;
    }
  }
  
  return config as Config;
};

const config:ENV = getConfig();
const sanitizedConfig:Config = getSanitzedConfig(config);

export default sanitizedConfig;