# Get your early access pass to the new WorldShare Identity Management API
## OCLC DEVCONNECT 2018
### Tutorial Part 7 - Route Basics

#### Routes - Telling the App what to do
Our application is supposed to have two "screens":
- "home" screen
- Display screen user information
To make our application work we have to tell it what urls to use for those two screens.

1. Open the server.js file
2. Define the route for the search screen
    - Add the HTTP method which will be used
    - Add the "path"
    - Return the view you want the application to display in the response

```
app.get('/', (req, res) => {   
   
   res.render('index');   
});
```
4. Define a basic routes for the screen to display user information

```
app.get('/myaccount', (req, res) => {   
    res.render('display-user');
});
```

**[on to Part 8](tutorial-08.md)**

**[back to Part 6](tutorial-06.md)**