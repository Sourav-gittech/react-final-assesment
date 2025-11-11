import React, { lazy, Suspense } from 'react'
import { Route, Routes, BrowserRouter as Router } from 'react-router-dom'
import Error_404 from '../components/Error_404'
import NavbarSection from '../layout/NavbarSection'
import Home from '../components/Home'
import FooterSection from '../layout/FooterSection'
import Category from '../components/category/Category'
import Products from '../components/category/products/Products'
import Profile from '../components/userHandler/Profile'
import AllCategory from '../components/admin/manageCategory/AllCategory'
import AllProducts from '../components/admin/manageProducts/AllProducts'
import CategoryWiseProduct from '../components/category/products/CategoryWiseProduct'
import ProductsDetails from '../components/category/products/productsDetails/ProductsDetails'
import Cart from '../components/cart/Cart'
import AddCategory from '../components/admin/manageCategory/AddCategory'
import EditCategory from '../components/admin/manageCategory/EditCategory'
import AddProduct from '../components/admin/manageProducts/AddProduct'
import EditProduct from '../components/admin/manageProducts/EditProduct'
import AllUser from '../components/admin/manageUser/AllUser'
import AddReview from '../components/category/products/productsDetails/AddReview'
import CategoryWiseProducts from '../components/admin/manageProducts/CategoryWiseProducts'
import GoLogin from '../components/GoLogin'
import { AdminPRoutes, ProtectLoginRoutes, ProtectRegisterRoutes, UserPRoutes } from './IsAuth'
import GoAdminLogin from '../components/admin/GoAdminLogin'
import StopLogin from '../components/StopLogin'
import Payment from '../components/cart/Payment'
import OrderDetails from '../components/cart/OrderDetails'
import EditProfile from '../components/userHandler/EditProfile'
import ChangePassword from '../components/userHandler/ChangePassword'
import { ToastContainer } from 'react-toastify'
import OrderInstruction from '../components/admin/manageOrderInstruction/OrderInstruction'
import UpdateOrderInstruction from '../components/admin/manageOrderInstruction/UpdateOrderInstruction'

const Reg = lazy(() => import('../components/userHandler/Register'))
const Log = lazy(() => import('../components/userHandler/Login'))

const Routing = () => {
    return (
        <Router>
            <ToastContainer />
            <NavbarSection />
            <Suspense fallback={<h3 className='mt-5 text-center' >Loading...</h3>}>
                <Routes>
                    <Route path='/' element={<Home />} />
                    <Route path='/products' element={<Products />} />
                    <Route path='/category' element={<Category />} />
                    <Route path='/category/:category_id/product' element={<CategoryWiseProduct />} />
                    <Route path='/category/:category_id/product/:product_id/product_details' element={<ProductsDetails />} />
                    <Route path='/go_login' element={<GoLogin />} />
                    <Route path='/go_admin_login' element={<GoAdminLogin />} />

                    <Route element={<ProtectRegisterRoutes />}>
                        <Route path='/signup/:user_type' element={<Reg />} />
                    </Route>
                    <Route element={<ProtectLoginRoutes />}>
                        <Route path='/signup/user' element={<Reg />} />
                        <Route path='/login' element={<Log />} />
                    </Route>

                    <Route element={<UserPRoutes />}>
                        <Route path='/profile' element={<Profile />} />
                        <Route path='/edit_profile/:user_id' element={<EditProfile />} />
                        <Route path='/change_password/:user_id' element={<ChangePassword />} />
                        <Route path='/cart' element={<Cart />} />
                        <Route path='/purchase/:cart_id' element={<Payment />} />
                        <Route path='/order_details/:user_id' element={<OrderDetails />} />
                        <Route path='/review/:product_id' element={<AddReview />} />
                        <Route path='/all_category/:category_id' element={<CategoryWiseProducts />} />
                        <Route path='/stop_login' element={<StopLogin />} />

                        <Route element={<AdminPRoutes />}>
                            <Route path='/all_category' element={<AllCategory />} />
                            <Route path='/add_category' element={<AddCategory />} />
                            <Route path='/edit_category/:category_id' element={<EditCategory />} />
                            <Route path='/all_products' element={<AllProducts />} />
                            <Route path='/add_product' element={<AddProduct />} />
                            <Route path='/edit_product/:product_id' element={<EditProduct />} />
                            <Route path='/all_members/:member_type' element={<AllUser />} />
                            <Route path='/instructions' element={<OrderInstruction />} />
                            <Route path='/instructions/update' element={<UpdateOrderInstruction />} />
                        </Route>
                    </Route>

                    <Route path='*' element={<Error_404 />} />
                </Routes>
                <FooterSection />
            </Suspense>
        </Router>
    )
}

export default Routing