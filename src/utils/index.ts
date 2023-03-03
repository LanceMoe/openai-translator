export const trimText = (text: string) => {
  if (text.startsWith('"') || text.startsWith('「')) {
    text = text.slice(1);
  }
  if (text.endsWith('"') || text.endsWith('」')) {
    text = text.slice(0, -1);
  }
  return text;
};
