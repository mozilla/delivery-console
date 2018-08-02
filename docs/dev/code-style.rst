=====================
Code Style Guidelines
=====================

Goals
=====

* Uniformity in code
    * If you look at code and can tell who wrote it, that’s not good
* Rules should be automatable
* Code should be easy to read / understand

Rules
=====

Prettier formatting (uniformity)
--------------------------------

Delivery Console uses `Prettier`_ to format code. If you set up the
:ref:`Therapist <therapist-install>` pre-commit hook, it can handle formatting
your code automatically.

.. _Prettier: https://prettier.io/

Commenting (uniformity)
-----------------------

Function documentation (jsdoc/docstrings)

.. code-block:: javascript

    /**
     * Given an option and its parent group, update the filter state based on the `isEnabled` prop
     *
     * @param  {Object}  group
     * @param  {Object}  option
     * @param  {Boolean} isEnabled
     */
    function selectFilter({ group, option, isEnabled }) {
      return {
        type: group.value === 'text' ? SET_TEXT_FILTER : SET_FILTER,
        group,
        option,
        isEnabled,
      };
    }

**Rule: Use full width for wrapping comments (80-100 chars)**
