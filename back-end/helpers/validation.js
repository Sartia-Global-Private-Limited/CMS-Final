const Joi = require("joi");
var moment = require("moment");

const checkPositiveInteger = Joi.object({
    id: Joi.number().integer().positive().required(),
});

const outletFormValidation = Joi.object({
    energy_company_id: Joi.number().required(),
    zone_id: Joi.number().required(),
    regional_id: Joi.number().required(),
    sales_area_id: Joi.number().required(),
    district_id: Joi.optional().required(),
    outlet_name: Joi.string().required(),
    outlet_contact_number: Joi.number().required(),
    customer_code: Joi.string().required(),
    outlet_category: Joi.string().required(),
    outlet_ccnoms: Joi.string().required(),
    outlet_ccnohsd: Joi.string().required(),
    outlet_unique_id: Joi.string().required(),
    // email: Joi.string().required(),
    address: Joi.string().required(),
    status: Joi.string().required(),
}).options({ allowUnknown: true });

const saleCompanyFiledValidated = Joi.object({
    name: Joi.string().required(),
    contact: Joi.string().required(),
    mobile: Joi.number().required(),
    address: Joi.string().required(),
    primary_contact_person: Joi.string().required(),
    primary_contact_mobile: Joi.number().required(),
    gst_treatment_type: Joi.string().required(),
    business_legal_name: Joi.string().required(),
    billing_address: Joi.string().required(),
}).options({ allowUnknown: true });

const purchaseCompany = Joi.object({
    company_name: Joi.string().required(),
    company_contact: Joi.string().required(),
    company_mobile: Joi.number().required(),
    company_address: Joi.string().required(),
    company_contact_person: Joi.string().required(),
    primary_contact_number: Joi.number().required(),
    gst_treatment_type: Joi.string().required(),
    business_legal_name: Joi.string().required(),
    billings_address: Joi.string().required(),
}).options({ allowUnknown: true });

// const companyValidation = Joi.object({

//     company_name: Joi.string().required(),
//     company_contact: Joi.string().required(),
//     company_mobile: Joi.number().required(),
//     company_address: Joi.string().required(),
//     company_contact_person: Joi.string().required(),
//     primary_contact_number: Joi.number().required(),
//     gst_treatment_type: Joi.string().required(),
//     business_legal_name: Joi.string().required(),
// }).options({ allowUnknown: true });

const gst_details = Joi.object({
    gst_number: Joi.string()
        .pattern(/^[0-9]{2}[A-Z]{5}[0-9]{4}[A-Z]{1}[A-Z0-9]{1}Z[A-Z0-9]{1}$/i)
        .required()
        .messages({
            'string.pattern.base': 'GST number must be valid (e.g., 22ABCDE1234F1Z5).',
            'string.empty': 'GST number is required.',
        }),
    billing_address: Joi.string()
        .required()
        .messages({
            'string.base': 'Billing address must be a string.',
            'any.required': 'Billing address is required.',
        }),
    shipping_address: Joi.string().allow("", null)
        .messages({
            'string.base': 'Shipping address must be a string.',
        }),
    is_default: Joi.string()
        .valid('1', '0')
        .required()
        .messages({
            'any.only': 'Is default must be either "1" or "0".',
            'string.base': 'Is default must be a string.',
            'any.required': 'Is default is required.',
        })
});

const companyValidation = Joi.object({
    company_name: Joi.string().required(),
    company_contact: Joi.required(),
    company_mobile: Joi.number().required(),
    company_address: Joi.string().required(),
    pin_code: Joi.number()
        .integer()
        .min(100000) // Minimum 6-digit number
        .max(999999) // Maximum 6-digit number
        .required()
        .messages({
            'number.base': 'Pincode must be a valid number.',
            'number.min': 'Pincode must be at least 6 digits.',
            'number.max': 'Pincode must be at most 6 digits.',
            'any.required': 'Pincode is required.',
        }),
    company_contact_person: Joi.string().required(),
    primary_contact_number: Joi.number().required(),
    gst_treatment_type: Joi.string().required(),
    business_legal_name: Joi.string().required(),
    pan_number: Joi.string()
        .pattern(/^[A-Z]{5}[0-9]{4}[A-Z]{1}$/i) // Regex for PAN number (case-insensitive)
        .required()
        .messages({
            'string.pattern.base': 'PAN number must be Valid (e.g., ABCDE1234F).',
            'string.empty': 'PAN number is required.',
        }),
    my_company: Joi.number().required().allow(0,1),
    enable_company_type: Joi.number().required().allow(0,1),
    gst_details: Joi.array().items(gst_details).required(),
}).options({ allowUnknown: true });

const companyImportValidation = Joi.object({
    company_name: Joi.string().required(),
    company_contact: Joi.required(),
    company_mobile: Joi.number().required(),
    primary_contact_email: Joi.string().email().required().messages({
        'string.email': 'Must provide valid email address.',
        'string.empty': 'Primary contact email is required.',
    }),
    company_address: Joi.string().required(),
    company_pincode: Joi.number()
        .integer()
        .min(100000) // Minimum 6-digit number
        .max(999999) // Maximum 6-digit number
        .required()
        .messages({
            'number.base': 'Pincode must be a valid number.',
            'number.min': 'Pincode must be at least 6 digits.',
            'number.max': 'Pincode must be at most 6 digits.',
            'any.required': 'Pincode is required.',
        }),
    company_contact_person: Joi.string().required(),
    primary_contact_number: Joi.number().required(),
    gst_treatment_type: Joi.string().required(),
    business_legal_name: Joi.string().required(),
    pan_number: Joi.string()
        .pattern(/^[A-Z]{5}[0-9]{4}[A-Z]{1}$/i) // Regex for PAN number (case-insensitive)
        .required()
        .messages({
            'string.pattern.base': 'PAN number must be Valid (e.g., ABCDE1234F).',
            'string.empty': 'PAN number is required.',
        }),
    my_company: Joi.number().required().allow(0,1),
    enable_company_type: Joi.number().required().allow(0,1),
    gst_number: Joi.string()
    .pattern(/^[0-9]{2}[A-Z]{5}[0-9]{4}[A-Z]{1}[A-Z0-9]{1}Z[A-Z0-9]{1}$/i)
    .required()
    .messages({
        'string.pattern.base': 'GST number must be valid (e.g., 22ABCDE1234F1Z5).',
        'string.empty': 'GST number is required.',
    }),
    billing_address: Joi.string()
        .required()
        .messages({
            'string.base': 'Billing address must be a string.',
            'any.required': 'Billing address is required.',
        }),
    shipping_address: Joi.string().allow("", null)
        .messages({
            'string.base': 'Shipping address must be a string.',
        }),
}).options({ allowUnknown: true });

