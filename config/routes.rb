Rails.application.routes.draw do
  
  resources :student_infos
  get 'home/form'
  get 'home/upload_csv'
  post 'uploaded_files/create'
  devise_for :users, controllers: {
    sessions: 'users/sessions'
  }
  root "homes#index"
  match '*path', to: 'homes#index', via: :all
  # For details on the DSL available within this file, see https://guides.rubyonrails.org/routing.html
end