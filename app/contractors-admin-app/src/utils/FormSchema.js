import { min } from 'moment';
import * as Yup from 'yup';

const phoneRegExp = /^[6-9]{1}[0-9]{9}$/;

export const loginSchema = Yup.object().shape({
  email: Yup.string()
    .email('please enter valid email')
    .required('Email is Required'),
  password: Yup.string().min(6, 'Too Short!').required('Password is Required'),
  // phone: Yup.number().typeError("number only").min(6, 'Too Short!').required('Email is Required'),
});

export const addExpensePunchSchema = Yup.object().shape({
  items: Yup.array().of(
    Yup.object().shape({
      // item_name: Yup.object().required('is required'),
      qty: Yup.mixed().required('required'),
      // amount: Yup.string().required('is required'),
    }),
  ),
  // user_id: Yup.string().required('user is required'),
  complaint_id: Yup.string().required('complaint id is required'),
});
export const addStockPunchSchema = Yup.object().shape({
  stock_punch_detail: Yup.array().of(
    Yup.object().shape({
      // item_name: Yup.object().required('is required'),
      item_qty: Yup.string().required('required'),
      // amount: Yup.string().required('is required'),
    }),
  ),
  // user_id: Yup.string().required('user is required'),
  complaint_id: Yup.string().required('complaint id is required'),
});

export const approveExpensePunchSchema = Yup.object().shape({
  items: Yup.array().of(
    Yup.object().shape({
      // item_name: Yup.object().required('is required'),
      approve_qty: Yup.string().required('required'),
      // amount: Yup.string().required('is required'),
    }),
  ),
  // user_id: Yup.string().required('user is required'),
  // complaint_id: Yup.string().required('complaint id is required'),
});

export const approveStockPunchSchema = Yup.object().shape({
  stock_punch_detail: Yup.array().of(
    Yup.object().shape({
      // item_name: Yup.object().required('is required'),
      approve_qty: Yup.mixed().required('is required'),
      // amount: Yup.string().required('is required'),
    }),
  ),
  // user_id: Yup.string().required('user is required'),
  // complaint_id: Yup.string().required('complaint id is required'),
});
export const addStockRequestSchema = taxType => {
  return Yup.object().shape({
    request_stock_by_user: Yup.array().of(
      Yup.object().shape({
        // user_id: Yup.object().required("is required"),
        ...(taxType == '2'
          ? { gst_id: Yup.object().required('is required') }
          : ''),
        supplier_id: Yup.object().required('is required'),
        request_stock_images: Yup.array().of(
          Yup.object().shape({
            item_image: Yup.string().required('is required'),
            title: Yup.string().trim().required('is required'),
          }),
        ),

        request_stock: Yup.array().of(
          Yup.object().shape({
            item_name: Yup.object().required('*'),
            request_quantity: Yup.string().required('*'),
            // gst_id:Yup.object().required("is required"),
            ...(taxType == '1' ? { gst_id: Yup.object().required('*') } : ''),
          }),
        ),

        new_request_stock: Yup.array().of(
          Yup.object().shape({
            title: Yup.object().required('Item Name is required'),
            rate: Yup.number().required('Rate is required'),
            qty: Yup.number().required('Quantity is required'),
            item_image: Yup.mixed().required('Image is required'),
          }),
        ),
      }),
    ),
  });
};
export const addStockRequestApproveSchema = Yup.object().shape({
  approved_remarks: Yup.string().trim().required('remarks is required'),
  request_stock_by_user: Yup.array().of(
    Yup.object().shape({
      request_stock: Yup.array().of(
        Yup.object().shape({
          approve_quantity: Yup.number()
            .typeError('quantity must be a valid number')
            .positive('quantity must be greater than zero')
            .required('quantity is Required'),

          approve_price: Yup.number()
            .typeError('Price  must be a valid number')
            .positive('Price must be greater than zero')
            .required('Price is Required'),
        }),
      ),

      new_request_stock: Yup.array().of(
        Yup.object().shape({
          view_status: Yup.boolean().required('Image View  is Required'),

          approved_rate: Yup.number()
            .typeError('Price  must be a valid number')
            .positive('Price must be greater than zero')
            .required('Price is Required'),
          approved_qty: Yup.number()
            .typeError('quantity must be a valid number')
            .positive('quantity must be greater than zero')
            .required('quantity is Required'),
        }),
      ),
    }),
  ),
});
export const MyprofileSchema = Yup.object().shape({
  name: Yup.string()
    .min(2, 'Too Short!')
    .max(50, 'Too Long!')
    .required(' name Required'),
  email: Yup.string()
    .email('please enter valid email')
    .required('Email is Required'),
  contact_no: Yup.string()
    .matches(phoneRegExp, 'contact number is not valid')
    .typeError('Phone no. must be a number')
    .min(10, 'Enter minimum 10 character')
    .required('Phone no. is a Required'),
});
export const forgotPasswordSchema = Yup.object().shape({
  email: Yup.string().email('Invalid email').required('Email is Required'),
});

