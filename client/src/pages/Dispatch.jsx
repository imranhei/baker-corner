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
import { useInfiniteScroll } from "@/hooks/useInfiniteScroll";
import { useDebounce } from "@/hooks/useDebounce";
import { resetDispatches } from "@/redux/admin/dispatch-slice";

const Dispatch = () => {
  const dispatch = useDispatch();
  const { dispatches, isLoading, isFetchingMore, actionLoading, pagination } =
    useSelector((state) => state.dispatches);

  const [page, setPage] = useState(1);
  const [searchTerm, setSearchTerm] = useState("");
  const debouncedSearch = useDebounce(searchTerm, 400);
  const limit = 20;

  useEffect(() => {
    dispatch(
      fetchDispatches({
        page,
        limit,
        q: debouncedSearch,
      }),
    )
      .unwrap()
      .catch((err) => toast.error(err));
  }, [dispatch, page, debouncedSearch]);

  useEffect(() => {
    setPage(1);
    dispatch(resetDispatches());
  }, [debouncedSearch]);

  const handleAddDispatch = (data) => {
    return dispatch(addDispatch(data))
      .unwrap()
      .then(() => {
        toast.success("Dispatch added successfully");
        dispatch(
          fetchDispatches({
            page: 1,
            limit,
            q: debouncedSearch,
          }),
        );

        setPage(1);
      })
      .catch((err) => {
        toast.error(err);
        throw err;
      });
  };

  const loadMore = () => {
    if (!isLoading && !isFetchingMore && pagination?.hasMore) {
      setPage((prev) => prev + 1);
    }
  };

  const lastElementRef = useInfiniteScroll(
    loadMore,
    pagination?.hasMore,
    isLoading || isFetchingMore,
  );

  const handleDeleteDispatch = (id) => {
    return dispatch(deleteDispatch(id))
      .unwrap()
      .then(() => {
        toast.success("Dispatch deleted successfully");

        dispatch(
          fetchDispatches({
            page: 1,
            limit,
            q: debouncedSearch,
          }),
        );

        setPage(1);
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
        dispatch(
          fetchDispatches({
            page: 1,
            limit,
            q: debouncedSearch,
          }),
        );

        setPage(1);
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
            Sale List{" "}
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
              placeholder="Search sale items..."
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
            isLoading={isLoading}
            onDeleteDispatch={handleDeleteDispatch}
            onUpdateDispatch={handleUpdateDispatch}
            actionLoading={actionLoading}
            lastElementRef={lastElementRef}
          />

          {isFetchingMore && (
            <div className="py-4 text-center text-sm text-muted-foreground">
              Loading more...
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default Dispatch;
