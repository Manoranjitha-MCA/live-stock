import { Layout, Menu, Form, Input, Button, Table, Popconfirm, InputNumber, Select, Modal, Tabs, Tag, Image, Badge } from "antd";
import { 
  AppstoreOutlined, 
  LoginOutlined, 
  PhoneOutlined, 
  PictureOutlined, 
  UserOutlined, 
  ShoppingOutlined,
  CheckCircleOutlined,
  CloseCircleOutlined,
  ClockCircleOutlined,
  CarOutlined
} from "@ant-design/icons";
import { useState, useEffect } from "react";
import { db } from "../firebase";
import { ref, push, onValue, remove, update, get } from "firebase/database";
import { useNavigate } from "react-router-dom";

const { Header, Content, Sider } = Layout;
const { Option } = Select;
const { TabPane } = Tabs;

function AdminPage() {
  const [products, setProducts] = useState([]);
  const [users, setUsers] = useState([]);
  const [gallery, setGallery] = useState([]);
  const [orders, setOrders] = useState([]);
  const [editForm] = Form.useForm();
  const [productForm] = Form.useForm();
  const [galleryForm] = Form.useForm();
  const [shippingForm] = Form.useForm();
  const [editingKey, setEditingKey] = useState(null);
  const [selectedMenu, setSelectedMenu] = useState("1");
  const [enquiries, setEnquiries] = useState([]);
  const [orderDetailsVisible, setOrderDetailsVisible] = useState(false);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [shippingModalVisible, setShippingModalVisible] = useState(false);
  const [currentOrderId, setCurrentOrderId] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const productsRef = ref(db, "products");
    onValue(productsRef, (snapshot) => {
      const data = snapshot.val();
      setProducts(data ? Object.keys(data).map((key) => ({ id: key, ...data[key] })) : []);
    });

    const usersRef = ref(db, "users");
    onValue(usersRef, (snapshot) => {
      const data = snapshot.val();
      setUsers(data ? Object.keys(data).map((key) => ({ id: key, ...data[key] })) : []);
    });

    const galleryRef = ref(db, "gallery");
    onValue(galleryRef, (snapshot) => {
      const data = snapshot.val();
      setGallery(data ? Object.keys(data).map((key) => ({ id: key, url: data[key] })) : []);
    });

    const enquiriesRef = ref(db, "enquiries");
    onValue(enquiriesRef, (snapshot) => {
      const data = snapshot.val();
      setEnquiries(data ? Object.keys(data).map((key) => ({ id: key, ...data[key] })) : []);
    });

    // Fetch orders
    const ordersRef = ref(db, "orders");
    onValue(ordersRef, (snapshot) => {
      const data = snapshot.val();
      setOrders(data ? Object.keys(data).map((key) => ({ id: key, ...data[key] })) : []);
    });
  }, []);

  const addProduct = (values) => {
    push(ref(db, "products"), values);
    productForm.resetFields();
  };

  const deleteEnquiry = (id) => remove(ref(db, `enquiries/${id}`));
  const deleteProduct = (id) => remove(ref(db, `products/${id}`));
  const deleteUser = (id) => remove(ref(db, `users/${id}`));
  const deleteGalleryImage = (id) => remove(ref(db, `gallery/${id}`));

  const addGalleryImage = (values) => {
    push(ref(db, "gallery"), values.url);
    galleryForm.resetFields();
  };

  const editProduct = (record) => {
    editForm.setFieldsValue(record); // Pre-fill form with row data
    setEditingKey(record.id);
  };
 
  const saveProduct = async (id) => {
    try {
      const values = await editForm.validateFields(); // Validate fields before saving
      await update(ref(db, `products/${id}`), values); // Update Firestore
      setEditingKey(null); // Exit edit mode
    } catch (error) {
      console.error("Validation failed:", error);
    }
  };

  // View order details
  const viewOrderDetails = (order) => {
    setSelectedOrder(order);
    setOrderDetailsVisible(true);
  };

  // Update order status
  const updateOrderStatus = async (orderId, status) => {
    try {
      // Update in orders collection
      await update(ref(db, `orders/${orderId}`), { status });
      
      // Update in user's orders
      const order = orders.find(o => o.orderId === orderId);
      if (order && order.userId) {
        await update(ref(db, `users/${order.userId}/orders/${orderId}`), { status });
      }
      
      // Close modal if open
      setOrderDetailsVisible(false);
    } catch (error) {
      console.error("Error updating order status:", error);
    }
  };

  // Open shipping modal
  const openShippingModal = (orderId) => {
    setCurrentOrderId(orderId);
    setShippingModalVisible(true);
    shippingForm.resetFields();
  };

  // Process shipping
  const processShipping = async (values) => {
    try {
      const order = orders.find(o => o.orderId === currentOrderId);
      if (!order) return;

      // Update order with tracking info and change status to shipped
      await update(ref(db, `orders/${currentOrderId}`), {
        status: 'shipped',
        trackingInfo: {
          id: values.trackingId,
          carrier: values.carrier,
          date: new Date().toISOString()
        }
      });

      // Update in user's orders
      if (order.userId) {
        await update(ref(db, `users/${order.userId}/orders/${currentOrderId}`), {
          status: 'shipped'
        });
      }

      // Reduce stock for each item
      for (const item of order.items) {
        const productRef = ref(db, `products/${item.id}`);
        const snapshot = await get(productRef);
        if (snapshot.exists()) {
          const product = snapshot.val();
          const newStock = Math.max(0, product.stock - item.quantity);
          await update(productRef, { stock: newStock });
        }
      }

      setShippingModalVisible(false);
    } catch (error) {
      console.error("Error processing shipping:", error);
    }
  };

  // Get status tag color
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

  // Get status icon
  const getStatusIcon = (status) => {
    switch (status) {
      case 'pending':
        return <ClockCircleOutlined />;
      case 'processing':
        return <ClockCircleOutlined />;
      case 'shipped':
        return <CarOutlined />;
      case 'delivered':
        return <CheckCircleOutlined />;
      case 'cancelled':
        return <CloseCircleOutlined />;
      default:
        return null;
    }
  };

  const enquiryColumns = [
    { title: "Name", dataIndex: "name", key: "name" },
    { title: "Location", dataIndex: "location", key: "location" },
    {
      title: "Phone No",
      dataIndex: "phone",
      key: "phone",
      render: (phone) => (
        <Button type="link" icon={<PhoneOutlined />} onClick={() => window.open(`tel:${phone}`)}>
          {phone}
        </Button>
      ),
    },
    { title: "Looking For", dataIndex: "lookingFor", key: "lookingFor" },
    { title: "Remarks", dataIndex: "remarks", key: "remarks" },
    {
      title: "Actions",
      key: "actions",
      render: (_, record) => (
        <Popconfirm title="Delete this enquiry?" onConfirm={() => deleteEnquiry(record.id)}>
          <Button type="link" danger>Delete</Button>
        </Popconfirm>
      ),
    }
  ];
 
  const productColumns = [
    {
      title: "Name",
      dataIndex: "name",
      key: "name",
      render: (_, record) =>
        editingKey === record.id ? (
          <Form.Item name="name" rules={[{ required: true, message: "Enter name" }]}>
            <Input />
          </Form.Item>
        ) : (
          record.name
        ),
    },
    {
      title: "Stock",
      dataIndex: "stock",
      key: "stock",
      render: (_, record) =>
        editingKey === record.id ? (
          <Form.Item name="stock" rules={[{ required: true, message: "Enter no. of stock" }]}>
            <InputNumber/>
          </Form.Item>
        ) : (
          record.stock
        ),
    },
    {
      title: "Amount",
      dataIndex: "amount",
      key: "amount",
      render: (_, record) =>
        editingKey === record.id ? (
          <Form.Item name="amount" rules={[{ required: true, message: "Enter amount" }]}>
            <Input type="number" />
          </Form.Item>
        ) : (
          record.amount
        ),
    },
    {
      title: "Image URL",
      dataIndex: "imageUrl",
      key: "imageUrl",
      render: (_, record) =>
        editingKey === record.id ? (
          <Form.Item name="imageUrl" rules={[{ required: true, message: "Enter image URL" }]}>
            <Input />
          </Form.Item>
        ) : (
          record.imageUrl
        ),
    },
    {
      title: "Actions",
      key: "actions",
      render: (_, record) => (
        <>
          {editingKey === record.id ? (
            <Button onClick={() => saveProduct(record.id)} type="link">Save</Button>
          ) : (
            <Button onClick={() => editProduct(record)} type="link">Edit</Button>
          )}
          <Popconfirm title="Are you sure?" onConfirm={() => deleteProduct(record.id)}>
            <Button type="link" danger>Delete</Button>
          </Popconfirm>
        </>
      ),
    },
  ];
  
  const userColumns = [
    { title: "Name", dataIndex: "name", key: "name" },
    { title: "Contact", dataIndex: "phone", key: "phone" },
    {
      title: "Actions",
      key: "actions",
      render: (_, record) => (
        <Popconfirm title="Are you sure?" onConfirm={() => deleteUser(record.id)}>
          <Button type="link" danger>Delete</Button>
        </Popconfirm>
      ),
    },
  ];

  const orderColumns = [
    {
      title: "Order ID",
      dataIndex: "orderId",
      key: "orderId",
      render: (text) => <span>{text.substring(6, 14)}...</span>,
    },
    {
      title: "Customer",
      dataIndex: "userName",
      key: "userName",
    },
    {
      title: "Date",
      dataIndex: "orderDate",
      key: "orderDate",
      render: (text) => new Date(text).toLocaleDateString(),
      sorter: (a, b) => new Date(a.orderDate) - new Date(b.orderDate),
    },
    {
      title: "Amount",
      dataIndex: "totalAmount",
      key: "totalAmount",
      render: (amount) => `₹${amount}`,
      sorter: (a, b) => a.totalAmount - b.totalAmount,
    },
    {
      title: "Status",
      dataIndex: "status",
      key: "status",
      render: (status) => (
        <Tag icon={getStatusIcon(status)} color={getStatusColor(status)}>
          {status.toUpperCase()}
        </Tag>
      ),
      filters: [
        { text: 'Pending', value: 'pending' },
        { text: 'Processing', value: 'processing' },
        { text: 'Shipped', value: 'shipped' },
        { text: 'Delivered', value: 'delivered' },
        { text: 'Cancelled', value: 'cancelled' },
      ],
      onFilter: (value, record) => record.status === value,
    },
    {
      title: "Actions",
      key: "actions",
      render: (_, record) => (
        <div>
          <Button type="link" onClick={() => viewOrderDetails(record)}>
            View Details
          </Button>
          {record.status === 'pending' && (
            <Button 
              type="link" 
              onClick={() => updateOrderStatus(record.orderId, 'processing')}
            >
              Process
            </Button>
          )}
          {record.status === 'processing' && (
            <Button 
              type="link" 
              onClick={() => openShippingModal(record.orderId)}
            >
              Ship
            </Button>
          )}
          {record.status === 'shipped' && (
            <Button 
              type="link" 
              onClick={() => updateOrderStatus(record.orderId, 'delivered')}
            >
              Mark Delivered
            </Button>
          )}
          {(record.status === 'pending' || record.status === 'processing') && (
            <Popconfirm 
              title="Cancel this order?" 
              onConfirm={() => updateOrderStatus(record.orderId, 'cancelled')}
            >
              <Button type="link" danger>Cancel</Button>
            </Popconfirm>
          )}
        </div>
      ),
    },
  ];

  return (
    <Layout style={{ minHeight: "100vh" }}>
      <Sider collapsible>
        <Menu theme="dark" mode="inline" defaultSelectedKeys={["1"]} onClick={(e) => setSelectedMenu(e.key)}>
          <Menu.Item key="1" icon={<AppstoreOutlined />}>Add Products</Menu.Item>
          <Menu.Item key="2" icon={<PictureOutlined />}>Add Gallery</Menu.Item>
          <Menu.Item key="3" icon={<UserOutlined />}>Manage Users</Menu.Item>
          <Menu.Item key="4" icon={<PhoneOutlined />}>Enquiries</Menu.Item>
          <Menu.Item key="5" icon={<ShoppingOutlined />}>
            Orders
            <Badge 
              count={orders.filter(o => o.status === 'pending').length} 
              offset={[10, 0]}
              style={{ backgroundColor: '#f5222d' }}
            />
          </Menu.Item>
          <Menu.Item key="logout" icon={<LoginOutlined />} onClick={()=> {navigate("/")}}>
            Logout
          </Menu.Item>
        </Menu>
      </Sider>
      <Layout>
        <Header style={{ background: "#fff", padding: 0 }} />
        <Content style={{ margin: "16px" }}>
          {selectedMenu === "1" && (
            <>
              <h2>Manage Products</h2>
              <Form form={productForm} onFinish={addProduct} layout="inline">
                <Form.Item name="name" rules={[{ required: true, message: "Enter name" }]}>
                  <Input placeholder="Name" />
                </Form.Item>
                <Form.Item name="stock" rules={[{ required: true, message: "Enter no. stock" }]}>
                  <InputNumber placeholder="no. of stock" />
                </Form.Item>
                <Form.Item name="amount" rules={[{ required: true, message: "Enter amount" }]}>
                  <InputNumber placeholder="Amount" />
                </Form.Item>
                <Form.Item name="imageUrl" rules={[{ required: true, message: "Enter image URL" }]}>
                  <Input placeholder="Image URL" />
                </Form.Item>
                <Form.Item>
                  <Button type="primary" htmlType="submit">Add Product</Button>
                </Form.Item>
              </Form>
              <Form form={editForm} component={false}>
                    <Table dataSource={products} columns={productColumns} rowKey="id" />
                </Form>
            </>
          )}
          {selectedMenu === "2" && (
            <>
              <h2>Manage Gallery</h2>
              <Form form={galleryForm} onFinish={addGalleryImage} layout="inline">
                <Form.Item name="url" rules={[{ required: true, message: "Enter Image URL" }]}>
                  <Input placeholder="Image URL" />
                </Form.Item>
                <Form.Item>
                  <Button type="primary" htmlType="submit">Add Image</Button>
                </Form.Item>
              </Form>
              <Table dataSource={gallery} columns={[ { title: "Image URL", dataIndex: "url", key: "url" }, { title: "Actions", key: "actions", render: (_, record) => ( <Popconfirm title="Are you sure?" onConfirm={() => deleteGalleryImage(record.id)}> <Button type="link" danger>Delete</Button> </Popconfirm> ) } ]} rowKey="id" />
            </>
          )}
          {selectedMenu === "3" && (
            <>
              <h2>Manage Users</h2>
              <Table dataSource={users} columns={userColumns} rowKey="id" />
            </>
          )}
          {selectedMenu === "4" && (
            <>
              <h2>Enquiries</h2>
              <Table dataSource={enquiries} columns={enquiryColumns} rowKey="id" />
            </>
          )}
          {selectedMenu === "5" && (
            <>
              <h2>Manage Orders</h2>
              <Tabs defaultActiveKey="all">
                <TabPane tab={`All Orders (${orders.length})`} key="all">
                  <Table 
                    dataSource={orders} 
                    columns={orderColumns} 
                    rowKey="orderId"
                    pagination={{ pageSize: 10 }}
                  />
                </TabPane>
                <TabPane 
                  tab={
                    <Badge 
                      count={orders.filter(o => o.status === 'pending').length} 
                      style={{ backgroundColor: '#faad14' }}
                    >
                      <span>Pending</span>
                    </Badge>
                  } 
                  key="pending"
                >
                  <Table 
                    dataSource={orders.filter(o => o.status === 'pending')} 
                    columns={orderColumns} 
                    rowKey="orderId"
                    pagination={{ pageSize: 10 }}
                  />
                </TabPane>
                <TabPane 
                  tab={
                    <Badge 
                      count={orders.filter(o => o.status === 'processing').length} 
                      style={{ backgroundColor: '#1890ff' }}
                    >
                      <span>Processing</span>
                    </Badge>
                  } 
                  key="processing"
                >
                  <Table 
                    dataSource={orders.filter(o => o.status === 'processing')} 
                    columns={orderColumns} 
                    rowKey="orderId"
                    pagination={{ pageSize: 10 }}
                  />
                </TabPane>
                <TabPane 
                  tab={
                    <Badge 
                      count={orders.filter(o => o.status === 'shipped').length} 
                      style={{ backgroundColor: '#13c2c2' }}
                    >
                      <span>Shipped</span>
                    </Badge>
                  } 
                  key="shipped"
                >
                  <Table 
                    dataSource={orders.filter(o => o.status === 'shipped')} 
                    columns={orderColumns} 
                    rowKey="orderId"
                    pagination={{ pageSize: 10 }}
                  />
                </TabPane>
                <TabPane 
                  tab={
                    <Badge 
                      count={orders.filter(o => o.status === 'delivered').length} 
                      style={{ backgroundColor: '#52c41a' }}
                    >
                      <span>Delivered</span>
                    </Badge>
                  } 
                  key="delivered"
                >
                  <Table 
                    dataSource={orders.filter(o => o.status === 'delivered')} 
                    columns={orderColumns} 
                    rowKey="orderId"
                    pagination={{ pageSize: 10 }}
                  />
                </TabPane>
                <TabPane 
                  tab={
                    <Badge 
                      count={orders.filter(o => o.status === 'cancelled').length} 
                      style={{ backgroundColor: '#f5222d' }}
                    >
                      <span>Cancelled</span>
                    </Badge>
                  } 
                  key="cancelled"
                >
                  <Table 
                    dataSource={orders.filter(o => o.status === 'cancelled')} 
                    columns={orderColumns} 
                    rowKey="orderId"
                    pagination={{ pageSize: 10 }}
                  />
                </TabPane>
              </Tabs>
            </>
          )}
        </Content>
      </Layout>

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
              <div className="flex items-center">
                <Tag color={getStatusColor(selectedOrder.status)}>
                  {selectedOrder.status.toUpperCase()}
                </Tag>
                <Select 
                  style={{ width: 140, marginLeft: 8 }} 
                  placeholder="Update Status"
                  onChange={(value) => updateOrderStatus(selectedOrder.orderId, value)}
                >
                  <Option value="pending">Pending</Option>
                  <Option value="processing">Processing</Option>
                  <Option value="shipped">Shipped</Option>
                  <Option value="delivered">Delivered</Option>
                  <Option value="cancelled">Cancelled</Option>
                </Select>
              </div>
            </div>
            
            <div className="border-t border-b py-4">
              <h4 className="font-medium mb-2">Customer Information</h4>
              <p>Name: {selectedOrder.userName}</p>
              <p>Phone: {selectedOrder.userId}</p>
            </div>
            
            <div className="border-b py-4">
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
              <div className="flex justify-between font-medium mt-4">
                <span>Total Amount</span>
                <span>₹{selectedOrder.totalAmount}</span>
              </div>
            </div>
            
            <div className="border-b py-4">
              <h4 className="font-medium mb-2">Payment Information</h4>
              <p>Transaction ID: {selectedOrder.transactionId}</p>
              <div className="mt-2">
                <p className="mb-1">Payment Proof:</p>
                <Image 
                  src={selectedOrder.paymentProof} 
                  alt="Payment Proof" 
                  style={{ maxWidth: '100%', maxHeight: '300px' }}
                />
              </div>
            </div>
            
            {selectedOrder.trackingInfo && (
              <div className="py-4">
                <h4 className="font-medium mb-2">Shipping Information</h4>
                <p>Tracking ID: {selectedOrder.trackingInfo.id}</p>
                <p>Carrier: {selectedOrder.trackingInfo.carrier}</p>
                <p>Shipped Date: {new Date(selectedOrder.trackingInfo.date).toLocaleDateString()}</p>
              </div>
            )}
            
            <div className="flex justify-end space-x-2 mt-4">
              {selectedOrder.status === 'pending' && (
                <Button 
                  type="primary" 
                  onClick={() => updateOrderStatus(selectedOrder.orderId, 'processing')}
                >
                  Process Order
                </Button>
              )}
              {selectedOrder.status === 'processing' && (
                <Button 
                  type="primary" 
                  onClick={() => {
                    setOrderDetailsVisible(false);
                    openShippingModal(selectedOrder.orderId);
                  }}
                >
                  Ship Order
                </Button>
              )}
              {selectedOrder.status === 'shipped' && (
                <Button 
                  type="primary" 
                  onClick={() => updateOrderStatus(selectedOrder.orderId, 'delivered')}
                >
                  Mark as Delivered
                </Button>
              )}
              {(selectedOrder.status === 'pending' || selectedOrder.status === 'processing') && (
                <Popconfirm 
                  title="Are you sure you want to cancel this order?" 
                  onConfirm={() => updateOrderStatus(selectedOrder.orderId, 'cancelled')}
                >
                  <Button danger>Cancel Order</Button>
                </Popconfirm>
              )}
            </div>
          </div>
        )}
      </Modal>

      {/* Shipping Modal */}
      <Modal
        title="Ship Order"
        open={shippingModalVisible}
        onCancel={() => setShippingModalVisible(false)}
        footer={null}
      >
        <Form 
          form={shippingForm} 
          layout="vertical" 
          onFinish={processShipping}
        >
          <Form.Item
            name="trackingId"
            label="Tracking ID"
            rules={[{ required: true, message: 'Please enter tracking ID' }]}
          >
            <Input placeholder="Enter tracking number" />
          </Form.Item>
          <Form.Item
            name="carrier"
            label="Shipping Carrier"
            rules={[{ required: true, message: 'Please select carrier' }]}
          >
            <Select placeholder="Select shipping carrier">
              <Option value="DTDC">DTDC</Option>
              <Option value="Delhivery">Delhivery</Option>
              <Option value="BlueDart">BlueDart</Option>
              <Option value="FedEx">FedEx</Option>
              <Option value="IndiaPost">India Post</Option>
              <Option value="Other">Other</Option>
            </Select>
          </Form.Item>
          <Form.Item className="mb-0">
            <div className="flex justify-end space-x-2">
              <Button onClick={() => setShippingModalVisible(false)}>
                Cancel
              </Button>
              <Button type="primary" htmlType="submit">
                Ship Order
              </Button>
            </div>
          </Form.Item>
        </Form>
      </Modal>
    </Layout>
  );
}

export default AdminPage;

