import React, { useState } from 'react';
import { View, Text, TextInput, StyleSheet, ActivityIndicator, Alert, TouchableOpacity, Image } from 'react-native';
import { firebase_auth } from '../../FirebaseConfig';
import { signInWithEmailAndPassword } from 'firebase/auth';
import { useRouter } from 'expo-router';

const LoginScreen = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [loading, setLoading] = useState(false);
    const auth = firebase_auth;

    const router = useRouter();

    const handleLogin = async () => {
        if (!email || !password) {
            Alert.alert('Error', 'Email and password are required.');
            return;
        }

        setLoading(true); // Enable loading indicator
        try {
            await signInWithEmailAndPassword(auth, email, password);
            Alert.alert('Success', 'Login successful!');
            router.push('../screens/Homescreen');
        } catch (error) {
            console.error(error);
            Alert.alert('Login Failed', 'Invalid email or password.');
        } finally {
            setLoading(false); // Disable loading indicator
        }
    };

    return (
        <View style={styles.container}>
            <View style={styles.logoContainer}>
                <Image source={require('../../assets/logo-ep.png')} style={styles.logo} />
            </View>
            <View style={styles.formContainer}>
                <Text style={styles.title}>Login</Text>
                <TextInput
                    placeholder="Email"
                    value={email}
                    onChangeText={setEmail}
                    style={styles.input}
                    keyboardType="email-address"
                    autoCapitalize="none"
                />
                <TextInput
                    placeholder="Password"
                    value={password}
                    secureTextEntry
                    onChangeText={setPassword}
                    style={styles.input}
                />
                {loading ? (
                    <ActivityIndicator size="large" color="#002855" />
                ) : (
                    <TouchableOpacity style={styles.loginButton} onPress={handleLogin}>
                        <Text style={styles.loginButtonText}>Login</Text>
                    </TouchableOpacity>
                )}
                <TouchableOpacity onPress={() => router.push('../screens/Registerscreen')}>
                    <Text style={styles.link}>Don't have an account? <Text style={styles.linkHighlight}>Create account.</Text></Text>
                </TouchableOpacity>
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#002855',
        justifyContent: 'center',
        alignItems: 'center',
    },
    logoContainer: {
        marginBottom: 40,
        alignItems: 'center',
    },
    logo: {
        width: 80,
        height: 80,
        resizeMode: 'contain',
    },
    formContainer: {
        backgroundColor: '#F0F4FA',
        borderTopLeftRadius: 50,
        borderTopRightRadius: 0,
        borderBottomRightRadius: 50,
        borderBottomLeftRadius: 0,
        padding: 30,
        width: '85%',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.2,
        shadowRadius: 4,
        elevation: 5,
    },
    title: {
        fontSize: 24,
        fontWeight: 'bold',
        color: '#002855',
        textAlign: 'center',
        marginBottom: 20,
    },
    input: {
        backgroundColor: '#fff',
        borderRadius: 10,
        paddingVertical: 10,
        paddingHorizontal: 15,
        marginBottom: 15,
        borderColor: '#D9D9D9',
        borderWidth: 1,
        fontSize: 16,
    },
    loginButton: {
        backgroundColor: '#002855',
        borderRadius: 10,
        paddingVertical: 15,
        alignItems: 'center',
        marginTop: 10,
    },
    loginButtonText: {
        color: '#fff',
        fontSize: 16,
        fontWeight: 'bold',
    },
    link: {
        marginTop: 20,
        textAlign: 'center',
        color: '#002855',
        fontSize: 14,
    },
    linkHighlight: {
        color: '#FFD700',
        fontWeight: 'bold',
    },
});

export default LoginScreen;