const adminCreateValidation = Joi.object({
    name: Joi.string().required().messages({
        "any.required": "Name is required",
        "string.empty": "Name cannot be empty",
    }),
    email: Joi.string().email().required().messages({
        "string.email": "Email must be a valid email address",
        "any.required": "Email is required",
        "string.empty": "Email cannot be empty",
    }),
    // password: Joi.string().messages({
    //     "any.required": "Password is required",
    //     "string.empty": "Password cannot be empty",
    // }),
    pan: Joi.string().allow("")
    .pattern(/^[A-Z]{5}[0-9]{4}[A-Z]{1}$/i) // Regex for PAN number (case-insensitive)
    .messages({
        'string.pattern.base': 'PAN number must be Valid (e.g., ABCDE1234F).',
        'string.empty': 'PAN number is required.',
    }),
    mobile: Joi.string()
        .pattern(/^\+?[1-9]\d{1,14}$/)
        .required()
        .messages({
            "string.pattern.base": "Mobile number must be a valid international number with country code",
            "any.required": "Mobile number is required",
            "string.empty": "Mobile number cannot be empty",
        }), // Allows international numbers with country codes
    joining_date: Joi.date().required().messages({
        "date.base": "Joining date must be a valid date",
        "any.required": "Joining date is required",
        "string.empty": "Joining date cannot be empty",
    }),
    role_id: Joi.number().integer().required().messages({
        "number.base": "Role ID must be a number",
        "any.required": "Role ID is required",
    }),
    // address: Joi.string().optional().messages({
    //     'string.empty': 'Address cannot be empty'
    // }),
    skills: Joi.string().required().messages({
        "string.empty": "Skills cannot be empty",
        "any.required": "Skills are required",
    }),
    employment_status: Joi.string().required().messages({
        "string.empty": "Employment status cannot be empty",
        "any.required": "Employment status is required",
    }),
    // pan: Joi.string().optional().messages({
    //     'string.empty': 'PAN cannot be empty'
    // }),
    aadhar: Joi.string()
        .pattern(/^[0-9]{12}$/)
        .required()
        .messages({
            "string.pattern.base": "Aadhar must be valid 12 digits",
            "string.empty": "Aadhar cannot be empty",
            "any.required": "Aadhar is required",
        }),
    // bank_name: Joi.string().messages({
    //     'string.empty': 'Bank name cannot be empty'
    // }),
    // epf_no: Joi.string().messages({
    //     'string.empty': 'EPF number cannot be empty'
    // }),
    // esi_no: Joi.string().messages({
    //     'string.empty': 'ESI number cannot be empty'
    // }),
    // ifsc_code: Joi.string().pattern(/^[A-Za-z]{4}\d{7}$/).messages({
    //     'string.pattern.base': 'IFSC code must follow standard format (e.g., ABCD0123456)',
    //     'string.empty': 'IFSC code cannot be empty'
    // }),
    // account_number: Joi.string().messages({
    //     'string.empty': 'Account number cannot be empty'
    // }),
    family_info: Joi.string().optional().messages({
        "string.empty": "Family info cannot be empty",
    }),
    // team_id: Joi.number().integer().optional().messages({
    //     'number.base': 'Team ID must be a number'
    // }),
    salary: Joi.number().precision(2).optional().messages({
        "number.base": "Salary must be a valid number",
        "number.precision": "Salary can have up to 2 decimal places",
    }),
    salary_term: Joi.string().optional().messages({
        "string.empty": "Salary term cannot be empty",
    }),
    credit_limit: Joi.number().precision(2).required().messages({
        "number.base": "Credit limit must be a valid number",
        "number.precision": "Credit limit can have up to 2 decimal places",
        "any.required": "Credit limit is required",
    }),
}).options({ allowUnknown: true });

const adminUserUpdateValidation = Joi.object({
    aadhar: Joi.string()
        .pattern(/^[0-9]{12}$/)
        .messages({
            "string.pattern.base": "Aadhar must be 12 digits",
            "string.empty": "Aadhar cannot be empty",
            "any.required": "Aadhar is required",
        }),
    credit_limit: Joi.number().precision(2).messages({
        "number.base": "Credit limit must be a valid number",
        "number.precision": "Credit limit can have up to 2 decimal places",
    }),
    account_number: Joi.number().allow(null, "").optional().precision(2).messages({
        "number.base": "Account number must be a valid number",
        "number.precision": "Account number can have up to 2 decimal places",
    }),
}).options({ allowUnknown: true });

const loginValidation = Joi.object({
    email: Joi.string().email().required().messages({
        "string.empty": "Email needed to enable login",
        "string.email": "Email must be a valid",
    }),
    password: Joi.string().required().messages({
        "string.empty": "Password cannot be empty",
    }),
}).options({ allowUnknown: true });

const subUserFormValidation = Joi.object({
    name: Joi.string().required(),
    email: Joi.string().required(),
    password: Joi.string().required(),
    joining_date: Joi.date().raw().required(),
}).options({ allowUnknown: true });

const subUserProfileUpdateValidation = Joi.object({
    name: Joi.string().required(),
    email: Joi.string().required(),
    mobile: Joi.number().required(),
}).options({ allowUnknown: true });

const changePasswordValidation = Joi.object({
    old_password: Joi.string().required(),
    new_password: Joi.string().required(),
    confirm_password: Joi.string().required(),
}).options({ allowUnknown: true });

const validatePermissionOnRoleBassi = Joi.object({
    module_id: Joi.number().positive().required(),
    role_id: Joi.number().positive().required(),
}).options({ allowUnknown: true });

// const complaintTypeValidations = Joi.object({
//     energy_company_id: Joi.number().positive().required(),
//     complaint_for: Joi.string().required(),
//     complaint_type: Joi.required(),
//     description: Joi.string().required(),
// }).options({ allowUnknown: true });
const complaintTypeValidations = Joi.object({
    energy_company_id: Joi.number().positive().required(),
    complaint_for: Joi.string().required(),
    complaint_type: Joi.required(),
    description: Joi.string().optional().allow(""),

    // Group the conditionally required fields together
    zone_id: Joi.array().items(Joi.number().positive().allow("")),
    ro_id: Joi.array().items(Joi.number().positive().allow("")),
    sale_area_id: Joi.array().items(Joi.number().positive().allow("")),
    district_id: Joi.array().items(Joi.number().positive().allow("")),
    outlet_id: Joi.array().items(Joi.number().positive().allow("")),
})
    .when(Joi.object({ complaint_for: Joi.string().valid("1") }).unknown(), {
        then: Joi.object({
            zone_id: Joi.required(),
            ro_id: Joi.required(),
            sale_area_id: Joi.required(),
            district_id: Joi.required(),
            outlet_id: Joi.required(),
        }),
    })
    .options({ allowUnknown: true });

