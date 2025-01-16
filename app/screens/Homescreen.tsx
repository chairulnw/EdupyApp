import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, FlatList, Image, TouchableOpacity, ActivityIndicator } from 'react-native';
import { Card } from 'react-native-paper';
import Navbar from '../../components/navbar'; // Import Navbar
import { useRouter } from 'expo-router';
import { getFirestore, doc, getDoc } from 'firebase/firestore';
import { firebase_auth } from '../../FirebaseConfig';

const HomeScreen = () => {
    const router = useRouter();
    const auth = firebase_auth;
    const db = getFirestore();

    // State untuk menyimpan data pengguna
    const [userData, setUserData] = useState<{ name: string; lessonsCompleted: number } | null>(null);
    const [loading, setLoading] = useState(true);

    // Data dummy untuk daftar quiz
    type Quiz = {
        id: string;
        title: string;
        description: string;
    };

    const quizzes: Quiz[] = [
        { id: '1', title: 'Variables', description: 'Learn about variables.' },
        { id: '2', title: 'Conditionals', description: 'Learn about conditionals.' },
        { id: '3', title: 'Loops', description: 'Learn about loops.' },
    ];

    // Ambil data pengguna dari Firestore
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

    const renderQuizItem = ({ item }: { item: Quiz }) => (
        <TouchableOpacity onPress={() => router.push(`../screens/Quizscreen?id=${item.id}`)}>
            <Card style={styles.quizCard}>
                <Card.Title title={item.title} titleStyle={styles.cardTitle} />
                <Card.Content>
                    <Text style={styles.cardDescription}>{item.description}</Text>
                </Card.Content>
            </Card>
        </TouchableOpacity>
    );

    if (loading) {
        return (
            <View style={styles.loadingContainer}>
                <ActivityIndicator size="large" color="#094779" />
            </View>
        );
    }

    return (
        <View style={styles.container}>
            {/* Profil pengguna */}
            <View style={styles.profileCard}>
                <Image
                    source={{ uri: 'https://via.placeholder.com/80' }} // Ganti dengan URL gambar profil
                    style={styles.profileImage}
                />
                <View style={styles.profileInfo}>
                    <Text style={styles.profileName}>{userData?.name || 'User'}</Text>
                    <Text style={styles.profileDetails}>
                        Lesson Completed: {userData?.lessonsCompleted || 0}
                    </Text>
                </View>
            </View>

            {/* Logo Python */}
            <View style={styles.logoContainer}>
                <Image
                    source={{ uri: 'https://upload.wikimedia.org/wikipedia/commons/c/c3/Python-logo-notext.svg' }}
                    style={styles.pythonLogo}
                />
                <Text style={styles.logoText}>Programming with Python</Text>
            </View>

            {/* Daftar Quiz */}
            <View style={styles.quizContainer}>
                <Text style={styles.sectionTitle}>Practices</Text>
                <FlatList
                    data={quizzes}
                    renderItem={renderQuizItem}
                    keyExtractor={(item) => item.id}
                    contentContainerStyle={styles.quizList}
                />
            </View>

            {/* Navbar */}
            <Navbar />
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#E8F1F9',
    },
    loadingContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    profileCard: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#FFFFFF',
        padding: 15,
        margin: 10,
        borderRadius: 10,
        elevation: 2,
    },
    profileImage: {
        width: 80,
        height: 80,
        borderRadius: 40,
        marginRight: 10,
    },
    profileInfo: {
        flex: 1,
    },
    profileName: {
        fontSize: 18,
        fontWeight: 'bold',
        color: '#094779',
    },
    profileDetails: {
        fontSize: 14,
        color: '#555555',
    },
    logoContainer: {
        alignItems: 'center',
        marginVertical: 20,
    },
    pythonLogo: {
        width: 100,
        height: 100,
        marginBottom: 10,
    },
    logoText: {
        fontSize: 16,
        fontWeight: 'bold',
        color: '#094779',
    },
    quizContainer: {
        flex: 1,
        paddingHorizontal: 10,
    },
    sectionTitle: {
        fontSize: 20,
        fontWeight: 'bold',
        color: '#094779',
        marginBottom: 10,
        textAlign: 'center',
    },
    quizList: {
        paddingBottom: 20,
    },
    quizCard: {
        marginBottom: 15,
        borderRadius: 10,
        elevation: 3,
        backgroundColor: '#FFFFFF',
    },
    cardTitle: {
        fontSize: 16,
        fontWeight: 'bold',
        color: '#094779',
    },
    cardDescription: {
        fontSize: 14,
        color: '#555555',
    },
});

export default HomeScreen;
