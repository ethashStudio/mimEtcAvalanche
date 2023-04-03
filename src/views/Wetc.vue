<template>
  <div class="pool-view">
    <div class="container mini">
      <BackButton :text="'Stand'" @click="toStand" />

      <h1>Get some WETC here</h1>

      <div class="pool-head-bar">
        <div class="btns-group">
          <button
            class="btn mini borrow-btn"
            :class="{ active: actionType === 'borrow' }"
            @click="setActionType('borrow')"
          >
            Deposite
          </button>
          <button
            class="btn mini replay-btn"
            :class="{ active: actionType === 'repay' }"
            @click="setActionType('repay')"
          >
            Withdraw
          </button>
        </div>
      </div>

      <div class="pool-content" v-if="true">
        <DepositeWithdrawComponent
          :actionType="actionType"
          :balance="pool.userBalance"
          :pairBalance="pool.userPairBalance"
          @depositeEtc="depositeEtcHandler"
          @withdrawEtc="withdrawEtcHandler"
          :isUpdatePrice="pool.askUpdatePrice"
          :tokenName="pool.token.name"
          :tokenToUsd="pool.tokenPrice"
          :tokenDecimals="pool.token.decimals"
          :tokenPair="pool.tokenPairPrice"
          :tokenPairName="pool.pairToken.name"
          :tokenPairDecimals="pool.pairToken.decimals"
          :userTotalCollateral="pool.userCollateralShare"
          :userTotalBorrowed="pool.userBorrowPart"
          :ltv="pool.ltv"
        />
      </div>
    </div>
  </div>
</template>

<script>
const DepositeWithdrawComponent = () =>
  import("@/components/Pool/DepositeWithdrawComponent");
const BackButton = () => import("@/components/UiComponents/BackButton");
import Web3 from "web3";

