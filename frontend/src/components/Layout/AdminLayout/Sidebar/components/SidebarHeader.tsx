import styled from "@emotion/styled";
import React from "react";
import logo from "@/assets/logo.svg"
interface SidebarHeaderProps extends React.HTMLAttributes<HTMLDivElement> {
  children?: React.ReactNode;
}

const StyledSidebarHeader = styled.div`
  min-height: 80px;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 20px;

  > div {
    width: 100%;
    text-align: center;
  }
`;



export const SidebarHeader: React.FC<SidebarHeaderProps> = ({
  children,
  ...rest
}) => {
  return (
    <StyledSidebarHeader {...rest}>
      <div className="sidebar-logo">
       <img src={logo} className="admin-side-logo" height={60} />
      </div>
    </StyledSidebarHeader>
  );
};
