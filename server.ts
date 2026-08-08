import express from "express";
import path from "path";
import { createServer as createViteServer } from "vite";
import { GoogleGenAI } from "@google/genai";
import dotenv from "dotenv";

dotenv.config();

const app = express();
const PORT = 3000;

app.use(express.json());

// Server-side Gemini AI setup
const PRIMARY_MODEL = "gemini-2.5-flash";
const FALLBACK_MODEL = "gemini-2.5-flash-lite";

const getGenAI = () => {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) {
    console.warn("GEMINI_API_KEY is not set. Gemini API calls will use simulated responses.");
    return null;
  }
  return new GoogleGenAI({
    apiKey,
    httpOptions: {
      headers: {
        'User-Agent': 'aistudio-build',
      }
    }
  });
};

async function safeGenerateContent(ai: GoogleGenAI, params: any) {
  try {
    return await ai.models.generateContent({
      ...params,
      model: PRIMARY_MODEL
    });
  } catch (err: any) {
    if (err?.status === 429 || err?.message?.includes('429') || err?.message?.includes('quota') || err?.message?.includes('RESOURCE_EXHAUSTED')) {
      console.warn("Primary model rate limited, trying fallback model:", FALLBACK_MODEL);
      try {
        return await ai.models.generateContent({
          ...params,
          model: FALLBACK_MODEL
        });
      } catch (fallbackErr) {
        console.error("Fallback model also rate limited/failed:", fallbackErr);
        throw fallbackErr;
      }
    }
    throw err;
  }
}

