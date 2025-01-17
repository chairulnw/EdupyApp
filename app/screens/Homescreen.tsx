import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ActivityIndicator,
  SafeAreaView,
  ScrollView,
  Image,
  Linking,
  useWindowDimensions,
} from 'react-native';
import Navbar from '../../components/navbar';
import { useRouter } from 'expo-router';
import { getFirestore, doc, getDoc } from 'firebase/firestore';
import { firebase_auth } from '../../FirebaseConfig';

const HomeScreen = () => {
  const router = useRouter();
  const auth = firebase_auth;
  const db = getFirestore();

  const [userData, setUserData] = useState<{
    name: string;
    lessonsCompleted: number;
  } | null>(null);
  const [loading, setLoading] = useState(true);

  const { width } = useWindowDimensions();
  const isSmallScreen = width < 360;

  type Quiz = {
    id: string;
    title: string;
    description: string;
    code?: string;
  };

  const quizzes: Quiz[] = [
    {
      id: '1',
      title: 'Variables',
      description: 'Learn about variables.',
      code: 'x = 5\ny = "Hello"\nz = True',
    },
    {
      id: '2',
      title: 'Conditionals',
      description: 'Learn about conditionals.',
      code: 'if x == 1:\n    y = 2\n    z = 3',
    },
    {
      id: '3',
      title: 'Loops',
      description: 'Learn about loops.',
      code: 'for i in range(3):\n    print(i)',
    },
  ];

  const documentations = [
    {
      id: 'doc1',
      title: 'Variables',
      link: 'https://docs.python.org/3/tutorial/introduction.html#an-informal-introduction-to-python',
      icon: require('../../assets/variable.png'),
    },
    {
      id: 'doc2',
      title: 'Conditionals',
      link: 'https://docs.python.org/3/tutorial/controlflow.html#if-statements',
      icon: require('../../assets/conditionals.png'),
    },
    {
      id: 'doc3',
      title: 'Loops',
      link: 'https://docs.python.org/3/tutorial/controlflow.html#for-statements',
      icon: require('../../assets/loops.png'),
    },
  ];

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const user = auth.currentUser;
        if (user) {
          const userDocRef = doc(db, 'users', user.uid);
          const userDoc = await getDoc(userDocRef);
          if (userDoc.exists()) {
            const data = userDoc.data();
            const totalLessons =
              (data.bestvar === 100 ? 1 : 0) +
              (data.bestcond === 100 ? 1 : 0) +
              (data.bestloop === 100 ? 1 : 0);

            setUserData({
              name: data.name,
              lessonsCompleted: totalLessons,
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

  const progress =
    userData?.lessonsCompleted && userData?.lessonsCompleted > 0
      ? Math.round((userData.lessonsCompleted / 3) * 100)
      : 0;

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#3498db" />
      </View>
    );
  }

  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView contentContainerStyle={styles.container}>
        {/* WELCOME CARD (diambil dari kode satu) */}
        <View style={styles.welcomeCard}>
          <Text style={styles.welcomeTextCard}>
            Welcome, <Text style={styles.userNameCard}>{userData?.name || 'User'}</Text>!
          </Text>
          <View style={styles.progressContainer}>
            <Text style={styles.progressTextCard}>
              Overall Progress:{' '}
              <Text style={styles.progressValueCard}>{progress}%</Text>
            </Text>
            <View style={styles.progressBarContainerCard}>
              <View style={[styles.progressBarCard, { width: `${progress}%` }]} />
            </View>
          </View>
        </View>

        {/* DOCUMENTATIONS */}
        <Text style={styles.sectionTitle}>Documentations</Text>
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          style={styles.documentationScroll}
        >
          {documentations.map((doc) => (
            <TouchableOpacity
              key={doc.id}
              style={[
                styles.documentationCard ]}
              onPress={() => Linking.openURL(doc.link)}
            >
              <Image
                source={doc.icon}
                style={[styles.icon, isSmallScreen ? { width: 24, height: 24 } : {}]}
                resizeMode="contain"
              />
              <Text style={styles.cardText}>{doc.title}</Text>
            </TouchableOpacity>
          ))}
          <View style={{ width: 5 }} />
        </ScrollView>

        {/* PRACTICES */}
        <Text style={styles.sectionTitle}>Practices</Text>
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          style={styles.practiceScroll}
        >
          {quizzes.map((quiz) => (
            <TouchableOpacity
              key={quiz.id}
              onPress={() => router.push(`../screens/Quizscreen?id=${quiz.id}`)}
              style={[
                styles.practiceCard,
              ]}
            >
              <Text style={styles.practiceTitle}>{quiz.title}</Text>
              <View style={styles.codeContainer}>
                <Text style={styles.codeText}>{quiz.code}</Text>
              </View>
            </TouchableOpacity>
          ))}
          <View style={{ width: 5 }} />
        </ScrollView>
      </ScrollView>
      <Navbar />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#E8F1FA',
  },
  safeArea: {
    flex: 1,
    backgroundColor: '#E8F1FA',
  },
  container: {
    flexGrow: 1,
    padding: 16,
    backgroundColor: '#E8F1FA',
  },

  welcomeCard: {
    backgroundColor: '#426BC2',
    borderRadius: 20,
    padding: 20,
    marginBottom: 20,
    elevation: 5,
    width: '100%',
  },
  welcomeTextCard: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#FFFFFF',
    marginBottom: 10,
    textAlign: 'center',
  },
  userNameCard: {
    color: '#F5F77B',
  },
  progressContainer: {
    marginTop: 10,
  },
  progressTextCard: {
    fontSize: 18,
    fontWeight: '600',
    color: '#FFFFFF',
    marginBottom: 5,
  },
  progressValueCard: {
    color: '#F5F77B',
  },
  progressBarContainerCard: {
    backgroundColor: 'rgba(255, 255, 255, 0.3)',
    width: '100%',
    height: 10,
    borderRadius: 5,
    overflow: 'hidden',
  },
  progressBarCard: {
    backgroundColor: '#F5F77B',
    height: '100%',
  },

  sectionTitle: {
    fontFamily: 'Inter',
    fontSize: 24,
    fontWeight: 'bold',
    color: '#293454',
    marginBottom: 10,
  },

  documentationScroll: {
    marginBottom: 18,
  },
  documentationCard: {
    backgroundColor: '#B3D4FF',
    minWidth: 145,
    minHeight: 90,
    width:'100%',
    flexGrow: 1,
    borderRadius: 10,
    padding: 8,
    marginRight: 10,
    alignItems: 'center',
    justifyContent: 'center',
  },

  icon: {
    width: 32,
    height: 32,
    marginBottom: 3,
  },
  cardText: {
    fontFamily: 'Inter',
    fontSize: 15,
    fontWeight: '600',
    color: '#293454',
  },

  practiceScroll: {
    marginBottom: 15,
  },
  practiceCard: {
    backgroundColor: '#476FAF',
    minWidth: 173,
    height: 150,
    flexGrow: 1,
    width:'100%',
    borderRadius: 10,
    padding: 10,
    marginRight: 10,
  },
  practiceTitle: {
    fontFamily: 'Inter',
    fontSize: 20,
    fontWeight: 'bold',
    color: '#FFFFFF',
    marginBottom: 15,
  },
  codeContainer: {
    flex: 1,
    backgroundColor: '#FFFFFF',
    borderRadius: 8,
    padding: 10,
  },
  codeText: {
    fontFamily: 'Inter',
    fontSize: 14,
    color: '#000000',
  },
});

export default HomeScreen;
