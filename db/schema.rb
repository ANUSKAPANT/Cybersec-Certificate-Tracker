# This file is auto-generated from the current state of the database. Instead
# of editing this file, please use the migrations feature of Active Record to
# incrementally modify your database, and then regenerate this schema definition.
#
# This file is the source Rails uses to define your schema when running `rails
# db:schema:load`. When creating a new database, `rails db:schema:load` tends to
# be faster and is potentially less error prone than running all of your
# migrations from scratch. Old migrations may fail to apply correctly if those
# migrations use external dependencies or application code.
#
# It's strongly recommended that you check this file into your version control system.

ActiveRecord::Schema.define(version: 2022_11_29_125703) do

  # These are extensions that must be enabled in order to support this database
  enable_extension "plpgsql"

  create_table "cert_vouchers", force: :cascade do |t|
    t.bigint "student_course_id", null: false
    t.string "certification_name"
    t.date "created_date"
    t.date "expiry_date"
    t.datetime "created_at", precision: 6, null: false
    t.datetime "updated_at", precision: 6, null: false
    t.string "exam_code"
    t.date "exam_date"
    t.string "test_result"
    t.integer "score"
    t.string "test_center_id"
    t.string "voucher_code"
    t.index ["student_course_id"], name: "index_cert_vouchers_on_student_course_id"
  end

  create_table "companies", force: :cascade do |t|
    t.string "name"
    t.boolean "smc"
    t.datetime "created_at", precision: 6, null: false
    t.datetime "updated_at", precision: 6, null: false
  end

  create_table "courses", force: :cascade do |t|
    t.string "name"
    t.bigint "vendor_id", null: false
    t.datetime "created_at", precision: 6, null: false
    t.datetime "updated_at", precision: 6, null: false
    t.index ["vendor_id"], name: "index_courses_on_vendor_id"
  end

  create_table "csv_files", force: :cascade do |t|
    t.string "file_name"
    t.binary "body", null: false
    t.bigint "user_id", null: false
    t.datetime "created_at", precision: 6, null: false
    t.datetime "updated_at", precision: 6, null: false
    t.binary "unsaved_rows"
    t.index ["user_id"], name: "index_csv_files_on_user_id"
  end

  create_table "student_courses", force: :cascade do |t|
    t.bigint "student_id", null: false
    t.bigint "course_id", null: false
    t.date "registration_date"
    t.boolean "canvas_course_completion"
    t.string "dcldp_code"
    t.boolean "voucher_purchased"
    t.string "test_result"
    t.datetime "created_at", precision: 6, null: false
    t.datetime "updated_at", precision: 6, null: false
    t.index ["course_id"], name: "index_student_courses_on_course_id"
    t.index ["student_id"], name: "index_student_courses_on_student_id"
  end

  create_table "students", force: :cascade do |t|
    t.string "first_name"
    t.string "last_name"
    t.string "canvas_id"
    t.string "title"
    t.bigint "company_id", null: false
    t.string "email_id"
    t.datetime "created_at", precision: 6, null: false
    t.datetime "updated_at", precision: 6, null: false
    t.index ["company_id"], name: "index_students_on_company_id"
  end

  create_table "users", force: :cascade do |t|
    t.string "email", default: "", null: false
    t.string "encrypted_password", default: "", null: false
    t.string "reset_password_token"
    t.datetime "reset_password_sent_at"
    t.datetime "remember_created_at"
    t.datetime "created_at", precision: 6, null: false
    t.datetime "updated_at", precision: 6, null: false
    t.string "token"
    t.integer "role", default: 0
    t.string "first_name"
    t.string "last_name"
    t.index ["email"], name: "index_users_on_email", unique: true
    t.index ["reset_password_token"], name: "index_users_on_reset_password_token", unique: true
  end

  create_table "vendors", force: :cascade do |t|
    t.string "name"
    t.datetime "created_at", precision: 6, null: false
    t.datetime "updated_at", precision: 6, null: false
  end

  add_foreign_key "cert_vouchers", "student_courses"
  add_foreign_key "courses", "vendors"
  add_foreign_key "csv_files", "users"
  add_foreign_key "student_courses", "courses"
  add_foreign_key "student_courses", "students"
  add_foreign_key "students", "companies"
end
