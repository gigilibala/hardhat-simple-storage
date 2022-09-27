import { ethers } from 'hardhat'
import {expect, assert} from 'chai'

describe('SimpleStorage', function() {
    let simpleStorageFactory: ethers.ContractFactory
    let simpleStorage: any
    beforeEach(async function () {
        simpleStorageFactory = await ethers.getContractFactory('SimpleStorage')
        simpleStorage = await simpleStorageFactory.deploy()
    })

    it('Should start with favorite number of 0', async function () {
        const currentValue = await simpleStorage.retrieve()
        const expectedValue = "0"

        assert.equal(currentValue.toString(), expectedValue)
    })
    it('Should update the value in the store', async function() {
        const expectedValue = "7"
        const transactionResponse = await simpleStorage.store(expectedValue)
        await transactionResponse.wait(1)
        
        const currentValue = await simpleStorage.retrieve()

        assert.equal(currentValue, expectedValue)

    })
    it('People should be added easily', async function() {
        // const people = await simpleStorage.people
        // console.log(people)

        const txRes = await simpleStorage.addPerson('Amin', 10)
        await txRes.wait(1)

        const currentPerson = await simpleStorage.people(0)
        assert.equal(currentPerson.name, 'Amin')
        assert.equal(currentPerson.favoriteNumber, 10)
    })
})
