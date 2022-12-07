require 'rails_helper'

RSpec.describe CertVouchersController, type: :controller do
  before (:each) do
    create(:user)
    request.headers.merge!({ "Authorization": "Bearer #{User.first.token}" })
  end
  describe "GET index" do
    it "returns a successful response" do
      get :index
      expect(response).to be_successful
    end
  end

  describe 'PATCH update' do
    it 'updates the cert voucher' do
      create :cert_voucher
      cert_voucher = CertVoucher.new(student_course_id: StudentCourse.first.id, certification_name: "Abc", created_date: "02-01-2022", expiry_date: "02-01-2023", voucher_code: "45865", test_result: "pass", score: "20", test_center_id: "533")
      cert_voucher.save
      patch :update, params: { id: cert_voucher.id, certification_name: "ccc" }
      expect(response).to have_http_status(200)
    end

    it 'does not update the cert voucher' do
      create :cert_voucher
      cert_voucher = CertVoucher.new(student_course_id: StudentCourse.first.id, certification_name: "Abc", created_date: "02-01-2022", expiry_date: "02-01-2023", voucher_code: "45865", test_result: "pass", score: "20", test_center_id: "533")
      cert_voucher.save
      patch :update, params: { id: cert_voucher.id, certification_name: nil }
      expect(response).to have_http_status(422)
    end
  end

  describe 'GET show' do
    it 'shows the cert voucher' do
      create :cert_voucher
      cert_voucher = CertVoucher.new(student_course_id: StudentCourse.first.id, certification_name: "Abc", created_date: "02-01-2022", expiry_date: "02-01-2023", voucher_code: "45865", test_result: "pass", score: "20", test_center_id: "533")
      cert_voucher.save
      get :show, params: { id: cert_voucher.id }
      expect(response).to have_http_status(200)
    end
  end

  describe 'POST create' do
    it 'creates an cert voucher and renders a successful response' do
      create :cert_voucher
      post :create, params: {student_course_id: StudentCourse.first.id, certification_name: "Abc", created_date: "02-01-2022", expiry_date: "02-01-2023", voucher_code: "45865", test_result: "pass", score: "20", test_center_id: "533"}
      expect(response).to have_http_status(200)
    end

    it 'does not create a cert voucher' do
      post :create, params: { id: nil }
      expect(response).to have_http_status(422)
    end
  end

  describe 'DESTROY delete' do
    it 'deletes an cert voucher and renders a successful response' do
      create :cert_voucher
      cert_voucher = CertVoucher.new(student_course_id: StudentCourse.first.id, certification_name: "Abc", created_date: "02-01-2022", expiry_date: "02-01-2023", voucher_code: "45865", test_result: "pass", score: "20", test_center_id: "533")
      cert_voucher.save
      delete :destroy, params: { id:cert_voucher.id }
      expect(response).to have_http_status(204)
    end
  end
end