import React, { useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, ScrollView } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import Modal from 'react-native-modal'; // Modal untuk feedback jawaban dan keluar
import { getFirestore, doc, updateDoc, getDoc } from 'firebase/firestore';
import { firebase_auth } from '../../FirebaseConfig';
import { questions1, questions2, questions3 } from '../data/questions';

const QuizScreen = () => {
    const params = useLocalSearchParams();
    const id = params.id; // Ambil nilai parameter "id"
    const router = useRouter();

    const db = getFirestore();
    const auth = firebase_auth;

    const [currentQuestion, setCurrentQuestion] = useState(0);
    const [score, setScore] = useState(0);
    const [correctAnswers, setCorrectAnswers] = useState(0);
    const [wrongAnswers, setWrongAnswers] = useState(0);
    const [selectedOption, setSelectedOption] = useState<string | null>(null);
    const [isQuizFinished, setIsQuizFinished] = useState(false);
    const [isModalVisible, setModalVisible] = useState(false);
    const [modalMessage, setModalMessage] = useState('');
    const [isExitModal, setIsExitModal] = useState(false);

    // Pilih set soal berdasarkan ID
    const questions = id === '1' ? questions1 : id === '2' ? questions2 : questions3;

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
            setModalMessage('Benar! Jawaban Anda benar.');
        } else {
            setWrongAnswers(wrongAnswers + 1);
            setModalMessage('Salah! Jawaban Anda salah.');
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

    const updateUserStats = async () => {
        try {
            const user = auth.currentUser;
    
            if (user) {
                const userDocRef = doc(db, 'users', user.uid);
                const userDoc = await getDoc(userDocRef);
    
                if (userDoc.exists()) {
                    const userData = userDoc.data();
    
                    // Hitung persentase skor
                    const percentageScore = Math.round((score / questions.length) * 100);
                    console.log(score);
                    console.log(questions.length);
                    console.log(percentageScore);
    
                    // Tentukan field untuk skor terbaik berdasarkan ID kuis
                    const fieldToUpdate =
                        id === '1' ? 'bestvar' : id === '2' ? 'bestcond' : 'bestloop';
    
                    // Ambil skor terbaik sebelumnya
                    const previousBestScore = userData[fieldToUpdate] || 0;
    
                    // Perbarui skor terbaik hanya jika lebih tinggi dari sebelumnya
                    const newBestScore = Math.max(previousBestScore, percentageScore);
    
                    // Perbarui data pengguna di Firestore
                    await updateDoc(userDocRef, {
                        [fieldToUpdate]: newBestScore,
                        attempt: (userData.attempt || 0) + 1, // Tambah jumlah attempt
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
        updateUserStats(); // Simpan hasil kuis
        return (
            <View style={styles.recapContainer}>
                <Text style={styles.recapTitle}>Recap Hasil</Text>
                <Text style={styles.recapText}>Benar: {correctAnswers}</Text>
                <Text style={styles.recapText}>Salah: {wrongAnswers}</Text>
                <Text style={styles.recapText}>
                    Skor: {score}/{questions.length}
                </Text>
                <TouchableOpacity
                    style={styles.homeButton}
                    onPress={() => router.push('./Homescreen')}
                >
                    <Text style={styles.homeButtonText}>Kembali ke Home</Text>
                </TouchableOpacity>
            </View>
        );
    }

    return (
        <View style={styles.container}>
            <Modal isVisible={isModalVisible}>
                <View style={styles.modalContainer}>
                    <Text style={styles.modalText}>{modalMessage}</Text>
                    {isExitModal ? (
                        <View style={styles.modalButtonContainer}>
                            <TouchableOpacity
                                style={styles.cancelButton}
                                onPress={() => setModalVisible(false)}
                            >
                                <Text style={styles.cancelButtonText}>Batal</Text>
                            </TouchableOpacity>
                            <TouchableOpacity style={styles.exitButton} onPress={confirmExit}>
                                <Text style={styles.exitButtonText}>Keluar</Text>
                            </TouchableOpacity>
                        </View>
                    ) : (
                        <TouchableOpacity
                            style={styles.closeButton}
                            onPress={() => setModalVisible(false)}
                        >
                            <Text style={styles.closeButtonText}>Tutup</Text>
                        </TouchableOpacity>
                    )}
                </View>
            </Modal>

            <TouchableOpacity style={styles.exitButtonTop} onPress={handleExitQuiz}>
                <Text style={styles.exitButtonTopText}>X</Text>
            </TouchableOpacity>

            <ScrollView contentContainerStyle={styles.content}>
                <Text style={styles.question}>
                    {currentQuestion + 1}. {questions[currentQuestion].question}
                </Text>
                {questions[currentQuestion].options.map((option, index) => (
                    <TouchableOpacity
                        key={index}
                        style={[
                            styles.option,
                            selectedOption === option && styles.selectedOption,
                        ]}
                        onPress={() => setSelectedOption(option)}
                    >
                        <Text style={styles.optionText}>{option}</Text>
                    </TouchableOpacity>
                ))}
                <TouchableOpacity style={styles.checkButton} onPress={handleCheckAnswer}>
                    <Text style={styles.checkButtonText}>Check</Text>
                </TouchableOpacity>
            </ScrollView>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#FFFFFF',
        paddingTop: 20,
    },
    exitButtonTop: {
        position: 'absolute',
        top: 20,
        right: 20,
        zIndex: 10,
        backgroundColor: '#FF4D4D',
        padding: 10,
        borderRadius: 20,
    },
    exitButtonTopText: {
        color: '#FFFFFF',
        fontWeight: 'bold',
    },
    content: {
        flexGrow: 1,
        padding: 20,
    },
    question: {
        fontSize: 18,
        fontWeight: 'bold',
        marginBottom: 20,
        color: '#094779',
    },
    option: {
        backgroundColor: '#D9E6F2',
        padding: 15,
        borderRadius: 10,
        marginVertical: 10,
    },
    selectedOption: {
        backgroundColor: '#B0D6F1',
        borderColor: '#094779',
        borderWidth: 2,
    },
    optionText: {
        fontSize: 16,
        color: '#094779',
    },
    checkButton: {
        backgroundColor: '#094779',
        padding: 15,
        borderRadius: 10,
        marginTop: 20,
    },
    checkButtonText: {
        color: '#FFFFFF',
        fontSize: 16,
        fontWeight: 'bold',
        textAlign: 'center',
    },
    recapContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#FFFFFF',
        padding: 20,
    },
    recapTitle: {
        fontSize: 24,
        fontWeight: 'bold',
        marginBottom: 20,
        color: '#094779',
    },
    recapText: {
        fontSize: 18,
        marginBottom: 10,
        color: '#555555',
    },
    homeButton: {
        backgroundColor: '#094779',
        padding: 15,
        borderRadius: 10,
        marginTop: 20,
    },
    homeButtonText: {
        color: '#FFFFFF',
        fontSize: 16,
        fontWeight: 'bold',
        textAlign: 'center',
    },
    modalContainer: {
        backgroundColor: '#FFFFFF',
        padding: 20,
        borderRadius: 10,
        alignItems: 'center',
    },
    modalText: {
        fontSize: 18,
        marginBottom: 20,
        color: '#094779',
    },
    modalButtonContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
    },
    cancelButton: {
        backgroundColor: '#CCCCCC',
        padding: 10,
        borderRadius: 5,
        marginRight: 10,
    },
    cancelButtonText: {
        color: '#000000',
    },
    exitButton: {
        backgroundColor: '#FF4D4D',
        padding: 10,
        borderRadius: 5,
    },
    exitButtonText: {
        color: '#FFFFFF',
        fontWeight: 'bold',
    },
    closeButton: {
        backgroundColor: '#094779',
        padding: 10,
        borderRadius: 5,
    },
    closeButtonText: {
        color: '#FFFFFF',
        fontWeight: 'bold',
    },
});

export default QuizScreen;