const teamValidations = Joi.object({
    team_name: Joi.string().required().messages({
        "any.required": "Team name is required",
        "string.base": "Team name must be a string",
    }),
    // team_short_description: Joi.string().optional().messages({
    //     "string.base": "Team short description must be a string",
    // }),
    manager_id: Joi.number().required().messages({
        "any.required": "Manager ID is required",
        "number.base": "Manager ID must be a number",
    }),
    supervisor_id: Joi.number().optional().messages({
        "number.base": "Supervisor ID must be a number",
    }),
    members: Joi.array().items(Joi.number().required()).required().messages({
        "any.required": "Members are required",
        "array.base": "Members must be an array",
        "number.base": "Each member ID must be a number",
    }),
    type: Joi.number().required().messages({
        "any.required": "Type is required",
        "number.base": "Type must be a number",
    }),
}).options({ allowUnknown: true });

const energyCompanyValidations = Joi.object({
    name: Joi.string().required(),
    email: Joi.string().required(),
    contact_no: Joi.number().required(),
});

const contractorValidations = Joi.object({
    name: Joi.string().required(),
    email: Joi.string().required(),
    contact_no: Joi.number().required(),
    password: Joi.string().required().min(6),
}).options({ allowUnknown: true });

const contractorValidationsForUpdate = Joi.object({
    name: Joi.string().required(),
    email: Joi.string().required(),
    contact_no: Joi.string()
        .pattern(/^\+?[1-9]\d{1,14}$/) // E.164 format: optional +, country code (1-3 digits), 7-12 digits local number
        .required() // Make the field required
        .messages({
            "string.pattern.base": "mobile must be a valid international number in E.164 format.",
            "string.empty": "mobile is required.",
        }),
}).options({ allowUnknown: true });

const tutorialValidations = Joi.object({
    user_type: Joi.number().required(),
    application_type: Joi.string().required(),
    module_type: Joi.string().required(),
    tutorial_format: Joi.string().required(),
    description: Joi.string().required(),
}).options({ allowUnknown: true });

const planValidations = Joi.object({
    name: Joi.string().required(),
    price: Joi.number().required(),
    duration: Joi.string().required(),
    description: Joi.string().required(),
});

const buyUpgradePlanValidations = Joi.object({
    plan_id: Joi.number().required(),
    plan_duration: Joi.string().required(),
});

const notificationCreateValidations = Joi.object({
    title: Joi.string().required(),
    message: Joi.string().required(),
});

const surveyValidations = Joi.object({
    title: Joi.string().required(),
    description: Joi.string().required(),
    format: Joi.string().required(),
    questions: Joi.array().required(),
});

const addDocumentValidations = Joi.object({
    category_id: Joi.number().required(),
    user_type: Joi.number().required(),
    user_id: Joi.required(),
    remarks: Joi.string().required(),
}).options({ allowUnknown: true });

const tasksManagerValidations = Joi.object({
    title: Joi.string().required(),
    start_date: Joi.date().raw().required(),
    end_date: Joi.date().raw().required(),
    assign_to: Joi.number().required(),
    project_name: Joi.string().required(),
    category_id: Joi.number().required(),
    status: Joi.string().required(),
    collaborators: Joi.array().required(),
});

const changePasswordValidations = Joi.object({
    old_password: Joi.string().required(),
    new_password: Joi.string().required(),
    confirm_password: Joi.string().required(),
});

const hrTeamValidations = Joi.object({
    manager_id: Joi.number().required(),
    supervisor_id: Joi.number().required(),
    team_name: Joi.string().required(),
});
const importHrTeamValidations = Joi.object({
    manager_id: Joi.number().required(),
    supervisor_id: Joi.number().required(),
    team_name: Joi.string().required(),
    team_member: Joi.array().items(Joi.number().required()).required(),
    team_short_description: Joi.string(),
});

const profileValidations = Joi.object({
    name: Joi.string().required(),
    email: Joi.string().required(),
    mobile: Joi.number().required(),
    joining_date: Joi.string().required(),
});

const userActivityLogValidations = Joi.object({
    userId: Joi.number().integer().positive().required(),
    roleId: Joi.number().integer().positive().required,
    timestamp: Joi.number().integer().positive().required,
    action: Joi.string().required(),
    ipAddress: Joi.required(),
    userAgent: Joi.string().required(),
    result: Joi.string().required(),
}).options({ allowUnknown: true });

const termsAndConditionsValidation = Joi.object({
    title: Joi.string().required(),
    content: Joi.required(),
    status: Joi.number().required(),
}).options({ allowUnknown: true });

const userCreateValidations = Joi.object({
    name: Joi.string().required(),
    email: Joi.string().required().email().messages({
        "string.email": "email must be a valid email address.",
        "string.empty": "email is required.",
    }),
    pan: Joi.string().allow("")
    .pattern(/^[A-Z]{5}[0-9]{4}[A-Z]{1}$/i) // Regex for PAN number (case-insensitive)
    .messages({
        'string.pattern.base': 'PAN number must be Valid (e.g., ABCDE1234F).',
        'string.empty': 'PAN number is required.',
    }),
    mobile: Joi.string()
        .pattern(/^\+?[1-9]\d{1,14}$/) // E.164 format: optional +, country code (1-3 digits), 7-12 digits local number
        .required() // Make the field required
        .messages({
            "string.pattern.base": "mobile must be a valid international number in E.164 format.",
            "string.empty": "mobile is required.",
        }),
    aadhar: Joi.string()
    .pattern(/^[0-9]{12}$/)
    .required()
    .messages({
        "string.pattern.base": "Aadhar must be valid 12 digits",
        "string.empty": "Aadhar cannot be empty",
        "any.required": "Aadhar is required",
    }),
    joining_date: Joi.date().required(),
    salary: Joi.number().required(),
    salary_term: Joi.string().required(),
    role_id: Joi.number().integer().positive().required(),
    employment_status: Joi.string().required(),
    credit_limit: Joi.string().required(),
}).options({ allowUnknown: true });

const leaveApplicationValidations = Joi.object({
    leave_type_id: Joi.number().required(),
    start_date: Joi.string().required(),
    end_date: Joi.string().required(),
    reason: Joi.string().required(),
}).options({ allowUnknown: true });

const breakValidations = Joi.object({
    break_name: Joi.string().required(),
    break_number: Joi.number().required(),
    status: Joi.number().required(),
});

const insurancePlansValidations = Joi.object({
    insurance_company_id: Joi.number().integer().positive().required(),
    policy_name: Joi.string().required(),
    policy_type: Joi.string().required(),
    policy_start_date: Joi.date().required(),
    policy_end_date: Joi.date().required(),
    policy_premium_amount: Joi.number().required(),
    policy_coverage_limits: Joi.number().required(),
    policy_covered_risks: Joi.number().required(),
    policy_deductible_amount: Joi.number().required(),
    policy_renewal_date: Joi.date().required(),
    policy_tenure: Joi.string().required(),
}).options({ allowUnknown: true });

const resignationStatusValidation = Joi.object({
    id: Joi.number().integer().positive().required(),
    status: Joi.number().integer().positive().required(),
});

