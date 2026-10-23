import { useRef, useState } from "react";
import { View, Text, TextInput, StyleSheet, ScrollView, ScrollViewInstance, TouchableOpacity } from "react-native";
import CustomButton from "../components/CustomButton";
import BackButton from "../components/BackButton";
import ChatSuggestions from "../components/ChatSuggestions";
import { ThemeColors } from "../constants/colors";
import { useTheme } from "../contexts/ThemeContext";
import { useThemedStyles } from "../hooks/useThemedStyles";
import { useChatData } from "../hooks/useChatData";
import { generateChatReply } from "../utils/chatEngine";
import { SPACING, RADIUS, SHADOWS } from "../constants/spacing";
import { FONT_SIZE, FONT_WEIGHT, TYPOGRAPHY } from "../constants/typography";

interface ChatMessage {
    id: string;
    from: "user" | "ai";
    text: string;
}

// Atalhos para as perguntas que usam os dados do usuário
const QUICK_SUGGESTIONS = [
    "Meus pets",
    "Próximo lembrete",
    "Última vacina",
    "Resumo do histórico"
];

export default function Chat() {

    const { colors } = useTheme();
    const styles = useThemedStyles(createStyles);

    const [message, setMessage] = useState("");
    const [messages, setMessages] = useState<ChatMessage[]>([]);
    const [inputFocused, setInputFocused] = useState(false);
    const scrollViewRef = useRef<ScrollViewInstance>(null);

    const { pets, history, status } = useChatData();

    const suggestions = [
        "Quando devo vacinar meu pet?",
        "Qual a melhor alimentação?",
        "Quanto de água o pet deve beber?",
        "Meu cachorro está sem comer",
        "Meu pet está vomitando",
        "Com que frequência devo levar ao veterinário?",
        "Quantas vezes devo dar banho?",
        "Meu pet está muito cansado"
    ];

    // Caminho único de envio: texto digitado e atalhos passam por aqui
    function sendMessage(text: string) {

        if (!text.trim()) {
            return;
        }

        const userText = text.trim();
        const aiText = generateChatReply(userText, {
            pets,
            history,
            now: new Date(),
            dataStatus: status
        });
        const timestamp = Date.now();

        setMessages((previous) => [
            { id: `${timestamp}-user`, from: "user", text: userText },
            { id: `${timestamp}-ai`, from: "ai", text: aiText },
            ...previous
        ]);

        scrollViewRef.current?.scrollTo({ y: 0, animated: true });
    }

    function handleSend() {

        if (!message.trim()) {
            return;
        }

        sendMessage(message);
        setMessage("");
    }

    return (
        <ScrollView ref={scrollViewRef} contentContainerStyle={styles.container}>
            <BackButton />

            <Text style={styles.title}>
                Chat de Cuidados
            </Text>

            <Text style={styles.subtitle}>
                Tire dúvidas de cuidados e consulte seus pets e lembretes
            </Text>

            <View style={styles.chatArea}>
                {messages.length === 0 ? (

                    <View style={styles.emptyChat}>
                        <Text style={styles.emptyChatIcon}>
                            💬
                        </Text>
                        <Text style={styles.emptyChatText}>
                            Faça uma pergunta para começar
                        </Text>
                        <Text style={styles.emptyChatHint}>
                            Além de dicas de cuidados, posso consultar seus pets, os próximos lembretes, a última vacina e o resumo do histórico clínico.
                        </Text>
                    </View>

                ) : (

                    messages.map((item) => (
                        <View
                            key={item.id}
                            style={[
                                styles.bubbleRow,
                                item.from === "user" ? styles.bubbleRowUser : styles.bubbleRowAi
                            ]}
                        >
                            {item.from === "ai" && (
                                <View style={styles.avatar}>
                                    <Text style={styles.avatarText}>
                                        🐾
                                    </Text>
                                </View>
                            )}

                            <View
                                style={[
                                    styles.bubble,
                                    item.from === "user" ? styles.bubbleUser : styles.bubbleAi
                                ]}
                            >
                                <Text
                                    style={[
                                        styles.bubbleText,
                                        item.from === "user" ? styles.bubbleTextUser : styles.bubbleTextAi
                                    ]}
                                >
                                    {item.text}
                                </Text>
                            </View>
                        </View>
                    ))

                )}
            </View>

            <ChatSuggestions
                suggestions={QUICK_SUGGESTIONS}
                onSelect={sendMessage}
            />

            <TextInput
                style={[styles.input, inputFocused && styles.inputFocused]}
                placeholder="Pergunte algo..."
                placeholderTextColor={colors.placeholder}
                value={message}
                onChangeText={setMessage}
                onFocus={() => setInputFocused(true)}
                onBlur={() => setInputFocused(false)}
            />

            <CustomButton
                title="Enviar"
                onPress={handleSend}
            />

            <Text style={styles.suggestionTitle}>
                Perguntas frequentes
            </Text>

            <View style={styles.suggestionContainer}>
                {suggestions.map((item, index) => (
                    <TouchableOpacity
                        key={index}
                        style={styles.suggestionButton}
                        onPress={() => setMessage(item)}
                    >
                        <Text style={styles.suggestionText}>
                            {item}
                        </Text>
                    </TouchableOpacity>
                ))}
            </View>

        </ScrollView>
    );
}

