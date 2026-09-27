# Feature-Driven Architecture

This directory is reserved for domain-specific feature modules as business requirements are introduced.

### Recommended Feature Module Structure

```
features/
└── [feature-name]/
    ├── components/    # Feature-specific UI components
    ├── hooks/         # Feature-specific custom hooks (e.g., useProductFilters)
    ├── services/      # Feature-specific API calls / mutation hooks
    ├── types/         # Feature-specific TypeScript declarations
    └── index.ts       # Public API barrel export for the feature
```

### Guidelines

1. **Self-Containment**: A feature should encapsulate its own UI, queries/mutations, and state logic.
2. **Reusability vs Domain**: Generic UI elements belong in `@/components/ui`, while domain-bound components (e.g., `CartDrawer`, `CheckoutForm`) belong in `features/[name]/components`.
3. **No Direct Inter-Feature Coupling**: Features should communicate via shared state, services, or common callbacks rather than deeply reaching into internal feature implementation details.
