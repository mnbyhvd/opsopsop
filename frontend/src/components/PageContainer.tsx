import React from 'react';

interface PageContainerProps {
  children: React.ReactNode;
  className?: string;
  style?: React.CSSProperties;
}

const PageContainer: React.FC<PageContainerProps> = ({ 
  children, 
  className = '', 
  style = {} 
}) => {
  return (
    <div className={`container ${className}`} style={style}>
      <div className="grid grid-cols-12">
        {children}
      </div>
    </div>
  );
};

export default PageContainer;
