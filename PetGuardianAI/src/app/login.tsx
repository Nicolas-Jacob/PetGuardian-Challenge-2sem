import { View, Text, StyleSheet } from "react-native";
import { router } from "expo-router";
import CustomButton from "../components/CustomButton";
import { COLORS } from "../constants/colors";

export default function Login() {
    return (
        <View style={styles.container}>

            <Text style={styles.logo}>
                🐾
            </Text>

            <Text style={styles.title}>
                PetGuardian AI
            </Text>

            <Text style={styles.subtitle}>
                Seu assistente inteligente para cuidados preventivos do seu pet
            </Text>

            <CustomButton
                title="Entrar"
                onPress={() => router.push("/home")}
            />

        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: "center",
        padding: 25,
        backgroundColor: COLORS.background
    },

    logo: {
        fontSize: 60,
        textAlign: "center",
        marginBottom: 20
    },

    title: {
        fontSize: 35,
        fontWeight: "bold",
        textAlign: "center",
        color: COLORS.primary
    },

    subtitle: {
        textAlign: "center",
        fontSize: 15,
        marginTop: 15,
        marginBottom: 35,
        color: COLORS.gray,
        lineHeight: 22
    }
});