export const otpSchema = Yup.object().shape({
  otp: Yup.number()
    .required('otp is required')
    .min(6, 'otp must be at least 6 characters'),
});
export const ChangePasswordSchema = Yup.object().shape({
  old_password: Yup.string().required('Password is Required'),
  new_password: Yup.string()
    .notOneOf(
      [Yup.ref('old_password'), null],
      'new password can not be old password',
    )
    .min(6, 'Password must be at least 6 characters')
    .required('Password is Required'),
  confirm_password: Yup.string()
    .oneOf([Yup.ref('new_password'), null], 'Passwords must match')
    .required('Confirm Password is Required'),
});
// master data only
export const addZoneSchema = Yup.object().shape({
  energy_company_id: Yup.string().required('Energy Company name is Required'),
  zone_name: Yup.string().required('Zone name is Required'),
  description: Yup.string().required('Zone description is Required'),
});
export const addROSchema = Yup.object().shape({
  energy_company_id: Yup.string().required('Energy Company name is Required'),
  zone_id: Yup.string().required('Zone Name is Required'),
  regional_office_name: Yup.string().required(
    'Regional Office Name is Required',
  ),
  code: Yup.string().required('Code is Required'),
  address_1: Yup.string().required('Address is Required'),
  regional_status: Yup.string().required('Regional Status is Required'),
});
export const addSalesAreaSchema = Yup.object().shape({
  energy_company_id: Yup.string().required('Energy Company name is Required'),
  zone_id: Yup.string().required('Zone Name is Required'),
  regional_office_name: Yup.string().required(
    'Regional Office Name is Required',
  ),
  sales_area_name: Yup.string().required('Sales Area Name is Required'),
  sales_area_status: Yup.string().required('Sales Area Status is Required'),
});
export const addDistrictSchema = Yup.object().shape({
  energy_company_id: Yup.string().required('Energy Company name is Required'),
  zone_id: Yup.string().required('Zone Name is Required'),
  ro_id: Yup.string().required('Regional Office Name is Required'),
  sales_area_id: Yup.string().required('Sales Area Name is Required'),
  district_name: Yup.string().required('District Name is Required'),
  status: Yup.string().required('District Status is Required'),
});
export const addOutletsSchema = edit_id => {
  return Yup.object().shape({
    energy_company_id: Yup.string().required('Energy company Name is Required'),
    zone_id: Yup.string().required('Zone Name is Required'),
    regional_id: Yup.string().required('Regional Name is Required'),
    sales_area_id: Yup.string().required('Sales area Name is Required'),
    district_id: Yup.string().required('District Name is Required'),
    outlet_name: Yup.string().required('Outlet Name is Required'),
    outlet_unique_id: Yup.string().required('Outlet ID is Required'),

    outlet_contact_number: Yup.string().required(
      'Outlet contact number is Required',
    ),
    outlet_contact_person_name: Yup.string().required(
      'Outlet contact person name is Required',
    ),
    primary_number: Yup.string().required('Primary number is Required'),
    primary_email: Yup.string().required('Primary email is Required'),

    customer_code: Yup.string().required('Customer code is Required'),
    outlet_category: Yup.string().required('Outlet category is Required'),
    outlet_ccnoms: Yup.string().required('Outlet ccnoms is Required'),
    outlet_ccnohsd: Yup.string().required('Outlet ccnohsd is Required'),

    location: Yup.string().required('Location is Required'),
    address: Yup.string().required('Address is Required'),

    email: Yup.string().required('Email is Required'),
    ...(!edit_id
      ? { password: Yup.string().required('Password is Required') }
      : {}),
  });
};

export const addOrderViaSchema = Yup.object().shape({
  order_via: Yup.string().required('Order Via Name is Required'),
  status: Yup.string().required('Status Type is Required'),
});

export const addTaxSchema = Yup.object().shape({
  value: Yup.string().required('Value is Required'),
  status: Yup.string().required('Status Type is Required'),
  billing_type_id: Yup.string().required('Billing  Type is Required'),
});
export const addBankBalaceSchema = Yup.object().shape({
  transaction_id: Yup.string().required('Transaction id is Required'),
  remark: Yup.string().required('Remark is Required'),
  balance: Yup.string().required('Balance is Required'),
  id: Yup.string().trim().required(' account number is Required'),
  bank_id: Yup.number().required('Bank is Required'),
});

export const addBillNoFormatSchema = Yup.object().shape({
  prefix: Yup.string().trim().required('prefix is Required'),
  financial_year_format: Yup.string().required(
    'financial year format is Required',
  ),
  start_bill_number: Yup.string()
    .trim()
    .required('start bill number is Required'),
  financial_year: Yup.string().required('financial year is Required'),
  separation_symbol: Yup.string().required('separation symbol is Required'),
});

export const addAccountManagementSchema = Yup.object().shape({
  banks: Yup.array().of(
    Yup.object().shape({
      bank_id: Yup.string().required('is required'),
      accounts: Yup.array().of(
        Yup.object().shape({
          account_number: Yup.string()
            .trim()
            .matches(
              /^\d{9,18}$/,
              'Account number must be between 9 to 18 digits',
            )
            .required('Account number is required'),
          branch: Yup.string()
            .trim()
            .min(2, 'Branch name must be at least 2 characters')
            .max(50, 'Branch name must be at most 50 characters')
            .required('Branch name is required'),
          ifsc_code: Yup.string().trim().required('IFSC code is required'),
          account_type: Yup.string()
            .trim()
            .required('Account type is required'),
          account_holder_name: Yup.string()
            .trim()
            .required('account holder name is required'),
        }),
      ),
    }),
  ),
});

