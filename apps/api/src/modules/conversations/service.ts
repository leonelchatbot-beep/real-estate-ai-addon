export async function createSession(input: Record<string, unknown>) {
  return {
    sessionId: crypto.randomUUID(),
    created: true,
    payload: input,
    createdAt: new Date().toISOString(),
  };
}

export async function createMessage(input: Record<string, unknown>) {
  return {
    messageId: crypto.randomUUID(),
    accepted: true,
    payload: input,
    createdAt: new Date().toISOString(),
  };
}
