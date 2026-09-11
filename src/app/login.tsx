import { View, Text, TextInput, StyleSheet, Alert } from "react-native";
import { useState } from "react";
import { router } from "expo-router";
import CustomButton from "../components/CustomButton";
import { COLORS } from "../constants/colors";
import { SPACING, RADIUS } from "../constants/spacing";
import { FONT_SIZE, FONT_WEIGHT, TYPOGRAPHY } from "../constants/typography";
import { useAuth } from "../contexts/AuthContext";

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export default function Login() {

    const { signIn } = useAuth();

    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [loading, setLoading] = useState(false);
    const [focusedField, setFocusedField] = useState<"email" | "password" | null>(null);

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

            <View style={styles.logoWrapper}>
                <Text style={styles.logo}>
                    🐾
                </Text>
            </View>

            <Text style={styles.title}>
                PetGuardian AI
            </Text>

            <Text style={styles.subtitle}>
                Seu assistente inteligente para cuidados preventivos do seu pet
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
                    placeholder="Sua senha"
                    placeholderTextColor={COLORS.textSecondary}
                    value={password}
                    onChangeText={setPassword}
                    onFocus={() => setFocusedField("password")}
                    onBlur={() => setFocusedField(null)}
                    secureTextEntry
                    editable={!loading}
                />

            </View>

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
                Não tem conta?{" "}
                <Text style={styles.linkHighlight}>
                    Cadastre-se
                </Text>
            </Text>

        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: "center",
        padding: SPACING.xl,
        backgroundColor: COLORS.background
    },

    logoWrapper: {
        alignSelf: "center",
        width: 88,
        height: 88,
        borderRadius: RADIUS.full,
        backgroundColor: COLORS.primaryMuted,
        alignItems: "center",
        justifyContent: "center",
        marginBottom: SPACING.lg
    },

    logo: {
        fontSize: 44
    },

    title: {
        fontSize: TYPOGRAPHY.largeTitle.fontSize,
        fontWeight: TYPOGRAPHY.largeTitle.fontWeight,
        textAlign: "center",
        color: COLORS.primary
    },

    subtitle: {
        textAlign: "center",
        fontSize: FONT_SIZE.body,
        marginTop: SPACING.sm,
        marginBottom: SPACING.xl,
        color: COLORS.textSecondary,
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
