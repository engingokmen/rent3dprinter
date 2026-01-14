# Test Suite

This directory contains comprehensive tests for the authentication system.

## Running Tests

```bash
# Run all tests
npm test

# Run tests in watch mode
npm run test:watch

# Run tests with coverage
npm run test:coverage
```

## Test Structure

### Unit Tests

- **`lib/mock-users.test.ts`** - Tests for user storage functions:
  - User creation
  - User lookup (by email and ID)
  - Password hashing and verification
  - Email normalization

- **`lib/auth.test.ts`** - Tests for authentication logic:
  - Credentials validation
  - Password verification
  - Email case insensitivity

### Integration Tests

- **`api/auth/register.test.ts`** - Tests for registration API endpoint:
  - Successful registration
  - Validation errors (email, password, name)
  - Duplicate email handling
  - Missing fields handling

### Component Tests

- **`components/LoginPage.test.tsx`** - Tests for login page:
  - Form rendering
  - Error handling
  - Successful login flow
  - Form state management

- **`components/RegisterPage.test.tsx`** - Tests for registration page:
  - Form rendering
  - Password validation
  - Registration flow
  - Auto-login after registration

## Test Utilities

The test suite uses:
- **Jest** - Test runner
- **React Testing Library** - Component testing
- **@testing-library/user-event** - User interaction simulation

## Notes

- Tests automatically clear the mock user database between runs
- All tests are isolated and don't depend on external services
- Mock data is used for all authentication tests

