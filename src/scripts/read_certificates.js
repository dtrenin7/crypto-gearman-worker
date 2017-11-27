
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
////////////////////////////////////////// BASE64
/**
*
*  Base64 encode / decode
*  http://www.webtoolkit.info
*
**/
var Base64 = {

    // private property
    _keyStr: "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/="

    // public method for encoding
    , encode: function (input)
    {
        var output = "";
        var chr1, chr2, chr3, enc1, enc2, enc3, enc4;
        var i = 0;

        input = Base64._utf8_encode(input);

        while (i < input.length)
        {
            chr1 = input.charCodeAt(i++);
            chr2 = input.charCodeAt(i++);
            chr3 = input.charCodeAt(i++);

            enc1 = chr1 >> 2;
            enc2 = ((chr1 & 3) << 4) | (chr2 >> 4);
            enc3 = ((chr2 & 15) << 2) | (chr3 >> 6);
            enc4 = chr3 & 63;

            if (isNaN(chr2))
            {
                enc3 = enc4 = 64;
            }
            else if (isNaN(chr3))
            {
                enc4 = 64;
            }

            output = output +
                this._keyStr.charAt(enc1) + this._keyStr.charAt(enc2) +
                this._keyStr.charAt(enc3) + this._keyStr.charAt(enc4);
        } // Whend

        return output;
    } // End Function encode


    // public method for decoding
    ,decode: function (input)
    {
        var output = "";
        var chr1, chr2, chr3;
        var enc1, enc2, enc3, enc4;
        var i = 0;

        input = input.replace(/[^A-Za-z0-9\+\/\=]/g, "");
        while (i < input.length)
        {
            enc1 = this._keyStr.indexOf(input.charAt(i++));
            enc2 = this._keyStr.indexOf(input.charAt(i++));
            enc3 = this._keyStr.indexOf(input.charAt(i++));
            enc4 = this._keyStr.indexOf(input.charAt(i++));

            chr1 = (enc1 << 2) | (enc2 >> 4);
            chr2 = ((enc2 & 15) << 4) | (enc3 >> 2);
            chr3 = ((enc3 & 3) << 6) | enc4;

            output = output + String.fromCharCode(chr1);

            if (enc3 != 64)
            {
                output = output + String.fromCharCode(chr2);
            }

            if (enc4 != 64)
            {
                output = output + String.fromCharCode(chr3);
            }

        } // Whend

        output = Base64._utf8_decode(output);

        return output;
    } // End Function decode


    // private method for UTF-8 encoding
    ,_utf8_encode: function (string)
    {
        var utftext = "";
        string = string.replace(/\r\n/g, "\n");

        for (var n = 0; n < string.length; n++)
        {
            var c = string.charCodeAt(n);

            if (c < 128)
            {
                utftext += String.fromCharCode(c);
            }
            else if ((c > 127) && (c < 2048))
            {
                utftext += String.fromCharCode((c >> 6) | 192);
                utftext += String.fromCharCode((c & 63) | 128);
            }
            else
            {
                utftext += String.fromCharCode((c >> 12) | 224);
                utftext += String.fromCharCode(((c >> 6) & 63) | 128);
                utftext += String.fromCharCode((c & 63) | 128);
            }

        } // Next n

        return utftext;
    } // End Function _utf8_encode

    // private method for UTF-8 decoding
    ,_utf8_decode: function (utftext)
    {
        var string = "";
        var i = 0;
        var c, c1, c2, c3;
        c = c1 = c2 = 0;

        while (i < utftext.length)
        {
            c = utftext.charCodeAt(i);

            if (c < 128)
            {
                string += String.fromCharCode(c);
                i++;
            }
            else if ((c > 191) && (c < 224))
            {
                c2 = utftext.charCodeAt(i + 1);
                string += String.fromCharCode(((c & 31) << 6) | (c2 & 63));
                i += 2;
            }
            else
            {
                c2 = utftext.charCodeAt(i + 1);
                c3 = utftext.charCodeAt(i + 2);
                string += String.fromCharCode(((c & 15) << 12) | ((c2 & 63) << 6) | (c3 & 63));
                i += 3;
            }

        } // Whend

        return string;
    } // End Function _utf8_decode

}
///////////////////////////////////////// BASE64

