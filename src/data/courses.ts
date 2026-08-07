import { Exercise, QuizQuestion, Badge, Mentor, ForumPost } from '../types';

export const INITIAL_EXERCISES: Exercise[] = [
  // BEGINNER
  {
    id: 'ex-beg-1',
    titleBg: 'Първа програма: Hello World',
    titleEn: 'First Program: Hello World',
    descBg: 'Напишете програма на Python, която отпечатва съобщението "Здравей, България!" в конзолата.',
    descEn: 'Write a Python program that prints the message "Hello World!" to the console.',
    level: 'beginner',
    xp: 20,
    category: 'Основи / Fundamentals',
    starterCode: '# Напишете вашия код тук\n# Write your code here\n',
    solution: 'print("Здравей, България!")',
    expectedOutput: 'Здравей, България!',
    hintsBg: [
      'Използвайте функцията print().',
      'Текстът трябва да бъде ограден с кавички: print("Здравей, България!")'
    ],
    hintsEn: [
      'Use the print() function.',
      'The text must be surrounded by quotes: print("Hello World!")'
    ]
  },
  {
    id: 'ex-beg-2',
    titleBg: 'Променливи и Математика',
    titleEn: 'Variables and Math',
    descBg: 'Създайте две променливи a = 15 и b = 27. Изчислете сумата им и я отпечатайте.',
    descEn: 'Create two variables a = 15 and b = 27. Calculate their sum and print it.',
    level: 'beginner',
    xp: 30,
    category: 'Променливи / Variables',
    starterCode: 'a = 15\nb = 27\n# Пресметнете сумата и я отпечатайте\n# Calculate sum and print it\n',
    solution: 'a = 15\nb = 27\nprint(a + b)',
    expectedOutput: '42',
    hintsBg: [
      'Използвайте оператора + за събиране.',
      'Пример: print(a + b)'
    ],
    hintsEn: [
      'Use the + operator for addition.',
      'Example: print(a + b)'
    ]
  },
  {
    id: 'ex-beg-3',
    titleBg: 'Условна конструкция (If-Else)',
    titleEn: 'Conditionals (If-Else)',
    descBg: 'Дефинирайте променлива points = 85. Ако points е над или равно на 50, отпечатайте "Взехте изпита!", иначе "Опитайте пак".',
    descEn: 'Define variable points = 85. If points is >= 50, print "Passed!", otherwise "Try again".',
    level: 'beginner',
    xp: 40,
    category: 'Логика / Logic',
    starterCode: 'points = 85\n\nif points >= 50:\n    # Код тук\n    pass\nelse:\n    pass',
    solution: 'points = 85\nif points >= 50:\n    print("Взехте изпита!")\nelse:\n    print("Опитайте пак")',
    expectedOutput: 'Взехте изпита!',
    hintsBg: [
      'Внимавайте с отстъпите (4 интервала) след двоеточието.',
      'Отпечатайте точния текст: "Взехте изпита!"'
    ],
    hintsEn: [
      'Mind the indentation (4 spaces) after the colon.',
      'Print the exact text: "Passed!"'
    ]
  },
  {
    id: 'ex-beg-4',
    titleBg: 'Цикъл For: Броене',
    titleEn: 'For Loop: Counting',
    descBg: 'Използвайте цикъл for и range(), за да отпечатате числата от 1 до 5 (всяко на нов ред).',
    descEn: 'Use a for loop and range() to print numbers from 1 to 5 (each on a new line).',
    level: 'beginner',
    xp: 50,
    category: 'Цикли / Loops',
    starterCode: '# Използвайте range(1, 6)\nfor i in range(1, 6):\n    pass\n',
    solution: 'for i in range(1, 6):\n    print(i)',
    expectedOutput: '1\n2\n3\n4\n5',
    hintsBg: [
      'range(1, 6) генерира числа от 1 до 5.',
      'Вътре в цикъла извикайте print(i).'
    ],
    hintsEn: [
      'range(1, 6) generates numbers 1 to 5.',
      'Inside the loop call print(i).'
    ]
  },

  // INTERMEDIATE
  {
    id: 'ex-int-1',
    titleBg: 'Списъци и Филтриране',
    titleEn: 'Lists and Filtering',
    descBg: 'Даден е списък `numbers = [12, 5, 8, 19, 24, 3, 16]`. Създайте нов списък с четните числа и го отпечатайте.',
    descEn: 'Given list `numbers = [12, 5, 8, 19, 24, 3, 16]`. Create a new list with even numbers and print it.',
    level: 'intermediate',
    xp: 60,
    category: 'Списъци / Lists',
    starterCode: 'numbers = [12, 5, 8, 19, 24, 3, 16]\n# Използвайте List Comprehension или for цикъл\neven_numbers = [num for num in numbers if num % 2 == 0]\nprint(even_numbers)\n',
    solution: 'numbers = [12, 5, 8, 19, 24, 3, 16]\neven_numbers = [num for num in numbers if num % 2 == 0]\nprint(even_numbers)',
    expectedOutput: '[12, 8, 24, 16]',
    hintsBg: [
      'Четно число се проверява с num % 2 == 0.',
      'Отпечатайте списъка с print(even_numbers).'
    ],
    hintsEn: [
      'Even numbers are checked using num % 2 == 0.',
      'Print the list with print(even_numbers).'
    ]
  },
  {
    id: 'ex-int-2',
    titleBg: 'Речници и Честота на думи',
    titleEn: 'Dictionaries & Word Frequency',
    descBg: 'Създайте речник `student = {"name": "Иван", "age": 20, "city": "София"}` и отпечатайте "Иван е на 20 години от София."',
    descEn: 'Create dictionary `student = {"name": "Ivan", "age": 20, "city": "Sofia"}` and print "Ivan is 20 years old from Sofia."',
    level: 'intermediate',
    xp: 70,
    category: 'Речници / Dictionaries',
    starterCode: 'student = {"name": "Иван", "age": 20, "city": "София"}\n# Използвайте f-string за форматиране\n',
    solution: 'student = {"name": "Иван", "age": 20, "city": "София"}\nprint(f"{student[\'name\']} е на {student[\'age\']} години от {student[\'city\']}.")',
    expectedOutput: 'Иван е на 20 години от София.',
    hintsBg: [
      'f-string форматирането изглежда така: f"{student[\'name\']}"',
      'Проверете за запетайката и точката в изхода.'
    ],
    hintsEn: [
      'f-string format: f"{student[\'name\']}"',
      'Check spacing and punctuation.'
    ]
  },

  // ADVANCED
  {
    id: 'ex-adv-1',
    titleBg: 'Декоратори в Python',
    titleEn: 'Decorators in Python',
    descBg: 'Дефинирайте декоратор `@logger`, който при отпечатване изписва "[LOG]: Executing" преди функцията.',
    descEn: 'Define a decorator `@logger` that prints "[LOG]: Executing" before the function runs.',
    level: 'advanced',
    xp: 100,
    category: 'ООП & Декоратори / Advanced OOP',
    starterCode: 'def logger(func):\n    def wrapper(*args, **kwargs):\n        print("[LOG]: Executing")\n        return func(*args, **kwargs)\n    return wrapper\n\n@logger\ndef greet():\n    print("Привет от Python!")\n\ngreet()\n',
    solution: 'def logger(func):\n    def wrapper(*args, **kwargs):\n        print("[LOG]: Executing")\n        return func(*args, **kwargs)\n    return wrapper\n\n@logger\ndef greet():\n    print("Привет от Python!")\n\ngreet()',
    expectedOutput: '[LOG]: Executing\nПривет от Python!',
    hintsBg: [
      'Декораторът връща вътрешна функция wrapper.',
      'Извикайте greet() в края.'
    ],
    hintsEn: [
      'The decorator returns an inner function wrapper.',
      'Call greet() at the end.'
    ]
  },

  // KIDS
  {
    id: 'ex-kid-1',
    titleBg: 'Робот Забавко (Визуален Блок)',
    titleEn: 'Fun Robot (Visual Block)',
    descBg: 'Сглобете блокове за робота: той трябва първо да каже "Здравей!", а след това "Аз обичам Python!"',
    descEn: 'Assemble blocks for the robot: first say "Hello!", then "I love Python!"',
    level: 'kids',
    xp: 25,
    category: 'Детски Блокове / Kids Blocks',
    starterCode: 'print("Здравей!")\nprint("Аз обичам Python!")\n',
    solution: 'print("Здравей!")\nprint("Аз обичам Python!")',
    expectedOutput: 'Здравей!\nАз обичам Python!',
    hintsBg: [
      'Плъзнете блока "Отпечатай" два пъти.',
      'Напишете двата текста в блоковете.'
    ],
    hintsEn: [
      'Drag the "Print" block twice.',
      'Type both sentences inside.'
    ]
  }
];