// export const addFundRequestSchema = Yup.object().shape({
//   request_data: Yup.array().of(
//     Yup.object().shape({
//       new_request_fund: Yup.array().of(
//         Yup.object().shape({
//           title: Yup.object().required('is required'),
//           unit_id: Yup.object().required('is required'),
//           item_image: Yup.mixed().required('is required'),
//           rate: Yup.string().trim().required('is required'),
//           qty: Yup.string().trim().required('is required'),
//         }),
//       ),
//     }),
//     Yup.object().shape({
//       request_fund: Yup.array().of(
//         Yup.object().shape({
//           item_name: Yup.object().required('is required'),
//           request_quantity: Yup.string().trim().required('is required'),
//         }),
//       ),
//     }),
//   ),
// });

export const approveFundRequestSchema = Yup.object().shape({
  request_data: Yup.array().of(
    Yup.object()
      .shape({
        new_request_fund: Yup.array().of(
          Yup.object()
            .shape({
              approved_rate: Yup.mixed().required('approve Rate is required'),
              approved_qty: Yup.mixed().required(
                'approve Quantity is required',
              ),
            })
            .required('New request fund is required'),
        ),
        request_fund: Yup.array().of(
          Yup.object()
            .shape({
              quantity: Yup.string().required('approve quantity is required'),
              price: Yup.string().required('approve price is required'),
            })
            .required('Request fund is required'),
        ),
      })
      .required('Request data is required'),
  ),
});

export const addFundRequestSchema = Yup.object().shape({
  request_data: Yup.array().of(
    Yup.object()
      .shape({
        new_request_fund: Yup.array().of(
          Yup.object()
            .shape({
              title: Yup.object().required('Title is required'),
              unit_id: Yup.object().required('Unit ID is required'),
              item_image: Yup.mixed().required('Item image is required'),
              rate: Yup.mixed().required('Rate is required'),
              qty: Yup.mixed().required('Quantity is required'),
            })
            .required('New request fund is required'),
        ),
        request_fund: Yup.array().of(
          Yup.object()
            .shape({
              item_name: Yup.object().required('Item name is required'),
              request_quantity: Yup.string().required(
                'Request quantity is required',
              ),
            })
            .required('Request fund is required'),
        ),
      })
      .required('Request data is required'),
  ),
});

export const addPoSchema = Yup.object().shape({
  ro_office: Yup.string().required('Regional Office is Required'),
  state: Yup.string().required('State is Required'),
  po_date: Yup.string().trim().required('Po Date is Required'),
  po_number: Yup.string().trim().required('Po Number is Required'),
  tender_date: Yup.string().trim().required('Tender Date is Required'),
  cr_date: Yup.string().trim().required('Cr Date is Required'),
  dd_bg_number: Yup.string().trim().required('DD/BG number is Required'),
  security_deposit_date: Yup.string()
    .trim()
    .required('Security Deposit Date is Required'),
  tender_number: Yup.string().trim().required('Tender Number is Required'),
  cr_number: Yup.string().trim().required('Cr Number is Required'),
  cr_code: Yup.string().trim().required('Cr Code is Required'),
  security_deposit_amount: Yup.string()
    .trim()
    .required('Security Deposit Amount is Required'),
  work: Yup.string().trim().required('Work is Required'),
});
export const addSoSchema = Yup.object().shape({
  ro_office: Yup.string().required('Regional Office is Required'),
  state: Yup.string().required('State is Required'),
  so_date: Yup.string().trim().required('so Date is Required'),
  so_number: Yup.string().trim().required('so Number is Required'),
  tender_date: Yup.string().trim().required('Tender Date is Required'),
  cr_date: Yup.string().trim().required('Cr Date is Required'),
  dd_bg_number: Yup.string().trim().required('DD/BG number is Required'),
  security_deposit_date: Yup.string()
    .trim()
    .required('Security Deposit Date is Required'),
  tender_number: Yup.string().trim().required('Tender Number is Required'),
  cr_number: Yup.string().trim().required('Cr Number is Required'),
  cr_code: Yup.string().trim().required('Cr Code is Required'),
  security_deposit_amount: Yup.string()
    .trim()
    .required('Security Deposit Amount is Required'),
  work: Yup.string().trim().required('Work is Required'),
});

