import assert from "assert";
//import "./messages.js"
import "./projects-publication-auth.js"
import "./messages-publication-query.js"
import "./publications/publication-projectUsers.js"
import "./publications/publication-activeAdminUsers.js"
import "./publications/publication-messagesPaginated.js"
import "./publications/publication-messagesChannelReportsCount"



describe("meteor-svelte-test", function () {
  it("package.json has correct name", async function () {
    const { name } = await import("../package.json");
    assert.strictEqual(name, "meteor-svelte-test");
  });

  if (Meteor.isClient) {
    it("client is not server", function () {
      assert.strictEqual(Meteor.isServer, false);
    });
  }

  if (Meteor.isServer) {
    it("server is not client", function () {
      assert.strictEqual(Meteor.isClient, false);
    });
  }
});
