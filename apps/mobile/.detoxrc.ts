import type { DetoxConfig } from 'detox';

// Requires `expo prebuild` (bare workflow) before running Detox.
// Run: npx expo prebuild --clean  — then build for your target platform.
const config: DetoxConfig = {
  testRunner: {
    args: {
      $0: 'jest',
      config: 'jest.config.detox.ts',
    },
    jest: {
      setupTimeout: 120_000,
    },
  },

  apps: {
    'ios.debug': {
      type: 'ios.app',
      binaryPath:
        'ios/build/Build/Products/Debug-iphonesimulator/AuraWellness.app',
      build:
        'xcodebuild -workspace ios/AuraWellness.xcworkspace -scheme AuraWellness -configuration Debug -sdk iphonesimulator -derivedDataPath ios/build CODE_SIGNING_ALLOWED=NO',
    },
    'ios.release': {
      type: 'ios.app',
      binaryPath:
        'ios/build/Build/Products/Release-iphonesimulator/AuraWellness.app',
      build:
        'xcodebuild -workspace ios/AuraWellness.xcworkspace -scheme AuraWellness -configuration Release -sdk iphonesimulator -derivedDataPath ios/build CODE_SIGNING_ALLOWED=NO',
    },
    'android.debug': {
      type: 'android.apk',
      binaryPath:
        'android/app/build/outputs/apk/debug/app-debug.apk',
      build:
        'cd android && ./gradlew assembleDebug assembleAndroidTest -DtestBuildType=debug',
    },
    'android.release': {
      type: 'android.apk',
      binaryPath:
        'android/app/build/outputs/apk/release/app-release.apk',
      build:
        'cd android && ./gradlew assembleRelease assembleAndroidTest -DtestBuildType=release',
    },
  },

  devices: {
    simulator: {
      type: 'ios.simulator',
      device: { type: 'iPhone 17 Pro Max' },
    },
    emulator: {
      type: 'android.emulator',
      device: { avdName: 'Pixel_7_API_34' },
    },
    attachedAndroid: {
      type: 'android.attached',
      device: { adbName: '.*' },
    },
  },

  configurations: {
    'ios.sim.debug': {
      device: 'simulator',
      app: 'ios.debug',
    },
    'ios.sim.release': {
      device: 'simulator',
      app: 'ios.release',
    },
    'android.emu.debug': {
      device: 'emulator',
      app: 'android.debug',
    },
    'android.emu.release': {
      device: 'emulator',
      app: 'android.release',
    },
    'android.att.release': {
      device: 'attachedAndroid',
      app: 'android.release',
    },
  },
};

export default config;
