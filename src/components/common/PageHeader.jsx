import React from 'react';

const PageHeader = ({ 
  title, 
  subtitle, 
  className = "page-header" 
}) => {
  return (
    <div className={className}>
      <h1>{title}</h1>
      {subtitle && <p>{subtitle}</p>}
    </div>
  );
};

export default PageHeader;
