"""Seeded course content: Spanish for English speakers.

Each skill lists vocabulary (spanish, english, emoji) and sentences (spanish, english,
[other accepted english translations]). Lessons and their exercises are generated from
this data by generator.py, so adding content means editing only this file.
"""

LANGUAGE = {"code": "es", "name": "Spanish", "flag": "🇪🇸"}
COURSE_TITLE = "Spanish for English speakers"

UNITS = [
    {
        "title": "Unit 1",
        "description": "Introduce yourself, greet people, order food",
        "color": "green",
        "skills": [
            {
                "title": "Basics",
                "icon": "star",
                "lessons": 3,
                "words": [
                    ("el niño", "the boy", "👦"),
                    ("la niña", "the girl", "👧"),
                    ("el hombre", "the man", "👨"),
                    ("la mujer", "the woman", "👩"),
                    ("el gato", "the cat", "🐱"),
                    ("el perro", "the dog", "🐶"),
                ],
                "sentences": [
                    ("Soy un niño.", "I am a boy.", ["I'm a boy."]),
                    ("Ella es una mujer.", "She is a woman.", ["She's a woman."]),
                    ("Él es un hombre.", "He is a man.", ["He's a man."]),
                    ("El gato es pequeño.", "The cat is small.", ["The cat is little."]),
                    ("Yo tengo un perro.", "I have a dog.", []),
                    ("La niña tiene un gato.", "The girl has a cat.", []),
                ],
            },
            {
                "title": "Greetings",
                "icon": "star",
                "lessons": 3,
                "words": [
                    ("hola", "hello", "👋"),
                    ("adiós", "goodbye", "🚪"),
                    ("gracias", "thank you", "🙏"),
                    ("buenos días", "good morning", "🌅"),
                    ("buenas noches", "good night", "🌙"),
                    ("por favor", "please", "🤲"),
                ],
                "sentences": [
                    ("Hola, me llamo Ana.", "Hello, my name is Ana.", ["Hi, my name is Ana.", "Hello, I am called Ana."]),
                    ("Buenos días, señor.", "Good morning, sir.", []),
                    ("Muchas gracias.", "Thank you very much.", ["Thanks a lot.", "Many thanks."]),
                    ("Adiós, amigo.", "Goodbye, friend.", ["Bye, friend."]),
                    ("¿Cómo estás?", "How are you?", []),
                    ("Estoy bien, gracias.", "I am fine, thanks.", ["I'm fine, thanks.", "I am well, thank you.", "I am fine, thank you."]),
                ],
            },
            {
                "title": "Food",
                "icon": "book",
                "lessons": 3,
                "words": [
                    ("la manzana", "the apple", "🍎"),
                    ("el pan", "the bread", "🍞"),
                    ("el agua", "the water", "💧"),
                    ("la leche", "the milk", "🥛"),
                    ("el queso", "the cheese", "🧀"),
                    ("el café", "the coffee", "☕"),
                ],
                "sentences": [
                    ("Yo como una manzana.", "I eat an apple.", ["I am eating an apple."]),
                    ("Ella bebe agua.", "She drinks water.", ["She is drinking water."]),
                    ("El niño come pan.", "The boy eats bread.", ["The boy is eating bread."]),
                    ("Nosotros bebemos leche.", "We drink milk.", ["We are drinking milk."]),
                    ("Quiero un café, por favor.", "I want a coffee, please.", ["I would like a coffee, please."]),
                    ("El queso es bueno.", "The cheese is good.", []),
                ],
            },
            {"title": "Unit 1 review", "icon": "trophy", "lessons": 2, "review": True},
        ],
    },
    {
        "title": "Unit 2",
        "description": "Talk about your family and colors",
        "color": "purple",
        "skills": [
            {
                "title": "Family",
                "icon": "star",
                "lessons": 3,
                "words": [
                    ("la madre", "the mother", "👩‍👧"),
                    ("el padre", "the father", "👨‍👦"),
                    ("el hermano", "the brother", "👦"),
                    ("la hermana", "the sister", "👧"),
                    ("la abuela", "the grandmother", "👵"),
                    ("el abuelo", "the grandfather", "👴"),
                ],
                "sentences": [
                    ("Mi madre es alta.", "My mother is tall.", ["My mom is tall."]),
                    ("Tengo un hermano.", "I have a brother.", []),
                    ("Mi padre bebe café.", "My father drinks coffee.", ["My dad drinks coffee."]),
                    ("La abuela tiene un gato.", "The grandmother has a cat.", ["Grandma has a cat."]),
                    ("Mi hermana es pequeña.", "My sister is small.", ["My sister is little."]),
                    ("Él es mi abuelo.", "He is my grandfather.", ["He's my grandfather.", "He is my grandpa."]),
                ],
            },
            {
                "title": "Colors",
                "icon": "dumbbell",
                "lessons": 3,
                "words": [
                    ("rojo", "red", "🔴"),
                    ("azul", "blue", "🔵"),
                    ("verde", "green", "🟢"),
                    ("amarillo", "yellow", "🟡"),
                    ("negro", "black", "⚫"),
                    ("blanco", "white", "⚪"),
                ],
                "sentences": [
                    ("El perro es negro.", "The dog is black.", []),
                    ("La manzana es roja.", "The apple is red.", []),
                    ("Mi gato es blanco.", "My cat is white.", []),
                    ("El mar es azul.", "The sea is blue.", ["The ocean is blue."]),
                    ("Tengo un libro verde.", "I have a green book.", []),
                    ("El queso es amarillo.", "The cheese is yellow.", []),
                ],
            },
            {"title": "Unit 2 review", "icon": "trophy", "lessons": 2, "review": True},
        ],
    },
    {
        "title": "Unit 3",
        "description": "Get around town and talk about travel",
        "color": "blue",
        "skills": [
            {
                "title": "Travel",
                "icon": "star",
                "lessons": 3,
                "words": [
                    ("el tren", "the train", "🚆"),
                    ("el avión", "the plane", "✈️"),
                    ("el hotel", "the hotel", "🏨"),
                    ("la playa", "the beach", "🏖️"),
                    ("el mapa", "the map", "🗺️"),
                    ("la maleta", "the suitcase", "🧳"),
                ],
                "sentences": [
                    ("¿Dónde está el hotel?", "Where is the hotel?", []),
                    ("El tren es rápido.", "The train is fast.", []),
                    ("Voy a la playa.", "I am going to the beach.", ["I go to the beach.", "I'm going to the beach."]),
                    ("Necesito un mapa.", "I need a map.", []),
                    ("Mi maleta es azul.", "My suitcase is blue.", []),
                    ("El avión es grande.", "The plane is big.", ["The airplane is big."]),
                ],
            },
            {
                "title": "Around town",
                "icon": "book",
                "lessons": 2,
                "words": [
                    ("la calle", "the street", "🛣️"),
                    ("el banco", "the bank", "🏦"),
                    ("la tienda", "the store", "🏪"),
                    ("el museo", "the museum", "🏛️"),
                    ("el parque", "the park", "🌳"),
                    ("la estación", "the station", "🚉"),
                ],
                "sentences": [
                    ("La tienda está cerrada.", "The store is closed.", ["The shop is closed."]),
                    ("El parque es bonito.", "The park is pretty.", ["The park is beautiful."]),
                    ("¿Dónde está el banco?", "Where is the bank?", []),
                    ("El museo está abierto.", "The museum is open.", []),
                    ("Vivo en esta calle.", "I live on this street.", ["I live in this street."]),
                    ("La estación está cerca.", "The station is nearby.", ["The station is close."]),
                ],
            },
            {"title": "Unit 3 review", "icon": "trophy", "lessons": 2, "review": True},
        ],
    },
]

