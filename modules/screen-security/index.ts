import { requireNativeModule } from 'expo-modules-core';

interface ScreenSecurityModule {
  getDeviceId(): string;
  isBiometricAuthenticated(): Promise<boolean>;
}

const ScreenSecurity = requireNativeModule<ScreenSecurityModule>('ScreenSecurity');

export function getDeviceId(): string {
  return ScreenSecurity.getDeviceId();
}

export function isBiometricAuthenticated(): Promise<boolean> {
  return ScreenSecurity.isBiometricAuthenticated();
}
