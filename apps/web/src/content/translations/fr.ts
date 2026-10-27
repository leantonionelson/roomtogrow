import type { ContentTranslation } from "./types";

/**
 * French campaign copy. Working draft — to be reviewed by the client's
 * translators before launch. Programme and qualification names (Journey
 * to…, the CTH Diplomas) keep their official English names, as listed in
 * the LMS; add `title` / `fullTitle` per programme to localise them.
 */
export const fr: ContentTranslation = {
  strapline: {
    headline: "Développer son leadership à chaque étape de sa carrière. IHG University.",
    intro:
      "IHG University propose une formation au leadership pratique et flexible, ouverte à toutes et à tous, quel que soit votre poste actuel ou celui que vous visez.",
  },
  introBlock: {
    internalComms:
      "Nous sommes convaincus que les grands leaders ne naissent pas ainsi : ils se forment.",
    ihgUniversityExplanation:
      "Nos programmes de formation au leadership sont conçus pour développer vos compétences à chaque étape de votre carrière. Que vous preniez votre premier poste d’encadrement ou que vous souhaitiez développer la vision stratégique d’un cadre dirigeant, IHG University vous offre un parcours de formation clair, avec la possibilité d’obtenir des accréditations reconnues à l’extérieur.",
  },
  intentSelector: {
    question: "Que recherchez-vous aujourd’hui ?",
    microcopy: "Chaque parcours est unique. Commençons le vôtre.",
    options: {
      selfGrowth: "J’explore ma prochaine étape",
      developingTeam: "Je fais grandir mon équipe",
      learnAbout: "Je découvre Room to Grow",
    },
  },
  sellingPoints: [
    {
      title: "Apprenez à votre rythme",
      body: "Nos programmes Journey to… sont des formations en ligne en autonomie, accessibles à tout moment, partout et sans coût supplémentaire, pour développer vos compétences de leadership selon votre emploi du temps.",
    },
    {
      title: "Progressez grâce à des parcours clairs",
      body: "Du poste de superviseur à celui de cadre supérieur, chaque programme est conçu pour vous accompagner là où vous en êtes et vous mener là où vous voulez aller.",
    },
    {
      title: "Obtenez une qualification reconnue",
      body: "Nos programmes de Diploma accrédités vous offrent une qualification officielle, reconnue à l’international, qui démontre vos capacités de leadership.",
    },
    {
      title: "Des compétences à appliquer immédiatement",
      body: "Chaque module s’appuie sur de véritables enjeux de l’hôtellerie : du coaching de votre équipe à la conduite du changement, en passant par la vision commerciale et une communication percutante.",
    },
    {
      title: "Un accompagnement à chaque étape",
      body: "Grâce aux guides d’entretien avec le manager, aux outils de réflexion et à une communauté d’apprentissage mondiale, vous ne progressez jamais seul.",
    },
  ],
  managerGuidance: [
    "Ayez régulièrement des entretiens individuels sur les objectifs de carrière et le développement",
    "Utilisez les guides d’entretien pour managers inclus dans chaque programme",
    "Reconnaissez et célébrez les étapes de formation — terminer un module mérite d’être salué",
    "Laissez à votre équipe l’espace nécessaire pour appliquer ce qu’elle apprend sur le terrain.",
  ],
  leaderActionSteps: [
    "Partagez cette page avec un membre de l’équipe prêt pour sa prochaine étape",
    "Demandez « Qu’apprenez-vous en ce moment ? » lors de votre prochaine réunion d’équipe",
    "Encouragez vos collègues à intégrer un Diploma à leur plan de développement",
    "Prenez 20 minutes pour explorer ensemble les parcours de formation.",
  ],
  roles: {
    frontline: {
      label: "Collaborateur de terrain",
      overview:
        "Vous êtes le cœur de l’hôtel : vous offrez chaque jour des expériences mémorables aux clients. C’est ici que commencent les plus belles carrières de l’hôtellerie.",
      nextStep:
        "Superviseur – encadrer des services et prendre en charge les opérations au quotidien.",
      resources: [{ title: "Formation liée au poste" }],
    },
    supervisor: {
      label: "Superviseur",
      overview:
        "Vous guidez une équipe dans les opérations quotidiennes, fixez le niveau de service client et aidez vos collègues à progresser.",
      nextStep:
        "Manager – prendre en charge la performance, les objectifs et les résultats de l’équipe.",
    },
    manager: {
      label: "Manager",
      overview:
        "Vous fixez les objectifs, développez votre équipe et pilotez la performance de votre service. Vos décisions contribuent à façonner la culture et les résultats de votre service.",
      nextStep:
        "Cadre supérieur – diriger des équipes plus importantes et voir au-delà du quotidien.",
    },
    senior_manager: {
      label: "Cadre supérieur",
      overview:
        "Vous dirigez avec influence : vous pensez en termes commerciaux, inspirez votre équipe dans le changement et faites le lien entre les opérations quotidiennes et la réussite à long terme de l’hôtel.",
      nextStep:
        "Directeur général – faire grandir les équipes et l’activité pour un impact durable.",
    },
    general_manager: {
      label: "Directeur général",
      overview:
        "Vous définissez la vision, êtes responsable des résultats et bâtissez la culture qui rend votre hôtel exceptionnel. Votre leadership influence chaque membre de l’équipe et chaque expérience client.",
      nextStep:
        "Élargir votre impact au sein d’IHG : dans un hôtel plus grand, une autre marque, sur plusieurs établissements ou dans un rôle de direction régionale.",
      resources: [
        {
          title: "General Manager Programme",
          description:
            "un développement professionnel continu pour progresser dans votre poste actuel ou préparer le suivant.",
        },
      ],
    },
  },
  programmes: {
    journey_supervisor: {
      description:
        "Un programme de formation en ligne en autonomie pour acquérir les compétences essentielles et la confiance nécessaires pour encadrer une équipe pour la première fois.",
      suggestionLine: "parcours vers votre prochain poste.",
      whoItsFor:
        "Superviseurs nouveaux ou en devenir dans les hôtels IHG, qui accèdent pour la première fois à un poste d’encadrement.",
      outcomes:
        "Des outils pratiques pour gérer la performance, déléguer efficacement et diriger votre équipe avec assurance.",
      resources: [{ title: "Guide de formation des collaborateurs" }],
    },
    journey_manager: {
      description:
        "Un programme de formation en ligne en autonomie de 12 leçons couvrant les fondamentaux du management, le développement d’équipe et le coaching.",
      suggestionLine: "parcours vers votre prochain poste.",
      whoItsFor:
        "Managers nouveaux ou en progression dans les hôtels IHG, prêts à approfondir leurs compétences de leadership et à passer de l’exécution au leadership.",
      outcomes:
        "Des compétences pratiques en fixation d’objectifs, délégation, gestion de la performance, feedback, motivation et coaching.",
    },
    journey_senior_manager: {
      description:
        "Un programme de formation en ligne en autonomie en quatre modules pour développer votre intelligence émotionnelle, votre vision commerciale, vos compétences de coaching et votre capacité à fédérer et inspirer les équipes.",
      suggestionLine: "parcours vers votre prochain poste.",
      whoItsFor:
        "Managers expérimentés dans les hôtels IHG, prêts à assumer des responsabilités de leadership plus larges et à développer les compétences d’un cadre dirigeant.",
      outcomes:
        "Des compétences de leadership de haut niveau pour conduire le changement, prendre des décisions commerciales en confiance et créer confiance et alignement dans tout l’hôtel.",
    },
    journey_gm: {
      description:
        "Un programme de formation ciblé, conçu pour préparer les leaders au poste de direction le plus déterminant d’un hôtel.",
      suggestionLine:
        "votre parcours pour transformer un leadership stratégique en impact à l’échelle de l’hôtel.",
      whoItsFor:
        "Leaders expérimentés souhaitant se préparer à un poste de directeur général.",
      outcomes:
        "La confiance nécessaire pour diriger un hôtel en conciliant priorités commerciales, humaines et de marque, avec un impact à l’échelle de l’entreprise.",
    },
    hospitality_diploma_3: {
      description:
        "Un programme accrédité en formation mixte, composé de six modules virtuels en direct, menant à une qualification reconnue à l’international.",
      suggestionLine:
        "qualification accréditée par le CTH (Confederation of Tourism and Hospitality).",
      whoItsFor:
        "Superviseurs des hôtels IHG prêts à approfondir leurs compétences de leadership grâce à une formation structurée et animée.",
      outcomes:
        "Une qualification officielle accréditée couvrant six modules très concrets, notamment le coaching de la performance, l’optimisation de l’équipe, la collaboration, la conduite du changement, la fixation d’objectifs et le développement des talents.",
      recommendation:
        "Ce programme est idéal si vous occupez actuellement un poste d’encadrement et avez terminé, ou suivez, les outils de Journey to Supervisor. Il est préférable de le suivre lorsque vous encadrez une équipe, afin d’appliquer directement vos acquis dans votre poste.",
      faqs: [
        {
          question: "Suis-je prêt pour le Foundational Diploma ?",
          answer:
            "Être prêt pour le Foundational Diploma of Hospitality Leadership dépend de vos responsabilités actuelles et de votre capacité à vous engager dans le programme en parallèle de votre poste. Parlez franchement avec votre manager de vos points forts, de vos axes de progrès et de l’adéquation du calendrier avec les priorités de l’équipe — il peut vous aider à évaluer si vous êtes prêt.",
        },
        {
          question: "Quel est l’investissement en temps pour chaque module ?",
          answer:
            "Le Foundational Diploma est conçu pour être appliqué, pas précipité. Chaque module associe formation formelle et temps de mise en pratique pour ancrer les nouvelles compétences dans votre poste. Nous recommandons donc de prévoir environ 1 à 2 mois par module, pour appliquer vos acquis sur le terrain et installer des habitudes de leadership durables.",
        },
        {
          question: "Recevrai-je un certificat à la fin ?",
          answer:
            "Oui, vous recevrez un Level 3 Diploma of Hospitality Leadership délivré par la Confederation of Tourism and Hospitality.",
        },
      ],
      quote:
        "Ce programme a complètement changé ma façon d’aborder les échanges avec mon équipe. J’ai maintenant de vrais outils, pas seulement de l’intuition.",
      quoteAuthor: "Superviseure Housekeeping, Holiday Inn, Dubaï",
    },
    hospitality_diploma_4: {
      description:
        "Une qualification accréditée en formation mixte, composée de six modules virtuels en direct, qui permet aux managers d’approfondir les capacités de leadership qui font la performance d’un hôtel.",
      suggestionLine:
        "qualification accréditée par le CTH (Confederation of Tourism and Hospitality).",
      whoItsFor:
        "Managers des hôtels IHG prêts à formaliser leur développement en leadership et à obtenir une qualification reconnue.",
      outcomes:
        "Une qualification de niveau management reconnue à l’international et des compétences avancées en coaching de la performance, optimisation de l’équipe, conduite du changement, développement des talents, stratégies de collaboration et gestion des objectifs et des ressources – appliquées aux véritables enjeux du management hôtelier.",
      recommendation:
        "Ce programme s’adresse aux managers qui encadrent activement des équipes et souhaitent formaliser leur développement. Il est idéal en parallèle ou à la suite de Journey to Manager, en particulier si vous envisagez d’évoluer vers un poste de cadre supérieur.",
      faqs: [
        {
          question: "Suis-je prêt pour le Diploma ?",
          answer:
            "Être prêt pour le Diploma of Hospitality Leadership dépend de vos responsabilités actuelles et de votre capacité à vous engager dans le programme en parallèle de votre poste. Parlez franchement avec votre manager de vos points forts, de vos axes de progrès et de l’adéquation du calendrier avec les priorités de l’équipe – il peut vous aider à évaluer si vous êtes prêt.",
        },
        {
          question: "Quelle est la différence entre le Foundational Diploma et le Diploma ?",
          answer:
            "Le Foundational Diploma (niveau 3) présente les principaux outils du leadership, tandis que le Diploma (niveau 4) consiste à mettre ces outils en pratique dans votre rôle de manager et à gagner en confiance grâce à leur application concrète.",
        },
        {
          question: "Comment le programme est-il évalué ?",
          answer:
            "Vous participez à la session virtuelle animée par un formateur de chaque module et rédigez la partie correspondante de votre mémoire de Diploma. À la fin du programme, les six parties sont remises ensemble pour évaluation afin d’obtenir votre accréditation. Votre manager doit également constater l’application de ces nouvelles compétences dans votre poste au quotidien.",
        },
      ],
      quote:
        "Le Diploma m’a donné un cadre pour tout ce que je faisais déjà intuitivement. J’en suis ressorti plus confiant et plus réfléchi dans mon leadership.",
      quoteAuthor: "Duty Manager, Crowne Plaza, aéroport de Changi, Singapour",
    },
    hospitality_diploma_5: {
      description:
        "Un programme de formation accrédité permettant aux cadres dirigeants de l’hôtellerie de piloter des opérations hôtelières complexes et de générer une performance durable.",
      suggestionLine:
        "qualification accréditée par le CTH (Confederation of Tourism and Hospitality).",
      whoItsFor:
        "Chefs de service, cadres dirigeants et membres des comités de direction prêts à être mis à l’épreuve dans l’application de leurs outils de leadership en situation réelle. Vous devez avoir terminé Journey to Senior Manager.",
      outcomes:
        "Une qualification de leadership de haut niveau reconnue à l’international, qui développe des capacités avancées en pensée stratégique, leadership commercial et opérationnel, leadership à travers les autres, conduite du changement et influence des parties prenantes — appliquées aux défis complexes et concrets de la direction d’hôtels à grande échelle.",
      recommendation:
        "Si vous dirigez déjà à travers d’autres personnes et souhaitez affiner vos capacités stratégiques, commerciales et de leadership d’une manière reconnue et immédiatement utile dans votre poste, ce programme est probablement la bonne prochaine étape.",
      faqs: [
        {
          question: "Suis-je prêt à m’engager ?",
          answer:
            "Demandez-vous si vous êtes en mesure d’appliquer vos acquis en temps réel dans votre poste, et si votre manager vous soutient pour faire de ce développement une priorité. Il est tout aussi important de vous demander si vous êtes prêt à être challengé, à réfléchir à votre approche du leadership et à faire évoluer votre façon de travailler.",
        },
        {
          question: "Est-il aligné sur votre plan de développement personnel ?",
          answer:
            "Prenez le temps d’examiner comment ce programme s’inscrit dans vos objectifs et priorités de développement. Demandez-vous s’il soutient les capacités que vous et votre manager avez identifiées pour votre prochaine étape, et comment il complète les autres formations ou expériences déjà prévues dans votre plan de développement.",
        },
        {
          question: "Quel impact est-ce que je cherche à avoir ?",
          answer:
            "Profitez-en pour clarifier l’impact business plus large attendu de vous sur les 12 à 24 prochains mois. Vous pouvez aussi vous demander si vous vous préparez à un poste de directeur général ou à un rôle de direction équivalent, et comment ce programme vous aidera à être plus performant dans votre poste actuel.",
        },
      ],
    },
  },
  faqs: {
    journey_free: {
      question: "Les programmes Journey to… sont-ils vraiment gratuits ?",
      answer:
        "Oui. Tous nos programmes Journey to… sont inclus dans votre offre de formation de base IHG.",
    },
    journey_vs_diploma: {
      question:
        "Quelle est la différence entre les programmes Journey to… et les Diplomas ?",
      answer:
        "Nos programmes Journey to… sont des formations en ligne en autonomie qui vous permettent d’acquérir à votre rythme les compétences essentielles du leadership. Les Diplomas sont des qualifications reconnues à l’international, payantes, qui comprennent des sessions virtuelles en direct animées par un formateur ainsi que des évaluations.",
    },
    diploma_enrol: {
      question: "Comment m’inscrire à un programme de Diploma ?",
      answer:
        "Une fois que votre manager a accepté de prendre en charge les frais de certification et que vous pouvez vous inscrire au cours, vous pouvez vous inscrire sur IHG University :\n" +
        "[Foundational Diploma of Hospitality Leadership](https://mylearning.sumtotal.host/core/viewPlaylistDetails/81122)\n" +
        "[Diploma of Hospitality Leadership](https://mylearning.sumtotal.host/rcore/c/viewPlaylistDetails/138054)",
    },
    multiple_programmes: {
      question: "Puis-je suivre plusieurs programmes en même temps ?",
      answer:
        "Pour tirer le meilleur parti de votre parcours de formation, nous vous recommandons vivement de suivre un seul cours à la fois. Vous concentrer sur une seule expérience d’apprentissage vous permet d’en assimiler pleinement le contenu, d’approfondir votre compréhension et d’éviter de disperser votre attention entre plusieurs sujets. En prenant le temps d’apprendre, de réfléchir et d’appliquer vos nouvelles compétences dans votre poste avant de passer au cours suivant, vous obtiendrez de meilleurs résultats et un changement de comportement durable.",
    },
  },
};
