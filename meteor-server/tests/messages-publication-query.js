import assert from "assert";
import { Messages } from "../imports/collections";
import "../server/publications";

describe("meteor-publication-query", function () {

  if (Meteor.isServer) {

    // generate messages
    const messages = []
    for (let i = 0; i < 10000; i++) {
      messages.push({
        _id: "test-message-" + i,
        projectId: "projectId" + i%1000,
        channel_key: "channel_key" + i%1000,
        sender: "sender" + i%100,
        recipients: ["recipients"],
        createdAt: new Date(i+1000+i%1000),
        test: "meteor-publication-query",
      });
    }

    it("db is clean", function () {
      // cleanup
      Messages.remove({test: "meteor-publication-query"});
      assert.equal(Messages.find({test: "meteor-publication-query"}).count(), 0);
    });

    // insert messages
    it("db has test messages", async function () {
      // bulk insert
      await Messages.rawCollection().insertMany(messages);

      assert.equal(Messages.find({test: "meteor-publication-query"}).count(), messages.length);
    });

    it("check messages publication", function () {
      const res = Meteor.server.publish_handlers['messages'].apply({},[{
        userId: "sender0",
        projectId: "projectId0", 
        channel_key: "channel_key0", 
        origin: null, 
        limit: null
      }]);
      const docs = res.fetch();
      //console.log(docs.length);
      assert.equal(docs.length, messages.length/1000);
    });


    it("db is clean", function () {
      // cleanup
      Messages.remove({test: "meteor-publication-query"});
      assert.equal(Messages.find({test: "meteor-publication-query"}).count(), 0);
    }); 
  }
});
