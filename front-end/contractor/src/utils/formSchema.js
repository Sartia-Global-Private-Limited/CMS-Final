import * as Yup from "yup";
const phoneRegExp = /^[6-9]{1}[0-9]{9}$/;
const phoneRegExp2 = /^\+91[6-9]{1}[0-9]{9}$|^[6-9]{1}[0-9]{9}$/;

export const loginSchema = Yup.object().shape({
  // firstName: Yup.string()
  //     .min(2, 'Too Short!')
  //     .max(50, 'Too Long!')
  //     .required('Required'),
  // lastName: Yup.string()
  //     .min(2, 'Too Short!')
  //     .max(50, 'Too Long!')
  //     .required('Required'),
  email: Yup.string()
    .email("please enter valid email")
    .required("Email is Required"),
  password: Yup.string().min(6, "Too Short!").required("Password is Required"),
  // phone: Yup.number().typeError("number only").min(6, 'Too Short!').required('Email is Required'),
});

export const AddWalletBalanceSchema = Yup.object().shape({
  id: Yup.string().required("Account is Required"),
  balance: Yup.string().required("Amount is Required"),
  remark: Yup.string()
    .min(2, "Too Short!")
    .max(50, "Too Long!")
    .required("Remark is Required"),
  transaction_id: Yup.string()
    .min(2, "Too Short!")
    .max(50, "Too Long!")
    .required("Transaction id is Required"),
});

export const MyprofileSchema = Yup.object().shape({
  name: Yup.string()
    .min(2, "Too Short!")
    .max(50, "Too Long!")
    .required("Required"),
  email: Yup.string()
    .email("please enter valid email")
    .required("Email is Required"),
  contact_no: Yup.string().required("contact Number is Required"),
});
export const forgotPasswordSchema = Yup.object().shape({
  email: Yup.string().email("Invalid email").required("Email is Required"),
});

export const otpSchema = Yup.object().shape({
  otp: Yup.number()
    .required("otp is required")
    .min(6, "otp must be at least 6 characters"),
});
export const ChangePasswordSchema = Yup.object().shape({
  old_password: Yup.string().trim().required("Password is Required"),
  new_password: Yup.string()
    .min(6, "Password must be at least 6 characters")
    .required("Password is Required"),
  confirm_password: Yup.string()
    .oneOf([Yup.ref("new_password"), null], "Passwords must match")
    .required("Confirm Password is Required"),
});
// master data only
export const addZoneSchema = Yup.object().shape({
  energy_company_id: Yup.string()
    .trim()
    .required("Energy Company name is Required"),
  zone_name: Yup.string().trim().required("Zone name is Required"),
  description: Yup.string().trim().required("Zone description is Required"),
});
export const addROSchema = Yup.object().shape({
  energy_company_id: Yup.string()
    .trim()
    .required("Energy Company name is Required"),
  zone_id: Yup.string().trim().required("Zone Name is Required"),
  regional_office_name: Yup.string()
    .trim()
    .required("Regional Office Name is Required"),
  code: Yup.string().trim().required("Code is Required"),
  address_1: Yup.string().trim().required("Address is Required"),
  regional_status: Yup.string().trim().required("Regional Status is Required"),
});
export const addSalesAreaSchema = Yup.object().shape({
  energy_company_id: Yup.string()
    .trim()
    .required("Energy Company name is Required"),
  zone_id: Yup.string().trim().required("Zone Name is Required"),
  regional_office_name: Yup.string()
    .trim()
    .required("Regional Office Name is Required"),
  sales_area_name: Yup.string().trim().required("Sales Area Name is Required"),
  sales_area_status: Yup.string()
    .trim()
    .required("Sales Area Status is Required"),
});
export const importComplaintsSchema = Yup.object().shape({
  energy_company_id: Yup.string().required("Energy Company is Required"),
  zone_id: Yup.string().required("Zone is Required"),
  regional_id: Yup.string().required("Regional Office is Required"),
  sales_area_id: Yup.string().required("Sale Area is Required"),
});
export const importOutletsSchema = Yup.object().shape({
  energy_company_id: Yup.string().required("Energy Company is Required"),
  zone_id: Yup.string().required("Zone is Required"),
  regional_id: Yup.string().required("Regional Office is Required"),
  sales_area_id: Yup.string().required("Sale Area is Required"),
  district_id: Yup.string().required("District is Required"),
});
export const addDistrictSchema = Yup.object().shape({
  energy_company_id: Yup.string()
    .trim()
    .required("Energy Company name is Required"),
  zone_id: Yup.string().trim().required("Zone Name is Required"),
  ro_id: Yup.string().trim().required("Regional Office Name is Required"),
  sales_area_id: Yup.string().trim().required("Sales Area Name is Required"),
  district_name: Yup.string().trim().required("District Name is Required"),
  status: Yup.string().trim().required("District Status is Required"),
});
export const addOutletsSchema = Yup.object().shape({
  energy_company_id: Yup.object().required("energy company Name is Required"),
  zone_id: Yup.object().required("zone Name is Required"),
  regional_id: Yup.object().required("regional Name is Required"),
  sales_area_id: Yup.object().required("sales area Name is Required"),
  district_id: Yup.object().required("district Name is Required"),
  outlet_name: Yup.string().required("outlet Name is Required"),
  outlet_contact_number: Yup.string()
    .matches(phoneRegExp, "outlet contact number is not valid")
    .typeError("outlet contact number. must be a number")
    .min(10, "Enter minimum 10 character")
    .required("outlet contact number. is a Required"),
  customer_code: Yup.string().trim().required("customer code is Required"),
  outlet_category: Yup.string().trim().required("outlet category is Required"),
  outlet_unique_id: Yup.string()
    .trim()
    .required("outlet unique id is Required"),
  outlet_ccnoms: Yup.string().trim().required("outlet ccnoms is Required"),
  outlet_ccnohsd: Yup.string().trim().required("outlet ccnohsd is Required"),
  outlet_contact_person_name: Yup.string()
    .trim()
    .required("outlet person name is Required"),
  primary_email: Yup.string()
    .email("Invalid email")
    .required("primary Email is Required"),
  email: Yup.string().email("Invalid email").required("Email is Required"),
  password: Yup.string()
    .min(6, "Password must be at least 6 characters")
    .required("Password is Required"),
  primary_number: Yup.string()
    .matches(phoneRegExp, "Company Mobile is not valid")
    .typeError("Company Mobile. must be a number")
    .min(10, "Enter minimum 10 character")
    .required("primary number. is a Required"),
  location: Yup.string().trim().required("location is Required"),
  address: Yup.string().trim().required("address is Required"),
});

