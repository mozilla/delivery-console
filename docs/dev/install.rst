Developer Setup
===============

The following describes how to set up an instance of the site on your
computer for development.

Prerequisites
-------------
This guide assumes you have already installed and set up the following:

1. Git_
2. `Node.js 8`_ and `Yarn`_.
3. `Python 2.7`_ or higher and`pip 8`_ or higher

These docs assume a Unix-like operating system, although the site should, in
theory, run on Windows as well. All the example commands given below are
intended to be run in a terminal.

.. _Git: https://git-scm.com/
.. _Node.js 8: https://nodejs.org/en/
.. _Yarn: https://yarnpkg.com/en/
.. _Python 2.7: https://www.python.org/
.. _pip 8: https://pip.pypa.io/en/stable/

Installation
------------
1. Clone this repository or your fork_:

   .. code-block:: bash

      git clone https://github.com/mozilla/delivery-console.git
      cd delivery-console

2. Install the dependencies using yarn:

   .. code-block:: bash

      yarn install

Once you've finished these steps, you should be able to start the site by
running:

.. code-block:: bash

   yarn start

The site should be available at http://localhost:3000/.

.. _fork: http://help.github.com/fork-a-repo/

.. _therapist-install:

Therapist
---------
If you want to automatically enforce Delivery Console's code style guidelines,
you can use the `Therapist`_ pre-commit hook. To install Therapist, simply run:

.. code-block:: bash

   pip install therapist

After that, you should be able to run the following to set up the git
pre-commit hook:

.. code-block:: bash

   therapist install

After that, whenever you make a new commit Therapist will check the changed
code. This will save time when submitting pull requests.

If you want Therapist to attempt to automatically fix linting issues you can
install the hook using:

.. code-block:: bash

   therapist install --fix

If you ever need to bypass Therapist, you can do so by passing
``--no-verify`` to your ``git commit`` command.

.. _Therapist: http://therapist.readthedocs.io/en/latest/overview.html
