const { parseUnits, formatUnits } = require("@ethersproject/units");
const { solidity } = require("ethereum-waffle");
const { expect } = require("chai").use(solidity);

async function addLiquidity(
  liquidator,
  tokenA,
  tokenB,
  router,
  amountA,
  amountB,
) {
  await tokenA.connect(liquidator).approve(router.address, amountA);
  await tokenB.connect(liquidator).approve(router.address, amountB);
  await router
    .connect(liquidator)
    .addLiquidity(
      tokenA.address,
      tokenB.address,
      amountA,
      amountB,
      ethers.utils.parseEther("1"),
      ethers.utils.parseEther("1"),
      liquidator.address,
      1661521170
    );
}

const INITIAL_WBNB_LIQUIDITY = ethers.utils.parseEther("250");
const INITIAL_USDT_LIQUIDITY = ethers.utils.parseEther("100");
const INITIAL_DAI_LIQUIDITY = ethers.utils.parseEther("100");

let pancakeRouter, wbnb, usdt, dai;

beforeEach(async () => {
  const [owner, liquidator] = await ethers.getSigners();

  // deploy tokens
  const WBNB = await ethers.getContractFactory("WBNB");
  wbnb = await WBNB.deploy();

  const BEP20 = await ethers.getContractFactory("BEP20");
  usdt = await BEP20.deploy("USDT Token", "USDT", parseUnits("1000000"), 18);

  dai = await BEP20.deploy("DAI Token", "DAI", parseUnits("1000000"), 18);

  // deploy PacnakeSwap
  const PancakeFactory = await ethers.getContractFactory("PancakeFactory");
  const pancakeFactory = await PancakeFactory.deploy(owner.address);

  const PancakeRouter = await ethers.getContractFactory("PancakeRouter");
  pancakeRouter = await PancakeRouter.deploy(
    pancakeFactory.address,
    wbnb.address
  );

  await wbnb.connect(liquidator).deposit({ value: INITIAL_WBNB_LIQUIDITY });
  await usdt.transfer(liquidator.address, INITIAL_USDT_LIQUIDITY);
  await addLiquidity(
    liquidator,
    wbnb,
    usdt,
    pancakeRouter,
    INITIAL_WBNB_LIQUIDITY,
    INITIAL_USDT_LIQUIDITY,
  );

  await wbnb.connect(liquidator).deposit({ value: INITIAL_WBNB_LIQUIDITY });
  await dai.transfer(liquidator.address, INITIAL_DAI_LIQUIDITY);
  await addLiquidity(
    liquidator,
    wbnb,
    dai,
    pancakeRouter,
    INITIAL_WBNB_LIQUIDITY,
    INITIAL_DAI_LIQUIDITY,
  );
});

describe("PancakeSwapPathPayment", async () => {
  it("should swap DAI for USDT using WBNB-DAI and WBNB-USDT", async () => {
    const [,,user] = await ethers.getSigners();

    const usdtAmount = parseUnits("1");
    await usdt.transfer(user.address, usdtAmount);
    await usdt.connect(user).approve(pancakeRouter.address, usdtAmount);

    const wbnbInitialBalance = formatUnits(await wbnb.balanceOf(user.address));
    const usdtInitialBalance = formatUnits(await usdt.balanceOf(user.address));
    const daiInitialBalance = formatUnits(await dai.balanceOf(user.address));

    console.log("Initial Balances");
    console.log("WBNB: ", wbnbInitialBalance);
    console.log("USDT: ", usdtInitialBalance);
    console.log("DI: ", daiInitialBalance);

    const path = [usdt.address, wbnb.address, dai.address];
    const amountIn = usdtAmount;
    const amountsOut = await pancakeRouter.getAmountsOut(amountIn, path);
    const amountOutMax = amountsOut[2];

    // console.log(amountsOut.toString());

    await pancakeRouter.connect(user).swapExactTokensForTokens(
      amountIn,
      amountOutMax,
      path,
      user.address,
      1661521170
    )
  
    const wbnbFinalBalance = formatUnits(await wbnb.balanceOf(user.address));
    const usdtFinalBalance = formatUnits(await usdt.balanceOf(user.address));
    const daiFinalBalance = formatUnits(await dai.balanceOf(user.address));

    console.log("\nFinal Balances");
    console.log("WBNB: ", wbnbFinalBalance);
    console.log("USDT: ", usdtFinalBalance);
    console.log("DI: ", daiFinalBalance);

    expect(daiFinalBalance - daiInitialBalance).to.equal(+formatUnits(amountsOut[2]));
    expect(usdtInitialBalance - usdtFinalBalance).to.equal(+formatUnits(amountIn));
  })
});
