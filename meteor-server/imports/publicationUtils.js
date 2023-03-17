// mock Publication object for testing
export const publicationMock = { 
  added: function() {}, 
  changed: function() {}, 
  removed: function() {},
  onStop: function() {},
  ready: function() {} 
};

export const publishVirtualWithMeta = (sub, name, cursor) => {
  /* publish cursor to virtual collection with meta document
   *
   * USAGE
   *
   * Meteor.publish('publicationName', function() {
   *   const cursor = LinksCollection.find({ title: {$regex : "Do"}})
   *   return publishToVirtualCollection(this, 'virtualCollectionName', cursor);
   * })
   * 
   * in client:
   * 
   * Meteor.subscribe('publicationName') // subscribe to publication
   * [meta, ...usersArray] = data; // get meta doc
   * 
   * Known Bugs: Does not update count() if the document that was added or removed was not withing skip/limit range
   * This would be fixed by using a different cursor, which does not have skip/limit for the count()
   * 
  */

  // mock Publication object for testing
  if (Meteor.isTest) sub = publicationMock

  // add meta document as first document
  sub.added(name, 'meta', {total: cursor.count()});

  // throttle expensive count() calls
  let timerId = null;
  const updateCount = () => {
    if (timerId != null) return
    timerId = Meteor.setTimeout(Meteor.bindEnvironment(() => {
      timerId = null;
      sub.changed(name, 'meta', {total: cursor.count()} );
    }), 1000)
  }

  var observer = cursor.observeChanges({
    added  : function(id, fields) { updateCount(); sub.added(name, id, fields) },
    changed: function(id, fields) {                sub.changed(name, id, fields) },
    removed: function(id)         { updateCount(); sub.removed(name, id) }
  })
  
  sub.onStop(function() {
    observer.stop() // important. Otherwise, it keeps running forever
  })

  sub.ready();

  // return cursor for testing, normally return nothing
  if (Meteor.isTest) return cursor;
}