const pensionFormValidation = Joi.object({
    user_id: Joi.number().integer().positive().required(),
    retirement_date: Joi.date().required(),
    pension_status: Joi.number(),
    pension_amount: Joi.number().required(),
}).options({ allowUnknown: true });

const messageValidation = Joi.object({
    sender_id: Joi.string().required(),
    recipient_id: Joi.string().required(),
    message_content: Joi.string().required(),
}).options({ allowUnknown: true });

const salaryValidation = Joi.object({
    user_id: Joi.number().integer().positive().required(),
    date_of_hire: Joi.required(),
    salary: Joi.number().required(),
    salary_term: Joi.string().required(),
}).options({ allowUnknown: true });

const fundRequestValidation = Joi.object({
    complaint_id: Joi.string().required(),
    request_purpose: Joi.string().required(),
    request_amount: Joi.number().integer().positive().required(),
}).options({ allowUnknown: true });

const stockRequestValidation = Joi.object({
    product_id: Joi.number().integer().positive().required(),
    rate: Joi.number().required(),
    quantity: Joi.number().required(),
    supplier_id: Joi.number().required(),
}).options({ allowUnknown: true });

// Define the schema for each po_item
const poItemSchema = Joi.object({
    order_line_number: Joi.number().required().label("Order Line Number"),
    hsn_code: Joi.string().required().label("HSN Code"),
    name: Joi.string().required().label("Item Name"),
    unit: Joi.string().required().label("Unit"),
    // gst_id: Joi.object({
    //     percentage: Joi.number().required().label('GST Percentage'),
    // }).required().label('GST ID').messages({
    //     "any.required": `#label# is required.`,
    //     "any.label": `#label# is required.`,
    //     "any.base": `#label# is required.`,
    // }),
    // gst_percent: Joi.number().required().label("GST Percent"),
    totalGSTAmount: Joi.number().allow("null").label("Total GST Amount"),
    // qty: Joi.number().required().label('Quantity'),
    amount: Joi.number().allow(null).label("Amount"),
    // change_gst_type: Joi.string().required().label("Change GST Type"),
});

const purchaseOrderValidation = Joi.object({
    po_date: Joi.date().required(),
    ro_office: Joi.number().required(),
    state: Joi.number().required(),
    po_number: Joi.string().required(),
    // po_amount: Joi.number().optional(),
    tax_type: Joi.number().optional(),
    tax: Joi.number().optional(),
    limit: Joi.number()
    .required()
    .min(0) // Ensure the limit is not negative
    .messages({
        "number.base": `Limit is required.`,
        "any.required": `Limit is required.`,
        "number.min": `Limit must be a non-negative number.` // Custom message for negative values
    }),
    po_budget: Joi.number().optional(),
    // security_deposit_date: Joi.date().required(),
    security_deposit_amount: Joi.number().optional().allow(''),
    tender_date: Joi.date().required(),
    tender_number: Joi.string().required(),
    bank: Joi.string().optional().allow(""),
    dd_bg_number: Joi.string().optional().allow(""),
    work: Joi.string().required(),
    // cr_date: Joi.date().required().messages({
    //     "string.empty": "cr_date is required.",
    //     "any.required": "cr_date is required.",
    // }),
    po_items: Joi.array().items(poItemSchema).optional().label("PO Items"),
}).options({ allowUnknown: true });

const measurementValidation = Joi.object({
    measurement_date: Joi.date().required(),
    financial_year: Joi.string().required(),
    complaint_for: Joi.number().required(),
    po_id: Joi.number().required(),
    items_data: Joi.array()
        .items(
            Joi.object({
                item_name: Joi.string(),
                item_id: Joi.number().integer(),
                unit: Joi.string(),
                hsn_code: Joi.string(),
                total_qty: Joi.number(),
                remaining_quantity: Joi.number().allow(null), // Nullable field
                rate: Joi.number(),
                order_line_number: Joi.number().integer(),
                childArray: Joi.array()
                    .items(
                        Joi.object({
                            description: Joi.string().required(),
                            no: Joi.string().required(),
                            length: Joi.string().allow(""), // Optional string field
                            breadth: Joi.string().allow(""), // Optional string field
                            depth: Joi.string().allow(""), // Optional string field
                            qty: Joi.number().required(),
                        })
                    )
                    .min(1) // Ensure childArray is not empty
                    .required()
                    .messages({ "array.min": "childArray must contain at least 1 item." }),
                // childArray must exist
            })
        )
        .min(1),

    // If complaint_for is 1, both ro_office_id and sale_area_id are required
    ro_office_id: Joi.number().allow(null),
    sale_area_id: Joi.number().allow(null),
})
    .when(Joi.object({ complaint_for: Joi.valid(1) }).unknown(), {
        then: Joi.object({
            ro_office_id: Joi.number().required(),
            sale_area_id: Joi.number().required(),
        }),
    })
    .options({ allowUnknown: true });

const quotationSchema = Joi.object({
    company_from: Joi.number().integer().required(),
    company_from_state: Joi.number().required(),
    company_to: Joi.number().integer().required(),
    company_to_regional_office: Joi.number().required(),
    quotation_date: Joi.date().required().iso(),
    regional_office_id: Joi.number().required(),
    sales_area_id: Joi.number().required(),
    // outlet: Joi.number().required(),
    po_number: Joi.required(),
    complaint_type: Joi.required(),
    // remark: Joi.string().required(),
}).options({ allowUnknown: true });

// Validation schema using joi
// const supplierSchema = Joi.object({

//     supplier_name: Joi.string().required(),
//     owner_name: Joi.string().required(),
//     cashier_name: Joi.string().required(),
//     supplier_code: Joi.string().required(),
//     bank_id: Joi.number().required(),
//     account_holder_name: Joi.string().required(),
//     account_number: Joi.required(),
//     branch_name: Joi.string().required(),
//     ifsc_code: Joi.string().required(),
//     address: Joi.object().required(),

// }).options({ allowUnknown: true });

const supplierSchema = Joi.object({
    supplier_name: Joi.string().required(),
    owner_name: Joi.string().required(),
    cashier_name: Joi.string().required(),
    // supplier_code: Joi.string().required(),
    bank_id: Joi.number().required(),
    account_holder_name: Joi.string().required(),
    account_number: Joi.number().required(),
    branch_name: Joi.string().required(),
    ifsc_code: Joi.string().required(),
    address: Joi.array()
        .items(
            Joi.object({
                shop_office_number: Joi.string().required().messages({
                    "string.empty": `Shop office number is required.`,
                }),
                street_name: Joi.string().messages({
                    "string.empty": `Street Name is required.`,
                }),
                city: Joi.required().messages({
                    "string.empty": `City is required.`,
                }),
                state: Joi.required().messages({
                    "string.empty": `State is required.`,
                }),
                pin_code: Joi.number().required().messages({
                    "string.empty": `Pincode is required.`,
                }),
                landmark: Joi.string().messages({
                    "string.empty": `landmark is required.`,
                }),
                gst_number: Joi.string()
                .pattern(/^[0-9]{2}[A-Z]{5}[0-9]{4}[A-Z]{1}[A-Z0-9]{1}Z[A-Z0-9]{1}$/i)
                .required()
                .messages({
                    'string.pattern.base': 'GST number must be valid (e.g., 22ABCDE1234F1Z5).',
                    'string.empty': 'GST number is required.',
                }),
                is_default: Joi.string().allow("0", "1").required().messages({
                    "string.empty": `Please provide valid is_default value.`,

                }),
            })
        )
        .min(1)
        .required(),
}).options({ allowUnknown: true });


