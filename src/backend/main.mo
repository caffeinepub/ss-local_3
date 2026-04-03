import Map "mo:core/Map";
import Text "mo:core/Text";
import Iter "mo:core/Iter";

actor {
  type UserRecord = {
    mobile : Text;
    password : Text;
    fullName : Text;
    village : Text;
    validityDate : ?Text;
  };

  type LoginResult = {
    #ok : { role : Text; mobile : Text; fullName : Text; village : Text; validUntil : ?Text };
    #err : Text;
  };

  type RegisterResult = {
    #ok;
    #err : Text;
  };

  type UserInfo = {
    mobile : Text;
    fullName : Text;
    village : Text;
    validUntil : ?Text;
  };

  // mo:core/Map is stable-compatible and mutable via dot notation
  let users = Map.empty<Text, UserRecord>();

  public func register(mobile : Text, password : Text, fullName : Text, village : Text) : async RegisterResult {
    if (mobile == "admin") {
      return #err("Reserved username");
    };

    switch (users.get(mobile)) {
      case (?_) { #err("Mobile number already registered") };
      case (null) {
        let user : UserRecord = {
          mobile;
          password;
          fullName;
          village;
          validityDate = null;
        };
        users.add(mobile, user);
        #ok;
      };
    };
  };

  public func login(username : Text, password : Text) : async LoginResult {
    if (username == "admin" and password == "Kartheek22") {
      return #ok({
        role = "admin";
        mobile = "admin";
        fullName = "Admin";
        village = "";
        validUntil = null;
      });
    };

    switch (users.get(username)) {
      case (null) { #err("User not found") };
      case (?user) {
        if (user.password == password) {
          #ok({
            role = "user";
            mobile = user.mobile;
            fullName = user.fullName;
            village = user.village;
            validUntil = user.validityDate;
          });
        } else {
          #err("Incorrect password");
        };
      };
    };
  };

  public query func listAllUsers() : async [UserInfo] {
    users.values().toArray().map(
      func(user : UserRecord) : UserInfo {
        {
          mobile = user.mobile;
          fullName = user.fullName;
          village = user.village;
          validUntil = user.validityDate;
        };
      }
    );
  };

  public func setUserValidity(mobile : Text, validityDate : Text) : async RegisterResult {
    switch (users.get(mobile)) {
      case (null) { #err("User not found") };
      case (?user) {
        let updatedUser : UserRecord = {
          mobile = user.mobile;
          password = user.password;
          fullName = user.fullName;
          village = user.village;
          validityDate = ?validityDate;
        };
        users.add(mobile, updatedUser);
        #ok;
      };
    };
  };

  public func removeUserValidity(mobile : Text) : async RegisterResult {
    switch (users.get(mobile)) {
      case (null) { #err("User not found") };
      case (?user) {
        let updatedUser : UserRecord = {
          mobile = user.mobile;
          password = user.password;
          fullName = user.fullName;
          village = user.village;
          validityDate = null;
        };
        users.add(mobile, updatedUser);
        #ok;
      };
    };
  };

  public func deleteUser(mobile : Text) : async RegisterResult {
    switch (users.get(mobile)) {
      case (null) { #err("User not found") };
      case (?_) {
        users.remove(mobile);
        #ok;
      };
    };
  };

  public query func getUserInfo(mobile : Text) : async ?UserInfo {
    switch (users.get(mobile)) {
      case (null) { null };
      case (?user) {
        ?{
          mobile = user.mobile;
          fullName = user.fullName;
          village = user.village;
          validUntil = user.validityDate;
        };
      };
    };
  };

  public func updatePassword(mobile : Text, oldPassword : Text, newPassword : Text) : async RegisterResult {
    switch (users.get(mobile)) {
      case (null) { #err("User not found") };
      case (?user) {
        if (user.password != oldPassword) {
          #err("Current password is incorrect");
        } else {
          let updatedUser : UserRecord = {
            mobile = user.mobile;
            password = newPassword;
            fullName = user.fullName;
            village = user.village;
            validityDate = user.validityDate;
          };
          users.add(mobile, updatedUser);
          #ok;
        };
      };
    };
  };

  public func updateUserInfo(mobile : Text, fullName : Text, village : Text) : async RegisterResult {
    switch (users.get(mobile)) {
      case (null) { #err("User not found") };
      case (?user) {
        let updatedUser : UserRecord = {
          mobile = user.mobile;
          password = user.password;
          fullName;
          village;
          validityDate = user.validityDate;
        };
        users.add(mobile, updatedUser);
        #ok;
      };
    };
  };
};