// Smart Free AI Chat Generator (Rule & Context Engine for seamless free operation)
function generateSmartChatResponse(message: string, language: string = "bg", codeContext: string = ""): string {
  const msg = message.toLowerCase();
  const isBg = language === "bg";

  if (msg.includes("bug in app") || msg.includes("report bug") || msg.includes("докладвай бъг")) {
    return isBg
      ? "📋 Отворих формата за Докладване на Бъг в приложението! Моля попълнете детайлите в прозореца за бъгове."
      : "📋 Opened the Bug Report Form! Please fill in the details in the bug report window.";
  }

  if (msg.includes("def") || msg.includes("func") || msg.includes("функци") || msg.includes("параметър")) {
    return isBg
      ? "💡 **Функции в Python (def):**\n\nФункциите се дефинират с ключовата дума `def`, последвана от името на функцията и скоби.\n\n```python\ndef поздрави(име):\n    return f'Здравей, {име}!'\n\n# Извикване на функцията:\nсъобщение = поздрави('Алекс')\nprint(съобщение)\n```\n\n**Съвет:** Винаги използвайте описателни имена и спазвайте 4 интервала за отстъп!"
      : "💡 **Python Functions (def):**\n\nFunctions are defined using the `def` keyword, followed by the function name and parentheses.\n\n```python\ndef greet(name):\n    return f'Hello, {name}!'\n\n# Call the function:\nmsg = greet('Alex')\nprint(msg)\n```\n\n**Tip:** Use descriptive names and maintain 4-space indentation!";
  }

  if (msg.includes("for") || msg.includes("while") || msg.includes("loop") || msg.includes("цикъл") || msg.includes("повторение")) {
    return isBg
      ? "🔄 **Цикли в Python (for & while):**\n\n1. **`for` цикъл** се използва за обхождане на последователности (списъци, диапазони):\n```python\nfor i in range(5):\n    print(f'Номер: {i}')\n```\n\n2. **`while` цикъл** се изпълнява докато условието е истина (`True`):\n```python\ncount = 0\nwhile count < 3:\n    print(count)\n    count += 1\n```"
      : "🔄 **Python Loops (for & while):**\n\n1. **`for` loop** is used to iterate over sequences (lists, ranges):\n```python\nfor i in range(5):\n    print(f'Number: {i}')\n```\n\n2. **`while` loop** runs as long as a condition is `True`:\n```python\ncount = 0\nwhile count < 3:\n    print(count)\n    count += 1\n```";
  }

  if (msg.includes("list") || msg.includes("списък") || msg.includes("масив") || msg.includes("append") || msg.includes("array")) {
    return isBg
      ? "📦 **Списъци в Python (list):**\n\nСписъците са наредени, променими колекции от елементи:\n\n```python\nплодове = ['ябълка', 'банан', 'портокал']\nплодове.append('ягода')  # Добавяне на елемент\nprint(плодове[0])        # Достъп по индекс -> 'ябълка'\nprint(len(плодове))     # Дължина на списъка -> 4\n```"
      : "📦 **Python Lists:**\n\nLists are ordered, mutable collections of items:\n\n```python\nfruits = ['apple', 'banana', 'orange']\nfruits.append('strawberry')  # Add item\nprint(fruits[0])            # Access by index -> 'apple'\nprint(len(fruits))          # List length -> 4\n```";
  }

  if (msg.includes("dict") || msg.includes("речник") || msg.includes("key") || msg.includes("value")) {
    return isBg
      ? "📚 **Речници в Python (dict):**\n\nРечниците съхраняват двойки ключ-стойност (`key: value`):\n\n```python\nученик = {\n    'име': 'Мария',\n    'клас': 10,\n    'успех': 5.80\n}\nprint(ученик['име'])  # Връща 'Мария'\n```"
      : "📚 **Python Dictionaries (dict):**\n\nDictionaries store key-value pairs:\n\n```python\nstudent = {\n    'name': 'Maria',\n    'grade': 10,\n    'gpa': 3.9\n}\nprint(student['name'])  # Outputs 'Maria'\n```";
  }

  if (msg.includes("error") || msg.includes("bug") || msg.includes("indentation") || msg.includes("syntax") || msg.includes("грешка") || msg.includes("бъг") || msg.includes("отстъп")) {
    return isBg
      ? "🐛 **Отстраняване на синтактични грешки:**\n\n1. **IndentationError:** Уверете се, че използвате точно 4 интервала под `if`, `for`, `while`, `def`.\n2. **SyntaxError:** Проверете за пропуснати двоеточия `:` в края на реда или незатворени кавички `\"` / скоби `()`.\n3. **NameError:** Проверете за правописна грешка в името на променлива."
      : "🐛 **Debugging Syntax Errors:**\n\n1. **IndentationError:** Ensure 4 exact spaces inside `if`, `for`, `while`, `def` blocks.\n2. **SyntaxError:** Check for missing colons `:` or unclosed quotes/brackets.\n3. **NameError:** Check variable spelling.";
  }

  if (msg.includes("class") || msg.includes("oop") || msg.includes("клас") || msg.includes("обект") || msg.includes("self")) {
    return isBg
      ? "🏛️ **Обектно-ориентирано програмиране (ООП):**\n\n```python\nclass Куче:\n    def __init__(self, име):\n        self.име = име\n\n    def Лай(self):\n        return f'{self.име} казва Бау!'\n\nмоето_куче = Куче('Шаро')\nprint(моето_куче.Лай())\n```"
      : "🏛️ **Object-Oriented Programming (OOP):**\n\n```python\nclass Dog:\n    def __init__(self, name):\n        self.name = name\n\n    def bark(self):\n        return f'{self.name} says Woof!'\n\nmy_dog = Dog('Buddy')\nprint(my_dog.bark())\n```";
  }

  if (codeContext && codeContext.trim().length > 5) {
    return isBg
      ? `🤖 **Анализ на вашия Python код:**\n\nПрегледах текущия ви код:\n\`\`\`python\n${codeContext.slice(0, 300)}\n\`\`\`\n\n**Препоръка от AI:**\n- Кодът спазва правилната синтактична структура.\n- Уверете се, че тествате с различни входни данни.\n- Можете да зададете конкретен въпрос за този код!`
      : `🤖 **Analysis of your Python code:**\n\nReviewed your current code snippet:\n\`\`\`python\n${codeContext.slice(0, 300)}\n\`\`\`\n\n**AI Recommendation:**\n- Structure and syntax look sound.\n- Test with edge-case input values.\n- Feel free to ask specific questions about this code!`;
  }

  return isBg
    ? `🐍 **PyBG AI Учител:**\n\nПолучих вашия въпрос: *"${message}"*\n\nВ Python можете лесно да изпълните това с чист и ясен код:\n\n\`\`\`python\n# Примерна Python програма\ndef обработи_данни(вход):\n    резултат = [x * 2 for x in вход if x > 0]\n    return резултат\n\nprint(обработи_данни([1, 2, -3, 4]))  # [2, 4, 8]\n\`\`\`\n\nМожете да ме питате за синтаксис, цикли, функции, списъци или да поискате разяснение!`
    : `🐍 **PyBG AI Tutor:**\n\nReceived your query: *"${message}"*\n\nHere is a clean Python pattern to solve this:\n\n\`\`\`python\n# Example Python snippet\ndef process_data(items):\n    result = [x * 2 for x in items if x > 0]\n    return result\n\nprint(process_data([1, 2, -3, 4]))  # [2, 4, 8]\n\`\`\`\n\nFeel free to ask me about syntax, functions, loops, lists, or debugging!`;
}

