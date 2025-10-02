// ✅ Valid: This TypeScript component has a Storybook file next to it
interface CardProps {
  title: string;
  content: string;
}

export const Card = ({ title, content }: CardProps) => {
  return (
    <div>
      <h3>{title}</h3>
      <p>{content}</p>
    </div>
  );
};
