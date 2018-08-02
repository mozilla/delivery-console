Updating The Documentation
==========================

You need to have Python to build the documentation locally.

The documentation is built automatically in our continuous integration every
time a commit is pushed.

To build the documentation, create and activate a Python virtualenv.
For example:

.. code-block:: shell

   $ virtualenv -p `which python3.6` .venv
   $ source .venv/bin/activate

Now install the Sphinx packages:

.. code-block:: shell

   (.venv) $ pip install -r docs/requirements.txt

Now you should be able to build:

.. code-block:: shell

   (.venv) $ cd docs
   (.venv) $ make html

Watch out for build errors but if all goes well, you can now open the built HTML
files in your browser. E.g.:

.. code-block:: shell

   (.venv) $ open _build/html/index.html