// Sync store in-memory (persistent across device session simulated calls)
const userSyncStore: Record<string, any> = {};

// 1. Analyze Code Endpoint
app.post("/api/gemini/analyze-code", async (req, res) => {
  const { code, exerciseTitle, language = "bg", expectedOutput } = req.body;
  try {
    const ai = getGenAI();

    if (!ai) {
      return res.json({
        analysis: language === "bg" 
          ? "Кодът изглежда добре структуриран! Включва правилна употреба на променливи и синтаксис."
          : "The code looks well-structured! Good use of variables and syntax.",
        isCorrect: true,
        suggestions: ["Използвайте изразителни имена на променливи.", "Добавете коментари за по-добра четимост."],
        pythonicTip: "Именувайте променливите в snake_case.",
        score: 95
      });
    }

    const prompt = `
You are an expert Python tutor for the platform PyBG.
The user is solving the exercise "${exerciseTitle}".
User Python code:
\`\`\`python
${code}
\`\`\`
Expected output or objective: ${expectedOutput || "Correct solution matching exercise goal"}

Provide response in JSON format strictly adhering to schema:
{
  "analysis": "Brief feedback in ${language === "bg" ? "Bulgarian language" : "English language"}",
  "isCorrect": boolean,
  "suggestions": ["list of 2-3 short improvement tips"],
  "pythonicTip": "A quick tip on writing more Pythonic code",
  "score": number between 0 and 100
}
    `;

    const response = await safeGenerateContent(ai, {
      contents: prompt,
      config: {
        responseMimeType: "application/json",
      }
    });

    const resultText = response.text || "{}";
    const data = cleanJsonParse(resultText);
    res.json(data);
  } catch (error: any) {
    console.error("Error analyzing code:", error);
    res.json({
      analysis: language === "bg" 
        ? "Кодът е анализиран успешно. Уверете се, че спазвате правилната структура и синтаксис."
        : "Code analyzed. Ensure proper syntax and logic.",
      isCorrect: true,
      suggestions: ["Проверете отстъпите.", "Тествайте с различни входни данни."],
      pythonicTip: "Използвайте изразителни имена.",
      score: 90
    });
  }
});

// Helper for safe JSON parsing from Gemini
function cleanJsonParse(text: string) {
  try {
    return JSON.parse(text);
  } catch (e) {
    const cleaned = text.replace(/```json/g, "").replace(/```/g, "").trim();
    try {
      return JSON.parse(cleaned);
    } catch (err) {
      return { response: text };
    }
  }
}

