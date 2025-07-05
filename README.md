![Live Screenshot](https://github.com/SaM-2-0-0-2/Quiz-App/blob/main/Project%20SS.png)


# 📝 Software Requirements Specification (SRS)
## Project Title: **Online Quiz Management System**

---

## 1. Introduction

### 1.1 Purpose
This document specifies the software requirements for the Quiz App project. The application provides a platform for admins to create/manage quizzes and for students to take quizzes and track performance.

### 1.2 Scope
The system includes:
- A responsive frontend built with React.
- A secure backend API built using ASP.NET Core.
- Support for multiple roles (Admin and Student).
- Real-time result calculation and storage.
- Scalable architecture for educational institutions or other training systems.

---

## 2. Overall Description

### 2.1 Users
- **Admin**: Manages quizzes, questions, and views results.
- **Student**: Participates in quizzes and reviews results.

### 2.2 Technologies
- **Frontend**: React, Vite, Bootstrap, React-Bootstrap, Axios
- **Backend**: ASP.NET Core Web API (.NET 9), Entity Framework Core, SQL Server
- **Authentication**: JWT tokens
- **Tools**: Visual Studio, GitHub, Postman

### 2.3 Assumptions
- Users have valid login credentials.
- Quizzes are stored and fetched from a secure database.
- Results are evaluated and persisted post-submission.

---

## 3. Functional Requirements

| ID  | Requirement                                                                 |
|-----|-----------------------------------------------------------------------------|
| FR1 | Admin can create, update, delete quizzes                                    |
| FR2 | Admin can add multiple questions per quiz                                   |
| FR3 | Students can view available quizzes                                         |
| FR4 | Students can attempt quizzes and submit answers                             |
| FR5 | System automatically evaluates and stores results                           |
| FR6 | Admin can view and manage student results                                   |
| FR7 | The app enforces role-based access control using JWT                        |

---

## 4. Non-Functional Requirements

| ID   | Requirement                                                                  |
|------|------------------------------------------------------------------------------|
| NFR1 | The system should be mobile-responsive and user-friendly                    |
| NFR2 | Should support 50+ concurrent users without significant lag                 |
| NFR3 | Data transmission should use HTTPS for security                             |
| NFR4 | The average page load time should be under 2 seconds                        |
| NFR5 | Passwords must be securely hashed                                           |
| NFR6 | The app should be maintainable and follow clean architecture principles     |

---

## 5. System Architecture

- **Frontend**: React Single Page Application (SPA) using Axios to interact with the backend API.
- **Backend**: ASP.NET Core RESTful API with Entity Framework for data access.
- **Database**: MS SQL Server for relational data storage.

---

## 6. Modules Overview

- **Authentication Module**: JWT-based login, role management
- **Quiz Module**: Create/read/update/delete (CRUD) operations for quizzes
- **Question Module**: CRUD operations for questions within quizzes
- **Evaluation Module**: Validates submitted answers, calculates scores
- **Result Module**: Stores and retrieves quiz results for users
- **Admin Dashboard**: View quiz statistics and user performance

---

## 7. Database Schema (Summary)


![Live Screenshot](https://github.com/SaM-2-0-0-2/Quiz-App/blob/main/ProjectDBSchema.png)

### Users Table
- UserID (PK)
- Username
- Email
- PasswordHash
- Role

### Quizzes Table
- QuizID (PK)
- QuizTitle
- TotalMarks

### Questions Table
- QuesID (PK)
- QuizID (FK)
- QuestionText
- Option1
- Option2
- Option3
- Option4
- Answer

### Results Table
- ResultID (PK)
- UserName
- QuizID (FK)
- MarksObtained

---

## 8. Future Enhancements

- Add support for question categories and difficulty levels.
- Timer-based quizzes with auto-submission.
- Analytics dashboard with charts for performance trends.
- Export result reports (CSV/PDF).
- Dark mode support for better accessibility.

---

## 9. Authors / Contributors

- **Maheshwar Bagal** – Frontend Developer  
- **Amey Sonawane** – Backend Developer  
- **Shriram Sabade** – Backend Developer  

---

## 10. Tech Stack Summary

- **Frontend**: React, Vite, Bootstrap, React-Bootstrap, Axios  
- **Backend**: ASP.NET Core (.NET 9), Entity Framework Core, MS SQL Server  
- **Authentication**: JWT  
- **Database**: Microsoft SQL Server  
