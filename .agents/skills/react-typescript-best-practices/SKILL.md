---
name: react-typescript-best-practices
description: Best practices for building robust, scalable React 18/19 applications with TypeScript strict mode, custom hooks, clean state management, component composition, and performance optimization.
---

# React & TypeScript Best Practices Skill

This skill provides guidelines and patterns for engineering clean, maintainable, and type-safe React applications.

---

## 📐 1. Component Architecture & Props

- **Explicit Type Definitions**: Always define explicit interface or type props for components.
- **Component Composition**: Prefer composition (`children` prop and sub-components) over monolithic multi-purpose components.
- **Controlled Components**: Use controlled form inputs with explicit TypeScript handlers (`React.ChangeEvent<HTMLInputElement>`).

```tsx
import React, { ReactNode } from 'react';

interface CardProps {
  title: string;
  badge?: string;
  children: ReactNode;
  onClick?: () => void;
}

export const Card: React.FC<CardProps> = ({ title, badge, children, onClick }) => {
  return (
    <div className="glass-card" onClick={onClick}>
      <div className="card-header">
        <h3>{title}</h3>
        {badge && <span className="badge">{badge}</span>}
      </div>
      <div className="card-body">{children}</div>
    </div>
  );
};
```

---

## ⚓ 2. Custom Hooks & Async Data Fetching

- Abstract side-effects, API calls, and complex local logic into reusable **custom hooks**.
- Always handle loading, error, and data states explicitly.

```tsx
import { useState, useEffect, useCallback } from 'react';

interface UseFetchResult<T> {
  data: T | null;
  loading: boolean;
  error: string | null;
  refetch: () => void;
}

export function useFetch<T>(url: string): UseFetchResult<T> {
  const [data, setData] = useState<T | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const fetchData = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch(url);
      if (!res.ok) throw new Error(`HTTP ${res.status}: ${res.statusText}`);
      const json = await res.json();
      setData(json);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Unknown error');
    } finally {
      setLoading(false);
    }
  }, [url]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  return { data, loading, error, refetch: fetchData };
}
```

---

## ⚡ 3. Performance Optimization

- Use `useCallback` for functions passed as props to memoized child components.
- Use `useMemo` for expensive computations (e.g. data filtering, sorting, aggregations).
- Code-split large routes using `React.lazy` and `Suspense`.