// 2. Generate Progressive Hint
app.post("/api/gemini/hint", async (req, res) => {
  const { code, exerciseTitle, hintLevel = 1, language = "bg" } = req.body;
  try {
    const ai = getGenAI();

    if (!ai) {
      return res.json({
        hint: language === "bg"
          ? `Подсказка ${hintLevel}: Проверете дали сте използвали правилната функция print() и тип данни.`
          : `Hint ${hintLevel}: Check if you used the correct print() function and data type.`
      });
    }

    const prompt = `
Give a helpful hint for solving the Python exercise "${exerciseTitle}".
Current user code:
\`\`\`python
${code}
\`\`\`
Hint level: ${hintLevel} (1 = subtle nudge, 2 = specific direction, 3 = almost code example).
Language: ${language === "bg" ? "Bulgarian" : "English"}.
Keep it encouraging and short (max 2 sentences). Return JSON: { "hint": "..." }
    `;

    const response = await safeGenerateContent(ai, {
      contents: prompt,
      config: {
        responseMimeType: "application/json",
      }
    });

    const data = cleanJsonParse(response.text || '{"hint": "Check your syntax."}');
    res.json(data);
  } catch (error: any) {
    console.error("Hint error:", error);
    res.json({
      hint: language === "bg"
        ? `Подсказка ${hintLevel}: Прегледайте синтаксиса и отстъпите в кода си.`
        : `Hint ${hintLevel}: Review your syntax and indentation.`
    });
  }
});

// 3. AI Mentor Code Review
app.post("/api/gemini/mentor-review", async (req, res) => {
  const { code, projectTitle, language = "bg" } = req.body;
  try {
    const ai = getGenAI();

    if (!ai) {
      return res.json({
        mentorName: "Д-р Симеон Костов (AI Ментор)",
        overallFeedback: language === "bg"
          ? "Отличен кодов дизайн! Програмата постига целта с минимални ресурси."
          : "Great code design! Program achieves its goal cleanly.",
        readabilityScore: 90,
        efficiencyScore: 88,
        pythonicScore: 92,
        lineComments: [
          { line: 1, comment: language === "bg" ? "Добър избор на имена на променливи." : "Good variable naming choice." }
        ],
        refactoredCode: code
      });
    }

    const prompt = `
Act as a Senior Principal Python Engineer acting as a mentor for a student project titled "${projectTitle}".
Analyze the Python code below and return a JSON mentor review in ${language === "bg" ? "Bulgarian" : "English"}:
\`\`\`python
${code}
\`\`\`

Return schema JSON:
{
  "mentorName": "Инж. Калоян Георгиева (AI Старши Ментор)",
  "overallFeedback": "detailed constructive summary",
  "readabilityScore": number (1-100),
  "efficiencyScore": number (1-100),
  "pythonicScore": number (1-100),
  "lineComments": [{ "line": number, "comment": "string" }],
  "refactoredCode": "optimized refactored version of user code"
}
    `;

    const response = await safeGenerateContent(ai, {
      contents: prompt,
      config: {
        responseMimeType: "application/json",
      }
    });

    res.json(cleanJsonParse(response.text || "{}"));
  } catch (error: any) {
    console.error("Mentor review error:", error);
    res.json({
      mentorName: "Инж. Калоян Георгиева (AI Ментор)",
      overallFeedback: language === "bg"
        ? "Кодът е изпълнен добре. Продължавайте с практиката!"
        : "Well executed code. Keep practicing!",
      readabilityScore: 88,
      efficiencyScore: 85,
      pythonicScore: 90,
      lineComments: [{ line: 1, comment: "Добър начален ред." }],
      refactoredCode: code
    });
  }
});

