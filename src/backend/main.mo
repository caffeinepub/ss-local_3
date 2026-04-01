import HashMap "mo:base/HashMap";
import Text "mo:base/Text";
import Array "mo:base/Array";
import Iter "mo:base/Iter";

persistent actor {

  // Legacy record type (previous deployment — no fullName/village)
  type UserRecordV1 = {
    mobile: Text;
    password: Text;
    validityDate: ?Text;
  };

  // Current record type
  type UserRecord = {
    mobile: Text;
    password: Text;
    fullName: Text;
    village: Text;
    validityDate: ?Text;
  };

  type UserInfo = {
    mobile: Text;
    fullName: Text;
    village: Text;
    validityDate: ?Text;
  };

  type LoginResult = {
    #ok: { role: Text; mobile: Text; fullName: Text; village: Text; validityDate: ?Text };
    #err: Text;
  };

  type RegisterResult = {
    #ok;
    #err: Text;
  };

  // Legacy stable storage — kept for migration from old deployments
  var usersEntries: [(Text, UserRecordV1)] = [];

  // Current stable storage — always kept in sync via preupgrade
  var usersEntriesV2: [(Text, UserRecord)] = [];

  // Transient working map — rebuilt on every startup from stable storage
  transient var users: HashMap.HashMap<Text, UserRecord> = do {
    let map = HashMap.fromIter<Text, UserRecord>(
      usersEntriesV2.vals(), 16, Text.equal, Text.hash
    );
    // Migrate any legacy V1 records not already in V2
    for ((k, v) in usersEntries.vals()) {
      if (map.get(k) == null) {
        map.put(k, {
          mobile = v.mobile;
          password = v.password;
          fullName = "";
          village = "";
          validityDate = v.validityDate;
        });
      };
    };
    map
  };

  // Save current state before upgrade — do NOT clear usersEntriesV2 afterwards
  system func preupgrade() {
    usersEntriesV2 := Iter.toArray(users.entries());
    usersEntries := [];
  };

  public func register(mobile: Text, password: Text, fullName: Text, village: Text): async RegisterResult {
    if (mobile == "admin") {
      return #err("Reserved username");
    };
    switch (users.get(mobile)) {
      case (?_) { #err("Mobile number already registered") };
      case null {
        users.put(mobile, { mobile; password; fullName; village; validityDate = null });
        usersEntriesV2 := Iter.toArray(users.entries());
        #ok
      };
    }
  };

  public func login(username: Text, password: Text): async LoginResult {
    if (username == "admin" and password == "Kartheek22") {
      return #ok({ role = "admin"; mobile = "admin"; fullName = "Admin"; village = ""; validityDate = null });
    };
    switch (users.get(username)) {
      case null { #err("User not found") };
      case (?u) {
        if (u.password == password) {
          #ok({ role = "user"; mobile = u.mobile; fullName = u.fullName; village = u.village; validityDate = u.validityDate })
        } else {
          #err("Incorrect password")
        }
      };
    }
  };

  public query func listAllUsers(): async [UserInfo] {
    let arr = Iter.toArray(users.vals());
    Array.map<UserRecord, UserInfo>(arr, func(u) = { mobile = u.mobile; fullName = u.fullName; village = u.village; validityDate = u.validityDate })
  };

  public func setUserValidity(mobile: Text, validityDate: Text): async RegisterResult {
    switch (users.get(mobile)) {
      case null { #err("User not found") };
      case (?u) {
        users.put(mobile, { mobile = u.mobile; password = u.password; fullName = u.fullName; village = u.village; validityDate = ?validityDate });
        usersEntriesV2 := Iter.toArray(users.entries());
        #ok
      };
    }
  };

  public func removeUserValidity(mobile: Text): async RegisterResult {
    switch (users.get(mobile)) {
      case null { #err("User not found") };
      case (?u) {
        users.put(mobile, { mobile = u.mobile; password = u.password; fullName = u.fullName; village = u.village; validityDate = null });
        usersEntriesV2 := Iter.toArray(users.entries());
        #ok
      };
    }
  };

  public func deleteUser(mobile: Text): async RegisterResult {
    switch (users.get(mobile)) {
      case null { #err("User not found") };
      case (?_) {
        users.delete(mobile);
        usersEntriesV2 := Iter.toArray(users.entries());
        #ok
      };
    }
  };

  public query func getUserInfo(mobile: Text): async ?UserInfo {
    switch (users.get(mobile)) {
      case null { null };
      case (?u) { ?{ mobile = u.mobile; fullName = u.fullName; village = u.village; validityDate = u.validityDate } };
    }
  };

  public func updatePassword(mobile: Text, oldPassword: Text, newPassword: Text): async RegisterResult {
    switch (users.get(mobile)) {
      case null { #err("User not found") };
      case (?u) {
        if (u.password != oldPassword) {
          #err("Current password is incorrect")
        } else {
          users.put(mobile, { mobile = u.mobile; password = newPassword; fullName = u.fullName; village = u.village; validityDate = u.validityDate });
          usersEntriesV2 := Iter.toArray(users.entries());
          #ok
        }
      };
    }
  };

  public func updateUserInfo(mobile: Text, fullName: Text, village: Text): async RegisterResult {
    switch (users.get(mobile)) {
      case null { #err("User not found") };
      case (?u) {
        users.put(mobile, { mobile = u.mobile; password = u.password; fullName; village; validityDate = u.validityDate });
        usersEntriesV2 := Iter.toArray(users.entries());
        #ok
      };
    }
  };
}
