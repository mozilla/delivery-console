Workflow
========

The following is a list of things you'll probably need to do at some point while
working on Delivery Console.

Running Tests
-------------
You can run the automated test suite with the following command:

.. code-block:: bash

   yarn test

If you'd prefer that the tests watch for changes and re-run automatically:

.. code-block:: bash

   yarn test:watch

.. note::

   If you encounter an error like this, when running ``yarn test:watch``:

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

   A probable cause is that you don't have ``watchman`` installed. For example,
   on macOS you can fix this by installing...:

   .. code-block:: bash

      $ brew update
      $ brew install watchman

Linting
-------
You will need to :ref:`install Therapist <therapist-install>` for linting. If
you have installed the pre-commit hook linting will take place with every
commit, however there may be times you want to run the linters manually.

To run the linters on all files that you have changed or added:

.. code-block:: bash

   therapist use lint

To run the linters on all files in the repo:

.. code-block:: bash

   therapist use lint:all

To run the linters and attempt to fix issues in files that you have changed or
added:

.. code-block:: bash

   therapist use fix

To run the linters and attempt to fix issues in all files in the repo:

.. code-block:: bash

   therapist use fix:all

Production Builds
-----------------
If you need a production build to debug locally you can create one using:

.. code-block:: bash

   yarn build

Redux DevTools
--------------
In development mode we have integrated `Redux DevTools`_ to help debug issues.
To toggle the DevTools, hit ``Ctrl-H``. You can change the side of the screen
the tools are docked on using ``Ctrl-Q``, and can resize the tools by dragging
the edge of the bar.

.. _Redux DevTools: https://github.com/gaearon/redux-devtools
