
/////////////////////////////// atob
 var _PADCHAR = "=",
  _ALPHA = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/";

var _getbyte64 = function( s, i ) {
  var idx = _ALPHA.indexOf( s.charAt( i ) );

  if ( idx === -1 ) {
    throw "Cannot decode base64";
  }

  return idx;
}

var atob = function( s ) {
  var pads = 0,
    i,
    b10,
    imax = s.length,
    x = [];

  s = String( s );

  if ( imax === 0 ) {
    return s;
  }

  if ( imax % 4 !== 0 ) {
    throw "Cannot decode base64";
  }

  if ( s.charAt( imax - 1 ) === _PADCHAR ) {
    pads = 1;

    if ( s.charAt( imax - 2 ) === _PADCHAR ) {
      pads = 2;
    }

    // either way, we want to ignore this last block
    imax -= 4;
  }

  for ( i = 0; i < imax; i += 4 ) {
    b10 = ( _getbyte64( s, i ) << 18 ) | ( _getbyte64( s, i + 1 ) << 12 ) | ( _getbyte64( s, i + 2 ) << 6 ) | _getbyte64( s, i + 3 );
    x.push( String.fromCharCode( b10 >> 16, ( b10 >> 8 ) & 0xff, b10 & 0xff ) );
  }

  switch ( pads ) {
    case 1:
      b10 = ( _getbyte64( s, i ) << 18 ) | ( _getbyte64( s, i + 1 ) << 12 ) | ( _getbyte64( s, i + 2 ) << 6 );
      x.push( String.fromCharCode( b10 >> 16, ( b10 >> 8 ) & 0xff ) );
      break;

    case 2:
      b10 = ( _getbyte64( s, i ) << 18) | ( _getbyte64( s, i + 1 ) << 12 );
      x.push( String.fromCharCode( b10 >> 16 ) );
      break;
  }

  return x.join( "" );
}

var _getbyte = function ( s, i ) {
  var x = s.charCodeAt( i );

  if ( x > 255 ) {
    throw "INVALID_CHARACTER_ERR: DOM Exception 5";
  }

  return x;
}

var btoa = function ( s ) {
  if ( arguments.length !== 1 ) {
    throw "SyntaxError: exactly one argument required";
  }

  s = String( s );

  var i,
    b10,
    x = [],
    imax = s.length - s.length % 3;

  if ( s.length === 0 ) {
    return s;
  }

  for ( i = 0; i < imax; i += 3 ) {
    b10 = ( _getbyte( s, i ) << 16 ) | ( _getbyte( s, i + 1 ) << 8 ) | _getbyte( s, i + 2 );
    x.push( _ALPHA.charAt( b10 >> 18 ) );
    x.push( _ALPHA.charAt( ( b10 >> 12 ) & 0x3F ) );
    x.push( _ALPHA.charAt( ( b10 >> 6 ) & 0x3f ) );
    x.push( _ALPHA.charAt( b10 & 0x3f ) );
  }

  switch ( s.length - imax ) {
    case 1:
      b10 = _getbyte( s, i ) << 16;
      x.push( _ALPHA.charAt( b10 >> 18 ) + _ALPHA.charAt( ( b10 >> 12 ) & 0x3F ) + _PADCHAR + _PADCHAR );
      break;

    case 2:
      b10 = ( _getbyte( s, i ) << 16 ) | ( _getbyte( s, i + 1 ) << 8 );
      x.push( _ALPHA.charAt( b10 >> 18 ) + _ALPHA.charAt( ( b10 >> 12 ) & 0x3F ) + _ALPHA.charAt( ( b10 >> 6 ) & 0x3f ) + _PADCHAR );
      break;
  }

  return x.join( "" );
}
///////////////////////////// atob

