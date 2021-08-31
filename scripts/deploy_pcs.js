async function main() {
  const [deployer] = await ethers.getSigners();

  // deploy tokens
  const WBNB = await ethers.getContractFactory("WBNB");
  const wbnb = await WBNB.deploy();
  await wbnb.deposit({
    value: ethers.utils.parseEther("1000")
  });

  const BEP20ADA = await ethers.getContractFactory("BEP20ADA");
  const ada = await BEP20ADA.deploy();
  await ada.mint(ethers.utils.parseEther("10000000"));

  const BEP20BTCB = await ethers.getContractFactory("BEP20BTCB");
  const btcb = await BEP20BTCB.deploy();
  await btcb.mint(ethers.utils.parseEther("10000000"));

  const BEP20BUSD = await ethers.getContractFactory("BEP20BUSD");
  const busd = await BEP20BUSD.deploy();
  await busd.mint(ethers.utils.parseEther("10000000"));

  const BEP20DAI = await ethers.getContractFactory("BEP20DAI");
  const dai = await BEP20DAI.deploy();
  await dai.mint(ethers.utils.parseEther("10000000"));

  const BEP20DOT = await ethers.getContractFactory("BEP20DOT");
  const dot = await BEP20DOT.deploy();
  await dot.mint(ethers.utils.parseEther("10000000"));

  const BEP20ETH = await ethers.getContractFactory("BEP20ETH");
  const eth = await BEP20ETH.deploy();
  await eth.mint(ethers.utils.parseEther("10000000"));

  const BEP20MATIC = await ethers.getContractFactory("BEP20MATIC");
  const matic = await BEP20MATIC.deploy();
  await matic.mint(ethers.utils.parseEther("10000000"));

  const BEP20USDC = await ethers.getContractFactory("BEP20USDC");
  const usdc = await BEP20USDC.deploy();
  await usdc.mint(ethers.utils.parseEther("10000000"));

  const BEP20USDT = await ethers.getContractFactory("BEP20USDT");
  const usdt = await BEP20USDT.deploy();
  await usdt.mint(ethers.utils.parseEther("10000000"));

  // deploy PacnakeSwap
  const PancakeFactory = await ethers.getContractFactory("PancakeFactory");
  const pancakeFactory = await PancakeFactory.deploy(deployer.address);

  console.log(
    "copy INIT_CODE_PAIR_HASH to PanckaeRouter(01).PancakeLibrary: ", await pancakeFactory.INIT_CODE_PAIR_HASH()
  );

  const PancakeRouter01 = await ethers.getContractFactory("PancakeRouter01");
  const pancakeRouter01 = await PancakeRouter01.deploy(
    pancakeFactory.address, wbnb.address
  );

  const PancakeRouter = await ethers.getContractFactory("PancakeRouter");
  const pancakeRouter = await PancakeRouter.deploy(
    pancakeFactory.address, wbnb.address
  );


  // create LPs
  const wbnb_usdt_pair_tnx = await pancakeFactory.createPair(wbnb.address, usdt.address);
  await wbnb_usdt_pair_tnx.wait();
  const wbnb_usdt_pair = await pancakeFactory.getPair(wbnb.address, usdt.address);

  const wbnb_ada_pair_tnx = await pancakeFactory.createPair(wbnb.address, ada.address);
  await wbnb_ada_pair_tnx.wait();
  const wbnb_ada_pair = await pancakeFactory.getPair(wbnb.address, ada.address);

  const wbnb_btcb_pair_tnx = await pancakeFactory.createPair(wbnb.address, btcb.address);
  await wbnb_btcb_pair_tnx.wait();
  const wbnb_btcb_pair = await pancakeFactory.getPair(wbnb.address, btcb.address);

  const wbnb_busd_pair_tnx = await pancakeFactory.createPair(wbnb.address, busd.address);
  await wbnb_busd_pair_tnx.wait();
  const wbnb_busd_pair = await pancakeFactory.getPair(wbnb.address, busd.address);

  const wbnb_dai_pair_tnx = await pancakeFactory.createPair(wbnb.address, dai.address);
  await wbnb_dai_pair_tnx.wait();
  const wbnb_dai_pair = await pancakeFactory.getPair(wbnb.address, dai.address);

  const wbnb_dot_pair_tnx = await pancakeFactory.createPair(wbnb.address, dot.address);
  await wbnb_dot_pair_tnx.wait();
  const wbnb_dot_pair = await pancakeFactory.getPair(wbnb.address, dot.address);

  const wbnb_eth_pair_tnx = await pancakeFactory.createPair(wbnb.address, eth.address);
  await wbnb_eth_pair_tnx.wait();
  const wbnb_eth_pair = await pancakeFactory.getPair(wbnb.address, eth.address);

  const wbnb_matic_pair_tnx = await pancakeFactory.createPair(wbnb.address, matic.address);
  await wbnb_matic_pair_tnx.wait();
  const wbnb_matic_pair = await pancakeFactory.getPair(wbnb.address, matic.address);

  const wbnb_usdc_pair_tnx = await pancakeFactory.createPair(wbnb.address, usdc.address);
  await wbnb_usdc_pair_tnx.wait();
  const wbnb_usdc_pair = await pancakeFactory.getPair(wbnb.address, usdc.address);

  // Add Liquidity WBNB-USDT
  await wbnb.approve(pancakeRouter01.address, ethers.utils.parseEther("100"));
  await ada.approve(pancakeRouter01.address, ethers.utils.parseEther("20"));
  await pancakeRouter01.addLiquidity(
    ada.address,
    wbnb.address,
    ethers.utils.parseEther("10"),
    ethers.utils.parseEther("10"),
    ethers.utils.parseEther("1"),
    ethers.utils.parseEther("1"),
    deployer.address,
    1661521170
  );

  await wbnb.approve(pancakeRouter01.address, ethers.utils.parseEther("100"));
  await btcb.approve(pancakeRouter01.address, ethers.utils.parseEther("20"));
  await pancakeRouter01.addLiquidity(
    btcb.address,
    wbnb.address,
    ethers.utils.parseEther("10"),
    ethers.utils.parseEther("10"),
    ethers.utils.parseEther("1"),
    ethers.utils.parseEther("1"),
    deployer.address,
    1661521170
  );

  await wbnb.approve(pancakeRouter01.address, ethers.utils.parseEther("100"));
  await busd.approve(pancakeRouter01.address, ethers.utils.parseEther("20"));
  await pancakeRouter01.addLiquidity(
    busd.address,
    wbnb.address,
    ethers.utils.parseEther("10"),
    ethers.utils.parseEther("10"),
    ethers.utils.parseEther("1"),
    ethers.utils.parseEther("1"),
    deployer.address,
    1661521170
  );

  await wbnb.approve(pancakeRouter01.address, ethers.utils.parseEther("100"));
  await dai.approve(pancakeRouter01.address, ethers.utils.parseEther("20"));
  await pancakeRouter01.addLiquidity(
    dai.address,
    wbnb.address,
    ethers.utils.parseEther("10"),
    ethers.utils.parseEther("10"),
    ethers.utils.parseEther("1"),
    ethers.utils.parseEther("1"),
    deployer.address,
    1661521170
  );

  await wbnb.approve(pancakeRouter01.address, ethers.utils.parseEther("100"));
  await dot.approve(pancakeRouter01.address, ethers.utils.parseEther("20"));
  await pancakeRouter01.addLiquidity(
    dot.address,
    wbnb.address,
    ethers.utils.parseEther("10"),
    ethers.utils.parseEther("10"),
    ethers.utils.parseEther("1"),
    ethers.utils.parseEther("1"),
    deployer.address,
    1661521170
  );

  await wbnb.approve(pancakeRouter01.address, ethers.utils.parseEther("100"));
  await eth.approve(pancakeRouter01.address, ethers.utils.parseEther("20"));
  await pancakeRouter01.addLiquidity(
    eth.address,
    wbnb.address,
    ethers.utils.parseEther("10"),
    ethers.utils.parseEther("10"),
    ethers.utils.parseEther("1"),
    ethers.utils.parseEther("1"),
    deployer.address,
    1661521170
  );

  await wbnb.approve(pancakeRouter01.address, ethers.utils.parseEther("100"));
  await matic.approve(pancakeRouter01.address, ethers.utils.parseEther("20"));
  await pancakeRouter01.addLiquidity(
    matic.address,
    wbnb.address,
    ethers.utils.parseEther("10"),
    ethers.utils.parseEther("10"),
    ethers.utils.parseEther("1"),
    ethers.utils.parseEther("1"),
    deployer.address,
    1661521170
  );

  await wbnb.approve(pancakeRouter01.address, ethers.utils.parseEther("100"));
  await usdc.approve(pancakeRouter01.address, ethers.utils.parseEther("20"));
  await pancakeRouter01.addLiquidity(
    usdc.address,
    wbnb.address,
    ethers.utils.parseEther("10"),
    ethers.utils.parseEther("10"),
    ethers.utils.parseEther("1"),
    ethers.utils.parseEther("1"),
    deployer.address,
    1661521170
  );

  await wbnb.approve(pancakeRouter01.address, ethers.utils.parseEther("100"));
  await usdt.approve(pancakeRouter01.address, ethers.utils.parseEther("20"));
  await pancakeRouter01.addLiquidity(
    usdt.address,
    wbnb.address,
    ethers.utils.parseEther("10"),
    ethers.utils.parseEther("10"),
    ethers.utils.parseEther("1"),
    ethers.utils.parseEther("1"),
    deployer.address,
    1661521170
  );



  console.log("PancakeFactory deployed to:", pancakeFactory.address);
  console.log("PancakeRouter01 deployed to:", pancakeRouter01.address);
  console.log("PancakeRouter deployed to:", pancakeRouter.address);

  console.log("WBNB deployed to:", wbnb.address);
  console.log("BEP20ADA deployed to:", ada.address);
  console.log("BEP20BTCB deployed to:", btcb.address);
  console.log("BEP20BUSD deployed to:", busd.address);
  console.log("BEP20DAI deployed to:", dai.address);
  console.log("BEP20DOT deployed to:", dot.address);
  console.log("BEP20ETH deployed to:", eth.address);
  console.log("BEP20MATIC deployed to:", matic.address);
  console.log("BEP20USDC deployed to:", usdc.address);
  console.log("BEP20USDT deployed to:", usdt.address);

  console.log("WBNB_USDT_POOL: ", wbnb_usdt_pair);
  console.log("WBNB_ADA_POOL: ", wbnb_ada_pair);
  console.log("WBNB_BTCB_POOL: ", wbnb_btcb_pair);
  console.log("WBNB_BUSD_POOL: ", wbnb_busd_pair);
  console.log("WBNB_DAI_POOL: ", wbnb_dai_pair);
  console.log("WBNB_DOT_POOL: ", wbnb_dot_pair);
  console.log("WBNB_ETH_POOL: ", wbnb_eth_pair);
  console.log("WBNB_MATIC_POOL: ", wbnb_matic_pair);
  console.log("WBNB_USDC_POOL: ", wbnb_usdc_pair);

}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });


