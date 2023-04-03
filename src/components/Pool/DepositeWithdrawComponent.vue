<template>
  <div class="deposit-borrow-block">
    <h3 v-if="actionType === 'borrow'">Deposit ETC</h3>
    <h3 v-if="actionType === 'repay'">Withdraw ETC</h3>

    <div class="input-wrap">
      <ValueInput
        :max="maxMainValue"
        @onchange="updateMainValue"
        :parentValue="mainValue"
        :error="mainValueError"
        :valueName="mainValueTokenName"
      />
    </div>

    <div class="action-wrap">
      <button
        class="btn action-btn"
        @click="actionHandler"
        :disabled="actionBtnText === 'Nothing to do'"
      >
        {{ actionBtnText }}
      </button>
    </div>
  </div>
</template>

<script>
const ValueInput = () => import("@/components/UiComponents/ValueInput");

export default {
  props: {
    balance: {
      required: true,
    },
    pairBalance: {
      require: true,
    },
    tokenName: {
      type: String,
      required: true,
    },
    tokenToUsd: {
      type: Number,
      default: 1,
    },
    tokenPairToUsd: {
      type: Number,
      default: 1,
    },
    tokenPairName: {
      type: String,
      required: true,
    },
    userTotalCollateral: {
      required: true,
    },
    userTotalBorrowed: {
      required: true,
    },
    actionType: {
      type: String,
      required: true,
    },
    tokenDecimals: {
      type: Number,
      required: true,
    },
    tokenPairDecimals: {
      type: Number,
      required: true,
    },
    ltv: {
      type: Number,
      required: true,
    },
    isUpdatePrice: {
      type: Boolean,
    },
  },
  data() {
    return {
      userBalance: null,

      mainValue: "",
      mainValueError: "",

      pairValue: "",
      pairValueError: "",

      percentValue: "",

      // updatePrice: this.isUpdatePrice,
      updatePrice: false,

      multiplier: 1,
      slipage: 1,
      showLeverage: false,
    };
  },
  watch: {
    actionType() {
      this.clearData();
    },
  },
  computed: {
    maxMainValue() {
      if (this.actionType === "repay") return this.userBalance;
      if (this.actionType === "borrow") {
        if (
          parseFloat(this.userTotalBorrowed) >
          parseFloat(this.parsedPairBalance)
        )
          return this.parsedPairBalance;

        return this.userTotalBorrowed;
      }

      return 0;
    },
    mainValueTokenName() {
      if (this.actionType === "borrow") return "ETC";
      if (this.actionType === "repay") return "WETC";

      return "XX";
    },
    pairValueDecimals() {
      if (this.actionType === "borrow") return this.tokenPairDecimals;
      if (this.actionType === "repay") return this.tokenDecimals;

      return 18;
    },
    mainValueDecimals() {
      if (this.actionType === "borrow") return this.tokenDecimals;
      if (this.actionType === "repay") return this.tokenPairDecimals;

      return 18;
    },
    parsedPairBalance() {
      return this.$ethers.utils.formatUnits(
        this.pairBalance.toString(),
        this.tokenPairDecimals
      );
    },
    maxPairValue() {
      if (this.actionType === "borrow") {
        let valueInDolars;
        let maxPairValue;

        if (this.mainValue) {
          valueInDolars = this.mainValue / this.tokenToUsd;
          maxPairValue = (valueInDolars / 100) * (this.ltv - 1);
        } else {
          valueInDolars = this.userTotalCollateral / this.tokenToUsd;
          maxPairValue =
            (valueInDolars / 100) * (this.ltv - 1) - this.userTotalBorrowed;
        }

        return maxPairValue;
      }

      if (this.actionType === "repay") {
        const maxAmount = parseFloat(+this.userTotalCollateral).toFixed(20);

        let re = new RegExp(
          // eslint-disable-next-line no-useless-escape
          `^-?\\d+(?:\.\\d{0,` + (this.pairValueDecimals || -1) + `})?`
        );
        return maxAmount.toString().match(re)[0];
      }

      return 0;
    },
    signer() {
      return this.$store.getters.getSigner;
    },
    actionBtnText() {
      if (this.mainValueError) return "Nothing to do";

      if (this.actionType === "borrow") {
        if (this.mainValue) return "ETC to WETC";
      }

      if (this.actionType === "repay") {
        if (this.mainValue) return "WETC to ETC";
      }

      return "Nothing to do";
    },
  },
  methods: {
    toFixed(num, fixed) {
      // eslint-disable-next-line no-useless-escape
      let re = new RegExp(`^-?\\d+(?:\.\\d{0,` + (fixed || -1) + `})?`);
      return num.toString().match(re)[0];
    },
    actionHandler() {
      if (this.mainValue) {
        if (this.actionType === "borrow") {
          const parsedAmount = this.$ethers.utils.parseUnits(
            this.mainValue.toString(),
            this.mainValueDecimals
          );

          const payload = {
            amount: parsedAmount,
            updatePrice: this.updatePrice,
          };
          this.$emit("depositeEtc", payload);
        }
        if (this.actionType === "repay") {
          const parsedAmount = this.$ethers.utils.parseUnits(
            this.toFixed(this.mainValue, 6),
            this.mainValueDecimals
          );

          const payload = {
            amount: parsedAmount,
            updatePrice: this.updatePrice,
          };
          this.$emit("withdrawEtc", payload);
        }
        return false;
      }

      if (this.pairValue) {
        if (this.actionType === "borrow") {
          const parsedPair = this.$ethers.utils.parseUnits(
            this.toFixed(this.pairValue, 6),
            this.pairValueDecimals
          );

          const payload = {
            amount: parsedPair,
            updatePrice: this.updatePrice,
          };

          if (this.multiplier > 1) {
            payload.amount = this.toFixed(this.pairValue, 6);
            this.multiplierHandle(payload, "borrowMultiple");
            return false;
          }

          this.$emit("borrow", payload);
        }
        if (this.actionType === "repay") {
          const parsedPair = this.$ethers.utils.parseUnits(
            this.pairValue.toString(),
            this.pairValueDecimals
          );

          const payload = {
            amount: parsedPair,
            updatePrice: this.updatePrice,
          };

          this.$emit("removeCollateral", payload);
        }

        return false;
      }
    },
    multiplierHandle(data, type) {
      const percentValue = parseFloat(this.percentValue);

      if (!percentValue) return false;

      console.log("percentValue", percentValue);
      console.log("DATA", data);

      const slipageMutiplier = (100 - this.slipage) / 100;

      console.log("slipageMutiplier", slipageMutiplier);

      const amountMultiplyer = percentValue / 100;

      let startAmount = data.amount * 0.995;
      let finalAmount = 0;

      for (let i = this.multiplier; i > 0; i--) {
        finalAmount += +startAmount;
        startAmount = startAmount * amountMultiplyer;
      }

      const mimAmount = this.$ethers.utils.parseUnits(
        this.toFixed(finalAmount, this.pairValueDecimals),
        this.pairValueDecimals
      );

      const minValue = finalAmount * this.tokenToUsd * slipageMutiplier;

      const minValueParsed = this.$ethers.utils.parseUnits(
        this.toFixed(minValue, this.mainValueDecimals),
        this.mainValueDecimals
      );

      console.log("finalAmount", finalAmount);
      console.log("minValue", minValue);

      const payload = {
        ...data,
        amount: mimAmount,
        minExpected: minValueParsed,
      };

      console.log("AMOUNT AFTER", type, mimAmount.toString());

      this.$emit(type, payload);
    },
    clearData() {
      this.mainValue = "";
      this.mainValueError = "";
      this.pairValue = "";
      this.pairValueError = "";
      this.percentValue = "";
    },
    updateMainValue(value) {
      console.log("updateMain", value);
      this.mainValue = value;

      if (this.actionType === "borrow") {
        if (parseFloat(value) > 10000) {
          this.mainValueError = `The value ETC cannot be greater than 10000, take care of your assets`;
          return false;
        }
      }
      if (this.actionType === "repay") {
        if (parseFloat(value) > parseFloat(this.maxMainValue)) {
          this.mainValueError = `The value cannot be greater than ${this.maxMainValue}`;
          return false;
        }
      }

      this.mainValueError = "";

      if (this.actionType === "repay") {
        const collateralPercent = (this.pairValue / this.maxPairValue) * 100;
        const borrowPercent = (value / this.userTotalBorrowed) * 100;

        const borrowedInDolarts = this.userTotalBorrowed / this.tokenPairToUsd;
        const collateralInDolarts = this.userTotalCollateral / this.tokenToUsd;
        const userHasDolars = collateralInDolarts - borrowedInDolarts;
        const acceptedPercent = (userHasDolars / collateralInDolarts) * 100;

        // console.log(collateralPercent, borrowPercent, acceptedPercent);
        if (
          collateralPercent <= borrowPercent &&
          collateralPercent < acceptedPercent
        ) {
          this.pairValueError = "";
          return false;
        }
        this.pairValueError = `You have insufficient collateral. Please enter a smaller amount or repay more.`;
        return false;
      }
    },

    async getUserBalance() {
      // const balance = await this.signer.getBalance();

      // const parsedBalance = this.$ethers.utils.formatUnits(balance.toString());

      const parsedBalance = this.$ethers.utils.formatUnits(
        this.balance.toString(),
        this.tokenDecimals
      );

      this.userBalance = parsedBalance;

      console.log("FORMAT BALANCE:", this.userBalance);
    },
  },
  async created() {
    await this.getUserBalance();
  },
  components: {
    ValueInput,
  },
};
</script>

