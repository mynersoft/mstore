"use client";

import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchProducts, deleteProduct } from "@/redux/productSlice";
import { useRouter, useSearchParams } from "next/navigation";

import ProductFormModal from "@/components/ProductFormModal";
import CategoryForm from "@/components/CategoryForm";
import Modal from "@/components/Modal";
import { addCategory } from "@/redux/categorySlice";

export default function ProductsPage() {
    const dispatch = useDispatch();
    const { items, total, page: reduxPage, limit } = useSelector((s) => s.products);
    const router = useRouter();
    const searchParams = useSearchParams();

    const [pageLocal, setPageLocal] = useState(reduxPage || 1);
    const [showModal, setShowModal] = useState(false);
    const [showCatModal, setShowCatModal] = useState(false);
    const [editingProduct, setEditingProduct] = useState(null);

    // Initialize search from query param if present
    const initialSearch = searchParams?.get("search") || "";
    const [search, setSearch] = useState(initialSearch);
    const [filteredItems, setFilteredItems] = useState([]);

    // Fetch products when page changes
    useEffect(() => {
        dispatch(fetchProducts({ page: pageLocal, limit }));
    }, [dispatch, pageLocal, limit]);

    // Delete product
    const handleDelete = async (id) => {
        if (!confirm("Delete product?")) return;

        await dispatch(deleteProduct(id)).unwrap();
        dispatch(fetchProducts({ page: pageLocal, limit }));
    };

    // Search filter
    useEffect(() => {
        if (!Array.isArray(items)) {
            setFilteredItems([]);
            return;
        }

        const result = items.filter((p) => {
            const name = p?.name;
            if (!name) return false;
            if (!search) return true; // show all if search is empty
            return name.toLowerCase().includes(search.toLowerCase());
        });

        setFilteredItems(result);
    }, [items, search]);

    const totalPages = Math.max(1, Math.ceil((total || 0) / (limit || 1)));

    const handleCancel = () => setShowCatModal(false);

    const handleCatSubmit = (payload) => {
        dispatch(addCategory(payload));
        setShowCatModal(false);
        alert("Category added successfully!");
    };

    return (
        <div className="p-4 min-h-screen bg-gray-950 text-gray-300">
            {/* HEADER */}
            <div className="flex flex-col md:flex-row justify-between items-center gap-3 mb-6">
                <h1 className="text-2xl font-semibold">Products</h1>

                {/* SEARCH */}
                <input
                    type="text"
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    placeholder="Search by name..."
                    className="px-4 py-2 rounded bg-gray-800 w-full md:w-64 border border-gray-700 text-gray-300"
                />

                <div className="flex gap-2">
                    <button
                        onClick={() => { setEditingProduct(null); setShowModal(true); }}
                        className="bg-green-600 px-4 py-2 rounded"
                    >
                        + Add Product
                    </button>

                    <button
                        onClick={() => setShowCatModal(true)}
                        className="bg-green-600 px-4 py-2 rounded"
                    >
                        + Add Category
                    </button>

                    <button
                        onClick={() => router.push("/products/list")}
                        className="px-4 py-2 bg-blue-600 text-white rounded"
                    >
                        List
                    </button>
                </div>
            </div>

            {/* TABLE AND MOBILE VIEWS */}
            {/* Keep your existing table/mobile views using filteredItems */}

            {/* PRODUCT MODAL */}
            {showModal && (
                <ProductFormModal
                    open={showModal}
                    editingProduct={editingProduct}
                    onClose={() => {
                        setShowModal(false);
                        setEditingProduct(null);
                        dispatch(fetchProducts({ page: pageLocal, limit }));
                    }}
                />
            )}

            {/* CATEGORY MODAL */}
            <Modal show={showCatModal} onClose={handleCancel}>
                <h3 className="text-lg mb-4 font-semibold text-gray-100">Add Category</h3>
                <CategoryForm onCancel={handleCancel} onSubmit={handleCatSubmit} />
            </Modal>
        </div>
    );
}