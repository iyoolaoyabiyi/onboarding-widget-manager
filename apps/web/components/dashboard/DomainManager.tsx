'use client';

import { useState } from 'react';

interface DomainManagerProps {
  domains: string[];
  onDomainsChange: (domains: string[]) => void;
}

export default function DomainManager({ domains, onDomainsChange }: DomainManagerProps) {
  const [newDomain, setNewDomain] = useState('');
  const [error, setError] = useState('');

  const validateDomain = (domain: string): boolean => {
    if (!domain) return false;

    // Allow localhost with or without port
    if (domain.startsWith('localhost')) return true;

    // Allow IP addresses
    if (/^\d{1,3}\.\d{1,3}\.\d{1,3}\.\d{1,3}/.test(domain)) return true;

    // Allow wildcard domains
    if (domain.startsWith('*.')) {
      const baseDomain = domain.slice(2);
      return /^[a-zA-Z0-9]([a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(\.[a-zA-Z0-9]([a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)*$/.test(
        baseDomain
      );
    }

    // Standard domain validation
    return /^[a-zA-Z0-9]([a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(\.[a-zA-Z0-9]([a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)*$/.test(
      domain
    );
  };

  const addDomain = () => {
    const trimmed = newDomain.trim();

    if (!trimmed) {
      setError('Domain cannot be empty');
      return;
    }

    if (!validateDomain(trimmed)) {
      setError('Invalid domain format');
      return;
    }

    if (domains.includes(trimmed)) {
      setError('Domain already added');
      return;
    }

    onDomainsChange([...domains, trimmed]);
    setNewDomain('');
    setError('');
  };

  const removeDomain = (domain: string) => {
    onDomainsChange(domains.filter((d) => d !== domain));
  };

  return (
    <div className="space-y-4">
      <div>
        <h3 className="font-semibold mb-3">Allowed Domains</h3>
        <p className="text-sm text-gray-400 mb-4">
          Restrict where this tour can be embedded. Supports wildcards (*.example.com) and localhost.
        </p>

        <div className="flex gap-2 mb-4">
          <input
            type="text"
            value={newDomain}
            onChange={(e) => {
              setNewDomain(e.target.value);
              setError('');
            }}
            onKeyPress={(e) => e.key === 'Enter' && addDomain()}
            placeholder="example.com or *.example.com"
            className="flex-1 px-4 py-2 rounded-lg bg-black/30 border border-white/10 focus:outline-none focus:border-white/30"
          />
          <button
            onClick={addDomain}
            className="px-4 py-2 rounded-lg bg-white/10 border border-white/20 hover:bg-white/15 text-sm font-medium"
          >
            Add
          </button>
        </div>

        {error && <p className="text-sm text-red-400 mb-3">{error}</p>}

        {domains.length > 0 ? (
          <div className="space-y-2">
            {domains.map((domain) => (
              <div
                key={domain}
                className="flex items-center justify-between bg-black/30 border border-white/10 rounded-lg px-4 py-3"
              >
                <span className="font-mono text-sm">{domain}</span>
                <button
                  onClick={() => removeDomain(domain)}
                  className="text-xs px-3 py-1 rounded bg-red-500/20 text-red-400 hover:bg-red-500/30 border border-red-500/30"
                >
                  Remove
                </button>
              </div>
            ))}
          </div>
        ) : (
          <div className="rounded-lg border border-dashed border-white/15 bg-black/20 px-4 py-6 text-center text-sm text-gray-400">
            No domains added yet. Tours with no domains cannot be embedded.
          </div>
        )}
      </div>
    </div>
  );
}
