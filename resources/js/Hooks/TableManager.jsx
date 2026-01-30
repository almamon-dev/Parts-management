import { useState, useCallback, useRef, useEffect, useMemo } from "react";
import { router } from "@inertiajs/react";
import debounce from "lodash/debounce";

export function TableManager(routeName, data = [], initialOptions = {}) {
    const [search, setSearch] = useState(initialOptions?.search || "");
    const [isLoading, setIsLoading] = useState(false);
    const [selectedIds, setSelectedIds] = useState([]);
    const [selectAllGlobal, setSelectAllGlobal] = useState(false);

    // Keep track of options like 'only' in a ref to stay current
    const optionsRef = useRef(initialOptions);
    useEffect(() => {
        optionsRef.current = initialOptions;
    }, [initialOptions]);

    // Cleanup selection when data changes
    useEffect(() => {
        if (!selectAllGlobal && data) {
            const dataIds = data.map(i => i.id);
            setSelectedIds(prev => prev.filter(id => dataIds.includes(id)));
        }
    }, [data, selectAllGlobal]);

    const debouncedNavigate = useMemo(
        () => debounce((params) => {
            router.get(route(routeName), params, {
                preserveState: true,
                preserveScroll: true,
                replace: true,
                only: optionsRef.current?.only ? [...new Set([...optionsRef.current.only, "filters", "flash", "errors"])] : undefined,
                onStart: () => setIsLoading(true),
                onFinish: () => setIsLoading(false),
                onError: () => setIsLoading(false),
            });
        }, 300),
        [routeName]
    );

    const handleSearch = useCallback((value) => {
        setSearch(value);
        const urlParams = new URLSearchParams(window.location.search);
        const params = {
            search: value || null,
            page: 1,
            per_page: urlParams.get('per_page') || 15
        };
        // If there are other filters like status, include them
        if (optionsRef.current?.status) params.status = optionsRef.current.status;
        
        debouncedNavigate(params);
    }, [debouncedNavigate]);

    const handleFilterChange = useCallback((updates) => {
        const urlParams = new URLSearchParams(window.location.search);
        const params = {
            search: search || null,
            per_page: urlParams.get('per_page') || 15,
            ...updates,
            page: 1
        };
        debouncedNavigate(params);
    }, [search, debouncedNavigate]);

    const handleClearFilters = useCallback(() => {
        setSearch("");
        const urlParams = new URLSearchParams(window.location.search);
        debouncedNavigate({ 
            page: 1, 
            per_page: urlParams.get('per_page') || 15 
        });
    }, [debouncedNavigate]);

    const toggleSelectAll = useCallback(() => {
        if (!data || data.length === 0) return;
        if (selectAllGlobal || selectedIds.length === data.length) {
            setSelectedIds([]);
            setSelectAllGlobal(false);
        } else {
            setSelectedIds(data.map(i => i.id));
        }
    }, [data, selectedIds, selectAllGlobal]);

    const toggleSelect = useCallback((id) => {
        setSelectAllGlobal(false);
        setSelectedIds(prev => prev.includes(id) ? prev.filter(i => i !== id) : [...prev, id]);
    }, []);

    const clearSelection = useCallback(() => {
        setSelectedIds([]);
        setSelectAllGlobal(false);
    }, []);

    return {
        search, handleSearch, isLoading,
        selectedIds, toggleSelectAll, toggleSelect,
        selectAllGlobal, setSelectAllGlobal, clearSelection,
        handleFilterChange, handleClearFilters,
        currentFilters: optionsRef.current || {}
    };
}
