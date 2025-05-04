import { ethers } from "./ethers-5.6.esm.min.js";
import { abi, contractAddress } from "./constants.js";

const connectButton = document.getElementById("connectButton");
const fundButton = document.getElementById("fundButton");
const balanceButton = document.getElementById("balanceButton");
const withdrawButton = document.getElementById("withdrawButton");

connectButton.onclick = connect;
fundButton.onclick = fund;
balanceButton.onclick = getBalance
withdrawButton.onclick = withdraw

async function connect() {
  if (typeof window.ethereum !== "undefined") {
    await window.ethereum.request({ method: "eth_requestAccounts" });
    connectButton.innerHTML = "Connected!";
  } else {
    fundButton.innerHTML = "Please install Metamask!";
  }
}

async function getBalance(){
  if(typeof window.ethereum != "undefined"){
    const provider = new ethers.BrowserProvider(window.ethereum)
    const balance = await provider.getBalance(contractAddress)
    console.log(ethers.formatEther(balance))
  }
}

async function fund() {
  console.log(`Funding with ${ethAmount}`);
  if (typeof window.ethereum !== "undefined") {
    const ethAmount = document.getElementById("ethAmount").value;

    // using BrowseProvider according to ethereum v6
    const provider = new ethers.BrowserProvider(window.ethereum);
    // using await according to ethereum v6
    const signer = await provider.getSigner();
    const contract = new ethers.Contract(contractAddress, abi, signer);
    const transactionResponse = await contract.fund({
      value: ethers.parseEther(ethAmount),
    });
    // hey, wait for transaction to complete
    await listenForTransactionMine(transactionResponse, provider);
  }
}

function listenForTransactionMine(transactionResponse, provider) {
  console.log(`Mining ${transactionResponse.hash}...`);
  // return new Promise()
  // we have to create a listener
  return new Promise((resolve, reject) => {
    provider.once(transactionResponse.hash, (transactionReceipt) => {
      // GETTING FULL ASYNC FUNCTION IN THE OUTPUT INSTEAD OF '1'
      console.log(
        `Completed with ${transactionReceipt.confirmations} confirmations`
      );
      resolve();
    });
  });
}

async function withdraw(){
  if(typeof window.ethereum != "undefined"){
    console.log("Withdrawing...")
    const provider = new ethers.BrowserProvider(window.ethereum)
    const signer = await provider.getSigner()
    const contract = new ethers.Contract(contractAddress,abi,signer)
    try{
      const transactionResponse = await contract.withdraw()
      await listenForTransactionMine(transactionResponse,provider)
    }catch(error){
      console.log(error)
    }
  }
}