const supplierImportSchema = Joi.object({
    supplier_name: Joi.string().required(),
    owner_name: Joi.string().required(),
    cashier_name: Joi.string().required(),
    // supplier_code: Joi.string().required(),
    bank_id: Joi.number().required(),
    account_holder_name: Joi.string().required(),
    account_number: Joi.number().required(),
    branch_name: Joi.string().required(),
    ifsc_code: Joi.string().required(),
    shop_office_number: Joi.string().required().messages({
        "string.empty": `Shop office number is required.`,
    }),
    street_name: Joi.string().messages({
        "string.empty": `Street Name is required.`,
    }),
    city: Joi.required().messages({
        "string.empty": `City is required.`,
    }),
    state: Joi.required().messages({
        "string.empty": `State is required.`,
    }),
    pin_code: Joi.number().required().messages({
        "string.empty": `Pincode is required.`,
    }),
    landmark: Joi.string().messages({
        "string.empty": `landmark is required.`,
    }),
    gst_number: Joi.string()
    .pattern(/^[0-9]{2}[A-Z]{5}[0-9]{4}[A-Z]{1}[A-Z0-9]{1}Z[A-Z0-9]{1}$/i)
    .required()
    .messages({
        'string.pattern.base': 'GST number must be valid (e.g., 22ABCDE1234F1Z5).',
        'string.empty': 'GST number is required.',
    }),
}).options({ allowUnknown: true });

const measurementItemValidation = Joi.object({
    measurement_id: Joi.number().integer().required(),
    po_id: Joi.number().integer().required(),
    complaint_id: Joi.number().integer().required(),
    item_id: Joi.number().integer().required(),
    unit_id: Joi.number().integer().required(),
    number: Joi.number().required(),
    length: Joi.required(),
    breadth: Joi.required(),
    depth: Joi.required(),
    quantity: Joi.number().required(),
    total_quantity: Joi.number().required(),
    rate: Joi.number().required(),
    amount: Joi.number().required(),
}).options({ allowUnknown: true });

const proformaInvoiceValidation = Joi.object({
    billing_from: Joi.required(),
    billing_from_state: Joi.required(),
    billing_to: Joi.required(),
    complaint_for: Joi.number().required(),
    billing_to_ro_office: Joi.any().when("complaint_for", {
        is: 1,
        then: Joi.required(),
        otherwise: Joi.optional(),
    }),
    financial_year: Joi.required(),
    po_number: Joi.required(),
    measurements: Joi.required(),
    work: Joi.required(),
}).options({ allowUnknown: true });

const financialYearSchema = Joi.object({
    start_date: Joi.required(),
    end_date: Joi.required(),
}).options({ allowUnknown: true });

// Validation schema for units data
const unitsSchema = Joi.object({
    name: Joi.string().required(),
    short_name: Joi.string().required(),
}).options({ allowUnknown: true });

const billingTypeValidation = Joi.object({
    name: Joi.string().required(),
    status: Joi.number().required(),
}).options({ allowUnknown: true });

const taxValidation = Joi.object({
    value: Joi.number().required(),
}).options({ allowUnknown: true });

const invoiceSchema = Joi.object({
    invoice_date: Joi.date().iso().required(),
    financial_year: Joi.string().max(12).required(),
    callup_number: Joi.number().integer().positive().required(),
    pi_id: Joi.array().items(Joi.number().required()),
}).options({ allowUnknown: true });

// Validation schema for the item object
const itemSchema = Joi.object({
    complaint_id: Joi.string().max(100).required(),
    quantity: Joi.number().integer().min(0).required(),
    item_price: Joi.number().integer().min(0).required(),
    // total_price: Joi.number().integer().min(0)
    outlet_id: Joi.required(),
}).options({ allowUnknown: true });

const securityMoneyValidation = Joi.object({
    date: Joi.date().required(),
    po_id: Joi.number().required(),
    amount: Joi.number().required(),
    method: Joi.required(),
    security_deposit_status: Joi.required(),
    payment_status: Joi.required(),
    details: Joi.required(),
}).options({ allowUnknown: true });

const productValidations = Joi.object({
    category_id: Joi.number().required(),
    product_name: Joi.string().required(),
    price: Joi.number().required(),
    quantity: Joi.number().required(),
    alert_quantity: Joi.number().required(),
    is_published: Joi.required(),
    description: Joi.required(),
}).options({ allowUnknown: true });

const requestCashValidation = Joi.object({
    request_amount: Joi.number().required(),
    request_purpose: Joi.string().required(),
}).options({ allowUnknown: true });

const expenseValidation = Joi.object({
    expense_category: Joi.number().required(),
    expense_amount: Joi.number().required(),
    payment_method: Joi.number().required(),
    supplier_id: Joi.number().required(),
    complaint_id: Joi.number().required(),
    expense_description: Joi.string().required(),
}).options({ allowUnknown: true });

const assetsValidationScheme = Joi.object({
    asset_name: Joi.string().required(),
    asset_model_number: Joi.required(),
    asset_uin_number: Joi.required(),
    asset_price: Joi.number().required(),
    asset_purchase_date: Joi.required(),
    // asset_warranty_guarantee_period: Joi.required(),
    asset_warranty_guarantee_start_date: Joi.required(),
    asset_warranty_guarantee_end_date: Joi.required(),
    // asset_warranty_guarantee_value: Joi.required(),
    asset_supplier_id: Joi.required(),
    asset_status: Joi.required(),
}).options({ allowUnknown: true });

const companyContactValidation = Joi.object({
    company_id: Joi.number().required(),
    first_name: Joi.string().required(),
    // last_name: Joi.string().required(),
    phone: Joi.required(),
    email: Joi.required(),
    position: Joi.string().required(),
    status: Joi.number().required(),
}).options({ allowUnknown: true });

const holidayListValidation = Joi.object({
    holiday_name: Joi.string().required(),
    holiday_date: Joi.required(),
    holiday_type: Joi.string().required(),
}).options({ allowUnknown: true });

const emailValidation = Joi.object({
    email: Joi.string().email().required().messages({
        "string.email": "Please enter a valid email address",
        "any.required": "Email is required to enable login",
        "any.empty": "Email is required to enable login",
    }),
}).options({ allowUnknown: true });

