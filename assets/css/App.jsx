/*project*/
/*
import React, { useState } from "react";
import { BrowserRouter, Routes, Route,useLocation,useNavigate } from "react-router-dom";
import TopBar from "./pages/TopBar";
import BottomNav from "./pages/BottomNav";
import "./assets/css/style.css";

import Profile from "./pages/Profile";
import Home from "./pages/Home";
import Orders from "./pages/Orders";
import Cart from "./pages/Cart";
import Signup from "./pages/Signup";
import Admin from "./pages/admin/Admin";

function App() {
  // Cart state
  const [cart, setCart] = useState([]);

  // Function to add item to cart
  const addToCart = (item) => {
    setCart([...cart, item]);
  };

  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/orders" element={<Orders addToCart={addToCart} />} />
        <Route path="/cart" element={<Cart cart={cart} />} />
        <Route path="/profile" element={<Profile />} />
      </Routes>

      <BottomNav />
    </BrowserRouter>
  );
}

export default App;*/


import React, { useState } from "react";
import { BrowserRouter, Routes, Route, useLocation, useNavigate } from "react-router-dom";
import TopBar from "./pages/TopBar";
import BottomNav from "./pages/BottomNav";
import "./assets/css/style.css";

import Profile from "./pages/Profile";
import Home from "./pages/Home";
import Orders from "./pages/Orders";
import Cart from "./pages/Cart";
import Signup from "./pages/Signup";
import Admin from "./pages/admin/Admin";

function Layout({ cart, addToCart }) {
  const location = useLocation();
  return (
    <>
      <Routes>
        <Route path="/" element={<Signup />} />
        <Route path="/home" element={<Home addToCart={addToCart} />} />
        <Route path="/orders" element={<Orders addToCart={addToCart} />} />
        <Route path="/cart" element={<Cart cart={cart} />} />
        <Route path="/profile" element={<Profile />} />
        <Route path="/admin" element={<Admin />} />
      </Routes>

      {/* Show BottomNav everywhere except signup */}
      {location.pathname !== "/" && <BottomNav />}
    </>
  );
}

function App() {
  const [cart, setCart] = useState([]);

  const addToCart = (item) => {
    setCart([...cart, item]);
  };

  return (
    <BrowserRouter>
      <Layout cart={cart} addToCart={addToCart} />
    </BrowserRouter>
  );
}

export default App;







/*
import React from 'react'
import './index.css';
// import First from './components/First';

import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import About from './components/About';
import Gallery from './components/Gallery';
import Contact from './components/Contact';
import Admission from './components/Admission';
import Registration from './components/Registeration';

function App() {
  return (
    <>
      {/* <First /> *//*}
     
      <Router>
        <Routes>
          <Route path='/' element={<Navbar />}></Route>
          <Route path='/About' element={<About />}></Route>
          <Route path='/Gallery' element={<Gallery />}></Route>
          <Route path='/Contact' element={<Contact />}></Route>
          <Route path='/Registration' element={<Registration />}></Route>
          <Route path='/Admission' element={<Admission />}></Route>
        </Routes>
      </Router>
    </>
  )
}


export default App*/






/*import React from 'react'
import './App.css';
import ProductCard from './components/ProductCard';


function App() {
  return (
    <>
  
 <ProductCard
        title = "Mobile"
        price = {5000}
        inStock = {false}
      />
    </>
  )
}


export default App*/

/*
import React from 'react'
import './App.css';
import ProductCard from './components/ProductCard';


function App() {
  return (
    <>
  
 <ProductCard
        title = "Mobile"
        price = {5000}
        inStock = {false}
      />
    </>
  )
}


export default App*/

/*import React from "react";
import NetflixCard from "./components/NetflixCard";

const NetflixList = () => {
  return (
    <div className="netflix-container">
      <h2>All Netflix Series Download from here</h2>

      <div className="netflix-grid">
        <NetflixCard
          img="public/2.jpg"
          name="Kung Fu Panda"
          description="Sci-Fi Thriller"
        />

        <NetflixCard
          img="public/3.jpg"
          name="Squid Games S1"
          description="Crime Drama"
        />

        <NetflixCard
          img="public/4.jpg"
          name="Squid Games S2"
          description="Mystery Horror"
        />

        <NetflixCard
          img="public/5.webp"
          name="Jawan"
          description="Crime Series"
        />

        <NetflixCard
          img="public/ghost.jpg"
          name="Ghost"
          description="Fantasy Crime"
        />

        <NetflixCard
          img="public/Lucifer.webp"
          name="Lucifer"
          description="Historical Drama"
        />

        <NetflixCard
          img="public/7.jpg"
          name="The Railway men"
          description="Crime Thriller"
        />

        <NetflixCard
          img="public/8.jpeg"
          name="Young Sheldon"
          description="Comic"
        />
      </div>
    </div>
  );
};

export default NetflixList;      */









