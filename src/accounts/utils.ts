import { createClient, id, Transfer, Account } from 'tigerbeetle-node';
import { LEDGER, ACCOUNT_CODE, ACCOUNT_FLAGS, AccountCreate, TRANSFER_CODE } from './types';

// Initialize TigerBeetle client
export const client = createClient({
    cluster_id: BigInt(0),
    replica_addresses: [process.env.TB_ADDRESS || "3000"],
});

export function createBOFALiabilityAccount(initialNegativeBalance: bigint, openedAt: Date): AccountCreate {
    return {
        id: id(), // TigerBeetle generates a unique ID
        ledger: LEDGER.PERSONAL,
        code: ACCOUNT_CODE.LIABILITY.BANK_OVERDRAFT,
        flags: ACCOUNT_FLAGS.LIABILITY,
        debitsPending: BigInt(0),
        debitsPosted: BigInt(0),
        creditsPending: BigInt(0),
        creditsPosted: initialNegativeBalance, // Initial negative balance as credits
        timestamp: BigInt(openedAt.getTime()),
    };
}

// Helper to create a transfer between accounts
export async function createTransfer(
    fromAccountId: bigint,
    toAccountId: bigint,
    amount: bigint,
    timestamp: Date,
) {
    const transfer: Transfer = {
        id: id(),
        debit_account_id: fromAccountId,
        credit_account_id: toAccountId,
        amount: amount,
        ledger: LEDGER.PERSONAL,
        code: TRANSFER_CODE.STANDARD,
        timestamp: BigInt(timestamp.getTime()),
        pending_id: BigInt(0),
        user_data_128: BigInt(0),
        user_data_64: BigInt(0),
        user_data_32: 0,
        timeout: 0,
        flags: 0,
    };

    const transfer_errors = await client.createTransfers([transfer]);
    if (transfer_errors.length > 0) {
        throw new Error(`Failed to create transfer: ${JSON.stringify(transfer_errors)}`);
    }

    return transfer;
}

// Helper to get account balance
export function getAccountBalance(account: Account): bigint {
    // Check if account is a liability
    if (account.code >= ACCOUNT_CODE.LIABILITY.START && account.code < ACCOUNT_CODE.LIABILITY.END) {
        return -account.debits_posted + account.credits_posted;
    }
    // Check if account is an asset
    if (account.code >= ACCOUNT_CODE.ASSET.START && account.code < ACCOUNT_CODE.ASSET.END) {
        return account.debits_posted - account.credits_posted;
    }
    throw new Error(`Invalid account code: ${account.code}`);
} 