<style scoped lang="scss">
.deposit-borrow-block {
  padding: 30px 20px;
  background: $clrBg2;
  border-radius: 20px;
  width: 100%;

  .config-box {
    background: rgba(255, 255, 255, 0.02);
    border-radius: 20px;
    padding: 20px;
    margin-bottom: 20px;
  }

  .checkbox-wrap {
    display: flex;
    align-items: center;

    .label-text {
      cursor: pointer;
    }

    .info-icon {
      width: 16px;
      height: 16px;
      margin-left: 5px;
    }

    .box-wrap {
      display: flex;
      align-items: center;
      justify-content: center;
      width: 24px;
      height: 24px;
      margin-right: 10px;
      border-radius: 8px;
      border: 1px solid #57507a;
      background: rgba(255, 255, 255, 0.06);
      cursor: pointer;
      transition: all 0.1s ease;

      &:hover {
        border: 1px solid $clrBlue;
      }

      &.active {
        border: 1px solid $clrBlue;

        .box {
          opacity: 1;
        }
      }

      .box {
        background: $clrBlue;
        border-radius: 4px;
        width: 12px;
        height: 12px;
        opacity: 0;
        transition: all 0.1s ease;
      }
    }
  }

  .action-wrap {
    display: flex;
    align-items: center;
    justify-content: space-between;
  }

  h3 {
    margin-bottom: 15px;
    text-align: left;
    text-transform: uppercase;
  }

  .input-wrap {
    margin: 20px 0;
  }

  .action-btn {
    margin-left: auto;
    width: auto;
    padding-left: 15px;
    padding-right: 15px;
  }
}

@media screen and(max-width: 780px) {
  .deposit-borrow-block {
    padding-left: 10px;
    padding-right: 10px;
  }

  .deposit-borrow-block .config-box {
    padding: 10px;
  }
}
</style>
