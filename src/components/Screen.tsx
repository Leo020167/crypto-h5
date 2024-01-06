import { NavBar, NavBarProps } from 'antd-mobile';
import React, { useCallback } from 'react';
import { useHistory } from 'react-router-dom';

interface ScreenProps {
  className?: string;
  headerTitle?: React.ReactNode;
  navBarProps?: NavBarProps;
  children?: React.ReactNode;
  right?: React.ReactNode;
  footer?: React.ReactNode;
}

const Screen = ({
  className,
  headerTitle,
  navBarProps = {},
  children,
  right,
  footer,
}: ScreenProps) => {
  const history = useHistory();
  const handleBack = useCallback(() => history.goBack(), [history]);
  return (
    <div
      className={`flex h-screen w-screen flex-col bg-white dark:bg-[#161720] ${className ?? ''}`}
    >
      <NavBar onBack={handleBack} right={right} {...navBarProps}>
        {headerTitle}
      </NavBar>
      <div className="flex min-h-0 flex-1 flex-col">{children}</div>
      {footer}
    </div>
  );
};

export default Screen;
