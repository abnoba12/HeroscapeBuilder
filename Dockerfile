# Use the official Microsoft SQL Server image as the base
FROM mcr.microsoft.com/mssql/server:2022-latest

# Set environment variables to accept EULA, configure SQL Server edition, and set the SA password
ENV ACCEPT_EULA=Y
ENV MSSQL_PID=Express
ENV SA_PASSWORD=${MSSQL_SA_PASSWORD}

# Default command for SQL Server start
CMD ["/opt/mssql/bin/sqlservr"]
