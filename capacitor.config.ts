
import { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'app.lovable.e041a5ee95c34627ad32b721f37b227c',
  appName: 'eco-drop-scheduler',
  webDir: 'dist',
  server: {
    url: 'https://e041a5ee-95c3-4627-ad32-b721f37b227c.lovableproject.com?forceHideBadge=true',
    cleartext: true
  },
  // Configure Android specific settings
  android: {
    buildOptions: {
      keystorePath: null,
      keystoreAlias: null,
      keystorePassword: null,
      keystoreAliasPassword: null,
    }
  },
  // Configure iOS specific settings
  ios: {
    contentInset: 'automatic',
    preferredContentMode: 'mobile',
  }
};

export default config;
