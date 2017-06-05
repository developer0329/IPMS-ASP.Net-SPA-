using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace IPMS.Models
{
    public class DuePaymentMonth
    {
        public int id;
        public int payment_plan_id;
        public int due_amount;
        public string due_date;
        public int paid_amount;
        public string paid_date;
        public string customer;
    }

    public class UpdateDuePayment
    {
        public int id;
        public int paid_amount;
        public DateTime paid_date;
    }

}