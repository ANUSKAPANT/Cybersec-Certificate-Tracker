#The Neighbors-Cybersec Cert Tacker

```shell
git clone
```
ruby version = 2.7.2

Run With Docker
1. Install Docker Desktop
2. Build
```shell
docker compose up --build
```
3. Create Database, Run Migration and Seed
```shell
docker-compose exec app rake db:setup db:migrate db:seed
```

4. To run all tests
```shell
 docker-compose run -e "RAILS_ENV=test" app bundle exec rspec spec/
```

Run Locally Without Docker

1. Install Dependencies
```shell
bundle install
```

```shell
yarn install
```

2. Create Database
```shell
rails db:create
```

3. Migrate Database
```shell
rails db:migrate
```

4. Run webpack development server
```shell
./bin/webpack --watch
```

5. Run rails server
```shell
rails server
```

6. Run rails rspec test
```shell
rspec
```

7. Run postgres server locally or via docker
Dev postgres docker
```shell
docker-compose up -d
```