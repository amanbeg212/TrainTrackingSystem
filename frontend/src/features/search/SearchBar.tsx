import React, { useState, useRef, useEffect } from 'react';
import { Search, X, Loader2, ArrowRight, Radio } from 'lucide-react';
import { useTrainSearch } from './useTrainSearch';
import { SearchResultCard } from './SearchResultCard';
import { Train } from '../../types';

interface SearchBarProps {
  onSelectTrain: (train: Train) => void;
}

export const SearchBar: React.FC<SearchBarProps> = ({ onSelectTrain }) => {
  const [query, setQuery] = useState('');
  const [isOpen, setIsOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const { results, isLoading } = useTrainSearch(query);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Auto-open dropdown when query changes
  useEffect(() => {
    if (query.trim().length > 0) {
      setIsOpen(true);
    }
  }, [query]);

  const handleSelect = (train: Train) => {
    onSelectTrain(train);
    setIsOpen(false);
    setQuery('');
  };

  const handleSearchSubmit = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    const clean = query.trim().replace(/^#+/, '').trim();
    if (!clean) return;

    const rawDigits = clean.replace(/\D/g, '');

    // 1. If we already have search results, navigate to the first matched train
    if (results.length > 0) {
      handleSelect(results[0]);
      return;
    }

    // 2. If query contains a 4-5 digit train number, navigate immediately
    if (rawDigits.length >= 4 && rawDigits.length <= 5) {
      onSelectTrain({
        id: rawDigits,
        number: rawDigits,
        name: `Train #${rawDigits}`,
        type: 'Express',
        origin: { code: '?', name: 'Loading schedule...', latitude: 20.5937, longitude: 78.9629 },
        destination: { code: '?', name: 'Loading schedule...', latitude: 20.5937, longitude: 78.9629 },
        totalDistanceKm: 0,
        runsOnDays: ['Daily'],
      });
      setIsOpen(false);
      setQuery('');
      return;
    }

    // 3. If user typed any non-empty text, fallback to direct search or first result once loaded
    if (clean.length > 0 && !isLoading) {
      setIsOpen(true);
    }
  };

  const showDropdown = isOpen && query.trim().length > 0;
  const rawDigits = query.trim().replace(/^#+/, '').replace(/\D/g, '');
  const hasValidDigits = rawDigits.length >= 4 && rawDigits.length <= 5;

  return (
    <div ref={containerRef} className="relative w-full max-w-2xl mx-auto">
      <form
        onSubmit={handleSearchSubmit}
        className="group relative flex items-center bg-white rounded-2xl shadow-lg shadow-slate-900/5 border border-slate-200/80 hover:border-slate-300 focus-within:border-indigo-500 focus-within:ring-4 focus-within:ring-indigo-500/10 transition-all p-1.5 sm:p-2"
      >
        {/* Search Icon */}
        <div className="pl-3 pr-2 text-slate-400 group-focus-within:text-indigo-600 transition-colors pointer-events-none">
          <Search className="w-5 h-5" />
        </div>

        {/* Input */}
        <input
          ref={inputRef}
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onFocus={() => { if (query.trim()) setIsOpen(true); }}
          onKeyDown={(e) => {
            if (e.key === 'Escape') {
              setIsOpen(false);
            }
          }}
          placeholder="Enter train number or name (e.g. 12951, Rajdhani, NDLS)..."
          className="flex-1 bg-transparent py-2.5 sm:py-3 text-sm sm:text-base font-semibold text-slate-900 placeholder:text-slate-400 placeholder:font-normal focus:outline-none min-w-0"
        />

        {/* Clear (X) Button */}
        {query && (
          <button
            type="button"
            onClick={() => {
              setQuery('');
              setIsOpen(false);
              inputRef.current?.focus();
            }}
            className="p-1.5 mr-1 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded-full transition-colors cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        )}

        {/* Primary Action Button */}
        <button
          type="submit"
          className="inline-flex items-center gap-2 px-4 sm:px-5 py-2.5 sm:py-3 bg-indigo-600 hover:bg-indigo-700 active:scale-98 text-white rounded-xl text-xs sm:text-sm font-bold shadow-sm transition-all shrink-0 cursor-pointer"
        >
          <Radio className="w-3.5 h-3.5 text-emerald-300 animate-pulse" />
          <span>Track Live</span>
          <ArrowRight className="w-3.5 h-3.5 hidden sm:inline" />
        </button>
      </form>

      {/* Autocomplete Dropdown */}
      {showDropdown && (
        <div className="absolute top-full left-0 right-0 mt-2 bg-white rounded-2xl shadow-2xl border border-slate-100 overflow-hidden z-50 p-2 max-h-96 overflow-y-auto animate-in fade-in slide-in-from-top-2 duration-150">
          {isLoading ? (
            <div className="flex items-center justify-center p-6 text-slate-400 gap-2">
              <Loader2 className="w-5 h-5 animate-spin text-indigo-600" />
              <span className="text-sm font-medium">Searching live Indian trains...</span>
            </div>
          ) : results.length > 0 ? (
            <div className="space-y-1">
              <div className="px-3 py-1.5 text-[11px] font-bold text-slate-400 uppercase tracking-wider flex items-center justify-between">
                <span>Matching Trains ({results.length})</span>
                <span className="text-[10px] text-slate-300">Click to track live</span>
              </div>
              {results.map((train) => (
                <SearchResultCard key={train.number} train={train} onSelect={handleSelect} />
              ))}
            </div>
          ) : (
            <div className="p-6 text-center text-slate-500 text-sm font-medium space-y-2">
              <div>No direct catalog match for &quot;{query}&quot;.</div>
              {hasValidDigits ? (
                <button
                  type="button"
                  onClick={() => handleSearchSubmit()}
                  className="inline-flex items-center gap-1.5 px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-xs font-bold transition-all cursor-pointer shadow-xs"
                >
                  <Radio className="w-3.5 h-3.5 text-emerald-300 animate-pulse" />
                  <span>Track Train #{rawDigits} Directly</span>
                </button>
              ) : (
                <p className="text-xs text-slate-400">
                  Try searching by train number (e.g. <strong>12951</strong>) or name (e.g. <strong>Rajdhani</strong>, <strong>Shatabdi</strong>).
                </p>
              )}
            </div>
          )}
        </div>
      )}
    </div>
  );
};
