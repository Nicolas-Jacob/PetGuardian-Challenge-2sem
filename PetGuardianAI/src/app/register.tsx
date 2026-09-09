import { View, Text, TextInput, StyleSheet, Alert } from "react-native";
import { useState } from "react";
import { router } from "expo-router";
import CustomButton from "../components/CustomButton";
import BackButton from "../components/BackButton";
import { COLORS } from "../constants/colors";
import { useAuth } from "../contexts/AuthContext";

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export default function Register() {

    const { signUp } = useAuth();

    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [loading, setLoading] = useState(false);

    async function handleRegister() {

        if (!email.trim() || !password.trim() || !confirmPassword.trim()) {
            Alert.alert("Erro", "Preencha todos os campos");
            return;
        }

        if (!EMAIL_REGEX.test(email.trim())) {
            Alert.alert("Erro", "Digite um e-mail válido");
            return;
        }

        if (password.length < 6) {
            Alert.alert("Erro", "A senha deve ter no mínimo 6 caracteres");
            return;
        }

        if (password !== confirmPassword) {
            Alert.alert("Erro", "As senhas não coincidem");
            return;
        }

        setLoading(true);

        try {
            await signUp(email.trim(), password);
            router.replace("/home");
        } catch (error) {
            const message =
                error instanceof Error
                    ? error.message
                    : "Não foi possível cadastrar. Tente novamente.";

            Alert.alert("Erro ao cadastrar", message);
        } finally {
            setLoading(false);
        }
    }

    return (
        <View style={styles.container}>
            <BackButton />

            <Text style={styles.title}>
                Criar Conta
            </Text>

            <Text style={styles.subtitle}>
                Cadastre-se para começar a cuidar dos seus pets
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

            <TextInput
                style={styles.input}
                placeholder="Confirmar senha"
                value={confirmPassword}
                onChangeText={setConfirmPassword}
                secureTextEntry
                editable={!loading}
            />

            <CustomButton
                title="Cadastrar"
                onPress={handleRegister}
                loading={loading}
            />

            <Text
                style={styles.link}
                onPress={() => {
                    if (!loading) router.push("/login");
                }}
            >
                Já tem conta? Entrar
            </Text>

        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 25,
        backgroundColor: COLORS.background
    },

    title: {
        fontSize: 28,
        fontWeight: "bold",
        color: COLORS.primary,
        marginBottom: 10
    },

    subtitle: {
        fontSize: 15,
        color: COLORS.gray,
        marginBottom: 30,
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