export const updateOutletsSchema = Yup.object().shape({
  energy_company_id: Yup.object().required("energy company Name is Required"),
  zone_id: Yup.object().required("zone Name is Required"),
  regional_id: Yup.object().required("regional Name is Required"),
  sales_area_id: Yup.object().required("sales area Name is Required"),
  district_id: Yup.object().required("district Name is Required"),
  outlet_name: Yup.string().required("outlet Name is Required"),
  outlet_contact_number: Yup.string()
    .matches(phoneRegExp, "outlet contact number is not valid")
    .typeError("outlet contact number. must be a number")
    .min(10, "Enter minimum 10 character")
    .required("outlet contact number. is a Required"),
  customer_code: Yup.string().trim().required("customer code is Required"),
  outlet_category: Yup.string().trim().required("outlet category is Required"),
  outlet_unique_id: Yup.string()
    .trim()
    .required("outlet unique id is Required"),
  outlet_ccnoms: Yup.string().trim().required("outlet ccnoms is Required"),
  email: Yup.string().email("Invalid email").required("Email is Required"),
  outlet_ccnohsd: Yup.string().trim().required("outlet ccnohsd is Required"),
  outlet_contact_person_name: Yup.string()
    .trim()
    .required("outlet person name is Required"),
  primary_email: Yup.string()
    .email("Invalid email")
    .required("primary Email is Required"),

  primary_number: Yup.string()
    .matches(phoneRegExp, "Company Mobile is not valid")
    .typeError("Company Mobile. must be a number")
    .min(10, "Enter minimum 10 character")
    .required("primary number. is a Required"),
  location: Yup.string().trim().required("location is Required"),
  address: Yup.string().trim().required("address is Required"),
});
export const addDealersSchema = Yup.object().shape({
  name: Yup.string().trim().required("Name is Required"),
  email: Yup.string().email("Invalid email").required("Email is Required"),
});

export const paymentSchema = Yup.object().shape({
  pv_number: Yup.string().required("PV number is required"),
  receipt_date: Yup.date()
    .required("voucher date is required")
    .typeError("Invalid date format"),

  invoiceData: Yup.array().of(
    Yup.object().shape({
      amount_received: Yup.string().required("Recieved amount is required"),
    })
  ),
});

export const verifyOtp = Yup.object().shape({
  otp: Yup.number().required("otp is required"),
  payment_mode: Yup.object().required("payment mode is required"),
});

export const PayROAmount = Yup.object().shape({
  payment_mode: Yup.object().required("payment mode is required"),
});

export const addContractorsSchema = Yup.object().shape({
  name: Yup.string().trim().required("Name is Required"),
  email: Yup.string().email("Invalid email").required("Email is Required"),
});
export const addGroupInsuranceSchema = Yup.object().shape({
  insurance_applied_on: Yup.array()
    .min(1, "Select at least one")
    .required("Outlet is Required"),
  insurance_plan_id: Yup.string().required("Insurance plan is Required"),
  insurance_company_id: Yup.string().required("Insurance company is Required"),
  insurance_deduction_amount: Yup.string()
    .trim()
    .required("Insurance deduction amount is Required"),
});

export const importComplaintTypeSchema = Yup.object().shape({
  energy_company_id: Yup.string().required("Enery Company is Required"),
  zone_id: Yup.string().required("Zone is Required"),
  ro_id: Yup.string().required("Regional Office is Required"),
  order_via_id: Yup.string().required("Order Via is Required"),
  order_by_id: Yup.string().required("Order By is Required"),
  sale_area_id: Yup.string().required("Sales Area is Required"),
  outlet_id: Yup.string().required("Outlet is Required"),
  complaint_type: Yup.string().required("Complaint Type is Required"),
  excel: Yup.string().required("File is Required"),
});
export const addComplaintTypeSchema = Yup.object().shape({
  energy_company_id: Yup.string().required("Enery Company is Required"),
  zone_id: Yup.string().required("Zone is Required"),
  ro_id: Yup.string().required("Regional Office is Required"),
  order_via_id: Yup.string().required("Order Via is Required"),
  order_by_id: Yup.string().required("Order By is Required"),
  sale_area_id: Yup.string().required("Sales Area is Required"),
  outlet_id: Yup.string().required("Outlet is Required"),
  complaint_type: Yup.string().required("Complaint Type is Required"),
});
export const importComplaintTypeForOtherSchema = Yup.object().shape({
  energy_company_id: Yup.string().required("Company is Required"),
  order_via_id: Yup.string().required("Order Via is Required"),
  order_by: Yup.string().required("Order By is Required"),
  complaint_type: Yup.string().required("Complaint Type is Required"),
  excel: Yup.string().required("File is Required"),
});
export const addComplaintTypeForOtherSchema = Yup.object().shape({
  energy_company_id: Yup.string().required("Company is Required"),
  order_via_id: Yup.string().required("Order Via is Required"),
  order_by: Yup.string().required("Order By is Required"),
  complaint_type: Yup.string().required("Complaint Type is Required"),
});
export const addTypesComplaintSchema = Yup.object().shape({
  energy_company_id: Yup.mixed().required("Company Name is Required"),
  complaint_type_name: Yup.string()
    .trim()
    .required("Complaint Type is Required"),
});
export const addEnergySchema = Yup.object().shape({
  email: Yup.string().email("Invalid email").required("Email is Required"),
});
export const addEnergyCompanySchema = Yup.object().shape({
  email: Yup.string().email("Invalid email").required("Email is Required"),
  username: Yup.string().trim().required("username is Required"),

  contact_no: Yup.string()
    .matches(phoneRegExp, "contact number is not valid")
    .typeError("contact number must be a number")
    .min(10, "Enter minimum 10 character")
    .required("contact number is a Required"),
  // joining_date: Yup.string().trim().required("Joining Date is Required"),
  area_name: Yup.object().required("Area name is Required"),
  area_selected: Yup.object().required("Area selected is Required"),
  energy_company_id: Yup.object().required("Company is Required"),
});
export const addMyCompanySchema = Yup.object().shape({
  company_name: Yup.string().trim().required("Company Name is Required"),
  company_contact: Yup.number()
    .typeError("Enter number only")
    .required("Company Contact Number is Required"),
  company_mobile: Yup.number()
    .typeError("Enter number only")
    .required("Company Mobile is Required"),
  pan_number: Yup.string().trim().required("pan number is Required"),
  company_address: Yup.string().trim().required("company address is Required"),
  primary_contact_email: Yup.string()
    .trim()
    .required("primary contact email is Required"),
  company_contact_person: Yup.string()
    .trim()
    .required("Company Contact Person is Required"),
  primary_contact_number: Yup.number()
    .typeError("Enter number only")
    .required("Primary Contact Number is Required"),
  gst_treatment_type: Yup.string().required("GST Treatment Type is Required"),
  business_legal_name: Yup.string()
    .trim()
    .required("Business Legal Name is Required"),
  // company_type: Yup.string().trim().required("Company Type is Required"),
  state: Yup.string().required("State is Required"),
  city: Yup.string().required("City is Required"),
  pin_code: Yup.string().required("Pin Code is Required"),
  gst_details: Yup.array().of(
    Yup.object().shape({
      gst_number: Yup.string().trim().required("gst number is Required"),
      billing_address: Yup.string()
        .trim()
        .required("billing address is Required"),
    })
  ),
});
export const importAllCompanySchema = Yup.object().shape({
  state: Yup.string().required("State is Required"),
  city: Yup.string().required("City is Required"),
});
export const addTutorialsSchema = Yup.object().shape({
  user_type: Yup.string().required("Software User Type is Required"),
  application_type: Yup.array().min(1, "Application Type is Required"),
  module_type: Yup.string().required("Module Type is Required"),
  tutorial_format: Yup.string().required("Tutorial Format is Required"),
});
export const addRolesSchema = Yup.object().shape({
  name: Yup.string().trim().required("Name is Required"),
});
export const addHrTeamSchema = Yup.object().shape({
  manager_id: Yup.string().required("Team Manager is Required"),
  supervisor_id: Yup.string().required("supervisor is Required"),
  members: Yup.array()
    .min(1, "Select at least one Member")
    .required("Team Member is Required"),
  team_name: Yup.string().trim().required("Team Name is Required"),
});
export const addTeamMemberListSchema = Yup.object().shape({
  user_id: Yup.array()
    .min(1, "Select at least one User")
    .required("User is Required"),
});
export const importEmployeeSchema = Yup.object().shape({
  role_id: Yup.string().trim().required("Role is Required"),
  data: Yup.string().trim().required("File is Required"),
});
export const addEmployeeSchema = Yup.object().shape({
  name: Yup.string().trim().required("Name is Required"),
  email: Yup.string()
    .email("please enter valid email")
    .required("Email is Required"),
  mobile: Yup.number()
    .typeError("Enter number only")
    .required("Phone Number is Required"),
  joining_date: Yup.string().trim().required("Joining Date is Required"),
  aadhar: Yup.string().trim().required("aadhar number is Required"),
  salary: Yup.string().trim().required("Salary is Required"),
  role_id: Yup.string().required("Role is Required"),
  // team_id: Yup.object().required("Team is Required"),
  employment_status: Yup.string().required("employment status is Required"),
  salary_term: Yup.string().required("Salary Term is Required"),
  credit_limit: Yup.string().required("Credit Limit is Required"),
});

