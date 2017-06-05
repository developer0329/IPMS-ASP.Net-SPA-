using MySql.Data.MySqlClient;
using System;
using System.Collections.Generic;
using System.Configuration;
using System.Data;
using System.Linq;
using System.Web;

namespace IPMS.Models
{
    public class PaymentPlanModel
    {
        private static string connStr = ConfigurationManager.ConnectionStrings["conn"].ConnectionString;
        MySqlConnection conn = new MySqlConnection(connStr);
        Utils utils = new Utils();

        public int AddNewPaymentPlan(PaymentPlan plan)
        {
            string query = "INSERT INTO payment_plan(invoice_no, contract_date, customer_id, device_model, serial_no, invoice_amount, down_payment, schedule, notes, installment_no, installment_amount, first_installment_due_date) VALUES('" +
                plan.invoice_no + "','" +
                utils.DateTimeToSQLDateString(plan.contract_date) + "'," +
                plan.customer_id + ",'" +
                plan.device_model + "','" +
                plan.serial_no + "'," +
                plan.invoice_amount + "," +
                plan.down_payment + ",'" +
                plan.schedule + "','" +
                plan.notes + "'," +
                plan.installment_no + "," +
                plan.installment_amount + ",'" +
                utils.DateTimeToSQLDateString(plan.first_installment_due_date) + "');" +
                "select last_insert_id();";

            try
            {
                conn.Open();
                MySqlCommand cmd = conn.CreateCommand();
                cmd.CommandText = query;
                int isInserted = Convert.ToInt32(cmd.ExecuteScalar());
                conn.Close();

                if (isInserted > 0)
                {
                    DuePaymentMonthModel dm = new DuePaymentMonthModel();
                    dm.createDuePaymentMonthRow(isInserted, confirmPaymentPlan(plan));
                }
                    

                return isInserted;
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
        public List<PaymentPlanDisplay> getAllPaymentPlan()
        {
            try
            {
                conn.Open();
                String query = "SELECT payment_plan.*, customer.clinic_name FROM payment_plan INNER JOIN customer On payment_plan.customer_id=customer.id ORDER BY payment_plan.id";
                MySqlCommand cmd = new MySqlCommand(query, conn);
                MySqlDataReader mdr = cmd.ExecuteReader(CommandBehavior.CloseConnection);
                List<PaymentPlanDisplay> planList = new List<PaymentPlanDisplay>();
                //name, location, lat, lng, email, phone, regdate,status
                while (mdr.Read())
                {
                    PaymentPlanDisplay item = new PaymentPlanDisplay();
                    item.id = mdr.GetInt32(0);
                    item.invoice_no = mdr.GetString(1);
                    item.contract_date = utils.DateTimeToSQLDateString(mdr.GetDateTime(2));
                    item.customer_name = mdr.GetString(13); // customer_name
                    item.device_model = mdr.GetString(4);
                    item.serial_no = mdr.GetString(5);
                    item.invoice_amount = mdr.GetInt32(6);
                    item.down_payment = mdr.GetInt32(7);
                    item.schedule = mdr.GetInt32(8);
                    item.notes = mdr.GetString(9);
                    item.installment_no = mdr.GetInt32(10);
                    item.installment_amount = mdr.GetInt32(11);
                    item.first_installment_due_date = utils.DateTimeToSQLDateString(mdr.GetDateTime(12));

                    planList.Add(item);
                }

                return planList;
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
        public List<Invoice> getInvoiceListByCustomerID(int customerID)
        {
            try
            {
                conn.Open();
                String query = "";
                if (customerID > 0 )
                {
                    query = "SELECT * FROM payment_plan WHERE customer_id='" + customerID + "';";
                }
                else
                {
                    query = "SELECT * FROM payment_plan;";
                }
                
                MySqlCommand cmd = new MySqlCommand(query, conn);
                MySqlDataReader mdr = cmd.ExecuteReader(CommandBehavior.CloseConnection);
                List<Invoice> invoiceList = new List<Invoice>();
                //name, location, lat, lng, email, phone, regdate,status
                while (mdr.Read())
                {
                    Invoice item = new Invoice();

                    item.plan_id = mdr.GetInt32(0);
                    item.invoice_no = mdr.GetString(1);

                    invoiceList.Add(item);
                }

                return invoiceList;
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

        internal IEnumerable<DashboardTableData> getDueInfoByCustomerIDAndInovice(int customer_id, string invoice_no)
        {
            try
            {
                conn.Open();
                String query = "";
                bool initState = false;
                if (customer_id == 0 && (invoice_no == "Empty" || invoice_no == null))
                {
                    initState = true;
                    

                    query = "SELECT pay_status.*, payment_plan.invoice_no, customer.clinic_name, payment_plan.id, customer.id FROM `pay_status`" +
                        " INNER JOIN payment_plan" +
                        " ON pay_status.payment_plan_id = payment_plan.id" +
                        " INNER JOIN customer" +
                        " ON payment_plan.customer_id = customer.id" +
                        " WHERE date(due_date) <= date '"
                        + utils.DateTimeToSQLDateString(DateTime.Now) + "'";
                }
                else
                {
                    string where1 = "payment_plan.customer_id=" + customer_id;
                    string where2 = "payment_plan.id = '" + invoice_no + "'";
                    string where = "";
                    if (customer_id == 0)
                    {
                        if (invoice_no != "")
                        {
                            where = where2;
                        }
                    }
                    else
                    {
                        where = where1;
                        if (invoice_no != "")
                        {
                            where = where1 + " AND " + where2;
                        }
                    }

                    if (where != "")
                        where = " WHERE " + where;

                    query = "SELECT pay_status.*, payment_plan.invoice_no, customer.clinic_name, payment_plan.id, customer.id FROM `pay_status`" +
                        " INNER JOIN payment_plan" +
                        " ON pay_status.payment_plan_id = payment_plan.id" +
                        " INNER JOIN customer" +
                        " ON payment_plan.customer_id = customer.id" + where;
                }
                

                MySqlCommand cmd = new MySqlCommand(query, conn);
                MySqlDataReader mdr = cmd.ExecuteReader(CommandBehavior.CloseConnection);
                List<DashboardTableData> dueList = new List<DashboardTableData>();
                //name, location, lat, lng, email, phone, regdate,status
                while (mdr.Read())
                {
                    DashboardTableData item = new DashboardTableData();
                    item.due_id = mdr.GetInt32(0);
                    item.serial = mdr.GetInt32(2);
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
                        item.invoice_id = "";
                    else
                        item.invoice_id = mdr.GetString(7);

                    if (mdr.IsDBNull(8))
                        item.customer_name = "";
                    else
                        item.customer_name = mdr.GetString(8);

                    if (mdr.IsDBNull(9))
                        item.plan_id = 0;
                    else
                        item.plan_id = mdr.GetInt32(9);

                    if (mdr.IsDBNull(10))
                        item.customer_id = 0;
                    else
                        item.customer_id = mdr.GetInt32(10);

                    if (initState)
                    {
                        if ((item.due_amount - item.paid_amount) > 0)
                        {
                            dueList.Add(item);
                        }
                    }
                    else
                    {
                        dueList.Add(item);
                    }
                    
                }

                return dueList;
            }
            catch (Exception ex)
            {
                throw ex;
            }
            finally
            {
                conn.Close();
            }

            throw new NotImplementedException();
        }

        public PaymentPlanDisplay getOnePaymentPlanById(int id)
        {
            return getAllPaymentPlan().Single(p => p.id.Equals(id));
        }
        public List<InstallmentPlanRow> getAllInstallmentPlan()
        {
            try
            {
                conn.Open();
                String query = "SELECT payment_plan.*, customer.clinic_name FROM payment_plan INNER JOIN customer On payment_plan.customer_id=customer.id ORDER BY payment_plan.id";
                MySqlCommand cmd = new MySqlCommand(query, conn);
                MySqlDataReader mdr = cmd.ExecuteReader(CommandBehavior.CloseConnection);
                List<InstallmentPlanRow> planList = new List<InstallmentPlanRow>();
                //name, location, lat, lng, email, phone, regdate,status
                while (mdr.Read())
                {
                    InstallmentPlanRow item = new InstallmentPlanRow();
                    item.id = mdr.GetInt32(0);
                    item.invoice_no = mdr.GetString(1);
                    item.contract_date = utils.DateTimeToSQLDateString(mdr.GetDateTime(2));
                    item.customer_name = mdr.GetString(13); // customer_name
                    item.device_model = mdr.GetString(4);
                    item.serial_no = mdr.GetString(5);
                    item.first_installment_due_date = utils.DateTimeToSQLDateString(mdr.GetDateTime(12));

                    planList.Add(item);
                }

                return planList;
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

        public List<DueListItem> confirmPaymentPlan(PaymentPlan plan)
        {
            return utils.DueAmountList(plan.invoice_amount, plan.down_payment, plan.installment_no, plan.installment_amount, plan.first_installment_due_date, plan.schedule);
        }

        public List<int> getPaymentStatusValues()
        {
            String query1 = "SELECT SUM(invoice_amount) AS TotalContractValue, SUM(down_payment) AS TotalDownValue FROM payment_plan;";
            String query2 = "SELECT SUM(paid_amount) AS TotalPaidValue FROM pay_status;";
            try
            {
                conn.Open();                
                MySqlCommand cmd = new MySqlCommand(query1, conn);
                MySqlDataReader mdr = cmd.ExecuteReader(CommandBehavior.CloseConnection);

                int TotalInvoiceValue = 0;
                int TotalDownValue = 0;
                int TotalPaidValue = 0;

                while (mdr.Read())
                {
                    if (!mdr.IsDBNull(0))
                        TotalInvoiceValue = mdr.GetInt32(0);

                    if (!mdr.IsDBNull(1))
                        TotalDownValue = mdr.GetInt32(1);
                }
                conn.Close();
                conn.Open();
                cmd = new MySqlCommand(query2, conn);
                mdr = cmd.ExecuteReader(CommandBehavior.CloseConnection);
                if (mdr.HasRows)
                {   
                    while (mdr.Read())
                    {
                        if(!mdr.IsDBNull(0))
                            TotalPaidValue = mdr.GetInt32(0);
                    }
                }
                List<int> result = new List<int>();
                result.Add(TotalInvoiceValue - TotalDownValue);
                result.Add(TotalPaidValue);

                return result;
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

        public InstallmentPlanDetail getPaymentPlanDetail(int id)
        {
            InstallmentPlanDetail info = new InstallmentPlanDetail();
            info.plan = getOnePaymentPlanById(id);
            List<DueListItem> due_list = utils.DueAmountList(info.plan.invoice_amount, info.plan.down_payment, info.plan.installment_no,
                info.plan.installment_amount, DateTime.Parse(info.plan.first_installment_due_date), info.plan.schedule);

            List<DuePaidListItem> duePaidList = getPaidStatusById(id);
            info.due_paid_list = duePaidList;

            info.paid_amount = getPaidAmountByID(info.plan.id);
            return info;
        }

        public List<DuePaidListItem> getPaidStatusById(int id)
        {
            String query = "SELECT * FROM pay_status WHERE payment_plan_id =" + id + ";";
            try
            {
                conn.Open();
                MySqlCommand cmd = new MySqlCommand(query, conn);
                MySqlDataReader mdr = cmd.ExecuteReader(CommandBehavior.CloseConnection);
                List<DuePaidListItem> list = new List<DuePaidListItem>();
                while (mdr.Read())
                {
                    DuePaidListItem item = new DuePaidListItem();
                    if (!mdr.IsDBNull(4))
                        item.due_date = utils.DateTimeToSQLDateString(mdr.GetDateTime(4));

                    if (!mdr.IsDBNull(3))
                        item.due_value = mdr.GetInt32(3);

                    if (!mdr.IsDBNull(6))
                        item.paid_date = utils.DateTimeToSQLDateString(mdr.GetDateTime(6));
                    else
                        item.paid_date = "Unpaid";

                    if (!mdr.IsDBNull(5))
                        item.paid_value = mdr.GetInt32(5);
                    else
                        item.paid_value = 0;

                    list.Add(item);
                }
                return list;
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

        public int getPaidAmountByID(int id)
        {
            String query = "SELECT SUM(paid_amount) AS TotalPaidValue FROM pay_status WHERE payment_plan_id =" + id + ";";
            try
            {
                conn.Open();
                MySqlCommand cmd = new MySqlCommand(query, conn);
                MySqlDataReader mdr = cmd.ExecuteReader(CommandBehavior.CloseConnection);

                int TotalPaidValue = 0;

                while (mdr.Read())
                {
                    if (!mdr.IsDBNull(0))
                        TotalPaidValue = mdr.GetInt32(0);
                }
                return TotalPaidValue;
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
    }
}