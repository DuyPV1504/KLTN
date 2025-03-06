export const Table = ({ children }) => <table className="w-full border">{children}</table>;

export const TableHeader = ({ children }) => <thead className="bg-gray-200">{children}</thead>;

export const TableRow = ({ children }) => <tr className="border-b">{children}</tr>;

export const TableHead = ({ children }) => <th className="p-2 text-left">{children}</th>;

export const TableBody = ({ children }) => <tbody>{children}</tbody>;

export const TableCell = ({ children }) => <td className="p-2">{children}</td>;
