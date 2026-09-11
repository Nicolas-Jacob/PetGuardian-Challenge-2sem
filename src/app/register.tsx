import { View, Text, TextInput, StyleSheet, Alert } from "react-native";
import { useState } from "react";
import { router } from "expo-router";
import CustomButton from "../components/CustomButton";
import BackButton from "../components/BackButton";
import { COLORS } from "../constants/colors";
import { SPACING, RADIUS } from "../constants/spacing";
import { FONT_SIZE, FONT_WEIGHT, TYPOGRAPHY } from "../constants/typography";
import { useAuth } from "../contexts/AuthContext";

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

type FocusableField = "email" | "password" | "confirmPassword";

export default function Register() {

    const { signUp } = useAuth();

    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [loading, setLoading] = useState(false);
    const [focusedField, setFocusedField] = useState<FocusableField | null>(null);

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

            <View style={styles.form}>

                <Text style={styles.label}>
                    E-mail
                </Text>

                <TextInput
                    style={[
                        styles.input,
                        focusedField === "email" && styles.inputFocused
                    ]}
                    placeholder="seu@email.com"
                    placeholderTextColor={COLORS.textSecondary}
                    value={email}
                    onChangeText={setEmail}
                    onFocus={() => setFocusedField("email")}
                    onBlur={() => setFocusedField(null)}
                    keyboardType="email-address"
                    autoCapitalize="none"
                    editable={!loading}
                />

                <Text style={styles.label}>
                    Senha
                </Text>

                <TextInput
                    style={[
                        styles.input,
                        focusedField === "password" && styles.inputFocused
                    ]}
                    placeholder="Mínimo 6 caracteres"
                    placeholderTextColor={COLORS.textSecondary}
                    value={password}
                    onChangeText={setPassword}
                    onFocus={() => setFocusedField("password")}
                    onBlur={() => setFocusedField(null)}
                    secureTextEntry
                    editable={!loading}
                />

                <Text style={styles.label}>
                    Confirmar senha
                </Text>

                <TextInput
                    style={[
                        styles.input,
                        focusedField === "confirmPassword" && styles.inputFocused
                    ]}
                    placeholder="Repita a senha"
                    placeholderTextColor={COLORS.textSecondary}
                    value={confirmPassword}
                    onChangeText={setConfirmPassword}
                    onFocus={() => setFocusedField("confirmPassword")}
                    onBlur={() => setFocusedField(null)}
                    secureTextEntry
                    editable={!loading}
                />

            </View>

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
                Já tem conta?{" "}
                <Text style={styles.linkHighlight}>
                    Entrar
                </Text>
            </Text>

        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: SPACING.xl,
        backgroundColor: COLORS.background
    },

    title: {
        fontSize: TYPOGRAPHY.title.fontSize,
        fontWeight: TYPOGRAPHY.title.fontWeight,
        color: COLORS.primary,
        marginBottom: SPACING.xs
    },

    subtitle: {
        fontSize: FONT_SIZE.body,
        color: COLORS.textSecondary,
        marginBottom: SPACING.xl,
        lineHeight: 22
    },

    form: {
        marginBottom: SPACING.xs
    },

    label: {
        fontSize: FONT_SIZE.caption,
        fontWeight: FONT_WEIGHT.semibold,
        color: COLORS.textSecondary,
        marginBottom: SPACING.xs,
        marginLeft: SPACING.xs
    },

    input: {
        backgroundColor: COLORS.card,
        borderWidth: 1.5,
        borderColor: COLORS.border,
        padding: SPACING.md,
        borderRadius: RADIUS.md,
        marginBottom: SPACING.md,
        fontSize: FONT_SIZE.body,
        color: COLORS.text
    },

    inputFocused: {
        borderColor: COLORS.primary,
        backgroundColor: COLORS.primaryMuted
    },

    link: {
        textAlign: "center",
        marginTop: SPACING.md,
        fontSize: FONT_SIZE.body,
        color: COLORS.textSecondary
    },

    linkHighlight: {
        color: COLORS.primary,
        fontWeight: FONT_WEIGHT.bold
    }
});
