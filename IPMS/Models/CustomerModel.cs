using MySql.Data.MySqlClient;
using System;
using System.Collections.Generic;
using System.Configuration;
using System.Data;
using System.Linq;
using System.Web;

namespace IPMS.Models
{
    public class CustomerModel
    {
        private static string connStr = ConfigurationManager.ConnectionStrings["conn"].ConnectionString;
        MySqlConnection conn = new MySqlConnection(connStr);
        
        public int createCustomer(Customer customer) {
            string query = "INSERT INTO customer(clinic_name, official_tel, address, contact_person1," +
                "contact_tel1, contact_person2, contact_tel2, email) VALUES('" +
                customer.name + "','" +
                customer.office_tel + "','" +
                customer.address + "','" +
                customer.contact_person1 + "','" +
                customer.contact_tel1 + "','" +
                customer.contact_person2 + "','" +
                customer.contact_tel2 + "','" +
                customer.email + "');" +
                "select last_insert_id();" ;

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
        public int updateCustomer(Customer customer) {
            string query = "UPDATE customer SET id=" + customer.id +
                ", clinic_name='" + customer.name +
                "', official_tel='" + customer.office_tel + 
                "', address='" + customer.address +
                "', contact_person1='" + customer.contact_person1 + 
                "', contact_tel1='" + customer.contact_tel1 +
                "', contact_person2='" + customer.contact_person2 + 
                "', contact_tel2='" + customer.contact_tel2 +
                "', email='" + customer.email + "' WHERE id=" + customer.id + ";";
            try
            {
                conn.Open();
                MySqlCommand cmd = new MySqlCommand(query, conn);
                int IsUpdated = cmd.ExecuteNonQuery();
                return IsUpdated;
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
        public List<Customer> getAllCustomer() {
            try
            {
                conn.Open();
                String query = "SELECT * FROM customer ORDER BY id";
                MySqlCommand cmd = new MySqlCommand(query, conn);
                MySqlDataReader mdr = cmd.ExecuteReader(CommandBehavior.CloseConnection);
                List<Customer> customerList = new List<Customer>();
                //name, location, lat, lng, email, phone, regdate,status
                while (mdr.Read())
                {
                    customerList.Add(new Customer
                    {
                        id = mdr.GetInt32(0),
                        name = mdr.GetString(1),
                        office_tel = mdr.GetString(2),
                        address = mdr.GetString(3),
                        contact_person1 = mdr.GetString(4),
                        contact_tel1 = mdr.GetString(5),
                        contact_person2 = mdr.GetString(6),
                        contact_tel2 = mdr.GetString(7),
                        email = mdr.GetString(8)
                    });
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
        public Customer getOneCustomerById(int id) {
            return getAllCustomer().Single(p => p.id.Equals(id));
        }
        public int deleteCustomer(int id) {
            try
            {
                conn.Open();
                MySqlCommand cmd = new MySqlCommand("DELETE FROM customer WHERE id='" + id + "'", conn);
                int IsDeleted = cmd.ExecuteNonQuery();
                return IsDeleted;
            }
            catch (MySqlException ex)
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