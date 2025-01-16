import React, { useState } from 'react';
import { View, Text, TextInput, Button, StyleSheet, ActivityIndicator, Alert, TouchableOpacity } from 'react-native';
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
                <ActivityIndicator size="large" color="#094779" />
            ) : (
                <Button title="Register" onPress={handleRegister} />
            )}

            {/* Tombol untuk navigasi ke Login */}
            <TouchableOpacity style={styles.loginLink} onPress={handleNavigateToLogin}>
                <Text style={styles.loginText}>Already have an account? Login here</Text>
            </TouchableOpacity>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        padding: 20,
    },
    title: {
        fontSize: 24,
        fontWeight: 'bold',
        textAlign: 'center',
        marginBottom: 20,
    },
    input: {
        borderWidth: 1,
        borderColor: '#ccc',
        padding: 10,
        marginBottom: 10,
        borderRadius: 5,
    },
    loginLink: {
        marginTop: 20,
        alignItems: 'center',
    },
    loginText: {
        textAlign: 'center',
        color: '#094779',
        fontSize: 16,
    },
});

export default RegisterScreen;