export const addQuotationSchema = Yup.object().shape({
  company_from: Yup.string().required('Company From is Required'),
  company_from_state: Yup.string().required('Company From State is Required'),
  company_to: Yup.string().required('Company to is Required'),
  company_to_regional_office: Yup.string().required(
    'Company To Regional Office is Required',
  ),
  quotation_date: Yup.string().trim().required('Quotation Date is Required'),
  outlet: Yup.string().required('Outlet is Required'),
  po_number: Yup.string().required('Po Number is Required'),
  complaint_type: Yup.string().required('Complaint Type is Required'),
  items_id: Yup.array()
    .min(1, 'Min one item is required')
    .required('item list is required'),
});
export const addAssestsSchema = Yup.object().shape({
  asset_name: Yup.string().required('assest name is Required'),
  asset_model_number: Yup.string().required('model no is Required'),
  asset_uin_number: Yup.string().required('uin no is Required'),
  asset_price: Yup.string().required('Price is Required'),
  asset_purchase_date: Yup.string()
    .trim()
    .required('purchase Date is Required'),
  asset_warranty_guarantee_start_date: Yup.string()
    .trim()
    .required('Start Date is Required'),
  asset_warranty_guarantee_end_date: Yup.string()
    .trim()
    .required('End Date is Required'),
});
export const addItemSchema = Yup.object().shape({
  name: Yup.string().required('name is Required'),
  supplier_id: Yup.string().required('supplier is Required'),
  hsncode: Yup.string().required('hsn code is Required'),
  rucode: Yup.string().required('ru code is Required'),
  unit_id: Yup.string().required('unit id is Required'),
  category: Yup.string().required('category is Required'),
});
export const addEnergyTeamSchema = Yup.object().shape({
  energy_company_id: Yup.string().required('Energy team is Required'),
  username: Yup.string().required('username is Required'),
  contact_no: Yup.string().required('contact no is Required'),
  joining_date: Yup.string().required('joining date is Required'),
  area_name: Yup.string().required('area name is Required'),
  area_selected: Yup.string().required('selected area is Required'),
  email: Yup.string().required('email is Required'),
});

export const addPaymentSchema = Yup.object().shape({
  pv_number: Yup.string().required('Pv no is Required'),
  receipt_date: Yup.string().required('date is Required'),
  pv_amount: Yup.string().required('pv amount is Required'),
});
export const addPromotionalManagerSchema = Yup.object().shape({
  manager_id: Yup.string().required('Manager is Required'),
  company_ratio: Yup.string().required('company ratio is Required'),
  manager_ratio: Yup.string().required('manager ratio is Required'),
});
export const otpVerificationSchema = Yup.object().shape({
  payment_mode: Yup.string().required('payment mode is Required'),
  otp: Yup.string().required('otp is Required'),
  amount_received: Yup.string().required('amount  is Required'),
});
export const regionalOfficePaymentSchema = Yup.object().shape({
  payment_mode: Yup.string().required('payment mode is Required'),
});
export const addPromotionOverviewSchema = Yup.object().shape({
  ro_id: Yup.string().required('regional office is Required'),
  tds: Yup.string().required('tds is Required'),
  gst: Yup.string().required('gst is Required'),
  tds_with_gst: Yup.string().required('tds with gst is Required'),
  retention_money: Yup.string().required('retention is Required'),
  promotion_expense: Yup.string().required('promotion expense is Required'),
});
export const addPaymentSchema2 = Yup.object().shape({
  payment_reference_number: Yup.string().required('Pv no is Required'),
  date: Yup.string().required('date is Required'),
  amount: Yup.string().required('pv amount is Required'),
});

export const transferFundRequestSchema = Yup.object().shape({
  payment_mode: Yup.mixed().required('Pay Mode is required'),
  transaction_id: Yup.string().required('Transaction id is required'),
  remark: Yup.string().required('Remark is required'),
  account_id: Yup.object().required('Account Number is required'),
  transfer_data: Yup.array().of(
    Yup.object()
      .shape({
        new_transfer_fund: Yup.array().of(
          Yup.object()
            .shape({
              transfer_quantity: Yup.string().required('Quantity is required'),
            })
            .required('New request fund is required'),
        ),
        transfer_fund: Yup.array()
          .of(
            Yup.object().shape({
              transfer_quantity: Yup.string().required(
                'Transfer quantity is required',
              ),
            }),
          )
          .required('Transfer fund is required'),
      })
      .required('Request data is required'),
  ),
});

export const addPerformaInvoiceSchema = Yup.object().shape({
  billing_from: Yup.number().required('Billing From is Required'),
  billing_from_state: Yup.number().required('Billing From State is Required'),

  financial_year: Yup.string().required('Financial Year is Required'),
  complaint_id: Yup.array()
    .min(1, 'Min one item is required')
    .required('item list is required'),
  // po_number: Yup.object().required("Po Number is Required"),
  // measurement_list: Yup.object().required("Measurement List is Required"),
  work: Yup.string().trim().required('Work is Required'),
});
export const addInvoiceSchema = Yup.object().shape({
  financial_year: Yup.string().required('Financial Year is Required'),
  pi_id: Yup.array()
    .min(1, 'Min one item is required')
    .required('item list is required'),
});

export const transferStockRequestSchema = Yup.object().shape({
  payment_mode: Yup.mixed().required('Pay Mode is required'),
  transaction_id: Yup.string().required('Transaction id is required'),
  remark: Yup.string().required('Remark is required'),
  account_id: Yup.object().required('Account Number is required'),
  transfer_data: Yup.array().of(
    Yup.object()
      .shape({
        new_request_stock: Yup.array().of(
          Yup.object()
            .shape({
              transfer_qty: Yup.string().required(
                'Transfer quantity is required',
              ),
            })
            .required('New request fund is required'),
        ),
        request_stock: Yup.array()
          .of(
            Yup.object().shape({
              transfer_qty: Yup.string().required(
                'Transfer quantity is required',
              ),
            }),
          )
          .required('Transfer fund is required'),
      })
      .required('Request data is required'),
  ),
});

