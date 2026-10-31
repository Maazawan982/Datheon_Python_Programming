export interface FAQItem {
  id: string;
  intent: string;
  keywords: string[];
  regex_pattern: string;
  question: string;
  answer: string;
}

export interface ChatMessage {
  id: string;
  sender: 'user' | 'bot';
  text: string;
  timestamp: string;
  state?: 'INITIAL' | 'GREETING' | 'INTENT_IDENTIFICATION' | 'RESOLUTION' | 'EXIT';
  intent?: string;
  confidence?: number;
  matchedKeywords?: string[];
  regexRule?: string;
  isExit?: boolean;
}

export const SAMPLE_FAQS: FAQItem[] = [
  {
    id: 'faq_hours',
    intent: 'hours_of_operation',
    keywords: ['hours', 'operation', 'opening', 'open', 'timing', 'schedule', 'working hours'],
    regex_pattern: '\\b(hour|hours|timing|timings|open|opening|schedule|work\\s*hours)\\b',
    question: 'What are your hours of operation?',
    answer: 'We operate Monday through Friday from 9:00 AM to 6:00 PM IST.'
  },
  {
    id: 'faq_submission',
    intent: 'project_submission',
    keywords: ['submit', 'submission', 'internship', 'project', 'assignment', 'github', 'workspace'],
    regex_pattern: '\\b(submit|submission|submitting|project|assignment|github|repository|workspace)\\b',
    question: 'How do I submit my internship project?',
    answer: 'You can submit your public GitHub repository link through your Student Workspace.'
  },
  {
    id: 'faq_certificate',
    intent: 'certificate_issuance',
    keywords: ['certificate', 'receive', 'issued', 'completion', 'code review', 'cert'],
    regex_pattern: '\\b(cert|certificate|certificates|certified|receive|issued|review)\\b',
    question: 'When will I receive my certificate?',
    answer: 'Certificates are reviewed and issued within 3-5 business days after your code review.'
  },
  {
    id: 'faq_support',
    intent: 'contact_support',
    keywords: ['contact', 'support', 'help', 'email', 'phone', 'reach', 'mentor', 'assistance'],
    regex_pattern: '\\b(contact|support|reach|helpdesk|email|phone|mentor|human)\\b',
    question: 'How do I contact student support or my mentor?',
    answer: 'You can reach our student support team at support@datheon.edu or connect with your mentor through the Student Workspace portal.'
  },
  {
    id: 'faq_technical',
    intent: 'technical_requirements',
    keywords: ['requirements', 'python', 'version', 'system', 'install', 'environment', 'prerequisites'],
    regex_pattern: '\\b(python\\s*version|requirements|prerequisites|specs|hardware|system)\\b',
    question: 'What are the technical requirements for the Python track?',
    answer: 'You need Python 3.8 or higher installed, an IDE such as VS Code or PyCharm, and standard terminal access. Standard library modules (os, shutil, csv, re, json) are used.'
  },
  {
    id: 'faq_deadline',
    intent: 'deadline_extension',
    keywords: ['deadline', 'extension', 'late', 'due date', 'extend', 'delay'],
    regex_pattern: '\\b(deadline|extension|extend|due\\s*date|late\\s*submission)\\b',
    question: 'Can I request an extension on my project deadline?',
    answer: 'Yes, an extension of up to 48 hours can be requested via the \'Request Extension\' form inside your Student Workspace prior to the deadline.'
  },
  {
    id: 'faq_evaluation',
    intent: 'grading_criteria',
    keywords: ['grading', 'criteria', 'evaluation', 'score', 'rubric', 'reviewed', 'marks'],
    regex_pattern: '\\b(grade|grading|evaluation|rubric|score|criteria|marks|reviewed)\\b',
    question: 'How is my project evaluated?',
    answer: 'Projects are evaluated on four key pillars: functional requirements compliance (40%), code quality and organization (25%), unit test coverage (20%), and documentation (15%).'
  }
];

export const GREETINGS = [
  'hello', 'hi', 'hey', 'good morning', 'good afternoon', 'good evening', 'greetings', 'howdy'
];

export const EXIT_COMMANDS = [
  'bye', 'exit', 'quit', 'goodbye', 'cya', 'see you', 'leave', 'stop', 'end'
];

export const FALLBACK_RESPONSES = [
  "I'm sorry, I didn't quite catch that. You can ask about our hours of operation, how to submit internship projects, or when certificates are issued.",
  "I couldn't identify a matching topic. Could you please rephrase your question? (Type 'help' to view available topics)",
  "I specialize in answering questions about operational hours, project submissions, and certificate processing."
];

// Helper: Normalize input
export function normalizeText(text: string): string {
  return text.trim().toLowerCase().replace(/\s+/g, ' ');
}

// Helper: Tokenize keywords
const STOP_WORDS = new Set([
  'a', 'an', 'the', 'is', 'are', 'was', 'were', 'in', 'on', 'at', 'to', 'for', 'of',
  'with', 'my', 'your', 'our', 'do', 'does', 'can', 'will', 'i', 'you', 'we', 'they', 'me', 'it'
]);

