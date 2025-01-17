import React, { useState } from 'react';
import { View, Text, TextInput, StyleSheet, ActivityIndicator, Alert, TouchableOpacity, Image } from 'react-native';
import { firebase_auth } from '../../FirebaseConfig';
import { createUserWithEmailAndPassword } from 'firebase/auth';
import { setDoc, doc, getFirestore } from 'firebase/firestore';
import { useRouter } from 'expo-router';

const RegisterScreen = () => {
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [loading, setLoading] = useState(false);
    const auth = firebase_auth;
    const db = getFirestore();
    const router = useRouter();

    const handleRegister = async () => {
        if (!name || !email || !password) {
            Alert.alert('Error', 'Name, email, and password are required.');
            return;
        }

        setLoading(true); // Aktifkan indikator loading
        try {
            // Buat akun pengguna di Firebase Auth
            const response = await createUserWithEmailAndPassword(auth, email, password);
            const user = response.user;

            // Simpan data pengguna di Firestore
            if (user) {
                await setDoc(doc(db, 'users', user.uid), {
                    name: name,
                    email: user.email,
                    bestvar: 0,
                    bestcond: 0,
                    bestloop: 0,
                    attempt: 0,
                });
            }

            Alert.alert('Success', 'Account created successfully!');
            router.push('../screens/Loginscreen');
        } catch (error) {
            if (error instanceof Error) {
                console.error('Error during registration:', error.message);
                Alert.alert('Registration Failed', error.message);
            } else {
                console.error('Unknown error during registration:', error);
                Alert.alert('Registration Failed', 'An unknown error occurred.');
            }
        } finally {
            setLoading(false); // Matikan indikator loading
        }
    };

    const handleNavigateToLogin = () => {
        router.push('../screens/Loginscreen'); // Navigasi ke halaman login
    };

    return (
        <View style={styles.container}>
            <View style={styles.logoContainer}>
                <Image source={require('../../assets/logo-ep.png')} style={styles.logo} />
            </View>
            <View style={styles.formContainer}>
                <Text style={styles.title}>Register</Text>
                <TextInput
                    placeholder="Name"
                    value={name}
                    onChangeText={setName}
                    style={styles.input}
                    autoCapitalize="none"
                />
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
                    <TouchableOpacity style={styles.registerButton} onPress={handleRegister}>
                        <Text style={styles.registerButtonText}>Register</Text>
                    </TouchableOpacity>
                )}
                <TouchableOpacity style={styles.loginLink} onPress={handleNavigateToLogin}>
                    <Text style={styles.loginText}>Already have an account? <Text style={styles.linkHighlight}>Login here</Text></Text>
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
    registerButton: {
        backgroundColor: '#002855',
        borderRadius: 10,
        paddingVertical: 15,
        alignItems: 'center',
        marginTop: 10,
    },
    registerButtonText: {
        color: '#fff',
        fontSize: 16,
        fontWeight: 'bold',
    },
    loginLink: {
        marginTop: 20,
        alignItems: 'center',
    },
    loginText: {
        textAlign: 'center',
        color: '#002855',
        fontSize: 14,
    },
    linkHighlight: {
        color: '#FFD700',
        fontWeight: 'bold',
    },
});

export default RegisterScreen;
