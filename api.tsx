async function fetchUntilSuccess<T>(url: string, params = {}): Promise<T> {
  let attempt = 0;
  while (true) {
    attempt++;
    try {
      const { data } = await Promise.race([
        apiClient.get<T>(url, { params }),
        new Promise<never>((_, reject) =>
          setTimeout(() => reject({ response: { status: 504 } }), 10000)
        )
      ]);
      if (data) return data;
    } catch (err: any) {
      const status = err?.response?.status;
      if (status === 500 || status === 401 || status === 403) {
        throw err;
      }
      // 504 or timeout → keep retrying
      console.warn(`Fetch ${url} attempt ${attempt} failed (${status}), retrying...`);
    }
    await new Promise(r => setTimeout(r, Math.min(500 * attempt, 3000)));
  }
}
