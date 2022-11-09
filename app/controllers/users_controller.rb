class UsersController < BaseController
  before_action :set_user, only: %i[update destroy show]
  def index
    @users = User.all
    render json: UserSerializer.new(@users).serialized_json
  end

  def create
    @user = User.new(user_params)
    if @user.save
      render json: @user, status: :created
    else
      render json: @user.errors, status: :unprocessable_entity
    end
  end

  def show
    render json: UserSerializer.new(@user).serialized_json, status: :ok
  end

  def update
    if @user.update(user_params)
      render json: @user, status: :created
    else
      render json: @user.errors, status: :unprocessable_entity
    end
  end

  def destroy
    @user.destroy
  end

  private

  def set_user
    @user = User.find(params[:id])
  end

  def user_params
    params.permit(:email, :password, :first_name, :last_name, :role)
  end
end
