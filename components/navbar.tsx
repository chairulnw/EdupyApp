import React from 'react';
import { View, TouchableOpacity, StyleSheet } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';

const Navbar = () => {
    const router = useRouter();

    return (
        <View style={styles.navbar}>
            <TouchableOpacity onPress={() => router.push('../screens/Homescreen')}>
                <MaterialCommunityIcons name="home" size={30} color="#ffffff" />
            </TouchableOpacity>
            <TouchableOpacity onPress={() => router.push('../screens/Profilescreen')}>
                <MaterialCommunityIcons name="account" size={30} color="#ffffff" />
            </TouchableOpacity>
        </View>
    );
};

const styles = StyleSheet.create({
    navbar: {
        flexDirection: 'row',
        justifyContent: 'space-around',
        alignItems: 'center',
        backgroundColor: '#426CC2',
        paddingVertical: 10,
        position: 'absolute',
        bottom: 0,
        left: 0,
        right: 0,
    },
});

export default Navbar;
