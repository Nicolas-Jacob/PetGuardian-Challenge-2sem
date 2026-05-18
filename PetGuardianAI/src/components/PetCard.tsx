import { View, Text, StyleSheet } from "react-native";
import { Pet } from "../storage/storage";
import { COLORS } from "../constants/colors";

interface Props {
    pet: Pet;
}

export default function PetCard({
    pet
}: Props) {

    return (
        <View style={styles.card}>

            <Text style={styles.title}>
                🐾 {pet.name}
            </Text>

            <View style={styles.infoContainer}>
                <Text style={styles.label}>
                    Espécie:
                </Text>

                <Text style={styles.value}>
                    {pet.species}
                </Text>
            </View>

            <View style={styles.infoContainer}>
                <Text style={styles.label}>
                    Idade:
                </Text>

                <Text style={styles.value}>
                    {pet.age} anos
                </Text>
            </View>

        </View>
    );

}

const styles = StyleSheet.create({
    card: {
        backgroundColor: COLORS.card,
        padding: 20,
        borderRadius: 20,
        marginVertical: 20,

        shadowColor: COLORS.shadow,
        shadowOffset: {
            width: 0,
            height: 5
        },
        shadowOpacity: 0.2,
        shadowRadius: 5,

        elevation: 6
    },

    title: {
        fontSize: 22,
        fontWeight: "bold",
        marginBottom: 15,
        color: COLORS.text
    },

    infoContainer: {
        flexDirection: "row",
        marginBottom: 8
    },

    label: {
        fontWeight: "bold",
        marginRight: 5
    },

    value: {
        color: COLORS.gray
    }
});