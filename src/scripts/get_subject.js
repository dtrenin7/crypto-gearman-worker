
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

var subjectJsonB64 = "ewogICJjb250cmFjdF9uYW1lIjogIlN1YmplY3QiLAogICJhYmkiOiBbCiAgICB7CiAgICAgICJjb25zdGFudCI6IHRydWUsCiAgICAgICJpbnB1dHMiOiBbXSwKICAgICAgIm5hbWUiOiAiZ2V0UHJvcHMiLAogICAgICAib3V0cHV0cyI6IFsKICAgICAgICB7CiAgICAgICAgICAibmFtZSI6ICJfSUQiLAogICAgICAgICAgInR5cGUiOiAidWludDI1NiIKICAgICAgICB9LAogICAgICAgIHsKICAgICAgICAgICJuYW1lIjogIl9iaXJ0aGRhdGUiLAogICAgICAgICAgInR5cGUiOiAidWludDI1NiIKICAgICAgICB9LAogICAgICAgIHsKICAgICAgICAgICJuYW1lIjogIl9mdWxsbmFtZSIsCiAgICAgICAgICAidHlwZSI6ICJzdHJpbmciCiAgICAgICAgfSwKICAgICAgICB7CiAgICAgICAgICAibmFtZSI6ICJfZ2VuZGVyIiwKICAgICAgICAgICJ0eXBlIjogInVpbnQ4IgogICAgICAgIH0sCiAgICAgICAgewogICAgICAgICAgIm5hbWUiOiAiX29yaWdpbiIsCiAgICAgICAgICAidHlwZSI6ICJ1aW50OCIKICAgICAgICB9CiAgICAgIF0sCiAgICAgICJwYXlhYmxlIjogZmFsc2UsCiAgICAgICJ0eXBlIjogImZ1bmN0aW9uIgogICAgfSwKICAgIHsKICAgICAgImlucHV0cyI6IFsKICAgICAgICB7CiAgICAgICAgICAibmFtZSI6ICJfSUQiLAogICAgICAgICAgInR5cGUiOiAidWludDI1NiIKICAgICAgICB9LAogICAgICAgIHsKICAgICAgICAgICJuYW1lIjogIl9iaXJ0aGRhdGUiLAogICAgICAgICAgInR5cGUiOiAidWludDI1NiIKICAgICAgICB9LAogICAgICAgIHsKICAgICAgICAgICJuYW1lIjogIl9mdWxsbmFtZSIsCiAgICAgICAgICAidHlwZSI6ICJzdHJpbmciCiAgICAgICAgfSwKICAgICAgICB7CiAgICAgICAgICAibmFtZSI6ICJfZ2VuZGVyIiwKICAgICAgICAgICJ0eXBlIjogInVpbnQ4IgogICAgICAgIH0sCiAgICAgICAgewogICAgICAgICAgIm5hbWUiOiAiX29yaWdpbiIsCiAgICAgICAgICAidHlwZSI6ICJ1aW50OCIKICAgICAgICB9CiAgICAgIF0sCiAgICAgICJwYXlhYmxlIjogZmFsc2UsCiAgICAgICJ0eXBlIjogImNvbnN0cnVjdG9yIgogICAgfQogIF0sCiAgInVubGlua2VkX2JpbmFyeSI6ICIweDYwNjA2MDQwNTIzNDE1NjEwMDBmNTc2MDAwODBmZDViNjA0MDUxNjEwMzNjMzgwMzgwNjEwMzNjODMzOTgxMDE2MDQwNTI4MDgwNTE5MTkwNjAyMDAxODA1MTkxOTA2MDIwMDE4MDUxODIwMTkxOTA2MDIwMDE4MDUxOTE5MDYwMjAwMTgwNTE5MTUwNTA1YjYwMDA4NTkwNTU2MDAxODQ5MDU1NjAwMjgzODA1MTYxMDA2NDkyOTE2MDIwMDE5MDYxMDA5MjU2NWI1MDYwMDM4MDU0NjBmZjgzODExNjYxMDEwMDAyNjFmZjAwMTk5MTg2MTY2MGZmMTk5MDkzMTY5MjkwOTIxNzE2MTc5MDU1NWI1MDUwNTA1MDUwNjEwMTMyNTY1YjgyODA1NDYwMDE4MTYwMDExNjE1NjEwMTAwMDIwMzE2NjAwMjkwMDQ5MDYwMDA1MjYwMjA2MDAwMjA5MDYwMWYwMTYwMjA5MDA0ODEwMTkyODI2MDFmMTA2MTAwZDM1NzgwNTE2MGZmMTkxNjgzODAwMTE3ODU1NTYxMDEwMDU2NWI4MjgwMDE2MDAxMDE4NTU1ODIxNTYxMDEwMDU3OTE4MjAxNWI4MjgxMTExNTYxMDEwMDU3ODI1MTgyNTU5MTYwMjAwMTkxOTA2MDAxMDE5MDYxMDBlNTU2NWI1YjUwNjEwMTBkOTI5MTUwNjEwMTExNTY1YjUwOTA1NjViNjEwMTJmOTE5MDViODA4MjExMTU2MTAxMGQ1NzYwMDA4MTU1NjAwMTAxNjEwMTE3NTY1YjUwOTA1NjViOTA1NjViNjEwMWZiODA2MTAxNDE2MDAwMzk2MDAwZjMwMDYwNjA2MDQwNTI2M2ZmZmZmZmZmN2MwMTAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwNjAwMDM1MDQxNjYzZWMxODkzYjQ4MTE0NjEwMDNkNTc1YjYwMDA4MGZkNWIzNDE1NjEwMDQ4NTc2MDAwODBmZDViNjEwMDUwNjEwMGVhNTY1YjYwNDA1MTg1ODE1MjYwMjA4MTAxODU5MDUyNjBmZjgwODQxNjYwNjA4MzAxNTI4MjE2NjA4MDgyMDE1MjYwYTA2MDQwODIwMTgxODE1MjkwODIwMTg1ODE4MTUxODE1MjYwMjAwMTkxNTA4MDUxOTA2MDIwMDE5MDgwODM4MzYwMDA1YjgzODExMDE1NjEwMGFiNTc4MDgyMDE1MTgxODQwMTUyNWI2MDIwMDE2MTAwOTI1NjViNTA1MDUwNTA5MDUwOTA4MTAxOTA2MDFmMTY4MDE1NjEwMGQ4NTc4MDgyMDM4MDUxNjAwMTgzNjAyMDAzNjEwMTAwMGEwMzE5MTY4MTUyNjAyMDAxOTE1MDViNTA5NjUwNTA1MDUwNTA1MDUwNjA0MDUxODA5MTAzOTBmMzViNjAwMDgwNjEwMGY1NjEwMWJkNTY1YjYwMDA4MDYwMDA1NDk0NTA2MDAxNTQ5MzUwNjAwMjgwNTQ2MDAxODE2MDAxMTYxNTYxMDEwMDAyMDMxNjYwMDI5MDA0ODA2MDFmMDE2MDIwODA5MTA0MDI2MDIwMDE2MDQwNTE5MDgxMDE2MDQwNTI4MDkyOTE5MDgxODE1MjYwMjAwMTgyODA1NDYwMDE4MTYwMDExNjE1NjEwMTAwMDIwMzE2NjAwMjkwMDQ4MDE1NjEwMTk4NTc4MDYwMWYxMDYxMDE2ZDU3NjEwMTAwODA4MzU0MDQwMjgzNTI5MTYwMjAwMTkxNjEwMTk4NTY1YjgyMDE5MTkwNjAwMDUyNjAyMDYwMDAyMDkwNWI4MTU0ODE1MjkwNjAwMTAxOTA2MDIwMDE4MDgzMTE2MTAxN2I1NzgyOTAwMzYwMWYxNjgyMDE5MTViNTA1MDYwMDM1NDkzOTY1MDUwNjBmZjgwODQxNjk1NTA2MTAxMDA5MDkzMDQ5MDkyMTY5MjUwNTA1MDViOTA5MTkyOTM5NDU2NWI2MDIwNjA0MDUxOTA4MTAxNjA0MDUyNjAwMDgxNTI5MDU2MDBhMTY1NjI3YTdhNzIzMDU4MjA0YjEyZTc3NzA1NWNkZTMxNjY0NzcxNDZjM2I4ZmNkODBiNzlkMWJiNTE4YmE5NWMwMzEyOGQ0YWQwNTc1NTEyMDAyOSIsCiAgIm5ldHdvcmtzIjogewogICAgIjEiOiB7CiAgICAgICJldmVudHMiOiB7fSwKICAgICAgImxpbmtzIjoge30sCiAgICAgICJhZGRyZXNzIjogIjB4ZGVjNmMwY2U0MDY0M2U4MDJiNDUyNjg3Mzc4M2FlMjVhZDI2ZGQ5NCIsCiAgICAgICJ1cGRhdGVkX2F0IjogMTUxMTc5MjEwNzc1MQogICAgfQogIH0sCiAgInNjaGVtYV92ZXJzaW9uIjogIjAuMC41IiwKICAidXBkYXRlZF9hdCI6IDE1MTE3OTIxMDc3NTEKfQ==";

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
  console.log(JSON.stringify(subject));
}
catch(e) {
  console.log("EXCEPTION:");
  console.log(e);
};
