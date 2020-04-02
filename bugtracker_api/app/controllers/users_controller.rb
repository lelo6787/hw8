class UsersController < ApplicationController
  before_action :set_user, only: [:show, :update, :destroy]

  # GET /users
  # GET /users.json
  def index
    @users = User.all
    json_response(@users)
  end

  # GET /users/1
  # GET /users/1.json
  def show
    json_response(@user)
  end

  # POST /users
  # POST /users.json
  def create
    @user = User.create!(user_params)
    json_response(@user, :created)
  end

  # PATCH/PUT /users/1
  # PATCH/PUT /users/1.json
  def update
    @user.update(user_params)
    head :no_content
  end

  # DELETE /users/1
  # DELETE /users/1.json
  def destroy
    @user.destroy
  head :no_content
  end

  private
    # Use callbacks to share common setup or constraints between actions.
    def set_user
      @user = User.find(params[:id])
    end

    # Never trust parameters from the scary internet, only allow the white list through.
    def user_params
      params.fetch(:user, {})
      params.require(:user).permit(:lname, :fname, :email, :thumbnail, :created_by)
    end
end
