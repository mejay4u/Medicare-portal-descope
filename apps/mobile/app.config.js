const IS_DEV = process.env.APP_VARIANT === 'development';

module.exports = {
  expo: {
    name: IS_DEV ? 'Member Portal (Dev)' : 'Member Portal',
    slug: 'member-portal',
    version: '1.0.0',
    scheme: 'medicare-portal',
    orientation: 'portrait',
    icon: './assets/icon.png',
    userInterfaceStyle: 'light',
    splash: {
      backgroundColor: '#f8f9fa',
    },
    ios: {
      supportsTablet: true,
      bundleIdentifier: 'com.anonymous.member-portal',
      infoPlist: {
        NSFaceIDUsageDescription: 'Allow Member Portal to use FaceID for secure login.',
      },
    },
    android: {
      package: 'com.anonymous.memberportal',
      adaptiveIcon: {
        foregroundImage: './assets/adaptive-icon.png',
        backgroundColor: '#f8f9fa',
      },
      config: {
        googleMaps: {
          apiKey: process.env.GOOGLE_MAPS_API_KEY_ANDROID,
        },
      },
    },
    web: {
      favicon: './assets/favicon.png',
    },
    plugins: [
      'expo-secure-store',
      'expo-local-authentication',
      'expo-web-browser',
    ],
  },
};