export const INITIAL_QUIZZES: QuizQuestion[] = [
  {
    id: 'q1',
    titleBg: 'Типове данни в Python',
    titleEn: 'Python Data Types',
    codeSnippet: 'x = 3.14\nprint(type(x))',
    optionsBg: ['<class \'int\'>', '<class \'float\'>', '<class \'str\'>', '<class \'double\'>'],
    optionsEn: ['<class \'int\'>', '<class \'float\'>', '<class \'str\'>', '<class \'double\'>'],
    correctIndex: 1,
    explanationBg: 'В Python числата с плаваща запетая като 3.14 са от тип `float`.',
    explanationEn: 'In Python, floating point numbers like 3.14 belong to the `float` type.',
    xp: 25,
    level: 'beginner'
  },
  {
    id: 'q2',
    titleBg: 'Списъчни индекси',
    titleEn: 'List Indexing',
    codeSnippet: 'colors = ["червен", "зелен", "син"]\nprint(colors[-1])',
    optionsBg: ['червен', 'зелен', 'син', 'IndexError'],
    optionsEn: ['red', 'green', 'blue', 'IndexError'],
    correctIndex: 2,
    explanationBg: 'Отрицателните индекси в Python броят отзад напред! -1 съответства на последния елемент ("син").',
    explanationEn: 'Negative indices in Python count from the end! -1 refers to the last element ("blue").',
    xp: 30,
    level: 'beginner'
  },
  {
    id: 'q3',
    titleBg: 'Свойства на Кортежи (Tuples)',
    titleEn: 'Tuple Immutability',
    codeSnippet: 't = (1, 2, 3)\nt[0] = 99',
    optionsBg: ['t става (99, 2, 3)', 'TypeError: tuple object does not support item assignment', 't става (1, 2, 3, 99)', 'Нищо не се случва'],
    optionsEn: ['t becomes (99, 2, 3)', 'TypeError: tuple object does not support item assignment', 't becomes (1, 2, 3, 99)', 'Nothing happens'],
    correctIndex: 1,
    explanationBg: 'Кортежите (tuples) са неизменими (immutable) в Python. Не можете да променяте елементите им след създаване!',
    explanationEn: 'Tuples are immutable in Python. You cannot modify their elements after creation!',
    xp: 35,
    level: 'intermediate'
  },
  {
    id: 'q4',
    titleBg: 'Детска загадка: Кое прави цикъл?',
    titleEn: 'Kids Riddle: Which one creates a loop?',
    codeSnippet: '# Повтори 3 пъти\nfor i in range(3):\n    print("🚀")',
    optionsBg: ['for i in range(3)', 'if i == 3', 'def rocket()', 'import space'],
    optionsEn: ['for i in range(3)', 'if i == 3', 'def rocket()', 'import space'],
    correctIndex: 0,
    explanationBg: 'Думата `for` заедно с `range()` прави цикъл за повторение!',
    explanationEn: 'The word `for` combined with `range()` makes a repeating loop!',
    xp: 20,
    level: 'kids'
  },
  {
    id: 'q5',
    titleBg: 'Списъчни генератори (List Comprehension)',
    titleEn: 'List Comprehensions',
    codeSnippet: 'nums = [x * 2 for x in range(4)]\nprint(nums)',
    optionsBg: ['[0, 2, 4, 6]', '[2, 4, 6, 8]', '[0, 1, 2, 3]', '[0, 2, 4, 6, 8]'],
    optionsEn: ['[0, 2, 4, 6]', '[2, 4, 6, 8]', '[0, 1, 2, 3]', '[0, 2, 4, 6, 8]'],
    correctIndex: 0,
    explanationBg: 'range(4) генерира [0, 1, 2, 3]. Всяко число се умножава по 2 -> [0, 2, 4, 6].',
    explanationEn: 'range(4) yields 0, 1, 2, 3. Each element is multiplied by 2 giving [0, 2, 4, 6].',
    xp: 40,
    level: 'intermediate'
  },
  {
    id: 'q6',
    titleBg: 'Служебни думи: global vs local',
    titleEn: 'Variable Scope & Global',
    codeSnippet: 'x = 10\ndef change():\n    global x\n    x = 20\nchange()\nprint(x)',
    optionsBg: ['10', '20', 'UnboundLocalError', 'None'],
    optionsEn: ['10', '20', 'UnboundLocalError', 'None'],
    correctIndex: 1,
    explanationBg: 'Ключовата дума `global` позволява промяна на глобалната променлива `x` вътре във функцията.',
    explanationEn: 'The `global` keyword allows modifying the outer global variable `x` inside a function.',
    xp: 45,
    level: 'advanced'
  },
  {
    id: 'q7',
    titleBg: 'Речници (Dictionaries) & get() метод',
    titleEn: 'Dictionary get() Method',
    codeSnippet: 'd = {"a": 1}\nprint(d.get("b", 100))',
    optionsBg: ['KeyError', 'None', '100', '1'],
    optionsEn: ['KeyError', 'None', '100', '1'],
    correctIndex: 2,
    explanationBg: 'Методът `.get("b", 100)` връща подразбиращата се стойност `100`, когато ключът "b" не съществува.',
    explanationEn: 'The `.get("b", 100)` method returns default value `100` when the key "b" is missing.',
    xp: 30,
    level: 'intermediate'
  },
  {
    id: 'q8',
    titleBg: 'Детска загадка: Цвят на костенурката 🐢',
    titleEn: 'Kids Riddle: Turtle Color',
    codeSnippet: 'import turtle\nt = turtle.Turtle()\nt.color("gold")\nt.forward(50)',
    optionsBg: ['Черна линия', 'Златна линия (gold)', 'Червена линия', 'Няма линия'],
    optionsEn: ['Black line', 'Gold line', 'Red line', 'No line'],
    correctIndex: 1,
    explanationBg: 'Функцията t.color("gold") задава молива да рисува със златен цвят!',
    explanationEn: 't.color("gold") sets the turtle pen color to bright gold!',
    xp: 20,
    level: 'kids'
  }
];

