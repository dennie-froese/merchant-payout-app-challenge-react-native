import { requireNativeModule } from 'expo-modules-core';

interface ScreenSecurityModule {
  getDeviceId(): string;
}

const ScreenSecurity = requireNativeModule<ScreenSecurityModule>('ScreenSecurity');

export function getDeviceId(): string {
  return ScreenSecurity.getDeviceId();
}
