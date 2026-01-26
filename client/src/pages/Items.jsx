import React, { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { AddItemModal } from "@/components/modal/AddItemModal";
import { useDispatch, useSelector } from "react-redux";
import { toast } from "sonner";
import {
  fetchItems,
  addItem,
  deleteItem,
  updateItem,
} from "@/redux/admin/item-slice";
import { ItemTable } from "@/components/ItemTable";
import { fetchCategories } from "@/redux/admin/category-slice";
import CustomPagination from "@/components/CustomPagination";

const Items = () => {
  const dispatch = useDispatch();
  const {
    items,
    pagination,
    isLoading: itemsLoading,
    actionLoading,
  } = useSelector((state) => state.items);

  const [page, setPage] = useState(1);
  const [searchTerm, setSearchTerm] = useState("");
  const limit = 10;

  const handleAddItem = (newItem) => {
    return dispatch(addItem(newItem))
      .unwrap()
      .then(() => {
        fetchData();
        toast.success("Item added successfully");
        setPage(1);
      })
      .catch((err) => {
        toast.error(err);
        throw err;
      });
  };

  const handleDeleteItem = (id) => {
    return dispatch(deleteItem(id))
      .unwrap()
      .then(() => {
        fetchData();
        toast.success("Item deleted successfully");
      })
      .catch((err) => {
        toast.error(err);
        throw err; // keep modal open on failure
      });
  };

  const handleUpdateItem = (updatedData) => {
    return dispatch(updateItem({ id: updatedData.id, itemData: updatedData }))
      .unwrap()
      .then(() => {
        fetchData();
        toast.success("Item updated successfully");
      })
      .catch((err) => {
        toast.error(err || "Failed to update item");
        throw err; // Keep modal open if update fails
      });
  };

  const fetchData = () => {
    dispatch(fetchItems({ page, limit, search: searchTerm }))
      .unwrap()
      .catch((err) => {
        toast.error(err);
      });
  };

  useEffect(() => {
    fetchData();
  }, [dispatch, page, searchTerm]);

  useEffect(() => {
    dispatch(fetchCategories({ limit: 1000 }));
  }, [dispatch]);

  return (
    <div className="flex flex-col w-full min-h-[calc(100vh-6rem)]">
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle>Items List</CardTitle>
          <AddItemModal
            onAddItem={handleAddItem}
            actionLoading={actionLoading}
          />
        </CardHeader>
        <CardContent>
          <ItemTable
            items={items}
            pagination={pagination}
            isLoading={itemsLoading}
            searchTerm={searchTerm}
            setSearchTerm={setSearchTerm}
            actionLoading={actionLoading}
            onDeleteItem={handleDeleteItem}
            onUpdateItem={handleUpdateItem}
          />

          {/* Pagination */}
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

export default Items;
