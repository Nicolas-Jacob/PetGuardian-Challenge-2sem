import { View, Text, StyleSheet } from "react-native";
import { router } from "expo-router";
import CustomButton from "../components/CustomButton";
import { COLORS } from "../constants/colors";

export default function Login() {
    return (
        <View style={styles.container}>
            <Text style={styles.logo}>
                PetGuardian AI
            </Text>
            <Text style={styles.subtitle}>
                Monitore a saúde do seu pet
            </Text>
            <CustomButton
                title="Entrar"
                onPress={() =>
                    router.push("/home")
                }
            />
        </View>
    )
}

const styles =
    StyleSheet.create({
        container: {
            flex: 1,
            justifyContent: "center",
            padding: 20,
            backgroundColor:
                COLORS.background
        },
        logo: {
            fontSize: 35,
            fontWeight: "bold",
            textAlign: "center",
            marginBottom: 10
        },
        subtitle: {
            textAlign: "center",
            marginBottom: 30,
            color: COLORS.gray
        }
    })