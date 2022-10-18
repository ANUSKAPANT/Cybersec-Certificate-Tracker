# syntax=docker/dockerfile:1
# --platform=linux/amd64
FROM ruby:2.7.2
ENV BUNDLER_VERSION=2.1.4

RUN curl -sL https://deb.nodesource.com/setup_14.x | bash - 
RUN apt-get update -qq && apt-get install -y nodejs postgresql-client 
RUN apt-get install -y build-essential patch ruby-dev zlib1g-dev liblzma-dev libxml2-dev libxslt1-dev
RUN gem install bundler:2.1.4

WORKDIR /app

COPY Gemfile Gemfile.lock ./

RUN npm i -g yarn && yarn

COPY package.json yarn.lock ./
RUN yarn install --check-files
RUN bundle config set force_ruby_platform true
RUN bundle check || bundle install

COPY . ./
ENTRYPOINT ["./entrypoints/docker-entrypoint.sh"]

EXPOSE 3000

CMD ["rails", "server", "--binding", "0.0.0.0"]


# Add a script to be executed every time the container starts.
# COPY entrypoint.sh /usr/bin/
# RUN chmod +x /usr/bin/entrypoint.sh
# ENTRYPOINT ["entrypoint.sh"]
#EXPOSE 3000

# Configure the main process to run when running the image
#CMD ["rails", "server"]