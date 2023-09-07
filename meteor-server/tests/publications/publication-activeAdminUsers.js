import assert from "assert";
import { Projects } from "../../imports/collections";
import { seedUser } from "../../imports/userUtils";
import "../../server/userRolesSetup";
import "../../server/publications";

const testname = "publication-usersEditingProject";

describe(testname, function () {
  if (Meteor.isServer) {
    const projectId = "6o9Mv86zwdjs5GzCX";

    // generate project
    const project = {
      _id: projectId,
    };

    before(async function () {
      await seedUser("admin", "admin", "admin");
      await seedUser("author1", "author", "admin");
      await seedUser("author2", "author", "author");
      await seedUser("author3", "author", "author");

      // add an active connection to author1
      await Meteor.users.update(
        { username: "author1" },
        {
          $set: {
            connections: [
              {
                url: "http://admin.interkit.app/#/" + projectId,
              },
            ],
          },
        }
      );

      // add an active connection to author2
      await Meteor.users.update(
        { username: "author2" },
        {
          $set: {
            connections: [
              {
                url: "http://admin.interkit.app/#/" + projectId + "/something",
              },
            ],
          },
        }
      );

      // add connection to a different project to author3
      await Meteor.users.update(
        { username: "author3" },
        {
          $set: {
            connections: [
              {
                url: "http://admin.interkit.app/#/" + "somethingelse",
              },
            ],
          },
        }
      );
      Projects.insert(project);
    });

    after(function () {
      Projects.remove({ _id: projectId });
    });

    it("should find the active project users in their project", function () {
      const user = Meteor.users.findOne({ username: "author3" });
      const res = Meteor.server.publish_handlers["user.editingProject"].apply(
        {
          userId: user._id,
          ready: () => {
            console.log("ready");
          },
        },
        [{ projectId: projectId }]
      );
      // should return two users
      assert.equal(res.count(), 2);
      // users should be author1 and author2
      assert.equal(res.fetch()[0].username, "author1");
      assert.equal(res.fetch()[1].username, "author2");
    });

    it("should find active project users in their project including themselves", function () {
      const user = Meteor.users.findOne({ username: "author1" });
      const res = Meteor.server.publish_handlers["user.editingProject"].apply(
        {
          userId: user._id,
          ready: () => {
            console.log("ready");
          },
        },
        [{ projectId: projectId }]
      );
      // should return two users
      assert.equal(res.count(), 2);
      // users should be author1 and author2
      assert.equal(res.fetch()[0].username, "author1");
      assert.equal(res.fetch()[1].username, "author2");
    });

    it("should not find a the active users of one project in another project", function () {
      const user = Meteor.users.findOne({ username: "author1" });
      const res = Meteor.server.publish_handlers["user.editingProject"].apply(
        {
          userId: user._id,
          ready: () => {
            console.log("ready");
          },
        },
        [{ projectId: "anotherproject" }]
      );
      // should return one user
      assert.equal(res.count(), 0);
    });
  }
});
