import React from 'react';
import { View, Text, StyleSheet, FlatList, Image, TouchableOpacity } from 'react-native';
import { Card } from 'react-native-paper'; // Library untuk komponen kartu
import { MaterialCommunityIcons } from '@expo/vector-icons'; // Library untuk ikon
import { useRouter } from 'expo-router';

const HomeScreen = () => {
    const router = useRouter();

    
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
    

    // Render item quiz
    const renderQuizItem = ({ item }: { item: Quiz }) => (
        <TouchableOpacity onPress={() => console.log(`Selected Quiz ID: ${item.id}`)}>
            <Card style={styles.quizCard}>
                <Card.Title title={item.title} titleStyle={styles.cardTitle} />
                <Card.Content>
                    <Text style={styles.cardDescription}>{item.description}</Text>
                </Card.Content>
            </Card>
        </TouchableOpacity>
    );
    

    return (
        <View style={styles.container}>
            {/* Profil pengguna */}
            <View style={styles.profileCard}>
                <Image
                    source={{ uri: 'https://via.placeholder.com/80' }} // Ganti dengan URL gambar profil
                    style={styles.profileImage}
                />
                <View style={styles.profileInfo}>
                    <Text style={styles.profileName}>Chairul Nur Wahid</Text>
                    <Text style={styles.profileDetails}>Lesson Completed: -</Text>
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
            <View style={styles.navbar}>
                <TouchableOpacity onPress={() => console.log('Go to Home')}>
                    <MaterialCommunityIcons name="home" size={30} color="#094779" />
                </TouchableOpacity>
                <TouchableOpacity onPress={() => router.push('../screens/Loginscreen')}>
                    <MaterialCommunityIcons name="account" size={30} color="#094779" />
                </TouchableOpacity>
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#E8F1F9',
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
    navbar: {
        flexDirection: 'row',
        justifyContent: 'space-around',
        alignItems: 'center',
        backgroundColor: '#D9E6F2',
        paddingVertical: 10,
    },
});

export default HomeScreen;
