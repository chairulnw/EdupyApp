import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, ScrollView, Animated, Dimensions } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import Modal from 'react-native-modal';
import { getFirestore, doc, updateDoc, getDoc } from 'firebase/firestore';
import { firebase_auth } from '../../FirebaseConfig';
import { questions1, questions2, questions3 } from '../data/questions';
import { MaterialCommunityIcons } from '@expo/vector-icons';

const QuizScreen = () => {
    const params = useLocalSearchParams();
    const id = params.id;
    const router = useRouter();

    const db = getFirestore();
    const auth = firebase_auth;

    // Existing state
    const [currentQuestion, setCurrentQuestion] = useState(0);
    const [score, setScore] = useState(0);
    const [correctAnswers, setCorrectAnswers] = useState(0);
    const [wrongAnswers, setWrongAnswers] = useState(0);
    const [selectedOption, setSelectedOption] = useState<string | null>(null);
    const [isQuizFinished, setIsQuizFinished] = useState(false);
    const [isModalVisible, setModalVisible] = useState(false);
    const [modalMessage, setModalMessage] = useState('');
    const [isExitModal, setIsExitModal] = useState(false);

    // Animation states
    const [fadeAnim] = useState(new Animated.Value(0));
    const [scaleAnim] = useState(new Animated.Value(0.95));
    const [progressAnim] = useState(new Animated.Value(0));

    const questions = id === '1' ? questions1 : id === '2' ? questions2 : questions3;

    useEffect(() => {
        Animated.parallel([
            Animated.timing(fadeAnim, {
                toValue: 1,
                duration: 500,
                useNativeDriver: true,
            }),
            Animated.spring(scaleAnim, {
                toValue: 1,
                friction: 8,
                tension: 40,
                useNativeDriver: true,
            }),
        ]).start();
    }, [currentQuestion]);

    const handleCheckAnswer = () => {
        if (!selectedOption) {
            setModalMessage('Harap pilih jawaban terlebih dahulu.');
            setIsExitModal(false);
            setModalVisible(true);
            return;
        }

        const isCorrect = selectedOption === questions[currentQuestion].correctAnswer;

        if (isCorrect) {
            setScore(score + 1);
            setCorrectAnswers(correctAnswers + 1);
            setModalMessage('🎉 Benar! Jawaban Anda tepat!');
        } else {
            setWrongAnswers(wrongAnswers + 1);
            setModalMessage('❌ Maaf, jawaban Anda kurang tepat.');
        }

        setIsExitModal(false);
        setModalVisible(true);

        if (currentQuestion < questions.length - 1) {
            setTimeout(() => {
                setCurrentQuestion(currentQuestion + 1);
                setSelectedOption(null);
                setModalVisible(false);
            }, 1000);
        } else {
            setTimeout(() => {
                setIsQuizFinished(true);
                setModalVisible(false);
            }, 1000);
        }
    };

    // Existing backend functions remain unchanged
    const updateUserStats = async () => {
        try {
            const user = auth.currentUser;
            if (user) {
                const userDocRef = doc(db, 'users', user.uid);
                const userDoc = await getDoc(userDocRef);
                if (userDoc.exists()) {
                    const userData = userDoc.data();
                    const percentageScore = Math.round((score / questions.length) * 100);
                    const fieldToUpdate = id === '1' ? 'bestvar' : id === '2' ? 'bestcond' : 'bestloop';
                    const previousBestScore = userData[fieldToUpdate] || 0;
                    const newBestScore = Math.max(previousBestScore, percentageScore);
                    await updateDoc(userDocRef, {
                        [fieldToUpdate]: newBestScore,
                        attempt: (userData.attempt || 0) + 1,
                    });
                }
            }
        } catch (error) {
            console.error('Error updating user stats:', error);
        }
    };

    const handleExitQuiz = () => {
        setModalMessage('Apakah Anda yakin ingin keluar dari quiz?');
        setIsExitModal(true);
        setModalVisible(true);
    };

    const confirmExit = () => {
        setModalVisible(false);
        router.push('./Homescreen');
    };

    if (isQuizFinished) {
        updateUserStats();
        return (
            <View style={styles.recapContainer}>
                <MaterialCommunityIcons 
                    name={score > questions.length / 2 ? "trophy" : "school"} 
                    size={64} 
                    color="#FFD700"
                />
                <Text style={styles.recapTitle}>Quiz Selesai! 🎉</Text>
                <View style={styles.scoreCard}>
                    <View style={styles.scoreRow}>
                        <MaterialCommunityIcons name="check-circle" size={24} color="#4CAF50" />
                        <Text style={[styles.recapText, styles.correctText]}>Benar: {correctAnswers}</Text>
                    </View>
                    <View style={styles.scoreRow}>
                        <MaterialCommunityIcons name="close-circle" size={24} color="#FF5252" />
                        <Text style={[styles.recapText, styles.wrongText]}>Salah: {wrongAnswers}</Text>
                    </View>
                    <View style={styles.scoreRow}>
                        <MaterialCommunityIcons name="star" size={24} color="#FFD700" />
                        <Text style={[styles.recapText, styles.scoreText]}>
                            Skor: {score}/{questions.length}
                        </Text>
                    </View>
                </View>
                <TouchableOpacity
                    style={styles.homeButton}
                    onPress={() => router.push('./Homescreen')}
                >
                    <MaterialCommunityIcons name="home" size={24} color="#FFFFFF" />
                    <Text style={styles.homeButtonText}>Kembali ke Home</Text>
                </TouchableOpacity>
            </View>
        );
    }

    const progress = ((currentQuestion + 1) / questions.length) * 100;

    return (
        <View style={styles.container}>
            <Modal 
                isVisible={isModalVisible}
                animationIn="zoomIn"
                animationOut="zoomOut"
                backdropOpacity={0.5}
            >
                <View style={styles.modalContainer}>
                    <Text style={styles.modalText}>{modalMessage}</Text>
                    {isExitModal ? (
                        <View style={styles.modalButtonContainer}>
                            <TouchableOpacity
                                style={styles.cancelButton}
                                onPress={() => setModalVisible(false)}
                            >
                                <MaterialCommunityIcons name="close" size={20} color="#666" />
                                <Text style={styles.cancelButtonText}>Batal</Text>
                            </TouchableOpacity>
                            <TouchableOpacity 
                                style={styles.exitButton} 
                                onPress={confirmExit}
                            >
                                <MaterialCommunityIcons name="exit-to-app" size={20} color="#FFFFFF" />
                                <Text style={styles.exitButtonText}>Keluar</Text>
                            </TouchableOpacity>
                        </View>
                    ) : (
                        <TouchableOpacity
                            style={styles.closeButton}
                            onPress={() => setModalVisible(false)}
                        >
                            <Text style={styles.closeButtonText}>Lanjutkan</Text>
                        </TouchableOpacity>
                    )}
                </View>
            </Modal>

            <View style={styles.header}>
                <View style={styles.progressContainer}>
                    <View style={styles.progressInfo}>
                        <Text style={styles.progressText}>Progress</Text>
                        <Text style={styles.progressPercentage}>{Math.round(progress)}%</Text>
                    </View>
                    <View style={styles.progressBarContainer}>
                        <View style={[styles.progressBar, { width: `${progress}%` }]} />
                    </View>
                </View>
                <TouchableOpacity 
                    style={styles.exitButtonTop} 
                    onPress={handleExitQuiz}
                >
                    <MaterialCommunityIcons name="close" size={24} color="#FFFFFF" />
                </TouchableOpacity>
            </View>

            <ScrollView style={styles.content}>
                <Animated.View 
                    style={[
                        styles.questionCard,
                        {
                            opacity: fadeAnim,
                            transform: [{ scale: scaleAnim }]
                        }
                    ]}
                >
                    <View style={styles.questionHeader}>
                        <MaterialCommunityIcons name="help-circle" size={24} color="#1a237e" />
                        <Text style={styles.questionNumber}>
                            Question {currentQuestion + 1} dari {questions.length}
                        </Text>
                    </View>
                    <Text style={styles.questionText}>
                        {questions[currentQuestion].question}
                    </Text>
                    <View style={styles.optionsContainer}>
                        {questions[currentQuestion].options.map((option, index) => (
                            <TouchableOpacity
                                key={index}
                                style={[
                                    styles.option,
                                    selectedOption === option && styles.selectedOption,
                                ]}
                                onPress={() => setSelectedOption(option)}
                            >
                                <View style={[
                                    styles.radio,
                                    selectedOption === option && styles.radioSelected
                                ]}>
                                    {selectedOption === option && (
                                        <MaterialCommunityIcons 
                                            name="check" 
                                            size={16} 
                                            color="#FFFFFF" 
                                        />
                                    )}
                                </View>
                                <Text style={[
                                    styles.optionText,
                                    selectedOption === option && styles.selectedOptionText
                                ]}>
                                    {option}
                                </Text>
                            </TouchableOpacity>
                        ))}
                    </View>
                    <TouchableOpacity 
                        style={[
                            styles.checkButton,
                            !selectedOption && styles.checkButtonDisabled
                        ]} 
                        onPress={handleCheckAnswer}
                        disabled={!selectedOption}
                    >
                        <MaterialCommunityIcons 
                            name="check-circle" 
                            size={24} 
                            color="#FFFFFF" 
                        />
                        <Text style={styles.checkButtonText}>Periksa Jawaban</Text>
                    </TouchableOpacity>
                </Animated.View>
            </ScrollView>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#E8F1FA',
    },
    header: {
        paddingTop: 6,
        paddingHorizontal: 26,
        backgroundColor: '#E8F1FA',
        borderBottomLeftRadius: 14,
        borderBottomRightRadius: 14,
        shadowColor: '#000',
        shadowOffset: {
            width: 0,
            height: 0,
        },
        shadowOpacity: 0,
        shadowRadius: 4,
        elevation: 4,
    },
    progressContainer: {
        marginBottom: 'auto',
        paddingHorizontal: -2,
        paddingVertical: 10,
        marginTop: 70
    },
    progressInfo: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 8,
    },
    progressText: {
        fontSize: 14,
        color: '#666',
        fontWeight: '500',
    },
    progressPercentage: {
        fontSize: 14,
        color: '#1a237e',
        fontWeight: 'bold',
    },
    progressBarContainer: {
        height: 16,
        backgroundColor: '#e0e0e0',
        borderRadius: 10,
        overflow: 'hidden',
    },
    progressBar: {
        height: '100%',
        backgroundColor: '#4CAF50',
        borderRadius: 4,
    },
    exitButtonTop: {
        position: 'absolute',
        top: 26,
        right: 16,
        width: 40,
        height: 40,
        backgroundColor: '#ff5252',
        borderRadius: 20,
        justifyContent: 'center',
        alignItems: 'center',
        elevation: 4,
    },
    content: {
        flex: 1,
        padding: 16,
    },
    questionCard: {
        backgroundColor: '#FFFFFF',
        borderRadius: 24,
        padding: 24,
        marginVertical: 0,
        shadowColor: '#000',
        shadowOffset: {
            width: 0,
            height: 4,
        },
        shadowOpacity: 0.1,
        shadowRadius: 8,
        elevation: 4,
    },
    questionHeader: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 16,
        gap: 8,
    },
    questionNumber: {
        fontSize: 16,
        color: '#1a237e',
        fontWeight: '600',
    },
    questionText: {
        fontSize: 12,
        fontWeight: 'regular',
        color: '#1a237e',
        marginBottom: 24,
        lineHeight: 28,
    },
    optionsContainer: {
        gap: 12,
    },
    option: {
        flexDirection: 'row',
        alignItems: 'center',
        padding: 16,
        backgroundColor: '#FFFFFF',
        borderRadius: 16,
        borderWidth: 2,
        borderColor: '#e0e0e0',
        elevation: 2,
    },
    selectedOption: {
        borderColor: '#1a237e',
        backgroundColor: '#f5f6fa',
    },
    radio: {
        width: 24,
        height: 24,
        borderRadius: 12,
        borderWidth: 2,
        borderColor: '#666',
        marginRight: 12,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#FFFFFF',
    },
    radioSelected: {
        borderColor: '#1a237e',
        backgroundColor: '#1a237e',
    },
    optionText: {
        fontSize: 16,
        color: '#333',
        flex: 1,
    },
    selectedOptionText: {
        color: '#1a237e',
        fontWeight: '500',
    },
    checkButton: {
        marginTop: 24,
        paddingVertical: 16,
        paddingHorizontal: 24,
        backgroundColor: '#1a237e',
        borderRadius: 16,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        gap: 8,
        elevation: 4,
    },
    checkButtonDisabled: {
        backgroundColor: '#9e9e9e',
        elevation: 0,
    },
    checkButtonText: {
        color: '#FFFFFF',
        fontSize: 16,
        fontWeight: '600',
    },
    modalContainer: {
        backgroundColor: '#FFFFFF',
        padding: 24,
        borderRadius: 24,
        alignItems: 'center',
    },
    modalText: {
        fontSize: 18,
        color: '#333',
        textAlign: 'center',
        marginBottom: 24,
        fontWeight: '500',
    },
    modalButtonContainer: {
        flexDirection: 'row',
        justifyContent: 'center',
        gap: 16,
    },
    cancelButton: {
        paddingVertical: 12,
        paddingHorizontal: 24,
        borderRadius: 12,
        backgroundColor: '#f5f5f5',
        flexDirection: 'row',
        alignItems: 'center',
        gap: 8,
    },
    cancelButtonText: {
        color: '#666',
        fontSize: 16,
        fontWeight: '500',
    },
    exitButton: {
        paddingVertical: 12,
        paddingHorizontal: 24,
        borderRadius: 12,
        backgroundColor: '#ff5252',
        flexDirection: 'row',
        alignItems: 'center',
        gap: 8,
    },
    exitButtonText: {
        color: '#FFFFFF',
        fontSize: 16,
        fontWeight: '500',
    },
    closeButton: {
        paddingVertical: 12,
        paddingHorizontal: 32,
        borderRadius: 12,
        backgroundColor: '#1a237e',
    },
    closeButtonText: {
        color: '#FFFFFF',
        fontSize: 16,
        fontWeight: '500',
    },
    recapContainer: {
        flex: 1,
        padding: 24,
        backgroundColor: '#FFFFFF',
        justifyContent: 'center',
        alignItems: 'center',
    },
    recapTitle: {
        fontSize: 28,
        fontWeight: 'bold',
        color: '#1a237e',
        marginVertical: 24,
        textAlign: 'center',
    },
    scoreCard: {
        backgroundColor: '#f8f9fa',
        padding: 24,
        borderRadius: 24,
        width: '100%',
        marginBottom: 24,
    },
    scoreRow: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 12,
        marginBottom: 16,
    },
    recapText: {
        fontSize: 18,
        fontWeight: '500',
    },
    correctText: {
        color: '#4CAF50',
    },
    wrongText: {
        color: '#FF5252',
    },
    scoreText: {
        color: '#1a237e',
    },
    homeButton: {
        paddingVertical: 16,
        paddingHorizontal: 32,
        backgroundColor: '#1a237e',
        borderRadius: 16,
        flexDirection: 'row',
        alignItems: 'center',
        gap: 8,
        elevation: 4,
    },
    homeButtonText: {
        color: '#FFFFFF',
        fontSize: 16,
        fontWeight: '600',
    },
});

export default QuizScreen;

