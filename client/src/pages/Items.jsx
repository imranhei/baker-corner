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
import { Input } from "@/components/ui/input";
import { useInfiniteScroll } from "@/hooks/useInfiniteScroll";
import { useDebounce } from "@/hooks/useDebounce";

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
  const limit = 20;

  // ✅ Debounce search
  const debouncedSearch = useDebounce(searchTerm, 400);

  // ✅ Reset page when search changes
  useEffect(() => {
    setPage(1);
  }, [debouncedSearch]);

  // ✅ Fetch items
  useEffect(() => {
    dispatch(fetchItems({ page, limit, search: debouncedSearch }))
      .unwrap()
      .catch((err) => {
        toast.error(err);
      });
  }, [dispatch, page, debouncedSearch]);

  // ✅ Fetch categories once
  useEffect(() => {
    dispatch(fetchCategories({ limit: 1000 }));
  }, [dispatch]);

  // ✅ Infinite scroll load more
  const loadMore = () => {
    if (!itemsLoading && pagination?.hasMore) {
      setPage((prev) => prev + 1);
    }
  };

  const lastElementRef = useInfiniteScroll(
    loadMore,
    pagination?.hasMore,
    itemsLoading,
  );

  // ✅ Handlers
  const handleAddItem = (newItem) => {
    return dispatch(addItem(newItem))
      .unwrap()
      .then(() => {
        setPage(1);
        toast.success("Item added successfully");
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
        toast.success("Item deleted successfully");
      })
      .catch((err) => {
        toast.error(err);
        throw err;
      });
  };

  const handleUpdateItem = (updatedData) => {
    return dispatch(updateItem({ id: updatedData.id, itemData: updatedData }))
      .unwrap()
      .then(() => {
        toast.success("Item updated successfully");
      })
      .catch((err) => {
        toast.error(err || "Failed to update item");
        throw err;
      });
  };

  return (
    <div className="flex flex-col w-full min-h-[calc(100vh-6rem)]">
      <Card>
        <CardHeader className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <CardTitle>Items List</CardTitle>

          <div className="flex gap-3 w-full md:w-auto">
            {/* 🔍 Search */}
            <Input
              placeholder="Search items..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full md:w-[250px]"
            />

            {/* ➕ Add */}
            <AddItemModal
              onAddItem={handleAddItem}
              actionLoading={actionLoading}
            />
          </div>
        </CardHeader>

        <CardContent>
          <ItemTable
            items={items}
            isLoading={itemsLoading}
            actionLoading={actionLoading}
            onDeleteItem={handleDeleteItem}
            onUpdateItem={handleUpdateItem}
            lastElementRef={lastElementRef}
          />

          {/* 🔄 Loader */}
          {itemsLoading && (
            <p className="text-center py-4 text-sm text-muted-foreground">
              Loading...
            </p>
          )}

          {/* 🚫 Empty State */}
          {!itemsLoading && items.length === 0 && (
            <p className="text-center py-4 text-sm text-muted-foreground">
              No items found
            </p>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default Items;
