export const Tabs = ({ children, className }) => <div className={className}>{children}</div>;

export const TabsList = ({ children, className }) => (
  <div className={`flex border-b ${className}`}>{children}</div>
);

export const TabsTrigger = ({ children, value, onClick }) => (
  <button onClick={onClick} className="px-4 py-2 font-medium hover:bg-gray-200">
    {children}
  </button>
);

export const TabsContent = ({ children, value, activeTab }) =>
  value === activeTab ? <div className="p-4">{children}</div> : null;