export function extractTokens(text: string): string[] {
  const matches = text.toLowerCase().match(/\b[a-z0-9_\-']+\b/g) || [];
  return matches.filter((w) => !STOP_WORDS.has(w));
}

// Client-side rule engine matching Python RuleBasedChatbot
export function simulateChatbotResponse(userInput: string, currentState: string, turnCount: number) {
  const normalized = normalizeText(userInput);
  const now = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' });

  // 1. Exit check
  const exitRegex = new RegExp(`\\b(${EXIT_COMMANDS.join('|')})\\b`, 'i');
  if (exitRegex.test(normalized)) {
    return {
      response: 'Thank you for reaching out! Best of luck with your Python projects. Goodbye!',
      state: 'EXIT' as const,
      intent: 'exit',
      confidence: 1.0,
      matchedKeywords: ['exit_command'],
      regexRule: exitRegex.source,
      isExit: true,
      timestamp: now
    };
  }

  // 2. Help menu check
  const helpRegex = /\b(help|topics|commands|options|faq|faqs|menu)\b/i;
  if (helpRegex.test(normalized)) {
    const helpText = [
      'Here are the topics I can help you with:',
      '  1. Hours of Operation  -> "What are your hours of operation?"',
      '  2. Project Submission  -> "How do I submit my internship project?"',
      '  3. Certificates        -> "When will I receive my certificate?"',
      '  4. Mentor & Support    -> "How do I contact student support?"',
      '  5. Requirements        -> "What are the technical requirements?"',
      '  6. Deadlines           -> "Can I get an extension on my deadline?"',
      '  7. Grading Criteria    -> "How is my assignment evaluated?"',
      '',
      'Tip: You can type "exit", "quit", or "bye" at any time to leave.'
    ].join('\n');

    return {
      response: helpText,
      state: 'INTENT_IDENTIFICATION' as const,
      intent: 'help_menu',
      confidence: 1.0,
      matchedKeywords: ['help'],
      regexRule: helpRegex.source,
      isExit: false,
      timestamp: now
    };
  }

  // 3. Greeting check
  const greetingRegex = new RegExp(`\\b(${GREETINGS.join('|')})\\b`, 'i');
  if (greetingRegex.test(normalized) && normalized.split(' ').length <= 4) {
    return {
      response: 'Hello! Welcome to the Datheon Student Support Assistant. How can I help you today? You can ask about our hours of operation, internship project submissions, or certificate issuance.',
      state: 'GREETING' as const,
      intent: 'greeting',
      confidence: 1.0,
      matchedKeywords: ['greeting'],
      regexRule: greetingRegex.source,
      isExit: false,
      timestamp: now
    };
  }

  // 4. Gratitude check
  const thanksRegex = /\b(thanks|thank\s*you|thx|appreciated|great|awesome|perfect)\b/i;
  if (thanksRegex.test(normalized) && currentState === 'RESOLUTION') {
    return {
      response: "You're very welcome! Let me know if there's anything else I can clarify.",
      state: 'RESOLUTION' as const,
      intent: 'gratitude',
      confidence: 0.95,
      matchedKeywords: ['thanks'],
      regexRule: thanksRegex.source,
      isExit: false,
      timestamp: now
    };
  }

  // 5. Intent matching across FAQs
  let bestFaq: FAQItem | null = null;
  let bestConfidence = 0.0;
  let bestKeywords: string[] = [];

  const userTokens = new Set(extractTokens(normalized));

  for (const faq of SAMPLE_FAQS) {
    let conf = 0.0;
    const matches: string[] = [];
    const re = new RegExp(faq.regex_pattern, 'i');

    if (re.test(normalized)) {
      conf += 0.55;
      const regexMatch = normalized.match(re);
      if (regexMatch) matches.push(regexMatch[0]);
    }

    // Keyword overlap
    const kws = faq.keywords.map((k) => k.toLowerCase());
    const commonKws = kws.filter((k) => userTokens.has(k) || normalized.includes(k));
    if (commonKws.length > 0) {
      conf += 0.35 * (commonKws.length / Math.max(kws.length, 1));
      matches.push(...commonKws);
    }

    // Question token overlap
    const qTokens = extractTokens(faq.question);
    const commonQ = qTokens.filter((q) => userTokens.has(q));
    if (commonQ.length > 0) {
      conf += 0.3 * (commonQ.length / Math.max(qTokens.length, 1));
      matches.push(...commonQ);
    }

    const finalConf = Math.min(Math.round(conf * 100) / 100, 1.0);
    if (finalConf > bestConfidence) {
      bestConfidence = finalConf;
      bestFaq = faq;
      bestKeywords = Array.from(new Set(matches));
    }
  }

  if (bestFaq && bestConfidence >= 0.35) {
    return {
      response: bestFaq.answer,
      state: 'RESOLUTION' as const,
      intent: bestFaq.intent,
      confidence: bestConfidence,
      matchedKeywords: bestKeywords,
      regexRule: bestFaq.regex_pattern,
      isExit: false,
      timestamp: now
    };
  }

  // Fallback
  const fallbackMsg = FALLBACK_RESPONSES[turnCount % FALLBACK_RESPONSES.length];
  return {
    response: fallbackMsg,
    state: 'INTENT_IDENTIFICATION' as const,
    intent: 'fallback_unknown',
    confidence: bestConfidence,
    matchedKeywords: bestKeywords,
    regexRule: null,
    isExit: false,
    timestamp: now
  };
}
