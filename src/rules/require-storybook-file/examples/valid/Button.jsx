// ✅ Valid: This component has a Storybook file next to it
export const Button = ({ onClick, children }) => {
  return <button onClick={onClick}>{children}</button>;
};
