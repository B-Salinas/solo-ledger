import { AccountFlags } from 'tigerbeetle-node';

export const LEDGER = {
    PERSONAL: 1, // Your personal finance ledger
} as const;

export const ACCOUNT_CODE = {
    LIABILITY: {
        START: 2000,
        END: 3000,
        BANK_OVERDRAFT: 2001, // For accounts like BOFA that went negative
        CREDIT_CARD: 2002,    // For credit card debts
        LOAN: 2003,          // For various loans
    },
    ASSET: {
        START: 1000,
        END: 2000,
        CHECKING: 1001,      // For checking accounts
        SAVINGS: 1002,       // For savings accounts
        CASH: 1003,          // For physical cash tracking
    },
} as const;

export const TRANSFER_CODE = {
    STANDARD: 1,      // Standard money transfer
    PAYMENT: 2,       // Payment towards a liability
    WITHDRAWAL: 3,    // Cash withdrawal
    DEPOSIT: 4,       // Cash deposit
} as const;

// Helper to create standard flags for different account types
export const ACCOUNT_FLAGS = {
    LIABILITY: AccountFlags.linked | AccountFlags.debits_must_not_exceed_credits,
    ASSET: AccountFlags.linked | AccountFlags.credits_must_not_exceed_debits,
} as const;

// Interface for creating new accounts
export interface AccountCreate {
    id: bigint;
    ledger: number;
    code: number;
    flags: number;
    debitsPending?: bigint;
    debitsPosted?: bigint;
    creditsPending?: bigint;
    creditsPosted?: bigint;
    userData128?: bigint;  // Can store additional metadata
    userData64?: bigint;   // Can store additional metadata
    userData32?: number;   // Can store additional metadata
    timestamp?: bigint;    // When the account was opened
    reserved: number;
} 