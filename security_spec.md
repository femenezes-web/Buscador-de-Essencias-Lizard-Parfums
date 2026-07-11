# Security Specification - Buscador Lizard Parfums

## Data Invariants
1. **Store**: Any user can submit/create a new store. The ID must be valid, and required fields (`id`, `name`, `url`, `region`, `platform`) must match their expected types and lengths.
2. **Product**: Products can be searched by anyone. Writes are performed by the backend scraper, requiring proper structure (`id`, `name`, `url`, `storeId`, `lastConfirmedAt`).
3. **Essence**: Essences are canonical reference entries, read-only for public users, managed by seed/admin.
4. **EssenceAlias**: Mapping records linking synonyms/aliases to canonical essences. Publicly readable, managed by admin/seed.

## The "Dirty Dozen" Payloads
These payloads attempt to break rules (Identity, Integrity, and State) and must be blocked:
1. Store with a ghost field `isVIP: true`.
2. Store with missing `url` field.
3. Store with exceptionally long `name` (size check).
4. Store with invalid ID format.
5. Product with missing `storeId`.
6. Product with negative `price`.
7. Product with missing `lastConfirmedAt`.
8. Essence modified by unauthenticated client.
9. Essence with empty synonym list.
10. EssenceAlias modified by unauthenticated client.
11. Unauthorized deletion of a Store.
12. Unauthorized deletion of a Product.

## Rules Draft
Below is the rule draft enforcing validation.
