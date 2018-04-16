# Get your early access pass to the new WorldShare Identity Management API
## OCLC DEVCONNECT 2018
### Tutorial Part 8 - Views
Views govern how content will be displayed on the screen. 
Data can be passed into a view for display purposes. More on this later.

#### Create a basic layout for your views
1. In the views directory create header.html

```
<!DOCTYPE html PUBLIC "-//W3C//DTD HTML 4.01 Transitional//EN" "http://www.w3.org/TR/html4/loose.dtd">
<html>
<head>
<meta http-equiv="Content-Type" content="text/html; charset=UTF-8">
<title>User Info demo</title>
</head>
<body>
```

2. In the views directory create footer.html
```
</body>
</html>
```


#### Create "home" view
1. In views directory create file index.html

```
<%- include('header.html') -%>
<p>Yes!!! The user is logged in!</p>
<%- include('footer.html') -%>
```

#### Create base bib view
1. In views directory create file display-user.html

```
<%- include('header.html') -%>
<h1>Welcome</h1>
<div id="user">
</div>
<%- include('footer.html') -%>
```


**[on to Part 9](tutorial-09.md)**

**[back to Part 7](tutorial-07.md)**