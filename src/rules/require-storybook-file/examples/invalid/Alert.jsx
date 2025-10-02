// ❌ Invalid: This component does not have a Storybook file
export const Alert = ({ message, type = 'info' }) => {
  return <div className={`alert alert-${type}`}>{message}</div>;
};
