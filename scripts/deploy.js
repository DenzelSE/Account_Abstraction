const hre = require("hardhat");

async function main() {
    
    const EP = await hre.ethers.deployContract("EntryPoint");
    await EP.waitForDeployment();
    console.log(`EP deployed to ${EP.target}`)

    const Factory = await hre.ethers.deployContract("AccFactory");
    await Factory.waitForDeployment();
    console.log(`Fact deployed to ${Factory.target}`)
}
main().catch((error) => {
    console.error(error);
    process.exitCode = 1;
  });