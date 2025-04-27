import { client, createBOFALiabilityAccount, createOpeningBalanceTransfer } from './utils.ts';

// Initial BOFA liability amount: $4,300.49
const INITIAL_BALANCE = BigInt(4300_49); // Amount in cents

async function initializeBOFAAccount() {
    try {
        // Create the account with initial negative balance
        // The date represents when the liability was incurred
        const bofaAccount = await createBOFALiabilityAccount(
            new Date('2024-04-26') // Date when the liability was created
        );

        // Fund the account with the initial balance using a transfer
        await createOpeningBalanceTransfer(bofaAccount.id, INITIAL_BALANCE);

        console.log('BOFA liability account created and funded successfully');
        return bofaAccount;
    } catch (error) {
        console.error('Error creating BOFA account:', error);
        throw error;
    }
}

// Export for CLI usage
export { initializeBOFAAccount, INITIAL_BALANCE }; 