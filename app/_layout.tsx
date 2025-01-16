import { Stack } from 'expo-router';
import { View, Text, Image, StyleSheet } from 'react-native';

export default function RootLayout() {
  return (
    <Stack
      screenOptions={{
        headerStyle: {
          backgroundColor: '#094779',
          // Opsional: jika ingin lebih tinggi
          // height: 60,
        },
        headerBackVisible: false,
        // Buat title di tengah
        headerTitleAlign: 'center',
        // Kosongkan title default
        title: '',
        // Tambahkan custom header di tengah
        headerTitle: () => (
          <View style={styles.headerContainer}>
            <Image
              source={require('../assets/logo-ep.png')} // Sesuaikan path logo
              style={styles.headerLogo}
              // Agar logo tidak terpotong
              resizeMode="contain"
            />
            <Text style={styles.headerTitle}>Edupy</Text>
          </View>
        ),
      }}
    />
  );
}

const styles = StyleSheet.create({
  headerContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    // Jika ingin sedikit ruang di atas-bawah
    paddingVertical: 6,
  },
  headerLogo: {
    width: 30,
    height: 30,
    marginRight: 8,
  },
  headerTitle: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
  },
});
