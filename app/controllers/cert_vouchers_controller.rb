class CertVouchersController < ApplicationController
    before_action :set_cert_voucher, only: %i[update destroy show]
  
    def index
      render json: CertVoucherSerializer.new(CertVoucher.all).serialized_json
    end
  
    def create
      @cert_voucher = CertVoucher.new(cert_voucher_params(params))
      if @cert_voucher.save
        respond_to do |format|
          format.json  { render json: @cert_voucher, status: :created }
        end
      else
        respond_to do |format|
          format.json { render json: @cert_voucher.errors, status: :unprocessable_entity }
        end
      end
    end
  
    def show
      if @cert_voucher.present?
        render json: CertVoucherSerializer.new(@cert_voucher).serialized_json, status: :ok
      else
        render status: :unprocessable_entity
      end
    end
  
    def update
      if @cert_voucher.update(cert_voucher_params)
        respond_to do |format|
          format.json  { render json: @cert_voucher, status: :created }
        end
      else
        respond_to do |format|
          format.json { render json: @cert_voucher.errors, status: :unprocessable_entity }
        end
      end
    end
  
    def destroy
      @cert_voucher.destroy
    end
  
    def set_cert_voucher
      @cert_voucher = CertVoucher.find(params[:id])
    end
  
    private
  
    def cert_voucher_params(params)
      params = params.require('cert_voucher').permit(:std_crse_id, :certification_name, :created_date, :expiry_date)
    end
  end
  