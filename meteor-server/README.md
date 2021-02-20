# setup

`npm install`

- set absolute path of project respositories directory REPOSITORIES_PATH in .env

# run

`meteor`

# docker

- based on [this](https://github.com/disney/meteor-base)
- after meteor update
  - change both FROM to math the new meteor and node versions
- check [this](https://github.com/disney/meteor-base/blob/master/example/app-with-native-dependencies.dockerfile) if building native dependencies is required