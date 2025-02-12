pragma circom 2.0.0;

// This circuit checks if a token balance is positive.
template PositiveBalanceCheck() {
    // Input: The token balance (must be private if you want privacy)
    signal input balance;

    // Output: A signal indicating if the balance is positive
    signal output isPositive;

    // Temporary signal to store intermediate values
    signal nonNegative;

    // Ensure the balance is non-negative
    nonNegative <-- balance * (balance >- 0);

    // Constrain nonNegative to ensure it is either 0 or 1
    nonNegative * nonNegative - nonNegative === 0;

    // Set isPositive to be the same as nonNegative
    isPositive <-- nonNegative;
}

// Instantiate the template with the main component
component main = PositiveBalanceCheck();
