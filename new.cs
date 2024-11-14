string receiverCC = "";
string receiverCCEmail;
string receiverEmail;
string receiverName;
string htmlMessage = "";
string message = "";
string subject;
string content;

UCA.Common.DataControl.DBUtility dbUtility = UCA.Common.DataControl.DBOperatorFactory.GetDBOperator(System.Configuration.ConfigurationManager.AppSettings["DBType"].ToString());
string alertID = dbu.ExecuteWithOneReturn(@"SELECT User_Alert_ID FROM User_Alert WHERE Button_Id = '" + b.ID + "'").ToString();
string alertStatus = dbu.ExecuteWithOneReturn(@"SELECT Email_Alert FROM User_Alert WHERE Button_Id = '" + b.ID + "'").ToString();

if (String.Compare(alertStatus, "Yes", true) != 0)
    return;

string smtpServerName = dbu.ExecuteWithOneReturn(@"SELECT smtp_server_name FROM User_Alert WHERE Button_Id = '" + b.ID + "'").ToString();
string smtpUserName = dbu.ExecuteWithOneReturn(@"SELECT smtp_user_name FROM User_Alert WHERE Button_Id = '" + b.ID + "'").ToString();
string smtpUserPassword = dbu.ExecuteWithOneReturn(@"SELECT smtp_user_password FROM User_Alert WHERE Button_Id = '" + b.ID + "'").ToString();
int port = Int32.Parse(dbu.ExecuteWithOneReturn(@"SELECT port FROM User_Alert WHERE Button_Id = '" + b.ID + "'").ToString());
bool SSL = bool.Parse(dbu.ExecuteWithOneReturn(@"SELECT SSL FROM User_Alert WHERE Button_Id = '" + b.ID + "'").ToString());
string sentBy = dbu.ExecuteWithOneReturn(@"SELECT Employee_Profile.Email FROM Users INNER JOIN Employee_Profile ON Employee_Profile.Employee_Profile_ID = Users.Employee_Profile_ID WHERE Users.Users_ID = '" + UserID + "'").ToString();
string sender = dbu.ExecuteWithOneReturn(@"SELECT User_Name FROM Users WHERE Users_ID = '" + UserID + "'").ToString();

List<string> receiverCCEmails = new List<string>();
List<string> receiversCC = new List<string>();

DataTable userDataCCTable = dbUtility.FillDataTable(CCSQL);

if (userDataCCTable.Rows.Count > 0) 
{
    foreach (DataRow CCrow in userDataCCTable.Rows)    
    {
        receiverCCEmails.Add(CCrow["Email"].ToString());
    }
}

int[] selrows = UCAControls.SelectorUtility.getGridViewSelectedRowIndics(sgv);
    if (selrows == null && dRow != null)
        selrows = new int[] { 0 };

foreach (int rno in selrows)
{
    string POID = (dRow != null) ? dRow["Purchase_Order_ID"].ToString() : UCA.CustomButton.CustomUtility.Get_GridViewValue("Purchase_Order_ID", sgv.Rows[rno]);
    string PONo = (dRow != null) ? dRow["PO"].ToString() : UCA.CustomButton.CustomUtility.Get_GridViewValue("PO", sgv.Rows[rno]);
    string supplier = (dRow != null) ? dRow["Supplier"].ToString() : UCA.CustomButton.CustomUtility.Get_GridViewValue("Supplier", sgv.Rows[rno]);
    string customer = (dRow != null) ? dRow["Customer"].ToString() : UCA.CustomButton.CustomUtility.Get_GridViewValue("Customer", sgv.Rows[rno]);
    string project = (dRow != null) ? dRow["Project"].ToString() : UCA.CustomButton.CustomUtility.Get_GridViewValue("Project", sgv.Rows[rno]);
    string POType = (dRow != null) ? dRow["PO_Type"].ToString() : UCA.CustomButton.CustomUtility.Get_GridViewValue("PO_Type", sgv.Rows[rno]);
    string status = dbu.ExecuteWithOneReturn(@"SELECT Status FROM Purchase_Order WHERE Purchase_Order_ID = '" + POID + @"'").ToString();
    string combineEmail = "";

    List<string> receiverEmails = new List<string>();
    List<string> receiverNames = new List<string>();

    DataTable salesPersonTable = dbUtility.FillDataTable(@"SELECT DISTINCT Employee_Profile.Employee_Name AS Display_Name, Employee_Profile.Email FROM Employee_Profile INNER JOIN 
                                                                            (
                                                                                SELECT
                                                                                    Purchase_Order.Employee_Profile_ID
                                                                                FROM Purchase_Order
                                                                                WHERE Purchase_Order_ID = '" + POID + @"'

                                                                            ) tempTable ON tempTable.Employee_Profile_ID = Employee_Profile.Employee_Profile_ID 
                                                                            WHERE Employee_Profile.Email IS NOT NULL AND Employee_Profile.Status = 'Active'
                                                                ");

    if (salesPersonTable.Rows.Count > 0)
    {
        foreach (DataRow salesPersonRow in salesPersonTable.Rows)    
        {
            if (string.IsNullOrEmpty(combineEmail))
                combineEmail = salesPersonRow["Email"].ToString();
            else
                combineEmail = combineEmail + "," + salesPersonRow["Email"].ToString();

            receiverEmails.Add(salesPersonRow["Email"].ToString());
        }

        subject = POType + " PO " + PONo + " Has Been " + status;

        content = "Dear PIC, <br/><br/>";
        content = content + "The following purchase order has been " + status.ToLower() +salesPersonTable.Rows.Count + ":<br/><br/>";
        content = content + "PO No : " + PONo + "<br/>";
        content = content + "Supplier : " + supplier;

        if (!string.IsNullOrEmpty(customer))
            content = content + "<br/>Customer : " + customer;

        if (!string.IsNullOrEmpty(project))
            content = content + "<br/>Project : " + project;

        content = content + "<br/><br/>";
        content = content + "Please login to the system for more details.<br/><br/>";

        string reportName = "PurchaseOrder";
        if(POType != "FG")
       {
         reportName = "PurchaseOrderMaterial";
       }

        if (status == "Approved")
        {
            string url = "../../Tools/Functional/Reporting/SQLReportPreview.aspx?";
            url += "ReportName=" + reportName;
            url += "&ShowParameter=False";
            url += "&ExportType=PDF";
            url += "&POID=" + POID;
            url += "&DirectSave=Yes";
            url += "&Preview=No";
            url += "&SendAsEmail=Yes";
            url += "&FileName=" + PONo;

            content = content + "Best Regards,<br/>";
            content = content + sender;

            NameValueCollection paramater = new NameValueCollection();
                    paramater.Add("POID", POID);

                   // Fitprise.Functional.Reporting.Utilites.ReportUtility.ConstructSQLReportEmailMultiple(smtpServerName, smtpUserName, combineEmail, smtpUserName, smtpUserPassword, subject, content, port, SSL, paramater, "PurchaseOrder", PONo);
         
         //ConstructSQLReportEmailMultiple(smtpservername, sender, receiver, smtpUserName, smtpUserPassword, subject, content, port, SSL, sql report parameter, report name, filename);

        Fitprise.Functional.Reporting.Utilites.ReportUtility.ConstructSQLReportEmail(sgv, url, smtpServerName, smtpUserName, combineEmail, smtpUserName, smtpUserPassword, subject, content, port, SSL);

        }
        else
        {
            CommonFunctions.commonSendEmail(content, content, receiverEmails, receiverNames, receiverCCEmails, receiversCC, subject, b.ID);
        }
    }
}