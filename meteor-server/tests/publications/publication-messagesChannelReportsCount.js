import assert from "assert";
import { Messages } from "../../imports/collections";
import { seedUser } from "../../imports/userUtils";
import "../../server/userRolesSetup";
import "../../server/publications";

// check if the projects publication auth works
const testname = "publication-messagesChannelReportsCount"

describe(testname, function () {

  if (Meteor.isServer) {

    // generate message
    const message1 = {
      _id: "message1",
      projectId: "project1",
      sender: "user1",
      recipients: ["user2", "user3"],
      channel_key: "channel1",
      payload: {
        type: "text",
        text: "hello world",
      },
      createdAt: new Date(),
      handledAt: new Date(),
      handledBy: ["handler1", "handler2"],
      origin: "handler",
    };

    const messageReported = {
      ...message1,
      _id: "messageReported",
      channel_key: "REPORTS",
    }

    const messageReportedSeen = {
      ...messageReported,
      _id: "messageReportedSeen",
      seen: ["user1"],
      seenCount: 1,
    }

    before(function () {
      seedUser("admin", "admin", "admin");
      // TODO add projectUser and test permissions
      Messages.insert(message1);
      Messages.insert(messageReported);
      Messages.insert(messageReportedSeen);
    })

    after(function () {
      Messages.remove("message1");
      Messages.remove("messageReported");
      Messages.remove("messageReportedSeen");
    });

    it("should should find the reported unseen message", async function () {
      const user = Meteor.users.findOne({username: "admin"});
      const cursor = await Meteor.server.publish_handlers['messagesChannelReportsCount'].apply({userId: user._id},[{projectId: "project1"}]);
      assert.equal(cursor.count(), 1);
      assert.equal(cursor.fetch()[0]._id, "messageReported");
    });

    it("should not expose reported messages to unidentified user", async function () {
      const cursor = await Meteor.server.publish_handlers['messagesChannelReportsCount'].apply({userId: null},[{projectId: "project1"}]);
      assert.equal(cursor, undefined);
    });
  }
});
