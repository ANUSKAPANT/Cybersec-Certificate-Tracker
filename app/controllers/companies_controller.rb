class CompaniesController < ApplicationController
  before_action :set_company, only: %i[update destroy show]

  def index
    render json: CompanySerializer.new(Company.all).serialized_json
  end

  def create
    @company = Company.new(company_params)
    if @company.save
      respond_to do |format|
        format.json  { render json: @company, status: :created }
      end
    else
      respond_to do |format|
        format.json { render json: @company.errors, status: :unprocessable_entity }
      end
    end
  end

  def show
    if @company.present?
      render json: CompanySerializer.new(@company).serialized_json, status: :ok
    else
      render status: :unprocessable_entity
    end
  end

  def update
    if @company.update(company_params)
      respond_to do |format|
        format.json  { render json: @company, status: :created }
      end
    else
      respond_to do |format|
        format.json { render json: @company.errors, status: :unprocessable_entity }
      end
    end
  end

  def destroy
    @company.destroy
  end

  def set_company
    @company = Company.find(params[:id])
  end

  private

  def company_params(params)
    params = params.require(:company).permit(:name, :smc)
  end
end
