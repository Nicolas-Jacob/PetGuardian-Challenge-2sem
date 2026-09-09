import { View, Text, TextInput, StyleSheet, Alert } from "react-native";
import { useState } from "react";
import { router } from "expo-router";
import CustomButton from "../components/CustomButton";
import { COLORS } from "../constants/colors";
import { useAuth } from "../contexts/AuthContext";

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export default function Login() {

    const { signIn } = useAuth();

    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [loading, setLoading] = useState(false);

    async function handleLogin() {

        if (!email.trim() || !password.trim()) {
            Alert.alert("Erro", "Preencha todos os campos");
            return;
        }

        if (!EMAIL_REGEX.test(email.trim())) {
            Alert.alert("Erro", "Digite um e-mail válido");
            return;
        }

        setLoading(true);

        try {
            await signIn(email.trim(), password);
            router.replace("/home");
        } catch (error) {
            const message =
                error instanceof Error
                    ? error.message
                    : "Não foi possível entrar. Tente novamente.";

            Alert.alert("Erro ao entrar", message);
        } finally {
            setLoading(false);
        }
    }

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

            <TextInput
                style={styles.input}
                placeholder="E-mail"
                value={email}
                onChangeText={setEmail}
                keyboardType="email-address"
                autoCapitalize="none"
                editable={!loading}
            />

            <TextInput
                style={styles.input}
                placeholder="Senha"
                value={password}
                onChangeText={setPassword}
                secureTextEntry
                editable={!loading}
            />

            <CustomButton
                title="Entrar"
                onPress={handleLogin}
                loading={loading}
            />

            <Text
                style={styles.link}
                onPress={() => {
                    if (!loading) router.push("/register");
                }}
            >
                Não tem conta? Cadastre-se
            </Text>

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
    },

    input: {
        backgroundColor: COLORS.white,
        padding: 15,
        borderRadius: 12,
        marginBottom: 15
    },

    link: {
        textAlign: "center",
        marginTop: 20,
        color: COLORS.primary,
        fontWeight: "bold"
    }
});
