const hre = require("hardhat");

const EP_address = "0x5FC8d32690cc91D4c39d9d3abcBD16989F875707"
const AF_address = "0x0165878A594ca255338adfa4d48449f69242Eb8F"

async function main() {
    const AccFactory = await hre.ethers.getContractFactory("AccFactory");
    
    const EntryPoint = await hre.ethers.getContractAt("EntryPoint",EP_address);

    // const sender = await hre.ethers.getCreateAddress({ from: AF_address, nonce: Account_Factory_Nonce });

    const [signer] = await hre.ethers.getSigners()
    const addr1 = await signer.getAddress()


    const Account = await hre.ethers.getContractFactory("Account")

     // determines reusability of an address(create a new one/reuse existing)
    const initcode = AF_address + AccFactory.interface
                    .encodeFunctionData("createAccount", [addr1])
                    .slice(2) 

     // was getting AA14 initCode must return sender so commented out line 13 to 15 and uncommented out  26 to 31
    // sender needs to have a balance on the entry point to be able to execute UserOps
    
    let sender
  
    try {
        await EntryPoint.getSenderAddress(initcode);
    } catch (ex) {
        console.log(ex.data);
        sender = "0x" + ex.data.data.slice(-40) // test ex.data only
    }

    await EntryPoint.depositTo(sender, {value: hre.ethers.parseEther("2")});

    console.log("deposit successful to : ", sender);
}

main().catch((error) => {
    console.error(error);
    process.exitCode = 1;
  });