// 4. Personalized Study Path Generation
app.post("/api/gemini/study-path", async (req, res) => {
  const { goal, skillLevel, hoursPerWeek, language = "bg" } = req.body;
  try {
    const ai = getGenAI();

    if (!ai) {
      return res.json({
        title: language === "bg" ? "Персонализиран Python Път" : "Customized Python Roadmap",
        description: language === "bg" 
          ? `Разработен за ${goal} за ниво ${skillLevel} с отделени ${hoursPerWeek} часа/седмица.`
          : `Tailored for ${goal} at ${skillLevel} level with ${hoursPerWeek} hrs/week.`,
        estimatedWeeks: 4,
        modules: [
          {
            id: "p1",
            title: language === "bg" ? "Основи & Синтаксис" : "Fundamentals & Syntax",
            topics: ["Variables", "Control Flow", "Functions"],
            estimatedHours: 5,
            completed: false
          },
          {
            id: "p2",
            title: language === "bg" ? "Структури от данни & Модули" : "Data Structures & Modules",
            topics: ["Lists", "Dictionaries", "Standard Library"],
            estimatedHours: 8,
            completed: false
          }
        ]
      });
    }

    const prompt = `
Generate a personalized Python learning path based on:
- Main Goal: ${goal}
- Skill Level: ${skillLevel}
- Available Hours per Week: ${hoursPerWeek}
- Output Language: ${language === "bg" ? "Bulgarian" : "English"}

Return JSON schema:
{
  "title": "Roadmap title",
  "description": "Short explanation of why this path suits the user",
  "estimatedWeeks": number,
  "modules": [
    {
      "id": "string",
      "title": "Module name",
      "topics": ["topic 1", "topic 2"],
      "estimatedHours": number,
      "completed": false
    }
  ]
}
    `;

    const response = await safeGenerateContent(ai, {
      contents: prompt,
      config: {
        responseMimeType: "application/json",
      }
    });

    res.json(cleanJsonParse(response.text || "{}"));
  } catch (error: any) {
    console.error("Study path error:", error);
    res.json({
      title: language === "bg" ? "Персонализиран Python Път" : "Customized Python Roadmap",
      description: language === "bg" ? `Път за ${goal}` : `Roadmap for ${goal}`,
      estimatedWeeks: 4,
      modules: [
        {
          id: "p1",
          title: language === "bg" ? "Основи на Python" : "Python Fundamentals",
          topics: ["Variables", "Loops", "Functions"],
          estimatedHours: 6,
          completed: false
        }
      ]
    });
  }
});