export const editEmployeeSchema = addEmployeeSchema.shape({
  image: Yup.mixed(),
  upload_aadhar_card_image1: Yup.mixed(),
  upload_aadhar_card_image2: Yup.mixed(),
  upload_bank_documents: Yup.mixed(),
  upload_pan_card: Yup.mixed(),
});

export const addFeedback = Yup.object().shape({
  title: Yup.string().trim().required("title is Required"),
  description: Yup.string().trim().required("description is Required"),
  status: Yup.object().required("please select!"),
});
export const addResponse = Yup.object().shape({
  response: Yup.string().trim().required("response is Required"),
});
export const addMessageSchema = Yup.object().shape({
  user_id: Yup.string().trim().required("User is Required"),
});
export const addMessageUserSchema = Yup.object().shape({
  company_type: Yup.string().required("Company Type is Required"),
  user_id: Yup.string().required("User is Required"),
});
export const addTaskCategorySchema = Yup.object().shape({
  name: Yup.string().trim().required("Name is Required"),
});
export const addTaskSchema = Yup.object().shape({
  category_id: Yup.string().required("Category is Required"),
  title: Yup.string().trim().required("Title is Required"),
  collaborators: Yup.array()
    .min(1, "Select at least one Collaborator")
    .required("Collaborator is Required"),
  assign_to: Yup.string().required("Assign to is Required"),
  project_name: Yup.string().trim().required("Project Name is Required"),
  start_date: Yup.string().required("Start date is Required"),
  end_date: Yup.string().required("End date is Required"),
});
export const addPlanPricingSchema = Yup.object().shape({
  // name: Yup.string().trim().required("Name is Required"),
});

export const createManuallySchema = Yup.object().shape({
  user_ids: Yup.mixed().required("User Name is Required"),
  attendance_status: Yup.object().required("Attendance Status is Required"),
});
export const createManuallyAttendanceSchema = Yup.object().shape({
  attendance_status: Yup.object().required("Attendance Status is Required"),
});
export const assignLeaveSchema = Yup.object().shape({
  user_id: Yup.string().required("User is Required"),
  leave_type_id: Yup.string().required("Leave Type is Required"),
  start_date: Yup.string().required("Start Date is Required"),
  end_date: Yup.string().required("End Date is Required"),
});
export const addTermConditionSchema = Yup.object().shape({
  title: Yup.string().trim().required("title is Required"),
});
export const addDocumentCategorySchema = Yup.object().shape({
  category: Yup.string().trim().required("Category is Required"),
});
export const addDocumentSchema = Yup.object().shape({
  category_id: Yup.string().required("Category is Required"),
  user_type: Yup.string().required("User Type is Required"),
  user_id: Yup.array().min(1, "Users are Required"),
  remarks: Yup.string().trim().required("Remark is Required"),
});
export const addSurveyItemMasterSchema = Yup.object().shape({
  name: Yup.string().trim().required("Name is Required"),
  rate: Yup.string().trim().required("Rate is Required"),
  rucode: Yup.string().trim().required("rucode is Required"),
  hsncode: Yup.string().trim().required("hsncode is Required"),
  // description: Yup.string().trim().required("description is Required"),
  supplier_id: Yup.object().required("supplier is required"),
  unit_id: Yup.object().required("unit is required"),
  category: Yup.object().required("item category is required"),
});

export const addItemMasterSchema = Yup.object().shape({
  name: Yup.object().required("name is required"),
  hsncode: Yup.string().trim().required("hsncode is required"),
  rucode: Yup.string().trim().required("rucode is required"),
  unit_id: Yup.object().required("unit name is required"),
  category: Yup.object().required("category is required"),
  sub_category: Yup.object().required("Sub Category is required"),
});

