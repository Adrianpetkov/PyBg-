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
  },

  // NEW BEGINNER EXERCISES (+11)
  {
    id: 'ex-beg-5',
    titleBg: 'Четно или Нечетно',
    titleEn: 'Even or Odd',
    descBg: 'Дадено е число num = 14. Отпечатайте "Четно" ако се дели на 2, в противен случай "Нечетно".',
    descEn: 'Given number num = 14. Print "Even" if divisible by 2, otherwise "Odd".',
    level: 'beginner',
    xp: 30,
    category: 'Логика / Logic',
    starterCode: 'num = 14\n# Проверете с num % 2 == 0\n',
    solution: 'num = 14\nif num % 2 == 0:\n    print("Четно")\nelse:\n    print("Нечетно")',
    expectedOutput: 'Четно',
    hintsBg: ['Използвайте оператора % за остатък от деление.'],
    hintsEn: ['Use the % operator for remainder division.']
  },
  {
    id: 'ex-beg-6',
    titleBg: 'Дължина на Текст',
    titleEn: 'String Length',
    descBg: 'Създайте променлива word = "Програмиране". Намерете и отпечатайте нейната дължина с len().',
    descEn: 'Create variable word = "Programming". Find and print its length using len().',
    level: 'beginner',
    xp: 25,
    category: 'Текст / Strings',
    starterCode: 'word = "Програмиране"\n# Намерете дължината\n',
    solution: 'word = "Програмиране"\nprint(len(word))',
    expectedOutput: '13',
    hintsBg: ['Функцията len(word) връща броя символи.'],
    hintsEn: ['The len(word) function returns total character count.']
  },
  {
    id: 'ex-beg-7',
    titleBg: 'Главни Букви',
    titleEn: 'Uppercase String',
    descBg: 'Превърнете текста text = "python е супер" в главни букви с метода .upper() и го отпечатайте.',
    descEn: 'Convert text = "python is great" to uppercase using .upper() and print it.',
    level: 'beginner',
    xp: 25,
    category: 'Текст / Strings',
    starterCode: 'text = "python е супер"\n# Превърнете в главни букви\n',
    solution: 'text = "python е супер"\nprint(text.upper())',
    expectedOutput: 'PYTHON Е СУПЕР',
    hintsBg: ['Използвайте text.upper().'],
    hintsEn: ['Use text.upper().']
  },
  {
    id: 'ex-beg-8',
    titleBg: 'Лице на Правоъгълник',
    titleEn: 'Rectangle Area',
    descBg: 'Имате страна a = 8 и страна b = 5. Пресметнете лицето (a * b) и отпечатайте "Лице: 40".',
    descEn: 'With width a = 8 and height b = 5. Calculate area (a * b) and print "Area: 40".',
    level: 'beginner',
    xp: 30,
    category: 'Математика / Math',
    starterCode: 'a = 8\nb = 5\n# Пресметнете лицето\n',
    solution: 'a = 8\nb = 5\narea = a * b\nprint(f"Лице: {area}")',
    expectedOutput: 'Лице: 40',
    hintsBg: ['Използвайте f-string за изхода.'],
    hintsEn: ['Use f-string for output.']
  },
  {
    id: 'ex-beg-9',
    titleBg: 'Сума от 1 до 10',
    titleEn: 'Sum 1 to 10',
    descBg: 'Пресметнете сумата на всички числа от 1 до 10 с цикъл for или sum() и я отпечатайте.',
    descEn: 'Calculate the sum of all numbers from 1 to 10 using a loop or sum() and print it.',
    level: 'beginner',
    xp: 35,
    category: 'Цикли / Loops',
    starterCode: '# Намерете сумата на range(1, 11)\n',
    solution: 'total = sum(range(1, 11))\nprint(total)',
    expectedOutput: '55',
    hintsBg: ['Функцията sum(range(1, 11)) пресмята 1+2+...+10.'],
    hintsEn: ['sum(range(1, 11)) calculates 1+2+...+10.']
  },
  {
    id: 'ex-beg-10',
    titleBg: 'Градуси: Целзий във Фаренхайт',
    titleEn: 'Celsius to Fahrenheit',
    descBg: 'Преобразувайте celsius = 25 във Фаренхайт по формулата: (celsius * 9/5) + 32. Отпечатайте резултата.',
    descEn: 'Convert celsius = 25 to Fahrenheit using (celsius * 9/5) + 32. Print the result.',
    level: 'beginner',
    xp: 35,
    category: 'Математика / Math',
    starterCode: 'celsius = 25\n# Пресметнете fahrenheit\n',
    solution: 'celsius = 25\nfahrenheit = (celsius * 9/5) + 32\nprint(fahrenheit)',
    expectedOutput: '77.0',
    hintsBg: ['Формулата е: (celsius * 9/5) + 32'],
    hintsEn: ['Formula: (celsius * 9/5) + 32']
  },
  {
    id: 'ex-beg-11',
    titleBg: 'Най-голямо от Две Числа',
    titleEn: 'Max of Two Numbers',
    descBg: 'Дадени са x = 42 и y = 89. Отпечатайте по-голямото число с max().',
    descEn: 'Given x = 42 and y = 89. Print the larger number using max().',
    level: 'beginner',
    xp: 25,
    category: 'Основи / Fundamentals',
    starterCode: 'x = 42\ny = 89\n# Отпечатайте по-голямото\n',
    solution: 'x = 42\ny = 89\nprint(max(x, y))',
    expectedOutput: '89',
    hintsBg: ['Вградената функция max(x, y) намира по-голямото.'],
    hintsEn: ['Built-in function max(x, y) returns the larger.']
  },
  {
    id: 'ex-beg-12',
    titleBg: 'Обръщане на Текст',
    titleEn: 'Reverse String',
    descBg: 'Дадена е дума word = "Python". Отпечатайте я обърната наобратно с [::-1].',
    descEn: 'Given word = "Python". Print it reversed using [::-1].',
    level: 'beginner',
    xp: 35,
    category: 'Текст / Strings',
    starterCode: 'word = "Python"\n# Обърнете думата\n',
    solution: 'word = "Python"\nprint(word[::-1])',
    expectedOutput: 'nohtyP',
    hintsBg: ['Слайсингът word[::-1] обръща текста.'],
    hintsEn: ['Slicing syntax word[::-1] reverses a string.']
  },
  {
    id: 'ex-beg-13',
    titleBg: 'Първа Собствена Функция',
    titleEn: 'First Custom Function',
    descBg: 'Дефинирайте функция square(n), която връща n * n. Отпечатайте square(6).',
    descEn: 'Define function square(n) returning n * n. Print square(6).',
    level: 'beginner',
    xp: 40,
    category: 'Функции / Functions',
    starterCode: 'def square(n):\n    pass\n\n# Извикайте я с 6\n',
    solution: 'def square(n):\n    return n * n\n\nprint(square(6))',
    expectedOutput: '36',
    hintsBg: ['Ключовата дума return връща стойността.'],
    hintsEn: ['The return keyword sends back the result.']
  },
  {
    id: 'ex-beg-14',
    titleBg: 'Таблица за Умножение по 3',
    titleEn: 'Multiplication Table for 3',
    descBg: 'Отпечатайте произведенията 3 * 1, 3 * 2, 3 * 3, 3 * 4, 3 * 5 с цикъл.',
    descEn: 'Print products 3 * 1 up to 3 * 5 using a loop.',
    level: 'beginner',
    xp: 40,
    category: 'Цикли / Loops',
    starterCode: 'for i in range(1, 6):\n    # Отпечатайте 3 * i\n    pass',
    solution: 'for i in range(1, 6):\n    print(3 * i)',
    expectedOutput: '3\n6\n9\n12\n15',
    hintsBg: ['Вътре в цикъла напишете print(3 * i).'],
    hintsEn: ['Inside the loop call print(3 * i).']
  },
  {
    id: 'ex-beg-15',
    titleBg: 'Проверка за Нула, Положително или Отрицателно',
    titleEn: 'Check Zero, Positive, Negative',
    descBg: 'Проверете val = -7. Ако val > 0 отпечатайте "Положително", ако val < 0 "Отрицателно", иначе "Нула".',
    descEn: 'Check val = -7. Print "Positive" if > 0, "Negative" if < 0, else "Zero".',
    level: 'beginner',
    xp: 35,
    category: 'Логика / Logic',
    starterCode: 'val = -7\n# Използвайте if, elif, else\n',
    solution: 'val = -7\nif val > 0:\n    print("Положително")\nelif val < 0:\n    print("Отрицателно")\nelse:\n    print("Нула")',
    expectedOutput: 'Отрицателно',
    hintsBg: ['Използвайте elif за втората проверка.'],
    hintsEn: ['Use elif for the second check.']
  },

  // NEW INTERMEDIATE EXERCISES (+12)
  {
    id: 'ex-int-3',
    titleBg: 'Максимален Елемент в Списък',
    titleEn: 'Find List Max',
    descBg: 'Имате списък scores = [45, 89, 12, 98, 67]. Намерете и отпечатайте най-високия резултат.',
    descEn: 'With scores = [45, 89, 12, 98, 67]. Find and print the highest score.',
    level: 'intermediate',
    xp: 50,
    category: 'Списъци / Lists',
    starterCode: 'scores = [45, 89, 12, 98, 67]\n# Отпечатайте максималния елемент\n',
    solution: 'scores = [45, 89, 12, 98, 67]\nprint(max(scores))',
    expectedOutput: '98',
    hintsBg: ['Функцията max(scores) намира най-големия елемент.'],
    hintsEn: ['The max(scores) function returns the highest item.']
  },
  {
    id: 'ex-int-4',
    titleBg: 'Премахване на Дубликати с Множество (Set)',
    titleEn: 'Remove Duplicates with Set',
    descBg: 'Даден е списък items = ["ябълка", "банан", "ябълка", "портокал", "банан"]. Премахнете дубликатите и отпечатайте дължината на уникалните елементи.',
    descEn: 'Given items = ["apple", "banana", "apple", "orange", "banana"]. Remove duplicates and print unique count.',
    level: 'intermediate',
    xp: 55,
    category: 'Множества / Sets',
    starterCode: 'items = ["ябълка", "банан", "ябълка", "портокал", "банан"]\n# Превърнете в set и отпечатайте len()\n',
    solution: 'items = ["ябълка", "банан", "ябълка", "портокал", "банан"]\nunique_items = set(items)\nprint(len(unique_items))',
    expectedOutput: '3',
    hintsBg: ['set(items) премахва повтарящите се стойности.'],
    hintsEn: ['set(items) automatically filters out duplicate values.']
  },
  {
    id: 'ex-int-5',
    titleBg: 'Изчисление на Факториел',
    titleEn: 'Factorial Calculation',
    descBg: 'Напишете функция factorial(n), която връща n! (за n=5 -> 5*4*3*2*1 = 120). Отпечатайте factorial(5).',
    descEn: 'Write function factorial(n) returning n! (for n=5 -> 120). Print factorial(5).',
    level: 'intermediate',
    xp: 65,
    category: 'Алгоритми / Algorithms',
    starterCode: 'def factorial(n):\n    result = 1\n    for i in range(1, n + 1):\n        result *= i\n    return result\n\nprint(factorial(5))\n',
    solution: 'def factorial(n):\n    result = 1\n    for i in range(1, n + 1):\n        result *= i\n    return result\n\nprint(factorial(5))',
    expectedOutput: '120',
    hintsBg: ['Умножавайте result *= i в цикъл от 1 до n.'],
    hintsEn: ['Multiply result *= i in a loop from 1 to n.']
  },
  {
    id: 'ex-int-6',
    titleBg: 'Проверка за Палиндром',
    titleEn: 'Palindrome Checker',
    descBg: 'Напишете дума text = "радар". Проверете дали е палиндром (четена еднакво напред и назад) и отпечатайте True/False.',
    descEn: 'Word text = "radar". Check if it is a palindrome and print True/False.',
    level: 'intermediate',
    xp: 60,
    category: 'Текст & Логика / Strings & Logic',
    starterCode: 'text = "радар"\n# Сравнете text с text[::-1]\n',
    solution: 'text = "радар"\nis_palindrome = text == text[::-1]\nprint(is_palindrome)',
    expectedOutput: 'True',
    hintsBg: ['Сравнете text == text[::-1].'],
    hintsEn: ['Compare text == text[::-1].']
  },
  {
    id: 'ex-int-7',
    titleBg: 'Средно Аритметично от Списък',
    titleEn: 'Calculate List Average',
    descBg: 'Даден е списък grades = [6, 5, 6, 4, 5]. Изчислете средния успех (sum / len) и го отпечатайте.',
    descEn: 'Given list grades = [6, 5, 6, 4, 5]. Calculate average grade (sum / len) and print it.',
    level: 'intermediate',
    xp: 55,
    category: 'Списъци / Lists',
    starterCode: 'grades = [6, 5, 6, 4, 5]\n# Пресметнете средната стойност\n',
    solution: 'grades = [6, 5, 6, 4, 5]\navg = sum(grades) / len(grades)\nprint(avg)',
    expectedOutput: '5.2',
    hintsBg: ['sum(grades) / len(grades) дава средното аритметично.'],
    hintsEn: ['sum(grades) / len(grades) yields the average.']
  },
  {
    id: 'ex-int-8',
    titleBg: 'Броене на Гласните Букви',
    titleEn: 'Vowel Counter',
    descBg: 'Пребройте колко гласни букви (a, e, i, o, u) има в думата phrase = "education". Отпечатайте бройката.',
    descEn: 'Count how many vowels (a, e, i, o, u) are in phrase = "education". Print total count.',
    level: 'intermediate',
    xp: 65,
    category: 'Текст & Цикли / Strings & Loops',
    starterCode: 'phrase = "education"\nvowels = "aeiou"\n# Пребройте гласните\n',
    solution: 'phrase = "education"\nvowels = "aeiou"\ncount = sum(1 for char in phrase if char.lower() in vowels)\nprint(count)',
    expectedOutput: '5',
    hintsBg: ['Обходете всеки символ и проверете дали е в "aeiou".'],
    hintsEn: ['Iterate each character and check if it is in "aeiou".']
  },
  {
    id: 'ex-int-9',
    titleBg: 'Сортиране на Списък',
    titleEn: 'Sort Numbers List',
    descBg: 'Имате разбъркан списък nums = [34, 12, 89, 5, 23]. Сортирайте го във възходящ ред и го отпечатайте.',
    descEn: 'Given unsorted nums = [34, 12, 89, 5, 23]. Sort it ascending and print it.',
    level: 'intermediate',
    xp: 50,
    category: 'Списъци / Lists',
    starterCode: 'nums = [34, 12, 89, 5, 23]\n# Сортирайте с sorted() или .sort()\n',
    solution: 'nums = [34, 12, 89, 5, 23]\nprint(sorted(nums))',
    expectedOutput: '[5, 12, 23, 34, 89]',
    hintsBg: ['Функцията sorted(nums) връща нов сортиран списък.'],
    hintsEn: ['The sorted(nums) function returns a sorted list.']
  },
  {
    id: 'ex-int-10',
    titleBg: 'Честота на Букви в Речник',
    titleEn: 'Character Frequency Dictionary',
    descBg: 'За думата word = "banana", създайте речник с броя на всяка буква и отпечатайте речника.',
    descEn: 'For word = "banana", create a dict with character counts and print the dictionary.',
    level: 'intermediate',
    xp: 75,
    category: 'Речници / Dictionaries',
    starterCode: 'word = "banana"\nfreq = {}\nfor char in word:\n    freq[char] = freq.get(char, 0) + 1\nprint(freq)\n',
    solution: 'word = "banana"\nfreq = {}\nfor char in word:\n    freq[char] = freq.get(char, 0) + 1\nprint(freq)',
    expectedOutput: "{'b': 1, 'a': 3, 'n': 2}",
    hintsBg: ['Използвайте freq.get(char, 0) + 1.'],
    hintsEn: ['Use freq.get(char, 0) + 1.']
  },
  {
    id: 'ex-int-11',
    titleBg: 'Квадрати с List Comprehension',
    titleEn: 'Squares via List Comprehension',
    descBg: 'Създайте списък с квадратите на числата от 1 до 5 с List Comprehension и го отпечатайте.',
    descEn: 'Create a list of squares for numbers 1 to 5 using List Comprehension and print it.',
    level: 'intermediate',
    xp: 60,
    category: 'Списъци / Lists',
    starterCode: '# Направете [x**2 for x in range(1, 6)]\n',
    solution: 'squares = [x**2 for x in range(1, 6)]\nprint(squares)',
    expectedOutput: '[1, 4, 9, 16, 25]',
    hintsBg: ['Синтаксисът е [x**2 for x in range(1, 6)].'],
    hintsEn: ['Syntax: [x**2 for x in range(1, 6)].']
  },
  {
    id: 'ex-int-12',
    titleBg: 'Обединяване на Двойки (Zip)',
    titleEn: 'Pairing Elements with Zip',
    descBg: 'Имате names = ["Аня", "Борис"] и ages = [22, 28]. Обединете ги в речник с dict(zip(...)) и отпечатайте речника.',
    descEn: 'Combine names = ["Anya", "Boris"] and ages = [22, 28] into a dictionary using dict(zip(...)) and print it.',
    level: 'intermediate',
    xp: 70,
    category: 'Структури / Structures',
    starterCode: 'names = ["Аня", "Борис"]\nages = [22, 28]\n# Обединете с dict(zip(names, ages))\n',
    solution: 'names = ["Аня", "Борис"]\nages = [22, 28]\nresult = dict(zip(names, ages))\nprint(result)',
    expectedOutput: "{'Аня': 22, 'Борис': 28}",
    hintsBg: ['dict(zip(names, ages)) свързва двата списъка.'],
    hintsEn: ['dict(zip(names, ages)) merges both lists into key-values.']
  },

  // NEW ADVANCED EXERCISES (+6)
  {
    id: 'ex-adv-2',
    titleBg: 'Клас Банкова Сметка',
    titleEn: 'Bank Account Class',
    descBg: 'Създайте клас BankAccount с начален баланс 100. Добавете метод deposit(amount). Внесете 50 и отпечатайте баланса.',
    descEn: 'Create class BankAccount with initial balance 100. Add method deposit(amount). Deposit 50 and print balance.',
    level: 'advanced',
    xp: 90,
    category: 'ООП / Object Oriented Programming',
    starterCode: 'class BankAccount:\n    def __init__(self, balance=100):\n        self.balance = balance\n    def deposit(self, amount):\n        self.balance += amount\n\nacc = BankAccount()\nacc.deposit(50)\nprint(acc.balance)\n',
    solution: 'class BankAccount:\n    def __init__(self, balance=100):\n        self.balance = balance\n    def deposit(self, amount):\n        self.balance += amount\n\nacc = BankAccount()\nacc.deposit(50)\nprint(acc.balance)',
    expectedOutput: '150',
    hintsBg: ['Увеличете self.balance с amount в deposit().'],
    hintsEn: ['Increase self.balance by amount inside deposit().']
  },
  {
    id: 'ex-adv-3',
    titleBg: 'Прихващане на Изключения (Try-Except)',
    titleEn: 'Exception Handling (Try-Except)',
    descBg: 'Дефинирайте функция safe_divide(a, b), която при деление на 0 връща "Грешка: Деление на нула!", иначе връща a / b. Отпечатайте safe_divide(10, 0).',
    descEn: 'Define safe_divide(a, b) returning "Error: Zero division!" on ZeroDivisionError, else a / b. Print safe_divide(10, 0).',
    level: 'advanced',
    xp: 85,
    category: 'Изключения / Exception Handling',
    starterCode: 'def safe_divide(a, b):\n    try:\n        return a / b\n    except ZeroDivisionError:\n        return "Грешка: Деление на нула!"\n\nprint(safe_divide(10, 0))\n',
    solution: 'def safe_divide(a, b):\n    try:\n        return a / b\n    except ZeroDivisionError:\n        return "Грешка: Деление на нула!"\n\nprint(safe_divide(10, 0))',
    expectedOutput: 'Грешка: Деление на нула!',
    hintsBg: ['Използвайте block try/except ZeroDivisionError.'],
    hintsEn: ['Use try/except ZeroDivisionError block.']
  },
  {
    id: 'ex-adv-4',
    titleBg: 'Ламбда Функция & Filter',
    titleEn: 'Lambda & Filter Function',
    descBg: 'Използвайте filter() с lambda, за да извлечете числата над 10 от nums = [4, 15, 8, 23, 2, 11]. Отпечатайте ги като списък.',
    descEn: 'Use filter() with lambda to get numbers > 10 from nums = [4, 15, 8, 23, 2, 11]. Print result list.',
    level: 'advanced',
    xp: 95,
    category: 'Функционално Програмиране / Functional',
    starterCode: 'nums = [4, 15, 8, 23, 2, 11]\n# Филтрирайте с list(filter(lambda x: x > 10, nums))\n',
    solution: 'nums = [4, 15, 8, 23, 2, 11]\nfiltered = list(filter(lambda x: x > 10, nums))\nprint(filtered)',
    expectedOutput: '[15, 23, 11]',
    hintsBg: ['list(filter(lambda x: x > 10, nums)) отделя числата над 10.'],
    hintsEn: ['list(filter(lambda x: x > 10, nums)) isolates numbers > 10.']
  },
  {
    id: 'ex-adv-5',
    titleBg: 'Генератор за Редицата на Фибоначи',
    titleEn: 'Fibonacci Generator Function',
    descBg: 'Създайте генератор fib(n), който генерира първите n числа на Фибоначи. Отпечатайте ги като списък за n=6.',
    descEn: 'Create generator fib(n) yielding first n Fibonacci numbers. Print as list for n=6.',
    level: 'advanced',
    xp: 110,
    category: 'Генератори & Алгоритми / Generators',
    starterCode: 'def fib(n):\n    a, b = 0, 1\n    for _ in range(n):\n        yield a\n        a, b = b, a + b\n\nprint(list(fib(6)))\n',
    solution: 'def fib(n):\n    a, b = 0, 1\n    for _ in range(n):\n        yield a\n        a, b = b, a + b\n\nprint(list(fib(6)))',
    expectedOutput: '[0, 1, 1, 2, 3, 5]',
    hintsBg: ['Използвайте yield a вътре в цикъла.'],
    hintsEn: ['Use yield a inside the loop.']
  },
  {
    id: 'ex-adv-6',
    titleBg: 'Наследяване на Класове (Animal & Dog)',
    titleEn: 'Class Inheritance (Animal & Dog)',
    descBg: 'Клас Animal с метод speak() връща "Някакъв звук". Клас Dog наследява Animal и препокрива speak() да връща "Бау!". Отпечатайте Dog().speak().',
    descEn: 'Class Animal with method speak() returning "Some sound". Class Dog inherits Animal overriding speak() with "Woof!". Print Dog().speak().',
    level: 'advanced',
    xp: 100,
    category: 'ООП / Inheritance',
    starterCode: 'class Animal:\n    def speak(self):\n        return "Някакъв звук"\n\nclass Dog(Animal):\n    def speak(self):\n        return "Бау!"\n\nprint(Dog().speak())\n',
    solution: 'class Animal:\n    def speak(self):\n        return "Някакъв звук"\n\nclass Dog(Animal):\n    def speak(self):\n        return "Бау!"\n\nprint(Dog().speak())',
    expectedOutput: 'Бау!',
    hintsBg: ['Класът Dog(Animal) наследява базисния клас.'],
    hintsEn: ['Class Dog(Animal) inherits from base class.']
  },
  {
    id: 'ex-adv-7',
    titleBg: 'Магически Метод __str__',
    titleEn: 'Magic Method __str__',
    descBg: 'Създайте клас Person(name, age) с метод __str__, който връща "Лице: {name}, {age}г.". Отпечатайте str(Person("Алекс", 25)).',
    descEn: 'Create class Person(name, age) with __str__ method returning "Person: {name}, {age}y". Print str(Person("Alex", 25)).',
    level: 'advanced',
    xp: 90,
    category: 'ООП / Magic Methods',
    starterCode: 'class Person:\n    def __init__(self, name, age):\n        self.name = name\n        self.age = age\n    def __str__(self):\n        return f"Лице: {self.name}, {self.age}г."\n\nprint(str(Person("Алекс", 25)))\n',
    solution: 'class Person:\n    def __init__(self, name, age):\n        self.name = name\n        self.age = age\n    def __str__(self):\n        return f"Лице: {self.name}, {self.age}г."\n\nprint(str(Person("Алекс", 25)))',
    expectedOutput: 'Лице: Алекс, 25г.',
    hintsBg: ['Методът __str__ определя как обектът се превръща в текст.'],
    hintsEn: ['The __str__ method dictates string representation.']
  },

  // NEW KIDS EXERCISES (+4)
  {
    id: 'ex-kid-2',
    titleBg: 'Роботът Брои до 3',
    titleEn: 'Robot Counts to 3',
    descBg: 'Накарайте робота да отпечата "Стъпка 1", "Стъпка 2", "Стъпка 3" всяко на нов ред.',
    descEn: 'Make the robot print "Step 1", "Step 2", "Step 3" each on a new line.',
    level: 'kids',
    xp: 30,
    category: 'Детски Блокове / Kids Blocks',
    starterCode: 'for i in range(1, 4):\n    print(f"Стъпка {i}")\n',
    solution: 'for i in range(1, 4):\n    print(f"Стъпка {i}")',
    expectedOutput: 'Стъпка 1\nСтъпка 2\nСтъпка 3',
    hintsBg: ['Използвайте range(1, 4) за 3 стъпки.'],
    hintsEn: ['Use range(1, 4) for 3 steps.']
  },
  {
    id: 'ex-kid-3',
    titleBg: 'Калкулатор за Плодове',
    titleEn: 'Fruit Counter',
    descBg: 'Роботът има 4 ябълки и 3 круши. Отпечатайте "Общо плодове: 7".',
    descEn: 'Robot has 4 apples and 3 pears. Print "Total fruits: 7".',
    level: 'kids',
    xp: 25,
    category: 'Детски Блокове / Kids Blocks',
    starterCode: 'apples = 4\npears = 3\n# Пресметнете общо\n',
    solution: 'apples = 4\npears = 3\nprint(f"Общо плодове: {apples + pears}")',
    expectedOutput: 'Общо плодове: 7',
    hintsBg: ['Съберете apples + pears.'],
    hintsEn: ['Add apples + pears.']
  },
  {
    id: 'ex-kid-4',
    titleBg: 'Вълшебна Заря от Звезди',
    titleEn: 'Star Fireworks',
    descBg: 'Отпечатайте 5 звездички на един ред: *****.',
    descEn: 'Print 5 stars in a row: "*****".',
    level: 'kids',
    xp: 20,
    category: 'Детски Блокове / Kids Blocks',
    starterCode: '# Умножете "*" по 5\n',
    solution: 'print("*" * 5)',
    expectedOutput: '*****',
    hintsBg: ['Умножението на текст "*" * 5 повтаря знака.'],
    hintsEn: ['String multiplication "*" * 5 repeats the character.']
  },
  {
    id: 'ex-kid-5',
    titleBg: 'Роботът Поздравява по Име',
    titleEn: 'Robot Greets by Name',
    descBg: 'Създайте name = "Ники". Отпечатайте "Привет, Ники! Приятно програмиране!"',
    descEn: 'Create name = "Niki". Print "Hello, Niki! Happy coding!"',
    level: 'kids',
    xp: 25,
    category: 'Детски Блокове / Kids Blocks',
    starterCode: 'name = "Ники"\n# Поздравете Ники\n',
    solution: 'name = "Ники"\nprint(f"Привет, {name}! Приятно програмиране!")',
    expectedOutput: 'Привет, Ники! Приятно програмиране!',
    hintsBg: ['Използвайте f-string: f"Привет, {name}!..."'],
    hintsEn: ['Use f-string format.']
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
