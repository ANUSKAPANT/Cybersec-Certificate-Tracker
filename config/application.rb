require_relative 'boot'

require 'rails/all'

# Require the gems listed in Gemfile, including any gems
# you've limited to :test, :development, or :production.
Bundler.require(*Rails.groups)

module CybersecCertTracker
  class Application < Rails::Application
    # Initialize configuration defaults for originally generated Rails version.
    config.load_defaults 6.0

    # Settings in config/environments/* take precedence over those specified here.
    # Application configuration can go into files in config/initializers
    # -- all .rb files in that directory are automatically loaded after loading
    # the framework and any gems in your application.
    # TODO fix this hardcoding
    #config.web_console.whitelisted_ips = ['172.19.0.1']
    
    # # Check if we use Docker to allow docker ip through web-console
    # if File.file?('/.dockerenv') == true
    #   host_ip = `/sbin/ip route|awk '/default/ { print $3 }'`.strip
    #   config.web_console.whitelisted_ips << host_ip
    # end
  end
end
