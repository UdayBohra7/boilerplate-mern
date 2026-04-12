import { Table } from "@/components/Elements/Table/Table";

const LatestUsersTable = () => {
  const columns = [
    { header: "Sr. No.", field: "id" },
    { header: " Name", field: "name" },
    { header: "Email Address", field: "email" },
    { header: "Phone", field: "phone" },
    { header: "Signup Date", field: "date" },
    { header: "Last Activity", field: "activity" },
    { header: "Actions", field: "actions" }, 
  ];

  const rows = [
    {
      id: 1,
      name: "Mark",
      email: "johnsmith@nomail.com",
      phone: "+1 345 6789 432",
      date: "20 July, 2025",
      activity: "Online",
      actions: (
        <div className="action-buttons d-flex gap-2 align-items-center">
          <button className="edit-btn bg-transparent p-0 border-0"><i className="fa-solid fa-pen lighttxt"></i></button>
          <button className="delete-btn bg-transparent p-0 border-0"><i className="fa-solid fa-trash lighttxt"></i></button>
        </div>
      ),
    },
  ];
  return (
    <div className="admin-table table-card">
      <div className="table-header border-btm p-3">
        <h3 className="text-white f-16 font-medium mb-0">Latest User</h3>
      </div>
      <div className="admin-user">
        <Table pagination={true} columns={columns} rows={rows} />
      </div>
    </div>
  );
};

export default LatestUsersTable;
