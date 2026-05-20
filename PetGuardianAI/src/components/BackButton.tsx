import { TouchableOpacity, Text, StyleSheet } from "react-native";
import { router } from "expo-router";
import { COLORS } from "../constants/colors";

export default function BackButton() {
    return (

        <TouchableOpacity
            style={styles.button}
            activeOpacity={0.8}
            onPress={() => router.back()}
        >
            <Text style={styles.text}>
                ← Voltar
            </Text>
        </TouchableOpacity>
    );
}

const styles = StyleSheet.create({
    button: {
        alignSelf: "flex-start",
        backgroundColor: COLORS.card,
        paddingVertical: 10,
        paddingHorizontal: 16,
        borderRadius: 12,
        marginBottom: 20,

        shadowColor: COLORS.shadow,
        shadowOffset: {
            width: 0,
            height: 2
        },

        shadowOpacity: 0.2,
        shadowRadius: 4,

        elevation: 4
    },
    text: {
        color: COLORS.text,
        fontWeight: "bold",
        fontSize: 15
    }
});