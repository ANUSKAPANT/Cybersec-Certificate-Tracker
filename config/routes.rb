Rails.application.routes.draw do
  # root to react app
  root 'certificates#index'

  # rails specific routes
  # resources :users

  # add rails specific routes above this line
  # all non-rails routes will be caught by react app
  get '*path', to: 'certificates#index', via: :all, constraints: lambda { |req|
    req.path.exclude? 'rails/active_storage'
  }
end
