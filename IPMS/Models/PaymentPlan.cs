using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace IPMS.Models
{
    public class PaymentPlan
    {
        public int id;
        public string invoice_no;
        public DateTime contract_date;
        public int customer_id;
        public string device_model;
        public string serial_no;
        public int invoice_amount; // DB String
        public int down_payment;   // DB String
        public int schedule;
        public string notes;
        public int installment_no;
        public int installment_amount;
        public DateTime first_installment_due_date;
    }

    public class DueListItem
    {
        public string date;
        public int value;
    }

    public class DuePaidListItem
    {
        public string due_date;
        public int due_value;
        public string paid_date;
        public int paid_value;
    }

    public class PaymentPlanDisplay
    {
        public int id;
        public string invoice_no;
        public string contract_date;
        public string customer_name;
        public string device_model;
        public string serial_no;
        public int invoice_amount;
        public int down_payment;
        public int schedule;
        public string notes;
        public int installment_no;
        public int installment_amount;
        public string first_installment_due_date;
    }

    public class InstallmentPlanRow
    {
        public int id;
        public string invoice_no;
        public string contract_date;
        public string customer_name;
        public string device_model;
        public string serial_no;
        public string first_installment_due_date;
    }

    public class InstallmentPlan
    {
        public List<InstallmentPlanRow> plans;
        public List<int> total_values;
    }

    public class InstallmentPlanDetail
    {
        public PaymentPlanDisplay plan;
        public List<DuePaidListItem> due_paid_list;
        public int paid_amount;
    }

    public class Invoice
    {
        public int plan_id;
        public string invoice_no;
    }

    public class DashboardTableData
    {
        public int due_id;
        public int serial;
        public string due_date;
        public string paid_date;
        public int paid_amount;
        public int due_amount;
        public string invoice_id;
        public string customer_name;
        public int plan_id;
        public int customer_id;

    }
}