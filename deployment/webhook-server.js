#!/usr/bin/env node
'use strict';

var http = require('http');
var spawn = require('child_process').spawn;
var port = process.env.NODE_PORT || 1337;

(function() {
  function unix(n, args) {
    var cmd = n;
    var c;

    if (!args) {
      args = [];
    } else {
      cmd += ' ' + args.join(' ');
    }

    c = spawn(n, args, { detached: true, cwd: __dirname, env: process.env });
    c.stdout.on('data', function(buffer) {
      console.log(cmd + ':', String(buffer));
    });
    c.stderr.on('data', function(buffer) {
      console.log(cmd + ' - ERROR:', String(buffer));
    });
  }
  unix('whoami');
  unix('groups');
  unix('pwd');
}());

function provision(done) {
  process.env.USER = 'webhook';
  var child = spawn(
    'ansible-playbook',
    ['-c', 'local', '-i', 'inventory/development', 'provision.yml'],
    { cwd: __dirname, env: process.env }
  );

  console.log('__dirname', __dirname, process.env);

  child.on('error', done);
  child.on('close', function(code) {
    if (code !== 0) {
      done(new Error('Process exited with non-zero exit code: ' + code));
      return;
    }

    done(null);
  });

  return { stdout: child.stdout, stderr: child.stderr };
}

function handleRequest(req, done) {
  var json = '';
  var eventName = req.headers['x-github-event'];

  if (req.method !== 'POST') {
    done(new Error('Invalid request method: ' + req.method));
    return;
  }

  if (eventName !== 'push') {
    done(new Error('Invalid request header value:', eventName));
    return;
  }

  req.on('data', function(chunk) {
    json += chunk;
  });

  req.on('error', done);
  req.on('end', function() {
    var data; 

    try {
      data = JSON.parse(json);
    } catch (err) {
      done(err);
      return;
    }

    if (!data.ref) {
      done(new Error('No git reference specified'));
      return;
    }

    done(null, data.ref);
  });
}

http.createServer(function(req, res) {
  var recievedOn = new Date().getTime();

  function log() {
    var args = ['[' + recievedOn + ']']
      .concat(Array.prototype.slice.call(arguments));

    console.log.apply(console, args);
  }

  log('Received request.');

  handleRequest(req, function(err, ref) {
    var stdio;

    res.end();

    if (err) {
      log('Invalid request:', err);
      return;
    }


    if (ref !== 'refs/heads/master') {
      log('Ignored git reference: ', ref);
      return;
    }

    log('Request valid. Now re-provisioning...');

    stdio = provision(function(err) {
      if (err) {
        log('Provisioning error:', err);
        return;
      }

      log('Re-provisioning complete.');
    });

    stdio.stdout.on('data', function(buffer) { log(String(buffer)); });
    stdio.stderr.on('data', function(buffer) { log(String(buffer)); });
  });

}).listen(port, '0.0.0.0');

console.log('Webhook server running at http://0.0.0.0:' + port + '/');
