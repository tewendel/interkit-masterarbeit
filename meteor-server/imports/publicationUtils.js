export const FindFromPublication = {};

const METADATA_COLLECTION = 'subscriptionMetadata';

const constructId = (collectionName, publicationName, id) => 
`${collectionName}-${publicationName}-${id}`;

FindFromPublication.publish = function(publicationName, fn) {
  Meteor.publish(publicationName, function() {
    let rank = 0;
    const oldAdded = this.added.bind(this);
    const oldRemoved = this.removed.bind(this);

    this.added = (collectionName, documentId, doc) => {
      oldAdded(collectionName, documentId, doc);

      oldAdded(METADATA_COLLECTION, constructId(collectionName, publicationName, documentId), {
        collectionName,
        documentId,
        publicationName,
        // NOTE: this rank is incremented across all collections
        // probably doesn't matter?
        rank
      });

      rank += 1;
    };

    this.removed = (collectionName, documentId) => {
      // the only way this can get called is when all documents are removed
      // from the subscription as it's torn down, we know that the underlying document
      // will also be removed, and this will pick it up.
      if (collectionName === METADATA_COLLECTION) return;

      oldRemoved(METADATA_COLLECTION, constructId(collectionName, publicationName, documentId));
      oldRemoved(collectionName, documentId);
    };

    return fn.apply(this, arguments);
  });
};

// mock Publication object for testing
export const publicationMock = { 
  added: function() {}, 
  changed: function() {}, 
  removed: function() {},
  onStop: function() {},
  ready: function() {} 
};

export const publishToVirtualCollection = (sub, name, cursor) => {
  /* publish cursor to virtual collection
   * allows to return another cursor in the publication function
   *
   * USAGE
   *
   * Meteor.publish('publicationName', function() {
   *   const cursor = LinksCollection.find({ title: {$regex : "Do"}})
   *   publishToVirtualCollection(this, 'virtualCollectionName', cursor);
   *   this.ready()
   *   // optional: return cursor or different cursor to regular collection
   * })
   * 
   * in client:
   * 
   * Meteor.subscribe('publicationName')
   * 
  */

  

  sub.added(name, 'meta', {total: cursor.count()});

  // throttle expensive count() calls
  let timerId = null;
  const updateCount = () => {
    if (timerId != null) return
    timerId = Meteor.setTimeout(Meteor.bindEnvironment(() => {
      timerId = null;
      sub.changed(name, 'meta', {total: cursor.count()});
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
}

export async function publishVirtual(sub, name, cursor, metaDoc) {
  /* Publish cursor to a new virtual collection and handle return of cursor for testing
   * 
   * USAGE
   *
   * Meteor.publish('publicationName', function() {
   *   const cursor = LinksCollection.find({ title: {$regex : "Do"}})
   *   return publishVirtual(this, 'virtualCollectionName', cursor);
   * })
   * 
   * in client:
   * 
   * Meteor.subscribe('publicationName')
   * 
  */
  
  // mock Publication object for testing
  if (Meteor.isTest) sub = publicationMock

  //if (metaDoc) {
  
  //}

  publishToVirtualCollection(sub, name, cursor);

  sub.ready();

  // return cursor for testing, normally return nothing
  if (Meteor.isTest) return cursor;
}