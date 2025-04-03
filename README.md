# Trigger Tide 🌊

![Trigger Tide](frontend/src/assets/icon.png)

Trigger Tide is a powerful email marketing sequence builder that allows you to design and implement automated email campaigns using an intuitive visual flowchart interface.

## ✨ Features

- **Visual Flowchart Editor**: Design your email sequences using a drag-and-drop interface
- **Multiple Node Types**:
  - 📧 **Cold Email**: Configure email subject, body, and recipients
  - ⏱️ **Wait/Delay**: Set time delays between emails (minutes, hours, days)
  - 👥 **Lead Source**: Define starting points for your email sequences
- **Automated Scheduling**: Emails are automatically scheduled based on your flowchart design
- **User Authentication**: Secure user accounts with JWT authentication
- **Password Recovery**: Reset password functionality via email
- **Responsive Design**: Works on desktop and mobile devices

## 🛠️ Technologies

### Frontend
- **React**: UI library built with Vite
- **ReactFlow**: Library for building node-based editors and flowcharts
- **Zustand**: State management
- **TailwindCSS** & **DaisyUI**: Styling
- **React Router**: Navigation
- **Axios**: API requests
- **React Hot Toast**: Notifications

### Backend
- **Node.js**: Runtime environment
- **Express**: Web framework
- **MongoDB** & **Mongoose**: Database and ODM
- **@hokify/agenda**: Job scheduling for emails
- **Nodemailer**: Email delivery
- **JWT**: Authentication
- **bcrypt**: Password hashing

## 🏗️ Project Structure

```
├── backend/
│   ├── src/
│   │   ├── controller/      # Route handlers
│   │   ├── lib/             # Utility functions
│   │   ├── middleware/      # Express middlewares
│   │   ├── model/           # Mongoose schemas
│   │   ├── route/           # Express routes
│   │   └── index.js         # Entry point
│   ├── .env                 # Environment variables (create this)
│   └── package.json
│
└── frontend/
    ├── src/
    │   ├── assets/          # Static assets
    │   ├── components/      # Reusable React components
    │   ├── lib/             # Utility functions
    │   ├── pages/           # Page components
    │   ├── store/           # Zustand stores
    │   ├── App.jsx          # Main App component
    │   └── main.jsx         # Entry point
    ├── index.html
    ├── postcss.config.js
    ├── tailwind.config.js
    └── package.json
```

## 🚀 Getting Started

### Prerequisites

- Node.js (v16+)
- MongoDB
- npm or yarn

### Environment Variables

Create a `.env` file in the backend directory with the following variables:

```
# Server
PORT=5001
NODE_ENV=development

# MongoDB
MONGODB_URI=mongodb://localhost:27017/triggertide

# JWT
JWT_SECRET=your_jwt_secret_key

# Email (for password reset and sending emails)
EMAIL_SERVICE=gmail
EMAIL_USERNAME=your_email@gmail.com
EMAIL_PASSWORD=your_app_password
EMAIL_FROM=your_email@gmail.com

# Frontend URL (for password reset links)
FRONTEND_URL=http://localhost:5173
```

### Installation

1. Clone the repository:
```bash
git clone https://github.com/yourusername/triggertide.git
cd triggertide
```

2. Install backend dependencies:
```bash
cd backend
npm install
```

3. Install frontend dependencies:
```bash
cd ../frontend
npm install
```

### Running the application

1. Start the backend server:
```bash
cd backend
npm run dev
```

2. Start the frontend development server:
```bash
cd frontend
npm run dev
```

3. Open your browser and navigate to `http://localhost:5173`

## 💼 Usage

### Creating an Account

1. Navigate to the signup page
2. Enter your full name, email, and password
3. Click "Sign Up"

### Building an Email Sequence

1. From the dashboard, click "Create New Sequence"
2. Drag nodes from the sidebar onto the canvas:
   - Start with a **Lead Source** node (required)
   - Add **Wait/Delay** nodes to set timing
   - Add **Cold Email** nodes for email content
3. Connect nodes by dragging from one handle to another
4. Configure each node by:
   - For **Lead Source**: Add an email address and source name
   - For **Wait/Delay**: Set delay time and unit (minutes, hours, days)
   - For **Cold Email**: Set subject, body, and optional specific recipient
5. Click "Save Flow" to save your sequence

### Managing Sequences

- View all sequences on the dashboard
- Edit a sequence by clicking the edit button
- Delete a sequence by clicking the delete button

## 📡 API Endpoints

### Authentication

- `POST /api/auth/signup`: Register a new user
- `POST /api/auth/login`: Login a user
- `POST /api/auth/logout`: Logout a user
- `GET /api/auth/check`: Check if user is authenticated
- `POST /api/auth/forgot-password`: Request password reset
- `POST /api/auth/reset-password/:resetToken`: Reset password

### Flowcharts

- `POST /api/flowchart/create`: Create a new flowchart
- `PUT /api/flowchart/update/:flowId`: Update an existing flowchart
- `DELETE /api/flowchart/delete/:flowId`: Delete a flowchart
- `GET /api/flowchart/all`: Get all flowcharts for the user
- `GET /api/flowchart/:flowId`: Get a specific flowchart

## 🧪 Testing

```bash
# Run backend tests
cd backend
npm test

# Run frontend tests
cd frontend
npm test
```

## 🔒 Security Considerations

- JWT tokens are stored in HTTP-only cookies
- Passwords are hashed using bcrypt
- CSRF protection implemented
- XSS protection with input sanitization

## 🤝 Contributing

1. Fork the repository
2. Create your feature branch: `git checkout -b feature/amazing-feature`
3. Commit your changes: `git commit -m 'Add some amazing feature'`
4. Push to the branch: `git push origin feature/amazing-feature`
5. Open a Pull Request

## 📜 License

This project is licensed under the MIT License - see the LICENSE file for details.

## 🙏 Acknowledgements

- [Future Blink](https://careers.futureblink.com) for the project inspiration
- [ReactFlow](https://reactflow.dev)
- [Agenda](https://github.com/agenda/agenda)
- [Nodemailer](https://nodemailer.com)