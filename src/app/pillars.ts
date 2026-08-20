import type { Difficulty, PillarKey } from './types'

export interface MoveTemplate {
  title: string
  intent: string
  steps: string[]
  minutes: number
  difficulty: Difficulty
}

export interface Pillar {
  key: PillarKey
  name: string
  blurb: string
  defaultGoal: string
  color: string
  templates: MoveTemplate[]
}

export const PILLARS: Record<PillarKey, Pillar> = {
  cuerpo: {
    key: 'cuerpo',
    name: 'Cuerpo',
    blurb: 'Fuerza, composición, energía diaria.',
    defaultGoal: 'Alcanzar 12% de grasa corporal / 75 kg',
    color: 'var(--branch-cuerpo)',
    templates: [
      {
        title: 'Entrenamiento de fuerza · Upper Body',
        intent: 'La fuerza del tren superior es lo que más nota tu composición.',
        steps: [
          'Calienta 6 minutos: remo suave y movilidad de hombro.',
          'Press banca 4×6 · Remo con barra 4×8.',
          'Press militar 3×8 · Dominadas 3× al fallo.',
          'Anota las cargas antes de salir del gimnasio.',
        ],
        minutes: 45,
        difficulty: 'alta',
      },
      {
        title: 'Entrenamiento de fuerza · Lower Body',
        intent: 'Piernas dos veces por semana sostiene todo el gasto calórico.',
        steps: [
          'Sentadilla 5×5 con 2 minutos de descanso.',
          'Peso muerto rumano 4×8.',
          'Zancadas 3×10 por pierna.',
          'Estira cadera 5 minutos al terminar.',
        ],
        minutes: 50,
        difficulty: 'alta',
      },
      {
        title: 'Cardio en zona 2',
        intent: 'Base aeróbica: quema sin robarte recuperación.',
        steps: [
          'Elige cinta, bici o calle.',
          '35 minutos manteniendo conversación posible.',
          'Pulsaciones entre 60% y 70% del máximo.',
        ],
        minutes: 35,
        difficulty: 'media',
      },
      {
        title: 'Cocina para tres días',
        intent: 'Lo que no está cocinado se decide con hambre.',
        steps: [
          'Compra proteína, verdura y carbohidrato para 6 comidas.',
          'Cocina todo en una sola tanda.',
          'Reparte en táperes y etiquétalos.',
        ],
        minutes: 40,
        difficulty: 'media',
      },
      {
        title: 'Cierra el día a las 22:30',
        intent: 'El sueño es el único suplemento que funciona siempre.',
        steps: [
          'Pantallas fuera del dormitorio a las 22:30.',
          'Luz cálida y baja durante la última hora.',
          'Misma hora de despertar, también el finde.',
        ],
        minutes: 15,
        difficulty: 'baja',
      },
      {
        title: 'Registra peso y medidas',
        intent: 'Sin dato no hay ajuste; solo sensación.',
        steps: [
          'Pésate en ayunas, siempre igual.',
          'Mide cintura a la altura del ombligo.',
          'Apúntalo. No interpretes un solo día.',
        ],
        minutes: 10,
        difficulty: 'baja',
      },
      {
        title: 'Movilidad y core',
        intent: 'Lo que te mantiene entrenando el mes que viene.',
        steps: [
          'Cadera y tobillo: 8 minutos.',
          'Plancha 3×45s · Hollow 3×30s.',
          'Respiración nasal en cada serie.',
        ],
        minutes: 20,
        difficulty: 'baja',
      },
      {
        title: 'Entrenamiento de fuerza · Full Body',
        intent: 'Sesión comodín para la semana que se tuerce.',
        steps: [
          'Sentadilla 4×6 · Press banca 4×6.',
          'Remo 4×8 · Press militar 3×8.',
          'Termina con 10 minutos de caminata inclinada.',
        ],
        minutes: 55,
        difficulty: 'alta',
      },
      {
        title: '10.000 pasos, sin excusas',
        intent: 'El gasto que no notas es el que más suma al mes.',
        steps: [
          'Reparte: mañana, comida y tarde.',
          'Una llamada de trabajo, caminando.',
          'Comprueba el contador antes de cenar.',
        ],
        minutes: 60,
        difficulty: 'baja',
      },
      {
        title: 'Semana sin alcohol',
        intent: 'Decidirlo por adelantado te ahorra siete decisiones.',
        steps: [
          'Decide ahora, no en el bar.',
          'Avisa a quien vayas a ver esta semana.',
          'Ten alternativa elegida: agua con gas y lima.',
        ],
        minutes: 10,
        difficulty: 'media',
      },
      {
        title: 'Revisa proteína del día',
        intent: 'El déficit funciona si la proteína no baja.',
        steps: [
          'Objetivo: 1,8 g por kilo de peso.',
          'Reparte en 3 o 4 tomas.',
          'Ajusta la cena con lo que falte.',
        ],
        minutes: 15,
        difficulty: 'baja',
      },
      {
        title: 'Intervalos duros',
        intent: 'Poco tiempo, mucha señal metabólica.',
        steps: [
          'Calienta 8 minutos.',
          '8 × 40s fuerte / 80s suave.',
          'Enfría 5 minutos caminando.',
        ],
        minutes: 25,
        difficulty: 'alta',
      },
    ],
  },

  relaciones: {
    key: 'relaciones',
    name: 'Relaciones',
    blurb: 'Vínculos, valentía social, presencia.',
    defaultGoal: 'Pedirle una cita a una chica que me parezca verdaderamente guapa',
    color: 'var(--branch-relaciones)',
    templates: [
      {
        title: 'Acércate y rompe el hielo',
        intent: 'La incomodidad de treinta segundos es todo el precio.',
        steps: [
          'Elige un sitio donde ya vayas: café, gimnasio, clase.',
          'Comenta algo del contexto, no un halago físico.',
          'Sostén la conversación dos minutos y despídete tú.',
        ],
        minutes: 15,
        difficulty: 'alta',
      },
      {
        title: 'Pide la cita, en concreto',
        intent: 'Una propuesta vaga es una negativa lenta.',
        steps: [
          'Propón sitio, día y hora exactos.',
          'Hazlo en una frase, sin justificarte.',
          'Acepta el no con la misma calma que el sí.',
        ],
        minutes: 20,
        difficulty: 'alta',
      },
      {
        title: 'Escribe a alguien que valoras',
        intent: 'Los vínculos se oxidan en silencio.',
        steps: [
          'Piensa en alguien con quien hace un mes que no hablas.',
          'Escribe algo concreto, no "¿qué tal?".',
          'Propón verse o llamar.',
        ],
        minutes: 10,
        difficulty: 'baja',
      },
      {
        title: 'Propón un plan concreto',
        intent: 'La amistad adulta necesita calendario.',
        steps: [
          'Elige a una persona y un plan real.',
          'Da dos fechas posibles.',
          'Ciérralo antes de colgar.',
        ],
        minutes: 15,
        difficulty: 'media',
      },
      {
        title: 'Sal sin plan cerrado',
        intent: 'Nada nuevo ocurre en la ruta de siempre.',
        steps: [
          'Barrio o local en el que no hayas estado.',
          'Ve pronto, cuando aún se puede hablar.',
          'Habla con al menos una persona nueva.',
        ],
        minutes: 90,
        difficulty: 'media',
      },
      {
        title: 'La conversación que evitas',
        intent: 'Lo no dicho se cobra intereses.',
        steps: [
          'Escribe en una línea qué necesitas decir.',
          'Dilo en persona o por teléfono, no por texto.',
          'Habla de lo que sientes, no de lo que hizo.',
        ],
        minutes: 30,
        difficulty: 'alta',
      },
      {
        title: 'Escucha sin resolver',
        intent: 'Casi nadie quiere tu solución; quieren tu atención.',
        steps: [
          'Veinte minutos, móvil fuera de la mesa.',
          'Pregunta dos veces antes de opinar una.',
          'Resume lo que has entendido en voz alta.',
        ],
        minutes: 20,
        difficulty: 'media',
      },
      {
        title: 'Tu círculo, por escrito',
        intent: 'Lo que no eliges, lo elige la inercia.',
        steps: [
          'Apunta 3 personas con las que quieres profundizar.',
          'Apunta 1 con la que quieres menos contacto.',
          'Da un paso hoy con la primera de la lista.',
        ],
        minutes: 10,
        difficulty: 'baja',
      },
      {
        title: 'Llama, no escribas',
        intent: 'La voz hace en tres minutos lo que el chat no hace en tres días.',
        steps: [
          'Elige a alguien de la lista.',
          'Llama sin avisar por texto antes.',
          'Diez minutos bastan.',
        ],
        minutes: 15,
        difficulty: 'baja',
      },
      {
        title: 'Preséntate a un desconocido',
        intent: 'Entrenar el músculo social hace fácil lo que hoy cuesta.',
        steps: [
          'Gimnasio, cola, ascensor: da igual.',
          'Nombre y una pregunta abierta.',
          'Sal antes de que se vuelva forzado.',
        ],
        minutes: 10,
        difficulty: 'alta',
      },
      {
        title: 'Queda cara a cara',
        intent: 'La pantalla no cuenta como haber visto a alguien.',
        steps: [
          'Una persona, dos horas, sin prisa.',
          'Sin móvil sobre la mesa.',
          'Cierra la siguiente antes de despediros.',
        ],
        minutes: 120,
        difficulty: 'media',
      },
      {
        title: 'Cierra lo que te resta',
        intent: 'Guardar sitio a quien te agota es quitárselo a quien te suma.',
        steps: [
          'Identifica el vínculo que te deja peor de lo que te encuentra.',
          'Decide: hablarlo o alejarte.',
          'Hazlo esta semana, sin discurso.',
        ],
        minutes: 25,
        difficulty: 'alta',
      },
    ],
  },

  proyecto: {
    key: 'proyecto',
    name: 'Proyecto',
    blurb: 'Construir, lanzar, cobrar.',
    defaultGoal: 'Lanzar Derwatt',
    color: 'var(--branch-proyecto)',
    templates: [
      {
        title: 'Define el siguiente hito',
        intent: 'Sin un hito con fecha, todo es mantenimiento.',
        steps: [
          'Escribe el hito en una frase verificable.',
          'Ponle fecha a 14 días vista.',
          'Elimina de la lista lo que no lo acerque.',
        ],
        minutes: 30,
        difficulty: 'media',
      },
      {
        title: 'Bloque profundo de dos horas',
        intent: 'El proyecto avanza en bloques, no en ratos.',
        steps: [
          'Una sola tarea elegida antes de empezar.',
          'Móvil en otra habitación, notificaciones fuera.',
          'Dos horas seguidas. Nada más en la agenda.',
        ],
        minutes: 120,
        difficulty: 'alta',
      },
      {
        title: 'Habla con un usuario',
        intent: 'Media hora de escucha vale por una semana de suposiciones.',
        steps: [
          'Contacta a alguien que ya usa algo parecido.',
          'Pregunta por su última vez, no por su opinión.',
          'Anota literalmente las tres frases que más duelan.',
        ],
        minutes: 30,
        difficulty: 'media',
      },
      {
        title: 'Envía la propuesta',
        intent: 'La versión enviada gana a la versión perfecta.',
        steps: [
          'Alcance, precio y fecha en una página.',
          'Revísala una vez. Solo una.',
          'Envíala hoy, antes de las 18:00.',
        ],
        minutes: 25,
        difficulty: 'alta',
      },
      {
        title: 'Publica en abierto',
        intent: 'Construir a la vista crea la presión buena.',
        steps: [
          'Elige un avance real de la semana.',
          'Cuéntalo con una imagen o un vídeo corto.',
          'Publícalo aunque no esté redondo.',
        ],
        minutes: 45,
        difficulty: 'media',
      },
      {
        title: 'Corta una funcionalidad',
        intent: 'Lanzar es, sobre todo, decidir qué no entra.',
        steps: [
          'Lista lo que falta para el hito.',
          'Marca lo que puede esperar a la v2.',
          'Bórralo del tablero, no lo aparques.',
        ],
        minutes: 20,
        difficulty: 'media',
      },
      {
        title: 'Números de la semana',
        intent: 'Lo que no se mide se cuenta como uno quiere.',
        steps: [
          'Usuarios, ingresos, conversaciones.',
          'Compara con la semana anterior.',
          'Una conclusión, una acción.',
        ],
        minutes: 20,
        difficulty: 'baja',
      },
      {
        title: 'Prepara la demo',
        intent: 'Enseñarlo obliga a que funcione de verdad.',
        steps: [
          'Guion de tres minutos.',
          'Recorrido sin rodeos ni disculpas.',
          'Ensáyalo una vez en voz alta.',
        ],
        minutes: 60,
        difficulty: 'alta',
      },
      {
        title: 'Escribe la nota de lanzamiento',
        intent: 'Si no sabes contarlo, aún no está terminado.',
        steps: [
          'Para quién es y qué le quita de encima.',
          'Una frase de apertura que aguante sola.',
          'Guárdala; la reescribirás al lanzar.',
        ],
        minutes: 40,
        difficulty: 'media',
      },
      {
        title: 'Cinco contactos en frío',
        intent: 'La distribución es parte del producto.',
        steps: [
          'Cinco personas concretas, con nombre.',
          'Un mensaje corto y específico a cada una.',
          'Registra respuestas y haz seguimiento en 3 días.',
        ],
        minutes: 45,
        difficulty: 'alta',
      },
      {
        title: 'Arregla la mayor fricción',
        intent: 'El punto donde la gente abandona es el único bug urgente.',
        steps: [
          'Mira dónde se cae la gente.',
          'Arregla ese punto y solo ese.',
          'Compruébalo tú mismo de principio a fin.',
        ],
        minutes: 60,
        difficulty: 'media',
      },
      {
        title: 'Cierra el día con algo enviado',
        intent: 'Un día sin entregar es un día de intenciones.',
        steps: [
          'Antes de cerrar, deja algo publicado o enviado.',
          'Pequeño cuenta. Invisible no.',
          'Anota lo primero de mañana.',
        ],
        minutes: 15,
        difficulty: 'baja',
      },
    ],
  },

  mente: {
    key: 'mente',
    name: 'Mente',
    blurb: 'Claridad, atención, calma.',
    defaultGoal: 'Recuperar mi capacidad de concentración profunda',
    color: 'var(--branch-mente)',
    templates: [
      {
        title: 'Diario: qué me pesa hoy',
        intent: 'Lo que se escribe deja de dar vueltas.',
        steps: [
          'Quince minutos a mano, sin releer.',
          'Empieza por lo que estás evitando.',
          'Cierra con una acción de mañana.',
        ],
        minutes: 15,
        difficulty: 'baja',
      },
      {
        title: 'Lectura profunda',
        intent: 'La atención es un músculo y se entrena leyendo largo.',
        steps: [
          'Treinta minutos, papel si puedes.',
          'Móvil en otra habitación.',
          'Subraya tres ideas y resúmelas en dos líneas.',
        ],
        minutes: 30,
        difficulty: 'media',
      },
      {
        title: 'Quince minutos de silencio',
        intent: 'No es relajarse: es entrenar volver.',
        steps: [
          'Siéntate, temporizador a 15 minutos.',
          'Respiración nasal, cuenta hasta cuatro.',
          'Cuando te vayas, vuelve. Esa es la práctica.',
        ],
        minutes: 15,
        difficulty: 'baja',
      },
      {
        title: 'Día sin scroll',
        intent: 'Un día limpio te enseña cuánto ruido era opcional.',
        steps: [
          'Desinstala las dos apps que más te llevan.',
          'Deja el móvil en gris todo el día.',
          'Anota a qué hora aparecen las ganas.',
        ],
        minutes: 20,
        difficulty: 'alta',
      },
      {
        title: 'Paseo sin auriculares',
        intent: 'Las mejores decisiones aparecen sin banda sonora.',
        steps: [
          'Cuarenta minutos, sin destino.',
          'Sin podcast, sin música, sin llamadas.',
          'Al volver, escribe lo que se te ocurrió.',
        ],
        minutes: 40,
        difficulty: 'baja',
      },
      {
        title: 'Tus tres no negociables',
        intent: 'Decidir una vez ahorra decidir cien.',
        steps: [
          'Escribe tres cosas que harás pase lo que pase.',
          'Que sean pequeñas y verificables.',
          'Ponlas donde las veas al despertar.',
        ],
        minutes: 20,
        difficulty: 'media',
      },
      {
        title: 'Revisa tu semana en frío',
        intent: 'Juzgar el martes desde el domingo cambia el veredicto.',
        steps: [
          'Qué funcionó, qué no, qué cambio harás.',
          'Sin castigarte y sin excusarte.',
          'Una sola decisión para la semana que entra.',
        ],
        minutes: 25,
        difficulty: 'media',
      },
      {
        title: 'Aprende algo que no rinde',
        intent: 'La curiosidad sin retorno también construye.',
        steps: [
          'Un tema que te dé igual para el trabajo.',
          'Cuarenta y cinco minutos.',
          'Cuéntaselo a alguien esta semana.',
        ],
        minutes: 45,
        difficulty: 'baja',
      },
      {
        title: 'Conversación honesta contigo',
        intent: 'Terapia, o el rato en el que no te mientes.',
        steps: [
          'Sesión o cincuenta minutos a solas.',
          'La pregunta incómoda primero.',
          'Anota lo que no querías escribir.',
        ],
        minutes: 50,
        difficulty: 'alta',
      },
      {
        title: 'Ordena tu espacio',
        intent: 'El entorno decide más que la fuerza de voluntad.',
        steps: [
          'Solo la mesa y el dormitorio.',
          'Todo lo que no tiene sitio, a una caja.',
          'Treinta minutos y paras.',
        ],
        minutes: 30,
        difficulty: 'baja',
      },
      {
        title: 'Una tarde en ayuno de estímulos',
        intent: 'Aburrirse es la puerta de la concentración.',
        steps: [
          'Tres horas sin pantallas ni consumo.',
          'Papel, calle o nada.',
          'Aguanta el primer tramo; después se abre.',
        ],
        minutes: 180,
        difficulty: 'alta',
      },
      {
        title: 'La carta que no vas a enviar',
        intent: 'Escribirlo cierra lo que hablarlo no cerraría.',
        steps: [
          'A quien haga falta, sin filtro.',
          'No la envíes.',
          'Guárdala o rómpela, pero escríbela entera.',
        ],
        minutes: 25,
        difficulty: 'media',
      },
    ],
  },

  finanzas: {
    key: 'finanzas',
    name: 'Finanzas',
    blurb: 'Margen, ahorro, libertad de decir que no.',
    defaultGoal: 'Doce meses de colchón para elegir en qué trabajo',
    color: 'var(--branch-finanzas)',
    templates: [
      {
        title: 'Revisa los gastos de la semana',
        intent: 'Mirar el número quita más ansiedad de la que da.',
        steps: [
          'Abre la cuenta y clasifica lo de siete días.',
          'Marca lo que no repetirías.',
          'Suma ese total y apúntalo.',
        ],
        minutes: 20,
        difficulty: 'baja',
      },
      {
        title: 'Cancela una suscripción',
        intent: 'Lo automático se cobra aunque no lo uses.',
        steps: [
          'Lista los cargos recurrentes.',
          'Elige el que menos usaste este mes.',
          'Cancélalo ahora, no lo apuntes para luego.',
        ],
        minutes: 10,
        difficulty: 'baja',
      },
      {
        title: 'Automatiza el ahorro',
        intent: 'Ahorrar lo que sobra no funciona nunca.',
        steps: [
          'Transferencia programada para el día de cobro.',
          'Empieza por un porcentaje que no duela.',
          'A otra cuenta, sin tarjeta asociada.',
        ],
        minutes: 20,
        difficulty: 'media',
      },
      {
        title: 'Calcula tu margen real',
        intent: 'Los meses que aguantas sin ingresos son tu libertad medida.',
        steps: [
          'Gasto medio mensual de los últimos tres meses.',
          'Divide tu colchón entre ese número.',
          'Escribe el resultado en meses.',
        ],
        minutes: 30,
        difficulty: 'media',
      },
      {
        title: 'Negocia un precio',
        intent: 'Preguntar cuesta una frase; no preguntar cuesta el año entero.',
        steps: [
          'Elige un proveedor, tarifa o cliente.',
          'Prepara tu número antes de abrir la conversación.',
          'Pide y calla.',
        ],
        minutes: 25,
        difficulty: 'alta',
      },
      {
        title: 'Abre una vía de ingreso',
        intent: 'Una sola fuente es una sola persona decidiendo por ti.',
        steps: [
          'Elige algo que ya sabes hacer.',
          'Ponle precio y una página donde se pueda comprar.',
          'Cuéntaselo a cinco personas.',
        ],
        minutes: 90,
        difficulty: 'alta',
      },
      {
        title: 'Revisa la cartera',
        intent: 'Mirar poco y con criterio bate a mirar mucho.',
        steps: [
          'Comprueba reparto y comisiones.',
          'Rebalancea solo si te has desviado de verdad.',
          'Cierra la app y no la abras hasta el mes que viene.',
        ],
        minutes: 25,
        difficulty: 'media',
      },
      {
        title: 'Presupuesto del próximo mes',
        intent: 'Un plan escrito convierte el gasto en decisión.',
        steps: [
          'Fijos, variables, ahorro.',
          'Asigna hasta que la suma cuadre a cero.',
          'Deja una línea para imprevistos.',
        ],
        minutes: 40,
        difficulty: 'media',
      },
      {
        title: 'Guarda el 20% de lo que entró',
        intent: 'El hábito importa más que la cantidad.',
        steps: [
          'Mira lo que ha entrado esta semana.',
          'Mueve el veinte por ciento ahora.',
          'Que no vuelva a la cuenta del día a día.',
        ],
        minutes: 10,
        difficulty: 'baja',
      },
      {
        title: 'Lee el informe que evitas',
        intent: 'La factura, el extracto, el contrato. Ahí está el dinero.',
        steps: [
          'Elige el documento que llevas semanas saltándote.',
          'Léelo entero, subrayando cifras.',
          'Una acción concreta al terminar.',
        ],
        minutes: 30,
        difficulty: 'media',
      },
      {
        title: 'Sube tus tarifas',
        intent: 'El precio que no se revisa baja solo cada año.',
        steps: [
          'Compara con el mercado actual.',
          'Define el nuevo número y desde cuándo.',
          'Comunícalo sin pedir perdón.',
        ],
        minutes: 30,
        difficulty: 'alta',
      },
      {
        title: 'Aporta al fondo de emergencia',
        intent: 'El colchón es lo que te deja decir que no.',
        steps: [
          'Objetivo: seis meses de gastos.',
          'Aporta lo que puedas hoy.',
          'Comprueba cuánto falta y ponle fecha.',
        ],
        minutes: 15,
        difficulty: 'baja',
      },
    ],
  },
}

export const PILLAR_ORDER: PillarKey[] = [
  'cuerpo',
  'relaciones',
  'proyecto',
  'mente',
  'finanzas',
]

export const DIFFICULTY_POINTS: Record<Difficulty, number> = {
  baja: 8,
  media: 12,
  alta: 18,
}
