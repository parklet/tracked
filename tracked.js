// Tracked v0.1
// https://github.com/parklet/tracked
// (c) 2013 Parklet Inc
// Distributed Under MIT License

(function (undefined) {
  // TODO - reference source. Got this function from a excellent decorator library. Can't find it at the moment though.
  var after = function (decoration) {
    return function (base) {
      return function () {
        var __value__;
        decoration.call(this, __value__ = base.apply(this, arguments));
        return __value__;
      };
    };
  };
  var afterWithArguments = function (decoration) {
    return function (base) {
      return function () {
        var __value__ = base.apply(this, arguments);
        decoration.call(this, __value__, arguments);
        return __value__;
      };
    };
  };
  // Parse RoR style date strings into JS Date objects otherwise just attempt to directly create Date object
  var formatDate = function (dateStr) {
    var pattern = /^(\d{4})-(\d{2})-(\d{2})T(\d{2}):(\d{2}):(\d{2})Z$/;
    var match = pattern.exec(dateStr);
    if (!match) {
      return new Date(dateStr);
    }
    return new Date(match[1], match[2] - 1, match[3], match[4], match[5], match[6]);
  };

  var specialProperties = _.reduceRight({
    "$created" : ["created", "created_at", "createdAt", "created at"],
    "$email" : ["email", "primary_email", "primaryEmail", "primary email"],
    "$first_name" : ["first_name", "firstName", "first", "first name"],
    "$last_name" : ["last_name", "lastName", "last", "last name"],
    "$name" : ["name", "full_name", "fullName", "full name"],
    "$username" : ["username", "user_name", "userName", "user name"],
    "$country_code" : ["country_code", "countryCode", "country", "country code"],
    "$region" : ["region", "state", "province"],
    "$city" : ["city", "town", "village"]
  }, function (invertedHash, values, key) {
    _.each(values, function (k) { invertedHash[k] = key;});
    return invertedHash;
  }, {});
  var convertSpecialPeopleProperties = function (props) {
    var keys = _.keys(props),
      convertedProperties = _.reduceRight(keys, function (returnHash, key) {
        returnHash[specialProperties[key] || key] = props[key];
        return returnHash;
      }, {});
    if (typeof convertedProperties["$created"] === "string") {
      convertedProperties["$created"] = formatDate(convertedProperties["$created"]);
    }
    return convertedProperties;
  };

  // Function decorator for tracking a given function and it's return object
  tracked = function (eventName, fn, defaultProperties) {
    return after(function (returnObj) {
      returnObj = (returnObj instanceof Array || typeof returnObj !== "object")
        && typeof returnObj !== "undefined" ? {returnValue : returnObj} : returnObj;
      defaultProperties = typeof defaultProperties === "function" ? defaultProperties.apply(this) : defaultProperties;
      mixpanel.track(eventName, _.extend({}, defaultProperties, returnObj));
    })(fn);
  };

  // Function decorator for tracking a given function and it's return object as well as it's input arguments
  trackedWithArguments = function (eventName, fn, defaultProperties) {
    defaultProperties = typeof defaultProperties === "undefined" ? {} : defaultProperties;
    var converter = defaultProperties["__converter__"] || function (args) {return args;};
    delete defaultProperties["__converter__"];

    return afterWithArguments(function (returnObj, originalFunctionArguments) {
      var formattedArgs = originalFunctionArguments.length === 0 ? {} : converter.apply(this, originalFunctionArguments);
      returnObj = (returnObj instanceof Array || typeof returnObj !== "object")
        && typeof returnObj !== "undefined" ? {returnValue : returnObj} : returnObj;

      mixpanel.track(eventName, _.extend({}, defaultProperties, formattedArgs, returnObj));
    })(fn);
  };

  // Helper function for converting Mixpanel special properties into the correct name.
  peopleSet = function (props) {
    mixpanel.people.set(convertSpecialPeopleProperties(props));
  };
})();