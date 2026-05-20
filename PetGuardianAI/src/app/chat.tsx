import React, { useState } from "react";
import { View, Text, TextInput, StyleSheet, ScrollView, TouchableOpacity } from "react-native";
import CustomButton from "../components/CustomButton";
import BackButton from "../components/BackButton";
import { COLORS } from "../constants/colors";

export default function Chat() {

    const [message, setMessage] = useState("");
    const [response, setResponse] = useState("");

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

        const question = message.toLowerCase();

        if (question.includes("vacina") || question.includes("vacinar")) {
            setResponse(
                "As vacinas ajudam a prevenir doenças graves. Filhotes costumam receber várias doses nos primeiros meses de vida e depois reforços periódicos."
            );
        } else if (
            question.includes("ração") ||
            question.includes("alimentação") ||
            question.includes("comida")
        ) {
            setResponse(
                "Uma alimentação equilibrada é fundamental. Utilize rações adequadas para idade, porte e necessidades específicas do pet."
            );
        } else if (question.includes("água") || question.includes("hidrat")) {
            setResponse(
                "Água limpa deve estar disponível o tempo todo. A hidratação ajuda no funcionamento dos órgãos e na saúde geral do pet."
            );
        } else if (
            question.includes("sem comer") ||
            question.includes("não come") ||
            question.includes("apetite")
        ) {
            setResponse(
                "Perda de apetite pode ocorrer por diversos motivos. Observe outros sintomas e procure orientação veterinária se persistir."
            );
        } else if (
            question.includes("vomitando") ||
            question.includes("vômito")
        ) {
            setResponse(
                "Vômitos ocasionais podem acontecer, mas episódios repetidos podem indicar problemas digestivos ou outras condições."
            );
        } else if (
            question.includes("veterinário") ||
            question.includes("consulta")
        ) {
            setResponse(
                "Consultas preventivas ajudam a identificar problemas antes que se tornem graves. A frequência pode variar conforme a idade do pet."
            );
        } else if (question.includes("banho")) {
            setResponse(
                "A frequência do banho depende da raça, tipo de pelo e rotina do pet. Banhos excessivos podem remover a proteção natural da pele."
            );
        } else if (
            question.includes("cansado") ||
            question.includes("sono")
        ) {
            setResponse(
                "Cansaço pode ser normal após atividades físicas, mas mudanças frequentes de comportamento merecem atenção."
            );
        } else {
            setResponse(
                "Não encontrei uma resposta específica. Recomendamos acompanhamento veterinário periódico."
            );
        }
        setMessage("");
    }

    return (
        <ScrollView contentContainerStyle={styles.container}>
            <BackButton />
            <Text style={styles.title}>
                Chat IA
            </Text>

            <Text style={styles.subtitle}>
                Tire dúvidas sobre cuidados com pets
            </Text>

            <TextInput
                style={styles.input}
                placeholder="Pergunte algo..."
                value={message}
                onChangeText={setMessage}
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
            <View style={styles.responseContainer}>
                <Text style={styles.responseTitle}>
                    Resposta:
                </Text>

                <Text style={styles.response}>
                    {response || "Faça uma pergunta para começar"}
                </Text>
            </View>

        </ScrollView>
    );
}

const styles = StyleSheet.create({
    container: {
        flexGrow: 1,
        padding: 20,
        backgroundColor: COLORS.background
    },

    title: {
        fontSize: 28,
        fontWeight: "bold",
        marginBottom: 5
    },

    subtitle: {
        color: COLORS.gray,
        marginBottom: 20
    },

    input: {
        backgroundColor: COLORS.white,
        padding: 15,
        borderRadius: 12,
        marginBottom: 15
    },

    suggestionTitle: {
        marginTop: 20,
        marginBottom: 10,
        fontWeight: "bold"
    },

    suggestionContainer: {
        marginBottom: 25
    },

    suggestionButton: {
        backgroundColor: COLORS.card,
        padding: 12,
        borderRadius: 10,
        marginBottom: 10
    },

    suggestionText: {
        color: COLORS.text
    },

    responseContainer: {
        backgroundColor: COLORS.card,
        padding: 20,
        borderRadius: 15
    },

    responseTitle: {
        fontWeight: "bold",
        marginBottom: 10
    },

    response: {
        fontSize: 16
    }
});