try {
  web3.personal.unlockAccount($$$sender$$$, $$$password$$$);
  var transactionHash = web3.eth.sendTransaction({from:$$$sender$$$, to:$$$receiver$$$, value:web3.toWei($$$ethers$$$, 'ether'), gasLimit:210000, gasPrice:20000000000})
  console.log(transactionHash);
  web3.personal.lockAccount($$$sender$$$);
}
catch(e) {
  console.log("EXCEPTION:");
  console.log(e);
};
