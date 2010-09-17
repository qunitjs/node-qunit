var fs = require( "fs" ),
    sys = require( "sys" ),
    spawn = require("child_process").spawn;

exports.run = function( files ) {

    if ( !(files instanceof Array) ) {
        files = [files];
    }

    files.forEach( function( file ) {
        var proc = spawn( "node", [ __dirname + "/cli.js", file.code, file.test ] );
        
        proc.stderr.on( "data", function (data) {
            sys.print( data );
        });    
        
        proc.stdout.on( "data", function (data) {
            sys.print( data );
        });  
        
    });
};