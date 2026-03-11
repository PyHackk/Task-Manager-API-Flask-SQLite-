} catch (err) {
    console.error('KPI data unavailable:', err);
    setKpiData({
        error: true,
        ccBudget: { value: null },
        ccPytd: { value: null },
        incremental: { value: null },
        topGbl: { gbls: [] }
    });
    setTablesData({ prioritiesPreview: { clients: [], total_count: 0 }, meetingsPreview: { clients: [], total_count: 0 } });
    setLoadingStage('data');
    if (isHome) {
        await new Promise(r => setTimeout(r, 800));
        setLoadingStage('complete');
        await new Promise(r => setTimeout(r, 600));
    }
    sessionStorage.setItem('detailed_loading_shown', 'true');
    sessionStorage.removeItem('loading_in_progress');
    setLoading(false);
    return;
}





(async () => {
    try {
        const [allKpis, tables] = await Promise.all([
            kpiApi.getAllKPIs(cachedUser.oidc_sub),
            prefetchTablesData(),
        ]);
        setLoadingStage('catalog');
        setKpiData({
            ccBudget: allKpis.cc_budget,
            ccPytd: allKpis.cc_pytd,
            incremental: allKpis.incremental,
            topGbl: allKpis.top_gbl,
        });
        setTablesData(tables);
    } catch (err) {
        console.error('Cached user data prefetch failed:', err);
        setKpiData({
            error: true,
            ccBudget: { value: null },
            ccPytd: { value: null },
            incremental: { value: null },
            topGbl: { gbls: [] }
        });
        setTablesData({ prioritiesPreview: { clients: [], total_count: 0 }, meetingsPreview: { clients: [], total_count: 0 } });
    }
    setLoadingStage('data');
    if (isHome) {
        await new Promise(r => setTimeout(r, 800));
        setLoadingStage('complete');
        await new Promise(r => setTimeout(r, 600));
    }
    sessionStorage.setItem('detailed_loading_shown', 'true');
    sessionStorage.removeItem('loading_in_progress');
    setLoading(false);
})();




} catch (err) {
    console.error('Home prefetch failed:', err);
    setKpiData({
        error: true,
        ccBudget: { value: null },
        ccPytd: { value: null },
        incremental: { value: null },
        topGbl: { gbls: [] }
    });
    setTablesData({ prioritiesPreview: { clients: [], total_count: 0 }, meetingsPreview: { clients: [], total_count: 0 } });
    setLoadingStage('error');
    await new Promise(r => setTimeout(r, 2000));
    setLoading(false);
    return;
}





function hasSeenDetailedLoading(): boolean {
    if (sessionStorage.getItem('loading_in_progress') === 'true') {
        return false;  // still loading, force DetailedLoading
    }
    return sessionStorage.getItem('detailed_loading_shown') === 'true';
}



