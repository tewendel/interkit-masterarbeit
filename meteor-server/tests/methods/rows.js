import assert from "assert";
import { Rows } from "../../imports/collections.js";
import "../../server/methods/sheetMethods";

const testname = "methods-row-updates";

describe(testname, function () {
  if (Meteor.isServer) {
    // Test data
    const testRow = {
      key: testname + "_row",
      projectId: testname + "_project",
      values: {
        col1: "initial1",
        col2: "initial2"
      }
    };

    beforeEach(function () {
      // Clear only our test data
      Rows.remove({ projectId: testRow.projectId });
    });

    after(function () {
      // Clean up all test data
      Rows.remove({ projectId: testRow.projectId });
    });

    it("updates single value correctly", function () {
      // Insert test row
      Rows.insert(testRow);

      // Update single value
      const result = Meteor.call("row.updateValue", {
        rowKey: testRow.key,
        projectId: testRow.projectId,
        colKey: "col1",
        newVal: "updated1"
      });

      // Verify result
      assert.strictEqual(result.values.col1, "updated1");
      assert.strictEqual(result.values.col2, "initial2");
    });

    it("updates multiple values correctly", function () {
      // Insert test row
      Rows.insert(testRow);

      const newValues = {
        col1: "new1",
        col2: "new2",
        col3: "new3"
      };

      // Update values
      const result = Meteor.call("row.updateValues", {
        rowKey: testRow.key,
        projectId: testRow.projectId,
        values: newValues
      });

      // Verify result
      assert.deepStrictEqual(result.values, newValues);
    });

    it("handles non-existent row for single update", function () {
      const result = Meteor.call("row.updateValue", {
        rowKey: "non-existent",
        projectId: testRow.projectId,
        colKey: "col1",
        newVal: "test"
      });

      assert.strictEqual(result, undefined);
    });

    it("handles non-existent row for multiple updates", function () {
      const result = Meteor.call("row.updateValues", {
        rowKey: "non-existent",
        projectId: testRow.projectId,
        values: { col1: "test" }
      });

      assert.strictEqual(result, undefined);
    });

    it("handles missing parameters for single update", function () {
      const result = Meteor.call("row.updateValue", {});
      assert.strictEqual(result, undefined);
    });

    it("handles missing parameters for multiple updates", function () {
      const result = Meteor.call("row.updateValues", {});
      assert.strictEqual(result, undefined);
    });

    it("handles concurrent updates correctly", async function () {
      // Insert test row
      Rows.insert(testRow);

      // Perform concurrent updates
      await Promise.all([
        Meteor.call("row.updateValue", {
          rowKey: testRow.key,
          projectId: testRow.projectId,
          colKey: "col1",
          newVal: "concurrent1"
        }),
        Meteor.call("row.updateValue", {
          rowKey: testRow.key,
          projectId: testRow.projectId,
          colKey: "col2",
          newVal: "concurrent2"
        })
      ]);

      // Verify final state
      const finalRow = Rows.findOne({ key: testRow.key });
      assert.strictEqual(finalRow.values.col1, "concurrent1");
      assert.strictEqual(finalRow.values.col2, "concurrent2");
    });
  }
});
