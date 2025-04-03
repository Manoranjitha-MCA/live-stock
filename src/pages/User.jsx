import React, { useEffect, useState } from "react";
import { Layout, Menu, Button, message } from "antd";
import { db } from "../firebase";
import { ref, onValue, push, get, update } from "firebase/database";
import {
  ShoppingOutlined,
  ShoppingCartOutlined,
  FormOutlined,
  LogoutOutlined,
  PlusCircleOutlined,
  MinusCircleOutlined,
} from "@ant-design/icons";
import EnquiryForm from "../components/EnquiryForm";
import { useNavigate } from "react-router-dom";
import { toast, ToastContainer } from "react-toastify";

const { Sider, Content } = Layout;

const UserPage = ({ userPhone }) => {
  const [user, setUser] = useState(null);
  const [products, setProducts] = useState([]);
  const [cart, setCart] = useState([]);
  const [selectedMenu, setSelectedMenu] = useState("products");
  const navigate = useNavigate();
  useEffect(() => {
    // Fetch user details
    const userRef = ref(db, `users/${userPhone}`);
    get(userRef).then((snapshot) => {
      if (snapshot.exists()) {
        setUser(snapshot.val());
      }
    });

    // Fetch products
    const productsRef = ref(db, "products");
    onValue(productsRef, (snapshot) => {
      const data = snapshot.val();
      if (data) {
        setProducts(Object.keys(data).map((id) => ({ id, ...data[id] })));
      }
    });
  }, [userPhone]);

  const addToCart = (product) => {
    setCart((prev) => {
      const existingItem = prev.find((item) => item.id === product.id);
      if (existingItem) {
        return prev.map((item) =>
          item.id === product.id ? { ...item, quantity: item.quantity + 1 } : item
        );
      }
      return [...prev, { ...product, quantity: 1 }];
    });
    message.success(`${product.name} added to cart`);
  };

  const increaseQuantity = (id) => {
    setCart((prev) =>
      prev.map((item) => (item.id === id ? { ...item, quantity: item.quantity + 1 } : item))
    );
  };

  const decreaseQuantity = (id) => {
    setCart((prev) =>
      prev
        .map((item) => (item.id === id ? { ...item, quantity: item.quantity - 1 } : item))
        .filter((item) => item.quantity > 0) // Remove item if quantity reaches 0
    );
  };

  const purchaseProduct = () => {
    cart.forEach(async (item) => {
      const productRef = ref(db, `products/${item.id}`);
      const snapshot = await get(productRef);
      if (snapshot.exists()) {
        const product = snapshot.val();
        if (product.stock >= item.quantity) {
          await update(productRef, { stock: product.stock - item.quantity });
          toast.success(`Purchased ${item.name} successfully!`);
        } else {
          toast.error(`Not enough stock for ${item.name}`);
        }
      }
    });
    setCart([]);
  };

  return (
    <Layout style={{ minHeight: "100vh" }}>
      {/* Sidebar */}
      <Sider theme="dark" collapsible>
        <Menu
          theme="dark"
          mode="inline"
          selectedKeys={[selectedMenu]}
          onClick={(e) => setSelectedMenu(e.key)}
        >
          <Menu.Item key="products" icon={<ShoppingOutlined />}>
            Products
          </Menu.Item>
          <Menu.Item key="cart" icon={<ShoppingCartOutlined />}>
            Cart ({cart.length})
          </Menu.Item>
          <Menu.Item key="enquiry" icon={<FormOutlined />}>
            Enquiry
          </Menu.Item>
          <Menu.Item key="logout" icon={<LogoutOutlined />} onClick={()=> {navigate("/")}}>
            Logout
          </Menu.Item>
        </Menu>
      </Sider>

      {/* Main Content */}
      <Layout>
        <Content className="p-5">
          <h2 className="text-2xl font-semibold">Welcome, {user?.name} ({userPhone})</h2>

          {/* Product Section - Styled as a Gallery */}
          {selectedMenu === "products" && (
            <>
              <h2 className="text-xl font-semibold my-4">Products</h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                {products.map((product) => (
                  <div key={product.id} className="bg-white shadow-md p-4 rounded-lg">
                    <img
                      src={product.imageUrl}
                      alt={product.name}
                      className="w-full h-40 object-cover rounded-md"
                    />
                    <h3 className="text-lg font-medium mt-2">{product.name}</h3>
                    <p className="text-gray-600">₹{product.amount}</p>
                    <button
                      className="mt-2 w-full bg-blue-500 hover:bg-blue-600 text-white py-2 rounded-md flex items-center justify-center"
                      onClick={() => addToCart(product)}
                    >
                      <PlusCircleOutlined className="mr-2" /> Add to Cart
                    </button>
                  </div>
                ))}
              </div>
            </>
          )}

          {/* Cart Section */}
          {selectedMenu === "cart" && (
            <>
              <h2 className="text-xl font-semibold my-4">Shopping Cart</h2>
              {cart.length === 0 ? (
                <p className="text-gray-500">Your cart is empty.</p>
              ) : (
                <>
                  {cart.map((item) => (
                    <div key={item.id} className="bg-white shadow-md p-4 mb-2 rounded-lg flex justify-between items-center">
                      <div>
                        <h3 className="text-lg font-medium">{item.name}</h3>
                        <p className="text-gray-600">₹{item.amount} x {item.quantity}</p>
                      </div>
                      <div className="flex items-center">
                        <button
                          className="bg-red-500 hover:bg-red-600 text-white px-2 py-1 rounded-md"
                          onClick={() => decreaseQuantity(item.id)}
                        >
                          <MinusCircleOutlined />
                        </button>
                        <span className="px-3">{item.quantity}</span>
                        <button
                          className="bg-green-500 hover:bg-green-600 text-white px-2 py-1 rounded-md"
                          onClick={() => increaseQuantity(item.id)}
                        >
                          <PlusCircleOutlined />
                        </button>
                      </div>
                    </div>
                  ))}
                  <Button type="primary" className="w-full" onClick={purchaseProduct}>
                    Proceed to Payment
                  </Button>
                </>
              )}
            </>
          )}
          {selectedMenu === "enquiry" && <EnquiryForm userPhone={userPhone} />}
        </Content>
      </Layout>
      <ToastContainer/>
    </Layout>
  );
};

export default UserPage;
