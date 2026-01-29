import React, { useState, useRef, useEffect, useCallback } from 'react';

/**
 * W3AG Compliant Token Selector Component
 * 
 * Conformance: Level AA
 * 
 * Success Criteria Met:
 * - 1.3.1: Tokens have accessible names beyond ticker symbols
 * - 2.1.1: Fully keyboard navigable
 * - 4.1.1: Proper ARIA combobox pattern
 */

interface Token {
  address: string;
  symbol: string;
  name: string;
  logoUri?: string;
  balance?: string;
  decimals: number;
}

interface TokenSelectorProps {
  tokens: Token[];
  selectedToken: Token | null;
  onSelect: (token: Token) => void;
  label: string;
  id: string;
  placeholder?: string;
}

export function TokenSelector({
  tokens,
  selectedToken,
  onSelect,
  label,
  id,
  placeholder = 'Select token',
}: TokenSelectorProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [highlightedIndex, setHighlightedIndex] = useState(0);
  const [announcement, setAnnouncement] = useState('');
  
  const containerRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const listRef = useRef<HTMLUListElement>(null);

  // Filter tokens by search
  const filteredTokens = tokens.filter(token =>
    token.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    token.symbol.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // Close on outside click
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Announce filter results
  useEffect(() => {
    if (isOpen && searchQuery) {
      setAnnouncement(
        `${filteredTokens.length} token${filteredTokens.length !== 1 ? 's' : ''} found`
      );
    }
  }, [filteredTokens.length, isOpen, searchQuery]);

  const handleKeyDown = useCallback((e: React.KeyboardEvent) => {
    switch (e.key) {
      case 'ArrowDown':
        e.preventDefault();
        if (!isOpen) {
          setIsOpen(true);
        } else {
          setHighlightedIndex(prev => 
            Math.min(prev + 1, filteredTokens.length - 1)
          );
        }
        break;

      case 'ArrowUp':
        e.preventDefault();
        setHighlightedIndex(prev => Math.max(prev - 1, 0));
        break;

      case 'Enter':
        e.preventDefault();
        if (isOpen && filteredTokens[highlightedIndex]) {
          handleSelect(filteredTokens[highlightedIndex]);
        } else {
          setIsOpen(true);
        }
        break;

      case 'Escape':
        e.preventDefault();
        setIsOpen(false);
        setSearchQuery('');
        break;

      case 'Tab':
        setIsOpen(false);
        break;
    }
  }, [isOpen, highlightedIndex, filteredTokens]);

  const handleSelect = (token: Token) => {
    onSelect(token);
    setIsOpen(false);
    setSearchQuery('');
    setAnnouncement(`Selected ${token.name}, ${token.symbol}`);
    inputRef.current?.focus();
  };

  // Scroll highlighted item into view
  useEffect(() => {
    if (isOpen && listRef.current) {
      const highlighted = listRef.current.children[highlightedIndex] as HTMLElement;
      highlighted?.scrollIntoView({ block: 'nearest' });
    }
  }, [highlightedIndex, isOpen]);

  return (
    <div ref={containerRef} className="w3ag-token-selector">
      {/* Screen reader announcements */}
      <div role="status" aria-live="polite" className="sr-only">
        {announcement}
      </div>

      <label id={`${id}-label`} htmlFor={id}>
        {label}
      </label>

      <div className="selector-container">
        {/* Combobox input */}
        <div
          role="combobox"
          aria-expanded={isOpen}
          aria-haspopup="listbox"
          aria-owns={`${id}-listbox`}
          aria-labelledby={`${id}-label`}
          className="combobox-wrapper"
        >
          <input
            ref={inputRef}
            id={id}
            type="text"
            value={isOpen ? searchQuery : (selectedToken?.symbol || '')}
            onChange={(e) => {
              setSearchQuery(e.target.value);
              setHighlightedIndex(0);
              if (!isOpen) setIsOpen(true);
            }}
            onFocus={() => setIsOpen(true)}
            onKeyDown={handleKeyDown}
            placeholder={placeholder}
            aria-autocomplete="list"
            aria-controls={`${id}-listbox`}
            aria-activedescendant={
              isOpen ? `${id}-option-${highlightedIndex}` : undefined
            }
            className="token-input"
          />

          {/* Selected token display */}
          {selectedToken && !isOpen && (
            <div className="selected-token" aria-hidden="true">
              {selectedToken.logoUri && (
                <img 
                  src={selectedToken.logoUri} 
                  alt="" 
                  className="token-logo"
                />
              )}
              <span className="token-symbol">{selectedToken.symbol}</span>
            </div>
          )}

          {/* Dropdown arrow */}
          <button
            type="button"
            tabIndex={-1}
            aria-label={isOpen ? 'Close token list' : 'Open token list'}
            onClick={() => setIsOpen(!isOpen)}
            className="dropdown-arrow"
          >
            {isOpen ? '▲' : '▼'}
          </button>
        </div>

        {/* Token list */}
        {isOpen && (
          <ul
            ref={listRef}
            id={`${id}-listbox`}
            role="listbox"
            aria-labelledby={`${id}-label`}
            className="token-list"
          >
            {filteredTokens.length === 0 ? (
              <li className="no-results" role="option" aria-disabled="true">
                No tokens found
              </li>
            ) : (
              filteredTokens.map((token, index) => (
                <li
                  key={token.address}
                  id={`${id}-option-${index}`}
                  role="option"
                  aria-selected={highlightedIndex === index}
                  onClick={() => handleSelect(token)}
                  onMouseEnter={() => setHighlightedIndex(index)}
                  className={`token-option ${highlightedIndex === index ? 'highlighted' : ''}`}
                >
                  {token.logoUri && (
                    <img 
                      src={token.logoUri} 
                      alt="" 
                      aria-hidden="true"
                      className="token-logo"
                    />
                  )}
                  
                  <div className="token-info">
                    <span className="token-name">{token.name}</span>
                    <span className="token-symbol-small">{token.symbol}</span>
                  </div>
                  
                  {token.balance && (
                    <span 
                      className="token-balance"
                      aria-label={`Balance: ${token.balance} ${token.symbol}`}
                    >
                      {token.balance}
                    </span>
                  )}
                </li>
              ))
            )}
          </ul>
        )}
      </div>

      {/* Hidden description for screen readers */}
      <p id={`${id}-description`} className="sr-only">
        Type to search tokens, use arrow keys to navigate, Enter to select
      </p>
    </div>
  );
}

/**
 * CSS:
 * 
 * .w3ag-token-selector {
 *   position: relative;
 * }
 * 
 * .selector-container {
 *   position: relative;
 * }
 * 
 * .combobox-wrapper {
 *   display: flex;
 *   align-items: center;
 *   border: 1px solid var(--border-color);
 *   border-radius: 12px;
 *   padding: 0.5rem;
 *   background: var(--bg-primary);
 * }
 * 
 * .token-input {
 *   flex: 1;
 *   border: none;
 *   background: transparent;
 *   font-size: 1rem;
 *   outline: none;
 * }
 * 
 * .selected-token {
 *   display: flex;
 *   align-items: center;
 *   gap: 0.5rem;
 *   position: absolute;
 *   left: 0.75rem;
 *   pointer-events: none;
 * }
 * 
 * .token-logo {
 *   width: 24px;
 *   height: 24px;
 *   border-radius: 50%;
 * }
 * 
 * .dropdown-arrow {
 *   background: none;
 *   border: none;
 *   cursor: pointer;
 *   padding: 0.25rem;
 * }
 * 
 * .token-list {
 *   position: absolute;
 *   top: 100%;
 *   left: 0;
 *   right: 0;
 *   max-height: 300px;
 *   overflow-y: auto;
 *   background: var(--bg-surface);
 *   border: 1px solid var(--border-color);
 *   border-radius: 12px;
 *   margin-top: 0.25rem;
 *   z-index: 100;
 *   list-style: none;
 *   padding: 0.5rem;
 * }
 * 
 * .token-option {
 *   display: flex;
 *   align-items: center;
 *   gap: 0.75rem;
 *   padding: 0.75rem;
 *   border-radius: 8px;
 *   cursor: pointer;
 * }
 * 
 * .token-option:hover,
 * .token-option.highlighted {
 *   background: var(--bg-hover);
 * }
 * 
 * .token-option[aria-selected="true"] {
 *   outline: 2px solid var(--color-focus);
 * }
 * 
 * .token-info {
 *   flex: 1;
 *   display: flex;
 *   flex-direction: column;
 * }
 * 
 * .token-name {
 *   font-weight: 500;
 * }
 * 
 * .token-symbol-small {
 *   font-size: 0.875rem;
 *   color: var(--text-secondary);
 * }
 * 
 * .token-balance {
 *   font-size: 0.875rem;
 *   color: var(--text-secondary);
 * }
 * 
 * .no-results {
 *   padding: 1rem;
 *   text-align: center;
 *   color: var(--text-secondary);
 * }
 */

export default TokenSelector;