const expensePunchValidation = Joi.object({
    user_id: Joi.number().optional(),
    complaint_id: Joi.number().required(),
    items: Joi.array().required(),
}).options({ allowUnknown: true });

const bankFieldValidation = Joi.object({
    bank_name: Joi.string().required(),
    website: Joi.string().required(),
}).options({ allowUnknown: true });

const transferStockValidation = Joi.object({
    transfer_for: Joi.number().required(),
    transfer_to: Joi.number().required(),
    items: Joi.required(),
}).options({ allowUnknown: true });

const amountAddToUserWalletValidationSchema = Joi.object({
    user_id: Joi.number().required(),
    amount: Joi.number().positive().required(),
    remark: Joi.string().required(),
}).options({ allowUnknown: true });

const accountDetailsValidation = Joi.object({
    banks: Joi.required(),
    // accounts:Joi.required(),
}).options({ allowUnknown: true });

const updateAccountDetailsValidation = Joi.object({
    id: Joi.number().required(),
    bank_id: Joi.number().required(),
    account_number: Joi.number().required(),
    ifsc_code: Joi.string().required(),
    branch: Joi.string().required(),
    is_default: Joi.required(),
}).options({ allowUnknown: true });

const addWalletAmountValidation = Joi.object({
    id: Joi.number().required(),
    remark: Joi.string().required(),
    balance: Joi.number().required(),
    transaction_id: Joi.string().required(),
}).options({ allowUnknown: true });

const checkString = Joi.object({
    hsncode: Joi.string().required(),
});

const transferFund = Joi.object({
    transfer_data: Joi.array().required(),
    id: Joi.number().required(),
    remark: Joi.string().required(),
    transaction_id: Joi.string().required(),
    bill_number: Joi.string().required(),
    bill_date: Joi.string().required(),
    bill_amount: Joi.number().required(),
}).options({ allowUnknown: true });

const transferFundForFundReq = Joi.object({
    transfer_data: Joi.array().required(),
    id: Joi.number().required(),
    remark: Joi.string().required(),
    transaction_id: Joi.string().required(),
}).options({ allowUnknown: true });

const reschduleDate = Joi.string()
    .regex(/^\d{4}-\d{2}-\d{2}$/)
    .required();

const stockPunchValidation = Joi.object({
    area_manager_id: Joi.number().required(),
    supervisor_id: Joi.number().allow("", null).optional(),
    end_users_id: Joi.number().allow("", null).optional(),
    complaint_id: Joi.number().required(),
    stock_punch_detail: Joi.array()
        .items(
            Joi.object({
                stock_id: Joi.number().required(),
                item_id: Joi.number().required(),
                brand_id: Joi.number().required(),
                item_qty: Joi.number().min(1).required().messages({
                    "number.min": "Quantity must be greater than zero",
                    "any.required": "Quantity is required",
                }),
            })
        )
        .required(),
}).options({ allowUnknown: true });

const poChangeValidation = Joi.object({
    measurement_id: Joi.number().required(),
    po_id: Joi.number().required(),
});

const earthingTestingSchema = Joi.object({
    complaint_id: Joi.required().messages({
        "any.required": "complaint_id is required",
    }),
    outlet_id: Joi.array().required().messages({
        "any.required": "outlet_id is required",
    }),
    user_id: Joi.array().required().messages({
        "any.required": "user_id is required",
    }),
    expire_date: Joi.date().required().messages({
        "any.required": "expire_date is required",
    }),
}).options({ allowUnknown: true });

const earthingTestingStatusValidation = Joi.object({
    value: Joi.number().required(),
    id: Joi.number().required(),
});

const addPaymentSettingValidation = Joi.object({
    gst: Joi.number().required(),
    tds: Joi.number().required(),
    tds_with_gst: Joi.number().required(),
    retention_money: Joi.number().required(),
    man_power: Joi.number().required(),
    site_expense: Joi.number().required(),
    site_stock: Joi.number().required(),
    promotion_expense: Joi.number().required(),
}).unknown(true);

const importPromotionValidation = Joi.array().items(addPaymentSettingValidation);

const updatePaymentSettngValidation = Joi.object({
    id: Joi.number().required(),
    gst: Joi.number().required(),
    tds: Joi.number().required(),
    tds_with_gst: Joi.number().required(),
    retention_money: Joi.number().required(),
    man_power: Joi.number().required(),
    site_expense: Joi.number().required(),
    site_stock: Joi.number().required(),
    promotion_expense: Joi.number().required(),
}).unknown(true);

const addPaymentReceiveValidationSchema = Joi.array()
    .items(
        Joi.object({
            receipt_date: Joi.date().required(),
            invoice_date: Joi.date().required(),
            invoice_number: Joi.string().max(100).required(),
            net_amount: Joi.number().required(),
            gst_amount: Joi.number().required(),
            received_gst: Joi.number().required(),
            retention: Joi.required(),
            tds: Joi.required(),
            tds_on_gst: Joi.required(),
            pv_number: Joi.string().required(),
            ld_amount: Joi.number().required(),
            hold_amount: Joi.number().required(),
            covid19_amount_hold: Joi.number().allow("").required(),
            amount_received: Joi.number().required(),
        }).unknown(true)
    )
    .required();

const updatePaymentReceiveValidation = Joi.object({
    id: Joi.number().required(),
    retention: Joi.string().required(),
    retention_amount: Joi.number().required(),
    // tds: Joi.string().required(),
    // tds_amount: Joi.number().required(),
    // tds_on_gst: Joi.string().required(),
    // tds_on_gst_amount: Joi.number().required(),
    // other_deduction: Joi.number().required(),
    // ld_amount: Joi.number().required(),
    // hold_amount: Joi.number().required(),
    // covid19_amount_hold: Joi.number().allow("").required(),
    // amount_received: Joi.number().required(),
}).unknown(true);

const updateRetentionStatusValidation = Joi.object({
    id: Joi.number().required(),
    status: Joi.number().valid(1, 2).required().messages({
        "any.required": "status is required",
    }),
}).options({ allowUnknown: true });

const updatePaymentAmountRetentionValidation = Joi.object({
    ids: Joi.array().required(),
    payment_reference_number: Joi.string().required(),
    date: Joi.date().required(),
    amount: Joi.number().required(),
});

const addPaymentPaidValidation = Joi.object({
    manager_id: Joi.number().integer().required(),
    ro_id: Joi.number().integer().required(),
}).options({ allowUnknown: true });

const addRoPaymentPaidValidation = Joi.object({
    po_id: Joi.number().integer().required(),
    ro_id: Joi.number().integer().required(),
}).options({ allowUnknown: true });

