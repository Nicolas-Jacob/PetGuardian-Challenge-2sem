import { View, Text, StyleSheet, TouchableOpacity } from "react-native";
import { Pet } from "../types";
import { COLORS } from "../constants/colors";
import { SPACING, RADIUS, SHADOWS } from "../constants/spacing";
import { FONT_SIZE, FONT_WEIGHT } from "../constants/typography";

interface Props {
    pet: Pet;
    onPress?: () => void;
    onDelete?: () => void;
}

function getSpeciesEmoji(species: string): string {
    const normalized = species.trim().toLowerCase();

    if (normalized.includes("cachorro") || normalized.includes("cão") || normalized.includes("cao") || normalized.includes("dog")) return "🐶";
    if (normalized.includes("gato") || normalized.includes("cat")) return "🐱";
    if (normalized.includes("pássaro") || normalized.includes("passaro") || normalized.includes("ave") || normalized.includes("bird")) return "🐦";
    if (normalized.includes("peixe") || normalized.includes("fish")) return "🐠";
    if (normalized.includes("coelho") || normalized.includes("rabbit")) return "🐰";
    if (normalized.includes("hamster")) return "🐹";
    if (normalized.includes("tartaruga") || normalized.includes("turtle")) return "🐢";
    if (normalized.includes("réptil") || normalized.includes("reptil") || normalized.includes("lagarto")) return "🦎";

    return "🐾";
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
                <View style={styles.iconWrapper}>
                    <Text style={styles.icon}>
                        {getSpeciesEmoji(pet.species)}
                    </Text>
                </View>

                <View style={styles.identity}>
                    <Text style={styles.name} numberOfLines={1}>
                        {pet.name}
                    </Text>

                    <Text style={styles.species} numberOfLines={1}>
                        {pet.species}
                    </Text>
                </View>

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

            <View style={styles.footer}>
                <View style={styles.ageBadge}>
                    <Text style={styles.ageBadgeText}>
                        {pet.age} {pet.age === 1 ? "ano" : "anos"}
                    </Text>
                </View>
            </View>
        </TouchableOpacity>
    );
}

const styles = StyleSheet.create({

    card: {
        backgroundColor: COLORS.card,
        padding: SPACING.lg,
        borderRadius: RADIUS.xl,
        marginVertical: SPACING.sm,
        ...SHADOWS.card
    },

    header: {
        flexDirection: "row",
        alignItems: "center"
    },

    iconWrapper: {
        width: 48,
        height: 48,
        borderRadius: RADIUS.full,
        backgroundColor: COLORS.primaryMuted,
        alignItems: "center",
        justifyContent: "center",
        marginRight: SPACING.md
    },

    icon: {
        fontSize: 24
    },

    identity: {
        flex: 1
    },

    name: {
        fontSize: FONT_SIZE.subtitle,
        fontWeight: FONT_WEIGHT.bold,
        color: COLORS.text
    },

    species: {
        fontSize: FONT_SIZE.body,
        color: COLORS.textSecondary,
        marginTop: 2
    },

    deleteButton: {
        padding: SPACING.xs
    },

    deleteText: {
        fontSize: 18
    },

    footer: {
        flexDirection: "row",
        marginTop: SPACING.md
    },

    ageBadge: {
        backgroundColor: COLORS.primaryMuted,
        paddingVertical: SPACING.xs,
        paddingHorizontal: SPACING.sm,
        borderRadius: RADIUS.sm
    },

    ageBadgeText: {
        fontSize: FONT_SIZE.caption,
        fontWeight: FONT_WEIGHT.semibold,
        color: COLORS.primary
    }
});
