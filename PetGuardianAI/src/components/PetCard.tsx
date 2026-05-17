import { View, Text, StyleSheet } from "react-native";
import { Pet } from "../storage/storage";

interface Props {
    pet: Pet
}

export default function PetCard({
    pet
}: Props) {
    return (
        <View style={styles.card}>

            <Text style={styles.name}>
                {pet.name}
            </Text>

            <Text>
                Espécie:
                {pet.species}
            </Text>

            <Text>
                Idade:
                {pet.age}
            </Text>
        </View>
    )
}

const styles =
    StyleSheet.create({
        card: {
            backgroundColor:
                "#fff",
            padding: 20,
            borderRadius: 12,
            marginVertical: 15
        },
        name: {
            fontSize: 20,
            fontWeight: "bold"
        }
    })