const loanValidation = Joi.object({
    user_id: Joi.number().required(),
    loan_type: Joi.string().required(),
    loan_date: Joi.date().required(),
    emi_start_from: Joi.date().required(),
    loan_amount: Joi.number().required(),
    interest_rate: Joi.number().required(),
    interest_mode: Joi.string().required(),
    // no_of_payments: Joi.number().required(),
    emi: Joi.number().required(),
    payment_date: Joi.date().required(),
    payment_mode: Joi.string().required(),
    cheque_number: Joi.when("payment_mode", {
        is: "cheque",
        then: Joi.string().required(),
        otherwise: Joi.string().allow(null, ""),
    }),
    cheque_date: Joi.when("payment_mode", {
        is: "cheque",
        then: Joi.date().required(),
        otherwise: Joi.date().allow(null, ""),
    }),
    bank: Joi.string().required(),
    branch: Joi.string().required(),
    loan_term: Joi.string().required(),
    remarks: Joi.string().required(),
}).options({ allowUnknown: true });

const createAreaManagerValidation = Joi.object({
    manager_id: Joi.number().required(),
    company_ratio: Joi.number().required(),
    manager_ratio: Joi.number().required(),
});

const updateAreaManagerValidation = Joi.object({
    id: Joi.number().required(),
    manager_id: Joi.number().required(),
    company_ratio: Joi.number().required(),
    manager_ratio: Joi.number().required(),
});

const salesOrderValidation = Joi.object({
    so_date: Joi.date().required(),
    ro_office: Joi.number().required(),
    state: Joi.number().required(),
    so_number: Joi.string().required(),
    // so_amount: Joi.number().optional(),
    tax_type: Joi.number().optional(),
    tax: Joi.number().optional(),
    limit: Joi.number()
    .required()
    .min(0) // Ensure the limit is not negative
    .messages({
        "number.base": `Limit is required.`,
        "any.required": `Limit is required.`,
        "number.min": `Limit must be a non-negative number.` // Custom message for negative values
    }),
    so_budget: Joi.number().optional(),
    // security_deposit_date: Joi.date().required(),
    security_deposit_amount: Joi.number().optional().allow(''),
    tender_date: Joi.date().required(),
    tender_number: Joi.string().required(),
    bank: Joi.string().optional().allow(""),
    dd_bg_number: Joi.string().optional().allow(""),
    // cr_date: Joi.date().required(),
    // cr_number: Joi.string().required(),
    // cr_code: Joi.string().required(),
    work: Joi.string().required(),
    so_items: Joi.array().items(poItemSchema).required().label("SO Items"),
}).options({ allowUnknown: true });

const createFeedbackComplaintValidation = Joi.object({
    title: Joi.string().required().messages({
        "any.required": "Title is required",
        "string.empty": "Title cannot be an empty field",
    }),
    description: Joi.string().required().messages({
        "any.required": "Description is required",
        "string.empty": "Description cannot be an empty field",
    }),
}).options({ allowUnknown: true });

const createEnergyCompanyTeamValidation = Joi.object({
    username: Joi.string().required(),
    contact_no: Joi.string().required(),
    status: Joi.number().required(),
    // country: Joi.string().required(),
    // city: Joi.string().required(),
    // pin_code: Joi.string(),
    // address: Joi.string(),
    gst_number: Joi.string(),
    email: Joi.string().required(),
    password: Joi.string().required(),
    joining_date: Joi.date().required(),
    area_name: Joi.number().required(),
    energy_company_id: Joi.number(),
}).options({ allowUnknown: true });

const updateEnergyCompanyTeamValidation = Joi.object({
    id: Joi.number().required(),
    username: Joi.string().required(),
    contact_no: Joi.string().required(),
    status: Joi.number().required(),
    // country: Joi.string().required(),
    // city: Joi.string().required(),
    // pin_code: Joi.string(),
    // address: Joi.string(),
    gst_number: Joi.string(),
    email: Joi.string().required(),
    joining_date: Joi.date().required(),
    area_name: Joi.number().required(),
    energy_company_id: Joi.number(),
    // transfer_date: Joi.date(),
}).options({ allowUnknown: true });

const sendMessageValidation = Joi.object({
    user_ids: Joi.array()
        .items(
            Joi.number().required().messages({
                "any.required": "User ids are required",
                "string.empty": "User ids cannot be an empty field",
            })
        )
        .required()
        .messages({
            "any.required": "User ids are required",
            "string.empty": "User ids cannot be an empty field",
        }),
    title: Joi.string().required(),
    to: Joi.array().items(Joi.string().required()).required(),
    message: Joi.string().required(),
    date: Joi.string().required(),
}).options({ allowUnknown: true });

const updateMessageValidation = Joi.object({
    id: Joi.number().required(),
    user_ids: Joi.array().items(Joi.number().required()).required(),
    title: Joi.string().required(),
    message: Joi.string().required(),
    date: Joi.string().required(),
}).options({ allowUnknown: true });

const importOutletValidation = Joi.array().items(
    Joi.object({
        energy_company_id: Joi.number().required(),
        zone_id: Joi.number().required(),
        regional_id: Joi.number().required(),
        sales_area_id: Joi.number().required(),
        district_id: Joi.number().required(),
        outlet_name: Joi.string().required(),
        outlet_contact_person_name: Joi.string().required(),
        outlet_contact_number: Joi.string().required(),
        primary_number: Joi.string().optional(),
        secondary_number: Joi.string().optional(),
        primary_email: Joi.string().optional(),
        secondary_email: Joi.string().optional(),
        customer_code: Joi.string().required(),
        outlet_category: Joi.string().required(),
        location: Joi.string().optional(),
        address: Joi.string().required(),
        outlet_ccnoms: Joi.string().required(),
        outlet_ccnohsd: Joi.string().required(),
        outlet_resv: Joi.string().optional(),
        outlet_longitude: Joi.string().optional(),
        outlet_lattitude: Joi.string().optional(),
        outlet_unique_id: Joi.string().required(),
        status: Joi.string().required(),
        email: Joi.string().optional(),
        password: Joi.string().optional(),
    }).options({ allowUnknown: true })
);

const subCategoryValidation = Joi.object({
    name: Joi.string().required(),
}).options({ allowUnknown: true });

const createTaskValidation = Joi.object({
    name: Joi.string().required().messages({
        "any.required": "Name is required",
        "string.empty": "Name cannot be an empty field",
    }),
    status: Joi.number().required().messages({
        "any.required": "Status is required",
        "string.empty": "Status cannot be an empty field",
    }),
}).options({ allowUnknown: true });

const updateExpenseValidation = Joi.object({
    // id, item_qty, transaction_id, payment_mode
    id: Joi.number().required().messages({
        "any.required": "Id is required",
        "string.empty": "Id cannot be an empty field",
    }),
    item_qty: Joi.number().required().messages({
        "any.required": "Item qty is required",
        "string.empty": "Item qty cannot be an empty field",
    }),
    transaction_id: Joi.string().required().messages({
        "any.required": "Transaction id is required",
        "string.empty": "Transaction id cannot be an empty field",
    }),
    payment_mode: Joi.string().required().messages({
        "any.required": "Payment mode is required",
        "string.empty": "Payment mode cannot be an empty field",
    }),
}).options({ allowUnknown: true });

