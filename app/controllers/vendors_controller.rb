class VendorsController < BaseController
  before_action :set_vendor, only: %i[update destroy show]

  def index
    options = { include: [:courses] }
    render json: VendorSerializer.new(Vendor.all, options).serialized_json
  end

  def create
    options = { include: [:courses] }
    @vendor = Vendor.new(vendor_params)
    if @vendor.save
      render json: VendorSerializer.new(@vendor, options).serialized_json, status: :ok
    else
      render json: @vendor.errors, status: :unprocessable_entity
    end
  end

  def show
    options = { include: [:courses] }
    render json: VendorSerializer.new(@vendor, options).serialized_json, status: :ok
  end

  def update
    options = { include: [:courses] }
    if @vendor.update(vendor_params)
      render json: VendorSerializer.new(@vendor, options).serialized_json, status: :ok
    else
      render json: @vendor.errors, status: :unprocessable_entity
    end
  end

  def destroy
    @vendor.destroy
  end

  private

  def set_vendor
    @vendor = Vendor.find(params[:id])
  end

  def vendor_params
    params.permit(:name, course_ids: [])
  end
end
