# `features`

This is a place to store all distinct features that make up a zApp - e.g. "create proposal"

1. One feature per folder.
2. All non-shared code related to a feature belongs in a feature folder.
3. Shared code belongs in `features/ui`, or similar.
4. Each feature folder should have an `index.ts` which defines the API for the feature - e.g. a table should only expose the table itself, not the row and grid components.
