import { AccountFlags, createClient, id as tbid } from 'tigerbeetle-node';
import { ACCOUNT_CODE, TRANSFER_CODE, LEDGER, ACCOUNT_FLAGS } from './types.ts';

// Types for TigerBeetle
type UInt128 = bigint;

const tbClient = createClient({
    cluster_id: BigInt(0),
    replica_addresses: [process.env.TB_ADDRESS || "3000"],
});

export interface Transfer {
    id: UInt128;
    debit_account_id: UInt128;
    credit_account_id: UInt128;
    amount: UInt128;
    ledger: number;
    code: number;
    flags: UInt128;
    timestamp: UInt128;
    userdata: UInt128;
    reserved: number;
}

export interface Account {
    id: UInt128;
    ledger: number;
    code: number;
    flags: AccountFlags;
    debits_pending: UInt128;
    debits_posted: UInt128;
    credits_pending: UInt128;
    credits_posted: UInt128;
    user_data_128: UInt128;
    user_data_64: UInt128;
    user_data_32: number;
    reserved: number;
    timestamp: UInt128;
    userdata: UInt128;
}

// Initialize TigerBeetle client
export const client = {
    createAccounts: async (accounts: Account[]) => {
        // Implementation will be added later
        return Promise.resolve();
    },
    createTransfers: async (transfers: Transfer[]) => {
        // Implementation will be added later
        return Promise.resolve();
    },
    lookupAccounts: async (ids: bigint[]) => {
        return tbClient.lookupAccounts(ids);
    }
};

// Create a BOFA liability account
export const createBOFALiabilityAccount = async (openedAt: Date = new Date()): Promise<Account> => {
    const account: Account = {
        id: tbid(),
        ledger: Number(LEDGER.PERSONAL),
        code: Number(ACCOUNT_CODE.LIABILITY.BANK_OVERDRAFT),
        flags: AccountFlags.linked,
        debits_pending: BigInt(0),
        debits_posted: BigInt(0),
        credits_pending: BigInt(0),
        credits_posted: BigInt(0),
        user_data_128: BigInt(0),
        user_data_64: BigInt(0),
        user_data_32: 0,
        userdata: BigInt(0),
        reserved: 0,
        timestamp: BigInt(0)
    };
    console.log('Creating BOFA liability account:', account);
    const result = await tbClient.createAccounts([account]);
    console.log('createAccounts result (BOFA):', result);
    if (result && result.length > 0) {
        throw new Error('TigerBeetle createAccounts error (BOFA): ' + JSON.stringify(result));
    }
    return account;
};

// Create or get the Opening Balances equity account
export const getOrCreateOpeningBalanceAccount = async (): Promise<Account> => {
    const openingBalanceCode = 4000; // Arbitrary code for equity:opening balances
    const openingBalanceId = BigInt("4000000000000000"); // Arbitrary unique ID
    const accounts = await client.lookupAccounts([openingBalanceId]);
    if (accounts && accounts.length > 0) {
        // Patch missing userdata for compatibility
        const acc = accounts[0] as unknown as Partial<Account>;
        if (typeof acc.userdata === 'undefined') {
            (acc as Account).userdata = BigInt(0);
        }
        return acc as Account;
    }
    const account: Account = {
        id: openingBalanceId,
        ledger: Number(LEDGER.PERSONAL),
        code: openingBalanceCode,
        flags: AccountFlags.linked,
        debits_pending: BigInt(0),
        debits_posted: BigInt(0),
        credits_pending: BigInt(0),
        credits_posted: BigInt(0),
        user_data_128: BigInt(0),
        user_data_64: BigInt(0),
        user_data_32: 0,
        userdata: BigInt(0),
        reserved: 0,
        timestamp: BigInt(0)
    };
    console.log('Creating Opening Balances account:', account);
    const result = await tbClient.createAccounts([account]);
    console.log('createAccounts result (Opening Balances):', result);
    if (result && result.length > 0) {
        throw new Error('TigerBeetle createAccounts error (Opening Balances): ' + JSON.stringify(result));
    }
    return account;
};

// Create a transfer from Opening Balances to BOFA liability
export const createOpeningBalanceTransfer = async (bofaAccountId: bigint, amount: bigint): Promise<Transfer> => {
    const openingAccount = await getOrCreateOpeningBalanceAccount();
    return createTransfer(openingAccount.id, bofaAccountId, amount, BigInt(TRANSFER_CODE.STANDARD));
};

// Create a transfer between accounts
export const createTransfer = async (
    debitAccountId: UInt128,
    creditAccountId: UInt128,
    amount: UInt128,
    transferCode: UInt128
): Promise<Transfer> => {
    const transfer: Transfer = {
        id: tbid(),
        debit_account_id: debitAccountId,
        credit_account_id: creditAccountId,
        amount: amount,
        ledger: Number(LEDGER.PERSONAL),
        code: Number(transferCode),
        flags: BigInt(0),
        timestamp: BigInt(Date.now()),
        userdata: BigInt(0),
        reserved: 0
    };

    try {
        await client.createTransfers([transfer]);
        return transfer;
    } catch (error) {
        console.error('Failed to create transfer:', error);
        throw error;
    }
};

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