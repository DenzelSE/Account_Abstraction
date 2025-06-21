const hre = require("hardhat");

const EP_address = "0x0165878A594ca255338adfa4d48449f69242Eb8F"
const AF_address = "0xa513E6E4b8f2a923D98304ec87F64353C4D5C853"
const Account_Factory_Nonce = 1;

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

    console.log("sender ", sender)

    const code = await hre.ethers.provider.getCode(sender);
    if (code !== "0x") {
        initCode = "0x";
    }

    console.log(await hre.ethers.provider.getCode(sender)); // check if deployed
    console.log("sender balance", await EntryPoint.balanceOf(sender));

    userOp = {
        sender,
        nonce: await EntryPoint.getNonce(sender,0),
        calldata: Account.interface.encodeFunctionData("counter"),
        initcode,
        callGasLimit:400_000,
        verificationGasLimit: 400_000,
        preVerificationGas: 100_000,
        maxFeePerGas: hre.ethers.parseUnits("30","gwei"),
        maxPriorityFeePerGas: hre.ethers.parseUnits("30","gwei"),
        paymasterAndData: "0x",
        signature: "0x",
        

    }
    // console.log(userOp)

    const userOpHash = await EntryPoint.getUserOpHash(userOp);

    const signature = await signer.signMessage(hre.ethers.getBytes(userOpHash));
    userOp.signature = signature;

    const txhash = await EntryPoint.handleOps([userOp], addr1);
    console.log("tx hash: ",txhash)

    const deployedAccount = await hre.ethers.getContractAt("Account", sender);

    const count = await deployedAccount.count();
    console.log("Count in Acoount: ", count.toString());

}
main().catch((error) => {
    console.error(error);
    process.exitCode = 1;
  });