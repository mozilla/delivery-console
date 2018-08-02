Authentication
==============

By default, authentication takes place on ``auth.mozilla.auth0.com`` which is
hosted by Auth0.com.

While you must use Auth0 for authentication you can
:doc:`override the configuration </dev/configuration>` of
``REACT_APP_OIDC_CLIENT_ID`` and ``REACT_APP_OIDC_DOMAIN`` to use another
instance.

You will need to update the backend services (such as Normandy) to use the
same domain as well.

Debugging Silent Authentication
-------------------------------
The way the authentication works is that a never-ending loop checks if the
access token has expired, or is about to expire. Actually, it only uses
``localStorage.expiresAt`` to do this. To debug this you can either sit very
patiently and wait till the check ticks again, or you can speed it up manually.
First, to control how often the check ticks, you can override
``REACT_APP_CHECK_AUTH_EXPIRY_INTERVAL_SECONDS`` when starting the dev server:

.. code-block:: bash

    $ REACT_APP_CHECK_AUTH_EXPIRY_INTERVAL_SECONDS=10 yarn start

That will cause the check to run every 10 seconds.

Secondly, to avoid awaiting for the access token to expire, you can paste this
function into the Web Console:

.. code-block:: javascript

   window.windExpires = hours => {
     let expires = JSON.parse(localStorage.getItem('expiresAt')) - hours * 1000 * 3600;
     localStorage.setItem('expiresAt', JSON.stringify(expires));
   };

Now you can type, in the Web Console:

.. code-block:: javascript

   windExpires(1.5)

That will simulate that 1.5 hours on the ``localStorage.expiresAt`` has gone
past.