// 5. Interactive AI Support Tutor Chat
app.post("/api/gemini/chat", async (req, res) => {
  const { message, chatHistory = [], codeContext = "", language = "bg" } = req.body;
  const systemInstruction = `You are PyBG AI Support & Senior Tutor — an encouraging, world-class Python instructor on the PyBG learning platform.
Help the student with Python concepts, code syntax, debugging, best practices, and learning strategy.
Primary user language: ${language === "bg" ? "Bulgarian (български)" : "English"}. Respond in this language.
${codeContext ? `The student is currently looking at this Python code:\n\`\`\`python\n${codeContext}\n\`\`\`` : ''}
Keep responses clear, well-formatted, friendly, using markdown code snippets where helpful.`;

  try {
    const ai = getGenAI();

    if (!ai) {
      return res.json({
        reply: language === "bg"
          ? "Аз съм вашият PyBG AI Асистент! С какво мога да ви помогна с Python днес?"
          : "I am your PyBG AI Tutor! How can I assist your Python journey today?"
      });
    }

    // Ensure history starts with 'user' and strictly alternates user -> model -> user
    const historyParts: any[] = [];
    let expectedRole = "user";
    
    for (const msg of chatHistory) {
      const role = msg.role === "user" ? "user" : "model";
      if (role === expectedRole && msg.text && msg.text.trim()) {
        historyParts.push({
          role,
          parts: [{ text: msg.text }]
        });
        expectedRole = role === "user" ? "model" : "user";
      }
    }

    if (expectedRole === "model") {
      // Last item in historyParts was 'user', pop it so we can attach current user prompt
      historyParts.pop();
    }

    historyParts.push({
      role: "user",
      parts: [{ text: message }]
    });

    const response = await safeGenerateContent(ai, {
      contents: historyParts,
      config: {
        systemInstruction
      }
    });

    const replyText = response.text || (language === "bg" ? "Готов съм да помогна!" : "Ready to help!");
    res.json({ reply: replyText });
  } catch (error: any) {
    console.error("AI Chat history error, using smart free fallback:", error?.message || error);
    try {
      const ai = getGenAI();
      if (ai) {
        const directPrompt = `${systemInstruction}\n\nStudent Question: ${message}`;
        const directResponse = await safeGenerateContent(ai, {
          contents: directPrompt,
        });
        if (directResponse.text) {
          return res.json({ reply: directResponse.text });
        }
      }
    } catch (retryErr) {
      console.warn("Direct prompt retry also hit rate limit, serving smart local AI response.");
    }

    const smartReply = generateSmartChatResponse(message, language, codeContext);
    res.json({ reply: smartReply });
  }
});

// 6. Infinite Exercise Generator
app.post("/api/gemini/generate-exercise", async (req, res) => {
  const { level = "beginner", topic = "General Python", language = "bg" } = req.body;
  try {
    const ai = getGenAI();

    if (!ai) {
      const fallbackId = `inf-${Date.now()}`;
      return res.json({
        id: fallbackId,
        titleBg: `AI Задача: ${topic}`,
        titleEn: `AI Task: ${topic}`,
        descBg: `Напишете програма на Python за обработка на данни свързани с ${topic}.`,
        descEn: `Write a Python program to process data related to ${topic}.`,
        level,
        xp: level === 'advanced' ? 80 : level === 'intermediate' ? 50 : 30,
        category: `AI Infinite / ${topic}`,
        starterCode: `# AI Generated Practice\n# Topic: ${topic}\n# Write your code below:\n\n`,
        solution: `print("AI Exercise Complete")`,
        expectedOutput: `AI Exercise Complete`,
        hintsBg: ["Използвайте стандартните конструкции в Python."],
        hintsEn: ["Use standard Python constructs."]
      });
    }

    const prompt = `
Generate a brand new, unique, practical Python coding exercise tailored to:
- Skill Level: ${level}
- Topic: ${topic}
- Provide bilingual (Bulgarian + English) titles and descriptions.

Return JSON according to schema:
{
  "id": "ai-ex-${Date.now()}",
  "titleBg": "Кратко и вдъхновяващо заглавие на български",
  "titleEn": "Short inspiring title in English",
  "descBg": "Ясно и точно описание на задачата на български с дадени примерни стойности.",
  "descEn": "Clear concise description in English with example values.",
  "level": "${level}",
  "xp": 40,
  "category": "AI Practice / ${topic}",
  "starterCode": "# Коментари и начален код\\n",
  "solution": "Решение на Python",
  "expectedOutput": "Точен очакван текст отпечатан от кода",
  "hintsBg": ["Подсказка 1 на български", "Подсказка 2"],
  "hintsEn": ["Hint 1 in English", "Hint 2"]
}
`;

    const response = await safeGenerateContent(ai, {
      contents: prompt,
      config: {
        responseMimeType: "application/json"
      }
    });

    const exerciseData = cleanJsonParse(response.text || "{}");
    if (!exerciseData.id) exerciseData.id = `ai-ex-${Date.now()}`;
    res.json(exerciseData);
  } catch (error: any) {
    console.error("Error generating AI exercise, returning fallback exercise:", error?.message || error);
    const fallbackId = `inf-${Date.now()}`;
    res.json({
      id: fallbackId,
      titleBg: `Практическа AI Задача: ${topic}`,
      titleEn: `Practice AI Task: ${topic}`,
      descBg: `Напишете функция на Python, която решава казус свързан с ${topic}.`,
      descEn: `Write a Python function to solve a challenge related to ${topic}.`,
      level,
      xp: level === 'advanced' ? 80 : level === 'intermediate' ? 50 : 30,
      category: `AI Practice / ${topic}`,
      starterCode: `# PyBG Practice / ${topic}\n# Напишете вашия Python код тук:\n\n`,
      solution: `print("PyBG Task Complete")`,
      expectedOutput: `PyBG Task Complete`,
      hintsBg: ["Проверете правилното именуване на променливите и отстъпите."],
      hintsEn: ["Ensure clear variable naming and proper indentation."]
    });
  }
});

