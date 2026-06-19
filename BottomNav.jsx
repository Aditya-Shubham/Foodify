import React from "react";
import { NavLink } from "react-router-dom";


const BottomNav = () => {
  return (
          <>
         
                <div className="bottom-nav">
                
                               <NavLink to={'/home'} className={'nav-item'}> 🏠︎ Home</NavLink>
                               <NavLink to={'/orders'} className={'nav-item'}>≡ Menu</NavLink>
                               <NavLink to={'/cart'} className={'nav-item'}>🛒 Cart</NavLink>
                             
                   
               </div>
         
          </>
         )
}

export default BottomNav