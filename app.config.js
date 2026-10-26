const { execSync } = require("child_process");

const HASH_LENGTH = 7;

// stderr ignorado para um repositório ausente não poluir o terminal
function runGit(command) {
    return execSync(command, { stdio: ["ignore", "pipe", "ignore"] }).toString().trim();
}

function resolveCommitHash() {

    // 1. Hash do commit usado pelo EAS Build na nuvem
    const easHash = process.env.EAS_BUILD_GIT_COMMIT_HASH;
    if (easHash) return easHash.slice(0, HASH_LENGTH);

    // 2. Alternativa manual (ex.: CI sem acesso ao .git)
    const manualHash = process.env.APP_COMMIT_HASH;
    if (manualHash) return manualHash.slice(0, HASH_LENGTH);

    // 3. Git local; "-dirty" indica alterações ainda não commitadas
    let hash;
    try {
        hash = runGit(`git rev-parse --short=${HASH_LENGTH} HEAD`);
    } catch (e) {
        return "dev";
    }

    try {
        if (runGit("git status --porcelain")) hash += "-dirty";
    } catch (e) {
        // Sem como saber se há alterações: mantém só o hash
    }

    return hash;
}

module.exports = () => {
    const commitHash = resolveCommitHash();

    return {
        expo: {
            name: "PetGuardianAI",
            slug: "PetGuardianAI",
            version: "1.0.0",
            orientation: "portrait",
            scheme: "petguardianai",
            userInterfaceStyle: "automatic",
            android: {
                package: "com.petguardianai.app",
                versionCode: 1
            },
            plugins: [
                "expo-router",
                "expo-status-bar",
                "expo-notifications"
            ],
            experiments: {
                typedRoutes: true
            },
            extra: {
                commitHash,
                eas: {
                    projectId: "36970556-3e16-49d2-a247-09fbbcaa53d3"
                }
            }
        }
    };
};
