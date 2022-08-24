# `features/ui`

This is a place to put pieces of UI which are shared across multiple features.

1. Put all components in their own folders.
2. Each folder should have an `index.ts` which defines the API for the feature - e.g. a table should only expose the table itself, not the row and grid components.