var certificateJsonB64 = "ewogICJjb250cmFjdF9uYW1lIjogIkNlcnRpZmljYXRlIiwKICAiYWJpIjogWwogICAgewogICAgICAiY29uc3RhbnQiOiBmYWxzZSwKICAgICAgImlucHV0cyI6IFsKICAgICAgICB7CiAgICAgICAgICAibmFtZSI6ICJfb3duZXIiLAogICAgICAgICAgInR5cGUiOiAiYWRkcmVzcyIKICAgICAgICB9CiAgICAgIF0sCiAgICAgICJuYW1lIjogInNldE93bmVyIiwKICAgICAgIm91dHB1dHMiOiBbXSwKICAgICAgInBheWFibGUiOiBmYWxzZSwKICAgICAgInR5cGUiOiAiZnVuY3Rpb24iCiAgICB9LAogICAgewogICAgICAiY29uc3RhbnQiOiBmYWxzZSwKICAgICAgImlucHV0cyI6IFsKICAgICAgICB7CiAgICAgICAgICAibmFtZSI6ICJfZGF0ZSIsCiAgICAgICAgICAidHlwZSI6ICJ1aW50MjU2IgogICAgICAgIH0KICAgICAgXSwKICAgICAgIm5hbWUiOiAic2lnbiIsCiAgICAgICJvdXRwdXRzIjogW10sCiAgICAgICJwYXlhYmxlIjogZmFsc2UsCiAgICAgICJ0eXBlIjogImZ1bmN0aW9uIgogICAgfSwKICAgIHsKICAgICAgImNvbnN0YW50IjogZmFsc2UsCiAgICAgICJpbnB1dHMiOiBbCiAgICAgICAgewogICAgICAgICAgIm5hbWUiOiAiX2RhdGUiLAogICAgICAgICAgInR5cGUiOiAidWludDI1NiIKICAgICAgICB9CiAgICAgIF0sCiAgICAgICJuYW1lIjogImNhbmNlbCIsCiAgICAgICJvdXRwdXRzIjogW10sCiAgICAgICJwYXlhYmxlIjogZmFsc2UsCiAgICAgICJ0eXBlIjogImZ1bmN0aW9uIgogICAgfSwKICAgIHsKICAgICAgImNvbnN0YW50IjogdHJ1ZSwKICAgICAgImlucHV0cyI6IFsKICAgICAgICB7CiAgICAgICAgICAibmFtZSI6ICJfc3ViamVjdCIsCiAgICAgICAgICAidHlwZSI6ICJhZGRyZXNzIgogICAgICAgIH0KICAgICAgXSwKICAgICAgIm5hbWUiOiAiZ2V0Q2FuY2VsYXRpb24iLAogICAgICAib3V0cHV0cyI6IFsKICAgICAgICB7CiAgICAgICAgICAibmFtZSI6ICJfZGF0ZSIsCiAgICAgICAgICAidHlwZSI6ICJ1aW50MjU2IgogICAgICAgIH0KICAgICAgXSwKICAgICAgInBheWFibGUiOiBmYWxzZSwKICAgICAgInR5cGUiOiAiZnVuY3Rpb24iCiAgICB9LAogICAgewogICAgICAiY29uc3RhbnQiOiBmYWxzZSwKICAgICAgImlucHV0cyI6IFsKICAgICAgICB7CiAgICAgICAgICAibmFtZSI6ICJhY2NvdW50IiwKICAgICAgICAgICJ0eXBlIjogImFkZHJlc3MiCiAgICAgICAgfSwKICAgICAgICB7CiAgICAgICAgICAibmFtZSI6ICJfYmlydGhkYXRlIiwKICAgICAgICAgICJ0eXBlIjogInVpbnQyNTYiCiAgICAgICAgfSwKICAgICAgICB7CiAgICAgICAgICAibmFtZSI6ICJfbmFtZSIsCiAgICAgICAgICAidHlwZSI6ICJzdHJpbmciCiAgICAgICAgfSwKICAgICAgICB7CiAgICAgICAgICAibmFtZSI6ICJfZ2VuZGVyIiwKICAgICAgICAgICJ0eXBlIjogInVpbnQ4IgogICAgICAgIH0sCiAgICAgICAgewogICAgICAgICAgIm5hbWUiOiAiX29yaWdpbiIsCiAgICAgICAgICAidHlwZSI6ICJ1aW50OCIKICAgICAgICB9CiAgICAgIF0sCiAgICAgICJuYW1lIjogImFkZFN1YmplY3QiLAogICAgICAib3V0cHV0cyI6IFsKICAgICAgICB7CiAgICAgICAgICAibmFtZSI6ICJJRCIsCiAgICAgICAgICAidHlwZSI6ICJ1aW50MjU2IgogICAgICAgIH0KICAgICAgXSwKICAgICAgInBheWFibGUiOiBmYWxzZSwKICAgICAgInR5cGUiOiAiZnVuY3Rpb24iCiAgICB9LAogICAgewogICAgICAiY29uc3RhbnQiOiB0cnVlLAogICAgICAiaW5wdXRzIjogW10sCiAgICAgICJuYW1lIjogImdldE93bmVyIiwKICAgICAgIm91dHB1dHMiOiBbCiAgICAgICAgewogICAgICAgICAgIm5hbWUiOiAiX293bmVyIiwKICAgICAgICAgICJ0eXBlIjogImFkZHJlc3MiCiAgICAgICAgfQogICAgICBdLAogICAgICAicGF5YWJsZSI6IGZhbHNlLAogICAgICAidHlwZSI6ICJmdW5jdGlvbiIKICAgIH0sCiAgICB7CiAgICAgICJjb25zdGFudCI6IHRydWUsCiAgICAgICJpbnB1dHMiOiBbCiAgICAgICAgewogICAgICAgICAgIm5hbWUiOiAiX3N1YmplY3QiLAogICAgICAgICAgInR5cGUiOiAiYWRkcmVzcyIKICAgICAgICB9CiAgICAgIF0sCiAgICAgICJuYW1lIjogImdldFNpZ24iLAogICAgICAib3V0cHV0cyI6IFsKICAgICAgICB7CiAgICAgICAgICAibmFtZSI6ICJfZGF0ZSIsCiAgICAgICAgICAidHlwZSI6ICJ1aW50MjU2IgogICAgICAgIH0KICAgICAgXSwKICAgICAgInBheWFibGUiOiBmYWxzZSwKICAgICAgInR5cGUiOiAiZnVuY3Rpb24iCiAgICB9LAogICAgewogICAgICAiY29uc3RhbnQiOiB0cnVlLAogICAgICAiaW5wdXRzIjogW10sCiAgICAgICJuYW1lIjogImdldFByb3BzIiwKICAgICAgIm91dHB1dHMiOiBbCiAgICAgICAgewogICAgICAgICAgIm5hbWUiOiAiX3R5cGUiLAogICAgICAgICAgInR5cGUiOiAidWludDgiCiAgICAgICAgfSwKICAgICAgICB7CiAgICAgICAgICAibmFtZSI6ICJfc3RhdGUiLAogICAgICAgICAgInR5cGUiOiAidWludDgiCiAgICAgICAgfSwKICAgICAgICB7CiAgICAgICAgICAibmFtZSI6ICJfZGF0ZSIsCiAgICAgICAgICAidHlwZSI6ICJ1aW50MjU2IgogICAgICAgIH0sCiAgICAgICAgewogICAgICAgICAgIm5hbWUiOiAiX251bVN1YmplY3RzIiwKICAgICAgICAgICJ0eXBlIjogInVpbnQ4IgogICAgICAgIH0sCiAgICAgICAgewogICAgICAgICAgIm5hbWUiOiAiX251bVNpZ25zIiwKICAgICAgICAgICJ0eXBlIjogInVpbnQ4IgogICAgICAgIH0sCiAgICAgICAgewogICAgICAgICAgIm5hbWUiOiAiX251bUNhbmNlbGF0aW9ucyIsCiAgICAgICAgICAidHlwZSI6ICJ1aW50OCIKICAgICAgICB9CiAgICAgIF0sCiAgICAgICJwYXlhYmxlIjogZmFsc2UsCiAgICAgICJ0eXBlIjogImZ1bmN0aW9uIgogICAgfSwKICAgIHsKICAgICAgImNvbnN0YW50IjogdHJ1ZSwKICAgICAgImlucHV0cyI6IFsKICAgICAgICB7CiAgICAgICAgICAibmFtZSI6ICJJRCIsCiAgICAgICAgICAidHlwZSI6ICJ1aW50MjU2IgogICAgICAgIH0KICAgICAgXSwKICAgICAgIm5hbWUiOiAiZ2V0U3ViamVjdCIsCiAgICAgICJvdXRwdXRzIjogWwogICAgICAgIHsKICAgICAgICAgICJuYW1lIjogIl9zdWJqZWN0IiwKICAgICAgICAgICJ0eXBlIjogImFkZHJlc3MiCiAgICAgICAgfSwKICAgICAgICB7CiAgICAgICAgICAibmFtZSI6ICJfYWNjb3VudCIsCiAgICAgICAgICAidHlwZSI6ICJhZGRyZXNzIgogICAgICAgIH0KICAgICAgXSwKICAgICAgInBheWFibGUiOiBmYWxzZSwKICAgICAgInR5cGUiOiAiZnVuY3Rpb24iCiAgICB9LAogICAgewogICAgICAiaW5wdXRzIjogWwogICAgICAgIHsKICAgICAgICAgICJuYW1lIjogIl90eXBlIiwKICAgICAgICAgICJ0eXBlIjogInVpbnQ4IgogICAgICAgIH0sCiAgICAgICAgewogICAgICAgICAgIm5hbWUiOiAiX2RhdGUiLAogICAgICAgICAgInR5cGUiOiAidWludDI1NiIKICAgICAgICB9CiAgICAgIF0sCiAgICAgICJwYXlhYmxlIjogZmFsc2UsCiAgICAgICJ0eXBlIjogImNvbnN0cnVjdG9yIgogICAgfQogIF0sCiAgInVubGlua2VkX2JpbmFyeSI6ICIweDYwNjA2MDQwNTIzNDE1NjEwMDBmNTc2MDAwODBmZDViNjA0MDUxNjA0MDgwNjEwYWUxODMzOTgxMDE2MDQwNTI4MDgwNTE5MTkwNjAyMDAxODA1MTkxNTA1MDViNWI2MDAwODA1NDYwMDE2MGEwNjAwMjBhMDMxOTE2MzM2MDAxNjBhMDYwMDIwYTAzMTYxNzkwNTU1YjYwMDA4MDU0NjBhMDYwMDIwYTYwZmYwMjE5MTY3NDAxMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDYwZmY4NTE2MDIxNzgwODI1NTgxOTA2MGE4NjAwMjBhNjBmZjAyMTkxNjc1MDEwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDA4MjViMDIxNzkwNTU1MDYwMDE4MTkwNTU2MDA2ODA1NDYyZmZmZmZmMTkxNjkwNTU1YjUwNTA1YjYxMGExYzgwNjEwMGM1NjAwMDM5NjAwMGYzMDA2MDYwNjA0MDUyMzYxNTYxMDA5NjU3NjNmZmZmZmZmZjdjMDEwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDYwMDAzNTA0MTY2MzEzYWY0MDM1ODExNDYxMDA5YjU3ODA2MzJmYjFiMjVmMTQ2MTAwYmM1NzgwNjM0MGU1OGVlNTE0NjEwMGQ0NTc4MDYzNGIxMzllNzExNDYxMDBlYzU3ODA2Mzc4YTA4NGY5MTQ2MTAxMWQ1NzgwNjM4OTNkMjBlODE0NjEwMWEwNTc4MDYzZDE4NjU4ZjAxNDYxMDFjZjU3ODA2M2VjMTg5M2I0MTQ2MTAyMDA1NzgwNjNmNmRkMDE4NzE0NjEwMjY2NTc1YjYwMDA4MGZkNWIzNDE1NjEwMGE2NTc2MDAwODBmZDViNjEwMGJhNjAwMTYwYTA2MDAyMGEwMzYwMDQzNTE2NjEwMmEwNTY1YjAwNWIzNDE1NjEwMGM3NTc2MDAwODBmZDViNjEwMGJhNjAwNDM1NjEwMmU4NTY1YjAwNWIzNDE1NjEwMGRmNTc2MDAwODBmZDViNjEwMGJhNjAwNDM1NjEwM2EzNTY1YjAwNWIzNDE1NjEwMGY3NTc2MDAwODBmZDViNjEwMTBiNjAwMTYwYTA2MDAyMGEwMzYwMDQzNTE2NjEwNDhmNTY1YjYwNDA1MTkwODE1MjYwMjAwMTYwNDA1MTgwOTEwMzkwZjM1YjM0MTU2MTAxMjg1NzYwMDA4MGZkNWI2MTAxMGI2MDA0ODAzNTYwMDE2MGEwNjAwMjBhMDMxNjkwNjAyNDgwMzU5MTkwNjA2NDkwNjA0NDM1OTA4MTAxOTA4MzAxMzU4MDYwMjA2MDFmODIwMTgxOTAwNDgxMDIwMTYwNDA1MTkwODEwMTYwNDA1MjgxODE1MjkyOTE5MDYwMjA4NDAxODM4MzgwODI4NDM3NTA5NDk2NTA1MDYwZmY4NTM1ODExNjk1NjAyMDAxMzUxNjkzNTA2MTA0YWU5MjUwNTA1MDU2NWI2MDQwNTE5MDgxNTI2MDIwMDE2MDQwNTE4MDkxMDM5MGYzNWIzNDE1NjEwMWFiNTc2MDAwODBmZDViNjEwMWIzNjEwNWY2NTY1YjYwNDA1MTYwMDE2MGEwNjAwMjBhMDM5MDkxMTY4MTUyNjAyMDAxNjA0MDUxODA5MTAzOTBmMzViMzQxNTYxMDFkYTU3NjAwMDgwZmQ1YjYxMDEwYjYwMDE2MGEwNjAwMjBhMDM2MDA0MzUxNjYxMDYwNjU2NWI2MDQwNTE5MDgxNTI2MDIwMDE2MDQwNTE4MDkxMDM5MGYzNWIzNDE1NjEwMjBiNTc2MDAwODBmZDViNjEwMjEzNjEwNjI1NTY1YjYwNDA1MTYwZmY4NzE2ODE1MjYwMjA4MTAxODY2MDAzODExMTE1NjEwMjJjNTdmZTViNjBmZjkwODExNjgyNTI2MDIwODIwMTk2OTA5NjUyOTM4NTE2NjA0MDgwODYwMTkxOTA5MTUyOTI4NTE2NjA2MDg1MDE1MjUwOTA5MjE2NjA4MDgyMDE1MjYwYTAwMTkyNTA5MDUwNTE4MDkxMDM5MGYzNWIzNDE1NjEwMjcxNTc2MDAwODBmZDViNjEwMjdjNjAwNDM1NjEwNjcyNTY1YjYwNDA1MTYwMDE2MGEwNjAwMjBhMDM5MjgzMTY4MTUyOTExNjYwMjA4MjAxNTI2MDQwOTA4MTAxOTA1MTgwOTEwMzkwZjM1YjYwMDA1NDMzNjAwMTYwYTA2MDAyMGEwMzkwODExNjkxMTYxNDYxMDJiYjU3NjAwMDgwZmQ1YjYwMDA4MDU0NzNmZmZmZmZmZmZmZmZmZmZmZmZmZmZmZmZmZmZmZmZmZmZmZmZmZmZmMTkxNjYwMDE2MGEwNjAwMjBhMDM4MzE2MTc5MDU1NWI1YjUwNTY1YjYwMDE2MGEwNjAwMjBhMDMzMzE2NjAwMDkwODE1MjYwMDQ2MDIwNTI2MDQwODEyMDU0MTExNTYxMDMwYzU3NjAwMDgwZmQ1YjYwMDE2MGEwNjAwMjBhMDMzMzE2NjAwMDkwODE1MjYwMDQ2MDIwNTI2MDQwOTAyMDgxOTA1NTYwMDY4MDU0NjBmZjYxMDEwMDgwODMwNDgyMTY2MDAxOTA4MTAxODMxNjgyMDI2MWZmMDAxOTkwOTQxNjkzOTA5MzE3OTM4NDkwNTU5MDkyMDQ5MDkxMTYxMTgwMTU2MTAzNmM1NzUwNjAwNjU0NjEwMTAwODEwNDYwZmY5MDgxMTY5MTE2MTQ1YjE1NjEwMmU0NTc2MDAwODA1NDYwMDE5MTkwNzVmZjAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDE5MTY2MGE4NjAwMjBhODM1YjAyMTc5MDU1NTA1YjViNTA1NjViNjAwMTYwYTA2MDAyMGEwMzMzMTY2MDAwOTA4MTUyNjAwNTYwMjA1MjYwNDA4MTIwNTQxMTE1NjEwM2M3NTc2MDAwODBmZDViNjAwMTYwYTA2MDAyMGEwMzMzMTY2MDAwOTA4MTUyNjAwNTYwMjA1MjYwNDA5MDIwODE5MDU1NjAwNjgwNTQ2MDAxNjBmZjYyMDEwMDAwODA4NDA0ODIxNjgzMDE4MjE2MDI2MmZmMDAwMDE5OTA5MzE2OTI5MDkyMTc5MjgzOTA1NTkxMTYxMTE1NjEwMmU0NTc2MDA2NTQ2MjAxMDAwMDgxMDQ2MGZmOTA4MTE2OTExNjE0MTU2MTA0NTg1NzYwMDA4MDU0NjAwMzkxOTA3NWZmMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMTkxNjYwYTg2MDAyMGE4MzViMDIxNzkwNTU1MDYxMDJlNDU2NWI2MDAwODA1NDYwMDI5MTkwNzVmZjAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDE5MTY2MGE4NjAwMjBhODM2MTAzOTk1NjViMDIxNzkwNTU1MDViNWI1YjUwNTY1YjYwMDE2MGEwNjAwMjBhMDM4MTE2NjAwMDkwODE1MjYwMDU2MDIwNTI2MDQwOTAyMDU0NWI5MTkwNTA1NjViNjAwMDgwNTQ4MTkwMzM2MDAxNjBhMDYwMDIwYTAzOTA4MTE2OTExNjE0NjEwNGNjNTc2MDAwODBmZDViNjAwNjgwNTQ2MGZmMTk4MTE2NjAwMTYwZmY5MjgzMTY5MDgxMDE5MDkyMTYxNzkwOTE1NTkxNTA4MTg2ODY4Njg2NjEwNGY1NjEwNmE0NTY1Yjg1ODE1MjYwMjA4MTAxODU5MDUyNjBmZjgwODQxNjYwNjA4MzAxNTI4MjE2NjA4MDgyMDE1MjYwYTA2MDQwODIwMTgxODE1MjkwODIwMTg1ODE4MTUxODE1MjYwMjAwMTkxNTA4MDUxOTA2MDIwMDE5MDgwODM4MzYwMDA1YjgzODExMDE1NjEwNTRkNTc4MDgyMDE1MTgxODQwMTUyNWI2MDIwMDE2MTA1MzQ1NjViNTA1MDUwNTA5MDUwOTA4MTAxOTA2MDFmMTY4MDE1NjEwNTdhNTc4MDgyMDM4MDUxNjAwMTgzNjAyMDAzNjEwMTAwMGEwMzE5MTY4MTUyNjAyMDAxOTE1MDViNTA5NjUwNTA1MDUwNTA1MDUwNjA0MDUxODA5MTAzOTA2MDAwZjA4MDE1MTU2MTA1OTk1NzYwMDA4MGZkNWI2MDAxNjBhMDYwMDIwYTAzODA4OTE2NjAwMDgxODE1MjYwMDI2MDIwOTA4MTUyNjA0MDgwODMyMDgwNTQ5NTg3MTY3M2ZmZmZmZmZmZmZmZmZmZmZmZmZmZmZmZmZmZmZmZmZmZmZmZmZmZmYxOTk2ODcxNjE3OTA1NTg3ODM1MjYwMDM5MDkxNTI5MDIwODA1NDkwOTIxNjE3OTA1NTkwNTA1YjViNTA5NTk0NTA1MDUwNTA1MDU2NWI2MDAwNTQ2MDAxNjBhMDYwMDIwYTAzMTY1YjkwNTY1YjYwMDE2MGEwNjAwMjBhMDM4MTE2NjAwMDkwODE1MjYwMDQ2MDIwNTI2MDQwOTAyMDU0NWI5MTkwNTA1NjViNjAwMDU0NjAwMTU0NjAwNjU0NjBmZjc0MDEwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwODQwNDgxMTY5MzYwYTg2MDAyMGE5MDA0ODExNjkyOTE4MDgyMTY5MTYxMDEwMDgyMDQ4MTE2OTE2MjAxMDAwMDkwMDQxNjViOTA5MTkyOTM5NDk1NTY1YjYwMDA4MTgxNTI2MDAzNjAyMDkwODE1MjYwNDA4MDgzMjA1NDYwMDE2MGEwNjAwMjBhMDM5MDgxMTY4MDg1NTI2MDAyOTA5MzUyOTIyMDU0OTA5MTE2OTA1YjkxNTA5MTU2NWI2MDQwNTE2MTAzM2M4MDYxMDZiNTgzMzkwMTkwNTYwMDYwNjA2MDQwNTIzNDE1NjEwMDBmNTc2MDAwODBmZDViNjA0MDUxNjEwMzNjMzgwMzgwNjEwMzNjODMzOTgxMDE2MDQwNTI4MDgwNTE5MTkwNjAyMDAxODA1MTkxOTA2MDIwMDE4MDUxODIwMTkxOTA2MDIwMDE4MDUxOTE5MDYwMjAwMTgwNTE5MTUwNTA1YjYwMDA4NTkwNTU2MDAxODQ5MDU1NjAwMjgzODA1MTYxMDA2NDkyOTE2MDIwMDE5MDYxMDA5MjU2NWI1MDYwMDM4MDU0NjBmZjgzODExNjYxMDEwMDAyNjFmZjAwMTk5MTg2MTY2MGZmMTk5MDkzMTY5MjkwOTIxNzE2MTc5MDU1NWI1MDUwNTA1MDUwNjEwMTMyNTY1YjgyODA1NDYwMDE4MTYwMDExNjE1NjEwMTAwMDIwMzE2NjAwMjkwMDQ5MDYwMDA1MjYwMjA2MDAwMjA5MDYwMWYwMTYwMjA5MDA0ODEwMTkyODI2MDFmMTA2MTAwZDM1NzgwNTE2MGZmMTkxNjgzODAwMTE3ODU1NTYxMDEwMDU2NWI4MjgwMDE2MDAxMDE4NTU1ODIxNTYxMDEwMDU3OTE4MjAxNWI4MjgxMTExNTYxMDEwMDU3ODI1MTgyNTU5MTYwMjAwMTkxOTA2MDAxMDE5MDYxMDBlNTU2NWI1YjUwNjEwMTBkOTI5MTUwNjEwMTExNTY1YjUwOTA1NjViNjEwMTJmOTE5MDViODA4MjExMTU2MTAxMGQ1NzYwMDA4MTU1NjAwMTAxNjEwMTE3NTY1YjUwOTA1NjViOTA1NjViNjEwMWZiODA2MTAxNDE2MDAwMzk2MDAwZjMwMDYwNjA2MDQwNTI2M2ZmZmZmZmZmN2MwMTAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwNjAwMDM1MDQxNjYzZWMxODkzYjQ4MTE0NjEwMDNkNTc1YjYwMDA4MGZkNWIzNDE1NjEwMDQ4NTc2MDAwODBmZDViNjEwMDUwNjEwMGVhNTY1YjYwNDA1MTg1ODE1MjYwMjA4MTAxODU5MDUyNjBmZjgwODQxNjYwNjA4MzAxNTI4MjE2NjA4MDgyMDE1MjYwYTA2MDQwODIwMTgxODE1MjkwODIwMTg1ODE4MTUxODE1MjYwMjAwMTkxNTA4MDUxOTA2MDIwMDE5MDgwODM4MzYwMDA1YjgzODExMDE1NjEwMGFiNTc4MDgyMDE1MTgxODQwMTUyNWI2MDIwMDE2MTAwOTI1NjViNTA1MDUwNTA5MDUwOTA4MTAxOTA2MDFmMTY4MDE1NjEwMGQ4NTc4MDgyMDM4MDUxNjAwMTgzNjAyMDAzNjEwMTAwMGEwMzE5MTY4MTUyNjAyMDAxOTE1MDViNTA5NjUwNTA1MDUwNTA1MDUwNjA0MDUxODA5MTAzOTBmMzViNjAwMDgwNjEwMGY1NjEwMWJkNTY1YjYwMDA4MDYwMDA1NDk0NTA2MDAxNTQ5MzUwNjAwMjgwNTQ2MDAxODE2MDAxMTYxNTYxMDEwMDAyMDMxNjYwMDI5MDA0ODA2MDFmMDE2MDIwODA5MTA0MDI2MDIwMDE2MDQwNTE5MDgxMDE2MDQwNTI4MDkyOTE5MDgxODE1MjYwMjAwMTgyODA1NDYwMDE4MTYwMDExNjE1NjEwMTAwMDIwMzE2NjAwMjkwMDQ4MDE1NjEwMTk4NTc4MDYwMWYxMDYxMDE2ZDU3NjEwMTAwODA4MzU0MDQwMjgzNTI5MTYwMjAwMTkxNjEwMTk4NTY1YjgyMDE5MTkwNjAwMDUyNjAyMDYwMDAyMDkwNWI4MTU0ODE1MjkwNjAwMTAxOTA2MDIwMDE4MDgzMTE2MTAxN2I1NzgyOTAwMzYwMWYxNjgyMDE5MTViNTA1MDYwMDM1NDkzOTY1MDUwNjBmZjgwODQxNjk1NTA2MTAxMDA5MDkzMDQ5MDkyMTY5MjUwNTA1MDViOTA5MTkyOTM5NDU2NWI2MDIwNjA0MDUxOTA4MTAxNjA0MDUyNjAwMDgxNTI5MDU2MDBhMTY1NjI3YTdhNzIzMDU4MjA0YjEyZTc3NzA1NWNkZTMxNjY0NzcxNDZjM2I4ZmNkODBiNzlkMWJiNTE4YmE5NWMwMzEyOGQ0YWQwNTc1NTEyMDAyOWExNjU2MjdhN2E3MjMwNTgyMDRlZWEzYzU3NjZmNTVlOTcwZDg4MjAxYTc1NTBiY2VjZTZlYTJkZGYyYTYzZDVkMmVkNjJmZGZlM2EyODZhYmQwMDI5IiwKICAibmV0d29ya3MiOiB7CiAgICAiMSI6IHsKICAgICAgImV2ZW50cyI6IHt9LAogICAgICAibGlua3MiOiB7fSwKICAgICAgImFkZHJlc3MiOiAiMHgxZDE0ZjkzMDI3NTQzOWNkZWRkNTJkMWU1N2YzZGY0NjMzZTZiNTMyIiwKICAgICAgInVwZGF0ZWRfYXQiOiAxNTExNzk3MDIwMjQwCiAgICB9CiAgfSwKICAic2NoZW1hX3ZlcnNpb24iOiAiMC4wLjUiLAogICJ1cGRhdGVkX2F0IjogMTUxMTc5NzAyMDI0MAp9";

