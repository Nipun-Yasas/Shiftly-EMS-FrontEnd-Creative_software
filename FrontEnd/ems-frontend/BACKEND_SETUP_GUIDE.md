# Backend Server Setup Guide

## Issue: Network Error - Backend Server Not Running

The frontend application is trying to connect to a Spring Boot backend server at `http://localhost:8080`, but the server is not running or not accessible.

## Solution Steps

### 1. Check if Backend Server is Running

Open Command Prompt and run:
```bash
netstat -an | findstr :8080
```

If you see a result like `TCP 0.0.0.0:8080 0.0.0.0:0 LISTENING`, the server is running.
If no result, the server is not running.

### 2. Start the Backend Server

Navigate to your backend project directory (likely named something like `Employee-Management-System` or similar) and run:

```bash
# If using Maven
mvn spring-boot:run

# Or if using Gradle
./gradlew bootRun

# Or if you have a JAR file
java -jar target/your-app-name.jar
```

### 3. Fix Database Connection Issues

Based on the error logs, you need to fix MySQL database connection:

#### Option A: Fix MySQL Root Password
1. Open MySQL Command Line or MySQL Workbench
2. Connect as root user
3. Change the password:
   ```sql
   ALTER USER 'root'@'localhost' IDENTIFIED BY 'your_new_password';
   FLUSH PRIVILEGES;
   ```

#### Option B: Create a New Database User
1. Connect to MySQL as root (if possible)
2. Create a new user:
   ```sql
   CREATE USER 'ems_user'@'localhost' IDENTIFIED BY 'ems_password';
   GRANT ALL PRIVILEGES ON ems_database.* TO 'ems_user'@'localhost';
   FLUSH PRIVILEGES;
   ```

#### Option C: Update Application Properties
Find your `application.properties` or `application.yml` file in the backend project and update:

```properties
# application.properties
spring.datasource.url=jdbc:mysql://localhost:3306/your_database_name
spring.datasource.username=your_username
spring.datasource.password=your_password
spring.datasource.driver-class-name=com.mysql.cj.jdbc.Driver

spring.jpa.hibernate.ddl-auto=update
spring.jpa.show-sql=true
spring.jpa.properties.hibernate.dialect=org.hibernate.dialect.MySQLDialect
```

### 4. Verify MySQL Service is Running

Check if MySQL is running:
```bash
# Windows
net start mysql

# Or check services
services.msc
```

Look for MySQL service and start it if it's stopped.

### 5. Common Backend Project Structure

Your backend project should be located at:
```
c:\Users\lalana\Desktop\creativeBack\Shiftly-EMS-Backend-Creative_software\Employee-Management-System\
```

### 6. Frontend Configuration

The frontend is configured to connect to:
- **URL**: `http://localhost:8080`
- **Timeout**: 10 seconds

If your backend runs on a different port, update these files:
- `src/app/_utils/axiosInstance.js`
- `src/app/_utils/apiPaths.js`

### 7. Test Backend Connection

Once the backend is running, test it by opening:
```
http://localhost:8080/actuator/health
```

Or any available endpoint in your browser.

## Troubleshooting Tips

1. **Port Conflict**: If port 8080 is busy, change the backend port in `application.properties`:
   ```properties
   server.port=8081
   ```
   Then update frontend configuration accordingly.

2. **Firewall Issues**: Ensure Windows Firewall allows connections on port 8080.

3. **Database Issues**: 
   - Ensure MySQL is installed and running
   - Check if the database exists
   - Verify user permissions

4. **IDE Issues**: If using an IDE like IntelliJ IDEA or Eclipse, try running the application directly from the IDE.

## Error Messages Explained

- **"Network Error"**: Backend server is not running or not accessible
- **"Access denied for user 'root'@'localhost'"**: MySQL authentication failed
- **"Connection refused"**: MySQL service is not running
- **"Unknown database"**: The specified database doesn't exist

## Next Steps

1. Start the backend server
2. Fix database connection
3. Verify frontend can connect
4. Test login functionality

Once the backend is running, the frontend errors should be resolved.
