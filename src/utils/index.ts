export function trimText(text: string) {
  if (text.startsWith('"') || text.startsWith('「')) {
    text = text.slice(1);
  }
  if (text.endsWith('"') || text.endsWith('」')) {
    text = text.slice(0, -1);
  }
  return text;
}

export function formatTime(time: number, lang = 'en-US') {
  const dt = new Date(time);
  const result = new Intl.DateTimeFormat(lang, {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: 'numeric',
    minute: 'numeric',
    second: 'numeric',
  }).format(dt);
  return result;
}