export const INITIAL_BADGES: Badge[] = [
  {
    id: 'b-first',
    titleBg: 'Първи стъпки',
    titleEn: 'First Steps',
    icon: '🚀',
    descBg: 'Решихте първото си упражнение по Python.',
    descEn: 'Solved your very first Python exercise.',
    unlocked: true,
    unlockedAt: 'Днес / Today'
  },
  {
    id: 'b-streak3',
    titleBg: 'Огнена серия (3 дни)',
    titleEn: 'Streak Master (3 Days)',
    icon: '🔥',
    descBg: 'Поддържате 3 поредни дни активно учене.',
    descEn: 'Maintained a 3-day consecutive learning streak.',
    unlocked: true,
    unlockedAt: 'Вчера / Yesterday'
  },
  {
    id: 'b-quiz',
    titleBg: 'Викторина шампион',
    titleEn: 'Quiz Champion',
    icon: '🏆',
    descBg: 'Отговорихте правилно на 3 викторини.',
    descEn: 'Answered 3 quiz questions correctly.',
    unlocked: false
  },
  {
    id: 'b-night',
    titleBg: 'Нощна сова',
    titleEn: 'Night Owl',
    icon: '🦉',
    descBg: 'Учихте Python в нощен режим след 22:00 ч.',
    descEn: 'Learned Python in night mode after 10 PM.',
    unlocked: true,
    unlockedAt: 'Снощи / Last night'
  },
  {
    id: 'b-kids',
    titleBg: 'Детски архитект',
    titleEn: 'Visual Builder',
    icon: '🎨',
    descBg: 'Създадохте програма с визуални блокове.',
    descEn: 'Created a program using visual blocks.',
    unlocked: false
  }
];

