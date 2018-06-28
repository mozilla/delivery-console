# CONTRIBUTING

When contributing code to the repository, here are a few things to know:

## CODE

- Push feature branches to your own fork and make pull requests from there to Mozilla.
- The pull-requests will all run in CircleCI.
- Every new developer feature should come with documentation. E.g. "How to run lint checking". New tools and tricks that comes in without documentation is a fail.
- Avoid global CSS that isn't tied to a specific component.
- Run lint check and all tests locally before making a pull request using `yarn run lint`. 
  - This will be enforced by pre-commit hooks that run the linter before every commit. You can (but should not) skip the pre-commit hooks with `git commit --no-verify ...`. See below how to set up the pre-commit hook.
- Don't assume that network calls always work. Check for and deal with failing network calls beyond console.error.
- camelCase all the things (except class names) and camelCase acronyms. I.e. myUrl instead of myURL.
- Favor simple over complex.
- All comments should explain why, never what.
- Favor conformity and consistency instead of personal preference.


## FORMATTING

- CircleCI builds will fail if there's any linting issues. You can check linting issues with `yarn run lint`, and auto-fix some of them using `yarn run lint:prettier-eslintfix`.
- It's very convenient to [configure your editor](https://prettier.io/docs/en/editors.html) to "auto-format on save".


## Setting up a pre-commit hook

We're using [therapist](http://therapist.readthedocs.io/en/latest/overview.html) to run linting on the source code that's about to get committed.

To set it up, you'll need to follow the [installation steps](http://therapist.readthedocs.io/en/latest/overview.html#installing-therapist).

The [configuration](https://github.com/mozilla/delivery-console/blob/master/.therapist.yml) is already done for you, and will run eslint and stylelint on the staged files.


## SOCIAL

- You are not your code. This means that comments on your code don't aim at you, but at how the _code_ can be improved.
- Be kind. To everyone.
- Tell us before tackling a big issue, by commenting in the issue itself and asking to be assigned to it.
- Ask us before adding a new feature or changing a big part of the code, for example by opening an issue. This way, we'll be able to comment on the idea before it's being implemented!
- We don't accept PR that change the formatting (adding or removing all the semicolons for example). We use automatic formatting (see above). If you think we should change the configuration, feel free to open an issue to comment on it.
