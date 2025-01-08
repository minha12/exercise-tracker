# Exercise Tracker REST API

A full-stack JavaScript application built with Node.js, Express, and MongoDB that provides a RESTful API for tracking exercises.

## Technologies Used

- **Backend**: Node.js, Express
- **Database**: MongoDB with Mongoose ODM
- **Frontend**: HTML5, CSS3, Vanilla JavaScript
- **API**: RESTful architecture
- **Authentication**: None (for learning purposes)

## Project Structure

```
exercise-tracker/
├── public/
│   ├── css/
│   │   └── style.css
│   └── js/
│       └── script.js
├── views/
│   └── index.html
├── server.js
├── .env
└── README.md
```

## API Endpoints

### Create New User
- **POST** `/api/exercise/new-user`
- **Body**: `username` (String)
- **Response**: `{ username: String, _id: String }`

### Add Exercise
- **POST** `/api/exercise/add`
- **Body**: 
  - `userId` (String, required)
  - `description` (String, required)
  - `duration` (Number, required)
  - `date` (Date, optional) - defaults to current date
- **Response**: User object with exercise fields

### Get All Users
- **GET** `/api/exercise/users`
- **Response**: Array of users with their IDs

### Get Exercise Log
- **GET** `/api/exercise/log`
- **Query Parameters**:
  - `userId` (String, required)
  - `from` (Date, optional) - format: yyyy-mm-dd
  - `to` (Date, optional) - format: yyyy-mm-dd
  - `limit` (Number, optional)
- **Response**: 
```json
{
  "username": String,
  "_id": String,
  "count": Number,
  "log": [{
    "description": String,
    "duration": Number,
    "date": Date
  }]
}
```

## Database Schema

```javascript
const appSchema = new Schema({
  userName: String,
  log: [{
    description: String,
    duration: Number,
    date: {type: Date, default: Date.now}
  }]
})
```

## Setup and Installation

1. Clone the repository
2. Install dependencies:
   ```bash
   npm install
   ```
3. Create a `.env` file with your MongoDB credentials:
   ```
   MONGO_USERNAME=your_username
   MONGO_PASSWORD=your_password
   MONGO_CLUSTER=your_cluster
   PORT=3000
   ```
4. Start the server:
   ```bash
   npm start
   ```

## Features

- Create and track multiple users
- Add exercises with description, duration, and date
- Retrieve exercise logs with optional date filtering
- Limit the number of logs returned
- Real-time form validation
- Formatted JSON responses
- Responsive design

## Development Notes

- Uses modern async/await syntax for API calls
- Implements proper error handling
- Follows RESTful API conventions
- Includes client-side form validation
- Uses ES6+ JavaScript features

## Testing

Test the API endpoints using the built-in web interface or with tools like Postman.

Example test cases are provided in the UI for each endpoint.

## License

MIT License
