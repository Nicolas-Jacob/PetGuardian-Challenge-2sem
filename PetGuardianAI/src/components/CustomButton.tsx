import { TouchableOpacity, Text, StyleSheet } from "react-native";
import { COLORS } from "../constants/colors";

interface Props {
    title: string;
    onPress: () => void;
}

export default function CustomButton({
    title,
    onPress
}: Props) {
    return (
        <TouchableOpacity style={styles.button} onPress={onPress}>
            <Text style={styles.text}>
                {title}
            </Text>
        </TouchableOpacity>
    )

}

const styles =
    StyleSheet.create({
        button: {
            backgroundColor:
            COLORS.primary,
            padding: 15,
            borderRadius: 12,
            marginVertical: 10
        },

        text: {
            color: "#fff",
            fontWeight: "bold",
            textAlign: "center"
        }
    })