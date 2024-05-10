# Project Setup Guide for Bislerium Blogs🚀

## 3.2.1 Step 1: Install and Build React App 🔧

After extracting the zip project, the first thing you need to do is use npm to install and build the React app. To do so, open the command prompt and navigate to the client folder by using the following command:

`cd client`

## 3.2.2 Step 2: Confirm NuGet Package Installation 📦

Before running the project in Visual Studio, ensure that all the required NuGet packages are installed. These include:

- **AWSSDK.S3 (3.7.307.26):** 🗃️ Integrates with Amazon S3 for file storage.
- **MailKit (4.5.0):** ✉️ Supports email functionality.
- **Microsoft.AspNetCore.Authentication.JwtBearer (8.0.4):** 🔐 Handles JWT-based authentication.
- **Microsoft.AspNetCore.Identity.EntityFrameworkCore (8.0.4):** 👤 Manages user identity using Entity Framework Core.
- **Microsoft.AspNetCore.SpaProxy (8.0.4):** 🌐 Proxies requests to a Single Page Application.
- **Microsoft.EntityFrameworkCore (8.0.4):** 🗄️ Entity Framework Core for database interaction.
- **Microsoft.EntityFrameworkCore.SqlServer (8.0.4):** 💾 Adds SQL Server support to Entity Framework Core.
- **Microsoft.EntityFrameworkCore.Tools (8.0.4):** 🛠️ Additional tools for Entity Framework Core.
- **Microsoft.VisualStudio.Web.CodeGeneration.Design (8.0.2):** 💻 Generates code for web projects.
- **Swashbuckle.AspNetCore (6.4.0):** 📝 Integrates Swagger for API documentation.

## 3.2.3 Step 3: Establish Database Connection 🔌

Before proceeding, ensure that SQL Server Management Studio (SSMS) is installed on your system. Follow these steps to establish the database connection:

1. 🔓 Open SQL Server Management Studio (SSMS).

2. 🔗 Connect to your SQL Server instance. After opening SSMS, you'll be prompted to connect to a server. Enter the necessary credentials to connect.

3. 🔍 Once connected, locate the server name in SSMS. This will be used as the "Data Source" in the connection string.

4. 📋 Copy the server name from SSMS. It should look something like "DESKTOP-XXXXXXX".

5. 🔙 Return to Visual Studio and locate the appsettings.json file within your project's solution explorer.

6. 📂 Open the appsettings.json file.

7. 🔍 Locate the "DatabaseConnection" setting within the JSON structure.

8. 📝 Replace the value of the "Data Source" parameter with the copied server name

9. 💾 After updating the connection string, save the appsettings.json file.

10. 🖥️ Now, open to the terminal in Visual Studio Code.

11. 🚪 Navigate to the server folder of your project using the following command "dotnet ef database update" (if for some reason the package is still not installed then just enter another command "dotnet tool install --global dotnet-ef" then again "dotnet ef database update". This will create a database name "BisleriumBlogs" in your server with all the necessary tables.

_Figure 6: Create/Update Database_

12. 🚀 Finally, you can now run the project

_Figure 7: Run Project_

This will run both backend and frontend. 🎉
