import React, { useState, useEffect } from "react";

import * as Location from "expo-location";
import { StatusBar } from "expo-status-bar";
import { StyleSheet, Text, Dimensions, View, ScrollView } from "react-native";

// 모바일 스크린 사이즈
const { width: SCREEN_WIDTH } = Dimensions.get("window");

export default function App() {
    const [location, setLocation] = useState(null);
    const [errorMsg, setErrorMsg] = useState(null);
    const [isPermitted, setIsPermitted] = useState(true);

    const getPermission = async () => {
        const permission = await Location.requestForegroundPermissionsAsync();
        setIsPermitted(permission.granted);
        const {
            coords: { latitude, longitude },
        } = await Location.getCurrentPositionAsync({
            accuracy: 5,
        });
        const location = await Location.reverseGeocodeAsync({
            latitude,
            longitude,
        });
        console.log(location);
    };

    useEffect(() => {
        getPermission();
    }, []);
    return (
        <View style={styles.container}>
            <View style={styles.city}>
                <Text style={styles.cityName}>Seoul</Text>
            </View>
            <ScrollView
                pagingEnabled
                horizontal
                showsHorizontalScrollIndicator={false}
                contentContainerStyle={styles.weather}
            >
                <View style={styles.day}>
                    <Text style={styles.temperature}>27</Text>
                    <Text style={styles.description}>Sunny</Text>
                </View>
                <View style={styles.day}>
                    <Text style={styles.temperature}>27</Text>
                    <Text style={styles.description}>Sunny</Text>
                </View>
                <View style={styles.day}>
                    <Text style={styles.temperature}>27</Text>
                    <Text style={styles.description}>Sunny</Text>
                </View>
            </ScrollView>
            <StatusBar style="light" />
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: "tomato",
    },
    city: {
        flex: 1.2,
        justifyContent: "center",
        alignItems: "center",
    },
    cityName: {
        color: "black",
        fontSize: 68,
        fontWeight: "500",
    },
    weather: {},
    day: {
        width: SCREEN_WIDTH,
        alignItems: "center",
    },
    temperature: {
        marginTop: 50,
        fontWeight: "600",
        fontSize: 178,
    },
    description: {
        marginTop: -30,
        fontSize: 60,
    },
});
