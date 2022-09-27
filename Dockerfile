# syntax=docker/dockerfile:1
# --platform=linux/amd64
FROM ruby:2.7.2 
# RUN curl https://deb.nodesource.com/setup_14.x | bash
# RUN curl https://dl.yarnpkg.com/debian/pubkey.gpg | apt-key add -
# RUN echo "deb https://dl.yarnpkg.com/debian/ stable main" | tee /etc/apt/sources.list.d/yarn.list
RUN apt-get update -qq && apt-get install -y nodejs postgresql-client 
RUN apt-get install -y build-essential patch ruby-dev zlib1g-dev liblzma-dev libxml2-dev libxslt1-dev

# Install yarn from the local .tgz
RUN apt-get install -y apt-transport-https ca-certificates yarn

COPY . /app
WORKDIR /app
RUN bundle config set force_ruby_platform true
RUN bundle install
RUN yarn install

# Add a script to be executed every time the container starts.
# COPY entrypoint.sh /usr/bin/
# RUN chmod +x /usr/bin/entrypoint.sh
# ENTRYPOINT ["entrypoint.sh"]
EXPOSE 3000

# Configure the main process to run when running the image
CMD ["rails", "server"]