ACHIEVEMENTS = [
    ("first_steps", "First steps", "Finish your first lesson.", "🐣", "lessons", 1),
    ("wildfire_3", "Wildfire", "Reach a 3 day streak.", "🔥", "streak", 3),
    ("wildfire_7", "Wildfire II", "Reach a 7 day streak.", "🔥", "streak", 7),
    ("sage_100", "Sage", "Earn 100 XP.", "🧠", "total_xp", 100),
    ("sage_500", "Sage II", "Earn 500 XP.", "🧠", "total_xp", 500),
    ("scholar_10", "Scholar", "Finish 10 lessons.", "📚", "lessons", 10),
    ("sharpshooter_3", "Sharpshooter", "Finish 3 lessons without a mistake.", "🎯", "perfect_lessons", 3),
]

# Leaderboard rivals: (username, display name, avatar color, XP this week, total XP)
RIVALS = [
    ("mariana_r", "Mariana", "#ff4b4b", 312, 4120),
    ("kenji", "Kenji", "#1cb0f6", 268, 9870),
    ("priya.s", "Priya", "#ce82ff", 241, 2210),
    ("tomasz", "Tomasz", "#ff9600", 190, 1500),
    ("lea_fr", "Léa", "#58cc02", 154, 860),
    ("omar", "Omar", "#2b70c9", 120, 3300),
    ("sofia.g", "Sofía", "#ffc800", 96, 640),
    ("ben_k", "Ben", "#a568cc", 71, 410),
    ("aisha", "Aisha", "#00cd9c", 45, 2900),
    ("lucas", "Lucas", "#ff86d0", 22, 120),
    ("yuki", "Yuki", "#777777", 8, 95),
]

