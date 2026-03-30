import HashMap "mo:base/HashMap";
import Text "mo:base/Text";
import Array "mo:base/Array";
import Iter "mo:base/Iter";

persistent actor {

  type UserRecord = {
    mobile: Text;
    password: Text;
    validityDate: ?Text;
  };

  type UserInfo = {
    mobile: Text;
    validityDate: ?Text;
  };

  type LoginResult = {
    #ok: { role: Text; mobile: Text; validityDate: ?Text };
    #err: Text;
  };

  type RegisterResult = {
    #ok;
    #err: Text;
  };

  // Stable storage for upgrades
  var usersEntries: [(Text, UserRecord)] = [];

  // Transient working map — rebuilt on upgrade
  transient var users: HashMap.HashMap<Text, UserRecord> = HashMap.fromIter<Text, UserRecord>(
    usersEntries.vals(), 16, Text.equal, Text.hash
  );

  system func preupgrade() {
    usersEntries := Iter.toArray(users.entries());
  };

  system func postupgrade() {
    users := HashMap.fromIter<Text, UserRecord>(
      usersEntries.vals(), 16, Text.equal, Text.hash
    );
    usersEntries := [];
  };

  public func register(mobile: Text, password: Text): async RegisterResult {
    if (mobile == "admin") {
      return #err("Reserved username");
    };
    switch (users.get(mobile)) {
      case (?_) { #err("Mobile number already registered") };
      case null {
        users.put(mobile, { mobile; password; validityDate = null });
        #ok
      };
    }
  };

  public func login(username: Text, password: Text): async LoginResult {
    if (username == "admin" and password == "admin123") {
      return #ok({ role = "admin"; mobile = "admin"; validityDate = null });
    };
    switch (users.get(username)) {
      case null { #err("User not found") };
      case (?u) {
        if (u.password == password) {
          #ok({ role = "user"; mobile = u.mobile; validityDate = u.validityDate })
        } else {
          #err("Incorrect password")
        }
      };
    }
  };

  public query func listAllUsers(): async [UserInfo] {
    let arr = Iter.toArray(users.vals());
    Array.map<UserRecord, UserInfo>(arr, func(u) = { mobile = u.mobile; validityDate = u.validityDate })
  };

  public func setUserValidity(mobile: Text, validityDate: Text): async RegisterResult {
    switch (users.get(mobile)) {
      case null { #err("User not found") };
      case (?u) {
        users.put(mobile, { mobile = u.mobile; password = u.password; validityDate = ?validityDate });
        #ok
      };
    }
  };

  public func removeUserValidity(mobile: Text): async RegisterResult {
    switch (users.get(mobile)) {
      case null { #err("User not found") };
      case (?u) {
        users.put(mobile, { mobile = u.mobile; password = u.password; validityDate = null });
        #ok
      };
    }
  };

  public func deleteUser(mobile: Text): async RegisterResult {
    switch (users.get(mobile)) {
      case null { #err("User not found") };
      case (?_) {
        users.delete(mobile);
        #ok
      };
    }
  };

  public query func getUserInfo(mobile: Text): async ?UserInfo {
    switch (users.get(mobile)) {
      case null { null };
      case (?u) { ?{ mobile = u.mobile; validityDate = u.validityDate } };
    }
  };
}
