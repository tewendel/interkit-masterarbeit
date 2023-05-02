import assert from "assert";
import { Projects } from "../imports/collections";
import { seedUser } from "../imports/userUtils";
import "../server/userRolesSetup";
import "../server/publications";

// check if the projects publication auth works
const testname = "projects-publication-auth"

describe(testname, function () {

  this.timeout(15000);

  if (Meteor.isServer) {

    // generate messages
    const project = {
      _id: "test-project-" + 0,
      name: "test-project-" + 0,
      slug: "test-project-" + 0,
      isDefaultProject: false,
      history: [
          {
            event: "create_project",
          }
        ],
      projectServer: {
          status: "running",
          actionRequested: "stop",
          messages: [{
            type: "stdout",
            text: "example message",
            date: Date.now(),
          }]
        },
      uiState: { a:0 },
      testname,
    }

    before(async function () {
      await seedUser("admin", "admin", "admin");
      await seedUser("author", "author", "author");
      await seedUser("bundler", "bundler", "bundler");
      await seedUser("projectuser", "projectuser", "projectuser");
      await seedUser("projectserver", "projectserver", "projectserver");
    })

    beforeEach(function () {
      Projects.remove({testname});
      Projects.insert(project);
    });

    after(function () {
      Projects.remove({testname});
    });

    it("should not expose projects list to unspecified user", function () {
      const res = Meteor.server.publish_handlers['projects'].apply({},[]);
      assert.equal(res, undefined);
    });

    it("should list projects to admin", function () {
      const user = Meteor.users.findOne({username: "bundler"});
      const res = Meteor.server.publish_handlers['projects'].apply({ userId: user._id },[]);
      const docs = res.fetch();
      assert.equal(docs.length, 1);
    });

  }
});
