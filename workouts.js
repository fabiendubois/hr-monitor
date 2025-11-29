const workouts = [
    {
        id: "recovery_30",
        name: "Récupération Active (30 min)",
        description: "Séance courte et facile pour faire tourner les jambes et favoriser la récupération.",
        steps: [
            { type: "warmup", duration: 600, power: 0.5, label: "Échauffement progressif" },
            { type: "steady", duration: 900, power: 0.55, label: "Endurance très légère" },
            { type: "cooldown", duration: 300, power: 0.45, label: "Retour au calme" }
        ]
    },
    {
        id: "endurance_60",
        name: "Endurance Fondamentale (60 min)",
        description: "La base de l'entraînement. Une heure à allure modérée (Zone 2) pour construire le fond.",
        steps: [
            { type: "warmup", duration: 600, power: 0.55, label: "Échauffement" },
            { type: "steady", duration: 1200, power: 0.65, label: "Endurance Z2" },
            { type: "steady", duration: 1200, power: 0.70, label: "Endurance Z2+" },
            { type: "cooldown", duration: 600, power: 0.5, label: "Retour au calme" }
        ]
    },
    {
        id: "tempo_90",
        name: "Tempo / Sweet Spot (90 min)",
        description: "Séance rythmée pour travailler la résistance aérobie. Idéal pour préparer des efforts longs.",
        steps: [
            { type: "warmup", duration: 900, power: 0.55, label: "Échauffement long" },
            { type: "steady", duration: 600, power: 0.75, label: "Tempo bas" },
            { type: "interval", duration: 900, power: 0.85, label: "Sweet Spot 1" },
            { type: "recovery", duration: 300, power: 0.55, label: "Récupération" },
            { type: "interval", duration: 900, power: 0.85, label: "Sweet Spot 2" },
            { type: "recovery", duration: 300, power: 0.55, label: "Récupération" },
            { type: "steady", duration: 900, power: 0.75, label: "Tempo bas" },
            { type: "cooldown", duration: 600, power: 0.5, label: "Retour au calme" }
        ]
    },
    {
        id: "long_120",
        name: "Sortie Longue (2h)",
        description: "Grosse séance d'endurance avec quelques variations d'allure pour casser la monotonie.",
        steps: [
            { type: "warmup", duration: 900, power: 0.55, label: "Mise en route" },
            { type: "steady", duration: 1800, power: 0.65, label: "Endurance de base" },
            { type: "steady", duration: 900, power: 0.75, label: "Tempo" },
            { type: "steady", duration: 1800, power: 0.65, label: "Endurance de base" },
            { type: "steady", duration: 900, power: 0.70, label: "Endurance soutenue" },
            { type: "cooldown", duration: 900, power: 0.5, label: "Retour au calme" }
        ]
    }
];
