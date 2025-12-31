export interface StyleDefinition {
  id: string;
  name: string;
  usage: string;
  effect: string;
}

export const STYLE_DEFINITIONS: Record<string, StyleDefinition> = {
  "minimal_abstrait": {
    id: "minimal_abstrait",
    name: "Minimal Abstrait",
    usage: "Pour des citations sur la logique, les systèmes, les réseaux, la complexité ou la clarté.",
    effect: "Il projette une image d'intelligence, de structure et de modernité. C'est le style \"Cerveau\" qui aide à visualiser des concepts invisibles (le temps, les relations, l'ordre)."
  },
  "photo_cinematique": {
    id: "photo_cinematique",
    name: "Photo Cinématique",
    usage: "Pour des citations sur le voyage (intérieur ou réel), l'introspection, le quotidien ou la solitude.",
    effect: "Très immersif. Il donne l'impression que la citation est un dialogue de film. Il ancre la pensée dans la réalité physique sans pour autant être trop littéral."
  },
  "typographie_poster": {
    id: "typographie_poster",
    name: "Typographie Poster",
    usage: "Pour des punchlines courtes, des manifestos, des vérités percutantes ou des appels à l'action.",
    effect: "C'est le style le plus autoritaire. Ici, c'est la voix qui crie ou qui affirme avec confiance. L'impact est immédiat et très mémorisable."
  },
  "illustration_lineart": {
    id: "illustration_lineart",
    name: "Illustration Line Art",
    usage: "Pour des citations poétiques, métaphoriques, légères ou liées à la créativité.",
    effect: "Apporte une touche humaine et artisanale. C'est élégant et \"éditorial\" (type magazine The New Yorker). Parfait pour ne pas étouffer un texte délicat."
  },
  "noir_blanc_argentique": {
    id: "noir_blanc_argentique",
    name: "Noir & Blanc Argentique",
    usage: "Pour la sagesse classique, les citations historiques, la mélancolie ou les vérités intemporelles.",
    effect: "Le \"poids\" de l'histoire. Le grain et le contraste élevé ajoutent une couche de sérieux et de prestige. C'est le style de l'authenticité brute."
  },
  "bauhaus_suisse": {
    id: "bauhaus_suisse",
    name: "Bauhaus Suisse",
    usage: "Pour des citations sur le design, l'efficacité, le travail, l'objectivité ou l'ordre.",
    effect: "Très professionnel et rigoureux. Il élimine toute distraction pour se concentrer sur la structure de la pensée. C'est le style du \"moins c'est plus\"."
  },
  "aquarelle_lavis": {
    id: "aquarelle_lavis",
    name: "Aquarelle Lavis",
    usage: "Pour le bien-être, l'émotion, le rêve, la résilience ou la fluidité du changement.",
    effect: "Apaisant et organique. Il suggère que les idées ne sont pas figées mais qu'elles évoluent. Très efficace pour toucher la sensibilité du lecteur."
  },
  "papier_decoupe_layer": {
    id: "papier_decoupe_layer",
    name: "Papier Découpé (Layers)",
    usage: "Pour des citations sur la perspective, la construction, les étapes de la vie ou la profondeur.",
    effect: "Un aspect tactile et ludique qui donne du relief. Il suggère qu'il y a plusieurs couches de lecture dans la citation."
  },
  "risographie_retro": {
    id: "risographie_retro",
    name: "Risographie Rétro",
    usage: "Pour des idées disruptives, rebelles, artistiques ou liées à la culture urbaine.",
    effect: "Un look \"indépendant\" et vibrant. Il casse les codes du luxe traditionnel pour un luxe plus \"cool\" et branché. Idéal pour attirer l'œil sur les réseaux sociaux."
  },
  "encre_zen": {
    id: "encre_zen",
    name: "Encre Zen (Sumi-e)",
    usage: "Pour la méditation, le lâcher-prise, la nature, la philosophie orientale ou le silence.",
    effect: "Un sentiment de paix immédiat. Le geste unique du pinceau symbolise l'instant présent. C'est le style le plus puissant pour les citations courtes de type Haïku."
  },
  "brutalisme_prestige": {
    id: "brutalisme_prestige",
    name: "Brutalisme Prestige",
    usage: "Pour des citations sur l'ambition, le leadership, la force de caractère, la résilience ou l'architecture de vie.",
    effect: "Un sentiment de puissance inébranlable et de solidité. C'est un style \"poids lourd\" qui impose le respect par la noblesse des matériaux bruts (pierre, acier). Il projette une image de luxe moderne et radical."
  },
  "degrade_ethere": {
    id: "degrade_ethere",
    name: "Dégradé Éthéré",
    usage: "Pour des réflexions sur la conscience, l'énergie, l'intuition, la santé mentale ou la spiritualité moderne.",
    effect: "Très immersif et apaisant. L'absence de bords nets suggère l'infini et la fluidité de l'esprit. C'est le style de la clarté intérieure et de l'aura, très populaire dans les domaines du coaching et du bien-être premium."
  },
  "botanique_vintage": {
    id: "botanique_vintage",
    name: "Botanique Vintage",
    usage: "Pour des aphorismes sur la croissance, la patience, le temps qui passe, l'héritage ou les leçons de la nature.",
    effect: "Une autorité \"savante\" et nostalgique. On a l'impression d'ouvrir un carnet de notes d'un explorateur ou d'un naturaliste du siècle dernier. Cela donne un aspect très authentique, organique et précieux à la citation."
  },
  "morphisme_de_verre": {
    id: "morphisme_de_verre",
    name: "Morphisme de Verre (Glassmorphism)",
    usage: "Pour des sujets liés à l'innovation, la clarté, la transparence, la vision du futur ou la productivité.",
    effect: "Un look \"Apple\" extrêmement propre et haut de gamme. La transparence suggère que l'on voit à travers les choses, ce qui est parfait pour des citations sur la compréhension ou la perspective. C'est le style le plus \"Tech-Luxe\"."
  },
  "gravure_classique": {
    id: "gravure_classique",
    name: "Gravure Classique",
    usage: "Pour des préceptes moraux, la philosophie stoïcienne, les lois universelles ou les citations de grands auteurs classiques.",
    effect: "Une solennité dramatique. Le travail du trait rappelle l'imprimerie ancienne et les illustrations de livres rares. Cela confère une \"vérité historique\" et une profondeur artistique immédiate à n'importe quel texte."
  },
  "minimaliste_illustratif": {
    id: "minimaliste_illustratif",
    name: "Minimaliste Illustratif",
    usage: "C'est le style parfait pour des citations philosophiques ou les jeux de mots. Il brille lorsque le texte contient une métaphore forte (ex: parler de \"poids\", de \"lumière\", de \"racines\", de \"temps\").",
    effect: "Il génère un sentiment de clarté intellectuelle. L'image n'est pas là pour décorer, mais pour expliquer le texte. Cela donne un aspect \"affiche d'art de collection\" très haut de gamme et intemporel."
  },
  "flat_design_ludique": {
    id: "flat_design_ludique",
    name: "Flat Design Ludique",
    usage: "Pour des citations motivantes, optimistes ou pleines d'énergie. Pour des conseils de vie (lifestyle), des rappels de bienveillance ou de productivité. C'est le style idéal pour les réseaux sociaux type Instagram ou Pinterest, car il est extrêmement lisible même en petit format.",
    effect: "Accessibilité et Sympathie : Les formes rondes et les couleurs vives rendent le message \"amical\" et facile à absorber. Dynamisme : Contrairement au style McArthur qui est statique et sérieux, ce style est vivant. Le mélange de polices donne un rythme de lecture qui rend la citation moins formelle et plus proche du lecteur."
  }
};
