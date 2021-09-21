const { solidity } = require("ethereum-waffle");
const { expect } = require("chai").use(solidity);

async function addLiquidity(
  liquidator,
  tokenA,
  tokenB,
  router,
  amountA,
  amountB,
  minAmountA,
  minAmountB
) {
  await tokenA.connect(liquidator).approve(router.address, amountA);
  await tokenB.connect(liquidator).approve(router.address, amountB);
  await router.connect(liquidator).addLiquidity(
    tokenA.address,
    tokenB.address,
    amountA,
    amountB,
    minAmountA,
    minAmountB,
    liquidator.address,
    1661521170
  );
}

const INITIAL_WBNB_LIQUIDITY = ethers.utils.parseEther("10");
const INITIAL_USDT_LIQUIDITY = ethers.utils.parseEther("10");

let pancakeRouter, wbnb, usdt;

beforeEach(async () => {
  const [owner, liquidator] = await ethers.getSigners();

  // deploy tokens
  const WBNB = await ethers.getContractFactory("WBNB");
  wbnb = await WBNB.deploy();
  await wbnb.connect(liquidator).deposit({
    value: INITIAL_WBNB_LIQUIDITY
  });


  const BEP20USDT = await ethers.getContractFactory("BEP20USDT");
  usdt = await BEP20USDT.deploy();
  await usdt.transfer(liquidator.address, INITIAL_USDT_LIQUIDITY);

  // deploy PacnakeSwap
  const PancakeFactory = await ethers.getContractFactory("PancakeFactory");
  const pancakeFactory = await PancakeFactory.deploy(owner.address);
  console.log(
    "copy INIT_CODE_PAIR_HASH to PanckaeRouter(01).PancakeLibrary: feel free to comment this console after change", await pancakeFactory.INIT_CODE_PAIR_HASH()
  );
  const PancakeRouter01 = await ethers.getContractFactory("PancakeRouter01");
  pancakeRouter = await PancakeRouter01.deploy(
    pancakeFactory.address, wbnb.address
  );

  await addLiquidity(
    liquidator,
    wbnb,
    usdt,
    pancakeRouter,
    INITIAL_WBNB_LIQUIDITY,
    INITIAL_USDT_LIQUIDITY,
    ethers.utils.parseEther("1"),
    ethers.utils.parseEther("1"));
})

