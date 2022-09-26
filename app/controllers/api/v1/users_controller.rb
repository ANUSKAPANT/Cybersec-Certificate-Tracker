module Api
  module V1
    class UsersController < BaseController
      def index
        @users = User.all
        render json: @users, status: :ok, each_serializer: ::V1::UserSerializer
      end
    end
  end
end