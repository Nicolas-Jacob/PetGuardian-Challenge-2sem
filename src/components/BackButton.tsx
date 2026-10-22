import { TouchableOpacity, Text, StyleSheet } from "react-native";
import { router } from "expo-router";
import { ThemeColors } from "../constants/colors";
import { useThemedStyles } from "../hooks/useThemedStyles";

export default function BackButton() {
    const styles = useThemedStyles(createStyles);

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

const createStyles = (colors: ThemeColors) => StyleSheet.create({
    button: {
        alignSelf: "flex-start",
        backgroundColor: colors.card,
        paddingVertical: 10,
        paddingHorizontal: 16,
        borderRadius: 12,
        marginTop: 35,
        marginBottom: 20,

        shadowColor: colors.shadow,
        shadowOffset: {
            width: 0,
            height: 2
        },
        shadowOpacity: 0.2,
        shadowRadius: 4,

        elevation: 4
    },
    text: {
        color: colors.text,
        fontWeight: "bold",
        fontSize: 15
    }
});