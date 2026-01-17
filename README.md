# 🏥 MediAssist – AI Emergency & Health Assistance Platform.

MediAssist is a full-stack MERN application that uses AI-powered symptom analysis and location-based emergency search to help users quickly find nearby medical resources such as hospitals, blood banks, pharmacies, and ambulances.

To ensure data accuracy and trust, all resources go through an admin verification system before becoming publicly available.

---

## 🚀 Key Features
### 👤 User Features

**🤖 AI Symptom Analysis**

Users describe symptoms in natural language

***AI analyzes and returns:***
- Possible condition
- Severity level
- Emergency requirement

***API:***
POST /api/ai/health

**🚑 Emergency Resource Search**

***Search nearby emergency resources:***
- Hospitals
- Blood banks
- Pharmacies
- Ambulances

***Location-based results using:***
- Address → latitude/longitude
- OpenStreetMap (Nominatim + Overpass API)
- Graceful fallback when no resources are found

***API:***
POST /api/ai/search

**🏥 Resource Registration (Public)**
- Hospitals / Blood Banks can register themselves
- Resources are stored as unverified by default
- Visible to users only after admin approval

***API:***
POST /api/emergency/add/resource

### 🛠 Admin Features

**🔐 Admin Authentication**
- JWT-based login system
- Protected routes using Adminauth middleware

***APIs:***
POST /api/admin/login
GET  /api/admin/me

**📊 Admin Dashboard**
- View all submitted resource requests
- See resource details with reverse-geocoded addresses
- Approve or reject emergency resources

## 🧠 Resource Verification Status

 | Status    | Meaning                        |
| --------- | ------------------------------ |
| `unknown` | Newly added resource (default) |
| `open`    | Approved & visible to users    |
| `closed`  | Temporarily unavailable        |

## 🧰 Technologies Used

- **Backend:** Node.js, Express.js, MongoDB, Mongoose    
- **Authentication:** JWT  
- **Frontend:** React.js, React Router, Axios, Tailwind CSS  
- **Environment variables management:** dotenv  

---

## Installation

**Clone the repository**

```bash

git clone https://github.com/Snigdha-Sadhu/MediAssist.git
cd MediAssist

```
**Backend setup**

```bash
cd server
npm install

```

**Create a .env file in the server folder and add your environment variables**
```env
PORT=7000
MONGO_URL=<your_mongodb_connection_string>
JWT_SECRET=<your_jwt_secret>
CLIENT_URL=http://localhost:5173
GEMINI_API_KEY=<your_API_key>
ADMIN_EMAIL=<your-real-email@gmail.com>
ADMIN_PASSWORD=<your-real-strong-password>

```

**Start the backend server:**
```bash
npm run dev
```
**Frontend setup**
```bash
cd client
npm install
npm run dev

```

Open your browser and go to http://localhost:5173
to use the app.

---


## Folder Structure

/server - Backend Express API 
/client - React frontend application

---

## 📡 API Routes Summary

**🧠 AI Routes (/api/ai)**
POST /health   → AI symptom analysis
POST /search
**🚑 Emergency Routes (/api/emergency)**

POST /add/resource

**🧾 Admin Request Routes (/api/request)**
GET    /received        (Admin only)
PATCH  /:id             (Admin only)
GET    /reverse-geocode

**🔐 Admin Routes (/api/admin)**
POST /login
GET  /me    (Admin only)

## 🗄 Database Schema (Emergency Resource)
```js 
{
  name: String,
  type: "hospital | pharmacy | blood | ambulance",
  phone: String,
  verified: "open | closed | unknown",
  location: {
    type: "Point",
    coordinates: [longitude, latitude]
  }
}

```
📌 MongoDB GeoJSON with $near queries
📌 Coordinates format: [longitude, latitude]

## ⚠️ Important Notes

- Addresses are derived using reverse geocoding
- Small towns may return empty OSM results (handled gracefully)
- Only open (verified) resources appear in user searches


## 📈 Future Enhancements
- Multi-admin roles
- Rate limiting & caching
- Notifications (SMS / Email)
- Analytics dashboard

## 👨‍💻 Author
Snigdha Sadhu
Full-Stack MERN Developer | AI Emergency Systems