export const INITIAL_MENTORS: Mentor[] = [
  {
    id: 'm1',
    name: 'Инж. Калоян Георгиев',
    titleBg: 'Старши Python & AI Архитект (10+ г. опит)',
    titleEn: 'Senior Python & AI Architect (10+ yrs exp)',
    avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=250',
    rating: 4.95,
    reviewsCount: 42,
    bioBg: 'Специализирам в Django, FastAPI, PyTorch и оптимизация на код. Обичам да помагам на ученици с дълбоки ревюта.',
    bioEn: 'Specializes in Django, FastAPI, PyTorch and code optimization. Passionate about helping students through deep code reviews.',
    specialties: ['FastAPI', 'Data Science', 'Django', 'Clean Code'],
    hourlyRateBg: 'Безплатно за студенти / Free for PyBG students',
    available: true
  },
  {
    id: 'm2',
    name: 'Елена Николова',
    titleBg: 'Tech Lead & Детски преподавател по програмиране',
    titleEn: 'Tech Lead & Kids Coding Educator',
    avatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&q=80&w=250',
    rating: 5.0,
    reviewsCount: 38,
    bioBg: 'Обучавам деца и начинаещи на логическо мислене, Turtle графики и изграждане на първи игри с Python.',
    bioEn: 'Teaches kids and beginners computational thinking, Turtle graphics, and building their first Python games.',
    specialties: ['Kids Visual Python', 'Pygame', 'Beginner Logic'],
    hourlyRateBg: 'Безплатно / Free mentor support',
    available: true
  },
  {
    id: 'm3',
    name: 'Петър Димитров',
    titleBg: 'Data Scientist & Python Automation Mentor',
    titleEn: 'Data Scientist & Python Automation Mentor',
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=250',
    rating: 4.88,
    reviewsCount: 29,
    bioBg: 'Помагам с Pandas, Web Scraping, скриптове за автоматизация и подготовка за интервюта.',
    bioEn: 'Helps with Pandas, Web Scraping, automation scripts, and interview prep.',
    specialties: ['Automation', 'Web Scraping', 'Pandas'],
    hourlyRateBg: 'Безплатно / Free mentor support',
    available: true
  }
];

