describe("Helpers.Analytics", function () {
  describe("tracked", function () {
    it("should return a function", function () {
      expect(tracked("foo", function () {})).toEqual(jasmine.any(Function));
    });

    it("should call the passed in function on execution", function () {
      var called = false;
      tracked("foo", function () {called = true;})();
      expect(called).toBeTruthy();
    });

    it("should track the event with the return value of the function", function () {
      spyOn(mixpanel, "track");
      tracked("foo", function () { return {foo : "bar"} })();
      expect(mixpanel.track).toHaveBeenCalledWith("foo", {foo : "bar"});
    });

    it("should accept a default properties hash", function () {
      spyOn(mixpanel, "track");
      tracked("foo", function () { }, {foo : "bar", baz : "zinger"})();
      expect(mixpanel.track).toHaveBeenCalledWith("foo", {foo : "bar", baz : "zinger"});
    });

    it("should mixin return values with the default properties hash", function () {
      spyOn(mixpanel, "track");
      tracked("foo", function () { return {foo : "DIFF"} }, {foo : "bar", baz : "zinger"})();
      expect(mixpanel.track).toHaveBeenCalledWith("foo", {foo : "DIFF", baz : "zinger"});
    });

    it("should use 'returnValue' as the key if return object is not a hash", function () {
      spyOn(mixpanel, "track");
      tracked("foo", function () { return "string" })();
      expect(mixpanel.track).toHaveBeenCalledWith("foo", {returnValue : "string"});
      tracked("foo", function () { return ["value"] })();
      expect(mixpanel.track).toHaveBeenCalledWith("foo", {returnValue : ["value"]});
      tracked("foo", function () { })();
      expect(mixpanel.track).toHaveBeenCalledWith("foo", {});
    });
  });

  describe("trackedWithArguments", function () {
    it("should return a function", function () {
      expect(trackedWithArguments("foo", function () {})).toEqual(jasmine.any(Function));
    });

    it("should call the passed in function on execution", function () {
      var called = false;
      trackedWithArguments("foo", function () {called = true;})();
      expect(called).toBeTruthy();
    });

    it("should track the event with the return value of the function", function () {
      spyOn(mixpanel, "track");
      trackedWithArguments("foo", function () { return {foo : "bar"} })();
      expect(mixpanel.track).toHaveBeenCalledWith("foo", {foo : "bar"});
    });

    it("should accept a default properties hash", function () {
      spyOn(mixpanel, "track");
      trackedWithArguments("foo", function () { }, {foo : "bar", baz : "zinger"})();
      expect(mixpanel.track).toHaveBeenCalledWith("foo", {foo : "bar", baz : "zinger"});
    });

    it("should mixin return values with the default properties hash", function () {
      spyOn(mixpanel, "track");
      trackedWithArguments("foo", function () { return {foo : "DIFF"} }, {foo : "bar", baz : "zinger"})();
      expect(mixpanel.track).toHaveBeenCalledWith("foo", {foo : "DIFF", baz : "zinger"});
    });

    it("should use 'returnValue' as the key if return object is not a hash", function () {
      spyOn(mixpanel, "track");
      trackedWithArguments("foo", function () { return "string" })();
      expect(mixpanel.track).toHaveBeenCalledWith("foo", {returnValue : "string"});
      trackedWithArguments("foo", function () { return ["value"] })();
      expect(mixpanel.track).toHaveBeenCalledWith("foo", {returnValue : ["value"]});
      trackedWithArguments("foo", function () { })();
      expect(mixpanel.track).toHaveBeenCalledWith("foo", {});
    });

    it("should accept an argument converter", function () {
      spyOn(mixpanel, "track");
      var func = trackedWithArguments("foo", function () { return {foo : "DIFF"} }, {foo : "bar", __converter__ : function () {
        return {something : "wingo man!"};
      }});
      func();
      expect(mixpanel.track).toHaveBeenCalledWith("foo", {foo : "DIFF"});
      func("wonderful");
      expect(mixpanel.track).toHaveBeenCalledWith("foo", {foo : "DIFF", something : "wingo man!"});
    });
  });

  describe("peopleSet", function () {
    var inputAttrs = {};
    beforeEach(function () {
      inputAttrs = {
        "email" : "jimmy@domain.com",
        "name" : "Jimmy Jones",
        "first_name" : "Jimmy",
        "last_name" : "Jones",
        "country_code" : "USA",
        "region" : "CA",
        "city" : "San Francisco",
        "created" : new Date(2013, 0, 17, 22, 33, 23), // "2013-01-17T22:33:23Z"
        "admin" : false,
        "phone_number" : "123-456-4321",
        "about" : "This is just junk",
        "salary" : 123123,
        "title" : "Boss Man"
      };
    });

    it("should map special property names", function () {
      var passedProperties = null;
      spyOn(mixpanel.people, "set").andCallFake(function (props) {
        passedProperties = props;
      });
      peopleSet(inputAttrs);
      _.each(["$created", "$email", "$first_name", "$last_name", "$name", "$username", "$country_code", "$region", "$city"], function (attr) {
        expect(passedProperties[attr]).toEqual(inputAttrs[attr.substring(1)]);
      });
    });

    it("should set any normal passed parameters", function () {
      var passedProperties = null;
      spyOn(mixpanel.people, "set").andCallFake(function (props) {
        passedProperties = props;
      });
      peopleSet({goober : "blamo"});
      expect(passedProperties.goober).toEqual("blamo");
    });
  });
});