var subjectJsonB64 = "ewogICJjb250cmFjdF9uYW1lIjogIlN1YmplY3QiLAogICJhYmkiOiBbCiAgICB7CiAgICAgICJjb25zdGFudCI6IHRydWUsCiAgICAgICJpbnB1dHMiOiBbXSwKICAgICAgIm5hbWUiOiAiZ2V0UHJvcHMiLAogICAgICAib3V0cHV0cyI6IFsKICAgICAgICB7CiAgICAgICAgICAibmFtZSI6ICJfSUQiLAogICAgICAgICAgInR5cGUiOiAidWludDI1NiIKICAgICAgICB9LAogICAgICAgIHsKICAgICAgICAgICJuYW1lIjogIl9iaXJ0aGRhdGUiLAogICAgICAgICAgInR5cGUiOiAidWludDI1NiIKICAgICAgICB9LAogICAgICAgIHsKICAgICAgICAgICJuYW1lIjogIl9mdWxsbmFtZSIsCiAgICAgICAgICAidHlwZSI6ICJzdHJpbmciCiAgICAgICAgfSwKICAgICAgICB7CiAgICAgICAgICAibmFtZSI6ICJfZ2VuZGVyIiwKICAgICAgICAgICJ0eXBlIjogInVpbnQ4IgogICAgICAgIH0sCiAgICAgICAgewogICAgICAgICAgIm5hbWUiOiAiX29yaWdpbiIsCiAgICAgICAgICAidHlwZSI6ICJ1aW50OCIKICAgICAgICB9CiAgICAgIF0sCiAgICAgICJwYXlhYmxlIjogZmFsc2UsCiAgICAgICJ0eXBlIjogImZ1bmN0aW9uIgogICAgfSwKICAgIHsKICAgICAgImlucHV0cyI6IFsKICAgICAgICB7CiAgICAgICAgICAibmFtZSI6ICJfSUQiLAogICAgICAgICAgInR5cGUiOiAidWludDI1NiIKICAgICAgICB9LAogICAgICAgIHsKICAgICAgICAgICJuYW1lIjogIl9iaXJ0aGRhdGUiLAogICAgICAgICAgInR5cGUiOiAidWludDI1NiIKICAgICAgICB9LAogICAgICAgIHsKICAgICAgICAgICJuYW1lIjogIl9mdWxsbmFtZSIsCiAgICAgICAgICAidHlwZSI6ICJzdHJpbmciCiAgICAgICAgfSwKICAgICAgICB7CiAgICAgICAgICAibmFtZSI6ICJfZ2VuZGVyIiwKICAgICAgICAgICJ0eXBlIjogInVpbnQ4IgogICAgICAgIH0sCiAgICAgICAgewogICAgICAgICAgIm5hbWUiOiAiX29yaWdpbiIsCiAgICAgICAgICAidHlwZSI6ICJ1aW50OCIKICAgICAgICB9CiAgICAgIF0sCiAgICAgICJwYXlhYmxlIjogZmFsc2UsCiAgICAgICJ0eXBlIjogImNvbnN0cnVjdG9yIgogICAgfQogIF0sCiAgInVubGlua2VkX2JpbmFyeSI6ICIweDYwNjA2MDQwNTIzNDE1NjEwMDBmNTc2MDAwODBmZDViNjA0MDUxNjEwMzNjMzgwMzgwNjEwMzNjODMzOTgxMDE2MDQwNTI4MDgwNTE5MTkwNjAyMDAxODA1MTkxOTA2MDIwMDE4MDUxODIwMTkxOTA2MDIwMDE4MDUxOTE5MDYwMjAwMTgwNTE5MTUwNTA1YjYwMDA4NTkwNTU2MDAxODQ5MDU1NjAwMjgzODA1MTYxMDA2NDkyOTE2MDIwMDE5MDYxMDA5MjU2NWI1MDYwMDM4MDU0NjBmZjgzODExNjYxMDEwMDAyNjFmZjAwMTk5MTg2MTY2MGZmMTk5MDkzMTY5MjkwOTIxNzE2MTc5MDU1NWI1MDUwNTA1MDUwNjEwMTMyNTY1YjgyODA1NDYwMDE4MTYwMDExNjE1NjEwMTAwMDIwMzE2NjAwMjkwMDQ5MDYwMDA1MjYwMjA2MDAwMjA5MDYwMWYwMTYwMjA5MDA0ODEwMTkyODI2MDFmMTA2MTAwZDM1NzgwNTE2MGZmMTkxNjgzODAwMTE3ODU1NTYxMDEwMDU2NWI4MjgwMDE2MDAxMDE4NTU1ODIxNTYxMDEwMDU3OTE4MjAxNWI4MjgxMTExNTYxMDEwMDU3ODI1MTgyNTU5MTYwMjAwMTkxOTA2MDAxMDE5MDYxMDBlNTU2NWI1YjUwNjEwMTBkOTI5MTUwNjEwMTExNTY1YjUwOTA1NjViNjEwMTJmOTE5MDViODA4MjExMTU2MTAxMGQ1NzYwMDA4MTU1NjAwMTAxNjEwMTE3NTY1YjUwOTA1NjViOTA1NjViNjEwMWZiODA2MTAxNDE2MDAwMzk2MDAwZjMwMDYwNjA2MDQwNTI2M2ZmZmZmZmZmN2MwMTAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwNjAwMDM1MDQxNjYzZWMxODkzYjQ4MTE0NjEwMDNkNTc1YjYwMDA4MGZkNWIzNDE1NjEwMDQ4NTc2MDAwODBmZDViNjEwMDUwNjEwMGVhNTY1YjYwNDA1MTg1ODE1MjYwMjA4MTAxODU5MDUyNjBmZjgwODQxNjYwNjA4MzAxNTI4MjE2NjA4MDgyMDE1MjYwYTA2MDQwODIwMTgxODE1MjkwODIwMTg1ODE4MTUxODE1MjYwMjAwMTkxNTA4MDUxOTA2MDIwMDE5MDgwODM4MzYwMDA1YjgzODExMDE1NjEwMGFiNTc4MDgyMDE1MTgxODQwMTUyNWI2MDIwMDE2MTAwOTI1NjViNTA1MDUwNTA5MDUwOTA4MTAxOTA2MDFmMTY4MDE1NjEwMGQ4NTc4MDgyMDM4MDUxNjAwMTgzNjAyMDAzNjEwMTAwMGEwMzE5MTY4MTUyNjAyMDAxOTE1MDViNTA5NjUwNTA1MDUwNTA1MDUwNjA0MDUxODA5MTAzOTBmMzViNjAwMDgwNjEwMGY1NjEwMWJkNTY1YjYwMDA4MDYwMDA1NDk0NTA2MDAxNTQ5MzUwNjAwMjgwNTQ2MDAxODE2MDAxMTYxNTYxMDEwMDAyMDMxNjYwMDI5MDA0ODA2MDFmMDE2MDIwODA5MTA0MDI2MDIwMDE2MDQwNTE5MDgxMDE2MDQwNTI4MDkyOTE5MDgxODE1MjYwMjAwMTgyODA1NDYwMDE4MTYwMDExNjE1NjEwMTAwMDIwMzE2NjAwMjkwMDQ4MDE1NjEwMTk4NTc4MDYwMWYxMDYxMDE2ZDU3NjEwMTAwODA4MzU0MDQwMjgzNTI5MTYwMjAwMTkxNjEwMTk4NTY1YjgyMDE5MTkwNjAwMDUyNjAyMDYwMDAyMDkwNWI4MTU0ODE1MjkwNjAwMTAxOTA2MDIwMDE4MDgzMTE2MTAxN2I1NzgyOTAwMzYwMWYxNjgyMDE5MTViNTA1MDYwMDM1NDkzOTY1MDUwNjBmZjgwODQxNjk1NTA2MTAxMDA5MDkzMDQ5MDkyMTY5MjUwNTA1MDViOTA5MTkyOTM5NDU2NWI2MDIwNjA0MDUxOTA4MTAxNjA0MDUyNjAwMDgxNTI5MDU2MDBhMTY1NjI3YTdhNzIzMDU4MjA0YjEyZTc3NzA1NWNkZTMxNjY0NzcxNDZjM2I4ZmNkODBiNzlkMWJiNTE4YmE5NWMwMzEyOGQ0YWQwNTc1NTEyMDAyOSIsCiAgIm5ldHdvcmtzIjogewogICAgIjEiOiB7CiAgICAgICJldmVudHMiOiB7fSwKICAgICAgImxpbmtzIjoge30sCiAgICAgICJhZGRyZXNzIjogIjB4ZGVjNmMwY2U0MDY0M2U4MDJiNDUyNjg3Mzc4M2FlMjVhZDI2ZGQ5NCIsCiAgICAgICJ1cGRhdGVkX2F0IjogMTUxMTc5MjEwNzc1MQogICAgfQogIH0sCiAgInNjaGVtYV92ZXJzaW9uIjogIjAuMC41IiwKICAidXBkYXRlZF9hdCI6IDE1MTE3OTIxMDc3NTEKfQ==";

