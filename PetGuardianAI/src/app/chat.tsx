import React, { useState } from "react";
import { View, Text, TextInput, StyleSheet } from "react-native";
import CustomButton from "../components/CustomButton";
import { COLORS } from "../constants/colors";

export default function Chat() {

    const [message, setMessage] = useState("");
    const [response, setResponse] = useState("");

    function handleSend() {

        if (!message.trim()) {
            return;
        }

        const question = message.toLowerCase();

        if (question.includes("vacina")) {
            setResponse(
                "Vacinas ajudam a prevenir doenças e devem estar em dia."
            );

        } else if (question.includes("ração")) {
            setResponse(
                "Uma alimentação equilibrada melhora a saúde do pet."
            );

        } else if (question.includes("água")) {
            setResponse(
                "Seu pet deve manter hidratação constante."
            );

        } else {
            setResponse(
                "Recomendamos acompanhamento veterinário periódico."
            );
        }
    }

    return (
        <View style={styles.container}>
            <Text style={styles.title}>
                Chat IA
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

            <View style={styles.responseContainer}>
                <Text style={styles.responseTitle}>
                    Resposta:
                </Text>

                <Text style={styles.response}>
                    {response}
                </Text>
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    container:{
        flex:1,
        padding:20,
        backgroundColor:COLORS.background
    },

    title:{
        fontSize:28,
        fontWeight:"bold",
        marginBottom:20
    },

    input:{
        backgroundColor:COLORS.white,
        padding:15,
        borderRadius:12
    },

    responseContainer:{
        marginTop:25,
        backgroundColor:COLORS.card,
        padding:20,
        borderRadius:15
    },

    responseTitle:{
        fontWeight:"bold",
        marginBottom:10
    },

    response:{
        fontSize:16
    }
});