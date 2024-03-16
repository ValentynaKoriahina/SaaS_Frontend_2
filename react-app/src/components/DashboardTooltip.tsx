import React from 'react';

interface DashboardTooltipProps {
  title: string;
}

const DashboardTooltip: React.FC<DashboardTooltipProps> = ({ title }) => (
  <img
    className="dashboard-tooltip"
    src="/question_mark.png" 
    style={{ marginLeft: '8px' }}
    width="16"
    height="16"
    alt="?"
    title={title}
  />
);



export default DashboardTooltip;