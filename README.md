# **Personal Budget Tracker with Financial Advice Chatbot**

A comprehensive full-stack personal finance application designed to help users track their expenses, manage budgets, and receive personalized financial advice through an integrated AI chatbot.

## **Features**

* **Income & Expense Tracking:** Easily log and categorize your daily financial transactions.  
* **AI Financial Advice Chatbot:** Get real-time, smart financial insights and budget optimization tips from an integrated AI assistant.  
* **Dashboard Analytics:** Visual representations of your spending habits and budget progression.  
* **User Authentication:** Secure user sessions and data ownership using JWT.  
* **Responsive UI:** A clean, modern frontend designed for seamless use across different devices.

## **Tech Stack**

This project is built using the **MERN** architecture:

* **Frontend:** React.js  
* **Backend:** Node.js, Express.js  
* **Database:** MongoDB  
* **Authentication:** JSON Web Tokens (JWT)

## **Getting Started**

### **Prerequisites**

Make sure you have [Node.js](https://nodejs.org/) and [MongoDB](https://www.mongodb.com/) installed on your local machine.

### **Installation**

1. **Clone the repository:**  
   git clone https://github.com/Asmit00098/Personal-Budget-Tracker-with-Financial-Advice-Chatbot.git  
   cd Personal-Budget-Tracker-with-Financial-Advice-Chatbot

2. **Install Backend Dependencies:**  
   cd backend  
   npm install

3. **Install Frontend Dependencies:**  
   cd ../frontend  
   npm install

4. **Environment Setup:** Create a .env file in the backend directory and add your configuration variables:  
   PORT=5000  
   MONGO\_URI=your\_mongodb\_connection\_string  
   JWT\_SECRET=your\_jwt\_secret  
   AI\_API\_KEY=your\_ai\_chatbot\_api\_key

5. **Run the Application:** Open two terminals to start both the frontend and backend servers concurrently.  
   *Terminal 1 (Backend):*  
   cd backend  
   npm start

   *Terminal 2 (Frontend):*  
   cd frontend  
   npm start

## **Author**

**Asmit Mishra**

* GitHub: [@Asmit00098](https://github.com/Asmit00098)

## **License**

This project is open-source and available under the [MIT License](http://docs.google.com/LICENSE).