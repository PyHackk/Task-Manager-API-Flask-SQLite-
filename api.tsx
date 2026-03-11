async function fetchUntilSuccess<T>(url: string, params = {}): Promise<T> {
  let attempt = 0;
  while (true) {
    attempt++;
    try {
      const { data } = await apiClient.get<T>(url, { params });
      if (data) return data;
    } catch (err: any) {
      const status = err?.response?.status;
      if (status === 500 || status === 401 || status === 403) {
        throw err; // fail fast, don't retry
      }
      // 504 or network error → keep retrying
      console.warn(`Fetch ${url} attempt ${attempt} failed (${status}), retrying...`);
    }
    await new Promise(r => setTimeout(r, Math.min(500 * attempt, 3000)));
  }
}





} catch (err) {
  console.error('Home prefetch failed:', err);
  setLoadingStage('error');
  await new Promise(r => setTimeout(r, 2000));
  setLoading(false); // ← let user through even if data failed
}





async function checkAuth() {
  sessionStorage.setItem('loading_in_progress', 'true'); // ← ADD
  setLoading(true);
  ...




const hasSeenDetailedLoading = () => {
  if (typeof window === 'undefined') return false;
  if (sessionStorage.getItem('loading_in_progress') === 'true') return false; // ← ADD
  return sessionStorage.getItem('detailed_loading_shown') === 'true';
};




sessionStorage.setItem('detailed_loading_shown', 'true');
sessionStorage.removeItem('loading_in_progress'); // ← ADD
setLoading(false);
