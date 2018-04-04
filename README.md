# delivery-console

[![CircleCI](https://circleci.com/gh/mozilla/delivery-console.svg?style=svg)](https://circleci.com/gh/mozilla/delivery-console)
[![Documentation Status](https://readthedocs.org/projects/delivery-console/badge/?version=latest)](http://delivery-console.readthedocs.io/en/latest/?badge=latest)

One admin to rule them all

[Documentation on ReadTheDocs](https://delivery-console.readthedocs.io/)

# Contributing

When contributing code to the repository, here are a few things to know:

- you should create a branch on your own fork, and create a pull-request from there
- the pull-requests will all run in CircleCI
- CircleCI builds will fail if there's any linting issues. You can check linting issues with `yarn run lint`, and auto-fix [prettier](https://prettier.io/) issues using `yarn run lint:prettierfix`
- pre-commit hooks will block your commit if there are linting issues. You can (but should not) skip the pre-commit hooks with `git commit --no-verify ...`

Regarding `prettier`, it's very convenient to [configure your editor](https://prettier.io/docs/en/editors.html) to "auto-format on save".
