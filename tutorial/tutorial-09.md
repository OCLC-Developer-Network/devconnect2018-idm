# Get your early access pass to the new WorldShare Identity Management API
## OCLC DEVCONNECT 2018
### Tutorial Part 9 - Route using a Model 

#### Displaying the User infor
In order to display the actual bibliographic data we have to retrieve it from the API and pass it to our view.
1. Open server.js
2. Find HTTP GET myaccount route
```
app.get('/myaccount', (req, res) => {
```
3. Remove line
```
res.render('display-user'); 
``` 
4. Use the User class to find the user information

```
    User.find(context.accessToken.getAccessTokenString())
    .then(user => {
        res.render('display-user', {user: user});
    })
    .catch (error => {
        // catch the error
    })
```

**[on to Part 10](tutorial-10.md)**

**[back to Part 8](tutorial-08.md)**