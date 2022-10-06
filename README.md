```shell
git clone
```
ruby version = 2.7.2

Install Dependencies
```shell
bundle install
```

```shell
yarn install
```

Create Database
```shell
rails db:create
```

Migrate Database
```shell
rails db:migrate
```

Run webpack development server
```shell
./bin/webpack --watch
```

Run rails server
```shell
rails server
```

Run rails rspec test
```shell
RAILS_ENV=test rspec
```

Dev postgres
```shell
docker-compose up -d
```

Prod setup
```shell
docker-compose -f docker-compose.prod.yml up -d
```