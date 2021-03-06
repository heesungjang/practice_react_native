import React, { useState, useEffect } from "react";

import * as Location from "expo-location";
import { StatusBar } from "expo-status-bar";
import { Fontisto } from "@expo/vector-icons";
import {
    StyleSheet,
    Text,
    Dimensions,
    View,
    ScrollView,
    ActivityIndicator,
} from "react-native";

// 모바일 스크린 사이즈
const { width: SCREEN_WIDTH } = Dimensions.get("window");
// openWeather api key
const API_KEY = "535d8528839d562b4179a400168ca57b";
//icons
const icons = {
    Clouds: "cloudy",
    Clear: "day-sunny",
    Atmosphere: "cloudy-gusts",
    Snow: "snow",
    Rain: "rains",
    Drizzle: "rain",
    Thunderstorm: "lightning",
};

export default function App() {
    const [city, setCity] = useState("Loading...");
    const [days, setDays] = useState([]);
    const [isPermitted, setIsPermitted] = useState(true);

    // 날짜 요청 함수
    const getWeather = async () => {
        const permission = await Location.requestForegroundPermissionsAsync();
        setIsPermitted(permission.granted);
        const {
            coords: { latitude, longitude },
        } = await Location.getCurrentPositionAsync({ accuracy: 5 });

        const location = await Location.reverseGeocodeAsync(
            { latitude, longitude },
            { useGoogleMaps: false }
        );
        setCity(location[0]?.city);
        const response = await fetch(
            `https://api.openweathermap.org/data/2.5/onecall?lat=${latitude}&lon=${longitude}&exclude=alerts&appid=${API_KEY}&units=metric`
        );
        const { daily } = await response.json();
        setDays(daily);
    };

    useEffect(() => {
        getWeather();
    }, []);
    return (
        <View style={styles.container}>
            <View style={styles.city}>
                <Text style={styles.cityName}>{city}</Text>
            </View>
            <ScrollView
                pagingEnabled
                horizontal
                showsHorizontalScrollIndicator={false}
                contentContainerStyle={styles.weather}
            >
                {days.length === 0 ? (
                    <View style={{ ...styles.day, alignItems: "center" }}>
                        <ActivityIndicator
                            color="white"
                            size="large"
                            style={{ marginTop: 10 }}
                        />
                    </View>
                ) : (
                    days.map((day, idx) => (
                        <View key={idx} style={styles.day}>
                            <View
                                style={{
                                    flexDirection: "row",
                                    alignItems: "center",
                                    width: "100%",
                                    justifyContent: "space-between",
                                }}
                            >
                                <Text style={styles.temperature}>
                                    {parseFloat(day.temp.day).toFixed(1)}
                                </Text>
                                <Fontisto
                                    name={icons[day.weather[0].main]}
                                    size={68}
                                    color="white"
                                />
                            </View>

                            <Text style={styles.description}>
                                {day.weather[0].main}
                            </Text>
                            <Text style={styles.subInfo}>
                                {day.weather[0].description}
                            </Text>
                        </View>
                    ))
                )}
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
        color: "white",
        fontSize: 68,
        fontWeight: "500",
    },
    weather: {},
    day: {
        width: SCREEN_WIDTH,
        paddingHorizontal: 20,
        alignItems: "flex-start",
    },
    temperature: {
        color: "white",
        marginTop: 50,
        fontWeight: "600",
        fontSize: 100,
    },
    description: {
        color: "white",
        marginTop: -10,
        fontSize: 30,
    },
    subInfo: {
        color: "white",
        fontWeight: "500",
        fontSize: 20,
    },
});
