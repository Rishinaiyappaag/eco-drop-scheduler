
import { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'com.ecodropscheduler.app',
  appName: 'EcoDrop ',
  webDir: 'dist',
  // Configure Android specific settings
  android: {
    buildOptions: {
      keystorePath: undefined,
      keystoreAlias: undefined,
      keystorePassword: undefined,
      keystoreAliasPassword: undefined,
    }
  },
  // Configure iOS specific settings
  ios: {
    contentInset: 'automatic',
    preferredContentMode: 'mobile',
  }
};

export default config;