export const addPayMethodSchema = Yup.object().shape({
  method: Yup.string().required('Method name is Required'),
  status: Yup.string().required('Status Type is Required'),
});

export const addGstTaxSchema = Yup.object().shape({
  title: Yup.string().required('title is Required'),
  percentage: Yup.string().required(' Percentage is Required'),
});
export const addSettingSchema = Yup.object().shape({
  label: Yup.string().required('Setting Name is Required'),
  // active_setting: Yup.object().required('is Required'),
});
export const addInsuranceSchema = Yup.object().shape({
  insurance_company_id: Yup.string().required('company name is Required'),
  insurance_deduction_amount: Yup.string().required(
    'deduction amount is Required',
  ),
  insurance_applied_on: Yup.array().required('is Required'),
  insurance_plan_id: Yup.string().required(' Insurance Plan is Required'),
});

export const addWorkImagesSchema = Yup.object().shape({
  main_image: Yup.array().of(
    Yup.object().shape({
      row_title: Yup.string().trim().required('Row Title is required'),
      before_image: Yup.object().shape({
        title: Yup.string().trim().required('Before Image Title is required'),
        // description: Yup.string().trim().required(
        //   "Before Image Description is required"
        // ),
        file: Yup.string().trim().required('Before Image File is required'),
      }),
      // progress_image: Yup.object().shape({
      //   title: Yup.string().trim().required('Progress Image Title is required'),
      //   description: Yup.string().trim().required('Progress Image Description is required'),
      //   file: Yup.string().trim().required('Progress Image File is required'),
      // }),
      after_image: Yup.object().shape({
        title: Yup.string().trim().required('After Image Title is required'),
        // description: Yup.string().trim().required(
        //   "After Image Description is required"
        // ),
        file: Yup.string().trim().required('After Image File is required'),
      }),
    }),
  ),
  complaint_id: Yup.string().required('Complaint is required'),
});
export const addLoanSchema = Yup.object().shape({
  user_id: Yup.string().required('user name is Required'),
  loan_amount: Yup.string().required('Loan amount is Required'),
  loan_term: Yup.string().required(' loan term is Required'),
  remarks: Yup.string().required(' remark is Required'),
  loan_type: Yup.string().required(' loan type is Required'),
});
export const addPromotionSchema = Yup.object().shape({
  user_id: Yup.string().required('user name is Required'),
  purpose: Yup.string().required('Purpose is Required'),
  reason: Yup.string().required(' Reason is Required'),
  new_designation: Yup.string().required(' Designation is Required'),
  change_in_salary: Yup.string().required('Required'),
  change_in_salary_type: Yup.string().required(' change type is Required'),
  change_in_salary_value: Yup.string().required('change value is Required'),
  document: Yup.mixed().required(' Document is Required'),
});
export const addRetirementSchema = Yup.object().shape({
  user_id: Yup.string().required('user name is Required'),
  retirement_date: Yup.string().required('Date is Required'),
  asset_recovery: Yup.string().required(' asset recovery is Required'),
  pension_duration: Yup.string().required(' pension duration is Required'),
  // pension_amount: Yup.string().required('pension amount Required'),
  // change_in_salary_type: Yup.string().required(' change type is Required'),
  // change_in_salary_value: Yup.string().required('change value is Required'),
  // document: Yup.mixed().required(' Document is Required'),
});

export const addResignationSchema = Yup.object().shape({
  user_id: Yup.string().required('user name is Required'),
  resignation_date: Yup.string().required('Resignation date is Required'),
  last_working_day: Yup.string().required('last working day is Required'),
  reason: Yup.string().required('reason is Required'),
});

export const addHrTeamSchema = Yup.object().shape({
  manager_id: Yup.mixed().required('Team Manager is Required'),
  supervisor_id: Yup.mixed().required('supervisor is Required'),
  members: Yup.array()
    .min(1, 'Select at least one Member')
    .required('Team Member is Required'),
  team_name: Yup.string().trim().required('Team Name is Required'),
  // team_short_description: Yup.string()
  //   .trim()
  //   .required("Description is Required"),
});
export const addRemarkSchema = Yup.object().shape({
  remark: Yup.string().trim().required('remark is Required'),
});

