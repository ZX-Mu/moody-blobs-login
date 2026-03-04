// 黄色拱形角色 — 视线灵敏，反应适中
const YellowCylinder = () => (
  <svg width="120" height="180" viewBox="0 0 110 160" xmlns="http://www.w3.org/2000/svg" aria-hidden="true" style={{ display: 'block' }}>
    <ellipse cx="55" cy="55" rx="50" ry="50" fill="#F5C842" />
    <rect x="5" y="55" width="100" height="100" fill="#F5C842" />
    <circle cx="32" cy="52" r="18" fill="white" />
    <circle cx="32" cy="55" r="9" fill="#1a1a1a" />
    <circle cx="74" cy="52" r="18" fill="white" />
    <circle cx="74" cy="55" r="9" fill="#1a1a1a" />
    <circle cx="55" cy="95" r="5" fill="#1a1a1a" />
  </svg>
);

export default YellowCylinder;
