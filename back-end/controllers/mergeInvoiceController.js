require("dotenv").config();
const { con, makeDb } = require("../db");
const db = makeDb();
const { StatusCodes } = require("http-status-codes");
const { checkPositiveInteger } = require("../helpers/validation");
var moment = require("moment");
var { getLastFinancialYearBillNoForInvoice } = require("../helpers/commonHelper");

const mergePItoInvoice = async (req, res, next) => {
    try {
        const pi_ids = req.body.pi_ids;
        const invoice_date = req.body.invoice_date;
        const due_date = req.body.due_date;
        const call_up_number = req.body.callup_number;
        const po_id = req.body.po_id;
        const financial_year = req.body.financial_year;
        const formattedPiId = pi_ids.join(",");

        // get ro office id by po
        const getRoOffice = await db.query(`SELECT ro_office FROM purchase_orders WHERE id = ?`, [po_id]);
        const ro_office_id = getRoOffice[0].ro_office;

        // get selected financial year last bill no
        const invoice_no = await getLastFinancialYearBillNoForInvoice(financial_year);

        const invoiceInsertQuery = await db.query(
            "INSERT INTO invoices(invoice_no, invoice_date, due_date, financial_year, regional_office, po_number, callup_number, pi_details, invoice_type, created_by) VALUES(?, ?, ?, ?, ?, ?, ?, ?, ?, ?)",
            [
                invoice_no,
                invoice_date,
                due_date,
                financial_year,
                ro_office_id,
                po_id,
                call_up_number,
                JSON.stringify(formattedPiId),
                "2",
                req.user.user_id,
            ]
        );

        if (invoiceInsertQuery.affectedRows > process.env.VALUE_ZERO) {
            // update proforma invoices
            const is_merged = "1";
            const merged_date = moment().format("YYYY-MM-DD HH:mm:ss");
            const merged_by = req.user.user_id;

            for (let index = 0; index < pi_ids.length; index++) {
                const element = pi_ids[index];

                const updateProformaInvoiceDetails = await db.query(
                    "UPDATE proforma_invoices SET is_merged = ?, merged_date = ?, merged_by =? where id = ?",
                    [is_merged, merged_date, merged_by, element]
                );
            }

            return res.status(StatusCodes.OK).json({
                status: true,
                message: "Proforma Invoice merged successfully",
            });
        } else {
            return res.status(StatusCodes.OK).json({
                status: false,
                message: "Something went wrong, please try again later",
            });
        }
    } catch (error) {
        return next(error);
    }
};

module.exports = { mergePItoInvoice };
