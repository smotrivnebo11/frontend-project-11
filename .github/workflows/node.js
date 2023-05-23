# Name of workflow
name: Node CI

# Trigger the workflow on push or pull request
on:
  - push
  - pull_request

env:
  CI: true

jobs:
  build:

    # The type of machine to run the job on
    runs-on: ubuntu-latest

    strategy:
      # Node versions list
      matrix:
        node-version: [20.x]

    steps:
        # Check-out repository under GitHub workspace
        # https://github.com/actions/checkout
      - uses: actions/checkout@v3
        # Step's name
      - name: Use Node.js ${{ matrix.node-version }}
        # Configures the node version used on GitHub-hosted runners
        # https://github.com/actions/setup-node
        uses: actions/setup-node@v3
        # The Node.js version to configure
        with:
          node-version: ${{ matrix.node-version }}
          cache: 'npm'
      - run: make install
      - run: make lint
      - run: make test
      # - name: Test & publish code coverage
      #   # Publish code coverage on Code Climate
      #   # https://github.com/paambaati/codeclimate-action
      #   uses: paambaati/codeclimate-action@v4.0.0
      #   # Add Code Climate secret key
      #   env:
      #     CC_TEST_REPORTER_ID: ${{ secrets.CC_TEST_REPORTER_ID }}
      #   with:
      #     coverageCommand: make test-coverage
      #     debug: true
