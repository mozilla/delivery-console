=======================
Developer Documentation
=======================

You need your own ``yarn`` and a recent version of NodeJS. To get started
right away run:

.. code-block:: shell

    $ git clone https://github.com/mozilla/delivery-console.git
    $ cd delivery-console
    $ yarn
    $ yarn start

Now you should be able to open ``http://localhost:3000`` and behold the
aweomeness.


Running Apps Separately
=======================

By default, ``yarn start`` will spin up the entire Delivery Console, including all of the nested apps such as Normandy. In order to stand up only one of the apps, simply pass an `--app` parameter pointing to the app's directory. Here are some examples:

.. code-block:: shell

    $ yarn start --app=normandy
    $ yarn start --app=delivery-dashboard
    $ yarn start --app=some-other-app


This works via altering the Webpack ``entry`` configuration via ``config-overrides.js`` to point to the ``[app-dir]/src/index.js`` file. An index.js file is required for each app in order to be served on its own - see below.


Standalone App Configuration
============================

When working on an individual app, there is a need to stub out certain values/props that would normally be passed in through the delivery-console. These props include authTokens, usernames, etc. When working on an app on its own, these values are stubbed out when the component is mounted to the DOM. Consider the following example:

.. code-block:: javascript

    /*
      fake-app/App.js

      The entry point to the app when nested in the delivery-console. This contains the basic component definition for the app, and is written as a normal React component.
    */
    import React from 'react';
    import './App.css';

    export default class App extends React.Component {
        render() {
            return (
            <div>
                <h1>Welcome to this app!</h1>
                <p>The prop value being passed in is set to "{ this.props.someProp }"</p>
            </div>
            );
        }
    }

.. code-block:: javascript

    /*
      fake-app/index.js

      The entry point to the app when standing up alone. This is useful for stubbing out values that would be passed down from the delivery-console (such as an authToken).
    */
    import React from 'react';
    import ReactDOM from 'react-dom';
    import FakeApp from './App';

    ReactDOM.render(
      <FakeApp someProp="some-value" />,
      document.getElementById('root'),
    );

``App.js`` outlines the actual React component for the app, while ``index.js`` mounts the app to the DOM with some fake data.


FSEvent Errors Running ``jest``
===============================

If you encounter an error like this, when running ``yarn run test:jest``:

.. code-block:: bash

    ▶ yarn run test:jest
    yarn run v1.7.0
    $ react-app-rewired test --env=jsdom
    2018-06-20 13:55 node[6928] (FSEvents.framework) FSEventStreamStart: register_with_server: ERROR: f2d_register_rpc() => (null) (-22)
    2018-06-20 13:55 node[6928] (FSEvents.framework) FSEventStreamStart: register_with_server: ERROR: f2d_register_rpc() => (null) (-22)
    2018-06-20 13:55 node[6928] (FSEvents.framework) FSEventStreamStart: register_with_server: ERROR: f2d_register_rpc() => (null) (-22)
    events.js:167
          throw er; // Unhandled 'error' event
          ^

    Error: EMFILE: too many open files, watch
        at FSEvent.FSWatcher._handle.onchange (fs.js:1372:28)
    Emitted 'error' event at:
        at FSEvent.FSWatcher._handle.onchange (fs.js:1378:12)
    error Command failed with exit code 1.
    info Visit https://yarnpkg.com/en/docs/cli/run for documentation about this command.

A probable cause is that you don't have ``watchman`` installed. For example, on macOS you can fix this by installing...:

.. code-block:: bash

    $ brew update
    $ brew install watchman

Debugging Silent Authentication
===============================

The way the authentication works is that a never-ending loop checks if the access token has
expired, or is about to expire. Actually, it only uses ``localStorage.expiresAt`` to do this.
To debug this you can either sit very patiently and wait till the check ticks again, or you
can speed it up manually. First, to control how often the check ticks, you can override
``REACT_APP_CHECK_AUTH_EXPIRY_INTERVAL_SECONDS`` when starting the dev server:

.. code-block:: bash

    $ REACT_APP_CHECK_AUTH_EXPIRY_INTERVAL_SECONDS=10 yarn start

That will cause the check to run every 10 seconds.

Secondly, to avoid awaiting for the access token to expire, you can paste this function
into the Web Console:

.. code-block:: javascript

    window.windExpires = hours => {
      let expires = JSON.parse(localStorage.getItem('expiresAt')) - hours * 1000 * 3600;
      localStorage.setItem('expiresAt', JSON.stringify(expires));
   };

Now you can type, in the Web Console:

.. code-block:: javascript

    windExpires(1.5)

That will simulate that 1.5 hours on the ``localStorage.expiresAt`` has gone past.
