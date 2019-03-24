var module = require('./DBModule');
import url from 'url';
import querystring from 'querystring';
var fs = require('fs');
var zlib = require('zlib');
var net = require('net');
var message="";
exports.display_login = function(url,request,response){
    var data1='';    
    request.on('data',function(chunk){
        data1 += chunk;
    });
    request.on('end',function(){
        var qs= querystring.parse(data1);
        var name= qs["username"];
        var password= qs["password"];
        var result= module.authenticateUser(name,password,response,function(err,data){
            if(data=== "Success"){
                fs.appendFile('./log.txt',"User "+name+" has Logged in at "+new Date(),function(err,html){
                    if(err){
                        throw err;
                    }
                })
                response.writeHead(200,{"Content-Type":"text/html"});
                fs.readFile('./Details_Book.html',function(err,html){
                    if(err){
                        throw err;
                    }
                    response.writeHead(200,{"Content-Type":"text/html"});
                    response.write(html);
                    response.end();
                });
            }
            else{
            console.log("Error");
            response.writeHead(200,{"Content-Type":"text/html"});
            response.write("<body bgcolor='#E2C2F6'><center>Invalid User. Try Login again !!</center></body>");
            response.write("<center><a href='home'>Back to Login</a></center>");
            response.end();
            } 
        });
    });
}

exports.display_signup = function(url,request,response){   
    fs.readFile('./Signup_Book.html',function(err,html){
        if(err){            
            throw err;
        }
        response.writeHead(200,{"Content-Type":"text/html"});
        response.write(html);
        response.end();
    });
}

exports.display_register = function(url,request,response){
    var data1='';    
    request.on('data',function(chunk){
        console.log(chunk);
        data1 += chunk;
    });
    request.on('end',function(){
        var qs= querystring.parse(data1);
        console.log(qs);
        var name= qs["username"];
        var password= qs["password"];
        var confirmpassword= qs["confirmpassword"];
        var address= qs["address"];
        if(password==confirmpassword){
            module.addUser(name,password,address,response,function(err,data){
                if(data){
                    response.writeHead(200,{"Content-Type":"text/html"});
                    response.write("<body bgcolor='#E2C2F6'><center>Registered successfully !!</center></body>");
                    response.write("<center><a href='home'>Click here to login</a></center>");
                }
            });
            
        }
        else{
            response.writeHead(200,{"Content-Type":"text/html"});
            response.write("<body bgcolor='#E2C2F6'><center>Password mismatch</center></body>");
            response.write("<center><a href='signup'>Try again</a></center>");
            response.end();
        }
    });        
}

exports.display_home = function(url,request,response){
    fs.readFile('./Login_Book.html',function(err,html){
        if(err){
            throw err;
        }
        response.writeHead(200,{"Content-Type":"text/html"});
        response.write(html);
        response.end();
    });
}

exports.view_books = function(request,response){
    fs.readFile('./books.json',function(err,json){
        if(err){
            throw err;
        }
        response.writeHead(200,{"Content-Type":"application/json"});
        response.end(json);
    });
}

exports.getImageResponse = function(request,response){
    var img;    
    switch(request.url){
        case '/node1.jpg':
            img= fs.readFileSync('./books/images/node1.jpg');
            break;
        case '/node2.jpg':
            img= fs.readFileSync('./books/images/node2.jpg');
            break;
        case '/node3.jpg':
            img= fs.readFileSync('./books/images/node3.jpg');
            break;
    }
    response.writeHead(200,{"Content-Type":"image/jpg"});
    response.end(img,'binary');
}

exports.download_book = function(request,response){
    var query = url.parse(request.url).query;    
    var ebook = querystring.parse(query)["ebook"];    
    var rstream = fs.createReadStream("./books/"+ebook);
    var wstream = fs.createWriteStream("D://books/"+ebook+".gz");
    var gzip = zlib.createGzip();
    rstream.pipe(gzip).pipe(wstream).on('finish',function(){
        console.log("finished compressing");
        fs.readFile('./Details_Book.html',function(err,html){
            if(err){
                throw err;
            }
            response.writeHead(200,{"Content-Type":"text/html"});
            response.write(html);
            response.write("<script type= 'text/javascript'>alert('Downloaded the zipped file. Check in D:/books directory');</script>")
            response.end();
        });
    })
}

exports.view_book = function(request,response){    
    var query = url.parse(request.url).query;
    var ebook = querystring.parse(query)["ebook"];    
    var file = fs.createReadStream("./books/"+ebook,function(err,data){
        if(err){
            throw err;
        }
    });
    file.pipe(response);
}

exports.createChat = function(request,response){
    var query = url.parse(request.url).query;
    var chatmessage = querystring.parse(query)["chatmessage"];
    var chatname = querystring.parse(query)["chatname"];
    var client = net.connect({port:1234},function(){
        console.log("connected to server");
        client.write("<b>Name:</b> "+chatname);
        client.write("<br><b>Message:</b> "+chatmessage);
    });
    client.on('data',function(data){
        message+="<tr style='border-bottom:ridge;'><td>"+data.toString()+"</td></tr>";
        console.log(data.toString());
        fs.readFile('./Details_Book.html',function(err,html){
            if(err){
                throw err;
            }
            response.writeHead(200,{"Content-Type":"text/html"});
            response.write(html);
            var chatresponse="<br><table style='border-collapse:collapse;background-color:#ffb3b3;border:ridge;width:300px;top:100;left:0:position:fixed;'><tr style='border-bottom:ridge;'><td><h4>Discussion:</h4></td></tr>"+message+"</table>";
            response.write(chatresponse);
            response.end();
        });

    });
    client.on('end',function(){
        console.log('Disconnected from server');
    })
}