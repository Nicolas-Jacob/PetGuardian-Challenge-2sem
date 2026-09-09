import { TouchableOpacity, Text, ActivityIndicator, StyleSheet } from "react-native";
import { COLORS } from "../constants/colors";

interface Props {
    title: string;
    onPress: () => void;
    backgroundColor?: string;
    loading?: boolean;
    disabled?: boolean;
}

export default function CustomButton({
    title,
    onPress,
    backgroundColor = COLORS.primary,
    loading = false,
    disabled = false
}: Props) {

    return (
        <TouchableOpacity
            style={[
                styles.button,
                { backgroundColor },
                (disabled || loading) && styles.buttonDisabled
            ]}
            activeOpacity={0.8}
            onPress={onPress}
            disabled={disabled || loading}
        >
            {loading ? (
                <ActivityIndicator color={COLORS.white} />
            ) : (
                <Text style={styles.text}>
                    {title}
                </Text>
            )}
        </TouchableOpacity>
    );
}

const styles = StyleSheet.create({
    button: {
        paddingVertical: 16,
        borderRadius: 15,
        marginVertical: 8,

        shadowColor: COLORS.shadow,
        shadowOffset: {
            width: 0,
            height: 4
        },
        shadowOpacity: 0.3,
        shadowRadius: 5,
        elevation: 5
    },

    buttonDisabled: {
        opacity: 0.6
    },

    text: {
        color: COLORS.white,
        fontWeight: "bold",
        fontSize: 16,
        textAlign: "center"
    }
});