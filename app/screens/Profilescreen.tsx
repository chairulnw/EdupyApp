import React, { useEffect, useState } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  Image, 
  TouchableOpacity, 
  ActivityIndicator,
  useWindowDimensions,
} from 'react-native';
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

    // Contoh jika ingin menyesuaikan dimensi:
    const { width } = useWindowDimensions();
    const isSmallScreen = width < 360;

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
                <ActivityIndicator size="large" color="#1a237e" />
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
                    source={require('../../assets/maskot.png')}
                    style={styles.profileImage}
                    resizeMode="contain"
                />
                <Text style={styles.name}>{userData.name}</Text>
                <Text style={styles.email}>{userData.email}</Text>
            </View>

            <Text style={styles.sectionTitle}>My Reports</Text>
            <View style={styles.reportContainer}>
                {/* Row pertama (2 card) */}
                <View style={styles.row}>
                    <View style={[styles.card, styles.blueCard]}>
                        <MaterialCommunityIcons name="account-check" size={24} color="#1a237e" />
                        <Text style={styles.cardLabel}>Lessons Completed</Text>
                        <Text style={styles.cardValue}>{userData.lessonsCompleted}</Text>
                    </View>

                    <View style={[styles.card, styles.greenCard]}>
                        <MaterialCommunityIcons name="calendar-check" size={24} color="#1b5e20" />
                        <Text style={styles.cardLabel}>Total Attempts</Text>
                        <Text style={styles.totalAttemptsValue}>{userData.attempt}</Text>
                    </View>
                </View>

                {/* Best Score Card */}
                <View style={[styles.card, styles.yellowCard, styles.bestScoreCard]}>
                    <View style={styles.scoreHeader}>
                        <MaterialCommunityIcons name="trophy" size={24} color="#426CC2" />
                        <Text style={styles.scoreTitle}>Best Scores</Text>
                    </View>
                    <View style={styles.scoreRow}>
                        <Text style={styles.scoreLabel}>Variables</Text>
                        <View style={styles.scoreContainer}>
                            <Text style={styles.scoreValue}>{userData.bestvar}%</Text>
                        </View>
                    </View>
                    <View style={styles.scoreRow}>
                        <Text style={styles.scoreLabel}>Conditionals</Text>
                        <View style={styles.scoreContainer}>
                            <Text style={styles.scoreValue}>{userData.bestcond}%</Text>
                        </View>
                    </View>
                    <View style={styles.scoreRow}>
                        <Text style={styles.scoreLabel}>Loops</Text>
                        <View style={styles.scoreContainer}>
                            <Text style={styles.scoreValue}>{userData.bestloop}%</Text>
                        </View>
                    </View>
                </View>
            </View>

            <TouchableOpacity
                style={styles.logoutButton}
                onPress={() => {
                    auth.signOut();
                    router.push('./Loginscreen');
                }}
            >
                <Text style={styles.logoutText}>Log Out</Text>
            </TouchableOpacity>

            <Navbar />
        </View>
    );
};

const styles = StyleSheet.create({
    // Kontainer utama
    container: {
        flex: 1,
        backgroundColor: '#E8F1FA',
        padding: 20,
    },
    loadingContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },

    // Profil
    profileContainer: {
        alignItems: 'center',
        marginBottom: 10,
        marginTop: 30,
        width: '100%',
    },
    profileImage: {
        width: 120,
        height: 140,
    },
    name: {
        fontSize: 24,
        fontWeight: 'bold',
        color: '#1a237e',
        marginBottom: 4,
    },
    email: {
        fontSize: 16,
        color: '#426CC2',
        fontWeight: '400',
    },

    // Bagian report
    sectionTitle: {
        fontSize: 24,
        fontWeight: 'bold',
        color: '#0B1956',
        marginBottom: 16,
    },
    reportContainer: {
        flex: 1,
        gap: 16,
        width: '100%',
    },

    // Row card
    // Agar card-card di dalamnya bisa wrap ke bawah saat layarnya sempit (web atau device kecil).
    row: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        justifyContent: 'space-between', 
        gap: 16,
    },

    // Card dasar
    card: {
        flex: 1,
        padding: 16,
        borderRadius: 12,
        elevation: 2,
        // Agar tidak terlalu memaksa lebar tertentu
        minWidth: 150,
    },
    blueCard: {
        backgroundColor: '#B3D4FF',
    },
    greenCard: {
        backgroundColor: '#FFFFFF',
    },
    yellowCard: {
        backgroundColor: '#F5F77B',
    },
    bestScoreCard: {
        // Gantikan width: 315, height: 100, agar responsif
        width: '100%',
        minHeight: 100,
        marginBottom: 5,
    },

    // Konten card
    cardLabel: {
        fontSize: 14,
        color: '#0B1956',
        marginTop: 8,
        fontWeight: '600',
    },
    cardValue: {
        fontSize: 24,
        fontWeight: 'bold',
        color: '#1a237e',
        marginTop: 4,
    },
    totalAttemptsValue: {
        fontSize: 24,
        fontWeight: 'bold',
        color: '#136726', // Warna hijau
        marginTop: 4,
    },

    // Best Scores
    scoreHeader: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 16,
        gap: 8,
    },
    scoreTitle: {
        fontSize: 16,
        fontWeight: 'bold',
        color: '#426CC2',
    },
    scoreRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 8,
    },
    scoreLabel: {
        fontSize: 14,
        color: '#426CC2',
        fontWeight: '600',
        fontStyle: 'italic',
    },
    scoreContainer: {
        backgroundColor: '#FFF',
        width: 30,
        height: 15,
        justifyContent: 'center',
        alignItems: 'center',
        borderRadius: 4,
    },
    scoreValue: {
        fontSize: 10,
        fontWeight: '500',
        color: '#426CC2',
        fontStyle: 'italic',
    },

    // Tombol Logout
    logoutButton: {
        backgroundColor: '#ff5252',
        padding: 16,
        borderRadius: 12,
        alignItems: 'center',
        marginBottom: 60,
        marginTop: 8,
    },
    logoutText: {
        fontSize: 16,
        color: '#FFF',
        fontWeight: 'bold',
    },

    // Error
    errorText: {
        fontSize: 16,
        color: '#ff5252',
        textAlign: 'center',
    },
});

export default ProfilePage;