export const addTeamMemberSchema = Yup.object().shape({
  user_id: Yup.array().required(' is Required'),
});
export const allocateCompplaintViaSchema = Yup.object().shape({
  area_manager_id: Yup.string().required('MANGER IS REQUIRED'),
  supervisor_id: Yup.string().required('SUPERVISOR IS REQUIRED'),
  user_id: Yup.mixed().required('FREE END USER IS REQUIRED'),
});
export const addDealersSchema = Yup.object().shape({
  name: Yup.string().required('Name is Required'),
  email: Yup.string().email('Invalid email').required('Email is Required'),
});
export const addContractorsSchema = Yup.object().shape({
  name: Yup.string().required('Name is Required'),
  email: Yup.string().email('Invalid email').required('Email is Required'),
});
export const addComplaintTypeSchema = Yup.object().shape({
  energy_company_id: Yup.string().required('Enery Company is Required'),
  zone_id: Yup.string().required('Zone is Required'),
  ro_id: Yup.string().required('Regional Office is Required'),
  order_via_id: Yup.string().required('Order Via is Required'),
  order_by_id: Yup.string().required('Order By is Required'),
  sale_area_id: Yup.string().required('Sales Area is Required'),
  complaint_type: Yup.string().required('Complaint type is Required'),
  outlet_id: Yup.string().required('Outlet is Required'),
  description: Yup.string().required('Description is Required'),
  // outlet_id: Yup.array()
  //   .min(1, "Select at least one Outlet")
  //   .required("Outlet is Required"),
});
export const addComplaintTypeForOtherSchema = Yup.object().shape({
  energy_company_id: Yup.string().required('Company is Required'),
  zone_id: Yup.string().required('Zone is Required'),
  ro_id: Yup.string().required('Regional Office is Required'),
  order_via_id: Yup.string().required('Order Via is Required'),
  order_by_id: Yup.string().required('Order By is Required'),
  sale_area_id: Yup.string().required('Sales Area is Required'),
  complaint_type: Yup.string().required('Complaint type is Required'),
  description: Yup.string().required('Description is Required'),
});
export const addTypesComplaintSchema = Yup.object().shape({
  energy_company_id: Yup.mixed().required('Company Name is Required'),
  complaint_type_name: Yup.string().required('Complaint Type Name is Required'),
});
export const addEnergySchema = Yup.object().shape({
  email: Yup.string().email('Invalid email').required('Email is Required'),
  username: Yup.string().required('User Name is Required'),
  contact_no: Yup.string()
    .matches(phoneRegExp, 'Contact Number is not valid')
    .typeError('Contact Number. must be a number')
    .min(10, 'Enter minimum 10 character')
    .required('Contact Number. is a Required'),
  // password: Yup.string().min(6, "Too Short!").required("Password is Required"),
});

export const addMyCompanySchema = Yup.object().shape({
  company_name: Yup.string().required('Company Name is Required'),
  company_email: Yup.string().email('please enter valid email'),
  email: Yup.string().email('please enter valid email'),
  primary_contact_email: Yup.string().email('please enter valid email'),

  company_contact: Yup.string()
    .matches(phoneRegExp, 'Company Contact Number is not valid')
    .typeError('Company Contact Number. must be a number')
    .min(10, 'Enter minimum 10 character')
    .required('Company Contact Number. is a Required'),
  company_mobile: Yup.string()
    .matches(phoneRegExp, 'Company Mobile is not valid')
    .typeError('Company Mobile. must be a number')
    .min(10, 'Enter minimum 10 character')
    .required('Company Mobile. is a Required'),
  pan_number: Yup.string().required('pan number is Required'),
  company_contact_person: Yup.string().required(
    'Company Contact Person is Required',
  ),
  company_address: Yup.string().required('Company Address is Required'),
  primary_contact_number: Yup.string()
    .matches(phoneRegExp, 'Primary Contact Number is not valid')
    .typeError('Primary Contact Number. must be a number')
    .min(10, 'Enter minimum 10 character')
    .required('Primary Contact Number. is a Required'),
  gst_treatment_type: Yup.object().required('GST Treatment Type is Required'),

  business_legal_name: Yup.string().required('Business Legal Name is Required'),
  company_type: Yup.string().required('Company Type is Required'),

  gst_details: Yup.array().of(
    Yup.object().shape({
      gst_number: Yup.string().required('Gst Number is required'),
      shipping_address: Yup.string().required('Shipping Address is Required'),
      billing_address: Yup.string().required('Billing Address is Required'),
    }),
  ),
});
export const addTutorialsSchema = Yup.object().shape({
  description: Yup.string().required(' Description is required'),
  attachment: Yup.mixed().required('Attachement is required'),
  tutorial_format: Yup.string().required('Format is required'),
  module_type: Yup.string().required('Module is required'),
  application_type: Yup.string().required('Application type is required'),
  user_type: Yup.string().required('User is required'),
});
export const addRolesSchema = Yup.object().shape({
  name: Yup.string().required('Name is Required'),
});

export const addTeamMemberListSchema = Yup.object().shape({
  user_id: Yup.array().required('user Name is Required'),
});
export const addEmployeeSchema = Yup.object().shape({
  name: Yup.string().required('Name is Required'),
  mobile: Yup.string()
    .matches(phoneRegExp, 'Phone Number is not valid')
    .typeError('Phone No. must be a number')
    .min(10, 'Enter minimum 10 character')
    .required('Phone Number is a Required'),
  joining_date: Yup.string().required('Joining Date is Required'),
  salary: Yup.string().required('Salary is Required'),
  salary_term: Yup.object().required('Salary Term is Required'),
  // skills: Yup.array().required('skills is Required'),
  // skills: Yup.object().required('skills is Required'),
  role_id: Yup.object().required('Role is Required'),
  // team_id: Yup.object().required('Team is Required'),
  employment_status: Yup.object().required('employment status is Required'),
  aadhar: Yup.string().required('aadhar is Required'),
});

