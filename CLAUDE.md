# CLAUDE.md

This file provides guidance for Claude when working with this codebase.

## Project Overview

This is a TypeScript SDK for the amoCRM CRM API (v4). It provides object-oriented access to amoCRM functionality with OAuth 2.0 authentication support.

## Tech Stack

- **Language:** TypeScript 5.3 (strict mode, target ES2020)
- **Runtime:** Node.js >= 16.0.0
- **HTTP Client:** Axios ^1.6
- **Authentication:** OAuth 2.0 with JWT-based disposable tokens (`jsonwebtoken`)
- **Testing:** Jest with ts-jest
- **Code Style:** ESLint with `@typescript-eslint` plugin

## Common Commands

```bash
npm run build            # Compile TypeScript to dist/
npm run build:watch      # Watch mode compilation
npm run test             # Run Jest tests
npm run test:watch       # Watch mode tests
npm run test:coverage    # Generate coverage reports
npm run lint             # Check code style with ESLint
npm run lint:fix         # Auto-fix style issues
```

## Project Structure

```
src/
├── Client/              # API client and HTTP request handling
├── Services/            # Service layer (one per entity type)
├── Models/              # Data models for API entities
├── Collections/         # Typed collections for models
├── Filters/             # Query filters for API requests
├── OAuth/               # OAuth 2.0 authentication
├── Exceptions/          # Custom exception classes
├── Enums/               # Constants and enumerations
├── Interfaces/          # TypeScript interfaces (Jsonable, Arrayable, etc.)
├── Support/             # Internal utilities (Str class)

tests/Cases/             # Jest test suite
```

## Code Conventions

### Naming
- **Models:** Suffix with `Model` (e.g., `LeadModel`)
- **Collections:** Suffix with `Collection` (e.g., `LeadsCollection`)
- **Services:** Suffix with `Service` (e.g., `LeadsService`)
- **Methods:** camelCase (e.g., `getOne()`, `addOne()`, `updateOne()`)
- **Getters/Setters:** `get{Property}()` / `set{Property}()` pattern

### Architecture Patterns
- **Service Layer:** All API operations go through service classes in `Services/`
- **Model-Collection Pattern:** Entities are models, lists are typed generic collections
- **Lazy Service Instantiation:** Services are created on demand via client accessor methods
- **Fluent Interface:** Method chaining supported throughout

### Model Implementation
All models must:
1. Extend `BaseApiModel`
2. Implement `toArray()` for serialization
3. Implement `toApi(requestId?: string)` for API payloads
4. Provide static `fromArray()` factory method

### Collection Implementation
All collections must:
1. Extend `BaseApiCollection<T>`
2. Be iterable and JSON-serializable
3. Provide static `fromArray()` factory method
4. Support pagination via `getNextPageLink()` / `getPrevPageLink()`

### Service Methods
Standard CRUD operations:
- `getOne(id)` - Fetch single entity
- `get(filter)` - Fetch collection with optional filter
- `addOne(model)` - Create single entity
- `add(collection)` - Batch create
- `updateOne(model)` - Update single entity
- `update(collection)` - Batch update
- `syncOne(model)` - Upsert operation

## Key Files

- `src/Client/AmoCRMApiClient.ts` - Main client entry point
- `src/Client/AmoCRMApiRequest.ts` - HTTP request wrapper
- `src/Services/BaseEntity.ts` - Abstract base for all services
- `src/Models/BaseApiModel.ts` - Abstract base for all models
- `src/Collections/BaseApiCollection.ts` - Abstract base for collections
- `src/Exceptions/AmoCRMApiException.ts` - Base exception class
- `src/OAuth/AmoCRMOAuth.ts` - OAuth 2.0 client

## Error Handling

Custom exception hierarchy:
- `AmoCRMApiException` - Base exception with `getErrorCode()`, `getTitle()`, `getDescription()`
- `AmoCRMoAuthApiException` - OAuth-specific errors
- `AmoCRMApiConnectException` - Connection failures
- `AmoCRMApiTooManyRequestsException` - Rate limiting (429)
- `AmoCRMMissedTokenException` - Missing authentication
- `DisposableTokenExpiredException` - Expired JWT disposable tokens

## Testing

Tests are in `tests/Cases/`. Run with `npm run test`.

When adding new features:
1. Follow existing patterns in similar services/models
2. Add corresponding tests
3. Run `npm run lint` before committing
