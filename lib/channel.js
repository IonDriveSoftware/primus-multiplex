/**
 * Module dependencies.
 */

var Stream = require('stream').Stream;

/**
 * Module export.
 */

module.exports = Channel;

/**
 * `Channel` constructor.
 *
 * @constructor
 * @param {primus.Spark} spark Primus spark instance instance.
 * @param {String} topic The topic to subscribe to
 * @param {Object} channels Channels
 * @api public
 */

function Channel (spark, id, topic, channels) {
  this.spark = spark;
  this.id = id;
  this.topic = topic;
  this.channels = channels;
}

/**
 * Inherits from `Stream`.
 */

Channel.prototype.__proto__ = Stream.prototype;

/**
 * Send a new message to a given spark.
 *
 * @param {Mixed} data The data that needs to be written.
 * @returns {Boolean} Always returns true.
 * @api public
 */

Channel.prototype.write = function (data) {
  return this.spark.write([0, this.id, this.topic, data]);
};

/**
 * End the connection.
 *
 * @param {Mixed} data Optional closing data.
 * @return {Channel} self
 * @api public
 */

Channel.prototype.end = function (data) {
  var channel = this;
  if (data) this.write(data);
  if (this.id in this.cnannels) {
    this.spark.write([3, this.id, this.topic]);
    delete this.channels[this.id];
    process.nextTick(function () {
      channel.emit('close');
    });
  }
  return this;
};

/**
 * Destroy the channel.
 *
 * @return {Channel} self
 * @api public
 */

Channel.prototype.destroy = function () {
  this.removeAllListeners();
  this.end();
  return this;
};