export const addSurveyAssignSchema = Yup.object().shape({
  assign_to: Yup.mixed().required("Energy Company is Required"),
});
export const addSurveyPurposeMasterSchema = Yup.object().shape({
  name: Yup.string().trim().required("Name is Required"),
});
export const addEnableDisableSchema = Yup.object().shape({
  // name: Yup.string().trim().required("Name is Required"),
});
export const addInsuranceCompanySchema = Yup.object().shape({
  company_name: Yup.string().trim().required("Company Name is Required"),
  company_code: Yup.string().trim().required("Company Code is Required"),
});
export const addInsuranceCompanyPlansSchema = Yup.object().shape({
  // insurance_company_id: Yup.mixed().required("insurance company Name is Required"),
  policy_name: Yup.string().trim().required("policy name is Required"),
  policy_type: Yup.string().trim().required("policy type is Required"),
  policy_start_date: Yup.string()
    .trim()
    .required("policy start date is Required"),
  policy_end_date: Yup.string().trim().required("policy end date is Required"),
  policy_premium_amount: Yup.string()
    .trim()
    .required("policy premium amount is Required"),
  policy_coverage_limits: Yup.string()
    .trim()
    .required("policy coverage limits is Required"),
  policy_covered_risks: Yup.string()
    .trim()
    .required("policy covered risks is Required"),
  policy_deductible_amount: Yup.string()
    .trim()
    .required("policy deductible amount is Required"),
  policy_renewal_date: Yup.string()
    .trim()
    .required("policy renewal date is Required"),
  policy_tenure: Yup.string().trim().required("policy tenure is Required"),
});
export const addEmployeePensionRetirmentSchema = Yup.object().shape({
  retirement_date: Yup.string().trim().required("retirement date is Required"),
  asset_recovery: Yup.string().trim().required("asset recovery is Required"),
  pension_amount: Yup.string().required("Pension Amount is Required"),
  pension_duration: Yup.string()
    .trim()
    .required("pension duration is Required"),
});

export const addSalaryDisbursalSchema = Yup.object().shape({
  slip_number: Yup.string().trim().required("slip number is Required"),
});

export const addSalarySchema = Yup.object().shape({
  amount: Yup.string().trim().required("Amount is Required"),
  transaction_mode: Yup.string()
    .trim()
    .required("Transaction Mode is Required"),
  transaction_number: Yup.string()
    .trim()
    .required("Transaction Number is Required"),
});

export const addRemarkSchema = Yup.object().shape({
  remark: Yup.string().trim().required("remark is Required"),
});
export const addSurveyOtpSchema = Yup.object().shape({
  mobile: Yup.string()
    .matches(phoneRegExp, "Phone Number is not valid")
    .typeError("Phone No. must be a number")
    .min(10, "Enter minimum 10 character")
    .required("Phone Number is a Required"),
});

// setting
export const addAreaRatio = Yup.object().shape({
  manager_id: Yup.object().required("Area Manager is required"),
  manager_ratio: Yup.number("ratio must be a number").required(
    "ratio is required"
  ),
});
export const addPromotionSchema = Yup.object().shape({
  gst: Yup.number("gst must be a number").required("gst is required"),
  tds: Yup.number("tds must be a number").required("tds is required"),
  tds_with_gst: Yup.number("tds with gst must be a number").required(
    "tds with gst is required"
  ),
  retention_money: Yup.number("retention money must be a number").required(
    "retention money is required"
  ),
  promotion_expense: Yup.number("promotion expense must be a number").required(
    "promotion expense is required"
  ),
  ro_id: Yup.object().required("regional office is required"),
  // man_power: Yup.number("man power must be a number").required(
  //   "man power is required"
  // ),
  // site_expense: Yup.number("site expense must be a number").required(
  //   "site expense is required"
  // ),
  // site_stock: Yup.number("site stock must be a number").required(
  //   "site stock is required"
  // ),
});
// contractor
export const addFundRequestSchema = Yup.object().shape({
  request_data: Yup.array().of(
    Yup.object().shape({
      // user_id: Yup.object().required("is required"),
      request_fund: Yup.array().of(
        Yup.object().shape({
          item_name: Yup.object().required("Item Name is required"),
          request_quantity: Yup.string()
            .trim()
            .required("Quantity is required"),
        })
      ),
      new_request_fund: Yup.array().of(
        Yup.object().shape({
          // title: Yup.string().trim().required("Item Name is required"),
          item_image: Yup.mixed().required("Item Image Required"),
          rate: Yup.string().trim().required("Price is required"),
          qty: Yup.string().trim().required("Quantity is required"),
        })
      ),
    })
  ),
});

export const approveFundRequestSchema = Yup.object().shape({
  request_data: Yup.array().of(
    Yup.object().shape({
      // user_id: Yup.object().required("is required"),
      // request_fund: Yup.array().of(
      //   Yup.object().shape({
      //     price: Yup.number()
      //       .required(" Price is required")
      //       .moreThan(0, "Price must be greater than 0"),
      //     quantity: Yup.number()
      //       .required("Quantity is required")
      //       .moreThan(0, "Quantity must be greater than 0")
      //       .integer("Quantity must be an integer"),
      //   })
      // ),
      new_request_fund: Yup.array().of(
        Yup.object().shape({
          // title: Yup.string().trim().required("Item Name is required"),
          item_image: Yup.mixed().required("Item Image Required"),
          approved_rate: Yup.number().required("Price is required"),
          approved_qty: Yup.number()
            .required("Quantity is required")
            .moreThan(0, "Quantity must be greater than 0")
            .integer("Quantity must be an integer"),
        })
      ),
    })
  ),
});

export const TransferFundSchema = Yup.object().shape({
  remark: Yup.string().required("remark is required"),
  transaction_id: Yup.string().required(" Transaction Id is required"),
  transfer_data: Yup.array().of(
    Yup.object().shape({
      transfer_fund: Yup.array().of(
        Yup.object().shape({
          // transfer_quantity: Yup.string().required("Quantity is required"),
        })
      ),
    })
  ),
});

