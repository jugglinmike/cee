# CEE Web Activities

Interactive educational activities by Bocoup and the Council for Economic
Education.

## Setup

Install this project's external dependencies:

   $ npm install

## Usage

This application supports two usage modes: development and production.

In **development mode**, server-side logging is enabled and client-side assets
are executed directly from their respective source files. This means any
changes to the client-side source files will be reflected each time the browser
is refreshed (provided caching is disabled).

In **production mode**, server-side logging is limited and client-side assets
are served from optimized files in the output directory. (These optimized files
must first be built before the project can operate in production mode, and any
change to the source files will require another build operation.)

### Development Mode

Simply run the server from the `src/` directory:

```sh
Usage: cd src && node . [options]

Options:
  --help, -h        Display this help info.
  --port, -p        Port to listen on.
  --hostname, -b    Address to bind to. (eg. "0.0.0.0")
  --activities, -a  Comma separated list of activities to start.
```

Alternatively, you may use [npm](https://npmjs.com) to execute the same task:

    $ npm run start-dev

### Production Mode

To build a production-ready version of the project, run the following command:

    $ npm run build

Then, you may run the server from the `out/` directory, using the same flags
that are available when running in production (see above):

```sh
cd out && node . [options]
```

Alternatively, you may use [Grunt](http://gruntjs.com) to build and run the
server in production mode:

    $ npm start

## Testing

1. `grunt test`




## Developing

If you'd like to work on this project, you can either manually install its
dependencies on your **local** machine or use a **virtual machine** (via
[Vagrant](http://vagrantup.com)) to run the application in a sandboxed
environment. Instructions for each are provided below.

### Installation

**Local development:**

- [Node.js](http://nodejs.org)

Run:

    $ npm install

**Virtual Machine:**

- Ansible
  - via [pip](http://pip.readthedocs.org/en/latest/installing.html) (All
    Platforms): `pip install ansible`
  - via [homebrew](http://brew.sh/) (OSX) `brew install ansible`
  - Linux: `apt-get/yum install ansible`
- VirtualBox ([download](https://www.virtualbox.org/))
- Vagrant ([download](http://www.vagrantup.com/downloads.html))
- Vagrant "exec" plugin: run the following command (all platforms)

      vagrant plugin install vagrant-exec

### Running (production)

To run in your **development environment**, execute the following command:

    $ npm start

...and visit http://localhost:8000

To run within a **virtual machine**, execute the following command:

    $ vagrant up

...and visit http://192.168.33.34

The `NODE_PORT` environmental variable allows for runtime configuration of the
TCP/IP port to which the HTTP server should be bound. Defaults to `8000`.

### Running (development)

To run the application in development mode, execute the following command:

    $ npm run start-dev

In addition to `NODE_PORT` (see above), this mode allows for runtime
configuration of the application's dependencies on external services.

### Deployment

To provision the production server environment, execute the following command
from the `deploy/ansible/` directory:

    $ ansible-playbook -i inventory/production provision.yml

This command only needs to be run when initially configuring a new environment
or when making changes to the application that modify system-wide settings.

During deployment, code is sourced from the upstream git repository. Execute
the following command from the `deploy/ansible/` directory:

    $ ansible-playbook -i inventory/production deploy.yml