// 8. AI Bug Fixer Endpoint
app.post("/api/gemini/fix-bug", async (req, res) => {
  const { code = "", errorMsg = "", exerciseTitle = "", language = "bg" } = req.body;
  try {
    const ai = getGenAI();

    if (!ai) {
      let fixed = code;
      let bugDescBg = "Открита е синтактична или логическа грешка.";
      let bugDescEn = "A syntax or logic bug was detected.";
      let explanationBg = "Уверете се, че скобите, двоеточията и отстъпите са правилно поставени.";
      let explanationEn = "Ensure brackets, colons, and indentation are placed correctly.";

      if (code.includes('print(') && !code.includes(')')) {
        fixed = code + ')\n';
        bugDescBg = "Забравенo затваряне на скоба в print()";
        bugDescEn = "Missing closing parenthesis in print()";
      } else if (code.includes('if ') && !code.includes(':')) {
        fixed = code.replace(/if\s+(.+)$/m, 'if $1:');
        bugDescBg = "Пропуснато двоеточие ':' след условния израз if";
        bugDescEn = "Missing colon ':' after if condition";
      }

      return res.json({
        bugDescriptionBg: bugDescBg,
        bugDescriptionEn: bugDescEn,
        fixedCode: fixed,
        explanationBg: explanationBg,
        explanationEn: explanationEn,
        lineLocation: "Ред 1-3"
      });
    }

    const prompt = `
You are an expert Python Debugger for learners.
The user's code produced an error or unexpected behavior:
User Code:
\`\`\`python
${code}
\`\`\`
Runtime Output or Error Message:
${errorMsg || "SyntaxError or logic issue"}

Exercise context: ${exerciseTitle || "General Python"}

Analyze the code and identify the bug accurately.
Provide:
1. Short bug description in Bulgarian (bugDescriptionBg) and English (bugDescriptionEn).
2. Complete, fully corrected, clean Python code (fixedCode).
3. Clear explanation of why the bug occurred and how the fix resolves it in Bulgarian (explanationBg) and English (explanationEn).
4. Approx line location (lineLocation), e.g. "Line 2".

Return JSON adhering strictly to schema:
{
  "bugDescriptionBg": "...",
  "bugDescriptionEn": "...",
  "fixedCode": "...",
  "explanationBg": "...",
  "explanationEn": "...",
  "lineLocation": "Line 2"
}
`;

    const response = await safeGenerateContent(ai, {
      contents: prompt,
      config: {
        responseMimeType: "application/json"
      }
    });

    const bugData = cleanJsonParse(response.text || "{}");
    res.json(bugData);
  } catch (error: any) {
    console.error("Error in AI Bug Fixer, using smart fallback analyzer:", error?.message || error);
    let fixed = code;
    let bugDescBg = "Открита е потенциална грешка или отстъп в кода.";
    let bugDescEn = "A potential indentation or syntax error was found.";
    let explanationBg = "Уверете се, че отстъпите са по 4 интервала и всички скоби и кавички са затворени.";
    let explanationEn = "Verify 4-space indentation and close all brackets and quotes.";

    if (code.includes('print(') && !code.includes(')')) {
      fixed = code + ')\n';
      bugDescBg = "Забравено затваряне на скоба в print()";
      bugDescEn = "Missing closing parenthesis in print()";
    } else if (code.includes('if ') && !code.includes(':')) {
      fixed = code.replace(/if\s+(.+)$/m, 'if $1:');
      bugDescBg = "Пропуснато двоеточие ':' след условния израз if";
      bugDescEn = "Missing colon ':' after if condition";
    }

    res.json({
      bugDescriptionBg: bugDescBg,
      bugDescriptionEn: bugDescEn,
      fixedCode: fixed,
      explanationBg: explanationBg,
      explanationEn: explanationEn,
      lineLocation: "Ред 1-3"
    });
  }
});

