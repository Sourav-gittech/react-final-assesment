import Swal from "sweetalert2";
import { endPoint_Cart, endPoint_User } from "../api/api_url/apiUrl";
import axiosInstance from "../api/axiosInstance/axiosInstance";
import { toast } from "react-toastify";

// Fetch All User 
const getAllUser = async () => {
    try {
        const res = await axiosInstance.get(endPoint_User);
        if (res.status === 200) {
            return res.data;
        } else {
            Swal.fire("Oops...", "Something went wrong!", "error");
            return [];
        }
    }
    catch (err) {
        console.log(err);
        return [];
    }
};

// Fetch logged user id
const fetchLoggedUser = async () => {
    try {
        const allUser = await getAllUser();
        const token = (sessionStorage.getItem("access-token") || "").trim();

        const findLoggedUser = allUser.find(user => user.token === token);
        // console.log("Logged user ", findLoggedUser);

        return findLoggedUser ? findLoggedUser.id : null;
    }
    catch (err) {
        console.log(err);
        return null;
    }
};

const getAllProductCart = async () => {
    try {
        const res = await axiosInstance.get(endPoint_Cart);
        return res.data;
    }
    catch (err) {
        console.log(err);
        return [];
    }
}

// Check if user already has a cart
const checkUserAccountInCart = async (loggedUserId) => {
    const cartItem = await getAllProductCart();
    return cartItem.find(cart => cart.user_id === loggedUserId);
}

const addToCart = async (product_id, stock_quantity, min_quantity, max_quantity) => {
    const loggedUserId = await fetchLoggedUser();

    if (!loggedUserId) {
        Swal.fire("Sorry", "You have to logged in first", "error");
        return;
    }

    if (Number.parseInt(stock_quantity) < Number.parseInt(min_quantity)) {
        Swal.fire("Sorry", "No More Stock Available", "info");
        return;
    }

    const userCart = await checkUserAccountInCart(loggedUserId);

    if (!userCart) {
        // Create a new cart for the user
        const newCartObj = {
            user_id: loggedUserId,
            product_details: [
                {
                    product_id: product_id,
                    quantity: Number.parseInt(min_quantity)
                }
            ]
        };

        try {
            const res = axiosInstance.post(endPoint_Cart, newCartObj)
                .then(res => {
                    if (res.status === 201) {
                        toast.success("Item added to cart");
                    }
                    else {
                        toast.error("Something went wrong!");
                    }
                })
                .catch(err => {
                    console.log(err);
                    Swal.fire("Oops...", "Something went wrong", "error");
                })
        } catch (err) {
            console.log(err);
            Swal.fire("Oops...", "Something went wrong", "error");
        }
    }
    else {
        // Check if product already exists in the user's cart
        const existingProduct = userCart.product_details.find(p => p.product_id === product_id);

        if (existingProduct) {
            // Update quantity if not max
            if (existingProduct.quantity >= max_quantity) {
                Swal.fire("Oops...", "You can purchase maximum "+max_quantity+" items", "info");
                return;
            }

            const updatedCart = {
                ...userCart,
                product_details: userCart.product_details.map(p =>
                    p.product_id === product_id
                        ? { ...p, quantity: p.quantity + 1 }
                        : p
                )
            }

            const checkStock = updatedCart.product_details.find(cartEle => cartEle.product_id === product_id);

            if (Number.parseInt(checkStock.quantity) > Number.parseInt(stock_quantity)) {
                Swal.fire("Oops...", "No more items available in stock", "info");
                return;
            }

            try {
                const specificCartUrl = endPoint_Cart + '/' + userCart.id;
                const res = axiosInstance.put(specificCartUrl, updatedCart)
                    .then(res => {
                        if (res.status === 200) {
                            toast.success("Item added to cart");
                        }
                        else {
                            toast.error("Something went wrong!");
                        }
                    })
                    .catch(err => {
                        console.log(err);
                        Swal.fire("Oops...", "Something went wrong", "error");
                    })
            } catch (err) {
                console.log(err);
                Swal.fire("Oops...", "Something went wrong", "error");
            }
        }
        else {
            // Add new product to existing user's cart
            const updatedCart = {
                ...userCart,
                product_details: [
                    ...userCart.product_details,
                    { product_id: product_id, quantity: Number.parseInt(min_quantity) }
                ]
            };

            try {
                const specificCartUrl = endPoint_Cart + '/' + userCart.id;
                const res = axiosInstance.put(specificCartUrl, updatedCart)
                    .then(res => {
                        if (res.status === 200) {
                            toast.success("Item added to cart");
                        }
                        else {
                            toast.error("Something went wrong!");
                        }
                    })
                    .catch(err => {
                        console.log(err);
                        Swal.fire("Oops...", "Something went wrong", "error");
                    })
            } catch (err) {
                console.log(err);
                Swal.fire("Oops...", "Something went wrong", "error");
            }
        }
    }
}

export default addToCart;