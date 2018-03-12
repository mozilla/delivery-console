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
