export interface TurtleCommand {
  type: 'forward' | 'right' | 'left' | 'color' | 'clear' | 'circle' | 'penup' | 'pendown';
  value: number | string;
}

export interface ExecutionResult {
  output: string;
  error?: string;
  executionTimeMs: number;
  turtleCommands: TurtleCommand[];
  variables: Record<string, any>;
}

export function runPythonCode(code: string): ExecutionResult {
  const startTime = performance.now();
  let outputLogs: string[] = [];
  let turtleCmds: TurtleCommand[] = [];
  let errorMsg: string | undefined = undefined;

  // Global simulated scope
  const scope: Record<string, any> = {
    range: (start: number, stop?: number, step: number = 1) => {
      if (stop === undefined) {
        stop = start;
        start = 0;
      }
      const arr = [];
      for (let i = start; step > 0 ? i < stop : i > stop; i += step) {
        arr.push(i);
      }
      return arr;
    },
    len: (obj: any) => obj ? obj.length : 0,
    type: (val: any) => {
      if (typeof val === 'number') return Number.isInteger(val) ? "<class 'int'>" : "<class 'float'>";
      if (typeof val === 'string') return "<class 'str'>";
      if (Array.isArray(val)) return "<class 'list'>";
      if (typeof val === 'object') return "<class 'dict'>";
      return `<class '${typeof val}'>`;
    },
    int: (val: any) => parseInt(val, 10),
    float: (val: any) => parseFloat(val),
    str: (val: any) => String(val),
  };

  // Turtle mock
  const turtleMock = {
    forward: (dist: number) => turtleCmds.push({ type: 'forward', value: Number(dist) || 50 }),
    fd: (dist: number) => turtleCmds.push({ type: 'forward', value: Number(dist) || 50 }),
    right: (angle: number) => turtleCmds.push({ type: 'right', value: Number(angle) || 90 }),
    rt: (angle: number) => turtleCmds.push({ type: 'right', value: Number(angle) || 90 }),
    left: (angle: number) => turtleCmds.push({ type: 'left', value: Number(angle) || 90 }),
    lt: (angle: number) => turtleCmds.push({ type: 'left', value: Number(angle) || 90 }),
    pencolor: (color: string) => turtleCmds.push({ type: 'color', value: String(color) }),
    color: (color: string) => turtleCmds.push({ type: 'color', value: String(color) }),
    circle: (radius: number) => turtleCmds.push({ type: 'circle', value: Number(radius) || 30 }),
    clear: () => turtleCmds.push({ type: 'clear', value: 0 }),
    penup: () => turtleCmds.push({ type: 'penup', value: 0 }),
    pendown: () => turtleCmds.push({ type: 'pendown', value: 0 }),
  };

  try {
    // Basic syntax sanity checks
    const lines = code.split('\n');
    
    // Check missing colons on def/if/for/while
    for (let i = 0; i < lines.length; i++) {
      const line = lines[i].trim();
      if ((line.startsWith('if ') || line.startsWith('elif ') || line.startsWith('else') || line.startsWith('for ') || line.startsWith('while ') || line.startsWith('def ')) && !line.endsWith(':') && !line.includes('#')) {
        throw new SyntaxError(`Синтактична грешка на ред ${i + 1}: Пропуснат знак двоеточие ':' в края на ред "${line}"`);
      }
    }

    // Convert Python code to JS runnable string carefully
    let jsTranspiled = code;

    // Transpile comments (# -> //)
    jsTranspiled = jsTranspiled.replace(/#.*/g, '');

    // Transpile print(...)
    jsTranspiled = jsTranspiled.replace(/print\((.*?)\)/g, (_, args) => {
      return `__customPrint(${args});`;
    });

    // Transpile turtle module calls
    jsTranspiled = jsTranspiled.replace(/turtle\.(forward|fd|right|rt|left|lt|pencolor|color|circle|clear|penup|pendown)\((.*?)\)/g, (_, method, args) => {
      return `__turtle.${method}(${args});`;
    });

    // Transpile f-strings: f"Hello {name}" -> `Hello ${name}`
    jsTranspiled = jsTranspiled.replace(/f(["'])(.*?)\1/g, (_, quote, content) => {
      const interpolated = content.replace(/\{([^}]+)\}/g, '${$1}');
      return '`' + interpolated + '`';
    });

    // Transpile Python for i in range(...): -> for (let i of range(...)) {
    jsTranspiled = jsTranspiled.replace(/for\s+([a-zA-Z0-9_]+)\s+in\s+range\((.*?)\):/g, 'for (let $1 of range($2)) {');
    
    // Transpile Python for item in list: -> for (let item of list) {
    jsTranspiled = jsTranspiled.replace(/for\s+([a-zA-Z0-9_]+)\s+in\s+([a-zA-Z0-9_\[\]]+):/g, 'for (let $1 of $2) {');

    // Transpile if / elif / else:
    jsTranspiled = jsTranspiled.replace(/if\s+(.*?):/g, 'if ($1) {');
    jsTranspiled = jsTranspiled.replace(/elif\s+(.*?):/g, '} else if ($1) {');
    jsTranspiled = jsTranspiled.replace(/else:/g, '} else {');

    // Auto balance closing braces for indentation levels or simple blocks
    // Count open braces vs required blocks
    const openBlocksCount = (jsTranspiled.match(/\{/g) || []).length;
    const closeBlocksCount = (jsTranspiled.match(/\}/g) || []).length;
    if (openBlocksCount > closeBlocksCount) {
      jsTranspiled += '\n' + '}'.repeat(openBlocksCount - closeBlocksCount);
    }

    // Transpile Python booleans True/False and None -> true/false/null
    jsTranspiled = jsTranspiled.replace(/\bTrue\b/g, 'true')
                               .replace(/\bFalse\b/g, 'false')
                               .replace(/\bNone\b/g, 'null');

    // Transpile fetch variable name to _py_fetch to avoid window.fetch getter errors
    jsTranspiled = jsTranspiled.replace(/\bfetch\b/g, '_py_fetch');

    // Find all assigned variable names (e.g., "x = ...")
    const assignedVars = new Set<string>();
    const varAssignRegex = /(?:^|\n|\s*)([a-zA-Z_][a-zA-Z0-9_]*)\s*=(?!=)/g;
    let match;
    while ((match = varAssignRegex.exec(jsTranspiled)) !== null) {
      const varName = match[1];
      if (!['if', 'elif', 'else', 'for', 'while', 'def', 'class', 'return', 'import', 'from', 'pass', 'break', 'continue', 'and', 'or', 'not', 'in', 'is', 'lambda', 'try', 'except', 'finally', 'with', 'assert', 'raise', 'global', 'nonlocal', 'yield', 'let', 'const', 'var', 'window', 'document', 'location'].includes(varName)) {
        assignedVars.add(varName);
      }
    }

    assignedVars.add('input');

    const varDeclarationHeader = assignedVars.size > 0 ? `let ${Array.from(assignedVars).join(', ')};\n` : '';
    jsTranspiled = varDeclarationHeader + jsTranspiled;

    // Define helper print function
    const customPrint = (...args: any[]) => {
      const formatted = args.map(arg => {
        if (typeof arg === 'object') return JSON.stringify(arg);
        return String(arg);
      }).join(' ');
      outputLogs.push(formatted);
    };

    // Execute through Function constructor
    const runner = new Function(
      '__customPrint',
      '__turtle',
      'range',
      'len',
      'type',
      'int',
      'float',
      'str',
      'input',
      'sum',
      'max',
      'min',
      'abs',
      'round',
      'sorted',
      jsTranspiled
    );

    runner(
      customPrint,
      turtleMock,
      scope.range,
      scope.len,
      scope.type,
      scope.int,
      scope.float,
      scope.str,
      (promptStr?: string) => { if (promptStr) customPrint(promptStr); return "42"; },
      (arr: any[]) => Array.isArray(arr) ? arr.reduce((a, b) => a + b, 0) : 0,
      (...args: any[]) => Array.isArray(args[0]) ? Math.max(...args[0]) : Math.max(...args),
      (...args: any[]) => Array.isArray(args[0]) ? Math.min(...args[0]) : Math.min(...args),
      Math.abs,
      Math.round,
      (arr: any[]) => Array.isArray(arr) ? [...arr].sort((a, b) => (typeof a === 'number' && typeof b === 'number') ? a - b : String(a).localeCompare(String(b))) : arr
    );

  } catch (err: any) {
    errorMsg = err.message || 'Възникна грешка при изпълнение на Python кода.';
  }

  const endTime = performance.now();

  return {
    output: outputLogs.join('\n'),
    error: errorMsg,
    executionTimeMs: Math.round((endTime - startTime) * 100) / 100,
    turtleCommands: turtleCmds,
    variables: scope
  };
}
