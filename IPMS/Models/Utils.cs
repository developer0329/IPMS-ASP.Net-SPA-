using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace IPMS.Models
{
    public class Utils
    {
        public string DateTimeToSQLDateString(DateTime datetime)
        {
            string format = "yyyy-MM-dd";
            return datetime.ToString(format);
        }

        public List<DueListItem> DueAmountList(int invoice, int down, int installment_no, int installment_amount, DateTime fDate, int schedule)
        {
            int dueAmount = installment_amount;
            int lastAmount = (invoice - down) - dueAmount * (installment_no - 1);
            
            List<DueListItem> result = new List<DueListItem>();
            for (int i = 0; i < installment_no; i++)
            {
                
                DueListItem item = new DueListItem();
                item.date = DueDateList(fDate, schedule, i);
                if(i == installment_no - 1)
                    item.value = lastAmount;
                else
                    item.value = dueAmount;

                result.Add(item);
            }

            return result;
        }

        public string DueDateList(DateTime fDate, int schedule, int order)
        {
            DateTime date = new DateTime();
            switch (schedule)
            {
                case 1: // Monthly
                    date = fDate.AddMonths(order * 1);
                    break;
                case 2: // Every 3 months
                    date = fDate.AddMonths(order * 3);
                    break;
                case 3: // Every 6 months
                    date = fDate.AddMonths(order * 6);
                    break;
                case 4: // Annually
                    date = fDate.AddYears(order * 1);
                    break;
            }

            return DateTimeToSQLDateString(date);
        }
    }
}