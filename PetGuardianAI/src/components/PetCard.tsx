import { View, Text, StyleSheet, TouchableOpacity } from "react-native";
import { Pet } from "../types";
import { COLORS } from "../constants/colors";

interface Props {
    pet: Pet;
    onPress?: () => void;
    onDelete?: () => void;
}

export default function PetCard({
    pet,
    onPress,
    onDelete
}: Props) {
    return (
        <TouchableOpacity
            style={styles.card}
            activeOpacity={0.85}
            onPress={onPress}
            disabled={!onPress}
        >
            <View style={styles.header}>
                <Text style={styles.title}>
                    🐾 {pet.name}
                </Text>

                {onDelete && (
                    <TouchableOpacity
                        style={styles.deleteButton}
                        onPress={onDelete}
                        hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
                    >
                        <Text style={styles.deleteText}>
                            🗑️
                        </Text>
                    </TouchableOpacity>
                )}
            </View>

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
        </TouchableOpacity>
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

    header: {
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
        marginBottom: 15
    },

    title: {
        fontSize: 22,
        fontWeight: "bold",
        color: COLORS.text
    },

    deleteButton: {
        padding: 4
    },

    deleteText: {
        fontSize: 18
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
