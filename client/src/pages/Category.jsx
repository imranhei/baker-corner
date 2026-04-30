import React, { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import AddCategoryModal from "@/components/modal/AddCategoryModal";
import { useDispatch, useSelector } from "react-redux";
import {
  addCategory,
  deleteCategory,
  fetchCategories,
  updateCategory,
} from "@/redux/admin/category-slice";
import { toast } from "sonner";
import { CategoryTable } from "@/components/CategoryTable";
import { Search } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import CustomPagination from "@/components/CustomPagination";

const Category = () => {
  const dispatch = useDispatch();
  const { categories, pagination, isLoading, actionLoading } = useSelector(
    (state) => state.categories
  );

  const [page, setPage] = useState(1);
  const [searchTerm, setSearchTerm] = useState("");
  const limit = 20; // items per page

  useEffect(() => {
    dispatch(fetchCategories({ page, limit, search: searchTerm }))
      .unwrap()
      .catch((err) => {
        toast.error(err);
      });
  }, [dispatch, page, searchTerm]);

  const handleAddCategory = (categoryData) => {
    // Return the promise so modal can await
    return dispatch(addCategory(categoryData))
      .unwrap()
      .then(() => {
        toast.success("Category added successfully");
        setPage(1); // reset page
      })
      .catch((err) => {
        toast.error(err);
        throw err; // rethrow so modal stays open
      });
  };

  const handleDeleteCategory = (id) => {
    return dispatch(deleteCategory(id))
      .unwrap()
      .then(() => {
        toast.success("Category deleted successfully");
      })
      .catch((err) => {
        toast.error(err);
        throw err; // keep modal open on failure
      });
  };

  const handleUpdateCategory = ({ id, name }) => {
    // Return promise so modal can await
    return dispatch(updateCategory({ id, categoryData: { name } }))
      .unwrap()
      .then(() => {
        toast.success("Category updated successfully");
      })
      .catch((err) => {
        toast.error(err);
        throw err; // keep modal open if update fails
      });
  };

  return (
    <div className="flex flex-col w-full min-h-[calc(100vh-6rem)]">
      <Card>
        <CardHeader className="flex flex-row items-center justify-between py-4">
          <CardTitle>
            Category List{" "}
            <Badge variant="outline" className="ml-2">
              {pagination.totalAll}
            </Badge>
          </CardTitle>
          <AddCategoryModal
            onAddCategory={handleAddCategory}
            actionLoading={actionLoading}
          />
        </CardHeader>
        <CardContent className="space-y-4">
          {/* Search Filter */}
          <div className="relative max-w-sm">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
            <Input
              placeholder="Search categories..."
              value={searchTerm}
              onChange={(e) => {
                setPage(1); // reset to first page when searching
                setSearchTerm(e.target.value);
              }}
              className="pl-10"
            />
          </div>

          <CategoryTable
            categories={categories}
            pagination={pagination}
            isLoading={isLoading}
            searchTerm={searchTerm}
            setSearchTerm={setSearchTerm}
            onDeleteItem={handleDeleteCategory}
            onUpdateCategory={handleUpdateCategory}
            actionLoading={actionLoading}
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

export default Category;
