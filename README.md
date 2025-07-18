#  VaultMart – E-Commerce Web App

VaultMart is a full-stack e-commerce web application that allows users to browse products, view detailed information, add items to their cart, and manage their accounts. This project is being built using the **MERN** stack (MongoDB, Express, React – *or HTML/JS*, Node.js) with **JWT authentication**, **Multer** for file uploads, and responsive UI using **HTML, CSS, and vanilla JavaScript**.

---

##  Current Status

### Core functionalities completed so far:

- User Authentication (Login, Signup, Logout)  
- Account Profile Management (Edit, Save, Cancel, Validation)  
- Product Details Page (Dynamic loading with product ID)  
- Cart System (Add, Update quantity, Remove items)  
- Toast Notifications  
- Product Images Upload (via Multer)  
- Dynamic DOM manipulation (without full page reloads)  
- Responsive UI styling  
- Seller Dashboard (Order management, product upload & tracking)

### Features under development:

- Wishlist system  
- Improved search/filtering  

---

## 🛠 Features Implemented

###  User Account

- JWT-based authentication  
- Profile page with editable user info  
- Validations for name length, email format, and address  

###  Cart

- Add to cart with quantity selector modal  
- Dynamic cart page rendering using data from the backend  
- Subtotal, tax, and total price calculation  
- Update item quantity and remove product without refreshing the page  
- Shows empty cart message when there are no items  

###  Product Details

- Single `product-details.html` dynamically loads product data using its ID from the URL  
- Displays product image, price, description, and "Add to Cart" / "Buy Now" buttons  
- Modal popup for selecting quantity before adding to cart  

###  Media Upload

- Product images uploaded via Multer and stored with a unique filename  
- Image URLs are saved in the MongoDB product model and rendered on the frontend  

###  Seller Dashboard 

- Upload new products with images, price, and descriptions  
- View, edit, and delete their own listings  
- Track orders placed by customers  
- Update product status (e.g., Pending, Shipped, Delivered)  
- Responsive table layout and status dropdown with persistence  

---

##  Tech Stack

- **Frontend**: HTML, CSS, JavaScript, Toastify.js  
- **Backend**: Node.js, Express.js  
- **Database**: MongoDB (Mongoose)  
- **Authentication**: JWT (JSON Web Token)  
- **File Uploads**: Multer  
- **Hosting**: *Localhost (in development)*  

---

##  How to Run (Basic)

1. Clone the repository  
2. Create a `.env` file in the root directory with the following:
3. MONGO_URI=your_mongodb_connection_string
   JWT_SECRET=your_jwt_secret
4. Install dependencies:
   npm install
5.Start the backend server:
   node app.js
6.Open home.html with Live Server or serve it via Express
