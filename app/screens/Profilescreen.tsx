import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, Image, TouchableOpacity, ActivityIndicator } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { firebase_auth } from '../../FirebaseConfig';
import { getFirestore, doc, getDoc } from 'firebase/firestore';
import Navbar from '../../components/navbar';
import { router } from 'expo-router';

interface UserData {
    name: string;
    email: string;
    bestvar: number;
    bestcond: number;
    bestloop: number;
    attempt: number;
    lessonsCompleted: number;
}

const ProfilePage = () => {
    const [userData, setUserData] = useState<UserData | null>(null);
    const [loading, setLoading] = useState(true);

    const auth = firebase_auth;
    const db = getFirestore();

    useEffect(() => {
        const fetchUserData = async () => {
            try {
                const user = auth.currentUser;

                if (user) {
                    const userDocRef = doc(db, 'users', user.uid);
                    const userDoc = await getDoc(userDocRef);

                    if (userDoc.exists()) {
                        const data = userDoc.data();
                        setUserData({
                            name: data.name,
                            email: data.email,
                            bestvar: data.bestvar || 0,
                            bestcond: data.bestcond || 0,
                            bestloop: data.bestloop || 0,
                            attempt: data.attempt || 0,
                            lessonsCompleted:
                                (data.bestvar === 100 ? 1 : 0) +
                                (data.bestcond === 100 ? 1 : 0) +
                                (data.bestloop === 100 ? 1 : 0),
                        });
                    }
                }
            } catch (error) {
                console.error('Error fetching user data:', error);
            } finally {
                setLoading(false);
            }
        };

        fetchUserData();
    }, []);

    if (loading) {
        return (
            <View style={styles.loadingContainer}>
                <ActivityIndicator size="large" color="#094779" />
            </View>
        );
    }

    if (!userData) {
        return (
            <View style={styles.container}>
                <Text style={styles.errorText}>Error loading user data. Please try again.</Text>
            </View>
        );
    }

    return (
        <View style={styles.container}>
            <View style={styles.profileContainer}>
                <Image
                    source={{ uri: 'https://via.placeholder.com/150' }}
                    style={styles.profileImage}
                />
                <Text style={styles.name}>{userData.name}</Text>
                <Text style={styles.email}>{userData.email}</Text>
            </View>

            <View style={styles.statsContainer}>
                <View style={styles.statBox}>
                    <Text style={styles.statValue}>{userData.lessonsCompleted}</Text>
                    <Text style={styles.statLabel}>Lessons Completed</Text>
                </View>
                <View style={styles.statBox}>
                    <Text style={styles.statValue}>{userData.attempt}</Text>
                    <Text style={styles.statLabel}>Total Quizzes</Text>
                </View>
            </View>

            <View style={styles.bestScoresContainer}>
                <Text style={styles.sectionTitle}>Best Scores</Text>
                <View style={styles.scoreBox}>
                    <Text style={styles.quizTitle}>Variables:</Text>
                    <Text style={styles.quizScore}>{userData.bestvar}%</Text>
                </View>
                <View style={styles.scoreBox}>
                    <Text style={styles.quizTitle}>Conditionals:</Text>
                    <Text style={styles.quizScore}>{userData.bestcond}%</Text>
                </View>
                <View style={styles.scoreBox}>
                    <Text style={styles.quizTitle}>Loops:</Text>
                    <Text style={styles.quizScore}>{userData.bestloop}%</Text>
                </View>
            </View>

            <TouchableOpacity
                style={styles.logoutButton}
                onPress={() => {
                    auth.signOut();
                    router.push('./Loginscreen');
                }}
            >
                <MaterialCommunityIcons name="logout" size={20} color="#FFFFFF" />
                <Text style={styles.logoutText}>Logout</Text>
            </TouchableOpacity>

            <Navbar />
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#E8F1F9',
        padding: 20,
    },
    loadingContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    profileContainer: {
        alignItems: 'center',
        marginBottom: 30,
    },
    profileImage: {
        width: 100,
        height: 100,
        borderRadius: 50,
        marginBottom: 10,
    },
    name: {
        fontSize: 24,
        fontWeight: 'bold',
        color: '#094779',
        textAlign: 'center',
    },
    email: {
        fontSize: 14,
        color: '#555555',
        textAlign: 'center',
    },
    statsContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginVertical: 20,
    },
    statBox: {
        alignItems: 'center',
        backgroundColor: '#FFFFFF',
        padding: 15,
        borderRadius: 10,
        elevation: 3,
        flex: 1,
        marginHorizontal: 5,
    },
    statValue: {
        fontSize: 20,
        fontWeight: 'bold',
        color: '#094779',
    },
    statLabel: {
        fontSize: 14,
        color: '#555555',
    },
    bestScoresContainer: {
        backgroundColor: '#FFFFFF',
        padding: 15,
        borderRadius: 10,
        elevation: 3,
        marginBottom: 20,
    },
    sectionTitle: {
        fontSize: 18,
        fontWeight: 'bold',
        color: '#094779',
        marginBottom: 10,
    },
    scoreBox: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginBottom: 10,
    },
    quizTitle: {
        fontSize: 16,
        color: '#094779',
    },
    quizScore: {
        fontSize: 16,
        fontWeight: 'bold',
        color: '#555555',
    },
    logoutButton: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: '#094779',
        padding: 15,
        borderRadius: 10,
        marginTop: 20,
    },
    logoutText: {
        fontSize: 16,
        color: '#FFFFFF',
        marginLeft: 10,
    },
    errorText: {
        fontSize: 16,
        color: '#FF4D4D',
        textAlign: 'center',
    },
});

export default ProfilePage;
