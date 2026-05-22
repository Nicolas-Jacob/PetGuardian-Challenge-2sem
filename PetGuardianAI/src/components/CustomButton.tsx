import { TouchableOpacity, Text, StyleSheet } from "react-native";
import { COLORS } from "../constants/colors";

interface Props {
    title: string;
    onPress: () => void;
    backgroundColor?: string;
}

export default function CustomButton({
    title,
    onPress,
    backgroundColor = COLORS.primary
}: Props) {

    return (
        <TouchableOpacity
            style={[
                styles.button,
                { backgroundColor }
            ]}
            activeOpacity={0.8}
            onPress={onPress}
        >
            <Text style={styles.text}>
                {title}
            </Text>
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

    text: {
        color: COLORS.white,
        fontWeight: "bold",
        fontSize: 16,
        textAlign: "center"
    }
});