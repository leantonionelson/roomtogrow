import type { ContentTranslation } from "./types";

/**
 * Spanish campaign copy. Working draft — to be reviewed by the client's
 * translators before launch. Programme and qualification names (Journey
 * to…, the CTH Diplomas) keep their official English names, as listed in
 * the LMS; add `title` / `fullTitle` per programme to localise them.
 */
export const es: ContentTranslation = {
  strapline: {
    headline: "Formación en liderazgo para cada etapa de tu carrera. IHG University.",
    intro:
      "IHG University ofrece formación en liderazgo práctica y flexible, abierta a todas las personas, sin importar dónde estés ahora ni hacia dónde te diriges.",
  },
  introBlock: {
    internalComms:
      "Creemos que los grandes líderes no nacen: se forman.",
    ihgUniversityExplanation:
      "Nuestros programas de formación en liderazgo están diseñados para desarrollar tus habilidades en cada etapa de tu carrera. Tanto si asumes tu primer puesto de supervisión como si quieres desarrollar la visión estratégica de un líder sénior, IHG University te ofrece una ruta de aprendizaje clara, con la posibilidad de obtener acreditaciones reconocidas externamente.",
  },
  intentSelector: {
    question: "¿Qué buscas hoy?",
    microcopy: "Cada camino es diferente. Empecemos el tuyo.",
    options: {
      selfGrowth: "Estoy explorando mi siguiente paso",
      developingTeam: "Estoy desarrollando a mi equipo",
      learnAbout: "Quiero conocer Room to Grow",
    },
  },
  sellingPoints: [
    {
      title: "Aprende a tu ritmo",
      body: "Nuestros programas Journey to… son formación online autodirigida, disponible en cualquier momento, en cualquier lugar y sin coste adicional, para que desarrolles tus habilidades de liderazgo según tu horario.",
    },
    {
      title: "Avanza con rutas claras",
      body: "De supervisor a gerente sénior, cada programa está diseñado para acompañarte desde donde estás hasta donde quieres llegar.",
    },
    {
      title: "Obtén una cualificación reconocida",
      body: "Nuestros programas de Diploma acreditados te ofrecen una cualificación oficial, reconocida internacionalmente, que demuestra tu capacidad de liderazgo.",
    },
    {
      title: "Habilidades que puedes aplicar desde ya",
      body: "Cada módulo se basa en retos reales de la hostelería: desde dirigir y acompañar a tu equipo y gestionar el cambio hasta pensar con visión comercial y comunicar con impacto.",
    },
    {
      title: "Apoyo en cada paso",
      body: "Con guías de conversación con tu responsable, herramientas de reflexión y una comunidad de aprendizaje global, nunca te desarrollas en solitario.",
    },
  ],
  managerGuidance: [
    "Mantén conversaciones individuales periódicas sobre objetivos profesionales y desarrollo",
    "Utiliza las guías de conversación para responsables incluidas en cada programa",
    "Reconoce y celebra los hitos de aprendizaje: completar un módulo merece un reconocimiento",
    "Da espacio a tu equipo para aplicar en el trabajo lo que está aprendiendo.",
  ],
  leaderActionSteps: [
    "Comparte esta página con una persona de tu equipo que esté lista para su siguiente paso",
    "Pregunta «¿Qué estás aprendiendo ahora mismo?» en tu próxima reunión de equipo",
    "Anima a tus compañeros a incluir un Diploma en sus planes de desarrollo",
    "Reserva 20 minutos para explorar juntos las rutas de aprendizaje.",
  ],
  roles: {
    frontline: {
      label: "Colaborador de primera línea",
      overview:
        "Eres el corazón del hotel: ofreces cada día experiencias memorables a los huéspedes. Aquí empiezan las grandes carreras en hostelería.",
      nextStep:
        "Supervisor – dirigir turnos y asumir la responsabilidad de las operaciones diarias.",
      resources: [{ title: "Formación relacionada con el puesto" }],
    },
    supervisor: {
      label: "Supervisor",
      overview:
        "Guías a un equipo en las operaciones diarias, marcas el nivel de servicio al huésped y ayudas a tus compañeros a crecer.",
      nextStep:
        "Gerente – asumir la responsabilidad del rendimiento, los objetivos y los resultados del equipo.",
    },
    manager: {
      label: "Gerente",
      overview:
        "Fijas objetivos, desarrollas a tu equipo e impulsas el rendimiento de tu departamento. Tus decisiones ayudan a definir la cultura y los resultados de tu departamento.",
      nextStep:
        "Gerente sénior – dirigir equipos más grandes y pensar más allá del día a día.",
    },
    senior_manager: {
      label: "Gerente sénior",
      overview:
        "Lideras con influencia: piensas con visión comercial, inspiras a tu equipo en los cambios y conectas las operaciones diarias con el éxito a largo plazo del hotel.",
      nextStep:
        "Director general – hacer crecer los equipos y el negocio para lograr un impacto duradero.",
    },
    general_manager: {
      label: "Director general",
      overview:
        "Defines la visión, respondes de los resultados y construyes la cultura que hace excepcional a tu hotel. Tu liderazgo influye en cada miembro del equipo y en cada experiencia del huésped.",
      nextStep:
        "Ampliar tu impacto dentro de IHG, ya sea en un hotel más grande, en otra marca, en varios establecimientos o en un puesto de liderazgo regional.",
      resources: [
        {
          title: "General Manager Programme",
          description:
            "desarrollo profesional continuo para crecer en tu puesto actual o prepararte para uno nuevo.",
        },
      ],
    },
  },
  programmes: {
    journey_supervisor: {
      description:
        "Un programa de formación online autodirigido para desarrollar las habilidades esenciales y la confianza necesarias para dirigir un equipo por primera vez.",
      suggestionLine: "ruta hacia tu siguiente puesto.",
      whoItsFor:
        "Supervisores nuevos o futuros de los hoteles IHG que asumen un puesto de liderazgo por primera vez.",
      outcomes:
        "Herramientas prácticas para gestionar el rendimiento, delegar con eficacia y dirigir a tu equipo con confianza.",
      resources: [{ title: "Guía de aprendizaje para colaboradores" }],
    },
    journey_manager: {
      description:
        "Un programa de formación online autodirigido con 12 lecciones sobre fundamentos de la gestión, desarrollo de equipos y coaching.",
      suggestionLine: "ruta hacia tu siguiente puesto.",
      whoItsFor:
        "Gerentes nuevos o en desarrollo de los hoteles IHG, preparados para profundizar en sus habilidades de liderazgo y pasar de hacer a liderar.",
      outcomes:
        "Habilidades prácticas en definición de objetivos, delegación, gestión del rendimiento, feedback, motivación y coaching.",
    },
    journey_senior_manager: {
      description:
        "Un programa de formación online autodirigido con cuatro módulos para desarrollar la inteligencia emocional, la visión comercial, las habilidades de coaching y la capacidad de conectar con los equipos e inspirarlos.",
      suggestionLine: "ruta hacia tu siguiente puesto.",
      whoItsFor:
        "Gerentes con experiencia de los hoteles IHG, preparados para asumir una responsabilidad de liderazgo más amplia y desarrollar las habilidades de un líder sénior.",
      outcomes:
        "Habilidades de liderazgo sénior para liderar en el cambio, tomar decisiones comerciales con confianza y generar confianza y alineación en todo el hotel.",
    },
    journey_gm: {
      description:
        "Un programa de formación específico, diseñado para preparar a los líderes para el puesto de liderazgo más determinante de un hotel.",
      suggestionLine:
        "tu ruta para convertir el liderazgo estratégico en un impacto en todo el hotel.",
      whoItsFor:
        "Líderes con experiencia que quieren prepararse para un puesto de director general.",
      outcomes:
        "La confianza para dirigir un hotel equilibrando prioridades comerciales, de personas y de marca, con un impacto a nivel de empresa.",
    },
    hospitality_diploma_3: {
      description:
        "Un programa acreditado de formación combinada, con seis módulos virtuales en directo, que conduce a una cualificación reconocida internacionalmente.",
      suggestionLine:
        "cualificación acreditada por el CTH (Confederation of Tourism and Hospitality).",
      whoItsFor:
        "Supervisores de los hoteles IHG preparados para profundizar en sus habilidades de liderazgo mediante una formación estructurada y dinamizada.",
      outcomes:
        "Una cualificación oficial acreditada con seis módulos muy prácticos, entre ellos coaching del rendimiento, optimización del equipo, colaboración, gestión del cambio, definición de objetivos y desarrollo del talento.",
      recommendation:
        "Este programa es ideal si actualmente ocupas un puesto de supervisión y has completado, o estás trabajando, las herramientas de Journey to Supervisor. Conviene cursarlo cuando tienes un equipo a tu cargo, para aplicar lo aprendido directamente en tu puesto.",
      faqs: [
        {
          question: "¿Estoy preparado para el Foundational Diploma?",
          answer:
            "Estar preparado para el Foundational Diploma of Hospitality Leadership depende de tus responsabilidades actuales y de si puedes comprometerte con el programa junto a tu puesto. Habla abiertamente con tu responsable sobre tus fortalezas, tus áreas de mejora y si el momento encaja con las prioridades del equipo: puede ayudarte a valorar si estás preparado.",
        },
        {
          question: "¿Cuánto tiempo requiere cada módulo?",
          answer:
            "El Foundational Diploma está pensado para aplicarse, no para hacerse con prisas. Cada módulo combina formación formal con tiempo para practicar e integrar las nuevas habilidades en tu puesto. Por eso recomendamos dedicar aproximadamente 1-2 meses a cada módulo, para aplicar lo aprendido en el trabajo y crear hábitos de liderazgo sostenibles.",
        },
        {
          question: "¿Recibiré un certificado al terminar?",
          answer:
            "Sí, recibirás un Level 3 Diploma of Hospitality Leadership de la Confederation of Tourism and Hospitality.",
        },
      ],
      quote:
        "Este programa cambió por completo mi forma de afrontar las conversaciones con mi equipo. Ahora tengo herramientas reales, no solo intuición.",
      quoteAuthor: "Supervisora de pisos, Holiday Inn, Dubái",
    },
    hospitality_diploma_4: {
      description:
        "Una cualificación acreditada de formación combinada, con seis módulos virtuales en directo, que lleva a los gerentes a profundizar en las capacidades de liderazgo que impulsan el rendimiento del hotel.",
      suggestionLine:
        "cualificación acreditada por el CTH (Confederation of Tourism and Hospitality).",
      whoItsFor:
        "Gerentes de los hoteles IHG preparados para formalizar su desarrollo en liderazgo y obtener una cualificación reconocida.",
      outcomes:
        "Una cualificación de nivel de gestión reconocida internacionalmente y habilidades avanzadas en coaching del rendimiento, optimización del equipo, gestión del cambio, desarrollo del talento, estrategias de colaboración y gestión de objetivos y recursos, aplicadas a los retos reales de la gestión hotelera.",
      recommendation:
        "Este programa está diseñado para gerentes que dirigen equipos activamente y quieren formalizar su desarrollo. Funciona mejor junto con Journey to Manager o después de completarlo, y es ideal si te planteas dar el salto a la gerencia sénior.",
      faqs: [
        {
          question: "¿Estoy preparado para el Diploma?",
          answer:
            "Estar preparado para el Diploma of Hospitality Leadership depende de tus responsabilidades actuales y de si puedes comprometerte con el programa junto a tu puesto. Habla abiertamente con tu responsable sobre tus fortalezas, tus áreas de mejora y si el momento encaja con las prioridades del equipo: puede ayudarte a valorar si estás preparado.",
        },
        {
          question: "¿Qué diferencia hay entre el Foundational Diploma y el Diploma?",
          answer:
            "El Foundational Diploma (nivel 3) presenta las herramientas clave del liderazgo, mientras que el Diploma (nivel 4) consiste en poner esas herramientas en práctica en tu puesto de gestión y ganar confianza aplicándolas en situaciones reales.",
        },
        {
          question: "¿Cómo se evalúa el programa?",
          answer:
            "Asistirás a la sesión virtual con formador de cada módulo y completarás la sección correspondiente de tu ensayo del Diploma. Al final del programa, los seis ensayos se entregan juntos para su evaluación y la obtención de tu acreditación. Tu responsable también debe ver que aplicas estas nuevas habilidades en tu día a día.",
        },
      ],
      quote:
        "El Diploma me dio un marco para todo lo que ya hacía de forma intuitiva. Salí siendo un líder más seguro y más reflexivo.",
      quoteAuthor: "Duty Manager, Crowne Plaza, aeropuerto de Changi, Singapur",
    },
    hospitality_diploma_5: {
      description:
        "Un programa de formación acreditado que capacita a los líderes sénior de la hostelería para dirigir operaciones hoteleras complejas e impulsar un rendimiento sostenido del negocio.",
      suggestionLine:
        "cualificación acreditada por el CTH (Confederation of Tourism and Hospitality).",
      whoItsFor:
        "Jefes de departamento, líderes sénior y miembros de comités de dirección preparados para poner a prueba la aplicación de sus herramientas de liderazgo en entornos hoteleros reales. Debes haber completado Journey to Senior Manager.",
      outcomes:
        "Una cualificación de liderazgo sénior reconocida internacionalmente, que desarrolla capacidades avanzadas en pensamiento estratégico, liderazgo comercial y operativo, liderar a través de otros, impulsar el cambio e influir en los grupos de interés, aplicadas a los retos complejos y reales de dirigir hoteles a gran escala.",
      recommendation:
        "Si ya lideras a través de otras personas y quieres perfeccionar tu capacidad estratégica, comercial y de liderazgo de una forma reconocida y de aplicación inmediata en tu puesto, es probable que este programa sea el siguiente paso adecuado.",
      faqs: [
        {
          question: "¿Estoy preparado para comprometerme?",
          answer:
            "Piensa si estás en condiciones de aplicar lo aprendido en tiempo real en tu puesto y si cuentas con el apoyo de tu responsable para priorizar este desarrollo. También es importante reflexionar sobre si estás preparado para que te pongan a prueba, para revisar tu forma de liderar y para ir más allá en tu manera de trabajar.",
        },
        {
          question: "¿Está alineado con tu plan de desarrollo personal?",
          answer:
            "Tómate tiempo para valorar cómo encaja este programa con tus objetivos y prioridades de desarrollo actuales. Reflexiona sobre si refuerza las capacidades que tú y tu responsable habéis identificado para tu siguiente paso, y cómo complementa otros aprendizajes o experiencias que ya forman parte de tu plan de desarrollo.",
        },
        {
          question: "¿Qué impacto quiero lograr?",
          answer:
            "Aprovecha para aclarar el impacto de negocio más amplio que se espera de ti en los próximos 12-24 meses. También puedes plantearte si te estás preparando para un puesto de director general o un puesto de liderazgo sénior equivalente, y cómo este programa te ayudará a rendir mejor en tu puesto actual.",
        },
      ],
    },
  },
  faqs: {
    journey_free: {
      question: "¿Los programas Journey to… son realmente gratuitos?",
      answer:
        "Sí. Todos nuestros programas Journey to… están incluidos en tu paquete de formación básica de IHG.",
    },
    journey_vs_diploma: {
      question: "¿Qué diferencia hay entre los programas Journey to… y los Diplomas?",
      answer:
        "Nuestros programas Journey to… son cursos de formación online autodirigidos que te permiten desarrollar a tu ritmo las habilidades esenciales de liderazgo. Los Diplomas son cualificaciones reconocidas internacionalmente que tienen un coste e incluyen sesiones virtuales en directo con formador y evaluaciones.",
    },
    diploma_enrol: {
      question: "¿Cómo me inscribo en un programa de Diploma?",
      answer:
        "Cuando tu responsable acepte pagar la tasa de certificación y puedas inscribirte en el curso, podrás registrarte en IHG University:\n" +
        "[Foundational Diploma of Hospitality Leadership](https://mylearning.sumtotal.host/core/viewPlaylistDetails/81122)\n" +
        "[Diploma of Hospitality Leadership](https://mylearning.sumtotal.host/rcore/c/viewPlaylistDetails/138054)",
    },
    multiple_programmes: {
      question: "¿Puedo hacer más de un programa a la vez?",
      answer:
        "Para sacar el máximo partido a tu formación, te recomendamos encarecidamente completar un curso cada vez. Centrarte en una sola experiencia de aprendizaje te permite asimilar por completo el contenido, comprenderlo con mayor profundidad y evitar dividir tu atención entre varios temas. Si te tomas el tiempo de aprender, reflexionar y aplicar las nuevas habilidades en tu puesto antes de pasar al siguiente curso, obtendrás mejores resultados y un cambio de comportamiento duradero.",
    },
  },
};
