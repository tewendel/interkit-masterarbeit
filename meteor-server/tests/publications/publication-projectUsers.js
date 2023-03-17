import assert from "assert";
import { Projects } from "../../imports/collections";
import { seedUser } from "../../imports/userUtils";
import "../../server/userRolesSetup";
import "../../server/publications";

// check if the projects publication auth works
const testname = "publication-projectsUsers"

describe(testname, function () {

  if (Meteor.isServer) {

    // generate project
    const project = {
      _id: testname,
      name: testname,
      slug: testname,
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

    const projectUser = {
      username: testname + "this",
      emails: [
        { address: 'cool@example.com', verified: true },
      ],
      profile: {
        // The profile is writable by the user by default.
        name: 'Joe This'
      },
      projectData: {
        [project._id]: {
          test: true,
        }
      },
      testname,
    }

    const projectUserOfAnotherProject = {
      username: testname + "other",
      emails: [
        { address: 'othercool@example.com', verified: true },
      ],
      profile: {
        // The profile is writable by the user by default.
        name: 'Joe Other'
      },
      projectData: {
        [project._id]: {
          test: true,
        }
      },
      testname,
    }

    before(function () {
      seedUser("admin", "admin", "admin");
      seedUser("author", "author", "author");
      Meteor.users.insert(projectUser);
      Projects.insert(project);
    })

    after(function () {
      Meteor.users.remove({testname});
      Projects.remove({testname});
    });

    //it("should not list projectUsers to public", function () {
    //  const res = Meteor.server.publish_handlers['projectUsers'].apply({},[{projectId: "phantasy"}]);
    //  assert.equal(res, undefined);
    //});

    it("should not list projectUsers of another project to admin", function () {
      console.log(Meteor.server.publish_handlers['projectUsers'])
      const user = Meteor.users.findOne({username: "admin"});
      const res = Meteor.server.publish_handlers['projectUsers'].apply({ 
        userId: user._id,
        added: (collection, id, fields) => {
          console.log("added", collection, id, fields)
        },
        removed: (collection, id) => {
          console.log("removed", collection, id)
        }
      },[{projectId: "phantasy"}]);
      assert.equal(res.count(), 0);
    });

    it("should list projectUsers of requested project to admin", function () {
      const user = Meteor.users.findOne({username: "admin"});
      const res = Meteor.server.publish_handlers['projects'].apply({ userId: user._id },[{projectId: testname}]);
      assert.equal(res.count(), 1);
    });

    //it("should publish metaSubscription to projectUsers for pagination", function () {
    //  const user = Meteor.users.findOne({username: "admin"});
    //  const res = Meteor.server.publish_handlers['projectUsers'].apply({ userId: user._id },[{projectId: testname}]);
    //  assert.equal(res.count(), 1);
    //});

  it("should list projectUsers of requested project to admin", function () {
    const user = Meteor.users.findOne({username: "admin"});
    const res = Meteor.server.publish_handlers['free'].apply({ userId: user._id },[{projectId: testname}]);
    assert.equal(res.count(), 1);
  });


/*

    it("should list projectUsers of requested project", function () {
      const user = Meteor.users.findOne({username: "admin"});
      const res = Meteor.server.publish_handlers['projects'].apply({ userId: user._id },[]);
      const docs = res.fetch();
      assert.equal(docs.length, 1);
    });
    */

  }
});
