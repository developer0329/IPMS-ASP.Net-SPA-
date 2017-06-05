using MySql.Data.MySqlClient;
using System;
using System.Collections.Generic;
using System.Configuration;
using System.Data;
using System.Linq;
using System.Web;

namespace IPMS.Models
{
    public class DuePaymentMonthModel
    {
        private static string connStr = ConfigurationManager.ConnectionStrings["conn"].ConnectionString;
        MySqlConnection conn = new MySqlConnection(connStr);
        Utils utils = new Utils();

        public int createDuePaymentMonthRow(int planID, List<DueListItem> dueList) {
            string query = "";
            var index = 0;
            foreach (DueListItem item in dueList)
            {
                index++;
                query = query + "INSERT INTO pay_status(payment_plan_id, serial, due_amount, due_date, paid_amount, paid_date) VALUES("
                    + planID + "," + index + "," + item.value + ",'" + item.date + "', NULL, NULL);";
            }
            
            try
            {
                conn.Open();
                MySqlCommand cmd = conn.CreateCommand();
                cmd.CommandText = query;
                return Convert.ToInt32(cmd.ExecuteScalar());
            }
            catch (Exception ex)
            {
                throw ex;
            }
            finally
            {
                conn.Close();
            }
        }
        public DueListItem updateDuePaymentMonthRow(UpdateDuePayment data) {
            string date = utils.DateTimeToSQLDateString(data.paid_date);
            string query = "UPDATE pay_status SET paid_amount=" + data.paid_amount +
                ", paid_date='" + date + "' WHERE id=" + data.id + ";";
            try
            {
                conn.Open();
                MySqlCommand cmd = new MySqlCommand(query, conn);
                int IsUpdated = cmd.ExecuteNonQuery();
                DueListItem item = new DueListItem();
                if (IsUpdated > 0)
                {
                    item.date = date;
                    item.value = data.paid_amount;
                }
                return item;
            }
            catch (Exception ex)
            {
                throw ex;
            }
            finally
            {
                conn.Close();
            }
        }
        public List<DuePaymentMonth> readDuePaymentMonthRow() {
            
            try
            {
                conn.Open();
                String query = "SELECT * FROM pay_status ORDER BY id";
                MySqlCommand cmd = new MySqlCommand(query, conn);
                MySqlDataReader mdr = cmd.ExecuteReader(CommandBehavior.CloseConnection);
                List<DuePaymentMonth> customerList = new List<DuePaymentMonth>();
                //name, location, lat, lng, email, phone, regdate,status
                while (mdr.Read())
                {
                    DuePaymentMonth item = new DuePaymentMonth();
                    item.id = mdr.GetInt32(0);
                    item.payment_plan_id = mdr.GetInt32(1);
                    //item.serial = mdr.GetInt32(2);
                    item.due_amount = mdr.GetInt32(3);
                    item.due_date = utils.DateTimeToSQLDateString(mdr.GetDateTime(4));

                    if (mdr.IsDBNull(5))
                        item.paid_amount = 0;
                    else
                        item.paid_amount = mdr.GetInt32(5);

                    if (mdr.IsDBNull(6))
                        item.paid_date = "Unpaid";
                    else
                        item.paid_date = utils.DateTimeToSQLDateString(mdr.GetDateTime(6));

                    customerList.Add(item);
                }

                return customerList;
            }
            catch (Exception ex)
            {
                throw ex;
            }
            finally
            {
                conn.Close();
            }
        }
        public List<DuePaymentMonth> readDuePaymentMonthRowFilter(DateTime dueDate, int status)
        {
            List<DuePaymentMonth> result = readDuePaymentMonthRow();

            DateTime startDate = new DateTime(dueDate.Year, dueDate.Month, 1);
            string sDate = utils.DateTimeToSQLDateString(startDate);
            DateTime endDate = startDate.AddMonths(1).AddDays(-1);
            string eDate = utils.DateTimeToSQLDateString(endDate);

            string sql = "SELECT pay_status.*, customer.clinic_name FROM `pay_status`" +
            " INNER JOIN payment_plan" +
            " ON pay_status.payment_plan_id = payment_plan.id" +
            " INNER JOIN customer" +
            " ON payment_plan.customer_id = customer.id" + 
            " WHERE (CAST(due_date AS date) BETWEEN '" + sDate + "' AND '" + eDate + "')";
            if(status == 1)
                sql = sql + " AND (paid_amount = 0 OR paid_amount IS NULL)";
            if(status == 2)
                sql = sql + " AND (paid_amount > 0)";

            try
            {
                conn.Open();
                MySqlCommand cmd = new MySqlCommand(sql, conn);
                MySqlDataReader mdr = cmd.ExecuteReader(CommandBehavior.CloseConnection);
                List<DuePaymentMonth> duePaymentList = new List<DuePaymentMonth>();
                //name, location, lat, lng, email, phone, regdate,status
                while (mdr.Read())
                {
                    DuePaymentMonth item = new DuePaymentMonth();
                    item.id = mdr.GetInt32(0);
                    item.payment_plan_id = mdr.GetInt32(1);
                    //item.serial = mdr.GetInt32(2);
                    item.due_amount = mdr.GetInt32(3);
                    item.due_date = utils.DateTimeToSQLDateString(mdr.GetDateTime(4));

                    if (mdr.IsDBNull(5))
                        item.paid_amount = 0;
                    else
                        item.paid_amount = mdr.GetInt32(5);

                    if (mdr.IsDBNull(6))
                        item.paid_date = "Unpaid";
                    else
                        item.paid_date = utils.DateTimeToSQLDateString(mdr.GetDateTime(6));

                    if (mdr.IsDBNull(7))
                        item.customer = "";
                    else
                        item.customer = mdr.GetString(7);

                    duePaymentList.Add(item);
                }

                return duePaymentList;
            }
            catch (Exception ex)
            {
                throw ex;
            }
            finally
            {
                conn.Close();
            }
            
        }
        public void deleteDuePaymentMonthRow() { }
    }
}