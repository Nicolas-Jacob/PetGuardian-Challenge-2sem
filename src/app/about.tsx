import { View, Text, StyleSheet, ScrollView } from "react-native";
import Constants from "expo-constants";
import BackButton from "../components/BackButton";
import { ThemeColors } from "../constants/colors";
import { useThemedStyles } from "../hooks/useThemedStyles";
import { SPACING, RADIUS, SHADOWS } from "../constants/spacing";
import { FONT_SIZE, FONT_WEIGHT, TYPOGRAPHY } from "../constants/typography";

const MEMBERS = [
    { name: "Nícolas de Oliveira Jacob", rm: "564205", turma: "2TDPX" },
    { name: "João Victor Vendramento", rm: "563665", turma: "2TDSPV" },
    { name: "Gabriel Ambrósio Saraiva", rm: "566552", turma: "2TDSPV" },
    { name: "Vinicius Romaguera Cardozo", rm: "562308", turma: "2TDPX" },
    { name: "Yuri Fuzinatto Garzoli Barreto", rm: "561450", turma: "2TDSPX" }
];

export default function About() {

    const styles = useThemedStyles(createStyles);

    const version = Constants.expoConfig?.version ?? "—";
    const commitHash = Constants.expoConfig?.extra?.commitHash ?? "unknown";

    return (
        <ScrollView contentContainerStyle={styles.container}>

            <BackButton />

            <Text style={styles.title}>
                Sobre o App
            </Text>

            <View style={styles.card}>
                <Text style={styles.appName}>
                    🐾 PetGuardian AI
                </Text>

                <View style={styles.infoRow}>
                    <Text style={styles.infoLabel}>
                        Versão do app
                    </Text>

                    <Text style={styles.infoValue}>
                        {version}
                    </Text>
                </View>

                <View style={styles.infoRow}>
                    <Text style={styles.infoLabel}>
                        Versão do commit
                    </Text>

                    <Text style={[styles.infoValue, styles.hash]}>
                        {commitHash}
                    </Text>
                </View>
            </View>

            <Text style={styles.sectionTitle}>
                Descrição
            </Text>

            <View style={styles.card}>
                <Text style={styles.description}>
                    O PetGuardian AI ajuda tutores a organizar o acompanhamento preventivo da saúde de seus animais de estimação. É possível cadastrar pets, registrar e consultar o histórico clínico de cada um (vacinas, consultas, exames) e tirar dúvidas rápidas sobre cuidados básicos em um chat de orientação, com dados sincronizados na nuvem via Firebase.
                </Text>
            </View>

            <Text style={styles.sectionTitle}>
                Integrantes
            </Text>

            <View style={styles.card}>
                {MEMBERS.map((member, index) => (
                    <View
                        key={member.rm}
                        style={[
                            styles.member,
                            index < MEMBERS.length - 1 && styles.memberDivider
                        ]}
                    >
                        <Text style={styles.memberName}>
                            {member.name}
                        </Text>

                        <Text style={styles.memberInfo}>
                            RM: {member.rm} · Turma: {member.turma}
                        </Text>
                    </View>
                ))}
            </View>

        </ScrollView>
    );
}

const createStyles = (colors: ThemeColors) => StyleSheet.create({
    container: {
        padding: SPACING.lg,
        backgroundColor: colors.background,
        flexGrow: 1
    },

    title: {
        fontSize: TYPOGRAPHY.title.fontSize,
        fontWeight: TYPOGRAPHY.title.fontWeight,
        color: colors.text,
        marginBottom: SPACING.md
    },

    card: {
        backgroundColor: colors.card,
        padding: SPACING.md,
        borderRadius: RADIUS.lg,
        marginBottom: SPACING.sm,
        ...SHADOWS.subtle
    },

    appName: {
        fontSize: FONT_SIZE.subtitle,
        fontWeight: FONT_WEIGHT.bold,
        color: colors.primary,
        marginBottom: SPACING.sm
    },

    infoRow: {
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
        paddingVertical: SPACING.xs
    },

    infoLabel: {
        fontSize: FONT_SIZE.body,
        color: colors.textSecondary
    },

    infoValue: {
        fontSize: FONT_SIZE.body,
        fontWeight: FONT_WEIGHT.semibold,
        color: colors.text
    },

    hash: {
        fontFamily: "monospace",
        color: colors.primaryDark,
        backgroundColor: colors.primaryMuted,
        paddingVertical: 2,
        paddingHorizontal: SPACING.sm,
        borderRadius: RADIUS.sm,
        overflow: "hidden"
    },

    sectionTitle: {
        fontSize: FONT_SIZE.subtitle,
        fontWeight: FONT_WEIGHT.bold,
        color: colors.text,
        marginTop: SPACING.lg,
        marginBottom: SPACING.sm
    },

    description: {
        fontSize: FONT_SIZE.body,
        color: colors.text,
        lineHeight: 22
    },

    member: {
        paddingVertical: SPACING.sm
    },

    memberDivider: {
        borderBottomWidth: 1,
        borderBottomColor: colors.border
    },

    memberName: {
        fontSize: FONT_SIZE.body,
        fontWeight: FONT_WEIGHT.semibold,
        color: colors.text
    },

    memberInfo: {
        fontSize: FONT_SIZE.caption,
        color: colors.textSecondary,
        marginTop: 2
    }
});
