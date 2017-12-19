
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

var certificateJsonB64 = "ewogICJjb250cmFjdF9uYW1lIjogIkNlcnRpZmljYXRlIiwKICAiYWJpIjogWwogICAgewogICAgICAiY29uc3RhbnQiOiBmYWxzZSwKICAgICAgImlucHV0cyI6IFsKICAgICAgICB7CiAgICAgICAgICAibmFtZSI6ICJfb3duZXIiLAogICAgICAgICAgInR5cGUiOiAiYWRkcmVzcyIKICAgICAgICB9CiAgICAgIF0sCiAgICAgICJuYW1lIjogInNldE93bmVyIiwKICAgICAgIm91dHB1dHMiOiBbXSwKICAgICAgInBheWFibGUiOiBmYWxzZSwKICAgICAgInR5cGUiOiAiZnVuY3Rpb24iCiAgICB9LAogICAgewogICAgICAiY29uc3RhbnQiOiBmYWxzZSwKICAgICAgImlucHV0cyI6IFsKICAgICAgICB7CiAgICAgICAgICAibmFtZSI6ICJfZGF0ZSIsCiAgICAgICAgICAidHlwZSI6ICJ1aW50MjU2IgogICAgICAgIH0KICAgICAgXSwKICAgICAgIm5hbWUiOiAic2lnbiIsCiAgICAgICJvdXRwdXRzIjogW10sCiAgICAgICJwYXlhYmxlIjogZmFsc2UsCiAgICAgICJ0eXBlIjogImZ1bmN0aW9uIgogICAgfSwKICAgIHsKICAgICAgImNvbnN0YW50IjogZmFsc2UsCiAgICAgICJpbnB1dHMiOiBbCiAgICAgICAgewogICAgICAgICAgIm5hbWUiOiAiX2RhdGUiLAogICAgICAgICAgInR5cGUiOiAidWludDI1NiIKICAgICAgICB9CiAgICAgIF0sCiAgICAgICJuYW1lIjogImNhbmNlbCIsCiAgICAgICJvdXRwdXRzIjogW10sCiAgICAgICJwYXlhYmxlIjogZmFsc2UsCiAgICAgICJ0eXBlIjogImZ1bmN0aW9uIgogICAgfSwKICAgIHsKICAgICAgImNvbnN0YW50IjogdHJ1ZSwKICAgICAgImlucHV0cyI6IFsKICAgICAgICB7CiAgICAgICAgICAibmFtZSI6ICJfc3ViamVjdCIsCiAgICAgICAgICAidHlwZSI6ICJhZGRyZXNzIgogICAgICAgIH0KICAgICAgXSwKICAgICAgIm5hbWUiOiAiZ2V0Q2FuY2VsYXRpb24iLAogICAgICAib3V0cHV0cyI6IFsKICAgICAgICB7CiAgICAgICAgICAibmFtZSI6ICJfZGF0ZSIsCiAgICAgICAgICAidHlwZSI6ICJ1aW50MjU2IgogICAgICAgIH0KICAgICAgXSwKICAgICAgInBheWFibGUiOiBmYWxzZSwKICAgICAgInR5cGUiOiAiZnVuY3Rpb24iCiAgICB9LAogICAgewogICAgICAiY29uc3RhbnQiOiBmYWxzZSwKICAgICAgImlucHV0cyI6IFsKICAgICAgICB7CiAgICAgICAgICAibmFtZSI6ICJhY2NvdW50IiwKICAgICAgICAgICJ0eXBlIjogImFkZHJlc3MiCiAgICAgICAgfSwKICAgICAgICB7CiAgICAgICAgICAibmFtZSI6ICJfYmlydGhkYXRlIiwKICAgICAgICAgICJ0eXBlIjogInVpbnQyNTYiCiAgICAgICAgfSwKICAgICAgICB7CiAgICAgICAgICAibmFtZSI6ICJfbmFtZSIsCiAgICAgICAgICAidHlwZSI6ICJzdHJpbmciCiAgICAgICAgfSwKICAgICAgICB7CiAgICAgICAgICAibmFtZSI6ICJfZ2VuZGVyIiwKICAgICAgICAgICJ0eXBlIjogInVpbnQ4IgogICAgICAgIH0sCiAgICAgICAgewogICAgICAgICAgIm5hbWUiOiAiX29yaWdpbiIsCiAgICAgICAgICAidHlwZSI6ICJ1aW50OCIKICAgICAgICB9CiAgICAgIF0sCiAgICAgICJuYW1lIjogImFkZFN1YmplY3QiLAogICAgICAib3V0cHV0cyI6IFsKICAgICAgICB7CiAgICAgICAgICAibmFtZSI6ICJJRCIsCiAgICAgICAgICAidHlwZSI6ICJ1aW50MjU2IgogICAgICAgIH0KICAgICAgXSwKICAgICAgInBheWFibGUiOiBmYWxzZSwKICAgICAgInR5cGUiOiAiZnVuY3Rpb24iCiAgICB9LAogICAgewogICAgICAiY29uc3RhbnQiOiB0cnVlLAogICAgICAiaW5wdXRzIjogW10sCiAgICAgICJuYW1lIjogImdldE93bmVyIiwKICAgICAgIm91dHB1dHMiOiBbCiAgICAgICAgewogICAgICAgICAgIm5hbWUiOiAiX293bmVyIiwKICAgICAgICAgICJ0eXBlIjogImFkZHJlc3MiCiAgICAgICAgfQogICAgICBdLAogICAgICAicGF5YWJsZSI6IGZhbHNlLAogICAgICAidHlwZSI6ICJmdW5jdGlvbiIKICAgIH0sCiAgICB7CiAgICAgICJjb25zdGFudCI6IHRydWUsCiAgICAgICJpbnB1dHMiOiBbCiAgICAgICAgewogICAgICAgICAgIm5hbWUiOiAiX3N1YmplY3QiLAogICAgICAgICAgInR5cGUiOiAiYWRkcmVzcyIKICAgICAgICB9CiAgICAgIF0sCiAgICAgICJuYW1lIjogImdldFNpZ24iLAogICAgICAib3V0cHV0cyI6IFsKICAgICAgICB7CiAgICAgICAgICAibmFtZSI6ICJfZGF0ZSIsCiAgICAgICAgICAidHlwZSI6ICJ1aW50MjU2IgogICAgICAgIH0KICAgICAgXSwKICAgICAgInBheWFibGUiOiBmYWxzZSwKICAgICAgInR5cGUiOiAiZnVuY3Rpb24iCiAgICB9LAogICAgewogICAgICAiY29uc3RhbnQiOiB0cnVlLAogICAgICAiaW5wdXRzIjogW10sCiAgICAgICJuYW1lIjogImdldFByb3BzIiwKICAgICAgIm91dHB1dHMiOiBbCiAgICAgICAgewogICAgICAgICAgIm5hbWUiOiAiX3R5cGUiLAogICAgICAgICAgInR5cGUiOiAidWludDgiCiAgICAgICAgfSwKICAgICAgICB7CiAgICAgICAgICAibmFtZSI6ICJfc3RhdGUiLAogICAgICAgICAgInR5cGUiOiAidWludDgiCiAgICAgICAgfSwKICAgICAgICB7CiAgICAgICAgICAibmFtZSI6ICJfZGF0ZSIsCiAgICAgICAgICAidHlwZSI6ICJ1aW50MjU2IgogICAgICAgIH0sCiAgICAgICAgewogICAgICAgICAgIm5hbWUiOiAiX251bVN1YmplY3RzIiwKICAgICAgICAgICJ0eXBlIjogInVpbnQ4IgogICAgICAgIH0sCiAgICAgICAgewogICAgICAgICAgIm5hbWUiOiAiX251bVNpZ25zIiwKICAgICAgICAgICJ0eXBlIjogInVpbnQ4IgogICAgICAgIH0sCiAgICAgICAgewogICAgICAgICAgIm5hbWUiOiAiX251bUNhbmNlbGF0aW9ucyIsCiAgICAgICAgICAidHlwZSI6ICJ1aW50OCIKICAgICAgICB9CiAgICAgIF0sCiAgICAgICJwYXlhYmxlIjogZmFsc2UsCiAgICAgICJ0eXBlIjogImZ1bmN0aW9uIgogICAgfSwKICAgIHsKICAgICAgImNvbnN0YW50IjogdHJ1ZSwKICAgICAgImlucHV0cyI6IFsKICAgICAgICB7CiAgICAgICAgICAibmFtZSI6ICJJRCIsCiAgICAgICAgICAidHlwZSI6ICJ1aW50MjU2IgogICAgICAgIH0KICAgICAgXSwKICAgICAgIm5hbWUiOiAiZ2V0U3ViamVjdCIsCiAgICAgICJvdXRwdXRzIjogWwogICAgICAgIHsKICAgICAgICAgICJuYW1lIjogIl9zdWJqZWN0IiwKICAgICAgICAgICJ0eXBlIjogImFkZHJlc3MiCiAgICAgICAgfSwKICAgICAgICB7CiAgICAgICAgICAibmFtZSI6ICJfYWNjb3VudCIsCiAgICAgICAgICAidHlwZSI6ICJhZGRyZXNzIgogICAgICAgIH0KICAgICAgXSwKICAgICAgInBheWFibGUiOiBmYWxzZSwKICAgICAgInR5cGUiOiAiZnVuY3Rpb24iCiAgICB9LAogICAgewogICAgICAiaW5wdXRzIjogWwogICAgICAgIHsKICAgICAgICAgICJuYW1lIjogIl90eXBlIiwKICAgICAgICAgICJ0eXBlIjogInVpbnQ4IgogICAgICAgIH0sCiAgICAgICAgewogICAgICAgICAgIm5hbWUiOiAiX2RhdGUiLAogICAgICAgICAgInR5cGUiOiAidWludDI1NiIKICAgICAgICB9CiAgICAgIF0sCiAgICAgICJwYXlhYmxlIjogZmFsc2UsCiAgICAgICJ0eXBlIjogImNvbnN0cnVjdG9yIgogICAgfQogIF0sCiAgInVubGlua2VkX2JpbmFyeSI6ICIweDYwNjA2MDQwNTIzNDE1NjEwMDBmNTc2MDAwODBmZDViNjA0MDUxNjA0MDgwNjEwZGQ1ODMzOTgxMDE2MDQwNTI4MDgwNTE5MTkwNjAyMDAxODA1MTkxNTA1MDViNWI2MDAwODA1NDYwMDE2MGEwNjAwMjBhMDMxOTE2MzM2MDAxNjBhMDYwMDIwYTAzMTYxNzkwNTU1YjYwMDA4MDU0NjBhMDYwMDIwYTYwZmYwMjE5MTY3NDAxMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDYwZmY4NTE2MDIxNzgwODI1NTgxOTA2MGE4NjAwMjBhNjBmZjAyMTkxNjc1MDEwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDA4MjViMDIxNzkwNTU1MDYwMDE4MTkwNTU2MDA2ODA1NDYwMDE2MGI4NjAwMjBhMDMxOTE2NjMwMTAwMDAwMDMwNjAwMTYwYTA2MDAyMGEwMzE2MDIxNzkwNTU1YjUwNTA1YjYxMGNmYjgwNjEwMGRhNjAwMDM5NjAwMGYzMDA2MDYwNjA0MDUyMzYxNTYxMDA5NjU3NjNmZmZmZmZmZjdjMDEwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDYwMDAzNTA0MTY2MzEzYWY0MDM1ODExNDYxMDA5YjU3ODA2MzJmYjFiMjVmMTQ2MTAwYmM1NzgwNjM0MGU1OGVlNTE0NjEwMGQ0NTc4MDYzNGIxMzllNzExNDYxMDBlYzU3ODA2Mzc4YTA4NGY5MTQ2MTAxMWQ1NzgwNjM4OTNkMjBlODE0NjEwMWEwNTc4MDYzZDE4NjU4ZjAxNDYxMDFjZjU3ODA2M2VjMTg5M2I0MTQ2MTAyMDA1NzgwNjNmNmRkMDE4NzE0NjEwMjY2NTc1YjYwMDA4MGZkNWIzNDE1NjEwMGE2NTc2MDAwODBmZDViNjEwMGJhNjAwMTYwYTA2MDAyMGEwMzYwMDQzNTE2NjEwMmEwNTY1YjAwNWIzNDE1NjEwMGM3NTc2MDAwODBmZDViNjEwMGJhNjAwNDM1NjEwMmU4NTY1YjAwNWIzNDE1NjEwMGRmNTc2MDAwODBmZDViNjEwMGJhNjAwNDM1NjEwM2EzNTY1YjAwNWIzNDE1NjEwMGY3NTc2MDAwODBmZDViNjEwMTBiNjAwMTYwYTA2MDAyMGEwMzYwMDQzNTE2NjEwNDhmNTY1YjYwNDA1MTkwODE1MjYwMjAwMTYwNDA1MTgwOTEwMzkwZjM1YjM0MTU2MTAxMjg1NzYwMDA4MGZkNWI2MTAxMGI2MDA0ODAzNTYwMDE2MGEwNjAwMjBhMDMxNjkwNjAyNDgwMzU5MTkwNjA2NDkwNjA0NDM1OTA4MTAxOTA4MzAxMzU4MDYwMjA2MDFmODIwMTgxOTAwNDgxMDIwMTYwNDA1MTkwODEwMTYwNDA1MjgxODE1MjkyOTE5MDYwMjA4NDAxODM4MzgwODI4NDM3NTA5NDk2NTA1MDYwZmY4NTM1ODExNjk1NjAyMDAxMzUxNjkzNTA2MTA0YWU5MjUwNTA1MDU2NWI2MDQwNTE5MDgxNTI2MDIwMDE2MDQwNTE4MDkxMDM5MGYzNWIzNDE1NjEwMWFiNTc2MDAwODBmZDViNjEwMWIzNjEwNjk1NTY1YjYwNDA1MTYwMDE2MGEwNjAwMjBhMDM5MDkxMTY4MTUyNjAyMDAxNjA0MDUxODA5MTAzOTBmMzViMzQxNTYxMDFkYTU3NjAwMDgwZmQ1YjYxMDEwYjYwMDE2MGEwNjAwMjBhMDM2MDA0MzUxNjYxMDZhNTU2NWI2MDQwNTE5MDgxNTI2MDIwMDE2MDQwNTE4MDkxMDM5MGYzNWIzNDE1NjEwMjBiNTc2MDAwODBmZDViNjEwMjEzNjEwNmM0NTY1YjYwNDA1MTYwZmY4NzE2ODE1MjYwMjA4MTAxODY2MDAzODExMTE1NjEwMjJjNTdmZTViNjBmZjkwODExNjgyNTI2MDIwODIwMTk2OTA5NjUyOTM4NTE2NjA0MDgwODYwMTkxOTA5MTUyOTI4NTE2NjA2MDg1MDE1MjUwOTA5MjE2NjA4MDgyMDE1MjYwYTAwMTkyNTA5MDUwNTE4MDkxMDM5MGYzNWIzNDE1NjEwMjcxNTc2MDAwODBmZDViNjEwMjdjNjAwNDM1NjEwNzExNTY1YjYwNDA1MTYwMDE2MGEwNjAwMjBhMDM5MjgzMTY4MTUyOTExNjYwMjA4MjAxNTI2MDQwOTA4MTAxOTA1MTgwOTEwMzkwZjM1YjYwMDA1NDMzNjAwMTYwYTA2MDAyMGEwMzkwODExNjkxMTYxNDYxMDJiYjU3NjAwMDgwZmQ1YjYwMDA4MDU0NzNmZmZmZmZmZmZmZmZmZmZmZmZmZmZmZmZmZmZmZmZmZmZmZmZmZmZmMTkxNjYwMDE2MGEwNjAwMjBhMDM4MzE2MTc5MDU1NWI1YjUwNTY1YjYwMDE2MGEwNjAwMjBhMDMzMzE2NjAwMDkwODE1MjYwMDQ2MDIwNTI2MDQwODEyMDU0MTExNTYxMDMwYzU3NjAwMDgwZmQ1YjYwMDE2MGEwNjAwMjBhMDMzMzE2NjAwMDkwODE1MjYwMDQ2MDIwNTI2MDQwOTAyMDgxOTA1NTYwMDY4MDU0NjBmZjYxMDEwMDgwODMwNDgyMTY2MDAxOTA4MTAxODMxNjgyMDI2MWZmMDAxOTkwOTQxNjkzOTA5MzE3OTM4NDkwNTU5MDkyMDQ5MDkxMTYxMTgwMTU2MTAzNmM1NzUwNjAwNjU0NjEwMTAwODEwNDYwZmY5MDgxMTY5MTE2MTQ1YjE1NjEwMmU0NTc2MDAwODA1NDYwMDE5MTkwNzVmZjAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDE5MTY2MGE4NjAwMjBhODM1YjAyMTc5MDU1NTA1YjViNTA1NjViNjAwMTYwYTA2MDAyMGEwMzMzMTY2MDAwOTA4MTUyNjAwNTYwMjA1MjYwNDA4MTIwNTQxMTE1NjEwM2M3NTc2MDAwODBmZDViNjAwMTYwYTA2MDAyMGEwMzMzMTY2MDAwOTA4MTUyNjAwNTYwMjA1MjYwNDA5MDIwODE5MDU1NjAwNjgwNTQ2MDAxNjBmZjYyMDEwMDAwODA4NDA0ODIxNjgzMDE4MjE2MDI2MmZmMDAwMDE5OTA5MzE2OTI5MDkyMTc5MjgzOTA1NTkxMTYxMTE1NjEwMmU0NTc2MDA2NTQ2MjAxMDAwMDgxMDQ2MGZmOTA4MTE2OTExNjE0MTU2MTA0NTg1NzYwMDA4MDU0NjAwMzkxOTA3NWZmMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMTkxNjYwYTg2MDAyMGE4MzViMDIxNzkwNTU1MDYxMDJlNDU2NWI2MDAwODA1NDYwMDI5MTkwNzVmZjAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDE5MTY2MGE4NjAwMjBhODM2MTAzOTk1NjViMDIxNzkwNTU1MDViNWI1YjUwNTY1YjYwMDE2MGEwNjAwMjBhMDM4MTE2NjAwMDkwODE1MjYwMDU2MDIwNTI2MDQwOTAyMDU0NWI5MTkwNTA1NjViNjAwMDgwNTQ4MTkwMzM2MDAxNjBhMDYwMDIwYTAzOTA4MTE2OTExNjE0NjEwNGNjNTc2MDAwODBmZDViNjAwNjgwNTQ2MGZmMTk4MTE2NjAwMTYwZmY5MjgzMTY5MDgxMDE5MDkyMTYxNzkxODI5MDU1OTI1MDgyOTA4NzkwODc5MDg3OTA4NzkwNjMwMTAwMDAwMDkwMDQ2MDAxNjBhMDYwMDIwYTAzMTY2MTA1MGI2MTA3NDM1NjViODY4MTUyNjAyMDgxMDE4NjkwNTI2MGZmODA4NTE2NjA2MDgzMDE1MjgzMTY2MDgwODIwMTUyNjAwMTYwYTA2MDAyMGEwMzgyMTY2MGEwODIwMTUyNjBjMDYwNDA4MjAxODE4MTUyOTA4MjAxODY4MTgxNTE4MTUyNjAyMDAxOTE1MDgwNTE5MDYwMjAwMTkwODA4MzgzNjAwMDViODM4MTEwMTU2MTA1NzI1NzgwODIwMTUxODE4NDAxNTI1YjYwMjAwMTYxMDU1OTU2NWI1MDUwNTA1MDkwNTA5MDgxMDE5MDYwMWYxNjgwMTU2MTA1OWY1NzgwODIwMzgwNTE2MDAxODM2MDIwMDM2MTAxMDAwYTAzMTkxNjgxNTI2MDIwMDE5MTUwNWI1MDk3NTA1MDUwNTA1MDUwNTA1MDYwNDA1MTgwOTEwMzkwNjAwMGYwODAxNTE1NjEwNWJmNTc2MDAwODBmZDViNjAwMTYwYTA2MDAyMGEwMzgwODkxNjYwMDA4MTgxNTI2MDAyNjAyMDkwODE1MjYwNDA4MDgzMjA4MDU0OTU4NzE2NzNmZmZmZmZmZmZmZmZmZmZmZmZmZmZmZmZmZmZmZmZmZmZmZmZmZmZmMTk5Njg3MTY4MTE3OTA5MTU1ODg4NDUyNjAwMzkwOTI1MjkxODI5MDIwODA1NDkwOTQxNjkwOTIxNzkwOTI1NTkxOTI1MDYzMTNhZjQwMzU5MDMzOTA1MTdjMDEwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDYzZmZmZmZmZmY4NDE2MDI4MTUyNjAwMTYwYTA2MDAyMGEwMzkwOTExNjYwMDQ4MjAxNTI2MDI0MDE2MDAwNjA0MDUxODA4MzAzODE2MDAwODc4MDNiMTUxNTYxMDY3NTU3NjAwMDgwZmQ1YjYxMDJjNjVhMDNmMTE1MTU2MTA2ODY1NzYwMDA4MGZkNWI1MDUwNTA1YjViNTA5NTk0NTA1MDUwNTA1MDU2NWI2MDAwNTQ2MDAxNjBhMDYwMDIwYTAzMTY1YjkwNTY1YjYwMDE2MGEwNjAwMjBhMDM4MTE2NjAwMDkwODE1MjYwMDQ2MDIwNTI2MDQwOTAyMDU0NWI5MTkwNTA1NjViNjAwMDU0NjAwMTU0NjAwNjU0NjBmZjc0MDEwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwODQwNDgxMTY5MzYwYTg2MDAyMGE5MDA0ODExNjkyOTE4MDgyMTY5MTYxMDEwMDgyMDQ4MTE2OTE2MjAxMDAwMDkwMDQxNjViOTA5MTkyOTM5NDk1NTY1YjYwMDA4MTgxNTI2MDAzNjAyMDkwODE1MjYwNDA4MDgzMjA1NDYwMDE2MGEwNjAwMjBhMDM5MDgxMTY4MDg1NTI2MDAyOTA5MzUyOTIyMDU0OTA5MTE2OTA1YjkxNTA5MTU2NWI2MDQwNTE2MTA1N2M4MDYxMDc1NDgzMzkwMTkwNTYwMDYwNjA2MDQwNTIzNDE1NjEwMDBmNTc2MDAwODBmZDViNjA0MDUxNjEwNTdjMzgwMzgwNjEwNTdjODMzOTgxMDE2MDQwNTI4MDgwNTE5MTkwNjAyMDAxODA1MTkxOTA2MDIwMDE4MDUxODIwMTkxOTA2MDIwMDE4MDUxOTE5MDYwMjAwMTgwNTE5MTkwNjAyMDAxODA1MTkxNTA1MDViNWI2MDAwODA1NDYwMDE2MGEwNjAwMjBhMDMxOTE2MzM2MDAxNjBhMDYwMDIwYTAzMTYxNzkwNTU1YjYwMDE4NjkwNTU2MDAyODU5MDU1NjAwMzg0ODA1MTYxMDA4ODkyOTE2MDIwMDE5MDYxMDExZjU2NWI1MDYwMDQ4MDU0NjBmZjg0ODExNjYxMDEwMDAyNjFmZjAwMTk5MTg3MTY2MGZmMTk5MDkzMTY5MjkwOTIxNzE2MTc5MDU1NjEwMGMxODE2NDAxMDAwMDAwMDA2MTAyMjc2MTAwY2Q4MjAyMTcwNDU2NWI1YjUwNTA1MDUwNTA1MDYxMDFiZjU2NWI2MDAwNTQzMzYwMDE2MGEwNjAwMjBhMDM5MDgxMTY5MTE2MTQ2MTAwZTg1NzYwMDA4MGZkNWI2MDA1ODA1NDYwMDA5MDgxNTI2MDA2NjAyMDUyNjA0MDkwMjA4MDU0NjAwMTYwYTA2MDAyMGEwMzE5MTY2MDAxNjBhMDYwMDIwYTAzODQxNjE3OTA1NTgwNTQ2MDAxMDE5MDU1NWI1YjUwNTY1YjgyODA1NDYwMDE4MTYwMDExNjE1NjEwMTAwMDIwMzE2NjAwMjkwMDQ5MDYwMDA1MjYwMjA2MDAwMjA5MDYwMWYwMTYwMjA5MDA0ODEwMTkyODI2MDFmMTA2MTAxNjA1NzgwNTE2MGZmMTkxNjgzODAwMTE3ODU1NTYxMDE4ZDU2NWI4MjgwMDE2MDAxMDE4NTU1ODIxNTYxMDE4ZDU3OTE4MjAxNWI4MjgxMTExNTYxMDE4ZDU3ODI1MTgyNTU5MTYwMjAwMTkxOTA2MDAxMDE5MDYxMDE3MjU2NWI1YjUwNjEwMTlhOTI5MTUwNjEwMTllNTY1YjUwOTA1NjViNjEwMWJjOTE5MDViODA4MjExMTU2MTAxOWE1NzYwMDA4MTU1NjAwMTAxNjEwMWE0NTY1YjUwOTA1NjViOTA1NjViNjEwM2FlODA2MTAxY2U2MDAwMzk2MDAwZjMwMDYwNjA2MDQwNTI2M2ZmZmZmZmZmN2MwMTAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwNjAwMDM1MDQxNjYzMTNhZjQwMzU4MTE0NjEwMDY5NTc4MDYzNTE2NDBmZWUxNDYxMDA4YTU3ODA2MzdjNmViZGU5MTQ2MTAwYmM1NzgwNjM4OTNkMjBlODE0NjEwMGRkNTc4MDYzZWMxODkzYjQxNDYxMDEwYzU3NWI2MDAwODBmZDViMzQxNTYxMDA3NDU3NjAwMDgwZmQ1YjYxMDA4ODYwMDE2MGEwNjAwMjBhMDM2MDA0MzUxNjYxMDFjMTU2NWIwMDViMzQxNTYxMDA5NTU3NjAwMDgwZmQ1YjYxMDBhMDYwMDQzNTYxMDIwOTU2NWI2MDQwNTE2MDAxNjBhMDYwMDIwYTAzOTA5MTE2ODE1MjYwMjAwMTYwNDA1MTgwOTEwMzkwZjM1YjM0MTU2MTAwYzc1NzYwMDA4MGZkNWI2MTAwODg2MDAxNjBhMDYwMDIwYTAzNjAwNDM1MTY2MTAyMjc1NjViMDA1YjM0MTU2MTAwZTg1NzYwMDA4MGZkNWI2MTAwYTA2MTAyODY1NjViNjA0MDUxNjAwMTYwYTA2MDAyMGEwMzkwOTExNjgxNTI2MDIwMDE2MDQwNTE4MDkxMDM5MGYzNWIzNDE1NjEwMTE3NTc2MDAwODBmZDViNjEwMTFmNjEwMjk2NTY1YjYwNDA1MTg2ODE1MjYwMjA4MTAxODY5MDUyNjBmZjgwODUxNjYwNjA4MzAxNTI4MzE2NjA4MDgyMDE1MjYwYTA4MTAxODI5MDUyNjBjMDYwNDA4MjAxODE4MTUyOTA4MjAxODY4MTgxNTE4MTUyNjAyMDAxOTE1MDgwNTE5MDYwMjAwMTkwODA4MzgzNjAwMDViODM4MTEwMTU2MTAxODE1NzgwODIwMTUxODE4NDAxNTI1YjYwMjAwMTYxMDE2ODU2NWI1MDUwNTA1MDkwNTA5MDgxMDE5MDYwMWYxNjgwMTU2MTAxYWU1NzgwODIwMzgwNTE2MDAxODM2MDIwMDM2MTAxMDAwYTAzMTkxNjgxNTI2MDIwMDE5MTUwNWI1MDk3NTA1MDUwNTA1MDUwNTA1MDYwNDA1MTgwOTEwMzkwZjM1YjYwMDA1NDMzNjAwMTYwYTA2MDAyMGEwMzkwODExNjkxMTYxNDYxMDFkYzU3NjAwMDgwZmQ1YjYwMDA4MDU0NzNmZmZmZmZmZmZmZmZmZmZmZmZmZmZmZmZmZmZmZmZmZmZmZmZmZmZmMTkxNjYwMDE2MGEwNjAwMjBhMDM4MzE2MTc5MDU1NWI1YjUwNTY1YjYwMDA4MTgxNTI2MDA2NjAyMDUyNjA0MDkwMjA1NDYwMDE2MGEwNjAwMjBhMDMxNjViOTE5MDUwNTY1YjYwMDA1NDMzNjAwMTYwYTA2MDAyMGEwMzkwODExNjkxMTYxNDYxMDI0MjU3NjAwMDgwZmQ1YjYwMDU4MDU0NjAwMDkwODE1MjYwMDY2MDIwNTI2MDQwOTAyMDgwNTQ3M2ZmZmZmZmZmZmZmZmZmZmZmZmZmZmZmZmZmZmZmZmZmZmZmZmZmZmYxOTE2NjAwMTYwYTA2MDAyMGEwMzg0MTYxNzkwNTU4MDU0NjAwMTAxOTA1NTViNWI1MDU2NWI2MDAwNTQ2MDAxNjBhMDYwMDIwYTAzMTY1YjkwNTY1YjYwMDA4MDYxMDJhMTYxMDM3MDU2NWI2MDAwODA2MDAwNjAwMTU0OTU1MDYwMDI1NDk0NTA2MDAzODA1NDYwMDE4MTYwMDExNjE1NjEwMTAwMDIwMzE2NjAwMjkwMDQ4MDYwMWYwMTYwMjA4MDkxMDQwMjYwMjAwMTYwNDA1MTkwODEwMTYwNDA1MjgwOTI5MTkwODE4MTUyNjAyMDAxODI4MDU0NjAwMTgxNjAwMTE2MTU2MTAxMDAwMjAzMTY2MDAyOTAwNDgwMTU2MTAzNDY1NzgwNjAxZjEwNjEwMzFiNTc2MTAxMDA4MDgzNTQwNDAyODM1MjkxNjAyMDAxOTE2MTAzNDY1NjViODIwMTkxOTA2MDAwNTI2MDIwNjAwMDIwOTA1YjgxNTQ4MTUyOTA2MDAxMDE5MDYwMjAwMTgwODMxMTYxMDMyOTU3ODI5MDAzNjAxZjE2ODIwMTkxNWI1MDUwNjAwNDU0NjAwNTU0OTQ5ODUwNjBmZjgwODIxNjk4NTA2MTAxMDA5MDkxMDQxNjk1NTA5MjkzNTA1MDUwNTA1YjkwOTE5MjkzOTQ5NTU2NWI2MDIwNjA0MDUxOTA4MTAxNjA0MDUyNjAwMDgxNTI5MDU2MDBhMTY1NjI3YTdhNzIzMDU4MjA5MzcwOWI0ZTM1NTI1NjhlNTNhNWFmYjRhMWJjYzc4MGRlMzZlNTIxYzYyZDk2ZTZjNDhiNzE2Y2FlNTIwZmQwMDAyOWExNjU2MjdhN2E3MjMwNTgyMDAwMjBkN2M3ZDMyNTZlOTc4NTE5MjEyOTA5YzdmN2FkYjliNWE4YTRiODY3MDBkMTM4YWU0N2IyYzYwZDc1NzAwMDI5IiwKICAibmV0d29ya3MiOiB7CiAgICAiMSI6IHsKICAgICAgImV2ZW50cyI6IHt9LAogICAgICAibGlua3MiOiB7fSwKICAgICAgImFkZHJlc3MiOiAiMHgxZDE0ZjkzMDI3NTQzOWNkZWRkNTJkMWU1N2YzZGY0NjMzZTZiNTMyIiwKICAgICAgInVwZGF0ZWRfYXQiOiAxNTEzNzAwOTgzMzQxCiAgICB9CiAgfSwKICAic2NoZW1hX3ZlcnNpb24iOiAiMC4wLjUiLAogICJ1cGRhdGVkX2F0IjogMTUxMzcwMDk4MzM0MQp9";

try {
  web3.personal.unlockAccount($$$account$$$, $$$password$$$);

  var certificateJson = atob(certificateJsonB64);
  var certificateProto = JSON.parse(certificateJson);
  var certificateProxy = web3.eth.contract(certificateProto.abi);
  var contract = certificateProxy.at($$$address$$$);

  var transactionHash = contract.sign(new Date().getTime().toString(), {from:$$$account$$$, gas: 2000000});

  web3.personal.lockAccount($$$account$$$);
  console.log(transactionHash);
}
catch(e) {
  console.log("EXCEPTION:");
  console.log(e);
};
