import { initializeBOFAAccount } from '../accounts/bofa.ts';
import { client } from '../accounts/utils.ts';

function sleep(ms: number) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

async function main() {
    try {
        // Initialize the BOFA account
        const account = await initializeBOFAAccount();
        console.log(`Created BOFA account with ID: ${account.id}`);

        // Wait a bit to ensure TigerBeetle processes the creation
        await sleep(500);

        // Verify the account was created by looking it up
        console.log('Looking up account by ID...');
        const accounts = await client.lookupAccounts([account.id]);
        console.log('Lookup result:', accounts);

        if (!accounts || accounts.length === 0) {
            throw new Error('BOFA account not found after creation');
        }

        const bofaAccount = accounts[0];
        console.log('\nBOFA Account Details:');
        console.log('---------------------');
        console.log(`ID: ${bofaAccount.id}`);
        console.log(`Credits Posted (Liability): ${bofaAccount.credits_posted}`);
        console.log(`Debits Posted: ${bofaAccount.debits_posted}`);
        console.log(`Current Balance: $${(Number(bofaAccount.credits_posted - bofaAccount.debits_posted) / 100).toFixed(2)}`);
        
    } catch (error) {
        console.error('Failed to initialize BOFA account:', error);
        process.exit(1);
    }
}

main(); 