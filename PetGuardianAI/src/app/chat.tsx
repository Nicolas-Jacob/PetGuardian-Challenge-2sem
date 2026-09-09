import { useRef, useState } from "react";
import { View, Text, TextInput, StyleSheet, ScrollView, TouchableOpacity } from "react-native";
import CustomButton from "../components/CustomButton";
import BackButton from "../components/BackButton";
import { COLORS } from "../constants/colors";
import { SPACING, RADIUS, SHADOWS } from "../constants/spacing";
import { FONT_SIZE, FONT_WEIGHT, TYPOGRAPHY } from "../constants/typography";

interface ChatMessage {
    id: string;
    from: "user" | "ai";
    text: string;
}

function getAiResponse(question: string): string {

    if (question.includes("vacina") || question.includes("vacinar")) {
        return "As vacinas ajudam a prevenir doenças graves. Filhotes costumam receber várias doses nos primeiros meses de vida e depois reforços periódicos.";
    } else if (
        question.includes("ração") ||
        question.includes("alimentação") ||
        question.includes("comida")
    ) {
        return "Uma alimentação equilibrada é fundamental. Utilize rações adequadas para idade, porte e necessidades específicas do pet.";
    } else if (question.includes("água") || question.includes("hidrat")) {
        return "Água limpa deve estar disponível o tempo todo. A hidratação ajuda no funcionamento dos órgãos e na saúde geral do pet.";
    } else if (
        question.includes("sem comer") ||
        question.includes("não come") ||
        question.includes("apetite")
    ) {
        return "Perda de apetite pode ocorrer por diversos motivos. Observe outros sintomas e procure orientação veterinária se persistir.";
    } else if (
        question.includes("vomitando") ||
        question.includes("vômito")
    ) {
        return "Vômitos ocasionais podem acontecer, mas episódios repetidos podem indicar problemas digestivos ou outras condições.";
    } else if (
        question.includes("veterinário") ||
        question.includes("consulta")
    ) {
        return "Consultas preventivas ajudam a identificar problemas antes que se tornem graves. A frequência pode variar conforme a idade do pet.";
    } else if (question.includes("banho")) {
        return "A frequência do banho depende da raça, tipo de pelo e rotina do pet. Banhos excessivos podem remover a proteção natural da pele.";
    } else if (
        question.includes("cansado") ||
        question.includes("sono")
    ) {
        return "Cansaço pode ser normal após atividades físicas, mas mudanças frequentes de comportamento merecem atenção.";
    }

    return "Não encontrei uma resposta específica. Recomendamos acompanhamento veterinário periódico.";
}

export default function Chat() {

    const [message, setMessage] = useState("");
    const [messages, setMessages] = useState<ChatMessage[]>([]);
    const [inputFocused, setInputFocused] = useState(false);
    const scrollViewRef = useRef<ScrollView>(null);

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

    function handleSend() {

        if (!message.trim()) {
            return;
        }

        const userText = message.trim();
        const question = userText.toLowerCase();
        const aiText = getAiResponse(question);
        const timestamp = Date.now();

        setMessages((previous) => [
            { id: `${timestamp}-user`, from: "user", text: userText },
            { id: `${timestamp}-ai`, from: "ai", text: aiText },
            ...previous
        ]);

        setMessage("");

        scrollViewRef.current?.scrollTo({ y: 0, animated: true });
    }

    return (
        <ScrollView ref={scrollViewRef} contentContainerStyle={styles.container}>
            <BackButton />

            <Text style={styles.title}>
                Chat IA
            </Text>

            <Text style={styles.subtitle}>
                Tire dúvidas sobre cuidados com pets
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

            <TextInput
                style={[styles.input, inputFocused && styles.inputFocused]}
                placeholder="Pergunte algo..."
                placeholderTextColor={COLORS.textSecondary}
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

const styles = StyleSheet.create({
    container: {
        flexGrow: 1,
        padding: SPACING.lg,
        backgroundColor: COLORS.background
    },

    title: {
        fontSize: TYPOGRAPHY.title.fontSize,
        fontWeight: TYPOGRAPHY.title.fontWeight,
        color: COLORS.text,
        marginBottom: SPACING.xs
    },

    subtitle: {
        fontSize: FONT_SIZE.body,
        color: COLORS.textSecondary,
        marginBottom: SPACING.lg
    },

    chatArea: {
        marginBottom: SPACING.md
    },

    emptyChat: {
        alignItems: "center",
        backgroundColor: COLORS.card,
        borderRadius: RADIUS.lg,
        padding: SPACING.xl
    },

    emptyChatIcon: {
        fontSize: 32,
        marginBottom: SPACING.sm
    },

    emptyChatText: {
        fontSize: FONT_SIZE.body,
        color: COLORS.textSecondary
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
        backgroundColor: COLORS.primaryMuted,
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
        backgroundColor: COLORS.primary,
        borderBottomRightRadius: RADIUS.sm
    },

    bubbleAi: {
        backgroundColor: COLORS.card,
        borderBottomLeftRadius: RADIUS.sm,
        ...SHADOWS.subtle
    },

    bubbleText: {
        fontSize: FONT_SIZE.body
    },

    bubbleTextUser: {
        color: COLORS.white
    },

    bubbleTextAi: {
        color: COLORS.text
    },

    input: {
        backgroundColor: COLORS.card,
        borderWidth: 1.5,
        borderColor: COLORS.border,
        padding: SPACING.md,
        borderRadius: RADIUS.md,
        marginBottom: SPACING.sm,
        fontSize: FONT_SIZE.body,
        color: COLORS.text
    },

    inputFocused: {
        borderColor: COLORS.primary,
        backgroundColor: COLORS.primaryMuted
    },

    suggestionTitle: {
        marginTop: SPACING.lg,
        marginBottom: SPACING.sm,
        fontSize: FONT_SIZE.subtitle,
        fontWeight: FONT_WEIGHT.bold,
        color: COLORS.text
    },

    suggestionContainer: {
        marginBottom: SPACING.md
    },

    suggestionButton: {
        backgroundColor: COLORS.card,
        padding: SPACING.sm,
        borderRadius: RADIUS.md,
        marginBottom: SPACING.sm,
        borderWidth: 1,
        borderColor: COLORS.border
    },

    suggestionText: {
        color: COLORS.text,
        fontSize: FONT_SIZE.body
    }
});
