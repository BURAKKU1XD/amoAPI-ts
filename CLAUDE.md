# CLAUDE.md

This file provides guidance for Claude when working with this codebase.

## Project Overview

This is a PHP SDK for the amoCRM CRM API (v4). It provides object-oriented access to amoCRM functionality with OAuth 2.0 authentication support.

## Tech Stack

- **Language:** PHP 7.1+ (supports up to 8.4)
- **HTTP Client:** Guzzle 6.x/7.x
- **Authentication:** OAuth 2.0 via `amocrm/oauth2-amocrm`
- **Testing:** PHPUnit
- **Code Style:** PSR-12 (enforced via PHP_CodeSniffer)

## Common Commands

```bash
composer test          # Run PHPUnit tests
composer style:check   # Check PSR-12 code style
composer style:fix     # Auto-fix code style issues
composer serve         # Start dev server on localhost:8181
composer git:prepush   # Run tests + style check (pre-push hook)
```

## Project Structure

```
src/AmoCRM/
├── Client/              # API client and HTTP request handling
├── EntitiesServices/    # Service layer (one per entity type)
├── Models/              # Data models for API entities
├── Collections/         # Typed collections for models
├── Filters/             # Query filters for API requests
├── OAuth/               # OAuth 2.0 authentication
├── Exceptions/          # Custom exception classes
├── Enum/                # Constants and enumerations
├── Helpers/             # Utility classes
├── Support/             # Internal utilities (Str class)
└── Contracts/           # Interfaces (Jsonable, Arrayable)

examples/                # 50+ usage examples
tests/Cases/             # PHPUnit test suite
```

## Code Conventions

### Naming
- **Namespace:** `AmoCRM\*` with PSR-4 autoloading
- **Models:** Suffix with `Model` (e.g., `LeadModel`)
- **Collections:** Suffix with `Collection` (e.g., `LeadsCollection`)
- **Services:** Singular entity name (e.g., `Leads`, `Contacts`)
- **Methods:** camelCase (e.g., `getOne()`, `addOne()`, `updateOne()`)

### Architecture Patterns
- **Service Layer:** All API operations go through service classes in `EntitiesServices/`
- **Model-Collection Pattern:** Entities are models, lists are typed collections
- **Trait-based Reuse:** Common behaviors extracted to traits (e.g., `LinkMethodsTrait`, `PageMethodsTrait`)
- **Fluent Interface:** Method chaining supported throughout

### Model Implementation
All models must:
1. Extend `BaseApiModel`
2. Implement `toArray()` for serialization
3. Implement `toApi(?string $requestId = null)` for API payloads

### Collection Implementation
All collections must:
1. Extend `BaseApiCollection`
2. Implement `ArrayAccess`, `JsonSerializable`, `IteratorAggregate`
3. Provide static `fromArray()` factory method

### Service Methods
Standard CRUD operations:
- `getOne($id)` - Fetch single entity
- `get($filter)` - Fetch collection with optional filter
- `addOne($model)` - Create single entity
- `add($collection)` - Batch create
- `updateOne($model)` - Update single entity
- `update($collection)` - Batch update
- `syncOne($model)` - Upsert operation

## Key Files

- `src/AmoCRM/Client/AmoCRMApiClient.php` - Main client entry point
- `src/AmoCRM/Client/AmoCRMApiRequest.php` - HTTP request wrapper
- `src/AmoCRM/EntitiesServices/BaseEntity.php` - Abstract base for all services
- `src/AmoCRM/Models/BaseApiModel.php` - Abstract base for all models
- `src/AmoCRM/Collections/BaseApiCollection.php` - Abstract base for collections
- `src/AmoCRM/Exceptions/AmoCRMApiException.php` - Base exception class
- `examples/bootstrap.php` - Environment setup example

## Error Handling

Custom exception hierarchy:
- `AmoCRMApiException` - Base exception with `getErrorCode()`, `getTitle()`, `getDescription()`
- `AmoCRMoAuthApiException` - OAuth-specific errors
- `AmoCRMApiTooManyRequestsException` - Rate limiting (429)
- `AmoCRMMissedTokenException` - Missing authentication

## Testing

Tests are in `tests/Cases/`. Run with `composer test`.

When adding new features:
1. Follow existing patterns in similar services/models
2. Add corresponding tests
3. Run `composer style:check` before committing
