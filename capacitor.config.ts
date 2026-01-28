import type { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'com.soudar.zoomchat',
  appName: 'ZoomChat',
  webDir: 'dist/public',
  server: {
    url: 'https://zoomchatlive.com',
    cleartext: false
  },
  android: {
    allowMixedContent: false,
    captureInput: true,
    webContentsDebuggingEnabled: true
  }
};

export default config;
