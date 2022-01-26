A simple abstract contract that allows for a specified wallet to receive a portion of the balance stored in the contract when the owner of the contract does a withdrawal.

For example if the contract holds 100 ETH and the owner calls contract.withdraw() then the royalty wallet would receive 3 ETH and the owner would receive 97 ETH minus gas fees.

Leverages the [AbstractPrice](https://nexttemplate-eight.vercel.app/component/AbstractPrice) contract for storing the minting price.