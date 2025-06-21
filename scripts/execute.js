const hre = require("hardhat");

const EP_address = "0x0165878A594ca255338adfa4d48449f69242Eb8F"
const AF_address = "0xa513E6E4b8f2a923D98304ec87F64353C4D5C853"
const Factory_nonce = 1;

async function main() {
    const AccFactory = await hre.ethers.getContractFactory("AccFactory");
    
    const EntryPoint = await hre.ethers.getContractAt("EntryPoint",EP_address);

    // const sender = await hre.ethers.getCreateAddress({ from: AF_address, nonce: Factory_nonce });

    const [signer] = await hre.ethers.getSigners()
    const addr1 = await signer.getAddress()
    console.log("address", addr1)

    const Account = await hre.ethers.getContractFactory("Account")

    const initcode = AF_address + AccFactory.interface
                    .encodeFunctionData("createAccount", [addr1])
                    .slice(2) 

    let sender
  try {
    await EntryPoint.getSenderAddress(initcode);
  } catch (ex) {
    console.log(ex.data);
    sender = "0x" + ex.data.data.slice(-40) // test ex.data only
  }

console.log("sender ", sender)

    userOp = {
        sender,
        nonce: await EntryPoint.getNonce(sender,0),
        calldata: Account.interface.encodeFunctionData("counter"),
        initcode,
        callGasLimit:400_000,
        verificationGasLimit: 400_000,
        preVerificationGas: 100_000,
        maxFeePerGas: hre.ethers.parseEther("30","gwei"),
        maxPriorityFeePerGas: hre.ethers.parseEther("30","gwei"),
        paymasterAndData: "0x",
        signature: "0x",
        

    }
    console.log(userOp)

    const userOpHash = await EntryPoint.getUserOpHash(userOp)
    console.log(userOp)

    userOp.signature = signer.signMessage(hre.ethers.getBytes(userOpHash))
    const txhash = await EntryPoint.handleOps([userOp], addr1);
    console.log("tx ",txhash)

}
main().catch((error) => {
    console.error(error);
    process.exitCode = 1;
  });