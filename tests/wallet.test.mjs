/**
 * Unit tests for src/utils/wallet.ts
 *
 * Run with:  node --test tests/wallet.test.mjs
 */
import { test } from 'node:test';
import assert from 'node:assert/strict';
import {
  ZERO_ADDRESS,
  ALLOWED_WALLET_ADDRESSES,
  isZeroAddress,
  isAllowedAddress,
  validateAddress,
} from '../src/utils/wallet.ts';

// ---------------------------------------------------------------------------
// ZERO_ADDRESS constant
// ---------------------------------------------------------------------------
test('ZERO_ADDRESS is the canonical 40-nibble zero hex string', () => {
  assert.equal(ZERO_ADDRESS, '0x0000000000000000000000000000000000000000');
});

// ---------------------------------------------------------------------------
// ALLOWED_WALLET_ADDRESSES
// ---------------------------------------------------------------------------
test('ALLOWED_WALLET_ADDRESSES contains exactly the three canonical addresses', () => {
  assert.deepEqual([...ALLOWED_WALLET_ADDRESSES], [
    'kushmanmb.eth',
    'yaketh.eth',
    'kushmanmb.base.eth',
  ]);
});

// ---------------------------------------------------------------------------
// isZeroAddress
// ---------------------------------------------------------------------------
test('isZeroAddress returns true for the zero address', () => {
  assert.equal(isZeroAddress(ZERO_ADDRESS), true);
});

test('isZeroAddress is case-insensitive', () => {
  assert.equal(isZeroAddress('0X0000000000000000000000000000000000000000'), true);
});

test('isZeroAddress returns false for a non-zero address', () => {
  assert.equal(isZeroAddress('kushmanmb.eth'), false);
  assert.equal(isZeroAddress('0x1234567890abcdef1234567890abcdef12345678'), false);
});

// ---------------------------------------------------------------------------
// isAllowedAddress
// ---------------------------------------------------------------------------
test('isAllowedAddress returns true for each of the three allowed addresses', () => {
  assert.equal(isAllowedAddress('kushmanmb.eth'), true);
  assert.equal(isAllowedAddress('yaketh.eth'), true);
  assert.equal(isAllowedAddress('kushmanmb.base.eth'), true);
});

test('isAllowedAddress is case-insensitive', () => {
  assert.equal(isAllowedAddress('KUSHMANMB.ETH'), true);
  assert.equal(isAllowedAddress('YakEth.Eth'), true);
  assert.equal(isAllowedAddress('Kushmanmb.Base.Eth'), true);
});

test('isAllowedAddress returns false for an unknown address', () => {
  assert.equal(isAllowedAddress('other.eth'), false);
  assert.equal(isAllowedAddress(ZERO_ADDRESS), false);
  assert.equal(isAllowedAddress(''), false);
});

// ---------------------------------------------------------------------------
// validateAddress
// ---------------------------------------------------------------------------
test('validateAddress does not throw for each allowed address', () => {
  assert.doesNotThrow(() => validateAddress('kushmanmb.eth'));
  assert.doesNotThrow(() => validateAddress('yaketh.eth'));
  assert.doesNotThrow(() => validateAddress('kushmanmb.base.eth'));
});

test('validateAddress throws on empty string', () => {
  assert.throws(() => validateAddress(''), {
    message: /must not be empty/i,
  });
});

test('validateAddress throws on whitespace-only string', () => {
  assert.throws(() => validateAddress('   '), {
    message: /must not be empty/i,
  });
});

test('validateAddress throws on zero address with descriptive message', () => {
  assert.throws(() => validateAddress(ZERO_ADDRESS), {
    message: /zero address/i,
  });
});

test('validateAddress throws on a non-allowed address with descriptive message', () => {
  assert.throws(() => validateAddress('other.eth'), {
    message: /not in the allowed-address list/i,
  });
});

test('validateAddress error for disallowed address names all three allowed addresses', () => {
  let message = '';
  try {
    validateAddress('not-allowed.eth');
  } catch (err) {
    message = err.message;
  }
  assert.ok(message.includes('kushmanmb.eth'), 'error lists kushmanmb.eth');
  assert.ok(message.includes('yaketh.eth'), 'error lists yaketh.eth');
  assert.ok(message.includes('kushmanmb.base.eth'), 'error lists kushmanmb.base.eth');
});
