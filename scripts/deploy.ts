import { ethers, run, network } from 'hardhat'

async function main() {
    const simpleStorageFactory = await ethers.getContractFactory(
        'SimpleStorage'
    )

    console.log('Deploying contract...')
    const simpleStorage = await simpleStorageFactory.deploy()
    await simpleStorage.deployed()

    console.log(`Deployed contract to: ${simpleStorage.address}`)

    if (network.config.chainId === 5 && process.env.ETHERSCAN_API_KEY) {
        console.log('Waiting for transaction deployment confirmation.')
        await simpleStorage.deployTransaction.wait(5)
        verify(simpleStorage.address, [])
    }

    const currentValue = await simpleStorage.retrieve()
    console.log(`Current value ${currentValue}`)

    const transactionResponse = await simpleStorage.store(8)
    await transactionResponse.wait(1)

    const updatedValue = await simpleStorage.retrieve()
    console.log(`Updated value: ${updatedValue}`)
}

async function verify(contractAddress: string, args: any) {
    try {
        await run('verify:verify', {
            address: contractAddress,
            constructorArguments: args,
        })
    } catch (e: unknown | Error) {
        if (
            e instanceof Error &&
            e.message.toLowerCase().includes('already verified')
        ) {
            console.log('Already verified!')
        } else {
            console.log(e)
        }
    }
}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main().catch((error) => {
    console.error(error)
    process.exitCode = 1
})
