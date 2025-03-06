export const Button = ({ children, className, ...props }) => (
    <button className={`px-4 py-2 rounded text-white font-medium ${className}`} {...props}>
      {children}
    </button>
  );
  