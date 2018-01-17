
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
  var abiB64 = 'W3siY29uc3RhbnQiOnRydWUsImlucHV0cyI6W10sIm5hbWUiOiJnZXRDZXJ0aWZpY2F0ZSIsIm91dHB1dHMiOlt7Im5hbWUiOiJfdHlwZV9pZCIsInR5cGUiOiJ1aW50OCJ9LHsibmFtZSI6Il9kdF9jcmVhdGUiLCJ0eXBlIjoidWludDI1NiJ9LHsibmFtZSI6Il9zdWJqZWN0c19jb3VudCIsInR5cGUiOiJ1aW50MjU2In1dLCJwYXlhYmxlIjpmYWxzZSwidHlwZSI6ImZ1bmN0aW9uIn0seyJjb25zdGFudCI6ZmFsc2UsImlucHV0cyI6W3sibmFtZSI6Il9pZCIsInR5cGUiOiJ1aW50MjU2In0seyJuYW1lIjoiX3ZhbGlkYXRlX2hhc2giLCJ0eXBlIjoidWludDI1NiJ9LHsibmFtZSI6Il9iaXJ0aGRheSIsInR5cGUiOiJ1aW50MjU2In0seyJuYW1lIjoiX2dlbmRlciIsInR5cGUiOiJ1aW50OCJ9LHsibmFtZSI6Il9kdF9zaWduIiwidHlwZSI6InVpbnQyNTYifSx7Im5hbWUiOiJfZnVsbG5hbWUiLCJ0eXBlIjoic3RyaW5nIn1dLCJuYW1lIjoiU2lnbiIsIm91dHB1dHMiOltdLCJwYXlhYmxlIjp0cnVlLCJ0eXBlIjoiZnVuY3Rpb24ifSx7ImNvbnN0YW50Ijp0cnVlLCJpbnB1dHMiOlt7Im5hbWUiOiJpbmRleCIsInR5cGUiOiJ1aW50MjU2In1dLCJuYW1lIjoiZ2V0U3ViamVjdCIsIm91dHB1dHMiOlt7Im5hbWUiOiJfaWQiLCJ0eXBlIjoidWludDI1NiJ9LHsibmFtZSI6Il92YWxpZGF0ZV9oYXNoIiwidHlwZSI6InVpbnQyNTYifSx7Im5hbWUiOiJfYmlydGhkYXkiLCJ0eXBlIjoidWludDI1NiJ9LHsibmFtZSI6Il9mdWxsbmFtZSIsInR5cGUiOiJzdHJpbmcifSx7Im5hbWUiOiJfZ2VuZGVyIiwidHlwZSI6InVpbnQ4In0seyJuYW1lIjoiX2R0X3NpZ24iLCJ0eXBlIjoidWludDI1NiJ9LHsibmFtZSI6Il9kdF9jYW5jZWwiLCJ0eXBlIjoidWludDI1NiJ9XSwicGF5YWJsZSI6ZmFsc2UsInR5cGUiOiJmdW5jdGlvbiJ9LHsiaW5wdXRzIjpbeyJuYW1lIjoiX3R5cGVfaWQiLCJ0eXBlIjoidWludDgifSx7Im5hbWUiOiJfZHRfY3JlYXRlIiwidHlwZSI6InVpbnQyNTYifSx7Im5hbWUiOiJfc3ViamVjdHNfYWRkciIsInR5cGUiOiJhZGRyZXNzW10ifV0sInBheWFibGUiOmZhbHNlLCJ0eXBlIjoiY29uc3RydWN0b3IifV0=';
  var abi = atob(abiB64);
  var certificateProxy = web3.eth.contract(JSON.parse(abi));

  var contract = certificateProxy.at($$$address$$$);
  var props = contract.getSubject($$$index$$$);
  var subject = {};
  subject.id = new Number(props[0]).toString();
  subject.validate_hash = new Number(props[1]).toString();
  subject.birthday = new Number(props[2]).toString();
  subject.fullname = props[3];
  subject.gender = new Number(props[4]);
  subject.dt_sign = new Number(props[5]).toString();
  subject.dt_cancel = new Number(props[6]).toString();
  console.log(JSON.stringify(subject));
}
catch(e) {
  console.log("EXCEPTION:");
  console.log(e);
};
