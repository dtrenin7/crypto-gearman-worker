
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

var subjectJsonB64 = "ewogICJjb250cmFjdF9uYW1lIjogIlN1YmplY3QiLAogICJhYmkiOiBbCiAgICB7CiAgICAgICJjb25zdGFudCI6IHRydWUsCiAgICAgICJpbnB1dHMiOiBbCiAgICAgICAgewogICAgICAgICAgIm5hbWUiOiAiX0lEIiwKICAgICAgICAgICJ0eXBlIjogInVpbnQyNTYiCiAgICAgICAgfQogICAgICBdLAogICAgICAibmFtZSI6ICJnZXRDZXJ0aWZpY2F0ZSIsCiAgICAgICJvdXRwdXRzIjogWwogICAgICAgIHsKICAgICAgICAgICJuYW1lIjogIl9jZXJ0aWZpY2F0ZSIsCiAgICAgICAgICAidHlwZSI6ICJhZGRyZXNzIgogICAgICAgIH0KICAgICAgXSwKICAgICAgInBheWFibGUiOiBmYWxzZSwKICAgICAgInR5cGUiOiAiZnVuY3Rpb24iCiAgICB9LAogICAgewogICAgICAiY29uc3RhbnQiOiBmYWxzZSwKICAgICAgImlucHV0cyI6IFsKICAgICAgICB7CiAgICAgICAgICAibmFtZSI6ICJjZXJ0aWZpY2F0ZSIsCiAgICAgICAgICAidHlwZSI6ICJhZGRyZXNzIgogICAgICAgIH0KICAgICAgXSwKICAgICAgIm5hbWUiOiAiYWRkQ2VydGlmaWNhdGUiLAogICAgICAib3V0cHV0cyI6IFtdLAogICAgICAicGF5YWJsZSI6IGZhbHNlLAogICAgICAidHlwZSI6ICJmdW5jdGlvbiIKICAgIH0sCiAgICB7CiAgICAgICJjb25zdGFudCI6IHRydWUsCiAgICAgICJpbnB1dHMiOiBbXSwKICAgICAgIm5hbWUiOiAiZ2V0UHJvcHMiLAogICAgICAib3V0cHV0cyI6IFsKICAgICAgICB7CiAgICAgICAgICAibmFtZSI6ICJfSUQiLAogICAgICAgICAgInR5cGUiOiAidWludDI1NiIKICAgICAgICB9LAogICAgICAgIHsKICAgICAgICAgICJuYW1lIjogIl9iaXJ0aGRhdGUiLAogICAgICAgICAgInR5cGUiOiAidWludDI1NiIKICAgICAgICB9LAogICAgICAgIHsKICAgICAgICAgICJuYW1lIjogIl9mdWxsbmFtZSIsCiAgICAgICAgICAidHlwZSI6ICJzdHJpbmciCiAgICAgICAgfSwKICAgICAgICB7CiAgICAgICAgICAibmFtZSI6ICJfZ2VuZGVyIiwKICAgICAgICAgICJ0eXBlIjogInVpbnQ4IgogICAgICAgIH0sCiAgICAgICAgewogICAgICAgICAgIm5hbWUiOiAiX29yaWdpbiIsCiAgICAgICAgICAidHlwZSI6ICJ1aW50OCIKICAgICAgICB9LAogICAgICAgIHsKICAgICAgICAgICJuYW1lIjogIl9jZXJ0aWZpY2F0ZXMiLAogICAgICAgICAgInR5cGUiOiAidWludDI1NiIKICAgICAgICB9CiAgICAgIF0sCiAgICAgICJwYXlhYmxlIjogZmFsc2UsCiAgICAgICJ0eXBlIjogImZ1bmN0aW9uIgogICAgfSwKICAgIHsKICAgICAgImlucHV0cyI6IFsKICAgICAgICB7CiAgICAgICAgICAibmFtZSI6ICJfSUQiLAogICAgICAgICAgInR5cGUiOiAidWludDI1NiIKICAgICAgICB9LAogICAgICAgIHsKICAgICAgICAgICJuYW1lIjogIl9iaXJ0aGRhdGUiLAogICAgICAgICAgInR5cGUiOiAidWludDI1NiIKICAgICAgICB9LAogICAgICAgIHsKICAgICAgICAgICJuYW1lIjogIl9mdWxsbmFtZSIsCiAgICAgICAgICAidHlwZSI6ICJzdHJpbmciCiAgICAgICAgfSwKICAgICAgICB7CiAgICAgICAgICAibmFtZSI6ICJfZ2VuZGVyIiwKICAgICAgICAgICJ0eXBlIjogInVpbnQ4IgogICAgICAgIH0sCiAgICAgICAgewogICAgICAgICAgIm5hbWUiOiAiX29yaWdpbiIsCiAgICAgICAgICAidHlwZSI6ICJ1aW50OCIKICAgICAgICB9LAogICAgICAgIHsKICAgICAgICAgICJuYW1lIjogImNlcnRpZmljYXRlIiwKICAgICAgICAgICJ0eXBlIjogImFkZHJlc3MiCiAgICAgICAgfQogICAgICBdLAogICAgICAicGF5YWJsZSI6IGZhbHNlLAogICAgICAidHlwZSI6ICJjb25zdHJ1Y3RvciIKICAgIH0KICBdLAogICJ1bmxpbmtlZF9iaW5hcnkiOiAiMHg2MDYwNjA0MDUyMzQxNTYxMDAwZjU3NjAwMDgwZmQ1YjYwNDA1MTYxMDQ5YzM4MDM4MDYxMDQ5YzgzMzk4MTAxNjA0MDUyODA4MDUxOTE5MDYwMjAwMTgwNTE5MTkwNjAyMDAxODA1MTgyMDE5MTkwNjAyMDAxODA1MTkxOTA2MDIwMDE4MDUxOTE5MDYwMjAwMTgwNTE5MTUwNTA1YjYwMDA4NjkwNTU2MDAxODU5MDU1NjAwMjg0ODA1MTYxMDA2YjkyOTE2MDIwMDE5MDYxMDBlNjU2NWI1MDYwMDM4MDU0NjBmZjg0ODExNjYxMDEwMDAyNjFmZjAwMTk5MTg3MTY2MGZmMTk5MDkzMTY5MjkwOTIxNzE2MTc5MDU1NjEwMGE0ODE2NDAxMDAwMDAwMDA2MTAxYTA2MTAwYjA4MjAyMTcwNDU2NWI1YjUwNTA1MDUwNTA1MDYxMDE4NjU2NWI2MDA0ODA1NDYwMDA5MDgxNTI2MDA1NjAyMDUyNjA0MDkwMjA4MDU0NjAwMTYwYTA2MDAyMGEwMzE5MTY2MDAxNjBhMDYwMDIwYTAzODQxNjE3OTA1NTgwNTQ2MDAxMDE5MDU1NWI1MDU2NWI4MjgwNTQ2MDAxODE2MDAxMTYxNTYxMDEwMDAyMDMxNjYwMDI5MDA0OTA2MDAwNTI2MDIwNjAwMDIwOTA2MDFmMDE2MDIwOTAwNDgxMDE5MjgyNjAxZjEwNjEwMTI3NTc4MDUxNjBmZjE5MTY4MzgwMDExNzg1NTU2MTAxNTQ1NjViODI4MDAxNjAwMTAxODU1NTgyMTU2MTAxNTQ1NzkxODIwMTViODI4MTExMTU2MTAxNTQ1NzgyNTE4MjU1OTE2MDIwMDE5MTkwNjAwMTAxOTA2MTAxMzk1NjViNWI1MDYxMDE2MTkyOTE1MDYxMDE2NTU2NWI1MDkwNTY1YjYxMDE4MzkxOTA1YjgwODIxMTE1NjEwMTYxNTc2MDAwODE1NTYwMDEwMTYxMDE2YjU2NWI1MDkwNTY1YjkwNTY1YjYxMDMwNzgwNjEwMTk1NjAwMDM5NjAwMGYzMDA2MDYwNjA0MDUyNjNmZmZmZmZmZjdjMDEwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDYwMDAzNTA0MTY2MzUxNjQwZmVlODExNDYxMDA1MzU3ODA2MzdjNmViZGU5MTQ2MTAwOTI1NzgwNjNlYzE4OTNiNDE0NjEwMGMwNTc1YjYwMDA4MGZkNWIzNDE1NjEwMDVlNTc2MDAwODBmZDViNjEwMDY5NjAwNDM1NjEwMTc1NTY1YjYwNDA1MTczZmZmZmZmZmZmZmZmZmZmZmZmZmZmZmZmZmZmZmZmZmZmZmZmZmZmZjkwOTExNjgxNTI2MDIwMDE2MDQwNTE4MDkxMDM5MGYzNWIzNDE1NjEwMDlkNTc2MDAwODBmZDViNjEwMGJlNzNmZmZmZmZmZmZmZmZmZmZmZmZmZmZmZmZmZmZmZmZmZmZmZmZmZmZmNjAwNDM1MTY2MTAxYTA1NjViMDA1YjM0MTU2MTAwY2I1NzYwMDA4MGZkNWI2MTAwZDM2MTAxZjA1NjViNjA0MDUxODY4MTUyNjAyMDgxMDE4NjkwNTI2MGZmODA4NTE2NjA2MDgzMDE1MjgzMTY2MDgwODIwMTUyNjBhMDgxMDE4MjkwNTI2MGMwNjA0MDgyMDE4MTgxNTI5MDgyMDE4NjgxODE1MTgxNTI2MDIwMDE5MTUwODA1MTkwNjAyMDAxOTA4MDgzODM2MDAwNWI4MzgxMTAxNTYxMDEzNTU3ODA4MjAxNTE4MTg0MDE1MjViNjAyMDAxNjEwMTFjNTY1YjUwNTA1MDUwOTA1MDkwODEwMTkwNjAxZjE2ODAxNTYxMDE2MjU3ODA4MjAzODA1MTYwMDE4MzYwMjAwMzYxMDEwMDBhMDMxOTE2ODE1MjYwMjAwMTkxNTA1YjUwOTc1MDUwNTA1MDUwNTA1MDUwNjA0MDUxODA5MTAzOTBmMzViNjAwMDgxODE1MjYwMDU2MDIwNTI2MDQwOTAyMDU0NzNmZmZmZmZmZmZmZmZmZmZmZmZmZmZmZmZmZmZmZmZmZmZmZmZmZmZmMTY1YjkxOTA1MDU2NWI2MDA0ODA1NDYwMDA5MDgxNTI2MDA1NjAyMDUyNjA0MDkwMjA4MDU0NzNmZmZmZmZmZmZmZmZmZmZmZmZmZmZmZmZmZmZmZmZmZmZmZmZmZmZmMTkxNjczZmZmZmZmZmZmZmZmZmZmZmZmZmZmZmZmZmZmZmZmZmZmZmZmZmZmZjg0MTYxNzkwNTU4MDU0NjAwMTAxOTA1NTViNTA1NjViNjAwMDgwNjEwMWZiNjEwMmM5NTY1YjYwMDA4MDYwMDA4MDU0OTU1MDYwMDE1NDk0NTA2MDAyODA1NDYwMDE4MTYwMDExNjE1NjEwMTAwMDIwMzE2NjAwMjkwMDQ4MDYwMWYwMTYwMjA4MDkxMDQwMjYwMjAwMTYwNDA1MTkwODEwMTYwNDA1MjgwOTI5MTkwODE4MTUyNjAyMDAxODI4MDU0NjAwMTgxNjAwMTE2MTU2MTAxMDAwMjAzMTY2MDAyOTAwNDgwMTU2MTAyOWY1NzgwNjAxZjEwNjEwMjc0NTc2MTAxMDA4MDgzNTQwNDAyODM1MjkxNjAyMDAxOTE2MTAyOWY1NjViODIwMTkxOTA2MDAwNTI2MDIwNjAwMDIwOTA1YjgxNTQ4MTUyOTA2MDAxMDE5MDYwMjAwMTgwODMxMTYxMDI4MjU3ODI5MDAzNjAxZjE2ODIwMTkxNWI1MDUwNjAwMzU0NjAwNDU0OTQ5ODUwNjBmZjgwODIxNjk4NTA2MTAxMDA5MDkxMDQxNjk1NTA5MjkzNTA1MDUwNTA1YjkwOTE5MjkzOTQ5NTU2NWI2MDIwNjA0MDUxOTA4MTAxNjA0MDUyNjAwMDgxNTI5MDU2MDBhMTY1NjI3YTdhNzIzMDU4MjA3MWFlYzc3ZWRiODI2ZTgwZDk4NTNiN2ZlZjJmZDQ1Njg1OTJmMTQzMjUzODZhMTVlZWQzNzBlYzQ3ODE1M2IzMDAyOSIsCiAgIm5ldHdvcmtzIjogewogICAgIjEiOiB7CiAgICAgICJldmVudHMiOiB7fSwKICAgICAgImxpbmtzIjoge30sCiAgICAgICJhZGRyZXNzIjogIjB4ZGVjNmMwY2U0MDY0M2U4MDJiNDUyNjg3Mzc4M2FlMjVhZDI2ZGQ5NCIsCiAgICAgICJ1cGRhdGVkX2F0IjogMTUxMzE2ODc2ODkyNQogICAgfQogIH0sCiAgInNjaGVtYV92ZXJzaW9uIjogIjAuMC41IiwKICAidXBkYXRlZF9hdCI6IDE1MTMxNjg3Njg5MjUKfQ==";

try {
  var subjectJson = atob(subjectJsonB64);
  var subjectProto = JSON.parse(subjectJson);
  var subjectProxy = web3.eth.contract(subjectProto.abi);

  var contract = subjectProxy.at($$$address$$$);
  var props = contract.getProps();
  var subject = {};
  subject.ID = new Number(props[0]);
  subject.birthdate = new Number(props[1]);
  subject.name = props[2];
  subject.gender = new Number(props[3]);
  subject.origin = new Number(props[4]);
  subject.certificates = [];
  var numCerts = new Number(props[5]);
  for(var i = 0; i < numCerts; i++) {
    subject.certificates.push(contract.getCertificate(i));
  }
  console.log(JSON.stringify(subject));
}
catch(e) {
  console.log("EXCEPTION:");
  console.log(e);
};
