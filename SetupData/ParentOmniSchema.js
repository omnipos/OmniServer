module.exports = exports = function lastModifiedPlugin (schema, options) {
  schema.add({ lastSyncedAt: Date,lastUpdatedAt: Date,markedForDeletion:Boolean })
  
  schema.pre('save', function (next) {
    this.lastUpdatedAt = new Date;
    next();
  });
 
}