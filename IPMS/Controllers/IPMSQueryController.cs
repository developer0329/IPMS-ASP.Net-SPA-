using IPMS.Models;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Net;
using System.Net.Http;
using System.Web.Http;

namespace IPMS.Controllers
{
    public class IPMSQueryController : ApiController
    {

        [HttpPost()]
        [ActionName("Login")]
        public string Login(LoginInfo login)
        {
            if(login.email == "admin" && login.password == "kmedix2017")
            {
                return "Success";
            }
            else
            {
                return "Failed";
            }
        }

        /// <summary>
        /// /////////////////////////////// Customer Controller Start ////////////////////////////////
        /// </summary>
        [HttpPost()]
        [ActionName("AddNewCustomer")]
        public int AddNewCustomer(Customer customer)
        {
            CustomerModel cm = new CustomerModel();
            return cm.createCustomer(customer);
        }

        [HttpPost()]
        [ActionName("UpdateCustomer")]
        public int UpdateCustomer(Customer customer)
        {
            CustomerModel cm = new CustomerModel();
            return cm.updateCustomer(customer);
        }

        [HttpGet()]
        [ActionName("GetAllCustomer")]
        public IEnumerable<Customer> GetAllCustomer()
        {
            CustomerModel cm = new CustomerModel();
            return cm.getAllCustomer();
        }

        [HttpPost()]
        [ActionName("GetOneCustomerById")]
        public Customer GetOneCustomerById(SearchById search)
        {
            CustomerModel cm = new CustomerModel();
            return cm.getOneCustomerById(search.id);
        }

        [HttpPost()]
        [ActionName("DeleteCustomerById")]
        public int DeleteCustomerById(SearchById search)
        {
            CustomerModel cm = new CustomerModel();
            return cm.deleteCustomer(search.id);
        }
        /// <summary>
        /// /////////////////////////////// Customer Controller End ////////////////////////////////
        /// </summary>

        /// <summary>
        /// /////////////////////////////// Payment Plan Controller Start ////////////////////////////////
        /// </summary>
        [HttpPost()]
        [ActionName("AddNewPaymentPlan")]
        public int AddNewPaymentPlan(PaymentPlan plan)
        {
            PaymentPlanModel pm = new PaymentPlanModel();
            return pm.AddNewPaymentPlan(plan);
        }

        [HttpPost()]
        [ActionName("ConfirmPaymentPlan")]
        public List<DueListItem> ConfirmPaymentPlan(PaymentPlan plan)
        {
            PaymentPlanModel pm = new PaymentPlanModel();
            return pm.confirmPaymentPlan(plan);
        }


        [HttpGet()]
        [ActionName("GetAllPaymentPlan")]
        public IEnumerable<PaymentPlanDisplay> GetAllPaymentPlan()
        {
            PaymentPlanModel pm = new PaymentPlanModel();
            return pm.getAllPaymentPlan();
        }

        [HttpPost()]
        [ActionName("GetOnePaymentPlanById")]
        public PaymentPlanDisplay GetOnePaymentPlanById(SearchById search)
        {
            PaymentPlanModel pm = new PaymentPlanModel();
            return pm.getOnePaymentPlanById(search.id);
        }

        [HttpGet()]
        [ActionName("GetAllInstallmentPlan")]
        public InstallmentPlan GetAllInstallmentPlan()
        {
            InstallmentPlan result = new InstallmentPlan();
            PaymentPlanModel pm = new PaymentPlanModel();
            result.plans = pm.getAllInstallmentPlan();
            result.total_values = pm.getPaymentStatusValues();
            return result;
        }

        [HttpPost()]
        [ActionName("GetOneInstallmentPlanDetailById")]
        public InstallmentPlanDetail GetOneInstallmentPlanDetailById(SearchById search)
        {
            PaymentPlanModel pm = new PaymentPlanModel();
            return pm.getPaymentPlanDetail(search.id);
        }


        [HttpPost()]
        [ActionName("GetDuePaymentOfMonth")]
        public IEnumerable<DuePaymentMonth> GetDuePaymentOfMonth(SearchDueLisByDateAndPaidStatus search)
        {
            DuePaymentMonthModel pm = new DuePaymentMonthModel();
            return pm.readDuePaymentMonthRowFilter(search.date, search.paid);
        }


        [HttpPost()]
        [ActionName("GetInvoiceListByCustomerID")]
        public IEnumerable<Invoice> GetInvoiceListByCustomerID(SearchById search)
        {
            PaymentPlanModel pm = new PaymentPlanModel();
            return pm.getInvoiceListByCustomerID(search.id);
        }


        [HttpPost()]
        [ActionName("GetDueInfoByCustomerIDAndInovice")]
        public IEnumerable<DashboardTableData> GetDueInfoByCustomerIDAndInovice(SearchByIdAndInvoice search)
        {
            PaymentPlanModel pm = new PaymentPlanModel();
            return pm.getDueInfoByCustomerIDAndInovice(search.customer_id, search.invoice_no);
        }

        [HttpPost()]
        [ActionName("UpdateDuePaymentMonthRow")]
        public DueListItem UpdateDuePaymentMonthRow(UpdateDuePayment due)
        {
            DuePaymentMonthModel dm = new DuePaymentMonthModel();
            return dm.updateDuePaymentMonthRow(due);
        }

        /// <summary>
        /// /////////////////////////////// Payment Plan Controller End ////////////////////////////////
        /// </summary>


        public class SearchById
        {
            public int id;
        }

        public class SearchDueLisByDateAndPaidStatus
        {
            public DateTime date;
            public int paid;
        }
        public class SearchByIdAndInvoice
        {
            public int customer_id;
            public string invoice_no;
        }
        public class LoginInfo
        {
            public string email;
            public string password;
        }
    }
}
