import React, { type ReactNode } from "react";

type PublicLayoutProps = {
  children: ReactNode;
};

const PublicLayout: React.FC<PublicLayoutProps> = ({ children }) => {
  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <div className="w-full max-w-md p-6 bg-white rounded shadow">
        {children}
      </div>
    </div>
  );
};

export default PublicLayout;