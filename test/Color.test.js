const { assert } = require("chai");

const Color = artifacts.require('./Color.sol')

require('chai')
  .use(require('chai-as-promised'))
  .should()

contract('Color', (accounts) => {
  let contract
  before(async () => {
    contract = await Color.deployed()
  })

  describe('Deployment', async() => {
    it('should be deployed without any errors', async () => {
      const address = contract.address
      assert.notEqual(address, 0x0);
      assert.notEqual(address, '');
      assert.notEqual(address, null);
      assert.notEqual(address, undefined);
    });
  
    it('has a name', async () => {
      const name = await contract.name() 
      assert.equal(name, 'Color')
    })

    it('has a symbol', async () => {
      const name = await contract.symbol() 
      assert.equal(name, 'COL')
    })
  })

  describe('Miniting', async () => {
    it('creates a new token', async () => {
      const result = await contract.mint('#FBFBFB')
      const totalSupply = await contract.totalSupply()

      // Success
      assert.equal(totalSupply, 1)
      const event = result.logs[0].args
      assert.equal(event.tokenId.toNumber(), 1, 'id is correct')
      assert.equal(event.from, '0x0000000000000000000000000000000000000000', 'from is correct')
      assert.equal(event.to, accounts[0], 'to is correct')

      // Failure
      await contract.mint('#FBFBFB').should.be.rejected;
    })
  })

  describe('Indexing', async () => {
    it('lists colors', async () => {
      // Mint 3 more tokens
      await contract.mint('#2A2A2A');
      await contract.mint('#2B2B2B');
      await contract.mint('#2C2C2C');

      const totalSupply = await contract.totalSupply()
      let results = []

      for(let i=1; i<=totalSupply; i++) {
        const color = await contract.colors(i - 1);
        results.push(color)
      }

      const expected = [
        '#FBFBFB',
        '#2A2A2A',
        '#2B2B2B',
        '#2C2C2C'
      ]
      assert.equal(results.join(','), expected.join(','))
    })
  })
});
  