export function parseAffirmative(message: string): boolean {
  const text = message.toLowerCase().trim();
  return ['si', 'sí', 'dale', 'ok', 'perfecto', 'me interesa', 'quiero esa'].some((value) => text.includes(value));
}

export function parseOrdinalSelection(message: string): number | null {
  const text = message.toLowerCase();
  const ordinalMap: Record<string, number> = {
    '1': 1,
    '2': 2,
    '3': 3,
    'primera': 1,
    'primero': 1,
    'segunda': 2,
    'segundo': 2,
    'tercera': 3,
    'tercero': 3,
  };

  for (const [key, index] of Object.entries(ordinalMap)) {
    if (text.includes(key)) return index;
  }

  return null;
}
