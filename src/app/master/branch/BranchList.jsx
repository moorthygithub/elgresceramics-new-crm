import Page from "@/app/dashboard/page";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Input } from "@/components/ui/input";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { useQuery } from "@tanstack/react-query";
import {
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  useReactTable,
} from "@tanstack/react-table";
import axios from "axios";
import { ChevronDown, Search } from "lucide-react";
import { useState } from "react";
import { useNavigate } from "react-router-dom";

import { BRANCH_LIST } from "@/api";
import Loader from "@/components/loader/Loader";
import { ButtonConfig } from "@/config/ButtonConfig";
// import CreateBuyer from "./CreateBuyer";
// import EditBuyer from "./EditBuyer ";

const BranchList = () => {
  const {
    data: branch,
    isLoading,
    isError,
    refetch,
  } = useQuery({
    queryKey: ["branchs"],
    queryFn: async () => {
      const token = localStorage.getItem("token");
      const response = await axios.get(`${BRANCH_LIST}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      return response.data.branch;
    },
  });

  // State for table management
  const [sorting, setSorting] = useState([]);
  const [columnFilters, setColumnFilters] = useState([]);
  const [columnVisibility, setColumnVisibility] = useState({});
  const [rowSelection, setRowSelection] = useState({});
  const [searchQuery, setSearchQuery] = useState("");

  // Define columns for the table
  const columns = [
    {
      accessorKey: "index",
      header: "Sl No",
      cell: ({ row }) => <div>{row.index + 1}</div>,
    },

    {
      accessorKey: "branch_name",
      header: "Branch Name",
      cell: ({ row }) => <div>{row.getValue("branch_name")}</div>,
    },
    {
      accessorKey: "branch_whatsapp",
      header: "Whatsapp",
      cell: ({ row }) => <div>{row.getValue("branch_whatsapp")}</div>,
    },
    {
      accessorKey: "branch_email",
      header: "Email",
      cell: ({ row }) => <div>{row.getValue("branch_email")}</div>,
    },

    {
      accessorKey: "branch_status",
      header: "Status",
      cell: ({ row }) => {
        const status = row.getValue("branch_status");

        return (
          <span
            className={`px-2 py-1 rounded text-xs ${
              status == "Active"
                ? "bg-green-100 text-green-800"
                : "bg-gray-100 text-gray-800"
            }`}
          >
            {status}
          </span>
        );
      },
    },
    // {
    //   id: "actions",
    //   header: "Action",
    //   cell: ({ row }) => {
    //     const buyerId = row.original.id;

    //     return (
    //       <div className="flex flex-row">
    //         <EditBuyer buyerId={buyerId} />
    //       </div>
    //     );
    //   },
    // },
  ];
  const filteredItems =
    branch?.filter((item) =>
      item.branch_name.toLowerCase().includes(searchQuery.toLowerCase())
    ) || [];
  // Create the table instance
  const table = useReactTable({
    data: branch || [],
    columns,
    onSortingChange: setSorting,
    onColumnFiltersChange: setColumnFilters,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    onColumnVisibilityChange: setColumnVisibility,
    onRowSelectionChange: setRowSelection,
    state: {
      sorting,
      columnFilters,
      columnVisibility,
      rowSelection,
    },
    initialState: {
      pagination: {
        pageSize: 7,
      },
    },
  });

  // Render loading state
  if (isLoading) {
    return (
      <Page>
        <div className="flex justify-center items-center h-full">
          <Loader />
        </div>
      </Page>
    );
  }

  // Render error state
  if (isError) {
    return (
      <Page>
        <Card className="w-full max-w-md mx-auto mt-10">
          <CardHeader>
            <CardTitle className="text-destructive">
              Error Fetching Buyer
            </CardTitle>
          </CardHeader>
          <CardContent>
            <Button onClick={() => refetch()} variant="outline">
              Try Again
            </Button>
          </CardContent>
        </Card>
      </Page>
    );
  }

  return (
    <Page>
      <div className="w-full p-0 md:p-4 grid grid-cols-1">
        <div className="sm:hidden">
          <div className="flex justify-between items-center mb-4">
            <h1 className="text-xl md:text-2xl text-gray-800 font-medium">
              Buyer List
            </h1>
            {/* <div>
              <CreateBuyer />
            </div> */}
          </div>

          <div className="flex flex-col md:flex-row md:items-center py-4 gap-2">
            {/* Search Input */}
            <div className="relative w-full md:w-72">
              <Search className="absolute left-2 top-2.5 h-4 w-4 text-gray-500" />
              <Input
                placeholder="Search buyer..."
                value={searchQuery}
                onChange={(event) => setSearchQuery(event.target.value)}
                className="pl-8 bg-gray-50 border-gray-200 focus:border-gray-300 focus:ring-gray-200 w-full"
              />
            </div>
          </div>

          <div className="space-y-3">
            {filteredItems.length > 0 ? (
              filteredItems.map((item, index) => (
                <div
                  key={item.id}
                  className="relative bg-white rounded-lg shadow-sm border-l-4 border-r border-b border-t border-yellow-500 overflow-hidden"
                >
                  <div className="p-2 flex flex-col gap-2">
                    {/* Sl No and Item Name */}
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-2">
                        <div className="bg-gray-100 text-gray-600 rounded-full w-4 h-4 flex items-center justify-center text-xs font-medium">
                          {index + 1}
                        </div>
                        <h3 className="font-medium flex flex-col text-sm text-gray-800">
                          <span>{item.branch_name}</span>
                          {/* <span className="text-xs">{item.buyer_city}</span> */}
                        </h3>
                      </div>
                      <div className="flex items-center justify-between gap-2 ">
                        <span
                          className={`px-2 py-1 rounded-full text-xs font-medium ${
                            item.branch_status === "Active"
                              ? "bg-green-100 text-green-800"
                              : "bg-gray-100 text-gray-800"
                          }`}
                        >
                          {item.branch_status}
                        </span>

                        {/* <EditBuyer buyerId={item.id} /> */}
                      </div>
                    </div>
                    <div className="flex flex-wrap justify-between gap-1">
                      {item.branch_whatsapp && (
                        <div className="inline-flex items-center bg-green-100 rounded-full px-2 py-1">
                          {/* <svg
                            xmlns="http://www.w3.org/2000/svg"
                            width="14"
                            height="14"
                            viewBox="0 0 24 24"
                            fill="currentColor"
                            className="text-green-600 mr-1"
                          >
                            <path d="M20.52 3.48a11.87 11.87 0 0 0-16.8 0 11.87 11.87 0 0 0-2.55 13.06L0 24l7.47-1.97a11.87 11.87 0 0 0 13.05-2.55 11.87 11.87 0 0 0 0-16.8Zm-8.52 16c-2.1 0-4.08-.61-5.78-1.77l-.41-.27-4.43 1.17 1.17-4.42-.27-.42A8.73 8.73 0 0 1 4 5.48 8.68 8.68 0 0 1 12 3a8.67 8.67 0 0 1 8.7 8.7 8.67 8.67 0 0 1-8.7 8.7Zm4.9-6.59c-.27-.13-1.6-.79-1.85-.88s-.43-.13-.61.13-.7.88-.86 1.06-.32.2-.59.07a7.13 7.13 0 0 1-2.09-1.29 7.8 7.8 0 0 1-1.45-1.78c-.15-.26-.01-.4.12-.52.12-.12.26-.3.39-.45.13-.15.17-.26.26-.43.09-.17.04-.33-.02-.45s-.61-1.47-.84-2c-.22-.53-.45-.46-.61-.47h-.52c-.17 0-.45.06-.69.33s-.9.88-.9 2.14.92 2.48 1.04 2.66a9.58 9.58 0 0 0 3.44 3.24c.48.22.86.35 1.16.45.49.16.93.14 1.28.08.39-.06 1.2-.49 1.37-.97s.17-.88.12-.97c-.06-.09-.22-.13-.49-.26Z" />
                          </svg> */}
                          <svg
                            class="w-[12px] h-[12px] text-green-800 dark:text-white"
                            aria-hidden="true"
                            xmlns="http://www.w3.org/2000/svg"
                            width="24"
                            height="24"
                            fill="none"
                            viewBox="0 0 24 24"
                          >
                            <path
                              fill="currentColor"
                              fill-rule="evenodd"
                              d="M12 4a8 8 0 0 0-6.895 12.06l.569.718-.697 2.359 2.32-.648.379.243A8 8 0 1 0 12 4ZM2 12C2 6.477 6.477 2 12 2s10 4.477 10 10-4.477 10-10 10a9.96 9.96 0 0 1-5.016-1.347l-4.948 1.382 1.426-4.829-.006-.007-.033-.055A9.958 9.958 0 0 1 2 12Z"
                              clip-rule="evenodd"
                            />
                            <path
                              fill="currentColor"
                              d="M16.735 13.492c-.038-.018-1.497-.736-1.756-.83a1.008 1.008 0 0 0-.34-.075c-.196 0-.362.098-.49.291-.146.217-.587.732-.723.886-.018.02-.042.045-.057.045-.013 0-.239-.093-.307-.123-1.564-.68-2.751-2.313-2.914-2.589-.023-.04-.024-.057-.024-.057.005-.021.058-.074.085-.101.08-.079.166-.182.249-.283l.117-.14c.121-.14.175-.25.237-.375l.033-.066a.68.68 0 0 0-.02-.64c-.034-.069-.65-1.555-.715-1.711-.158-.377-.366-.552-.655-.552-.027 0 0 0-.112.005-.137.005-.883.104-1.213.311-.35.22-.94.924-.94 2.16 0 1.112.705 2.162 1.008 2.561l.041.06c1.161 1.695 2.608 2.951 4.074 3.537 1.412.564 2.081.63 2.461.63.16 0 .288-.013.4-.024l.072-.007c.488-.043 1.56-.599 1.804-1.276.192-.534.243-1.117.115-1.329-.088-.144-.239-.216-.43-.308Z"
                            />
                          </svg>

                          <span className="text-xs text-green-700">
                            {item.branch_whatsapp}
                          </span>
                        </div>
                      )}

                      {item.branch_email && (
                        <div className="inline-flex items-center bg-gray-100 rounded-full px-2 py-1">
                          <svg
                            class="w-[12px] h-[12px] text-gray-800 dark:text-white"
                            aria-hidden="true"
                            xmlns="http://www.w3.org/2000/svg"
                            width="24"
                            height="24"
                            fill="currentColor"
                            viewBox="0 0 24 24"
                          >
                            <path d="M17 6h-2V5h1a1 1 0 1 0 0-2h-2a1 1 0 0 0-1 1v2h-.541A5.965 5.965 0 0 1 14 10v4a1 1 0 1 1-2 0v-4c0-2.206-1.794-4-4-4-.075 0-.148.012-.22.028C7.686 6.022 7.596 6 7.5 6A4.505 4.505 0 0 0 3 10.5V16a1 1 0 0 0 1 1h7v3a1 1 0 0 0 1 1h2a1 1 0 0 0 1-1v-3h5a1 1 0 0 0 1-1v-6c0-2.206-1.794-4-4-4Zm-9 8.5H7a1 1 0 1 1 0-2h1a1 1 0 1 1 0 2Z" />
                          </svg>

                          <span className="text-xs text-gray-700">
                            {/* <span className="text-[10px]">Email:</span> */}
                            {item.branch_email}
                          </span>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              ))
            ) : (
              <div className="bg-white rounded-lg shadow-sm border border-gray-100 p-6 text-center text-gray-500">
                No items found.
              </div>
            )}
          </div>
        </div>

        <div className="hidden sm:block">
          <div className="flex text-left text-2xl text-gray-800 font-[400]">
            Buyer List
          </div>

          <div className="flex flex-col md:flex-row md:items-center py-4 gap-2">
            {/* Search Input */}
            <div className="relative w-full md:w-72">
              <Search className="absolute left-2 top-2.5 h-4 w-4 text-gray-500" />
              <Input
                placeholder="Search buyer..."
                value={table.getState().globalFilter || ""}
                onChange={(event) => table.setGlobalFilter(event.target.value)}
                className="pl-8 bg-gray-50 border-gray-200 focus:border-gray-300 focus:ring-gray-200 w-full"
              />
            </div>

            {/* Dropdown Menu & Sales Button */}
            <div className="flex flex-col md:flex-row md:ml-auto gap-2 w-full md:w-auto">
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="outline" className="w-full md:w-auto">
                    Columns <ChevronDown className="ml-2 h-4 w-4" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  {table
                    .getAllColumns()
                    .filter((column) => column.getCanHide())
                    .map((column) => (
                      <DropdownMenuCheckboxItem
                        key={column.id}
                        className="capitalize"
                        checked={column.getIsVisible()}
                        onCheckedChange={(value) =>
                          column.toggleVisibility(!!value)
                        }
                      >
                        {column.id}
                      </DropdownMenuCheckboxItem>
                    ))}
                </DropdownMenuContent>
              </DropdownMenu>

              {/* <CreateBuyer /> */}
            </div>
          </div>
          {/* table  */}
          <div className="rounded-md border">
            <Table>
              <TableHeader>
                {table.getHeaderGroups().map((headerGroup) => (
                  <TableRow key={headerGroup.id}>
                    {headerGroup.headers.map((header) => {
                      return (
                        <TableHead
                          key={header.id}
                          className={` ${ButtonConfig.tableHeader} ${ButtonConfig.tableLabel}`}
                        >
                          {header.isPlaceholder
                            ? null
                            : flexRender(
                                header.column.columnDef.header,
                                header.getContext()
                              )}
                        </TableHead>
                      );
                    })}
                  </TableRow>
                ))}
              </TableHeader>
              <TableBody>
                {table.getRowModel().rows?.length ? (
                  table.getRowModel().rows.map((row) => (
                    <TableRow
                      key={row.id}
                      data-state={row.getIsSelected() && "selected"}
                    >
                      {row.getVisibleCells().map((cell) => (
                        <TableCell key={cell.id}>
                          {flexRender(
                            cell.column.columnDef.cell,
                            cell.getContext()
                          )}
                        </TableCell>
                      ))}
                    </TableRow>
                  ))
                ) : (
                  <TableRow>
                    <TableCell
                      colSpan={columns.length}
                      className="h-24 text-center"
                    >
                      No results.
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </div>
          {/* row slection and pagintaion button  */}
          <div className="flex items-center justify-end space-x-2 py-4">
            <div className="flex-1 text-sm text-muted-foreground">
              Total Buyer : &nbsp;
              {table.getFilteredRowModel().rows.length}
            </div>
            <div className="space-x-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => table.previousPage()}
                disabled={!table.getCanPreviousPage()}
              >
                Previous
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => table.nextPage()}
                disabled={!table.getCanNextPage()}
              >
                Next
              </Button>
            </div>
          </div>
        </div>
      </div>
    </Page>
  );
};

export default BranchList;