# Guidebook per unit (same order as UNITS). "phrases" sections list key phrases;
# "tip" sections explain a grammar point, with example phrases underneath.
GUIDEBOOKS = [
    [
        {"kind": "phrases", "title": "Greet people and introduce yourself", "phrases": [
            ("Hola, me llamo Ana.", "Hi, my name is Ana."),
            ("¿Cómo estás?", "How are you?"),
            ("Estoy bien, gracias.", "I'm fine, thanks."),
            ("Mucho gusto.", "Nice to meet you."),
        ]},
        {"kind": "tip", "title": "Masculine and feminine nouns",
         "body": "Every Spanish noun is either masculine or feminine. Masculine nouns take el (the) and un (a); "
                 "feminine nouns take la and una.\n\nNouns ending in -o are usually masculine and nouns ending "
                 "in -a are usually feminine, but not always, so learn each new word together with its article.",
         "phrases": [("el niño / un niño", "the boy / a boy"), ("la niña / una niña", "the girl / a girl"),
                     ("el agua", "the water (feminine, but uses el)")]},
        {"kind": "phrases", "title": "Order food and drinks", "phrases": [
            ("Quiero un café, por favor.", "I want a coffee, please."),
            ("Yo como una manzana.", "I eat an apple."),
            ("Ella bebe agua.", "She drinks water."),
            ("El queso es bueno.", "The cheese is good."),
        ]},
        {"kind": "tip", "title": "Ser: to be",
         "body": "Use ser to say who or what someone is. The verb changes with the person, and the pronoun "
                 "(yo, tú, él) is often dropped because the verb already shows who you mean.",
         "phrases": [("(Yo) soy un niño.", "I am a boy."), ("(Tú) eres una mujer.", "You are a woman."),
                     ("Él es un hombre.", "He is a man.")]},
    ],
    [
        {"kind": "phrases", "title": "Talk about your family", "phrases": [
            ("Tengo un hermano.", "I have a brother."),
            ("Mi madre es alta.", "My mother is tall."),
            ("Él es mi abuelo.", "He is my grandfather."),
            ("La abuela tiene un gato.", "The grandmother has a cat."),
        ]},
        {"kind": "tip", "title": "Saying \"my\" with mi and mis",
         "body": "Mi means my and stays the same for masculine and feminine nouns. Add -s for plurals.",
         "phrases": [("mi padre, mi madre", "my father, my mother"), ("mis hermanos", "my brothers / siblings")]},
        {"kind": "phrases", "title": "Describe things by color", "phrases": [
            ("El perro es negro.", "The dog is black."),
            ("La manzana es roja.", "The apple is red."),
            ("Tengo un libro verde.", "I have a green book."),
        ]},
        {"kind": "tip", "title": "Adjectives agree with the noun",
         "body": "Adjectives come after the noun and match it. Adjectives ending in -o switch to -a for "
                 "feminine nouns; ones ending in -e or a consonant, like verde and azul, don't change.",
         "phrases": [("el gato rojo / la casa roja", "the red cat / the red house"),
                     ("el libro verde / la puerta verde", "the green book / the green door")]},
    ],
    [
        {"kind": "phrases", "title": "Find your way while traveling", "phrases": [
            ("¿Dónde está el hotel?", "Where is the hotel?"),
            ("Necesito un mapa.", "I need a map."),
            ("Voy a la playa.", "I'm going to the beach."),
            ("La estación está cerca.", "The station is nearby."),
        ]},
        {"kind": "tip", "title": "Estar for location and state",
         "body": "Spanish has two verbs for to be. Use estar, not ser, to say where something is or how "
                 "something is right now.",
         "phrases": [("El banco está aquí.", "The bank is here."),
                     ("La tienda está cerrada.", "The store is closed.")]},
        {"kind": "tip", "title": "Ir a: going to",
         "body": "Voy a (I go to / I'm going to) plus a place says where you're headed. a + el contracts to al.",
         "phrases": [("Voy a la playa.", "I'm going to the beach."), ("Voy al parque.", "I'm going to the park.")]},
    ],
]
