Rails.application.routes.draw do
  post 'dashboard/upload_file', to: 'api/v1/dashboard#upload_file'
  devise_for :users, controllers: {
    sessions: 'users/sessions'
  }
  root "homes#index"
  match '*path', to: 'homes#index', via: :all
  # For details on the DSL available within this file, see https://guides.rubyonrails.org/routing.html
end