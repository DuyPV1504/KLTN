export const Input = ({ className, ...props }) => (
    <input
      className={`w-full border p-2 rounded focus:ring focus:ring-blue-300 ${className}`}
      {...props}
    />
  );
  