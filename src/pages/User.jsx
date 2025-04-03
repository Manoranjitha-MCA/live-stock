import React, { useEffect, useState } from "react";
import { Layout, Menu, Button, message, Modal, Upload, Input, Table, Tag } from "antd";
import { db } from "../firebase";
import { ref, onValue, push, get, update, set } from "firebase/database";
import {
  ShoppingOutlined,
  ShoppingCartOutlined,
  FormOutlined,
  LogoutOutlined,
  PlusCircleOutlined,
  MinusCircleOutlined,
  UploadOutlined,
  LoadingOutlined,
  HistoryOutlined,
} from "@ant-design/icons";
import EnquiryForm from "../components/EnquiryForm";
import { useNavigate, useLocation } from "react-router-dom";
import { toast, ToastContainer } from "react-toastify";
import QRCode from "qrcode";

const { Sider, Content } = Layout;

const UserPage = () => {
  const [user, setUser] = useState(null);
  const [products, setProducts] = useState([]);
  const [cart, setCart] = useState([]);
  const [selectedMenu, setSelectedMenu] = useState("products");
  const [qrCodeURL, setQrCodeURL] = useState(null);
  const [showQrModal, setShowQrModal] = useState(false);
  const [showUploadModal, setShowUploadModal] = useState(false);
  const [totalAmount, setTotalAmount] = useState(0);
  const [paymentProof, setPaymentProof] = useState(null);
  const [uploadLoading, setUploadLoading] = useState(false);
  const [transactionId, setTransactionId] = useState("");
  const [fileList, setFileList] = useState([]);
  const [orders, setOrders] = useState([]);
  const [orderDetailsVisible, setOrderDetailsVisible] = useState(false);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const navigate = useNavigate();
  const locate = useLocation();
  const userPhone = locate.state?.phone;

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
    
    // Fetch user's orders
    const userOrdersRef = ref(db, `users/${userPhone}/orders`);
    onValue(userOrdersRef, (snapshot) => {
      const data = snapshot.val();
      if (data) {
        const ordersList = Object.keys(data).map((key) => ({
          key,
          ...data[key],
        }));
        setOrders(ordersList);
      }
    });
  }, [userPhone]);

  useEffect(() => {
    // Calculate total amount whenever cart changes
    const total = cart.reduce((sum, item) => sum + (item.amount * item.quantity), 0);
    setTotalAmount(total);
  }, [cart]);

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

  const generateUPIUrl = (upiId, name, amount, description) => {
    return `upi://pay?pa=${encodeURIComponent(upiId)}&pn=${encodeURIComponent(name)}&am=${amount}&cu=INR&tn=${encodeURIComponent(description)}`;
  };

  const generatePaymentQRCode = async () => {
    try {
      // Replace with your actual UPI ID
      const upiId = "your-upi-id@upi";
      const paymentUrl = generateUPIUrl(
        upiId,
        "Store Payment",
        totalAmount,
        "Purchase Payment"
      );
      const qrCodeUrl = await QRCode.toDataURL(paymentUrl);
      setQrCodeURL(qrCodeUrl);
      setShowQrModal(true);
    } catch (error) {
      console.error("QR Code Generation Failed:", error);
      toast.error("Failed to generate payment QR code");
    }
  };

  const proceedToPayment = () => {
    if (cart.length === 0) {
      toast.error("Your cart is empty");
      return;
    }
    
    generatePaymentQRCode();
  };

  const handlePaymentComplete = () => {
    setShowQrModal(false);
    setShowUploadModal(true);
  };

  // ImageKit upload handler
  const uploadToCloudinary = async (file) => {
    if (!file) {
      console.error("No file selected");
      return null;
    }
    
    setUploadLoading(true);
    
    const formData = new FormData();
    formData.append("file", file);
    formData.append("upload_preset", "payments"); // Replace with your Cloudinary upload preset
    
    try {
      const response = await fetch(`https://api.cloudinary.com/v1_1/da0uet3j4/image/upload`, {
        method: "POST",
        body: formData,
      });
      
      if (!response.ok) {
        throw new Error("Upload failed");
      }
      
      const data = await response.json();
      console.log("Uploaded Image URL:", data.secure_url);
      return data.secure_url; // Returns the URL of the uploaded image
    } catch (error) {
      console.error("Error uploading to Cloudinary:", error);
      return null;
    }
  };
  
  // Handle file before upload
  const beforeUpload = (file) => {
    const isImage = file.type.startsWith('image/');
    if (!isImage) {
      message.error('You can only upload image files!');
      return false;
    }
    
    const isLt2M = file.size / 1024 / 1024 < 2;
    if (!isLt2M) {
      message.error('Image must be smaller than 2MB!');
      return false;
    }
    
    return true;
  };

  // Handle file change in Upload component
  const handleFileChange = async (info) => {
    // Update fileList for UI
    let newFileList = [...info.fileList];
    newFileList = newFileList.slice(-1); // Keep only the latest file
    setFileList(newFileList);
    
    // Handle status changes
    const status = info.file.status;
    if (status === 'uploading') {
      return;
    }
    
    if (status === 'done') {
      // File is already uploaded by customRequest
      message.success(`${info.file.name} uploaded successfully.`);
    } else if (status === 'error') {
      message.error(`${info.file.name} upload failed.`);
    }
  };

  // Custom request function for Upload component
  const customRequest = async ({ file, onSuccess, onError }) => {
    try {
      setUploadLoading(true);
      const url = await uploadToCloudinary(file);
      
      if (url) {
        // Set the paymentProof state with the returned URL
        setPaymentProof(url);
        setUploadLoading(false);
        message.success(`${file.name} uploaded successfully.`);
        onSuccess({ url }, file);
      } else {
        setUploadLoading(false);
        onError(new Error('Upload failed'));
      }
    } catch (error) {
      setUploadLoading(false);
      onError(error);
    }
  };

  const saveOrder = async () => {
    if (!paymentProof) {
      message.error('Please upload payment proof');
      return;
    }
    
    if (!transactionId) {
      message.error('Please enter transaction ID');
      return;
    }
    
    try {
      setUploadLoading(true);
      
      // Create a unique order ID
      const orderId = `order_${Date.now()}`;
      
      // Prepare order data
      const orderData = {
        orderId,
        userId: userPhone,
        userName: user?.name,
        items: cart.map(item => ({
          id: item.id,
          name: item.name,
          quantity: item.quantity,
          price: item.amount,
          subtotal: item.amount * item.quantity
        })),
        totalAmount,
        paymentProof,
        transactionId,
        orderDate: new Date().toISOString(),
        status: 'pending' // Initial status
      };
      
      // Save to Firebase
      const orderRef = ref(db, `orders/${orderId}`);
      await set(orderRef, orderData);
      
      // Also save to user's orders
      const userOrderRef = ref(db, `users/${userPhone}/orders/${orderId}`);
      await set(userOrderRef, {
        orderId,
        totalAmount,
        orderDate: orderData.orderDate,
        status: 'pending'
      });
      
      setUploadLoading(false);
      setShowUploadModal(false);
      setCart([]);
      setPaymentProof(null);
      setTransactionId("");
      setFileList([]);
      
      toast.success('Order placed successfully!');
      // Switch to the orders tab to show the new order
      setSelectedMenu("orders");
    } catch (error) {
      setUploadLoading(false);
      console.error('Error saving order:', error);
      toast.error('Failed to place order. Please try again.');
    }
  };

  // Function to view order details
  const viewOrderDetails = async (orderId) => {
    try {
      const orderRef = ref(db, `orders/${orderId}`);
      const snapshot = await get(orderRef);
      
      if (snapshot.exists()) {
        setSelectedOrder(snapshot.val());
        setOrderDetailsVisible(true);
      } else {
        message.error("Order details not found");
      }
    } catch (error) {
      console.error("Error fetching order details:", error);
      message.error("Failed to fetch order details");
    }
  };

  // Order status tag color mapping
  const getStatusColor = (status) => {
    const statusColors = {
      pending: 'orange',
      processing: 'blue',
      shipped: 'cyan',
      delivered: 'green',
      cancelled: 'red',
    };
    return statusColors[status] || 'default';
  };

  // Columns for orders table
  const orderColumns = [
    {
      title: 'Order ID',
      dataIndex: 'orderId',
      key: 'orderId',
      render: (text) => <span className="font-medium">{text.substring(6, 14)}...</span>,
    },
    {
      title: 'Date',
      dataIndex: 'orderDate',
      key: 'orderDate',
      render: (text) => new Date(text).toLocaleDateString(),
    },
    {
      title: 'Amount',
      dataIndex: 'totalAmount',
      key: 'totalAmount',
      render: (amount) => `₹${amount}`,
    },
    {
      title: 'Status',
      dataIndex: 'status',
      key: 'status',
      render: (status) => (
        <Tag color={getStatusColor(status)}>
          {status.toUpperCase()}
        </Tag>
      ),
    },
    {
      title: 'Action',
      key: 'action',
      render: (_, record) => (
        <Button type="link" onClick={() => viewOrderDetails(record.orderId)}>
          View Details
        </Button>
      ),
    },
  ];

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
          <Menu.Item key="orders" icon={<HistoryOutlined />}>
            My Orders
          </Menu.Item>
          <Menu.Item key="enquiry" icon={<FormOutlined />}>
            Enquiry
          </Menu.Item>
          <Menu.Item key="logout" icon={<LogoutOutlined />} onClick={() => {navigate("/")}}>
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
                  <div className="bg-white shadow-md p-4 mb-4 rounded-lg">
                    <h3 className="text-lg font-medium">Total Amount</h3>
                    <p className="text-xl font-bold">₹{totalAmount}</p>
                  </div>
                  <Button type="primary" className="w-full" onClick={proceedToPayment}>
                    Proceed to Payment
                  </Button>
                </>
              )}
            </>
          )}

          {/* Orders Section */}
          {selectedMenu === "orders" && (
            <>
              <h2 className="text-xl font-semibold my-4">My Orders</h2>
              {orders.length === 0 ? (
                <div className="bg-white shadow-md p-8 rounded-lg text-center">
                  <p className="text-gray-500 mb-4">You haven't placed any orders yet.</p>
                  <Button 
                    type="primary" 
                    onClick={() => setSelectedMenu("products")}
                  >
                    Start Shopping
                  </Button>
                </div>
              ) : (
                <div className="bg-white shadow-md rounded-lg overflow-hidden">
                  <Table 
                    columns={orderColumns} 
                    dataSource={orders} 
                    pagination={{ pageSize: 5 }}
                    rowKey="orderId"
                  />
                </div>
              )}
            </>
          )}

          {selectedMenu === "enquiry" && <EnquiryForm userPhone={userPhone} />}
        </Content>
      </Layout>
      
      {/* QR Code Modal */}
      <Modal
        title="Scan QR Code to Pay"
        open={showQrModal}
        onCancel={() => setShowQrModal(false)}
        footer={[
          <Button key="cancel" onClick={() => setShowQrModal(false)}>
            Cancel
          </Button>,
          <Button key="complete" type="primary" onClick={handlePaymentComplete}>
            I've Completed Payment
          </Button>
        ]}
        centered
      >
        <div className="flex flex-col items-center">
          {qrCodeURL ? (
            <>
              <img src={qrCodeURL} alt="Payment QR Code" className="w-64 h-64 mb-4" />
              <p className="text-center mb-2">Total Amount: ₹{totalAmount}</p>
              <p className="text-center text-sm text-gray-500">
                Scan this QR code with any UPI app to make payment
              </p>
            </>
          ) : (
            <p>Generating QR code...</p>
          )}
        </div>
      </Modal>
      
      {/* Payment Proof Upload Modal */}
      <Modal
        title="Upload Payment Proof"
        open={showUploadModal}
        onCancel={() => setShowUploadModal(false)}
        footer={[
          <Button key="cancel" onClick={() => setShowUploadModal(false)}>
            Cancel
          </Button>,
          <Button
            key="submit"
            type="primary"
            loading={uploadLoading}
            onClick={saveOrder}
            disabled={!paymentProof || !transactionId}
          >
            Submit Order
          </Button>
        ]}
        centered
      >
        <div className="flex flex-col space-y-4 py-4">
          <div>
            <p className="mb-2 font-medium">Transaction ID</p>
            <Input
              placeholder="Enter UPI transaction ID"
              value={transactionId}
              onChange={(e) => setTransactionId(e.target.value)}
            />
          </div>
          
          <div>
            <p className="mb-2 font-medium">Payment Screenshot</p>
            <Upload
              name="file"
              listType="picture-card"
              fileList={fileList}
              beforeUpload={beforeUpload}
              onChange={handleFileChange}
              customRequest={customRequest}
              maxCount={1}
            >
              {fileList.length >= 1 ? null : (
                <div>
                  {uploadLoading ? <LoadingOutlined /> : <UploadOutlined />}
                  <div style={{ marginTop: 8 }}>Upload</div>
                </div>
              )}
            </Upload>
            {paymentProof && (
              <div className="mt-2 text-sm text-green-600">
                Payment proof uploaded successfully!
              </div>
            )}
          </div>
          
          <div className="text-sm text-gray-500">
            <p>Please upload a screenshot of your payment confirmation and provide the transaction ID for verification.</p>
          </div>
        </div>
      </Modal>
      
      {/* Order Details Modal */}
      <Modal
        title="Order Details"
        open={orderDetailsVisible}
        onCancel={() => setOrderDetailsVisible(false)}
        footer={[
          <Button key="close" onClick={() => setOrderDetailsVisible(false)}>
            Close
          </Button>
        ]}
        width={700}
      >
        {selectedOrder && (
          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <div>
                <h3 className="text-lg font-medium">Order #{selectedOrder.orderId.substring(6, 14)}</h3>
                <p className="text-gray-500">
                  Placed on {new Date(selectedOrder.orderDate).toLocaleString()}
                </p>
              </div>
              <Tag color={getStatusColor(selectedOrder.status)}>
                {selectedOrder.status.toUpperCase()}
              </Tag>
            </div>
            
            <div className="border-t border-b py-4">
              <h4 className="font-medium mb-2">Items</h4>
              <div className="space-y-2">
                {selectedOrder.items.map((item, index) => (
                  <div key={index} className="flex justify-between">
                    <div>
                      <span className="font-medium">{item.name}</span>
                      <span className="text-gray-500 ml-2">x{item.quantity}</span>
                    </div>
                    <span>₹{item.subtotal}</span>
                  </div>
                ))}
              </div>
            </div>
            
            <div className="flex justify-between font-medium">
              <span>Total Amount</span>
              <span>₹{selectedOrder.totalAmount}</span>
            </div>
            
            <div>
              <h4 className="font-medium mb-2">Payment Information</h4>
              <p>Transaction ID: {selectedOrder.transactionId}</p>
              <div className="mt-2">
                <p className="mb-1">Payment Proof:</p>
                <img 
                  src={selectedOrder.paymentProof} 
                  alt="Payment Proof" 
                  className="max-w-full h-auto max-h-60 rounded-md"
                />
              </div>
            </div>
            
            {selectedOrder.status === 'shipped' && selectedOrder.trackingInfo && (
              <div>
                <h4 className="font-medium mb-2">Tracking Information</h4>
                <p>Tracking ID: {selectedOrder.trackingInfo.id}</p>
                <p>Carrier: {selectedOrder.trackingInfo.carrier}</p>
                <p>Shipped Date: {new Date(selectedOrder.trackingInfo.date).toLocaleDateString()}</p>
              </div>
            )}
          </div>
        )}
      </Modal>
      
      <ToastContainer />
    </Layout>
  );
};

export default UserPage;

