var routeHandler = require('./RouteHandler');
exports.enableRoute = function(url,request,response){
    var pathname = url.pathname;
    console.log("url_parts.pathname "+url.pathname);
    switch(pathname){
        case '/home': 
            routeHandler.display_home(pathname, request, response);
            break;
        case '/login': 
            routeHandler.display_login(pathname, request, response);
            break;
        case '/signup':
            routeHandler.display_signup(pathname, request, response);
            break;
        case '/register': 
            routeHandler.display_register(pathname, request, response);
            break;
        case '/books': 
            routeHandler.view_books(request, response);
            break;
        case '/node1.jpg':
            routeHandler.getImageResponse(request, response);
            break;
        case '/node2.jpg':
            routeHandler.getImageResponse(request, response);
            break;
        case '/node3.jpg':
            routeHandler.getImageResponse(request, response);
            break;
        case '/books/view': 
            routeHandler.view_book(request, response);
            break;
        case '/books/download': 
            routeHandler.download_book(request, response);
            break;
        case '/chat':
            routeHandler.createChat(request, response);
            break;
        default:
            routeHandler.display_home(pathname, request, response);            
                    
    }
}