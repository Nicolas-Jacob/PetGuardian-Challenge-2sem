import { TextStyle } from "react-native";

export const FONT_SIZE = {
    caption: 12,
    body: 15,
    subtitle: 17,
    title: 24,
    largeTitle: 32
};

export const FONT_WEIGHT: Record<string, TextStyle["fontWeight"]> = {
    regular: "400",
    medium: "500",
    semibold: "600",
    bold: "700"
};

export const TYPOGRAPHY = {
    largeTitle: {
        fontSize: FONT_SIZE.largeTitle,
        fontWeight: FONT_WEIGHT.bold
    },

    title: {
        fontSize: FONT_SIZE.title,
        fontWeight: FONT_WEIGHT.bold
    },

    subtitle: {
        fontSize: FONT_SIZE.subtitle,
        fontWeight: FONT_WEIGHT.semibold
    },

    body: {
        fontSize: FONT_SIZE.body,
        fontWeight: FONT_WEIGHT.regular
    },

    caption: {
        fontSize: FONT_SIZE.caption,
        fontWeight: FONT_WEIGHT.regular
    }
} as const;
