import React, { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { AddReceivedModal } from "@/components/modal/AddReceivedModal";
import { useDispatch, useSelector } from "react-redux";
import { toast } from "sonner";
import {
  fetchReceives,
  addReceive,
  deleteReceive,
  updateReceive,
} from "@/redux/admin/receive-slice";
import { ReceiveTable } from "@/components/ReceiveTable";
import { Search } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import CustomPagination from "@/components/CustomPagination";

const Receives = () => {
  const dispatch = useDispatch();
  const { receives, pagination, isLoading, actionLoading } = useSelector(
    (state) => state.receives
  );

  const [page, setPage] = useState(1);
  const [searchTerm, setSearchTerm] = useState("");
  const limit = 20;

  const fetchData = () => {
    dispatch(fetchReceives({ page, limit, search: searchTerm }))
      .unwrap()
      .catch((err) => toast.error(err));
  };

  useEffect(() => {
    fetchData();
  }, [dispatch, page, searchTerm]);

  const handleAddReceived = (data) => {
    return dispatch(addReceive(data))
      .unwrap()
      .then(() => {
        toast.success("Received added successfully");
        setPage(1);
        fetchData();
      })
      .catch((err) => {
        toast.error(err);
        throw err;
      });
  };

  const handleDeleteReceived = (id) => {
    return dispatch(deleteReceive(id))
      .unwrap()
      .then(() => {
        toast.success("Received deleted successfully");
        fetchData();
      })
      .catch((err) => {
        toast.error(err);
        throw err;
      });
  };

  const handleUpdateReceived = (updatedData) => {
    return dispatch(
      updateReceive({ id: updatedData.id, receiveData: updatedData })
    )
      .unwrap()
      .then(() => {
        toast.success("Received updated successfully");
        fetchData();
      })
      .catch((err) => {
        toast.error(err || "Failed to update received");
        throw err;
      });
  };

  return (
    <div className="flex flex-col w-full min-h-[calc(100vh-6rem)]">
      <Card>
        <CardHeader className="flex flex-row items-center justify-between py-4">
          <CardTitle>
            Received/Purchase List{" "}
            <Badge variant="outline" className="ml-2">
              {pagination.total}
            </Badge>
          </CardTitle>
          <AddReceivedModal
            onAddReceived={handleAddReceived}
            actionLoading={actionLoading}
          />
        </CardHeader>

        <CardContent className="space-y-4">
          <div className="relative max-w-sm">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
            <Input
              placeholder="Search purchases..."
              value={searchTerm}
              onChange={(e) => {
                setPage(1);
                setSearchTerm(e.target.value);
              }}
              className="pl-10"
            />
          </div>

          <ReceiveTable
            items={receives}
            pagination={pagination}
            isLoading={isLoading}
            onDeleteReceived={handleDeleteReceived}
            onUpdateReceived={handleUpdateReceived}
            actionLoading={actionLoading}
          />

          <CustomPagination
            total={pagination.total}
            page={page}
            limit={pagination.limit}
            onPageChange={setPage}
          />
        </CardContent>
      </Card>
    </div>
  );
};

export default Receives;