export const INITIAL_FORUM_POSTS: ForumPost[] = [
  {
    id: 'fp-1',
    title: 'Как да разбера кога да използвам While вместо For цикъл?',
    author: 'Мартин Стоянов',
    authorAvatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&q=80&w=150',
    authorRole: 'Student',
    category: 'Help',
    tags: ['#Loops', '#Beginner', '#Syntax'],
    content: 'Здравейте! Често се колебая кога е по-правилно да използвам `while` и кога `for` цикъл в решенията на задачите. Някой може ли да даде лесен пример?',
    upvotes: 14,
    createdAt: 'Преди 2 часа',
    isSolved: true,
    replies: [
      {
        id: 'r-1',
        author: 'Инж. Калоян Георгиев',
        authorAvatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=250',
        authorRole: 'Mentor',
        content: 'Здравей, Мартин! Използвай `for`, когато знаеш предварително броя повторения (напр. обхождане на списък или range(10)). Използвай `while`, когато цикълът трябва да продължи до настъпване на определено условие (напр. докато потребителят въведе "exit").',
        createdAt: 'Преди 1 час',
        upvotes: 12
      }
    ]
  },
  {
    id: 'fp-2',
    title: 'Детски проект: Рисуване на цветни звезди с Turtle graphics 🐢🎨',
    author: 'Анни (9 г.) & Елена Николова',
    authorAvatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&q=80&w=150',
    authorRole: 'Kid Coder',
    category: 'KidsCoding',
    tags: ['#KidsPython', '#TurtleGraphics', '#VisualBlocks'],
    content: 'Сглобихме супер готин проект с визуални блокове, който превръща Python код в рисуване на калейдоскоп от 8 звезди! Вижте кода и споделете вашето мнение.',
    upvotes: 28,
    createdAt: 'Преди 5 часа',
    isSolved: false,
    replies: []
  }
];
