class VendorsController < ApplicationController
  before_action :set_vendor, only: %i[update destroy show]

  def index
    render json: VendorSerializer.new(Vendor.all).serialized_json
  end

  def create
    @vendor = Vendor.new(vendor_params)
    if @vendor.save
      respond_to do |format|
        format.json  { render json: @vendor, status: :created }
      end
    else
      respond_to do |format|
        format.json { render json: @vendor.errors, status: :unprocessable_entity }
      end
    end
  end

  def show
    if @vendor.present?
      render json: VendorSerializer.new(@vendor).serialized_json, status: :ok
    else
      render status: :unprocessable_entity
    end
  end

  def update
    if @vendor.update(vendor_params)
      respond_to do |format|
        format.json  { render json: @vendor, status: :created }
      end
    else
      respond_to do |format|
        format.json { render json: @vendor.errors, status: :unprocessable_entity }
      end
    end
  end

  def destroy
    @vendor.destroy
  end

  def set_vendor
    @vendor = Vendor.find(params[:id])
  end

  private

  def vendor_params(params)
    params = params.require(:vendor).permit(:name)
  end
end
