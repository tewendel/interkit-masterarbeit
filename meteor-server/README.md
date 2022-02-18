# setup

````
npm install
cp .env.example .env
````

- set values in .env

# run

`meteor`

# docker

- based on [this](https://github.com/disney/meteor-base)
- after meteor update
  - change both FROM to match the new meteor and node versions
- check [this](https://github.com/disney/meteor-base/blob/master/example/app-with-native-dependencies.dockerfile) if building native dependencies is required