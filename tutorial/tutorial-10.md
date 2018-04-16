# Get your early access pass to the new WorldShare Identity Management API
## OCLC DEVCONNECT 2018
### Tutorial Part 10 - Dynamic Views
Views can be use content to be dynamically generated. Data is passed into the view via an associative array.
The key of the array is the name of the variable in the view.

Example:
```
res.render('display-user', {user: user});
```
#### Make the User View Dynamic

1. Open display-user.html
2. Use user variable passed from route and User object methods to fill in fields in display-user.html

```
<%- include('header.html') -%>
<h1>Welcome <%= user.getGivenName()%></h1>
<div id="user">
<p>Name: <%= user.getFamilyName()%> <%= user.getGivenName()%></p>
<p>Email: <%= user.getEmail()%></p>
<p>ID/Namespace: <%= user.getOclcPPID()%> - <%= user.getOclcNamespace()%></p>
<p>Institution: <%= user.getInstitutionId()%></p>

</div>
<%- include('footer.html') -%>
```

**[on to Part 11](tutorial-11.md)**

**[back to Part 9](tutorial-09.md)**