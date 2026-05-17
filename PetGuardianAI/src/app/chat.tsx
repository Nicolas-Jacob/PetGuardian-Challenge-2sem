import {
    View,
    Text,
    TextInput,
    StyleSheet
} from "react-native";

import {
    useState
} from "react";

import CustomButton from "../components/CustomButton";

export default function Chat() {
    const [
        message,
        setMessage
    ] = useState("");

    const [
        response,
        setResponse
    ] = useState("");

    function handleSend() {
        if (!message)
            return;

        setResponse(
            "Seu pet precisa manter vacinação e consultas em dia."
        );
    }

    return (
        <View style={styles.container}>
            <Text style={styles.title}>
                Chat IA
            </Text>

            <TextInput style={styles.input} placeholder="Digite uma pergunta" value={message} onChangeText={setMessage}/>

            <CustomButton title="Enviar" onPress={handleSend}/>

            <Text style={styles.response}>
                {response}
            </Text>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 20
    },

    title: {
        fontSize: 28,
        fontWeight: "bold",
        marginBottom: 20
    },

    input: {
        backgroundColor: "#fff",
        padding: 15,
        borderRadius: 10,
        marginBottom: 15
    },

    response: {
        marginTop: 20,
        fontWeight: "bold"
    }
});