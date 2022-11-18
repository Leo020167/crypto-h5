import { NavBar, NavBarProps } from 'antd-mobile';
import React, { useCallback } from 'react';
import { useNavigate } from 'react-router-dom';

interface ScreenProps {
  headerTitle?: string;
  navBarProps?: NavBarProps;
  children?: React.ReactNode;
  footer?: React.ReactNode;
}

const Screen = ({ headerTitle, navBarProps = {}, children, footer }: ScreenProps) => {
  const navigate = useNavigate();
  const handleBack = useCallback(() => navigate(-1), [navigate]);
  return (
    <div className="flex flex-col h-screen bg-white">
      <NavBar onBack={handleBack} {...navBarProps}>
        {headerTitle}
      </NavBar>
      <div className="flex-1">{children}</div>
      {footer}
    </div>
  );
};

export default Screen;
