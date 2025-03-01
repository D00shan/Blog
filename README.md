# Blog - A Simple Node.js Blog with Admin Panel

## Description
This is a simple blog application built with Node.js using Express and MySQL as the database. It allows users to read articles, browse through a list of articles, and contact the admin. The application also includes an admin panel, accessible only from local networks, where administrators can manage articles and read messages sent via the contact page.

## Features
### Public Features
- **Home Page**: Displays the most recent articles.
- **Articles Page**: Browse and sort articles by publishing date.
- **Contact Us Page**: Users can send messages to the admin.
- **Article Page**: Each article has its own dedicated page for reading.

### Admin Features (Accessible Only on Local Networks)
- **Admin Login Page**: Secure login for administrators.
- **Dashboard**: Admins can browse and delete articles.
- **Article Creation Page**: Allows admins to add metadata (title, description, slug, cover image) and write the article body (headers, paragraphs, and images).
- **User Management**: Change admin username and password.
- **Contact Messages Page**: View messages sent via the contact form.

## Installation & Deployment

### Prerequisites
- Node.js installed on the system
- MySQL database
- Git (optional, for cloning the repository)

### Setup Instructions
1. **Clone the Repository**
   ```bash
   git clone https://github.com/D00shan/blog.git
   cd blog
   ```
2. **Install Dependencies**
   ```bash
   npm install
   ```
3. **Configure the Environment Variables**
   - Create a MySQL schema (database) with any name.
   - Rename `.env.example` to `.env` and fill in the required values:
     ```env
     PORT=[port number]
     DB_HOST=[database host]
     DB_USER=[database username]
     DB_PASSWORD=[database password]
     DB_NAME=[database name]
     DB_PORT=[database port]
     HASH_SALT=[cost factor for password hashing]
     BLOG_CUT_OFF=8
     DASH_CUT_OFF=8
     ```
   - `BLOG_CUT_OFF`: Determines the number of posts per page in the articles section.
   - `DASH_CUT_OFF`: Determines the number of posts per page in the admin dashboard.

4. **Initialize the Database**
   ```bash
   node ./setup.js [admin username] [admin password]
   ```
   Replace `[admin username]` and `[admin password]` with the desired credentials for the admin account.

5. **Run the Application**
   ```bash
   npm run blog
   ```

## Usage
- Visit `http://localhost:[PORT]` to access the blog.
- Visit `http://localhost:[PORT]/admin` (on a local network) to access the admin panel.