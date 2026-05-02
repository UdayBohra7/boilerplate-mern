import { Table } from "@/components/Elements/Table/Table";

const LatestUsersTable = () => {
  const columns = [
    { header: "User", field: "user" },
    { header: "Email Address", field: "email" },
    { header: "Contact", field: "phone" },
    { header: "Joined On", field: "date" },
    { header: "Status", field: "activity" },
    { header: "Actions", field: "actions" }, 
  ];

  const rows = [
    {
      id: 1,
      user: (
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-full bg-blue-50 flex items-center justify-center text-blue-600 font-bold text-xs border border-blue-100">M</div>
          <span className="font-bold text-gray-900 text-sm">Mark Robinson</span>
        </div>
      ),
      email: <span className="text-gray-500 font-medium">johnsmith@nomail.com</span>,
      phone: <span className="text-gray-500 font-medium">+1 345 6789 432</span>,
      date: <span className="text-[10px] font-black text-gray-400 uppercase tracking-tighter">20 July, 2025</span>,
      activity: (
        <div className="flex items-center gap-2">
          <span className="w-1.5 h-1.5 rounded-full bg-green-500"></span>
          <span className="text-xs font-bold text-green-700 uppercase tracking-widest">Online</span>
        </div>
      ),
      actions: (
        <div className="flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
          <button className="w-8 h-8 flex items-center justify-center rounded-lg bg-gray-50 text-gray-400 hover:bg-blue-50 hover:text-blue-600 transition-all border border-transparent hover:border-blue-100">
            <i className="fa-solid fa-pen text-[10px]"></i>
          </button>
          <button className="w-8 h-8 flex items-center justify-center rounded-lg bg-gray-50 text-gray-400 hover:bg-rose-50 hover:text-rose-600 transition-all border border-transparent hover:border-rose-100">
            <i className="fa-solid fa-trash-can text-[10px]"></i>
          </button>
        </div>
      ),
    },
  ];

  return (
    <div className="bg-white rounded-3xl border border-gray-100 shadow-xl shadow-gray-200/20 overflow-hidden">
      <div className="px-6 py-5 border-b border-gray-100 bg-gray-50/50 flex justify-between items-center">
        <h3 className="text-sm font-black text-gray-900 uppercase tracking-widest">Recent Acquisitions</h3>
        <button className="text-[10px] font-black text-blue-600 uppercase tracking-widest hover:underline decoration-2 underline-offset-4">View All Members</button>
      </div>
      <div className="p-2">
        <Table pagination={false} columns={columns} rows={rows} />
      </div>
    </div>
  );
};

export default LatestUsersTable;