describe("PancakeSwap", async () => {
  it("should swap exact wbnb tokens for usdt tokens", async () => {
    const [,liquidator] = await ethers.getSigners();

    const wbnbAmount = ethers.utils.parseEther("1");
    await wbnb.connect(liquidator).deposit({ value: wbnbAmount });

    const wbnbInitialBalance = ethers.utils.formatEther(await wbnb.balanceOf(liquidator.address));
    const usdtInitialBalance = ethers.utils.formatEther(await usdt.balanceOf(liquidator.address));

    const path = [wbnb.address, usdt.address];
    const amountIn = wbnbAmount;
    const amountsOut = await pancakeRouter.getAmountsOut(amountIn, path);
    const amountOutMax = amountsOut[1];

    await wbnb.connect(liquidator).approve(pancakeRouter.address, amountIn);

    await pancakeRouter.connect(liquidator).swapExactTokensForTokens(
      amountIn,
      amountOutMax,
      path,
      liquidator.address,
      1661521170
    )
  
    const wbnbFinalBalance = ethers.utils.formatEther(await wbnb.balanceOf(liquidator.address));
    const usdtFinalBalance = ethers.utils.formatEther(await usdt.balanceOf(liquidator.address));

    expect(wbnbInitialBalance - wbnbFinalBalance).to.equal(+ethers.utils.formatEther(amountIn));
    expect(usdtFinalBalance - usdtInitialBalance).to.equal(+ethers.utils.formatEther(amountsOut[1]));
  })
  it("should swap wbnb tokens for exact usdt tokens", async () => {
    const [,liquidator] = await ethers.getSigners();

    const path = [wbnb.address, usdt.address];
    const amountOut = ethers.utils.parseEther("1");
    const amountsIn = await pancakeRouter.getAmountsIn(amountOut, path);
    const amountInMax = amountsIn[0];
    await wbnb.connect(liquidator).deposit({ value: amountInMax });

    const wbnbInitialBalance = ethers.utils.formatEther(await wbnb.balanceOf(liquidator.address));
    const usdtInitialBalance = ethers.utils.formatEther(await usdt.balanceOf(liquidator.address));

    await wbnb.connect(liquidator).approve(pancakeRouter.address, amountInMax);

    await pancakeRouter.connect(liquidator).swapTokensForExactTokens(
      amountOut,
      amountInMax,
      path,
      liquidator.address,
      1661521170
    )
  
    const wbnbFinalBalance = ethers.utils.formatEther(await wbnb.balanceOf(liquidator.address));
    const usdtFinalBalance = ethers.utils.formatEther(await usdt.balanceOf(liquidator.address));

    expect(wbnbInitialBalance - wbnbFinalBalance).to.equal(+ethers.utils.formatEther(amountInMax));
    expect(usdtFinalBalance - usdtInitialBalance).to.equal(+ethers.utils.formatEther(amountOut));
  })
  it("should swap exact BNB tokens for usdt tokens", async () => {
    const [,liquidator] = await ethers.getSigners();

    const wbnbAmount = ethers.utils.parseEther("1");
    await wbnb.connect(liquidator).deposit({ value: wbnbAmount });

    const wbnbInitialBalance = ethers.utils.formatEther(await wbnb.balanceOf(liquidator.address));
    const usdtInitialBalance = ethers.utils.formatEther(await usdt.balanceOf(liquidator.address));

    const path = [wbnb.address, usdt.address];
    const amountIn = wbnbAmount;
    const amountsOut = await pancakeRouter.getAmountsOut(amountIn, path);
    const amountOutMax = amountsOut[1];

    await wbnb.connect(liquidator).approve(pancakeRouter.address, amountIn);

    await pancakeRouter.connect(liquidator).swapExactTokensForTokens(
      amountIn,
      amountOutMax,
      path,
      liquidator.address,
      1661521170
    )
  
    const wbnbFinalBalance = ethers.utils.formatEther(await wbnb.balanceOf(liquidator.address));
    const usdtFinalBalance = ethers.utils.formatEther(await usdt.balanceOf(liquidator.address));

    expect(wbnbInitialBalance - wbnbFinalBalance).to.equal(+ethers.utils.formatEther(amountIn));
    expect(usdtFinalBalance - usdtInitialBalance).to.equal(+ethers.utils.formatEther(amountsOut[1]));
  })
  it("should swap BNB for exact amount of tokens", async () => {
    const [,liquidator] = await ethers.getSigners();

    const path = [wbnb.address, usdt.address];
    const amountOut = ethers.utils.parseEther("1");
    const amountsIn = await pancakeRouter.getAmountsIn(amountOut, path);
    const amountInMax = amountsIn[0];
    await wbnb.connect(liquidator).deposit({ value: amountInMax });

    const bnbInitialBalance = ethers.utils.formatEther(await liquidator.getBalance());
    const usdtInitialBalance = ethers.utils.formatEther(await usdt.balanceOf(liquidator.address));

    await wbnb.connect(liquidator).approve(pancakeRouter.address, amountInMax);

    await pancakeRouter.connect(liquidator).swapETHForExactTokens(
      amountOut,
      path,
      liquidator.address,
      1661521170,
      {
        value: amountInMax
      }
    )
  
    const bnbFinalBalance = ethers.utils.formatEther(await liquidator.getBalance());
    const usdtFinalBalance = ethers.utils.formatEther(await usdt.balanceOf(liquidator.address));

    expect(bnbInitialBalance - bnbFinalBalance).to.be.closeTo(+ethers.utils.formatEther(amountInMax), 1e-3);
    expect(usdtFinalBalance - usdtInitialBalance).to.equal(+ethers.utils.formatEther(amountOut));
  })
})
