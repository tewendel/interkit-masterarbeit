// mock Publication object for testing
export const publicationMock = { 
  added: function() {}, 
  changed: function() {}, 
  removed: function() {},
  onStop: function() {},
  ready: function() {} 
};

export const publishVirtualWithMeta = (sub, name, cursor, countCursor) => {
  /* publish cursor to virtual collection with meta document
   *
   * USAGE
   *
   * Meteor.publish('publicationName', function() {
   *   const query = { title: {$regex : "Do"}}
   *   const cursor = LinksCollection.find(query, {limit: 10})
   *   const countCursor = LinksCollection.find(query)
   *   return publishToVirtualCollection(this, 'virtualCollectionName', cursor, countCursor);
   * })
   *
   * in client:
   *
   * Meteor.subscribe('publicationName') // subscribe to publication
   * [meta, ...usersArray] = data; // get meta doc
   *
   * Notice: You need to supply a countCursor to get the total count of documents (ignoring skip and limit)
   *
   */

  // mock Publication object for testing
  if (Meteor.isTest) sub = publicationMock;

  if (!countCursor) countCursor = cursor;

  let initializing = true;
  let total = 0;

  const updateCount = () => {
    if (initializing) return;
    sub.changed(name, "meta", { total });
  };

  var countObserver = countCursor.observeChanges({
    added: function (id) {
      total++;
      updateCount();
    },
    removed: function (id) {
      total--;
      updateCount();
    },
  });


  var observer = cursor.observeChanges({
    added: function (id, fields) {
      sub.added(name, id, fields);
    },
    changed: function (id, fields) {
      sub.changed(name, id, fields);
    },
    removed: function (id) {
      sub.removed(name, id);
    },
  });

  initializing = false;
  // add meta document with id 'meta'
  sub.added(name, "meta", { total });

  sub.onStop(function () {
    observer.stop(); // important. Otherwise, it keeps running forever
    countObserver.stop();
  });

  sub.ready();

  // return cursor for testing, normally return nothing
  if (Meteor.isTest) return cursor;
}


export const publishCounts = async (sub, name, cursor) => {
  // mock Publication object for testing
  if (Meteor.isTest) sub = publicationMock;

  let total = 0;
  let initializing = true;

  const updateCount = () => {
    if (initializing) return;
    sub.changed(name, "meta", { total });
  };

  // `observeChanges` only returns after the initial `added` callbacks have run.
  // Until then, we don't want to send a lot of `changed` messages—hence
  // tracking the `initializing` state.
  var observer = await cursor.observeChanges({
    added: function (id) {
      total++;
      updateCount();
    },
    removed: function (id) {
      total--;
      updateCount();
    },
  });

  sub.onStop(function () {
    observer.stop(); // important. Otherwise, it keeps running forever
  });

  initializing = false;
  // add meta document after counting is done
  sub.added(name, "meta", { total });

  sub.ready();

  // return cursor for testing, normally return nothing
  if (Meteor.isTest) return cursor;
}
