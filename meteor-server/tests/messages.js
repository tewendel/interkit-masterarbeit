import assert from "assert";
import { Messages } from "../imports/collections";

describe("meteor-messages-test", function () {

  if (Meteor.isServer) {

    // cleanup
    Messages.remove("test-message-1");

    // insert
    it("db inserts a message", function () {
      const number = Messages.insert({
        _id: "test-message-1",
        projectId: "projectId",
        sender: "sender",
        recipients: ["recipients"],
      });
      assert.equal(number, "test-message-1");
    });

    // find
    it("db finds a message", function () {
      assert.equal(Messages.find("test-message-1").count(), 1);
    });

    // remove
    it("db removes a message", function () {
      Messages.remove("test-message-1");
      assert.equal(Messages.find("test-message-1").count(), 0);
    });
  }
});
