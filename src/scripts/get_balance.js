try {
  var balanceWei = web3.eth.getBalance($$$account$$$);
  var balanceEth = web3.fromWei(balanceWei, 'ether');
  balanceEth = balanceEth.replace('e+', 'e'); // dumb ethereum fix for BigNumber
  balance = {
    weis: balanceWei,
    ethers: balanceEth
  }
  console.log(JSON.stringify(balance));
}
catch(e) {
  console.log("EXCEPTION:");
  console.log(e);
};
