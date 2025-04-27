// Basic math/logic test example for Solo-Ledger

function testDoubleEntry() {
  // In double-entry, total debits must equal total credits
  const debits = [100, 200, 50];
  const credits = [150, 200];
  const totalDebits = debits.reduce((a, b) => a + b, 0);
  const totalCredits = credits.reduce((a, b) => a + b, 0);
  if (totalDebits !== totalCredits) {
    throw new Error(`Double-entry invariant failed: debits=${totalDebits}, credits=${totalCredits}`);
  }
}

try {
  testDoubleEntry();
  console.log('math.test.ts: All tests passed!');
} catch (err) {
  if (err instanceof Error) {
    console.error('math.test.ts:', err.message);
  } else {
    console.error('math.test.ts: Unknown error', err);
  }
  process.exit(1);
} 