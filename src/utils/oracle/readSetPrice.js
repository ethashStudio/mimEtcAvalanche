const Web3 = require("web3") // for nodejs only
require('dotenv').config()
const {PRIVATE_KEY} = process.env

const web3_src = new Web3("https://polygon-rpc.com")                      //data source blockchain is polygon mainnet
//const web3_dst = new Web3("https://api.avax-test.network/ext/bc/C/rpc") //destination blockchain is Avax Fuji Testnet

const oracleABI = [
   {
        inputs: [
          {
            internalType: "uint256",
            name: "y",
            type: "uint256",
          },
        ],
        name: "set",
        outputs: [],
        stateMutability: "nonpayable",
        type: "function",
      },
      {
        inputs: [],
        name: "peekSpot",
        outputs: [
          {
            internalType: "uint256",
            name: "",
            type: "uint256",
          },
        ],
        stateMutability: "view",
        type: "function",
      },
]

const aggregatorV3InterfaceABI = [
  {
    inputs: [],
    name: "decimals",
    outputs: [{ internalType: "uint8", name: "", type: "uint8" }],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [],
    name: "description",
    outputs: [{ internalType: "string", name: "", type: "string" }],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [{ internalType: "uint80", name: "_roundId", type: "uint80" }],
    name: "getRoundData",
    outputs: [
      { internalType: "uint80", name: "roundId", type: "uint80" },
      { internalType: "int256", name: "answer", type: "int256" },
      { internalType: "uint256", name: "startedAt", type: "uint256" },
      { internalType: "uint256", name: "updatedAt", type: "uint256" },
      { internalType: "uint80", name: "answeredInRound", type: "uint80" },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [],
    name: "latestRoundData",
    outputs: [
      { internalType: "uint80", name: "roundId", type: "uint80" },
      { internalType: "int256", name: "answer", type: "int256" },
      { internalType: "uint256", name: "startedAt", type: "uint256" },
      { internalType: "uint256", name: "updatedAt", type: "uint256" },
      { internalType: "uint80", name: "answeredInRound", type: "uint80" },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [],
    name: "version",
    outputs: [{ internalType: "uint256", name: "", type: "uint256" }],
    stateMutability: "view",
    type: "function",
  },
]

const web3_dst = new Web3(`https://avalanche-fuji.infura.io/v3/${process.env.INFURA_API_KEY}`)
const init = async ()=>{
	let etcPrice
	const addr_src = "0xDf3f72Be10d194b58B1BB56f2c4183e661cB2114"    //ETC price feed contract address on polygon mainnet
	const priceFeed = new web3_src.eth.Contract(aggregatorV3InterfaceABI, addr_src)
	await priceFeed.methods.latestRoundData().call()
  		.then((roundData) => {
    		// Do something with roundData
		etcPrice = parseFloat(roundData.answer)
    		console.log("Latest Round Data: ", roundData.answer)
  	})

	const rate = ((1000000000000000000/etcPrice)*100000000).toFixed(0)
	const addr_dst = "0xD119aFbb30367382970d849680C2732748523047"    //ETC oracle contract address on Avalanche Fuji testnet
	const priceSet = new web3_dst.eth.Contract(oracleABI, addr_dst)
	const signer = web3_dst.eth.accounts.privateKeyToAccount(PRIVATE_KEY)
  	web3_dst.eth.accounts.wallet.add(signer);
	const receipt = await priceSet.methods.set(rate).send({from:signer.address, gas: 28000})
	console.log(rate)
}

init()
setInterval(init, 60000) //every 1 minute
