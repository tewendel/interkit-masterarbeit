import assert from "assert";
import { Messages } from "../../imports/collections";
import { seedUser } from "../../imports/userUtils";
import "../../server/userRolesSetup";
import "../../server/publications";

// check if the projects publication auth works
const testname = "publication-messagesPaginated"

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

    const message2 = {
      ...message1,
      _id: "message2",
      payload: {
        type: "system",
        text: "bye world",
      }
    }

    const message3 = {
      ...message1,
      _id: "message3",
      projectId: "project1",
      channel_key: "REPORTS",
      payload: {
        type: "text",
        text: "got reported :(",
      },
    }

    before(function () {
      seedUser("admin", "admin", "admin");
      // TODO add projectUser and test permissions
      Messages.insert(message1);
      Messages.insert(message2);
      Messages.insert(message3);
    })

    after(function () {
      Messages.remove("message1");
      Messages.remove("message2");
      Messages.remove("message3");
    });

    it("should list the messages to admin", function () {
      const user = Meteor.users.findOne({username: "admin"});
      const res = Meteor.server.publish_handlers['messagesPaginated'].apply({userId: user._id},[{projectId: "project1"}]);
      assert.equal(res.count(), 3);
    });

    it("should not list the messages of another project", function () {
      const user = Meteor.users.findOne({username: "admin"});
      const res = Meteor.server.publish_handlers['messagesPaginated'].apply({userId: user._id},[{projectId: "project2"}]);
      assert.equal(res.count(), 0);
    });

    it("should find the message by text", function () {
      const user = Meteor.users.findOne({username: "admin"});
      const res = Meteor.server.publish_handlers['messagesPaginated'].apply({userId: user._id},[{projectId: "project1", searchQuery: "hello"}]);
      assert.equal(res.count(), 1);
    });

    it("should return REPORTS if channelReports is true", function () {
      const user = Meteor.users.findOne({username: "admin"});
      const res = Meteor.server.publish_handlers['messagesPaginated'].apply({userId: user._id},[{projectId: "project1", channelReports: true}]);
      assert.equal(res.count(), 1);
    });


  }
});