export const TransferStockSchema = Yup.object().shape({
  remark: Yup.string().required("Remark is required"),
  transaction_id: Yup.string().required(" Transaction Id is required"),
  transfer_data: Yup.array().of(
    Yup.object().shape({
      request_stock: Yup.array().of(
        Yup.object().shape({
          transfer_qty: Yup.string().required("Transfer Quantity is required"),
        })
      ),
    })
  ),
});
export const addStockResuestSchema = Yup.object().shape({
  product_id: Yup.string().trim().required("Product id is Required"),
  rate: Yup.string().trim().required("Rate is Required"),
  supplier_id: Yup.string().trim().required("Supplier id is Required"),
});
export const addWorkQuotationSchema = Yup.object().shape({
  to: Yup.string()
    .email("please enter valid email")
    .required("Email is Required"),
});
export const addQuotationSchema = Yup.object().shape({
  company_from: Yup.object().required("Company From is Required"),
  company_from_state: Yup.object().required("Company From State is Required"),
  company_to: Yup.object().required("Company to is Required"),
  company_to_regional_office: Yup.object().required(
    "Company To Regional Office is Required"
  ),
  quotation_date: Yup.string().trim().required("Quotation Date is Required"),
  outlet: Yup.object().required("Outlet is Required"),
  po_id: Yup.object().required("Po Number is Required"),
  complaint_type: Yup.object().required("Complaint Type is Required"),
  outlet: Yup.string().when("quotation_type", {
    is: "1",
    then: (schema) => schema.required("Outlet is Required"),
  }),
});
export const addBillingTypeSchema = Yup.object().shape({
  name: Yup.string().trim().required("name is Required"),
});
export const addTaxesSchema = Yup.object().shape({
  billing_type_id: Yup.object().required("billing type is Required"),
  value: Yup.string().trim().required("value is Required"),
});
export const addPayrollMasterSettingSchema = Yup.object().shape({
  label: Yup.string().trim().required("Setting name is Required"),
});
export const addTaxManagementSchema = Yup.object().shape({
  title: Yup.string().trim().required("gst title is Required"),
  // percentage: Yup.string()
  //   .matches(/^\d{4}-\d{2}$/, 'Please use this format "00"')
  //   .required("Financial Year is Required"),
  percentage: Yup.string().trim().required("gst percentage is Required"),
});
export const addMeasurementSchema = Yup.object().shape({
  measurement_date: Yup.string().trim().required("is Required"),
  financial_year: Yup.object().required("is Required"),
  po_id: Yup.object().required("is Required"),
  items_data: Yup.array().of(
    Yup.object().shape({
      childArray: Yup.array().of(
        Yup.object().shape({
          description: Yup.string().trim().required("is required"),
        })
      ),
    })
  ),
});
export const addFinancialYearSchema = Yup.object().shape({
  start_date: Yup.string().trim().required("Start Date is Required"),
  // year_name: Yup.string()
  //   .matches(/^\d{4}-\d{2}$/, 'Please use this format "YYYY-YY"')
  //   .required("Financial Year is Required"),
  end_date: Yup.string().trim().required("End Date is Required"),
});
export const addPerformaInvoiceSchema = Yup.object().shape({
  billing_from: Yup.object().required("Billing From is Required"),
  billing_from_state: Yup.object().required("Billing From State is Required"),

  financial_year: Yup.object().required("Financial Year is Required"),
  // po_number: Yup.object().required("Po Number is Required"),
  // measurement_list: Yup.object().required("Measurement List is Required"),
  work: Yup.string().trim().required("Work is Required"),
});
export const addInvoiceSchema1 = Yup.object().shape({
  invoice_date: Yup.string().trim().required("Invoice Date is Required"),
  financial_year: Yup.object().required("Financial Year is Required"),
  callup_number: Yup.string()
    .matches(phoneRegExp, "Callup Number is not valid")
    .typeError("Callup No. must be a number")
    .min(10, "Enter minimum 10 character")
    .required("Callup Number is a Required"),
  measurement_list: Yup.array().required("performa list is Required"),
});
export const addInvoiceSchema = Yup.object().shape({
  invoice_date: Yup.string().trim().required("Invoice Date is Required"),
  due_date: Yup.string().trim().required("Due Date is Required"),
  financial_year: Yup.object().required("Financial Year is Required"),
  measurement_list: Yup.array().required("performa list is Required"),
  regional_office: Yup.object().required("Regional Office is Required"),
  po_number: Yup.object().required("Po Number is Required"),
  callup_number: Yup.string()
    .matches(phoneRegExp, "Callup Number is not valid")
    .typeError("Callup No. must be a number")
    .min(10, "Enter minimum 10 character")
    .required("Callup Number is a Required"),
  estimate_list: Yup.object().required("Estimate List is Required"),
});
export const addPoSchema = Yup.object().shape({
  ro_office: Yup.string().required("Regional Office is Required"),
  state: Yup.string().required("State is Required"),
  po_date: Yup.string().trim().required("Po Date is Required"),
  po_number: Yup.string().trim().required("Po Number is Required"),
  tender_date: Yup.string().trim().required("Tender Date is Required"),
  tender_number: Yup.string().trim().required("Tender Number is Required"),
  work: Yup.string().trim().required("Work is Required"),
  po_items: Yup.array().of(
    Yup.object().shape({
      order_line_number: Yup.string().trim().required("is required"),
      hsn_code: Yup.string().trim().required("is required"),
      name: Yup.string().trim().required("is required"),
      unit: Yup.string().required("is required"),
      change_gst_type: Yup.string().required("is required"),
      rate: Yup.string().required("is required"),
    })
  ),
});
export const addSoSchema = Yup.object().shape({
  ro_office: Yup.string().required("Regional Office is Required"),
  state: Yup.string().required("State is Required"),
  so_date: Yup.string().trim().required("So Date is Required"),
  so_number: Yup.string().trim().required("So Number is Required"),
  tender_date: Yup.string().trim().required("Tender Date is Required"),
  tender_number: Yup.string().trim().required("Tender Number is Required"),
  work: Yup.string().trim().required("Work is Required"),
  so_items: Yup.array().of(
    Yup.object().shape({
      order_line_number: Yup.string().trim().required("is required"),
      hsn_code: Yup.string().trim().required("is required"),
      name: Yup.string().trim().required("is required"),
      unit: Yup.string().required("is required"),
      change_gst_type: Yup.string().required("is required"),
      rate: Yup.string().required("is required"),
    })
  ),
});

