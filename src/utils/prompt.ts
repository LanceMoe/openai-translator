import { DEFAULT_TRANSLATE_STYLE, Language, LANGUAGES, TranslateStyle } from '@/constants';

const STYLE_PROMPT_MAP: Record<TranslateStyle, { name: string; guide: string; polishGuide: string }> = {
  general: {
    name: 'General & Accurate',
    guide:
      'Maintain an accurate, natural, and fluent tone adhering to "Faithfulness, Expressiveness, and Elegance" (信达雅). Ensure native readability while preserving the exact meaning and nuances.',
    polishGuide:
      'Improve clarity, fluency, and readability. Correct grammar and syntax errors while preserving the original meaning and tone.',
  },
  academic: {
    name: 'Academic & Rigorous',
    guide:
      'Use formal, objective, and scholarly terminology. Maintain rigorous sentence structures and discipline-specific vocabulary. Preserve all academic citations, formulas, and references.',
    polishGuide:
      'Refine the text to meet high academic publishing standards. Enhance scholarly precision, objectivity, formal vocabulary, and structural coherence.',
  },
  technical: {
    name: 'Technical & Developer',
    guide:
      'Use standard IT and engineering terminology. Strictly preserve code blocks, inline code, variable/function names, CLI commands, and technical identifiers without translating them.',
    polishGuide:
      'Enhance technical clarity, conciseness, and precision. Ensure developer terminology and code references are accurate and unambiguous.',
  },
  business: {
    name: 'Business & Formal',
    guide:
      'Use a polished, professional, diplomatic, and respectful tone suitable for enterprise communications, executive summaries, emails, and commercial reports.',
    polishGuide:
      'Polish into persuasive, courteous, and professional business language. Optimize for executive clarity and professional etiquette.',
  },
  colloquial: {
    name: 'Colloquial & Casual',
    guide:
      'Use natural, lively, and culturally authentic everyday spoken expressions. Adapt idioms and phrasing to sound like a native speaker in casual conversation.',
    polishGuide:
      'Make the phrasing more natural, relaxed, and conversational. Smooth out stiff or robotic expressions into authentic spoken language.',
  },
  literary: {
    name: 'Literary & Elegant',
    guide:
      'Focus on artistic resonance, rhythm, imagery, and evocative phrasing. Preserve the author’s voice and stylistic atmosphere with rich, nuanced vocabulary.',
    polishGuide:
      'Elevate stylistic elegance, rhythm, and expressive depth. Enrich vocabulary and figurative phrasing while maintaining emotional resonance.',
  },
};

function getTargetLangInstruction(toLang: Language): string {
  if (toLang === 'zh-Hant') {
    return 'Traditional Chinese (繁體中文) using standard Taiwan terminology and phrasing (台灣用語，如：軟體、程式、伺服器)';
  }
  if (toLang === 'zh-Hans') {
    return 'Simplified Chinese (简体中文) using standard mainland terminology and conventions';
  }
  if (toLang === 'yue') {
    return 'Cantonese (粵語白話文) using authentic Cantonese vocabulary and grammar (如：嘅、咗、喺、哋)';
  }
  if (toLang === 'wyw') {
    return 'Classical Chinese (文言文) with authentic classical grammar, concise diction, and archaic syntax';
  }
  if (toLang === 'ja') {
    return 'Japanese (日本語) with natural phrasing and appropriate honorific levels (です/ます)';
  }
  if (toLang === 'ko') {
    return 'Korean (한국어) with natural modern phrasing';
  }
  return LANGUAGES[toLang] || toLang;
}

function getSourceLangInstruction(fromLang: Language): string {
  if (fromLang === 'auto') {
    return 'the auto-detected source language';
  }
  if (fromLang === 'zh-Hant') {
    return 'Traditional Chinese (繁體中文)';
  }
  if (fromLang === 'zh-Hans') {
    return 'Simplified Chinese (简体中文)';
  }
  if (fromLang === 'yue') {
    return 'Cantonese (粵語)';
  }
  if (fromLang === 'wyw') {
    return 'Classical Chinese (文言文)';
  }
  return LANGUAGES[fromLang] || fromLang;
}

export const getTranslatePrompt = (
  fromLang: Language,
  toLang: Language,
  style: TranslateStyle = DEFAULT_TRANSLATE_STYLE,
): string => {
  const currentStyle = STYLE_PROMPT_MAP[style] || STYLE_PROMPT_MAP.general;

  // Polish mode: from and to language are identical
  if (fromLang !== 'auto' && fromLang === toLang) {
    const langDesc = getTargetLangInstruction(toLang);
    return [
      `You are an expert editor and multilingual proofreader specializing in ${langDesc}.`,
      `Task: Polish, refine, and improve the user-provided text in ${langDesc}.`,
      `Style & Tone: ${currentStyle.name}. ${currentStyle.polishGuide}`,
      'Guidelines:',
      '1. Strictly preserve all Markdown formatting (headings, lists, bold, links, tables), code blocks, LaTeX formulas ($...$, $$...$$), HTML tags, and placeholders.',
      '2. Fix any spelling, punctuation, or grammatical errors.',
      '3. Output ONLY the final polished text without explanations, greetings, quotes, or pre/post commentaries.',
    ].join('\n');
  }

  const targetLangDesc = getTargetLangInstruction(toLang);
  const sourceLangDesc = getSourceLangInstruction(fromLang);

  return [
    'You are a professional multilingual translator and localization expert.',
    `Task: Translate the user-provided text from ${sourceLangDesc} into ${targetLangDesc}.`,
    `Style & Domain: ${currentStyle.name}. ${currentStyle.guide}`,
    'Translation Rules:',
    '1. Faithfully preserve the exact meaning, factual details, logical flow, and nuances of the original text.',
    '2. Strictly preserve all formatting: Markdown (headers, bullet points, bold, italics, tables), code blocks, HTML tags, LaTeX formulas ($...$, $$...$$), and special placeholders.',
    '3. Do NOT translate programming code, variable/function names, brand/product names, URLs, or terms conventionally kept in the source language.',
    '4. Output ONLY the final translated text. Do NOT add any translator notes, introductory phrases, explanations, or enclosing fences.',
  ].join('\n');
};
