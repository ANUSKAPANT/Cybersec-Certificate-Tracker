Rails.application.routes.draw do
  namespace :api do
    namespace :v1 do
      post 'dashboard/upload_file'
    end
  end
  devise_for :users, controllers: {
    sessions: 'users/sessions'
  }
  root "homes#index"
  match '*path', to: 'homes#index', via: :all
  # For details on the DSL available within this file, see https://guides.rubyonrails.org/routing.html
end