export default {
  data() {
    return {
      actionType: "borrow",
      // pool: null,
      gasLimitConst: 1000,
    };
  },
  computed: {
    pool() {
      const poolId = 2;
      return this.$store.getters.getPoolById(poolId);
    },
    signer() {
      return this.$store.getters.getSigner;
    },
    account() {
      return this.$store.getters.getAccount;
    },
  },
  methods: {
    setActionType(type) {
      if (type !== this.actionType) this.actionType = type;
    },
    toStand() {
      this.$router.push({ name: "Stand" });
    },

    async depositeEtcHandler(data) {
      console.log("Deposite ETC process", data);
      const accounts = await ethereum.request({
        method: "eth_requestAccounts",
      });
      const account0 = accounts[0];
      console.log(account0);
      const abi = [
        {
          anonymous: false,
          inputs: [
            {
              indexed: true,
              internalType: "address",
              name: "src",
              type: "address",
            },
            {
              indexed: true,
              internalType: "address",
              name: "guy",
              type: "address",
            },
            {
              indexed: false,
              internalType: "uint256",
              name: "wad",
              type: "uint256",
            },
          ],
          name: "Approval",
          type: "event",
        },
        {
          anonymous: false,
          inputs: [
            {
              indexed: true,
              internalType: "address",
              name: "dst",
              type: "address",
            },
            {
              indexed: false,
              internalType: "uint256",
              name: "wad",
              type: "uint256",
            },
          ],
          name: "Deposit",
          type: "event",
        },
        {
          anonymous: false,
          inputs: [
            {
              indexed: true,
              internalType: "address",
              name: "src",
              type: "address",
            },
            {
              indexed: true,
              internalType: "address",
              name: "dst",
              type: "address",
            },
            {
              indexed: false,
              internalType: "uint256",
              name: "wad",
              type: "uint256",
            },
          ],
          name: "Transfer",
          type: "event",
        },
        {
          anonymous: false,
          inputs: [
            {
              indexed: true,
              internalType: "address",
              name: "src",
              type: "address",
            },
            {
              indexed: false,
              internalType: "uint256",
              name: "wad",
              type: "uint256",
            },
          ],
          name: "Withdrawal",
          type: "event",
        },
        {
          inputs: [
            {
              internalType: "address",
              name: "",
              type: "address",
            },
            {
              internalType: "address",
              name: "",
              type: "address",
            },
          ],
          name: "allowance",
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
        {
          inputs: [
            {
              internalType: "address",
              name: "guy",
              type: "address",
            },
            {
              internalType: "uint256",
              name: "wad",
              type: "uint256",
            },
          ],
          name: "approve",
          outputs: [
            {
              internalType: "bool",
              name: "",
              type: "bool",
            },
          ],
          stateMutability: "nonpayable",
          type: "function",
        },
        {
          inputs: [
            {
              internalType: "address",
              name: "",
              type: "address",
            },
          ],
          name: "balanceOf",
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
        {
          inputs: [],
          name: "decimals",
          outputs: [
            {
              internalType: "uint8",
              name: "",
              type: "uint8",
            },
          ],
          stateMutability: "view",
          type: "function",
        },
        {
          inputs: [],
          name: "deposit",
          outputs: [],
          stateMutability: "payable",
          type: "function",
        },
        {
          inputs: [],
          name: "name",
          outputs: [
            {
              internalType: "string",
              name: "",
              type: "string",
            },
          ],
          stateMutability: "view",
          type: "function",
        },
        {
          inputs: [],
          name: "symbol",
          outputs: [
            {
              internalType: "string",
              name: "",
              type: "string",
            },
          ],
          stateMutability: "view",
          type: "function",
        },
        {
          inputs: [],
          name: "totalSupply",
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
        {
          inputs: [
            {
              internalType: "address",
              name: "dst",
              type: "address",
            },
            {
              internalType: "uint256",
              name: "wad",
              type: "uint256",
            },
          ],
          name: "transfer",
          outputs: [
            {
              internalType: "bool",
              name: "",
              type: "bool",
            },
          ],
          stateMutability: "nonpayable",
          type: "function",
        },
        {
          inputs: [
            {
              internalType: "address",
              name: "src",
              type: "address",
            },
            {
              internalType: "address",
              name: "dst",
              type: "address",
            },
            {
              internalType: "uint256",
              name: "wad",
              type: "uint256",
            },
          ],
          name: "transferFrom",
          outputs: [
            {
              internalType: "bool",
              name: "",
              type: "bool",
            },
          ],
          stateMutability: "nonpayable",
          type: "function",
        },
        {
          inputs: [
            {
              internalType: "uint256",
              name: "wad",
              type: "uint256",
            },
          ],
          name: "withdraw",
          outputs: [],
          stateMutability: "nonpayable",
          type: "function",
        },
        {
          stateMutability: "payable",
          type: "receive",
        },
      ];
      const address = this.pool.token.contract.address;
      web3 = new Web3(window.web3.currentProvider);
      const contract_etc = new web3.eth.Contract(abi, address);
      // console.log(contract_etc);
      // console.log(abi);
      // console.log(address);
      console.log("xxxxxxx");
      console.log(data.amount);
      await contract_etc.methods
        .deposit()
        .send({ from: account0, value: data.amount });
      // this.pool.token.contract.approve(
      //   "0xe075bb370e9139fd5b24eb1dafabd56bedfed34d",
      //   "0xffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff"
      // );
      //why this is wrong below
      // await this.pool.tokenContract
      //   .deposit()
      //   .send({ from: account0, value: data.amount });
      console.log(this.pool.token.contract.address);
    },

    async withdrawEtcHandler(data) {
      console.log("Withdraw ETC Process", data);

      const accounts = await ethereum.request({
        method: "eth_requestAccounts",
      });
      const account0 = accounts[0];
      console.log(account0);
      const abi = [
        {
          anonymous: false,
          inputs: [
            {
              indexed: true,
              internalType: "address",
              name: "src",
              type: "address",
            },
            {
              indexed: true,
              internalType: "address",
              name: "guy",
              type: "address",
            },
            {
              indexed: false,
              internalType: "uint256",
              name: "wad",
              type: "uint256",
            },
          ],
          name: "Approval",
          type: "event",
        },
        {
          anonymous: false,
          inputs: [
            {
              indexed: true,
              internalType: "address",
              name: "dst",
              type: "address",
            },
            {
              indexed: false,
              internalType: "uint256",
              name: "wad",
              type: "uint256",
            },
          ],
          name: "Deposit",
          type: "event",
        },
        {
          anonymous: false,
          inputs: [
            {
              indexed: true,
              internalType: "address",
              name: "src",
              type: "address",
            },
            {
              indexed: true,
              internalType: "address",
              name: "dst",
              type: "address",
            },
            {
              indexed: false,
              internalType: "uint256",
              name: "wad",
              type: "uint256",
            },
          ],
          name: "Transfer",
          type: "event",
        },
        {
          anonymous: false,
          inputs: [
            {
              indexed: true,
              internalType: "address",
              name: "src",
              type: "address",
            },
            {
              indexed: false,
              internalType: "uint256",
              name: "wad",
              type: "uint256",
            },
          ],
          name: "Withdrawal",
          type: "event",
        },
        {
          inputs: [
            {
              internalType: "address",
              name: "",
              type: "address",
            },
            {
              internalType: "address",
              name: "",
              type: "address",
            },
          ],
          name: "allowance",
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
        {
          inputs: [
            {
              internalType: "address",
              name: "guy",
              type: "address",
            },
            {
              internalType: "uint256",
              name: "wad",
              type: "uint256",
            },
          ],
          name: "approve",
          outputs: [
            {
              internalType: "bool",
              name: "",
              type: "bool",
            },
          ],
          stateMutability: "nonpayable",
          type: "function",
        },
        {
          inputs: [
            {
              internalType: "address",
              name: "",
              type: "address",
            },
          ],
          name: "balanceOf",
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
        {
          inputs: [],
          name: "decimals",
          outputs: [
            {
              internalType: "uint8",
              name: "",
              type: "uint8",
            },
          ],
          stateMutability: "view",
          type: "function",
        },
        {
          inputs: [],
          name: "deposit",
          outputs: [],
          stateMutability: "payable",
          type: "function",
        },
        {
          inputs: [],
          name: "name",
          outputs: [
            {
              internalType: "string",
              name: "",
              type: "string",
            },
          ],
          stateMutability: "view",
          type: "function",
        },
        {
          inputs: [],
          name: "symbol",
          outputs: [
            {
              internalType: "string",
              name: "",
              type: "string",
            },
          ],
          stateMutability: "view",
          type: "function",
        },
        {
          inputs: [],
          name: "totalSupply",
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
        {
          inputs: [
            {
              internalType: "address",
              name: "dst",
              type: "address",
            },
            {
              internalType: "uint256",
              name: "wad",
              type: "uint256",
            },
          ],
          name: "transfer",
          outputs: [
            {
              internalType: "bool",
              name: "",
              type: "bool",
            },
          ],
          stateMutability: "nonpayable",
          type: "function",
        },
        {
          inputs: [
            {
              internalType: "address",
              name: "src",
              type: "address",
            },
            {
              internalType: "address",
              name: "dst",
              type: "address",
            },
            {
              internalType: "uint256",
              name: "wad",
              type: "uint256",
            },
          ],
          name: "transferFrom",
          outputs: [
            {
              internalType: "bool",
              name: "",
              type: "bool",
            },
          ],
          stateMutability: "nonpayable",
          type: "function",
        },
        {
          inputs: [
            {
              internalType: "uint256",
              name: "wad",
              type: "uint256",
            },
          ],
          name: "withdraw",
          outputs: [],
          stateMutability: "nonpayable",
          type: "function",
        },
        {
          stateMutability: "payable",
          type: "receive",
        },
      ];
      const address = this.pool.token.contract.address;
      web3 = new Web3(window.web3.currentProvider);
      const contract_etc = new web3.eth.Contract(abi, address);
      console.log("xxxxxxx");
      console.log(data.amount);
      // console.log(contract_etc);
      await contract_etc.methods.withdraw(data.amount).send({ from: account0 });
      console.log(this.pool.token.contract.address);
    },

    async cookAddCollateral({ amount, updatePrice }, isApprowed) {
      const depositEncode = this.getDepositEncode(amount);

      const colateralEncode = this.getAddCollateralEncode();

      const gasPrice = await this.getGasPrice();
      console.log("GAS PRICE:", gasPrice);
      console.log(
        "this.pool.contractInstance:",
        this.pool.contractInstance.address
      );
      console.log(
        "this.pool.token.contract:",
        this.pool.token.contract.address
      );
      console.log(
        "this.pool.pairTokenContract:",
        this.pool.pairTokenContract.address
      );
      console.log(
        "this.pool.masterContractInstance.address",
        this.pool.masterContractInstance.address
      );
      if (isApprowed) {
        console.log("APPROWED");

        if (updatePrice) {
          const updateEncode = this.getUpdateRateEncode();

          const estimateGas = await this.pool.contractInstance.estimateGas.cook(
            [11, 20, 10],
            [0, 0, 0],
            [updateEncode, depositEncode, colateralEncode],
            {
              value: 0,
              // gasPrice,
              // gasLimit: 1000000,
            }
          );

          const gasLimit = this.gasLimitConst + +estimateGas.toString();

          console.log("gasLimit:", gasLimit);

          const result = await this.pool.contractInstance.cook(
            [11, 20, 10],
            [0, 0, 0],
            [updateEncode, depositEncode, colateralEncode],
            {
              value: 0,
              // gasPrice,
              gasLimit,
            }
          );

          console.log(result);
          return false;
        }

        const estimateGas = await this.pool.contractInstance.estimateGas.cook(
          [20, 10],
          [0, 0],
          [depositEncode, colateralEncode],
          {
            value: 0,
            // gasPrice,
            // gasLimit: 1000000,
          }
        );

        const gasLimit = this.gasLimitConst + +estimateGas.toString();

        console.log("gasLimit:", gasLimit);

        const result = await this.pool.contractInstance.cook(
          [20, 10],
          [0, 0],
          [depositEncode, colateralEncode],
          {
            value: 0,
            // gasPrice,
            gasLimit,
          }
        );

        console.log(result);
        return false;
      }

      console.log("NOT APPROWED");
      const approvalEncode = await this.getApprovalEncode();

      console.log("approvalEncode result:", approvalEncode);

      if (approvalEncode === "ledger") {
        const approvalMaster = await this.approveMasterContract();

        console.log("approveMasterContract resp: ", approvalMaster);

        if (!approvalMaster) return false;

        if (updatePrice) {
          const updateEncode = this.getUpdateRateEncode();

          const estimateGas = await this.pool.contractInstance.estimateGas.cook(
            [11, 20, 10],
            [0, 0, 0],
            [updateEncode, depositEncode, colateralEncode],
            {
              value: 0,
              // gasPrice,
              // gasLimit: 1000000,
            }
          );

          const gasLimit = this.gasLimitConst + +estimateGas.toString();

          console.log("gasLimit:", gasLimit);

          const result = await this.pool.contractInstance.cook(
            [11, 20, 10],
            [0, 0, 0],
            [updateEncode, depositEncode, colateralEncode],
            {
              value: 0,
              // gasPrice,
              gasLimit,
            }
          );

          console.log(result);
          return false;
        }

        const estimateGas = await this.pool.contractInstance.estimateGas.cook(
          [20, 10],
          [0, 0],
          [depositEncode, colateralEncode],
          {
            value: 0,
            // gasPrice,
            // gasLimit: 1000000,
          }
        );

        const gasLimit = this.gasLimitConst + +estimateGas.toString();

        console.log("gasLimit:", gasLimit);

        const result = await this.pool.contractInstance.cook(
          [20, 10],
          [0, 0],
          [depositEncode, colateralEncode],
          {
            value: 0,
            // gasPrice,
            gasLimit,
          }
        );

        console.log(result);

        return false;
      }

      if (updatePrice) {
        const updateEncode = this.getUpdateRateEncode();

        const estimateGas = await this.pool.contractInstance.estimateGas.cook(
          [24, 11, 20, 10],
          [0, 0, 0, 0],
          [approvalEncode, updateEncode, depositEncode, colateralEncode],
          {
            value: 0,
            // gasPrice,
            // gasLimit: 1000000,
          }
        );

        const gasLimit = this.gasLimitConst + +estimateGas.toString();

        console.log("gasLimit:", gasLimit);

        const result = await this.pool.contractInstance.cook(
          [24, 11, 20, 10],
          [0, 0, 0, 0],
          [approvalEncode, updateEncode, depositEncode, colateralEncode],
          {
            value: 0,
            // gasPrice,
            gasLimit,
          }
        );

        console.log(result);
        return false;
      }

      console.log("xxxxxxxxxx!!!");
      // const estimateGas = await this.pool.contractInstance.estimateGas.cook(
      // [24, 20, 10],
      // [0, 0, 0],
      // [approvalEncode, depositEncode, colateralEncode],
      // {
      // value: 0,
      // gasPrice,
      // gasLimit: 1000000,
      // }
      // );

      // const gasLimit = this.gasLimitConst + +estimateGas.toString();
      const gasLimit = 8000000;

      console.log("gasLimit:", gasLimit);
      console.log("approvalEncode:", approvalEncode);
      console.log("depositEncode:", depositEncode);
      console.log("colateralEncode:", colateralEncode);
      console.log(
        "this.pool.contractInstance:",
        this.pool.contractInstance.address
      );
      console.log(
        "this.pool.token.contract:",
        this.pool.token.contract.address
      );
      console.log(
        "this.pool.pairTokenContract:",
        this.pool.pairTokenContract.address
      );
      console.log(
        "this.pool.masterContractInstance.address",
        this.pool.masterContractInstance.address
      );

      const result = await this.pool.contractInstance.cook(
        [24, 20, 10],
        [0, 0, 0],
        [approvalEncode, depositEncode, colateralEncode],
        {
          value: 0,
          // gasPrice,
          gasLimit,
        }
      );

      console.log(result);
    },

    async getApprovalEncode() {
      const account = this.account;

      const verifyingContract = await this.getVerifyingContract();
      const masterContract = await this.getMasterContract();
      const nonce = await this.getNonce();
      const chainId = this.$store.getters.getActiveChain.code;

      const domain = {
        name: "BentoBox V1",
        chainId,
        verifyingContract,
      };

      // The named list of all type definitions
      const types = {
        SetMasterContractApproval: [
          { name: "warning", type: "string" },
          { name: "user", type: "address" },
          { name: "masterContract", type: "address" },
          { name: "approved", type: "bool" },
          { name: "nonce", type: "uint256" },
        ],
      };

      // The data to sign
      const value = {
        warning: "Give FULL access to funds in (and approved to) BentoBox?",
        user: account,
        masterContract,
        approved: true,
        nonce,
      };
      console.log(chainId);

      let signature;

      try {
        signature = await this.signer._signTypedData(domain, types, value);
      } catch (e) {
        console.log("SIG ERR:", e.code);
        if (e.code === -32603) {
          return "ledger";

          // this.$store.commit("setPopupState", {
          //   type: "device-error",
          //   isShow: true,
          // });
        }
        return false;
      }

      const parsedSignature = this.parseSignature(signature);

      return this.$ethers.utils.defaultAbiCoder.encode(
        ["address", "address", "bool", "uint8", "bytes32", "bytes32"],
        [
          account,
          masterContract,
          true,
          parsedSignature.v,
          parsedSignature.r,
          parsedSignature.s,
        ]
      );
    },
    parseSignature(signature) {
      const parsedSignature = signature.substring(2);

      var r = parsedSignature.substring(0, 64);
      var s = parsedSignature.substring(64, 128);
      var v = parsedSignature.substring(128, 130);

      return {
        r: "0x" + r,
        s: "0x" + s,
        v: parseInt(v, 16),
      };
    },
    async getGasPrice() {
      try {
        const gasPrice = await this.signer.getGasPrice();
        return gasPrice;
      } catch (e) {
        console.log("getGasPrice err:", e);
      }
    },
    async getMasterContract() {
      try {
        const masterContract =
          await this.pool.contractInstance.masterContract();
        return masterContract;
      } catch (e) {
        console.log("getMasterContract err:", e);
      }
    },
    async getVerifyingContract() {
      try {
        const verifyingContract = await this.pool.contractInstance.bentoBox();
        return verifyingContract;
      } catch (e) {
        console.log("getVerifyingContract err:", e);
      }
    },
    async isApprowed() {
      try {
        const masterContract = await this.getMasterContract();
        const addressApprowed =
          await this.pool.masterContractInstance.masterContractApproved(
            masterContract,
            this.account
          );
        return addressApprowed;
      } catch (e) {
        console.log("isApprowed err:", e);
      }
    },
    async isTokenApprowed(tokenContract, spenderAddress) {
      try {
        const addressApprowed = await tokenContract.allowance(
          this.account,
          spenderAddress,
          {
            gasLimit: 1000000,
          }
        );

        console.log(
          "TOKEN APPROVE:",
          addressApprowed,
          parseFloat(addressApprowed.toString()) > 0
        );
        return parseFloat(addressApprowed.toString()) > 0;
      } catch (e) {
        console.log("isApprowed err:", e);
        return false;
      }
    },
    async approveToken(tokenContract, spenderAddress) {
      try {
        const estimateGas = await tokenContract.estimateGas.approve(
          spenderAddress,
          "0xffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff"
        );

        const gasLimit = this.gasLimitConst + +estimateGas.toString();

        console.log("gasLimit:", gasLimit);

        const tx = await tokenContract.approve(
          spenderAddress,
          "0xffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff",
          {
            gasLimit,
          }
        );
        const receipt = await tx.wait();

        console.log("APPROVE RESP:", receipt);

        return true;
      } catch (e) {
        console.log("isApprowed err:", e);
        return false;
      }
    },
    async approveMasterContract() {
      try {
        const masterContract = await this.getMasterContract();

        console.log(
          "approveMasterContract",
          this.account,
          masterContract,
          true,
          this.$ethers.utils.formatBytes32String(""),
          this.$ethers.utils.formatBytes32String(""),
          this.$ethers.utils.formatBytes32String("")
        );

        const tx =
          await this.pool.masterContractInstance.setMasterContractApproval(
            this.account,
            masterContract,
            true,
            this.$ethers.utils.formatBytes32String(""),
            this.$ethers.utils.formatBytes32String(""),
            this.$ethers.utils.formatBytes32String("")
          );

        const receipt = await tx.wait();
        return receipt;
      } catch (e) {
        console.log("approveMasterContract err:", e);
        return false;
      }
    },
    async getNonce() {
      try {
        const nonces = await this.pool.masterContractInstance.nonces(
          this.account
        );

        console.log("NONCEx:", nonces.toString());

        return nonces.toString();
      } catch (e) {
        console.log("getNonce err:", e);
      }
    },
  },
  async created() {
    const isConnected = this.$store.getters.getWalletIsConnected;

    if (!isConnected) {
      this.$router.push({ name: "Home" });
      alert("Connect wallet first");
      return false;
    }

    const poolId = 2;
    console.log("THIS IS - POOL ID: ", poolId);
    const poolItem = this.$store.getters.getPoolById(poolId);

    if (!poolItem) {
      this.$router.push({ name: "Stand" });
      console.log("POOL IS UNDEFINED");
      return false;
    }

    console.log("POOL:", poolId);

    if (
      this.$route.query.actionType &&
      (this.$route.query.actionType === "borrow" ||
        this.$route.query.actionType === "repay")
    )
      this.setActionType(this.$route.query.actionType);
  },
  components: {
    DepositeWithdrawComponent,
    BackButton,
  },
};
</script>

<style lang="scss" scoped>
.pool-view {
  padding-top: 60px;
  padding-bottom: 155px;
  flex: 1;

  h1 {
    margin: 60px 0;
  }

  .pool-head-bar {
    margin-bottom: 30px;
    display: grid;
    grid-template-columns: 62.5% 37.5%;
    column-gap: 20px;
  }

  .btns-group {
    display: flex;
    align-items: center;

    .btn {
      width: 127px;
      font-size: 16px;
      line-height: 1;
      background: rgba(123, 121, 247, 0.3);

      &:hover {
        background-color: $clrBlue5;
      }

      &.borrow-btn {
        margin-right: 20px;
      }

      &.active {
        background-color: $clrBlue;
      }
    }
  }

  .pool-content {
    display: grid;
    grid-template-columns: 62.5% 37.5%;
    column-gap: 20px;
    row-gap: 20px;
  }
}

@media screen and(max-width: 1024px) {
  .pool-view .pool-head-bar {
    grid-template-columns: 1fr 1fr;
    column-gap: 20px;
  }

  .pool-view .pool-content {
    grid-template-columns: 100%;
  }

  .pool-view .btns-group .btn.borrow-btn {
    margin: 0 10px;
  }

  .pool-view .btns-group .btn {
    margin: 0 10px;
  }
}

@media screen and(max-width: 780px) {
  .pool-view {
    padding-top: 50px;
  }
}

@media screen and(max-width: 640px) {
  .pool-view .btns-group {
    justify-content: center;
    margin-bottom: 30px;
  }

  .pool-view .pool-head-bar {
    display: block;
  }
}
</style>
