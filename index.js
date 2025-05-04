import { ethers } from "./ethers-5.6.esm.min.js"
import {abi,contractAddress } from "./constants.js"

const connectButton = document.getElementById("connectButton")
const fundButton = document.getElementById("fundButton")

connectButton.onclick = connect
fundButton.onclick = fund

async function connect() {
  if (typeof window.ethereum !== "undefined") {
    await window.ethereum.request({ method: "eth_requestAccounts" });
    connectButton.innerHTML = "Connected!";
  } else {
    fundButton.innerHTML =
      "Please install Metamask!";
  }
}

async function fund() {
  const ethAmount = "77"

  console.log(`Funding with ${ethAmount}`);
  if (typeof window.ethereum !== "undefined"){
    // provider
    // signer

    // contract that we are interacting with
    // ABI and Address
    const provider = new ethers.BrowserProvider(window.ethereum)  
    const signer = await provider.getSigner()
    const contract = new ethers.Contract(contractAddress,abi,signer)
    const transactionResponse = await contract.fund({
      value: ethers.parseEther(ethAmount),
    })
  }
}
