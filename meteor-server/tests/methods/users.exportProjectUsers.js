import assert from "assert";
import { Projects } from "../../imports/collections";
import { seedUser } from "../../imports/userUtils";
import "../../server/userRolesSetup";
import "../../server/methods/userMethods";

const testname = "methods-exportProjectUsers";

describe(testname, function () {
  if (Meteor.isServer) {
    // Test project
    const project = {
      _id: testname,
      name: testname,
      slug: testname,
      isDefaultProject: false,
      testname,
    };

    // Test user with project data
    const testUser = {
      username: testname + "_user",
      emails: [{ address: 'test@example.com', verified: true }],
      name: 'Test User',
      projectUserData: {
        [project._id]: {
          userToken: "test123",
          boardState: {
            board1: {
              nodeId: "start",
              status: "arrived",
              lastArrived: new Date()
            }
          },
          lastHeartbeat: new Date()
        }
      },
      status: {
        lastLogin: {
          date: new Date(),
          userAgent: "Test Browser"
        }
      },
      testname,
    };

    before(function () {
      // Set up test data
      seedUser("admin", "admin", "admin");
      seedUser("author", "author", "author");
      seedUser("bundler", "bundler", "bundler");
      Meteor.users.insert(testUser);
      Projects.insert(project);
    });

    after(function () {
      // Clean up test data
      Meteor.users.remove({ testname });
      Projects.remove({ testname });
    });

    it("should allow admin to export users", async function () {
      const adminUser = Meteor.users.findOne({ username: "admin" });
      const result = await Meteor.server.method_handlers.exportProjectUsers.call(
        { userId: adminUser._id },
        { projectId: project._id }
      );
      assert(result, "Should return data");
      const data = JSON.parse(result);
      assert(Array.isArray(data), "Should return an array");
      assert(data.length > 0, "Should contain test user");
      assert.equal(data[0].username, testUser.username, "Should contain correct user data");
    });

    it("should allow author to export users", async function () {
      const authorUser = Meteor.users.findOne({ username: "author" });
      const result = await Meteor.server.method_handlers.exportProjectUsers.call(
        { userId: authorUser._id },
        { projectId: project._id }
      );
      assert(result, "Should return data");
      const data = JSON.parse(result);
      assert(Array.isArray(data), "Should return an array");
      assert(data.length > 0, "Should contain test user");
    });

    it("should not allow bundler to export users", async function () {
      const bundlerUser = Meteor.users.findOne({ username: "bundler" });
      const result = await Meteor.server.method_handlers.exportProjectUsers.call(
        { userId: bundlerUser._id },
        { projectId: project._id }
      );
      assert.equal(result, false, "Should not return data for bundler");
    });

    it("should not allow unauthenticated export", async function () {
      const result = await Meteor.server.method_handlers.exportProjectUsers.call(
        { userId: null },
        { projectId: project._id }
      );
      assert.equal(result, false, "Should not return data when not authenticated");
    });

    it("should export in CSV format", async function () {
      const adminUser = Meteor.users.findOne({ username: "admin" });
      const result = await Meteor.server.method_handlers.exportProjectUsers.call(
        { userId: adminUser._id },
        { projectId: project._id, format: 'csv' }
      );
      assert(result, "Should return data");
      assert(result.includes("id,username,email"), "Should contain CSV headers");
      assert(result.includes(testUser.username), "Should contain test user data");
    });
  }
});