const getCompanyBasedOnCityValidation = Joi.object({
    // type: Joi.string().required().allow("").messages({
    //     "string.empty": "Company Type cannot be an empty",
    // }),
    my_company: Joi.number().required().messages({
        "any.required": "My Company is required",
        "string.empty": "My Company cannot be an empty",
    }),
    // city: Joi.string().required().messages({
    //     "any.required": "City is required",
    //     "string.empty": "City cannot be an empty",
    // })
}).options({ allowUnknown: true });

const attendanceDateValidationSchema = Joi.object({
    user_ids: Joi.array().items(Joi.number()).required().messages({
        "array.base": "User IDs must be an array of numbers.",
        "number.base": "Each user ID must be a number.",
        "any.required": "User IDs are required.",
    }),
    date: Joi.string()
        .pattern(/^(\s*\d{1,2}\s*(-\s*\d{1,2}\s*)?,\s*)*\s*\d{1,2}\s*(-\s*\d{1,2}\s*)?$/)
        .required()
        .messages({
            "string.pattern.base":
                "Date must be a valid string with single days or ranges separated by commas (e.g., '1-3, 6, 8').",
            "string.base": "Date must be a string.",
            "any.required": "Date is required.",
        }),
    month: Joi.string()
        .pattern(/^\d{4}-(0[1-9]|1[0-2])$/) // Matches "YYYY-MM" where MM is between 01 and 12
        .required()
        .messages({
            "string.base": "Month must be a string in the format 'YYYY-MM'.",
            "string.pattern.base": "Month must be in the format 'YYYY-MM' (e.g., 2024-11).",
            "any.required": "Month is required.",
        }),
    attendance_status: Joi.string().valid("AB", "P", "HF").required().messages({
        "string.base": "Attendance status must be a string.",
        "any.required": "Attendance status is required.",
        "any.only": "Provide valid attendance status.",
    }),
}).options({ allowUnknown: true });

const createItemMasterValidation = Joi.object({
    name: Joi.string().required().messages({
        'string.empty': 'Name is required.',
    }),
    rates: Joi.string()
        .custom((value, helpers) => {
            try {
                const parsed = JSON.parse(value);
                if (!Array.isArray(parsed)) {
                    return helpers.error('any.invalid', { message: 'Brand and Rates must be valid' });
                }
                parsed.forEach(rate => {
                    if (!rate.brand || !rate.brand_id || !rate.rate) {
                        throw new Error('Each rate must include brand, brand_id, and rate.');
                    }
                });
                return value;
            } catch (err) {
                return helpers.error('any.invalid', { message: 'Brand and Rates must be valid' });
            }
        })
        .required()
        .messages({
            'any.invalid': 'Brand and Rates must be valid.',
            'any.required': 'Rates are required.',
        }),
    hsncode: Joi.string().allow(''),
    rucode: Joi.string().allow(''),
    supplier_id: Joi.number().allow(""),
    item_unique_id: Joi.string().allow(''),
    description: Joi.string().allow(''),
    unit_id: Joi.string()
        .required()
        .messages({
            'string.empty': 'Unit ID is required.',
        }),
    category: Joi.string()
        .required()
        .messages({
            'string.empty': 'Category is required.',
        }),
    sub_category: Joi.string()
        .required()
        .messages({
            'string.empty': 'Sub-category is required.',
        }),
}).options({ allowUnknown: true });

const importItemMasterValidation = Joi.object({
    name: Joi.string().required().messages({
        'string.empty': 'Name is required.',
    }),
    rates: Joi.number()
        .required()
        .messages({
            'any.invalid': 'Rates must be valid.',
            'any.required': 'Rates are required.',
        }),
    hsncode: Joi.string().allow(''),
    rucode: Joi.string().allow(''),
    description: Joi.string().allow(''),
    category: Joi.string()
        .required()
        .messages({
            'string.empty': 'Category is required.',
        }),
}).options({ allowUnknown: true });

module.exports = {
    createItemMasterValidation,
    checkPositiveInteger,
    outletFormValidation,
    saleCompanyFiledValidated,
    purchaseCompany,
    adminCreateValidation,
    companyValidation,
    loginValidation,
    subUserFormValidation,
    subUserProfileUpdateValidation,
    changePasswordValidation,
    validatePermissionOnRoleBassi,
    complaintTypeValidations,
    teamValidations,
    energyCompanyValidations,
    contractorValidations,
    contractorValidationsForUpdate,
    tutorialValidations,
    planValidations,
    notificationCreateValidations,
    surveyValidations,
    addDocumentValidations,
    tasksManagerValidations,
    changePasswordValidations,
    hrTeamValidations,
    profileValidations,
    userActivityLogValidations,
    termsAndConditionsValidation,
    userCreateValidations,
    leaveApplicationValidations,
    breakValidations,
    insurancePlansValidations,
    resignationStatusValidation,
    pensionFormValidation,
    messageValidation,
    salaryValidation,
    loanValidation,
    fundRequestValidation,
    stockRequestValidation,
    purchaseOrderValidation,
    measurementValidation,
    quotationSchema,
    supplierSchema,
    measurementItemValidation,
    proformaInvoiceValidation,
    financialYearSchema,
    unitsSchema,
    billingTypeValidation,
    taxValidation,
    invoiceSchema,
    itemSchema,
    securityMoneyValidation,
    productValidations,
    requestCashValidation,
    expenseValidation,
    assetsValidationScheme,
    companyContactValidation,
    holidayListValidation,
    emailValidation,
    expensePunchValidation,
    bankFieldValidation,
    transferStockValidation,
    amountAddToUserWalletValidationSchema,
    accountDetailsValidation,
    addWalletAmountValidation,
    updateAccountDetailsValidation,
    checkString,
    transferFund,
    reschduleDate,
    stockPunchValidation,
    poChangeValidation,
    earthingTestingSchema,
    earthingTestingStatusValidation,
    addPaymentSettingValidation,
    updatePaymentSettngValidation,
    addPaymentReceiveValidationSchema,
    updatePaymentReceiveValidation,
    updateRetentionStatusValidation,
    updatePaymentAmountRetentionValidation,
    addPaymentPaidValidation,
    updateAreaManagerValidation,
    createAreaManagerValidation,
    salesOrderValidation,
    createFeedbackComplaintValidation,
    updateEnergyCompanyTeamValidation,
    createEnergyCompanyTeamValidation,
    sendMessageValidation,
    updateMessageValidation,
    addRoPaymentPaidValidation,
    importOutletValidation,
    importPromotionValidation,
    importHrTeamValidations,
    subCategoryValidation,
    transferFundForFundReq,
    createTaskValidation,
    updateExpenseValidation,
    adminUserUpdateValidation,
    getCompanyBasedOnCityValidation,
    attendanceDateValidationSchema,
    gst_details,
    companyImportValidation,
    importItemMasterValidation,
    supplierImportSchema,
};
