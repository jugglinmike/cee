// @file This view connects to the server and sends and receives chat messages
//   from everyone in the group.
define(function(require) {
  'use strict';
  var _ = require('lodash');
  var cloak = require('cloak');
  var Model = require('backbone').Model;

  var ActivityView = require('components/activity/activity');
  var ChatMessageView = require('../chatmessage/chatmessage');
  var ChatInputView = require('../chatinput/chatinput');

  // The `shared/` directory is available for scripts that should be available
  // on both the client and the server.
  var sharedObject = require('../../../shared/object');
  sharedObject.random();

  // A RequireJS plugin is used to load CSS. Note that the file type is
  // implicit. The plugin will insert a new HTML `<style>` tag into the
  // document and inject the contents of the file. This automatic injection is
  // why the return value from the call to `require` is ignored.
  require('css!./home.css');

  // Some modules simply extend other modules. This is often the case for
  // jQuery plugins. In these cases, the module value itself is not directly
  // useful, so the return value from the call to `require` is ignored.
  require('socket.io-client');

  var activitySlug = 'example';

  var Home = ActivityView.extend({
    className: ActivityView.prototype.className + ' ' + activitySlug,

    homeTemplate: require('jade!./home'),
    config: require('json!../../../config.json'),
    description: 'This activity is intended to demonstrate things.',
    instructions: 'Strings can go here.',
    activitySlug: activitySlug,

    initialize: function() {
      // Configure inserting output into dom
      cloak.configure({
        // Define custom messages sent by server to respond to.
        messages: {
          chat: _.bind(function(arg) {
            this.addMessage(arg.nickname, arg.message);
          }, this)
        },

        // Define handlers for built in events.
        serverEvents: {
          begin: _.bind(function() {
            // Join cloak room for this group
            cloak.message('joinRoom', this.group);
          }, this),
          joinedRoom: _.bind(function(group) {
            this.addMessage('server', 'Joined room ' + group.name + '.');
          }, this)
        }
      });

      // Connect to socket
      cloak.run(undefined, {
        'socket.io': {
          resource: 'activities/' + activitySlug + '/socket.io'
        }
      });

      // Set up chat input.
      this.chatInput = new ChatInputView();
      this.chatInput.on('chat', function(obj) {
        cloak.message('chat', obj);
      });
      this.setView('.input', this.chatInput.render());
    },

    // Stop the network.
    cleanup: function() {
      cloak.stop();
    },

    // Add a message.
    addMessage: function(user, message) {
      var messageView = new ChatMessageView({
        model: new Model({
          timestamp: 'recent',
          user: user,
          text: message
        })
      });
      this.insertView('.output', messageView);
      messageView.render();
    }
  });

  return Home;
});
