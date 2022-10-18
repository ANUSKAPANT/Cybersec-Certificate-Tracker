Rails.application.routes.draw do
  resources :csv_files
  devise_for :users, controllers: {
    sessions: 'users/sessions'
  }
  root "homes#index"
  match '*path', to: 'homes#index', via: :all
  # For details on the DSL available within this file, see https://guides.rubyonrails.org/routing.html
end