try {
  var abiB64 = 'W3siY29uc3RhbnQiOmZhbHNlLCJpbnB1dHMiOlt7Im5hbWUiOiJfaWQiLCJ0eXBlIjoidWludDI1NiJ9LHsibmFtZSI6Il92YWxpZGF0ZV9oYXNoIiwidHlwZSI6ImFkZHJlc3MifSx7Im5hbWUiOiJfYmlydGhkYXkiLCJ0eXBlIjoidWludDI1NiJ9LHsibmFtZSI6Il9nZW5kZXIiLCJ0eXBlIjoidWludDgifSx7Im5hbWUiOiJfZHRfc2lnbiIsInR5cGUiOiJ1aW50MjU2In0seyJuYW1lIjoiX2Z1bGxuYW1lIiwidHlwZSI6InN0cmluZyJ9XSwibmFtZSI6IlNpZ24iLCJvdXRwdXRzIjpbXSwicGF5YWJsZSI6dHJ1ZSwidHlwZSI6ImZ1bmN0aW9uIn0seyJjb25zdGFudCI6dHJ1ZSwiaW5wdXRzIjpbXSwibmFtZSI6ImdldENlcnRpZmljYXRlIiwib3V0cHV0cyI6W3sibmFtZSI6Il90eXBlX2lkIiwidHlwZSI6InVpbnQ4In0seyJuYW1lIjoiX2R0X2NyZWF0ZSIsInR5cGUiOiJ1aW50MjU2In0seyJuYW1lIjoiX3N1YmplY3RzX2NvdW50IiwidHlwZSI6InVpbnQyNTYifV0sInBheWFibGUiOmZhbHNlLCJ0eXBlIjoiZnVuY3Rpb24ifSx7ImNvbnN0YW50Ijp0cnVlLCJpbnB1dHMiOlt7Im5hbWUiOiJpbmRleCIsInR5cGUiOiJ1aW50MjU2In1dLCJuYW1lIjoiZ2V0U3ViamVjdCIsIm91dHB1dHMiOlt7Im5hbWUiOiJfaWQiLCJ0eXBlIjoidWludDI1NiJ9LHsibmFtZSI6Il92YWxpZGF0ZV9oYXNoIiwidHlwZSI6ImFkZHJlc3MifSx7Im5hbWUiOiJfYmlydGhkYXkiLCJ0eXBlIjoidWludDI1NiJ9LHsibmFtZSI6Il9mdWxsbmFtZSIsInR5cGUiOiJzdHJpbmcifSx7Im5hbWUiOiJfZ2VuZGVyIiwidHlwZSI6InVpbnQ4In0seyJuYW1lIjoiX2R0X3NpZ24iLCJ0eXBlIjoidWludDI1NiJ9LHsibmFtZSI6Il9kdF9jYW5jZWwiLCJ0eXBlIjoidWludDI1NiJ9XSwicGF5YWJsZSI6ZmFsc2UsInR5cGUiOiJmdW5jdGlvbiJ9LHsiaW5wdXRzIjpbeyJuYW1lIjoiX3R5cGVfaWQiLCJ0eXBlIjoidWludDgifSx7Im5hbWUiOiJfZHRfY3JlYXRlIiwidHlwZSI6InVpbnQyNTYifSx7Im5hbWUiOiJfc3ViamVjdHNfYWRkciIsInR5cGUiOiJhZGRyZXNzW10ifV0sInBheWFibGUiOmZhbHNlLCJ0eXBlIjoiY29uc3RydWN0b3IifV0=';
  var abi = atob(abiB64);
  var bin = '0x6060604052341561000f57600080fd5b6040516108c63803806108c683398101604052808051919060200180519190602001805190910190505b6000805460ff191660ff851617905560018290556002818051610060929160200190610085565b5060048054600160a060020a03191633600160a060020a03161790555b505050610118565b8280548282559060005260206000209081019282156100dc579160200282015b828111156100dc5782518254600160a060020a031916600160a060020a0391909116178255602092909201916001909101906100a5565b5b506100e99291506100ed565b5090565b61011591905b808211156100e9578054600160a060020a03191681556001016100f3565b5090565b90565b61079f806101276000396000f300606060405263ffffffff7c010000000000000000000000000000000000000000000000000000000060003504166313d073d08114610053578063ae15eb8e146100bd578063f6dd0187146100fa575b600080fd5b6100bb600480359060248035600160a060020a0316916044359160643560ff16916084359160c49060a43590810190830135806020601f820181900481020160405190810160405281815292919060208401838380828437509496506101c195505050505050565b005b34156100c857600080fd5b6100d0610397565b604051808460ff1660ff168152602001838152602001828152602001935050505060405180910390f35b341561010557600080fd5b6101106004356103ac565b604051878152600160a060020a03871660208201526040810186905260ff8416608082015260a0810183905260c0810182905260e06060820181815290820186818151815260200191508051906020019080838360005b838110156101805780820151818401525b602001610167565b50505050905090810190601f1680156101ad5780820380516001836020036101000a031916815260200191505b509850505050505050505060405180910390f35b6000805b6002548110156102285760028054829081106101dd57fe5b906000526020600020900160005b9054906101000a9004600160a060020a0316600160a060020a031633600160a060020a0316141561021f5760019150610228565b5b6001016101c5565b600160a060020a03331660009081526003602052604090206005015415158061024f575081155b1561025957600080fd5b60e06040519081016040528089815260200188600160a060020a031681526020018781526020018481526020018660ff16815260200185815260200160008152506003600033600160a060020a0316600160a060020a0316815260200190815260200160002060008201518155602082015160018201805473ffffffffffffffffffffffffffffffffffffffff1916600160a060020a03929092169190911790556040820151816002015560608201518160030190805161031e9291602001906106c1565b50608082015160048201805460ff191660ff9290921691909117905560a0820151816005015560c082015160069091015550341561038a57600454600160a060020a03163480156108fc0290604051600060405180830381858888f19350505050151561038a57600080fd5b5b5b5b5050505050505050565b60005460015460025460ff909216915b909192565b60008060006103b9610740565b60008060006003600060028a8154811015156103d157fe5b906000526020600020900160005b9054906101000a9004600160a060020a0316600160a060020a0316600160a060020a031681526020019081526020016000206000015496506003600060028a81548110151561042a57fe5b906000526020600020900160005b9054600160a060020a036101009290920a900481168252602082019290925260400160009081206001015460028054919093169850600392908b90811061047b57fe5b906000526020600020900160005b9054906101000a9004600160a060020a0316600160a060020a0316600160a060020a031681526020019081526020016000206002015494506003600060028a8154811015156104d457fe5b906000526020600020900160005b9054906101000a9004600160a060020a0316600160a060020a0316600160a060020a031681526020019081526020016000206003018054600181600116156101000203166002900480601f0160208091040260200160405190810160405280929190818152602001828054600181600116156101000203166002900480156105ab5780601f10610580576101008083540402835291602001916105ab565b820191906000526020600020905b81548152906001019060200180831161058e57829003601f168201915b505050505093506003600060028a8154811015156105c557fe5b906000526020600020900160005b9054600160a060020a036101009290920a900416815260208101919091526040016000908120600401546002805460ff9092169550600392918b90811061061657fe5b906000526020600020900160005b9054906101000a9004600160a060020a0316600160a060020a0316600160a060020a031681526020019081526020016000206005015491506003600060028a81548110151561066f57fe5b906000526020600020900160005b9054906101000a9004600160a060020a0316600160a060020a0316600160a060020a031681526020019081526020016000206006015490505b919395979092949650565b828054600181600116156101000203166002900490600052602060002090601f016020900481019282601f1061070257805160ff191683800117855561072f565b8280016001018555821561072f579182015b8281111561072f578251825591602001919060010190610714565b5b5061073c929150610752565b5090565b60206040519081016040526000815290565b61077091905b8082111561073c5760008155600101610758565b5090565b905600a165627a7a72305820026aec33e3f66c5ae2a3adacf6103c7e6f3b0552ddc9590ed2110c4098d40ee30029';
  var certificateProxy = web3.eth.contract(JSON.parse(abi));

  var account = $$$account$$$;
  var password = $$$password$$$;
  web3.personal.unlockAccount(account, password);

  var subjAddresses = $$$subject_addrs$$$.split('$');
  var maxGasPrice = new BigNumber(web3.toWei(20, "gwei"));
  var contract = certificateProxy.new($$$type$$$, new Date().getTime().toString(), subjAddresses, {from: account, gas: 2000000, gasPrice:maxGasPrice.toString(), data: bin});

  web3.personal.lockAccount(account);
  console.log(contract.transactionHash); //*/
}
catch(e) {
  console.log("EXCEPTION:");
  console.log(e);
};