export const addProductSchema = Yup.object().shape({
  product_name: Yup.string().trim().required('Product Name is Required'),
  category_id: Yup.string().required('Category is Required'),
  price: Yup.number().required('Price is Required'),
  quantity: Yup.string().trim().required('Quantity is Required'),
  alert_quantity: Yup.string().trim().required('Alert Quantity is Required'),
});
export const addTaskSchema = Yup.object().shape({
  title: Yup.string().trim().required('title is Required'),
  project_name: Yup.string().trim().required('Project name is Required'),
  collaborators: Yup.mixed().required('Colloborator name is Required'),
  assign_to: Yup.string().trim().required('Assign name is Required'),
  category_id: Yup.string().trim().required('Category name is Required'),
  start_date: Yup.string().trim().required('Date  is Required'),
  end_date: Yup.string().trim().required('Date  is Required'),
  status: Yup.string().trim().required('Status is Required'),
});

export const addContactsSchema = Yup.object().shape({
  company_id: Yup.string().required('Company is required'),
  first_name: Yup.string().required('First name is required'),
  last_name: Yup.string().required('Last name is required'),
  position: Yup.mixed().required('Position is required'),

  phone: Yup.array().of(
    Yup.object().shape({
      number: Yup.number()
        .typeError('must be a number')
        .required('Number is required')
        .positive('must be positive'),
    }),
  ),
  email: Yup.array().of(
    Yup.object().shape({
      email: Yup.string()
        .email('please enter valid email')
        .required('Email is Required'),
    }),
  ),
});

export const addSupplierSchema = Yup.object().shape({
  supplier_name: Yup.string().trim().required('Supplier Name is Required'),
  owner_name: Yup.string().trim().required('Owner Name is Required'),
  cashier_name: Yup.string().trim().required('Cashier Name is Required'),

  bank_id: Yup.string().required('Bank Name is Required'),
  account_holder_name: Yup.string()
    .trim()
    .required('Account Holder Name is Required'),
  account_number: Yup.string().trim().required('Account Number is Required'),
  branch_name: Yup.string().trim().required('Branch Name is Required'),
  ifsc_code: Yup.string().trim().required('Ifsc Code is Required'),

  address: Yup.array().of(
    Yup.object().shape({
      shop_office_number: Yup.string().required(
        'Shop/office number is required',
      ),
      street_name: Yup.string().required('Street name is Required'),
      city: Yup.string().required('City is Required'),
      state: Yup.string().required('State is Required'),
      pin_code: Yup.string().required('pincode is Required'),
      landmark: Yup.string().required('Landmark  is Required'),
      gst_number: Yup.string().required('Gst number is Required'),
    }),
  ),
});

export const editEmployeeSchema = addEmployeeSchema.shape({
  image: Yup.mixed(),
  upload_aadhar_card_image1: Yup.mixed(),
  upload_aadhar_card_image2: Yup.mixed(),
  upload_bank_documents: Yup.mixed(),
  upload_pan_card: Yup.mixed(),
});

export const addMessageSchema = Yup.object().shape({
  user_id: Yup.string().required('User is Required'),
});
export const addTaskCategorySchema = Yup.object().shape({
  name: Yup.string().required('Name is Required'),
});

export const createManuallychema = Yup.object().shape({
  name: Yup.mixed().required('Name is Required'),
  start_date: Yup.string().required('Start Date is Required'),
  clock_in: Yup.string().required('Clock-In is Required'),
  end_date: Yup.string().required('End Date is Required'),
  clock_out: Yup.string().required('Clock-Out is Required'),
  descritpion: Yup.string().required('Description is Required'),
});
export const assignLeaveSchema = Yup.object().shape({
  user_id: Yup.mixed().required('Name is required'),
  leave_type_id: Yup.mixed().required('leave type is required'),
  start_date: Yup.string().required('DATE IS required'),
  end_date: Yup.string().required('date is required'),
  reason: Yup.string().required('Reason is required'),
  image: Yup.mixed().required('Document is required'),
});
export const addTermConditionSchema = Yup.object().shape({
  title: Yup.string().required('title is Required'),
});
export const addDocumentCategorySchema = Yup.object().shape({
  category: Yup.string().required('Category is Required'),
  title: Yup.string().required('Title is Required'),
});
export const addCategoryNameSchema = Yup.object().shape({
  category_name: Yup.string().trim().required('Category Name is Required'),
});
export const createMessageSchema = Yup.object().shape({
  user_ids: Yup.array().required(' Name is Required'),
  date: Yup.string().required('date is Required'),
  message: Yup.string().required('message is Required'),
  title: Yup.string().required('title is Required'),
});
export const addBrandNameSchema = Yup.object().shape({
  brand_name: Yup.string().trim().required('brand Name is Required'),
});
export const addSubCategorySchema = Yup.object().shape({
  name: Yup.string().trim().required('Sub Category Name is Required'),
});
export const addFeedbackSchema = Yup.object().shape({
  title: Yup.string().trim().required('title is Required'),
  description: Yup.string().trim().required('description is Required'),
  status: Yup.string().trim().required('type is Required'),
});
export const addResponseSchema = Yup.object().shape({
  response: Yup.string().trim().required('Response is Required'),
});
export const addTaskCategoryNameSchema = Yup.object().shape({
  name: Yup.string().trim().required('Category Name is Required'),
});
export const addUnitDataSchema = Yup.object().shape({
  name: Yup.string().trim().required('Unit Name is Required'),
  short_name: Yup.string().trim().required('Short Name is Required'),
});
export const addDocumentSchema = Yup.object().shape({
  category_id: Yup.string().required('Document Category is Required'),
  user_type: Yup.string().required('User Type is Required'),
  remark: Yup.string().required('Remark is Required'),
});
export const addBankDataSchema = Yup.object().shape({
  bank_name: Yup.string().trim().required('bank name is Required'),
  website: Yup.string().url('Invalid URL').required('website is Required'),
  logo: Yup.mixed().required('logo is Required'),
});
export const addFinancialYearSchema = Yup.object().shape({
  start_date: Yup.string().trim().required('Start date is Required'),
  end_date: Yup.string().trim().required('End date is Required'),
});

