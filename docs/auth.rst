==============
Authentication
==============

By default, the authentication will be done against the ``auth.mozilla.auth0.com`` instance hosted
by Auth0.com.

To override how the OpenID Connection authentication should be done set
``REACT_APP_OIDC_CLIENT_ID`` and ``REACT_APP_OIDC_DOMAIN`` either by typing it into a file called
``.env`` or you can do it on the command line when starting the development server. E.g.

.. code-block:: shell

    $ REACT_APP_OIDC_DOMAIN=my.oidc.domain.example.com REACT_APP_OIDC_CLIENT_ID=6YRYpJyS5DnDyxLTRVGCQGCWGo2KNQLX yarn start