export const addSecurityDepositSchema = Yup.object().shape({
  po_id: Yup.object().required("Po Number is Required"),
  date: Yup.string().trim().required("date is Required"),
  amount: Yup.string().trim().required("amount is Required"),
  method: Yup.string().trim().required("method is Required"),
  security_deposit_status: Yup.object().required(
    "Security deposit status is Required"
  ),
});
export const addApproveSecurityRefund = Yup.object().shape({
  payment_reference_number: Yup.string()
    .trim()
    .required("payment reference number is required"),
  date: Yup.string().trim().required("date is required"),
  amount: Yup.string().trim().required("amount is required"),
});
export const addApproveSecurity = Yup.object().shape({
  payment_reference_number: Yup.string()
    .trim()
    .required("reference number is Required"),
  date: Yup.string().trim().required("date is required"),
  amount: Yup.string().trim().required("is required"),
});
export const addCategoryNameSchema = Yup.object().shape({
  category_name: Yup.string().trim().required("Category Name is Required"),
});
export const addBrandSchema = Yup.object().shape({
  brand_name: Yup.string().trim().required("brand Name is Required"),
});
export const addSubCategorySchema = Yup.object().shape({
  name: Yup.string().trim().required("Name is Required"),
  status: Yup.string().required("Status is Required"),
});
export const addLoanSchema = Yup.object().shape({
  user_id: Yup.string().required("User is Required"),
  interest_mode: Yup.string().required("Interest Mode is Required"),
  payment_mode: Yup.string().required("Payment Mode is Required"),
  loan_amount: Yup.string().trim().required("Loan amount is Required"),
  loan_type: Yup.string().required("Loan type is Required"),
  loan_term: Yup.string().trim().required("Loan term is Required"),
  interest_rate: Yup.string().trim().required("Interest rate is Required"),
  remarks: Yup.string().trim().required("Remarks is Required"),
});
export const addEmployeePromotionDemotionSchema = Yup.object().shape({
  user_id: Yup.string().required("User is Required"),
  purpose: Yup.string().required("Purpose is Required"),
  new_designation: Yup.string().required("New designation is Required"),
  change_in_salary: Yup.string().required("Change in salary is Required"),
  new_team: Yup.string().required("Team is Required"),
  change_in_salary_type: Yup.string().required(
    "Change in salary type is Required"
  ),
  change_in_salary_value: Yup.string().trim().required("Value is Required"),
  reason: Yup.string().trim().required("reason is Required"),
});
export const addSendMessage = Yup.object().shape({
  to: Yup.array()
    .min(1, "Select at least one Member")
    .required("Member is Required"),
  title: Yup.string().trim().required("Subject is required"),
  message: Yup.string().trim().required("Message is required"),
});
export const addUnitDataSchema = Yup.object().shape({
  name: Yup.string().trim().required("Name is Required"),
  short_name: Yup.string().trim().required("Short Name is Required"),
});
export const addProductSchema = Yup.object().shape({
  product_name: Yup.string().trim().required("Product Name is Required"),
  category_id: Yup.object().required("Category is Required"),
  price: Yup.number().required("Price is Required"),
  quantity: Yup.string().trim().required("Quantity is Required"),
  alert_quantity: Yup.string().trim().required("Alert Quantity is Required"),
});
export const importSupplierSchema = Yup.object().shape({
  bank_id: Yup.string().required("Bank is Required"),
  state: Yup.string().required("State is Required"),
  city: Yup.string().required("City is Required"),
  excel: Yup.string().required("File is Required"),
});
export const addSupplierSchema = Yup.object().shape({
  supplier_name: Yup.string().trim().required("Supplier Name is Required"),
  owner_name: Yup.string().trim().required("Owner Name is Required"),
  cashier_name: Yup.string().trim().required("Cashier Name is Required"),
  bank_id: Yup.string().required("Bank Name is Required"),
  account_holder_name: Yup.string()
    .trim()
    .required("Account Holder Name is Required"),
  account_number: Yup.string().trim().required("Account Number is Required"),
  branch_name: Yup.string().trim().required("Branch Name is Required"),
  ifsc_code: Yup.string().trim().required("Ifsc Code is Required"),
});
export const addUserIdSchema = Yup.object().shape({
  user_id: Yup.object().required("User is Required"),
});
export const addAssetSchema = Yup.object().shape({
  asset_name: Yup.string().trim().required("Asset Name is Required"),
  asset_price: Yup.string().trim().required("Price is Required"),
  asset_uin_number: Yup.string().trim().required("uin no is Required"),
  asset_model_number: Yup.string()
    .trim()
    .required("Asset Model Number is Required"),
});
export const addRequireSchema = Yup.object().shape({
  asset_id: Yup.object().required("Asset Name is Required"),
  description: Yup.string().trim().required("Description is Required"),
});
export const addOrderViaSchema = Yup.object().shape({
  order_via: Yup.string().trim().required("Order Via Name is Required"),
});
export const addEarthingTestingSchema = Yup.object().shape({
  complaint_id: Yup.string().required("Complaint is Required"),
  outlet_id: Yup.array()
    .min(1, "Select at least one Outlet")
    .required("Outlet is Required"),
  user_id: Yup.array()
    .min(1, "Select at least one User")
    .required("User is Required"),
  expire_date: Yup.string().required("expire date is Required"),
});
export const addBankDataSchema = Yup.object().shape({
  bank_name: Yup.string().trim().required("bank name is Required"),
  website: Yup.string().url("Invalid URL").required("website is Required"),
  logo: Yup.mixed()
    .test("fileType", "Unsupported file type", (value) => {
      if (!value) return true;
      const supportedTypes = ["image/jpeg", "image/jpg", "image/png"];
      return supportedTypes.includes(value.type);
    })
    .test("fileSize", "logo is too large", (value) => {
      if (!value) return true;
      return value.size <= 1048576;
    }),
});

