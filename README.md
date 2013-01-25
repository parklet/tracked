Tracked
===============

JavaScript Library for Mixpanel tracking through function decoration.

### Dependencies:

* Created against Mixpanel v2.2
* Underscore.js >= v1.4

### Available options:

```javascript
/*
* Wrap functions to be tracked by Mixpanel with the return object
* Parameters:
* name - Mixpanel event name
* fn - Function being wrapped
* properties - Additional properties to be tracked. If they are the same as
*               values in the function return object, they will be overridden.
* Returns: Function that will call the passed in function with the correct context and parameters
*/
tracked(name, fn, properties);

/*
* Wrap functions to be tracked by Mixpanel with the return object *and the passed in parameters*
* Parameters:
* name - Mixpanel event name
* fn - Function being wrapped
* properties - Additional properties to be tracked. If they are the same as
*               values in the function return object or passed in arguments, they will be overridden.
*               A special parameter __converter__ can be passed in to manipulate the format of the original arguments.
*               This can be useful when the function being decorated does not take an object as input.
* Returns: Function that will call the passed in function with the correct context and parameters
*/
trackedWithArguments(name, fn, properties);

/*
* Helper function for converting Mixpanel special properties into the correct names for the People API.
* Parameters:
* properties - Properties to be tracked.
*/
peopleSet(properties);
```

### Example Usage:

#### `tracked`

Basic usage look would look like this:
```javascript
var importantFunction = tracked("Important", function () { /*...*/ });
// Your function can now be used as normal.
importantFunction();
```

A popular use case is if you want to track that a user clicked on something.
```javascript
$("a.money-button").click(tracked("Money clicked", function (e) {
  // ...
});
```

You could also generalize this to track everywhere a user clicks.
```javascript
$(document).on("click", tracked("User clicked", function (e) { return { target : e.target }; });
```

Sometimes you want to track some state that is external to what a function returns.
```javascript
$(document).on("use:bombs", tracked("Bombs used", function (e) {
  // ...
}, { level : 4 });
```

This is great, but it can be more useful to calculate that state dynamically.
```javascript
var getGameState = function () { /*...*/ };
// ...
$(document).on("use:bombs", tracked("Bombs used", function (e) {
  // ...
}, getGameState);
```

#### `trackedWithArguments`

Sometimes you don't want to just track the output of a function but the arguments too. That's what `trackedWithArguments` is for.
```javascript
var importantFunction = trackedWithArguments("Important", function (parameters) { /*...*/ });
// Your function can now be used as normal.
importantFunction();
```

This works great if you function just takes an Object as an argument.
For everything else you can pass a `__converter__` function to format those arguments for Mixpanel.
Note: The `__converter__` function will have the same context as the original function.
```javascript
var importantFunction = trackedWithArguments("Important",
  function (arg1, arg2) { /*...*/ },
  { __converter__ : function (args) {
    // ...
    return output; // Just be sure to return an object
  };
// Your function can now be used as normal.
importantFunction();
```

#### `peopleSet`
`peopleSet` is an alternative way of calling `mixpanel.people.set`. It handles converting property names to their respective special property names.
Currently, it will convert the following property names.

```javascript
{"$created" : ["created", "created_at", "createdAt", "created at"],
"$email" : ["email", "primary_email", "primaryEmail", "primary email"],
"$first_name" : ["first_name", "firstName", "first", "first name"],
"$last_name" : ["last_name", "lastName", "last", "last name"],
"$name" : ["name", "full_name", "fullName", "full name"],
"$username" : ["username", "user_name", "userName", "user name"],
"$country_code" : ["country_code", "countryCode", "country", "country code"],
"$region" : ["region", "state", "province"],
"$city" : ["city", "town", "village"]}
```

Now you don't need to think about what things need to be converted to a special name so that you can get the most out of the Mixpanel Engage features.
```javascript
peopleSet({email : "goober@gmail.com", name : "Goober McGoob", rank : "Space Cadet" });
```

This is probably most useful when you are pulling attributes off of a model and don't want to think about the conversion.
```javascript
peopleSet(user.attributes);
```

Inspired by:
Python's function decorator syntax and this [function combinators library](https://github.com/raganwald/method-combinators) by [Reg Braithwaite](https://github.com/raganwald/homoiconic/blob/master/homoiconic.markdown).