try {
  var certificateJson = atob(certificateJsonB64);
  var certificateProto = JSON.parse(certificateJson);
  var certificateProxy = web3.eth.contract(certificateProto.abi);

  var subjectJson = atob(subjectJsonB64);
  var subjectProto = JSON.parse(subjectJson);
  var subjectProxy = web3.eth.contract(subjectProto.abi);

  var certs = [];
  var certAddresses = $$$addresses$$$.split('$');
  for(var j = 0; j < certAddresses.length; j++) {
    var address = certAddresses[j].toString();
    var contract = certificateProxy.at(address);
    var props = contract.getProps();
    var cert = {
      address: address,
      type: new Number(props[0]),
      state: new Number(props[1]),
      date: props[2],
      numSubjects: new Number(props[3]),
      numSigns: new Number(props[4]),
      numCancelations: new Number(props[5]),
      subjects: []
    };
    for(var i = 0; i< cert.numSubjects; i++) {
      var subject = {};
      var addrs = contract.getSubject(i);
      subject.address = addrs[0];
      subject.account = addrs[1];
      subject.password = '';
      subject.sign = contract.getSign(subject.account);
      subject.cancelation = contract.getCancelation(subject.account);

      var subjContract = subjectProxy.at(subject.address);
      var props = subjContract.getProps();
      subject.ID = new Number(props[0]);
      subject.birthdate = new Number(props[1]);
      subject.name = props[2];
      subject.gender = new Number(props[3]);
      subject.origin = new Number(props[4]);

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
