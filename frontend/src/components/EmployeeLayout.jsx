import React from 'react';
import { Outlet } from 'react-router-dom';
import Navbar from './Navbar';
import EmployeeSidebar from './EmployeeSidebar';

const EmployeeLayout = () => {
  return (
    <div className="d-flex flex-column min-vh-100 bg-light">
      <Navbar />
      <div className="d-flex flex-grow-1">
        <EmployeeSidebar />
        <main className="flex-grow-1 p-4 overflow-auto">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default EmployeeLayout;
