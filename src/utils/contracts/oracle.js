export default [
  {
    name: "YearnChainlinkOracleV2",
    id: 1,
    contractChain: "0xa869",
    address: "0xed448b3f93D61a008E543347a7826Bab1Ab64FB5",
    abi: [
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
    ],
  },
  {
    name: "ChainlinkOracleV2",
    id: 2,
    contractChain: "0xa869",
    address: "0xed448b3f93D61a008E543347a7826Bab1Ab64FB5",
    abi: [
      {
        inputs: [{ internalType: "bytes", name: "data", type: "bytes" }],
        name: "get",
        outputs: [
          { internalType: "bool", name: "", type: "bool" },
          { internalType: "uint256", name: "", type: "uint256" },
        ],
        stateMutability: "nonpayable",
        type: "function",
      },
      {
        inputs: [
          { internalType: "address", name: "multiply", type: "address" },
          { internalType: "address", name: "divide", type: "address" },
          { internalType: "uint256", name: "decimals", type: "uint256" },
        ],
        name: "getDataParameter",
        outputs: [{ internalType: "bytes", name: "", type: "bytes" }],
        stateMutability: "pure",
        type: "function",
      },
      {
        inputs: [{ internalType: "bytes", name: "", type: "bytes" }],
        name: "name",
        outputs: [{ internalType: "string", name: "", type: "string" }],
        stateMutability: "view",
        type: "function",
      },
      {
        inputs: [{ internalType: "bytes", name: "data", type: "bytes" }],
        name: "peek",
        outputs: [
          { internalType: "bool", name: "", type: "bool" },
          { internalType: "uint256", name: "", type: "uint256" },
        ],
        stateMutability: "view",
        type: "function",
      },
      {
        inputs: [{ internalType: "bytes", name: "data", type: "bytes" }],
        name: "peekSpot",
        outputs: [{ internalType: "uint256", name: "rate", type: "uint256" }],
        stateMutability: "view",
        type: "function",
      },
      {
        inputs: [{ internalType: "bytes", name: "", type: "bytes" }],
        name: "symbol",
        outputs: [{ internalType: "string", name: "", type: "string" }],
        stateMutability: "view",
        type: "function",
      },
    ],
  },
];
