import { createSlice } from "@reduxjs/toolkit";
import { toast } from "react-hot-toast";


const initialState={
   totalItems:localStorage.getItem("totalItems")?JSON.parse(localStorage.getItem("totalItems")):0,
   cart:localStorage.getItem("cart") ? JSON.parse(localStorage.getItem("cart")) : [],
   total:localStorage.getItem("total") ? JSON.parse(localStorage.getItem("total")) : 0
}

const cartSlice=createSlice({
    name:'cart',
    initialState:initialState,
    reducers:{
        setTotalItems(state,value){
            state.totalItems=value.payload
        },

        //add to cart
        addToCart:(state,action) => {
            const course=action.payload;
            //find if the course is already present in cart
            const index = state.cart.findIndex((item)=> {
                return item._id===course._id;
            })

           
            if(index>=0){
            //course is already present in the cart then do not modify the quantity
                toast.error("Course is already in the cart");
                return ;
            }

            // if the course is not in the cart then add it to the cart
            state.cart.push(course);

            // Update the total quantity and price
            state.totalItems++;
            state.total+=course.price;

             // Update to localstorage
             localStorage.setItem("cart",JSON.stringify(state.cart));
             localStorage.setItem("totalItems",JSON.stringify(state.totalItems));
             localStorage.setItem("total",JSON.stringify(state.total));
            
             //show toast
                toast.success("Course added to the cart");
        },

        //remove from cart
        removeFromCart: (state,action) => {
            const courseId = action.payload;

            //check if the course is present in the cart
            const index = state.cart.findIndex((item)=>{
                return item._id===courseId;
            })

            if(index<0){
            //if course is not present in the cart then do nothing
                toast.error("Course is not present in the cart");
                return;
            }

            //if the course is present in the cart then remove it and update totalItems and price
            state.totalItems--;
            state.total-=state.cart[index].price;
            state.cart.splice(index,1);

            //update localstorage
            localStorage.setItem("cart", JSON.stringify(state.cart))
            localStorage.setItem("total", JSON.stringify(state.total))
            localStorage.setItem("totalItems", JSON.stringify(state.totalItems))

            // show toast
            toast.success("Course removed from cart")
        },
        //reset cart
        resetCart:(state)=>{
            state.cart=[];
            state.total=0;
            state.totalItems=0;

            //update local storage
            localStorage.removeItem("cart");
            localStorage.removeItem("total");
            localStorage.removeItem("totalItems");

        }
    }
})

export const {setTotalItems,addToCart,removeFromCart,resetCart} = cartSlice.actions;
export default cartSlice.reducer;