export const addWorkImagesSchema = Yup.object().shape({
  main_image: Yup.array().of(
    Yup.object().shape({
      row_title: Yup.string().trim().required("Row Title is required"),
      before_image: Yup.object().shape({
        title: Yup.string().trim().required("Before Image Title is required"),
        // description: Yup.string().trim().required(
        //   "Before Image Description is required"
        // ),
        file: Yup.string().trim().required("Before Image File is required"),
      }),
      // progress_image: Yup.object().shape({
      //   title: Yup.string().trim().required('Progress Image Title is required'),
      //   description: Yup.string().trim().required('Progress Image Description is required'),
      //   file: Yup.string().trim().required('Progress Image File is required'),
      // }),
      after_image: Yup.object().shape({
        title: Yup.string().trim().required("After Image Title is required"),
        // description: Yup.string().trim().required(
        //   "After Image Description is required"
        // ),
        file: Yup.string().trim().required("After Image File is required"),
      }),
    })
  ),
  complaint_id: Yup.object().required("Complaint is required"),
});
export const addStockRequestSchema = Yup.object().shape({
  request_stock_by_user: Yup.array().of(
    Yup.object().shape({
      // user_id: Yup.object().required("is required"),
      // gst_id:Yup.object().required("is required"),
      supplier_id: Yup.object().required("is required"),
      // request_stock_images: Yup.array().of(
      //   Yup.object().shape({
      //     item_image: Yup.string().required("is required"),
      //     title: Yup.string().trim().required("is required"),
      //   })
      // ),

      request_stock: Yup.array().of(
        Yup.object().shape({
          item_name: Yup.object().required("is required"),
          request_quantity: Yup.string()
            .trim()
            .required("Quantity is required"),
        })
      ),

      new_request_stock: Yup.array().of(
        Yup.object().shape({
          title: Yup.object().required("Item Name is required"),
          rate: Yup.number().required("Rate is required"),
          qty: Yup.number().required("Quantity is required"),
          item_image: Yup.mixed().required("Image is required"),
        })
      ),
    })
  ),
});
export const addStockRequestApproveSchema = Yup.object().shape({
  approved_remarks: Yup.string().trim().required("remarks is required"),
  request_stock_by_user: Yup.array().of(
    Yup.object().shape({
      request_stock: Yup.array().of(
        Yup.object().shape({
          approve_quantity: Yup.number()
            .typeError("quantity must be a valid number")
            .positive("quantity must be greater than zero")
            .required("quantity is Required"),

          approve_price: Yup.number()
            .typeError("Price  must be a valid number")
            .positive("Price must be greater than zero")
            .required("Price is Required"),
        })
      ),

      new_request_stock: Yup.array().of(
        Yup.object().shape({
          view_status: Yup.boolean().required("Image View  is Required"),

          approved_rate: Yup.number()
            .typeError("Price  must be a valid number")
            .positive("Price must be greater than zero")
            .required("Price is Required"),
          approved_qty: Yup.number()
            .typeError("quantity must be a valid number")
            .positive("quantity must be greater than zero")
            .required("quantity is Required"),
        })
      ),
    })
  ),
});
export const addBillNoFormatSchema = Yup.object().shape({
  prefix: Yup.string().trim().required("prefix is Required"),
  financial_year_format: Yup.object().required(
    "financial year format is Required"
  ),
  start_bill_number: Yup.string()
    .trim()
    .required("start bill number is Required"),
  financial_year: Yup.object().required("financial year is Required"),
  separation_symbol: Yup.object().required("separation symbol is Required"),
});

export const addEmployeeNoFormatSchema = Yup.object().shape({
  prefix: Yup.string().trim().required("prefix is Required"),
  financial_year_format: Yup.object().required(
    "financial year format is Required"
  ),
  start_employee_number: Yup.string()
    .trim()
    .required("Start Employee nNumber is Required"),
  financial_year: Yup.object().required("financial year is Required"),
  separation_symbol: Yup.object().required("separation symbol is Required"),
});

export const addClientNoFormatSchema = Yup.object().shape({
  prefix: Yup.string().trim().required("prefix is Required"),
  financial_year_format: Yup.object().required(
    "financial year format is Required"
  ),
  start_company_number: Yup.string()
    .trim()
    .required("Start Company Number is Required"),
  financial_year: Yup.object().required("financial year is Required"),
  separation_symbol: Yup.object().required("separation symbol is Required"),
});

export const addItemNoFormatSchema = Yup.object().shape({
  prefix: Yup.string().trim().required("prefix is Required"),
  financial_year_format: Yup.object().required(
    "financial year format is Required"
  ),
  start_item_number: Yup.string()
    .trim()
    .required("Start Item Number is Required"),
  financial_year: Yup.object().required("financial year is Required"),
  separation_symbol: Yup.object().required("separation symbol is Required"),
});

export const addFoodExpensePunchSchema = Yup.object().shape({
  user_id: Yup.object().required("User is Required"),
  complaint_id: Yup.object().required("complaint is Required"),
});
export const addPiToMergeSchema = Yup.object().shape({
  invoice_date: Yup.string().trim().required("Invoice Date is Required"),
  due_date: Yup.string().trim().required("Due Date is Required"),
  financial_year: Yup.object().required("Financial Year is Required"),
  callup_number: Yup.string()
    .matches(phoneRegExp, "Callup Number is not valid")
    .typeError("Callup No. must be a number")
    .min(10, "Enter minimum 10 character")
    .required("Callup Number is a Required"),
});

export const addStockPunchSchema = Yup.object().shape({
  // stock_punch_detail: Yup.array().of(
  //   Yup.object().shape({
  //     item_name: Yup.string().required("Item Name is required"),
  //   })
  // ),
  // area_manager_id: Yup.object().required("Area Manager is required"),
  complaint_id: Yup.object().required("Complaint Id is required"),
});

export const approveOfficeExpenseSchema = Yup.object().shape({
  outlet_honour: Yup.string().trim().required("Outlet name is required"),
  contact_number: Yup.string()
    .matches(phoneRegExp, "contact number is not valid")
    .typeError("Phone no. must be a number")
    .min(10, "Enter minimum 10 character")
    .required("Phone no. is a Required"),
  remarks: Yup.string().trim().required("remark is required "),
});
export const addExpensePunchSchema = Yup.object().shape({
  items: Yup.array().of(
    Yup.object().shape({
      item_name: Yup.string().trim().required("is required"),
      qty: Yup.string().trim().required("is required"),
      amount: Yup.string().trim().required("is required"),
    })
  ),
  user_id: Yup.object().required("user is required"),
  complaint_id: Yup.object().required("complaint id is required"),
});
export const addFundsSchema = Yup.object().shape({
  user_id: Yup.object().required("User is Required"),
  amount: Yup.number()
    .typeError("Amount must be a valid number")
    .positive("Amount must be greater than zero")
    .required("Amount is Required"),
  remark: Yup.string().trim().required("Remark is Required"),
});
export const addRequestCashSchema = Yup.object().shape({
  request_amount: Yup.string().trim().required("Request Amount is Required"),
  // request_purpose: Yup.string().trim().required("Request Purpose is Required"),
});

export const addContactsSchema = Yup.object().shape({
  company_id: Yup.object().required("Company is required"),
  position: Yup.object().required("Position is required"),
  phone: Yup.array().of(
    Yup.object().shape({
      number: Yup.number()
        .typeError("must be a number")
        .required("Number is required")
        .positive("must be positive"),
    })
  ),
  email: Yup.array().of(
    Yup.object().shape({
      email: Yup.string()
        .email("please enter valid email")
        .required("Email is Required"),
    })
  ),
});

export const addStockTransferSchema = Yup.object().shape({
  transfer_for: Yup.string().trim().required("Transfer for is required"),
  // transfer_by: Yup.object().required("Transfer by is required"),
  transfer_to: Yup.object().required("Transfer to is required"),
  items: Yup.array().of(
    Yup.object().shape({
      item_id: Yup.object().required("Item ID is required"),
      qty: Yup.number()
        .typeError("Quantity must be a number")
        .required("Quantity is required")
        .positive("Quantity must be positive"),
    })
  ),
});

