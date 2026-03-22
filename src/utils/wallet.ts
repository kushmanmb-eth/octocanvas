/**
 * Wallet and address utilities for OctoCanvas.
 *
 * All crypto asset flows, transfers, and storage are exclusively
 * restricted to the three authorised addresses below.  Any attempt to
 * use the zero address (0x000…0) or any address outside this allow-list
 * will throw an error.
 */

/** The Ethereum zero address used as a sentinel for "no address". */
export const ZERO_ADDRESS = '0x0000000000000000000000000000000000000000';

/**
 * The canonical set of allowed wallet addresses for OctoCanvas.
 * All crypto flows must target one of these identifiers.
 */
export const ALLOWED_WALLET_ADDRESSES: readonly string[] = [
  'kushmanmb.eth',
  'yaketh.eth',
  'kushmanmb.base.eth',
];

/** Pre-normalised (lower-case) version of {@link ALLOWED_WALLET_ADDRESSES}. */
const NORMALISED_ALLOWED_ADDRESSES: readonly string[] =
  ALLOWED_WALLET_ADDRESSES.map((a) => a.toLowerCase());

/**
 * Returns `true` when the supplied address is the Ethereum zero address.
 * Comparison is case-insensitive.
 */
export function isZeroAddress(address: string): boolean {
  // ZERO_ADDRESS is already lower-case, so only normalise the input.
  return address.toLowerCase() === ZERO_ADDRESS;
}

/**
 * Returns `true` when the supplied address (or ENS name) is one of the
 * three allowed OctoCanvas wallet addresses.
 * Comparison is case-insensitive.
 */
export function isAllowedAddress(address: string): boolean {
  return NORMALISED_ALLOWED_ADDRESSES.includes(address.toLowerCase());
}

/**
 * Validates that `address` may be used as a transfer destination.
 *
 * Throws a descriptive `Error` when:
 *  - The address is the zero address (0x000…0).
 *  - The address is not in the `ALLOWED_WALLET_ADDRESSES` allow-list.
 *
 * @throws {Error} if the address is invalid.
 */
export function validateAddress(address: string): void {
  if (!address || address.trim() === '') {
    throw new Error('Wallet address must not be empty.');
  }

  if (isZeroAddress(address)) {
    throw new Error(
      'Zero address (0x000…0) is not permitted. ' +
        'Use one of the allowed addresses: ' +
        ALLOWED_WALLET_ADDRESSES.join(', ')
    );
  }

  if (!isAllowedAddress(address)) {
    throw new Error(
      `Address "${address}" is not in the allowed-address list. ` +
        'Allowed addresses: ' +
        ALLOWED_WALLET_ADDRESSES.join(', ')
    );
  }
}