/*function First(){
  return(
    <>
      <h1>Hello!</h1>
    </>
  )
}
function Second(){
  return(
    <>
      <h2>my name is Aditya Shubham Kachhap</h2>
    </>
  )
}
function Third(){
  return(
    <>
      <h2>today 's date is 24th november 2025</h2>
    </>
  )
}
function Forth(){
  return(
    <>
      <h2>How are you all ?</h2>
    </>
  )
}
function Fifth(){
  return(
    <>
      <h2>Hope you all are doing well</h2>
    </>
  )
}
function Six() {
  return (
    <><head>
        <title>Aditya Shubham Kachhap- Resume</title>
        <link rel="stylesheet" href="styleR.css" />
      </head>

      <body>
        <div className="resume">
          <div className="header">
            <div className="left-header">
              <div className="profile-pic">
                <img src="src\profile.png"
                   alt="Profile Picture"
                />
              </div>

              <div>
                <div className="name">Aditya Shubham Kachhap</div>
                <div className="title">Full Stack Developer</div>
              </div>
            </div>

            <div className="contact">
              <div><strong>Phone:</strong> 7482850810</div>
              <div><strong>Email:</strong> adityakachhap32@gmail.com</div>
              <div><strong>Course:</strong> Bsc.Computer applications</div>
              <div><strong>College:</strong> St. Xavier’s College,Ranchi</div>
            </div>
          </div>

          <div className="content">
            <div className="section">
              <div className="section-title">Summary</div>
              <p>
                Aspiring MERN Stack Developer seeking internship opportunities to enhance practical skills in full-stack development. Knowledgeable in React for UI, Node & Express for server-side programming, and MongoDB for NoSQL database operations.
              </p>
            </div>

            <div className="section">
              <div className="section-title">Skill Highlights</div>

              <div className="skills">
                <ul>
                  <li>MERN Stack Development</li>
                  <li>JavaScript(ES6+)</li>
                  <li>REST API Development</li>
                </ul>

                <ul>
                  <li>React.js</li>
                  <li>MongoDB </li>
                  <li>Git & GitHub</li>
                </ul>
              </div>
            </div>

<div className="section">
              <div className="section-title">Projects</div>
  <article>
    <h3>Student Management System (MERN)</h3>
    <p><strong>Jan 2025 • Personal Project</strong></p>
    <p>
      Built a CRUD web application to manage student records with secure login and dashboard.
    </p>
    <ul>
      <li>Developed frontend using React.js with Hooks and Context API.</li>
      <li>Created backend REST APIs using Node.js and Express.js with JWT authentication.</li>
      <li>Used MongoDB & Mongoose for database schema and data storage.</li>
    </ul>
    <p>
      <a href="#">GitHub</a> • <a href="#">Live Demo</a>
    </p>
  </article>

  <article>
    <h3>E-Commerce UI (React)</h3>
    <p><strong>Oct 2024 • College Project</strong></p>
    <p>
      Designed a responsive product display and cart management system.
    </p>
    <ul>
      <li>Implemented routing, search filter, and reusable UI components.</li>
      <li>Managed global cart state using Context API and localStorage persistence.</li>
      <li>Focus on mobile-first responsive design for better user experience.</li>
    </ul>
    <p>
      <a href="#">GitHub</a> • <a href="#">Live Demo</a>
    </p>
  </article>
</div>
            

            <div className="section">
              <div className="section-title">Education</div>
              <p>
                <strong>BCA</strong> – St. Xavier’s College
                <br />
                Expected Graduation: 2026
              </p>
              <p>
                <strong>Class 12(ISC)</strong> –Don Bosco School,Kokar,Ranchi
                <br />
                Completed: 2023
                <br/>
                percentage:86.5
              </p>
              <p>
                <strong>Class 10(ICSE)</strong> –Don Bosco School,Kokar,Ranchi
                <br />
                Completed: 2021
                <br/>
                percentage:85
              </p>
            </div>

            <div className="section">
              <div className="section-title">Languages</div>
              <ul>
              <li><p>English </p></li>
              <li><p>Hindi </p></li>
              </ul>
              
            </div>

            <div className="section">
              <div className="section-title">Interests</div>
              <ul>
                <li><p>Chess</p></li>
                <li><p>Table Tennis</p></li>
              </ul>
              
            </div>
          </div>

          <div className="footer"></div>
        </div>

        <script src="script.js"></script>
      </body>
    </>
  );
}
   /*import First from './components/First'
import Second from './components/Secont'
import Third from './components/Third'
import Fourth from './components/Fourth'
import Fifth from './components/Fifth'
import {First,Second,Third} from './components/Six'
import Seven from './components/seven'
import Fourteen from './components/Fourteen'*/

