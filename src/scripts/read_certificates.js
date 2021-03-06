
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
  var certificateProxy = web3.eth.contract(JSON.parse(abi));

  var certs = [];
  var certAddresses = $$$addresses$$$.split('$');
  for(var j = 0; j < certAddresses.length; j++) {
    var address = certAddresses[j].toString();
    var contract = certificateProxy.at(address);
    var props = contract.getCertificate();
    var cert = {
      address: address,
      type: new Number(props[0]),
      date: new Number(props[1]).toString(),
      numSubjects: new Number(props[2]),
      numSigns: 0,
      numCancelations: 0,
      subjects: []
    };
    for(var i = 0; i < cert.numSubjects; i++) {
      var subject = {};
      var props = contract.getSubject(i);
      subject.password = '';

      subject.id = new Number(props[0]).toString();
      subject.validate_hash = props[1];
      subject.birthday = new Number(props[2]).toString();
      subject.fullname = props[3];
      subject.gender = new Number(props[4]);
      subject.dt_sign = new Number(props[5]).toString();
      if(subject.dt_sign != "0") {
        cert.numSigns++;
      }
      subject.dt_cancel = new Number(props[6]).toString();
      if(subject.dt_cancel != "0") {
        cert.numCancelations++;
      }
      cert.subjects.push(subject);
    }
    certs.push(cert);
  }
  console.log(JSON.stringify(certs));
}
catch(e) {
  console.log("EXCEPTION:");
  console.log(e);
};
