import React from "react";
import reducer from "../reducers/products_reducer";
import axios from "axios";
import {products_url} from "../utils/constants";
import {single_product_url} from "../utils/constants";


const ProductsContext=React.createContext();

const initialState={
    //sidebar
    isSidebarOpen: false,
    //products
    products_loading: false,
    products_error: false,
    products: [],
    featured_products: [],
    //single product
    single_product_loading: false,
    single_product_error: false,
    single_product: {},
    //view and sort
    grid_view: true,
    sort: "price-lowest",
    //filters
    filters: {
        text: "",
        company: "all",
        category: "all",
        color: "all",
        min_price: 0,
        max_price: 0,
        price: 0,
        shipping: false
    } 
};

const ProductsProvider = ({children}) => {
    const[state, dispatch]=React.useReducer(reducer, initialState);

    //sidebar
    const openSidebar = () => {
        dispatch({type: "SIDEBAR_OPEN"})
    }

    const closeSidebar = () => {
        dispatch({type: "SIDEBAR_CLOSE"})
    }

    
    //get all products
    const fetchProducts = async () => {
        dispatch({type: "GET_PRODUCTS_BEGIN"});
        try {
            const response = await axios.get(products_url);
            const products = await response.data;
            //console.log(products);
            //console.log(initialState.featured_products);
            //console.log(initialState.products);
            dispatch({type: "GET_PRODUCTS_SUCCESS", payload: products})
        } catch (error) {
            dispatch({type: "GET_PRODUCTS_ERROR"})
        }
    }

    React.useEffect(() => {
        fetchProducts();
    }, [])

    //get single product
    const fetchSingleProduct = async (single_product_url) => {
        dispatch({type: "GET_SINGLE_PRODUCT_BEGIN"});
        try {
            const response = await axios.get(single_product_url);
            const product = await response.data;
            console.log(product);
            dispatch({type: "GET_SINGLE_PRODUCT_SUCCESS", payload: product})
        } catch (error) {
            dispatch({type: "GET_SINGLE_PRODUCT_ERROR"})
        }
    } 

    //grid view and list view
    const gridView = () => {
        dispatch({type: "GRID_VIEW"})
    }

    const listView = () => {
        dispatch({type: "LIST_VIEW"})
    }

    //sort
    const updateSort = (e) => {
        let value = e.target.value;
        dispatch({type: "UPDATE_SORT", payload: value})
    
        // SORT_PRODUCTS logic here
        let tempProducts = [...state.products];
        if (value === "price-lowest") {
            tempProducts = tempProducts.sort((a, b) => a.price - b.price);
        }
        if (value === "price-highest") {
            tempProducts = tempProducts.sort((a, b) => b.price - a.price);
        }
        if (value === "name-a") {
            tempProducts = tempProducts.sort((a, b) => a.name.localeCompare(b.name));
        }
        if (value === "name-z") {
            tempProducts = tempProducts.sort((a, b) => b.name.localeCompare(a.name));
        }
        dispatch({type: "SORT_PRODUCTS", payload: tempProducts})
    }
 

    //filtering
    const updateFilters = (e) => {
        let name=e.target.name;
        let value=e.target.value;
        console.log(name, value);
        if (name === 'category') {
            value = e.target.textContent
          }
          if (name === 'color') {
            value = e.target.dataset.color
          }
          if (name === 'price') {
            value = Number(value)
          }
          if (name === 'shipping') {
            value = e.target.checked
          }
        dispatch({type: "UPDATE_FILTERS", payload: {name, value}})
    }
    

    React.useEffect(() => {
        dispatch({type: "FILTER_PRODUCTS"})
    }, [])

    const clearFilters = () => {
        //dispatch({ type: CLEAR_FILTERS })
    }


    React.useEffect(() => {
        dispatch({type: "FILTER_PRODUCTS"})
        console.log("filtering products");
    }, [state.products, state.sort, state.filters])
    

    


    return <ProductsContext.Provider value={{
        ...state, 
        openSidebar, 
        closeSidebar,
        products_loading: state.products_loading,
        products: state.products,
        products_error: state.products_error,
        fetchSingleProduct,
        featured_products: state.featured_products,
        ingle_product_loading: state.ingle_product_loading,
        ingle_product_error: state.ingle_product_error,
        single_product: state.single_product,
        //grid-list view, sort 
        grid_view: state.grid_view,
        gridView,
        listView,
        updateSort,
        //filters
        updateFilters,
        clearFilters
        }}>
    {children}
    </ProductsContext.Provider>
}

export {ProductsContext, ProductsProvider}

export const useProductsContext=() => {
    return React.useContext(ProductsContext);
}