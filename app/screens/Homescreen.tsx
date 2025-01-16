import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  Image,
  TouchableOpacity,
  ActivityIndicator,
  SafeAreaView,
  Linking,
} from 'react-native';
import { Card } from 'react-native-paper';
import Navbar from '../../components/navbar';
import { useRouter } from 'expo-router';
import { getFirestore, doc, getDoc } from 'firebase/firestore';
import { firebase_auth } from '../../FirebaseConfig';

const HomeScreen = () => {
  const router = useRouter();
  const auth = firebase_auth;
  const db = getFirestore();

  const [userData, setUserData] = useState<{ name: string; lessonsCompleted: number } | null>(
    null
  );
  const [loading, setLoading] = useState(true);

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
    <TouchableOpacity
      onPress={() => router.push(`../screens/Quizscreen?id=${item.id}`)}
      style={styles.quizCardContainer}
    >
      <Card style={styles.quizCard}>
        <Card.Content>
          <Text style={styles.cardTitle}>{item.title}</Text>
          <View style={styles.codeBlock}>
            <Text style={styles.codeText}>
              {item.code?.split('\n').map((line, index) => (
                <Text key={index}>
                  {line.split(' ').map((word, wordIndex) => {
                    if (['if', 'for', 'in', 'range'].includes(word)) {
                      return (
                        <Text key={wordIndex} style={styles.blueText}>
                          {word}{' '}
                        </Text>
                      );
                    } else if (['True', '1', '2', '3', '5'].includes(word)) {
                      return (
                        <Text key={wordIndex} style={styles.greenText}>
                          {word}{' '}
                        </Text>
                      );
                    }
                    return <Text key={wordIndex}>{word} </Text>;
                  })}
                  {'\n'}
                </Text>
              ))}
            </Text>
          </View>
        </Card.Content>
      </Card>
    </TouchableOpacity>
  );

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#3498db" />
      </View>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      {/* Profile Card */}
      <View style={styles.card}>
        <View style={styles.profileContainer}>
          <Image
            source={{ uri: 'https://via.placeholder.com/80' }}
            style={styles.avatar}
          />
          <View style={styles.profileInfo}>
            <Text style={styles.name}>{userData?.name || 'User'}</Text>
            <Text style={styles.lessonStatus}>
              Lesson Completed: {userData?.lessonsCompleted || 0}
            </Text>
          </View>
        </View>
      </View>

      {/* Course Card */}
      <TouchableOpacity
        onPress={() => Linking.openURL('https://docs.python.org/3/')}
        style={styles.card}
      >
        <View style={styles.courseContainer}>
          <Image
            source={{
              uri: 'https://upload.wikimedia.org/wikipedia/commons/c/c3/Python-logo-notext.svg',
            }}
            style={styles.pythonLogo}
          />
          <Text style={styles.courseTitle}>Programming with Python</Text>
        </View>
      </TouchableOpacity>

      {/* Practices Section */}
      <View style={styles.practicesSection}>
        <Text style={styles.practicesTitle}>Practices</Text>
        <FlatList
          data={quizzes}
          renderItem={renderQuizItem}
          keyExtractor={(item) => item.id}
          contentContainerStyle={styles.quizList}
        />
      </View>

      <Navbar />
    </SafeAreaView>
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
  card: {
    backgroundColor: 'white',
    borderRadius: 16,
    padding: 20,
    margin: 16,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  profileContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  avatar: {
    width: 60,
    height: 60,
    borderRadius: 30,
    borderWidth: 2,
    borderColor: '#3498db',
  },
  profileInfo: {
    marginLeft: 16,
    flex: 1,
  },
  name: {
    fontSize: 18,
    fontWeight: '700',
    color: '#2c3e50',
  },
  lessonStatus: {
    fontSize: 14,
    color: '#7f8c8d',
    marginTop: 4,
  },
  courseContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#ecf0f1',
    borderRadius: 12,
    padding: 12,
  },
  pythonLogo: {
    width: 40,
    height: 40,
    resizeMode: 'contain'
  },
  courseTitle: {
    fontSize: 16,
    fontWeight: '600',
    marginLeft: 12,
    color: '#2c3e50',
  },
  practicesSection: {
    flex: 1,
    paddingHorizontal: 16,
  },
  practicesTitle: {
    fontSize: 24,
    fontWeight: '700',
    color: '#2c3e50',
    marginBottom: 16,
    marginTop: 8,
  },
  quizList: {
    paddingBottom: 16,
  },
  quizCardContainer: {
    marginBottom: 16,
  },
  quizCard: {
    borderRadius: 16,
    backgroundColor: 'white',
    elevation: 3,
  },
  cardTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#2c3e50',
    marginBottom: 12,
  },
  codeBlock: {
    backgroundColor: '#f1f2f6',
    padding: 16,
    borderRadius: 12,
  },
  codeText: {
    fontFamily: 'monospace',
    fontSize: 14,
  },
  blueText: {
    color: '#3498db',
  },
  greenText: {
    color: '#2ecc71',
  },
});

export default HomeScreen;
