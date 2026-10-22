const { execSync } = require("child_process");

module.exports = () => {
    let commitHash = "unknown";

    try {
        commitHash = execSync("git rev-parse --short HEAD").toString().trim();
    } catch (e) {
        commitHash = "dev";
    }

    return {
        expo: {
            name: "PetGuardianAI",
            slug: "PetGuardianAI",
            version: "1.0.0",
            orientation: "portrait",
            scheme: "petguardianai",
            userInterfaceStyle: "automatic",
            plugins: [
                "expo-router",
                "expo-status-bar"
            ],
            experiments: {
                typedRoutes: true
            },
            extra: {
                commitHash
            }
        }
    };
};