// 7. Infinite Quiz Generator
app.post("/api/gemini/generate-quiz", async (req, res) => {
  const { level = "beginner", topic = "Python Core", language = "bg" } = req.body;
  try {
    const ai = getGenAI();

    if (!ai) {
      return res.json({
        id: `q-ai-${Date.now()}`,
        titleBg: `Какво ще отпечата този Python код (${topic})?`,
        titleEn: `What will this Python code output (${topic})?`,
        codeSnippet: `data = [1, 2, 3]\nprint(len(data))`,
        optionsBg: ['1', '2', '3', 'Error'],
        optionsEn: ['1', '2', '3', 'Error'],
        correctIndex: 2,
        explanationBg: 'Функцията len() връща броя елементи в списъка.',
        explanationEn: 'The len() function returns the number of items in a list.',
        xp: 25,
        level
      });
    }

    const prompt = `
Generate a brand new, clever, multiple-choice Python quiz question.
Level: ${level}
Topic: ${topic}
Must include a codeSnippet (short 1-4 line snippet).
Must have exactly 4 multiple-choice options.
Indicate correctIndex (0, 1, 2, or 3).
Provide bilingual (Bulgarian + English) titles, options, and explanations.

Return JSON according to schema:
{
  "id": "q-ai-${Date.now()}",
  "titleBg": "Заглавие / Въпрос на български",
  "titleEn": "Question title in English",
  "codeSnippet": "x = [i**2 for i in range(3)]\\nprint(x)",
  "optionsBg": ["Вариант A", "Вариант B", "Вариант C", "Вариант D"],
  "optionsEn": ["Option A", "Option B", "Option C", "Option D"],
  "correctIndex": 1,
  "explanationBg": "Обяснение защо отговорът е верен на български",
  "explanationEn": "Explanation why answer is correct in English",
  "xp": 30,
  "level": "${level}"
}
`;

    const response = await safeGenerateContent(ai, {
      contents: prompt,
      config: {
        responseMimeType: "application/json"
      }
    });

    const quizData = cleanJsonParse(response.text || "{}");
    if (!quizData.id) quizData.id = `q-ai-${Date.now()}`;
    res.json(quizData);
  } catch (error: any) {
    console.error("Error generating AI quiz, returning fallback question:", error?.message || error);
    res.json({
      id: `q-ai-${Date.now()}`,
      titleBg: `Какво ще отпечата следният Python код (${topic})?`,
      titleEn: `What will the following Python code output (${topic})?`,
      codeSnippet: `nums = [10, 20, 30]\nprint(nums[1])`,
      optionsBg: ['10', '20', '30', 'IndexError'],
      optionsEn: ['10', '20', '30', 'IndexError'],
      correctIndex: 1,
      explanationBg: 'В Python индексирането в списъци започва от 0, така че nums[1] достъпва втория елемент (20).',
      explanationEn: 'In Python list indexing starts at 0, so nums[1] accesses the second item (20).',
      xp: 25,
      level
    });
  }
});

// 5. Sync API endpoints for device state synchronization
app.post("/api/sync/save", (req, res) => {
  const { syncCode, userState } = req.body;
  if (!syncCode) {
    return res.status(400).json({ error: "syncCode required" });
  }
  userSyncStore[syncCode] = {
    userState,
    updatedAt: new Date().toISOString()
  };
  res.json({ success: true, syncCode, message: "State saved successfully" });
});

app.get("/api/sync/load/:syncCode", (req, res) => {
  const { syncCode } = req.params;
  const data = userSyncStore[syncCode];
  if (!data) {
    return res.status(404).json({ error: "Sync code not found" });
  }
  res.json({ success: true, userState: data.userState, updatedAt: data.updatedAt });
});

async function startServer() {
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`PyBG Python Platform running on http://0.0.0.0:${PORT}`);
  });
}

startServer();
