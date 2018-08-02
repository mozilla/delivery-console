Local Configuration
===================

There are a number of :doc:`configuration variables </ops/config>` that can be
overridden.

For local configuration, variables can simply be passed on the command line when
starting the development server:

.. code-block:: shell

   $ REACT_APP_OIDC_DOMAIN=my.oidc.domain.example.com yarn start

However, it is recommended that you create a ``.env`` file in the root of the
project instead. For example:

.. code-block:: shell

   REACT_APP_OIDC_DOMAIN=my.oidc.domain.example.com
   REACT_APP_OIDC_CLIENT_ID=6YRYpJyS5DnDyxLTRVGCQGCWGo2KNQLX
