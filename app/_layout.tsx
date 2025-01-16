import { Stack } from "expo-router";

export default function RootLayout() {
  return (
    <Stack
      screenOptions={{
        headerStyle: {
          backgroundColor: '#094779',
        },
        title: '',
        headerBackVisible: false,
      }}
    />
  );
}