const createStyles = (colors: ThemeColors) => StyleSheet.create({
    container: {
        flexGrow: 1,
        padding: SPACING.lg,
        backgroundColor: colors.background
    },

    title: {
        fontSize: TYPOGRAPHY.title.fontSize,
        fontWeight: TYPOGRAPHY.title.fontWeight,
        color: colors.text,
        marginBottom: SPACING.xs
    },

    subtitle: {
        fontSize: FONT_SIZE.body,
        color: colors.textSecondary,
        marginBottom: SPACING.lg
    },

    chatArea: {
        marginBottom: SPACING.md
    },

    emptyChat: {
        alignItems: "center",
        backgroundColor: colors.card,
        borderRadius: RADIUS.lg,
        padding: SPACING.xl
    },

    emptyChatIcon: {
        fontSize: 32,
        marginBottom: SPACING.sm
    },

    emptyChatText: {
        fontSize: FONT_SIZE.body,
        color: colors.textSecondary
    },

    emptyChatHint: {
        fontSize: FONT_SIZE.caption,
        color: colors.textSecondary,
        textAlign: "center",
        marginTop: SPACING.sm,
        lineHeight: 18
    },

    bubbleRow: {
        flexDirection: "row",
        alignItems: "flex-end",
        marginBottom: SPACING.sm
    },

    bubbleRowUser: {
        justifyContent: "flex-end"
    },

    bubbleRowAi: {
        justifyContent: "flex-start"
    },

    avatar: {
        width: 28,
        height: 28,
        borderRadius: RADIUS.full,
        backgroundColor: colors.primaryMuted,
        alignItems: "center",
        justifyContent: "center",
        marginRight: SPACING.xs
    },

    avatarText: {
        fontSize: 14
    },

    bubble: {
        maxWidth: "78%",
        paddingVertical: SPACING.sm,
        paddingHorizontal: SPACING.md,
        borderRadius: RADIUS.lg
    },

    bubbleUser: {
        backgroundColor: colors.primary,
        borderBottomRightRadius: RADIUS.sm
    },

    bubbleAi: {
        backgroundColor: colors.card,
        borderBottomLeftRadius: RADIUS.sm,
        ...SHADOWS.subtle
    },

    bubbleText: {
        fontSize: FONT_SIZE.body
    },

    bubbleTextUser: {
        color: colors.textOnPrimary
    },

    bubbleTextAi: {
        color: colors.text
    },

    input: {
        backgroundColor: colors.inputBackground,
        borderWidth: 1.5,
        borderColor: colors.border,
        padding: SPACING.md,
        borderRadius: RADIUS.md,
        marginBottom: SPACING.sm,
        fontSize: FONT_SIZE.body,
        color: colors.text
    },

    inputFocused: {
        borderColor: colors.primary,
        backgroundColor: colors.primaryMuted
    },

    suggestionTitle: {
        marginTop: SPACING.lg,
        marginBottom: SPACING.sm,
        fontSize: FONT_SIZE.subtitle,
        fontWeight: FONT_WEIGHT.bold,
        color: colors.text
    },

    suggestionContainer: {
        marginBottom: SPACING.md
    },

    suggestionButton: {
        backgroundColor: colors.card,
        padding: SPACING.sm,
        borderRadius: RADIUS.md,
        marginBottom: SPACING.sm,
        borderWidth: 1,
        borderColor: colors.border
    },

    suggestionText: {
        color: colors.text,
        fontSize: FONT_SIZE.body
    }
});