export const addEarthingTestignSchema = Yup.object().shape({
  complaint_id: Yup.string().required('Compalint is Required'),
  user_id: Yup.array().min(1).required('User is Required'),
  outlet_id: Yup.array().min(1).required('outlet is Required'),
  expire_date: Yup.string().min(1).required('Expiry Date is Required'),
});

export const addPlanPricingSchema = Yup.object().shape({
  name: Yup.string().trim().required('Name is Required'),
  modules: Yup.array().min(1).required('Module is Required'),
  price: Yup.string().trim().required('Price is Required'),
  duration: Yup.string().trim().required('duration is Required'),
  description: Yup.string().trim().required('Description is Required'),
  image: Yup.mixed().required('Document is Required'),
});

export const addSurveyItemMasterSchema = Yup.object().shape({
  name: Yup.string().required('Name is Required'),
  rate: Yup.string().required('Rate is Required'),
  qty: Yup.string().required('Qty is Required'),
});
export const addSurveyAssignSchema = Yup.object().shape({
  assign_to: Yup.mixed().required('Energy Company is Required'),
});
export const addSurveyPurposeMasterSchema = Yup.object().shape({
  name: Yup.string().required('Name is Required'),
});
export const addEnableDisableSchema = Yup.object().shape({
  // name: Yup.string().required("Name is Required"),
});
export const addInsuranceCompanySchema = Yup.object().shape({
  company_name: Yup.string().required('Company Name is Required'),
  company_code: Yup.string().required('Company Code is Required'),
});
export const addInsuranceCompanyPlansSchema = Yup.object().shape({
  // insurance_company_id: Yup.mixed().required("insurance company Name is Required"),
  policy_name: Yup.string().required('policy name is Required'),
  policy_type: Yup.string().required('policy type is Required'),
  policy_start_date: Yup.string().required('policy start date is Required'),
  policy_end_date: Yup.string().required('policy end date is Required'),
  policy_premium_amount: Yup.string().required(
    'policy premium amount is Required',
  ),
  policy_coverage_limits: Yup.string().required(
    'policy coverage limits is Required',
  ),
  policy_covered_risks: Yup.string().required(
    'policy covered risks is Required',
  ),
  policy_deductible_amount: Yup.string().required(
    'policy deductible amount is Required',
  ),
  policy_renewal_date: Yup.string().required('policy renewal date is Required'),
  policy_tenure: Yup.string().required('policy tenure is Required'),
});
export const addEmployeePensionRetirmentSchema = Yup.object().shape({
  retirement_date: Yup.string().required('retirement date is Required'),
  asset_recovery: Yup.string().required('asset recovery is Required'),
  pension_duration: Yup.string().required('pension duration is Required'),
});
export const addSalaryDisbursalSchema = Yup.object().shape({
  amount: Yup.string().required('Amount is Required'),
  transaction_mode: Yup.string().required('Transaction Mode is Required'),
  transaction_number: Yup.string().required('Transaction Number is Required'),
});

export const markSalaryDisbursalSchema = Yup.object().shape({
  amount: Yup.string()
    .required('Amount is Required')
    .test(
      'is-greater-than-final-pay',
      'Amount should not be greater than Final Pay Amount',
      function (value) {
        const { final_pay_amount } = this.parent;
        return Number(value) <= Number(final_pay_amount);
      },
    ),
  transaction_mode: Yup.string().required('Transaction Mode is Required'),
  transaction_number: Yup.string().required('Transaction Number is Required'),
});

export const addSurveyOtpSchema = Yup.object().shape({
  mobile: Yup.string()
    .matches(phoneRegExp, 'Phone Number is not valid')
    .typeError('Phone No. must be a number')
    .min(10, 'Enter minimum 10 character')
    .required('Phone Number is a Required'),
});
// Attendance Validation
export const createManuallySchema = Yup.object().shape({
  user_ids: Yup.mixed().required('User Name is Required'),
  attendance_status: Yup.object().required('Attendance Status is Required'),
});
export const createManuallyAttendanceSchema = Yup.object().shape({
  attendance_status: Yup.object().required('Attendance Status is Required'),
});
