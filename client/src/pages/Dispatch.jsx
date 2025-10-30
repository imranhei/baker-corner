import React, { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { AddDispatchModal } from "@/components/modal/AddDispatchModal";
import { useDispatch, useSelector } from "react-redux";
import { toast } from "sonner";
import {
  fetchDispatches,
  addDispatch,
  deleteDispatch,
  updateDispatch,
} from "@/redux/admin/dispatch-slice";
import { DispatchTable } from "@/components/DispatchTable";
import { Search } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import CustomPagination from "@/components/CustomPagination";

const Dispatch = () => {
  const dispatch = useDispatch();
  const { dispatches, pagination, isLoading, actionLoading } = useSelector(
    (state) => state.dispatches
  );

  const [page, setPage] = useState(1);
  const [searchTerm, setSearchTerm] = useState("");
  const limit = 10;

  const fetchData = () => {
    dispatch(fetchDispatches({ page, limit, search: searchTerm }))
      .unwrap()
      .catch((err) => {
        toast.error(err);
      });
  };

  useEffect(() => {
    dispatch(fetchDispatches({ page, limit, search: searchTerm }))
      .unwrap()
      .catch((err) => {
        toast.error(err);
      });
  }, [dispatch, page, searchTerm]);

  const handleAddDispatch = (data) => {
    return dispatch(addDispatch(data))
      .unwrap()
      .then(() => {
        toast.success("Dispatch added successfully");
        setPage(1);
        fetchData();
      })
      .catch((err) => {
        toast.error(err);
        throw err;
      });
  };

  const handleDeleteDispatch = (id) => {
    return dispatch(deleteDispatch(id))
      .unwrap()
      .then(() => {
        toast.success("Dispatch deleted successfully");
        fetchData();
      })
      .catch((err) => {
        toast.error(err);
        throw err;
      });
  };

  const handleUpdateDispatch = (data) => {
    return dispatch(updateDispatch({ id: data.id, dispatchData: data }))
      .unwrap()
      .then(() => {
        toast.success("Dispatch updated successfully");
        fetchData();
      })
      .catch((err) => {
        toast.error(err);
        throw err;
      });
  };

  return (
    <div className="flex flex-col w-full min-h-[calc(100vh-6rem)]">
      <Card>
        <CardHeader className="flex flex-row items-center justify-between py-4">
          <CardTitle>
            Dispatch List{" "}
            <Badge variant="outline" className="ml-2">
              {pagination.total}
            </Badge>
          </CardTitle>
          <AddDispatchModal
            onAddDispatch={handleAddDispatch}
            actionLoading={actionLoading}
          />
        </CardHeader>
        <CardContent className="space-y-4">
          {/* Search Filter */}
          <div className="relative max-w-sm">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
            <Input
              placeholder="Search dispatched items..."
              value={searchTerm}
              onChange={(e) => {
                setPage(1);
                setSearchTerm(e.target.value);
              }}
              className="pl-10"
            />
          </div>

          <DispatchTable
            dispatches={dispatches}
            pagination={pagination}
            isLoading={isLoading}
            onDeleteDispatch={handleDeleteDispatch}
            onUpdateDispatch={handleUpdateDispatch}
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

export default Dispatch;
