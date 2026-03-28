import { requireNativeModule, EventEmitter, Subscription } from 'expo-modules-core';

interface ScreenSecurityModule {
  getDeviceId(): string;
  isBiometricAuthenticated(): Promise<boolean>;
}

const ScreenSecurity = requireNativeModule<ScreenSecurityModule>('ScreenSecurity');
const emitter = new EventEmitter(ScreenSecurity);

export function getDeviceId(): string {
  return ScreenSecurity.getDeviceId();
}

export function isBiometricAuthenticated(): Promise<boolean> {
  return ScreenSecurity.isBiometricAuthenticated();
}

export function addScreenshotListener(listener: () => void): Subscription {
  return emitter.addListener('onScreenshotTaken', listener);
}
