'use client';

import { useQuery, useQueryClient, useMutation } from '@tanstack/react-query';

import axios from 'axios';
import { useEffect } from 'react';
import { useDispatch } from 'react-redux';
import {
	setProducts,
	addProduct,
	removeProduct,
	updateProduct,
} from '../redux/store/slices/productSlice';

import toast from 'react-hot-toast';

/* =========================================================
   FETCH PRODUCTS
========================================================= */

export function useProducts() {
	const dispatch = useDispatch();

	const query = useQuery({
		queryKey: ['products'],

		queryFn: async () => {
			const res = await axios.get('/api/products');

			if (!res.data?.success) {
				throw new Error(
					res.data?.message || 'Failed to fetch products'
				);
			}

			// API returns:
			// {
			//   success: true,
			//   products: [...]
			// }

			return res.data.products || [];
		},

		staleTime: 1000 * 60 * 5,

		refetchOnWindowFocus: false,

		retry: 1,
	});

	/* -----------------------------------------
     Sync React Query → Redux
  ----------------------------------------- */

	useEffect(() => {
		if (query.data) {
			dispatch(setProducts(query.data));
		}
	}, [query.data, dispatch]);

	/* -----------------------------------------
     Error Toast
  ----------------------------------------- */

	useEffect(() => {
		if (query.isError) {
			toast.error(
				`Failed to fetch products: ${
					query.error?.message || 'Something went wrong'
				}`
			);
		}
	}, [query.isError, query.error]);

	return query;
}

/* =========================================================
   ADD PRODUCT
========================================================= */

export function useAddProduct() {
	const queryClient = useQueryClient();
	const dispatch = useDispatch();

	return useMutation({
		mutationFn: async (productData) => {
			const res = await axios.post('/api/products', productData);

			if (!res.data?.success) {
				throw new Error(res.data?.message || 'Failed to add product');
			}

			return res.data.product;
		},

		onMutate: () => {
			toast.loading('Adding product...', {
				id: 'add-product',
			});
		},

		onSuccess: (newProduct) => {
			/* Update Redux immediately */
			dispatch(addProduct(newProduct));

			/* Refresh React Query cache */
			queryClient.invalidateQueries({
				queryKey: ['products'],
			});

			toast.success('Product added successfully!', {
				id: 'add-product',
			});
		},

		onError: (error) => {
			let message = 'Failed to add product';

			if (axios.isAxiosError(error)) {
				message =
					error.response?.data?.message ||
					error.response?.data?.error ||
					error.message;
			} else if (error instanceof Error) {
				message = error.message;
			}

			toast.error(message, {
				id: 'add-product',
			});
		},
	});
}

/* =========================================================
   DELETE PRODUCT
========================================================= */

export function useDeleteProduct() {
	const queryClient = useQueryClient();
	const dispatch = useDispatch();

	return useMutation({
		mutationFn: async (id) => {
			if (!id) {
				throw new Error('Product ID is required');
			}

			const res = await axios.delete(`/api/products/id/${id}`);

			if (!res.data?.success) {
				throw new Error(
					res.data?.message || 'Failed to delete product'
				);
			}

			return res.data;
		},

		onMutate: () => {
			toast.loading('Deleting product...', {
				id: 'delete-product',
			});
		},

		onSuccess: (_, id) => {
			/* Remove from Redux immediately */
			dispatch(removeProduct(id));

			/* Refresh React Query */
			queryClient.invalidateQueries({
				queryKey: ['products'],
			});

			toast.success('Product deleted successfully!', {
				id: 'delete-product',
			});
		},

		onError: (error) => {
			let message = 'Failed to delete product';

			if (axios.isAxiosError(error)) {
				message =
					error.response?.data?.message ||
					error.response?.data?.error ||
					error.message;
			} else if (error instanceof Error) {
				message = error.message;
			}

			toast.error(message, {
				id: 'delete-product',
			});
		},
	});
}

/* =========================================================
   UPDATE PRODUCT
========================================================= */

export function useUpdateProduct() {
	const queryClient = useQueryClient();
	const dispatch = useDispatch();

	return useMutation({
		mutationFn: async ({ id, data }) => {
			if (!id) {
				throw new Error('Product ID is required');
			}

			const res = await axios.put(`/api/products/id/${id}`, data);

			if (!res.data?.success) {
				throw new Error(
					res.data?.message || 'Failed to update product'
				);
			}

			return res.data.product;
		},

		onMutate: () => {
			toast.loading('Updating product...', {
				id: 'update-product',
			});
		},

		onSuccess: (updatedProduct) => {
			/* Update Redux immediately */
			dispatch(updateProduct(updatedProduct));

			/* Refresh React Query */
			queryClient.invalidateQueries({
				queryKey: ['products'],
			});

			toast.success('Product updated successfully!', {
				id: 'update-product',
			});
		},

		onError: (error) => {
			let message = 'Failed to update product';

			if (axios.isAxiosError(error)) {
				message =
					error.response?.data?.message ||
					error.response?.data?.error ||
					error.message;
			} else if (error instanceof Error) {
				message = error.message;
			}

			toast.error(message, {
				id: 'update-product',
			});
		},
	});
}