export const addExpenseCategorySchema = Yup.object().shape({
  category_name: Yup.string().trim().required("Category name is Required"),
});
export const addPaymentMethodSchema = Yup.object().shape({
  method: Yup.string().trim().required("Method is Required"),
});
export const addExpensesCashSchema = Yup.object().shape({
  expense_category: Yup.object().required("Expense Category is Required"),
  payment_method: Yup.object().required("Payment Method is Required"),
  complaint_id: Yup.object().required("Complaint is Required"),
  user_id: Yup.object().required("User is Required"),
  supplier_id: Yup.object().required("Supplier is Required"),
  expense_amount: Yup.string().trim().required("Expense Amount is Required"),
  // expense_date: Yup.string().trim().required("Expense Date is Required"),
});
export const addRequestExpensesSchema = Yup.object().shape({
  transaction_id: Yup.string().trim().required("transaction id is Required"),
  remark: Yup.string().trim().required("remark is Required"),
});
export const addRequestItemsSchema = Yup.object().shape({
  item_id: Yup.object().required("Item name is Required"),
  date: Yup.string().trim().required("date is Required"),
  notes: Yup.string().trim().required("notes is Required"),
});
export const addAllocateSchema = (isUser) => {
  const baseSchema = {
    area_manager_id: Yup.string().required("Manager is Required"),
    supervisor_id: Yup.string().required("Supervisor is Required"),
  };
  return isUser
    ? Yup.object().shape(baseSchema)
    : Yup.object().shape({
        ...baseSchema,
        user_id: Yup.string().required("Free End User is Required"),
      });
};
export const updateAllocateSchema = Yup.object().shape({
  manger_id: Yup.object().required("Manager is Required"),
  supervisor_id: Yup.object().required("Supervisor is Required"),
  assign_to: Yup.object().required("Free End User is Required"),
});
export const addAccountManagementSchema = Yup.object().shape({
  banks: Yup.array().of(
    Yup.object().shape({
      bank_id: Yup.object().required("is required"),
      accounts: Yup.array().of(
        Yup.object().shape({
          account_number: Yup.string()
            .trim()
            .matches(
              /^\d{9,18}$/,
              "Account number must be between 9 to 18 digits"
            )
            .required("Account number is required"),
          branch: Yup.string()
            .trim()
            .min(2, "Branch name must be at least 2 characters")
            .max(50, "Branch name must be at most 50 characters")
            .required("Branch name is required"),
          ifsc_code: Yup.string().trim().required("IFSC code is required"),
          account_holder_name: Yup.string()
            .trim()
            .required("holder name is required"),
          account_type: Yup.string()
            .trim()
            .required("Account Type is required"),
        })
      ),
    })
  ),
});

// survey response validation schema
// export const responseValidationSchema = Yup.object().shape(
//   questions.reduce((schema, item, index) => {
//     const columnSchema = item.columns.reduce((colSchema, column, colIndex) => {
//       if (column.value === "number") {
//         colSchema[`questions[${index}].columns[${colIndex}].value`] =
//           Yup.string()
//             .matches(/^\d+$/, "Must be a number")
//             .max(10, "Must be 10 digits or less");
//       } else if (column.value === "url") {
//         colSchema[`questions[${index}].columns[${colIndex}].value`] =
//           Yup.string().url("Must be a valid URL");
//       } else if (column.value === "textarea" || column.value === "text") {
//         colSchema[`questions[${index}].columns[${colIndex}].value`] =
//           Yup.string().required("This field is required");
//       }
//       // Add more validation rules based on column types if needed
//       return colSchema;
//     }, {});
//     return { ...schema, ...columnSchema };
//   }, {})
// );

// Define a validation schema for a single column
// const columnSchema = Yup.object({
//   value: Yup.string()
//     .when("selectType", {
//       is: "url",
//       then: Yup.string().url("Must be a valid URL").required("URL is required"),
//       otherwise: Yup.string().required("Value is required"),
//     })
//     .when("selectType", {
//       is: "number",
//       then: Yup.string()
//         .matches(/^\d+$/, "Must be a number")
//         .required("Value is required"),
//     }),
// });

// // Define a validation schema for questions and columns
// const questionSchema = Yup.object({
//   columns: Yup.array().of(columnSchema),
// });

// // Define a validation schema for the entire form
// const validationSchema = Yup.object({
//   questions: Yup.array().of(questionSchema).required("Questions are required"),
// });

// export default validationSchema;

export const addResponseSchema = Yup.object().shape({
  // name: Yup.string().required("Name is Required"),
  questions: Yup.array().of(
    Yup.object().shape({
      // employees: Yup.array().min(1, "Employees is Required"),

      // financial_year: Yup.string().when("period", {
      //   is: "Financial Year",
      //   then: (schema) => schema.required("Financial Year is Required"),
      // }),

      columns: Yup.array().of(
        Yup.object().shape({
          value: Yup.string().required("Value is Required"),
          // start_time: Yup.string().when("no_training", {
          //   is: "0",
          //   then: (schema) => schema.required("Start Time is Required"),
          // }),
          // end_time: Yup.string().when("no_training", {
          //   is: "0",
          //   then: (schema) => schema.required("End Time is Required"),
          // }),
        })
      ),
    })
  ),
});
export const importItemsSchema = Yup.object().shape({
  supplier_id: Yup.string().required("Supplier is Required"),
  unit_id: Yup.string().required("Unit Id is Required"),
  sub_category: Yup.string().required("Sub Category is Required"),
  excel: Yup.string().required("File is Required"),
});
export const addResignationSchema = Yup.object().shape({
  user_id: Yup.string().required("User is Required"),
  resignation_date: Yup.string().required("Resignation Date is Required"),
  // last_working_day: Yup.string().required("Last Working Day is Required"),
});
export const addBulkAttendanceSchema = Yup.object().shape({
  attendance_status: Yup.string().required("Attendance Status is Required"),
  date: Yup.string()
    .trim()
    .required("Date is Required")
    .test(
      "valid-date-range",
      "Date must follow the format: 1-5, 7-8, 10, with no overlaps or redundant numbers.",
      (value) => {
        if (!value) return false;

        const parts = value.split(",").map((part) => part.trim());
        const ranges = new Set();

        for (const part of parts) {
          if (part.includes("-")) {
            const [start, end] = part.split("-").map(Number);
            if (
              isNaN(start) ||
              isNaN(end) ||
              start < 1 ||
              end > 31 ||
              start >= end
            ) {
              return false;
            }
            for (let i = start; i <= end; i++) {
              if (ranges.has(i)) return false;
              ranges.add(i);
            }
          } else {
            const single = Number(part);
            if (isNaN(single) || single < 1 || single > 31) {
              return false;
            }
            if (ranges.has(single)) return false;
            ranges.add(single);
          }
        }

        return true;
      }
    ),
});
