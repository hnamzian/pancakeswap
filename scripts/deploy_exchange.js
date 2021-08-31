async function main() {
    const [deployer] = await ethers.getSigners();

    const WBNB = await ethers.getContractFactory("WBNB");
    const wbnb = await WBNB.deploy();

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
  
    console.log("WBNB deployed to:", wbnb.address);
    console.log("PancakeFactory deployed to:", pancakeFactory.address);
    console.log("PancakeRouter01 deployed to:", pancakeRouter01.address);
    console.log("PancakeRouter deployed to:", pancakeRouter.address);
  }
  
  main()
    .then(() => process.exit(0))
    .catch((error) => {
      console.error(error);
      process.exit(1);
    });
  