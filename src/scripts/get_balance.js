try {
  var balanceWei = web3.eth.getBalance($$$account$$$).toString().replace('e+', 'e');
  var balanceEth = web3.fromWei(balanceWei, 'ether').toString().replace('e+', 'e');
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
